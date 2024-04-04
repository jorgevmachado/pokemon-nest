export interface IResponsePokemonBase {
  url: string;
  name: string;
  order: number;
}

export interface IResponsePokemon {
  name: 'bulbasaur';
  order: 1;
  cries: {
    latest: string;
    legacy: string;
  };
  moves: Array<{
    move: IResponsePokemonBase;
    version_group_details: Array<{
      level_learned_at: number;
      move_learn_method: IResponsePokemonBase;
      version_group: IResponsePokemonBase;
    }>;
  }>;
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: IResponsePokemonBase;
  }>;
  types: Array<{
    slot: number;
    type: IResponsePokemonBase;
  }>;
  height: number;
  weight: number;
  species: IResponsePokemonBase;
  sprites: {
    other: {
      dream_world: {
        front_default: string;
      };
    };
    front_default: string;
  };
  abilities: Array<{
    slot: number;
    ability: IResponsePokemonBase;
    is_hidden: boolean;
  }>;
  base_experience: number;
  location_area_encounters: 'https://pokeapi.co/api/v2/pokemon/1/encounters';
}

export interface IResponseSpecie {
  id: number;
  name: string;
  color: Omit<IResponsePokemonBase, 'url'>;
  order: number;
  shape: IResponsePokemonBase;
  habitat: Omit<IResponsePokemonBase, 'url'>;
  is_baby: boolean;
  is_mythical: boolean;
  gender_rate: number;
  is_legendary: boolean;
  capture_rate: number;
  hatch_counter: number;
  base_happiness: number;
  evolution_chain: Omit<IResponsePokemonBase, 'name'>;
  evolves_from_species: Omit<IResponsePokemonBase, 'url'>;
  has_gender_differences: boolean;
}
