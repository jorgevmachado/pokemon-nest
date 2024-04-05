import { Http } from '@services/http';
import { generateOrder } from '@services/string';

import type { IResponsePaginate } from '@api/interfaces';
import * as dto from '@api/pokemon/interfaces';
import {
  IResponsePokemon,
  IResponsePokemonBase,
} from '@api/pokemon/interfaces';

type Tlist =
  | IResponsePokemon['types']
  | IResponsePokemon['moves']
  | IResponsePokemon['stats']
  | IResponsePokemon['abilities'];
export class PokemonApi extends Http {
  static urlDefault = 'https://pokeapi.co/api/v2';

  constructor() {
    super(PokemonApi.urlDefault, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async list(
    offset: number,
    limit: number,
  ): Promise<IResponsePaginate<dto.IResponsePokemonBase>> {
    try {
      const response: IResponsePaginate<dto.IResponsePokemonBase> =
        await this.get(`/pokemon`, { offset: offset, limit: limit });
      const results: Array<dto.IResponsePokemonBase> = response.results;
      return {
        ...response,
        results: results.map((item) => ({
          ...item,
          order: generateOrder(item.url, `${PokemonApi.urlDefault}/pokemon/`),
        })),
      };
    } catch (error) {
      console.error('# => list => error => ', error);
    }
  }

  async byName(name: string): Promise<dto.IResponsePokemon> {
    try {
      const response: dto.IResponsePokemon = await this.get(
        `/pokemon/${name}`,
        {},
      );
      response.types = this.generateOrderList(response.types, 'type');
      response.moves = this.generateOrderList(response.moves, 'move');
      response.stats = this.generateOrderList(response.stats, 'stat');
      response.abilities = this.generateOrderList(
        response.abilities,
        'ability',
      );
      return response;
    } catch (error) {
      console.error('# => pokemonByName => error => ', error);
    }
  }

  async specieByName(name: string): Promise<dto.IResponseSpecie> {
    try {
      return await this.get(`/pokemon-species/${name}`, {});
    } catch (error) {
      console.error(`# api => specieByName => error => ${name}`, error);
      return this.defaultResponse(name);
    }
  }

  private generateOrderList(list: Tlist, type: string) {
    return list.map((item: any) => {
      item[type] = {
        ...item[type],
        order: generateOrder(
          item[type].url,
          `${PokemonApi.urlDefault}/${type}/`,
        ),
      };
      return item;
    });
  }

  private defaultResponse(name: string): dto.IResponseSpecie {
    const responseBase: IResponsePokemonBase = {
      url: 'url',
      name: name,
      order: 0,
    };
    return {
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
  }
}
