import type { IBase } from '../../../shared/interfaces/base.interface';

export interface IAbility extends IBase {
  url: string;
  name: string;
  slot: number;
  order: number;
  is_hidden: boolean;
}
