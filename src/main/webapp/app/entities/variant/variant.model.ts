import { IItem } from 'app/entities/item/item.model';

export interface IVariant {
  id?: number;
  name?: string | null;
  price?: number | null;
  item?: IItem | null;
}

export class Variant implements IVariant {
  constructor(public id?: number, public name?: string | null, public price?: number | null, public item?: IItem | null) {}
}

export function getVariantIdentifier(variant: IVariant): number | undefined {
  return variant.id;
}
