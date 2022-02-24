import { IOrder } from 'app/entities/order/order.model';

export interface IDiscount {
  id?: number;
  description?: string | null;
  rate?: number | null;
  fixedAmount?: number | null;
  order?: IOrder | null;
}

export class Discount implements IDiscount {
  constructor(
    public id?: number,
    public description?: string | null,
    public rate?: number | null,
    public fixedAmount?: number | null,
    public order?: IOrder | null
  ) {}
}

export function getDiscountIdentifier(discount: IDiscount): number | undefined {
  return discount.id;
}
