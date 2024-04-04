import type { IBase } from '../../../shared/interfaces/base.interface';

export interface IType extends IBase {
  url: string;
  name: string;
  order: number;
  textColor: string;
  backgroundColor: string;
}
