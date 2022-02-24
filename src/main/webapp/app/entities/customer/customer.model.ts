import { IOrder } from 'app/entities/order/order.model';

export interface ICustomer {
  id?: number;
  name?: string | null;
  contactNumber?: string | null;
  orders?: IOrder | null;
}

export class Customer implements ICustomer {
  constructor(public id?: number, public name?: string | null, public contactNumber?: string | null, public orders?: IOrder | null) {}
}

export function getCustomerIdentifier(customer: ICustomer): number | undefined {
  return customer.id;
}
