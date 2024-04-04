import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { type IResponsePokemonBase, PokemonApi } from '@api/pokemon';
import { Service } from '@services/abstract/service/service';
import type { IPaginate } from '../../../shared/interfaces/paginate.interface';

import { PokemonBase } from './pokemon-base.entity';
import type { IPokemonBase } from './pokemon-base.interface';

@Injectable()
export class PokemonBaseService extends Service<
  PokemonBase,
  IResponsePokemonBase
> {
  constructor(
    @InjectRepository(PokemonBase)
    protected repository: Repository<PokemonBase>,
  ) {
    super([], repository);
  }

  async list(): Promise<Array<PokemonBase>> {
    return await this.repository.find();
  }

  async total(): Promise<number> {
    return await this.repository.count();
  }

  transformBefore(response: IResponsePokemonBase): PokemonBase {
    const entity = new PokemonBase();
    entity.name = response.name;
    entity.url = response.url;
    entity.order = response.order;
    entity.createdAt = new Date();
    return entity;
  }

  async generate(): Promise<IPaginate<IPokemonBase> | Array<IPokemonBase>> {
    const totalPokemons = 1302;
    const result = await this.repository.findAndCount();
    if (result[1] === totalPokemons) {
      return await this.index({ page: 0, limit: 0, sort: 'ASC' });
    }

    const api = new PokemonApi();
    const response = await api.list(0, totalPokemons);
    if (!response) {
      throw new InternalServerErrorException(
        'Error When Querying External Api Please Try Again Later!',
      );
    }

    const data = await Promise.all(
      response.results.map(async (item) => {
        return await this.save(item, { name: item.name });
      }),
    );

    return this.generatePaginate(1, data.length, data);
  }

  private async generatePaginate(
    page: number,
    limit: number,
    data: Array<any>,
  ): Promise<IPaginate<any>> {
    const skip = this.paginateSkip(page, limit);
    return {
      skip: skip,
      next: null,
      prev: null,
      total: data.length,
      pages: 1,
      perPage: limit,
      currentPage: page,
      data: data,
    };
  }
}
