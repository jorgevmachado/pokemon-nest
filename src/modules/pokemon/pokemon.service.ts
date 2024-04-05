import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { isUUID } from 'class-validator';
import { Repository } from 'typeorm';

import {
  type IResponsePokemon,
  IResponseSpecie,
  PokemonApi,
} from '@api/pokemon';
import { Service } from '@services/abstract/service/service';
import type { IPaginate } from '../../shared/interfaces/paginate.interface';

import { type IPokemonBase, PokemonBase, PokemonBaseService } from './base';
import { TypeService } from './type';
import { Pokemon } from './pokemon.entity';
import { StatService } from './stat';
import { MoveService } from './move';
import { AbilityService } from './ability';
import { BaseQueryParametersDto } from '../../shared/dto/base-query-parameters.dto';

@Injectable()
export class PokemonService extends Service<Pokemon, IResponsePokemon> {
  constructor(
    @InjectRepository(Pokemon)
    protected repository: Repository<Pokemon>,
    protected baseService: PokemonBaseService,
    protected typeService: TypeService,
    protected statService: StatService,
    protected moveService: MoveService,
    protected abilityService: AbilityService,
  ) {
    super(['moves', 'stats', 'types', 'abilities'], repository);
  }

  async index(
    query: BaseQueryParametersDto,
  ): Promise<Array<Pokemon> | IPaginate<Pokemon>> {
    const save = query.limit <= 10;
    const baseEntityTotal = await this.baseService.total();
    const entityTotal = await this.repository.count();
    if (baseEntityTotal === entityTotal) {
      return await super.index(query);
    }
    if (query.page === 0 && query.limit === 0) {
      const lEntity = await this.baseService.list();
      return await this.transformBeforeReceive(lEntity);
    }
    const pEntity = await this.baseService.paginate(query);
    const result = {
      ...pEntity,
      data: await this.transformBeforeReceive(pEntity.data, save),
    };
    const total = await this.repository.count();
    if (total > 0) {
      result.message = `There are ${baseEntityTotal - total} pokemons left to complete the database. There are already ${total} pokemons in the database`;
    }
    return result;
  }

  async show(param: string, save: boolean = true): Promise<Pokemon> {
    const find = isUUID(param) ? { id: param } : { name: param };
    const entity = await this.showBy(find);
    if (!entity && save) {
      return await this.generateOne(param);
    }
    return entity;
  }

  async transformBeforeReceive(
    list: Array<IPokemonBase>,
    save: boolean = false,
  ): Promise<Array<Pokemon>> {
    return Promise.all(
      list.map(async (item: PokemonBase) => {
        const response = await this.show(item.name, save);
        if (!response) {
          const entity = new Pokemon();
          entity.name = item.name;
          entity.order = item.order;
          return entity;
        }
        return response;
      }),
    );
  }

  async generate(): Promise<IPaginate<IPokemonBase> | Array<IPokemonBase>> {
    return this.baseService.generate();
  }

  async generateOne(param: string): Promise<Pokemon> {
    const response = (await this.responseApi(
      param,
      'byName',
    )) as IResponsePokemon;
    const responseSpecie = (await this.responseApi(
      param,
      'specieByName',
    )) as IResponseSpecie;
    const entity = Pokemon.responseToEntity(response, responseSpecie);
    entity.types = await this.typeService.generate(response.types);
    entity.stats = await this.statService.generate(response.stats);
    entity.moves = await this.moveService.generate(response.moves);
    entity.abilities = await this.abilityService.generate(response.abilities);
    entity.image = this.getImage(response.sprites);
    await this.repository.save(entity);
    return await this.repository.findOne({ where: { name: entity.name } });
  }

  private async responseApi(
    name: string,
    method: 'byName' | 'specieByName',
  ): Promise<IResponsePokemon | IResponseSpecie> {
    const api = new PokemonApi();
    const response = await api[method](name);
    if (!response && method === 'byName') {
      throw new InternalServerErrorException(
        'Error When Querying External Api Please Try Again Later!',
      );
    }
    return response;
  }

  private getImage(sprites: IResponsePokemon['sprites']): string {
    if (!sprites) {
      return '';
    }
    const frontDefault = sprites.front_default;
    const dreamWorld = sprites.other.dream_world.front_default;
    return frontDefault || dreamWorld;
  }
}
