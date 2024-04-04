import type { IBase } from '../../shared/interfaces/base.interface';
import type { IType } from './type';
import type { IStat } from './stat';
import type { IMove } from './move';
import type { IAbility } from './ability';

export interface IPokemon extends IBase {
  name: string;
  order: number;
  color: string;
  moves: Array<IMove>;
  stats: Array<IStat>;
  types: Array<IType>;
  image: string;
  height: number;
  weight: number;
  habitat?: string;
  is_baby: boolean;
  shape_url: string;
  shape_name: string;
  abilities: Array<IAbility>;
  is_mythical: boolean;
  gender_rate: number;
  is_legendary: boolean;
  capture_rate: number;
  hatch_counter: number;
  cries_latest?: string;
  cries_legacy?: string;
  base_happiness: number;
  base_experience: number;
  evolution_chain_url: string;
  evolves_from_species?: string;
  has_gender_differences: boolean;
  location_area_encounters: string;
}
