import { IItem } from 'app/entities/item/item.model';

export interface ICategory {
  id?: number;
  name?: string | null;
  item?: IItem | null;
}

export class Category implements ICategory {
  constructor(public id?: number, public name?: string | null, public item?: IItem | null) {}
}

export function getCategoryIdentifier(category: ICategory): number | undefined {
  return category.id;
}
