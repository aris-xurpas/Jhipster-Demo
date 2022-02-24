import { ICategory } from 'app/entities/category/category.model';
import { IVariant } from 'app/entities/variant/variant.model';
import { IOrder } from 'app/entities/order/order.model';

export interface IItem {
  id?: number;
  name?: string | null;
  price?: number | null;
  category?: ICategory | null;
  variants?: IVariant[] | null;
  order?: IOrder | null;
}

export class Item implements IItem {
  constructor(
    public id?: number,
    public name?: string | null,
    public price?: number | null,
    public category?: ICategory | null,
    public variants?: IVariant[] | null,
    public order?: IOrder | null
  ) {}
}

export function getItemIdentifier(item: IItem): number | undefined {
  return item.id;
}
