import { FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { IPaginate } from '../../../shared/interfaces/paginate.interface';
import { BaseQueryParametersDto } from '../../../shared/dto/base-query-parameters.dto';

export abstract class Service<
  T extends ObjectLiteral,
  R extends ObjectLiteral,
> {
  public relations: Array<string> = [];

  protected constructor(
    relations: Array<string>,
    protected repository: Repository<T>,
  ) {
    this.relations = relations;
  }

  public transformBefore(response: R): T {
    const data = response as ObjectLiteral;
    return data as T;
  }
  public async save(response: R, find: FindOptionsWhere<T>): Promise<T> {
    await this.repository.save(this.transformBefore(response));
    return await this.repository.findOne({
      where: find,
    });
  }

  public async index(
    query: BaseQueryParametersDto,
  ): Promise<Array<T> | IPaginate<T>> {
    query.page = +query.page || 0;
    query.limit = +query.limit || 0;
    if (query.page === 0 && query.limit === 0) {
      return await this.repository.find({
        relations: this.relations,
      });
    }

    return await this.paginate(query);
  }

  public async show(param: string): Promise<T> {
    const entity = {} as ObjectLiteral;
    if (!isUUID(param)) {
      throw new BadRequestException('Invalid UUID');
    }
    entity.id = param;
    return await this.repository.findOne({
      where: { id: entity.id },
      relations: this.relations,
    });
  }

  public async create(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }

  public async paginate(query: BaseQueryParametersDto): Promise<IPaginate<T>> {
    const paginate = await this.initPaginate(query.page, query.limit);
    paginate.data = await this.repository.find({
      skip: paginate.skip,
      take: paginate.perPage,
      relations: this.relations,
    });
    return paginate;
  }

  public paginateSkip(currentPage: number, perPage: number): number {
    if (currentPage === 1) {
      return 0;
    }
    if (currentPage === 2) {
      return perPage;
    }
    return currentPage * perPage - perPage;
  }

  private async initPaginate(
    page: number,
    limit: number,
  ): Promise<IPaginate<T>> {
    const currentPage = page === 0 ? 1 : page;
    const skip = this.paginateSkip(currentPage, limit);
    const total = await this.repository.count();
    const pages = Math.ceil(total / limit);
    return {
      data: [],
      next: currentPage === pages ? null : currentPage + 1,
      prev: currentPage === 1 ? null : currentPage - 1,
      total,
      pages,
      perPage: limit === 0 ? total : limit,
      currentPage,
      skip,
    };
  }
}
