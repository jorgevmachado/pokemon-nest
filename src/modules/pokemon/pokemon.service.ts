import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { isUUID } from 'class-validator';
import { Repository } from 'typeorm';

import {
  type IResponsePokemon,
  IResponsePokemonBase,
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
    const entity = await this.findByNameOrId(param);
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

  transformBeforeSave(
    response: IResponsePokemon,
    responseSpecie: IResponseSpecie,
  ): Pokemon {
    const entity = new Pokemon();
    entity.name = response.name;
    entity.order = response.order;
    entity.color = responseSpecie.color.name;
    entity.height = response.height;
    entity.weight = response.weight;
    entity.habitat = responseSpecie.habitat
      ? responseSpecie.habitat.name
      : null;
    entity.is_baby = responseSpecie.is_baby;
    entity.shape_url = responseSpecie.shape.url;
    entity.shape_name = responseSpecie.shape.name;
    entity.is_mythical = responseSpecie.is_mythical;
    entity.gender_rate = responseSpecie.gender_rate;
    entity.is_legendary = responseSpecie.is_legendary;
    entity.capture_rate = responseSpecie.capture_rate;
    entity.hatch_counter = responseSpecie.hatch_counter;
    entity.cries_latest = response.cries.latest;
    entity.cries_legacy = response.cries.legacy;
    entity.base_happiness = responseSpecie.base_happiness;
    entity.base_experience = response.base_experience;
    entity.evolution_chain_url = responseSpecie.evolution_chain.url;
    entity.evolves_from_species = responseSpecie.evolves_from_species
      ? responseSpecie.evolves_from_species.name
      : null;
    entity.has_gender_differences = responseSpecie.has_gender_differences;
    entity.location_area_encounters = response.location_area_encounters;
    entity.createdAt = new Date();
    return entity;
  }

  async generate(): Promise<IPaginate<IPokemonBase> | Array<IPokemonBase>> {
    return this.baseService.generate();
  }

  async generateOne(param: string): Promise<Pokemon> {
    const response = await this.responsePokemon(param);
    const responseSpecie = await this.responseSpecie(param);
    const entity = this.transformBeforeSave(response, responseSpecie);
    entity.types = await this.typeService.generate(response.types);
    entity.stats = await this.statService.generate(response.stats);
    entity.moves = await this.moveService.generate(response.moves);
    entity.abilities = await this.abilityService.generate(response.abilities);
    entity.image = this.getImage(response.sprites);
    await this.repository.save(entity);
    return await this.repository.findOne({ where: { name: entity.name } });
  }

  async responsePokemon(name: string): Promise<IResponsePokemon> {
    const api = new PokemonApi();
    const response = await api.byName(name);
    if (!response) {
      throw new InternalServerErrorException(
        'Error When Querying External Api Please Try Again Later!',
      );
    }
    return response;
  }

  async responseSpecie(name: string): Promise<IResponseSpecie> {
    const api = new PokemonApi();
    const response = await api.specieByName(name);
    if (!response) {
      return this.defaultSpecie(name);
    }
    return response;
  }

  getImage(sprites: IResponsePokemon['sprites']): string {
    if (!sprites) {
      return '';
    }
    const frontDefault = sprites.front_default;
    const dreamWorld = sprites.other.dream_world.front_default;
    return frontDefault || dreamWorld;
  }

  private async findByNameOrId(query: string) {
    const entity = await this.repository.findOne({
      where: { name: query },
      relations: this.relations,
    });
    if (entity) {
      return entity;
    }
    if (isUUID(query)) {
      return await this.repository.findOne({
        where: { id: query },
        relations: this.relations,
      });
    }
    return;
  }

  private defaultSpecie(name: string) {
    const responseBase: IResponsePokemonBase = {
      url: 'url',
      name: name,
      order: 0,
    };
    const responseSpecie: IResponseSpecie = {
      id: responseBase.order,
      name: responseBase.name,
      color: {
        name: responseBase.name,
        order: responseBase.order,
      },
      order: responseBase.order,
      shape: responseBase,
      habitat: {
        name: responseBase.name,
        order: responseBase.order,
      },
      is_baby: false,
      is_mythical: false,
      gender_rate: responseBase.order,
      is_legendary: false,
      capture_rate: responseBase.order,
      hatch_counter: responseBase.order,
      base_happiness: responseBase.order,
      evolution_chain: {
        url: responseBase.url,
        order: responseBase.order,
      },
      evolves_from_species: {
        name: responseBase.name,
        order: responseBase.order,
      },
      has_gender_differences: false,
    };
    return responseSpecie;
  }
}
