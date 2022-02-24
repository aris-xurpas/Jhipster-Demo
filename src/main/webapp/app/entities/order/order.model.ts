import dayjs from 'dayjs/esm';
import { IDiscount } from 'app/entities/discount/discount.model';
import { IStaff } from 'app/entities/staff/staff.model';
import { IPayment } from 'app/entities/payment/payment.model';
import { IItem } from 'app/entities/item/item.model';
import { ICustomer } from 'app/entities/customer/customer.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IOrder {
  id?: number;
  status?: Status | null;
  dateOrdered?: dayjs.Dayjs | null;
  discount?: IDiscount | null;
  cashier?: IStaff | null;
  payment?: IPayment | null;
  items?: IItem[] | null;
  customers?: ICustomer[] | null;
}

export class Order implements IOrder {
  constructor(
    public id?: number,
    public status?: Status | null,
    public dateOrdered?: dayjs.Dayjs | null,
    public discount?: IDiscount | null,
    public cashier?: IStaff | null,
    public payment?: IPayment | null,
    public items?: IItem[] | null,
    public customers?: ICustomer[] | null
  ) {}
}

export function getOrderIdentifier(order: IOrder): number | undefined {
  return order.id;
}
