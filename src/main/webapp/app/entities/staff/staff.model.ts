import { IOrder } from 'app/entities/order/order.model';

export interface IStaff {
  id?: number;
  name?: string | null;
  order?: IOrder | null;
}

export class Staff implements IStaff {
  constructor(public id?: number, public name?: string | null, public order?: IOrder | null) {}
}

export function getStaffIdentifier(staff: IStaff): number | undefined {
  return staff.id;
}
