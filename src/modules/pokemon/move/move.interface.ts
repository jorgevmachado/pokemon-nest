import type { IBase } from '../../../shared/interfaces/base.interface';

export interface IMove extends IBase {
  url: string;
  order: number;
  name: string;
}
