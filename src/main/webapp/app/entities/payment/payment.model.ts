import dayjs from 'dayjs/esm';
import { IOrder } from 'app/entities/order/order.model';

export interface IPayment {
  id?: number;
  amountPaid?: number | null;
  datePaid?: dayjs.Dayjs | null;
  order?: IOrder | null;
}

export class Payment implements IPayment {
  constructor(public id?: number, public amountPaid?: number | null, public datePaid?: dayjs.Dayjs | null, public order?: IOrder | null) {}
}

export function getPaymentIdentifier(payment: IPayment): number | undefined {
  return payment.id;
}
