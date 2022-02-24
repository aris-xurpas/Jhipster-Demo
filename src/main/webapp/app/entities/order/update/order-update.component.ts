import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IOrder, Order } from '../order.model';
import { OrderService } from '../service/order.service';
import { IDiscount } from 'app/entities/discount/discount.model';
import { DiscountService } from 'app/entities/discount/service/discount.service';
import { IStaff } from 'app/entities/staff/staff.model';
import { StaffService } from 'app/entities/staff/service/staff.service';
import { IPayment } from 'app/entities/payment/payment.model';
import { PaymentService } from 'app/entities/payment/service/payment.service';
import { Status } from 'app/entities/enumerations/status.model';

@Component({
  selector: 'jhi-order-update',
  templateUrl: './order-update.component.html',
})
export class OrderUpdateComponent implements OnInit {
  isSaving = false;
  statusValues = Object.keys(Status);

  discountsCollection: IDiscount[] = [];
  cashiersCollection: IStaff[] = [];
  paymentsCollection: IPayment[] = [];

  editForm = this.fb.group({
    id: [],
    status: [],
    dateOrdered: [],
    discount: [],
    cashier: [],
    payment: [],
  });

  constructor(
    protected orderService: OrderService,
    protected discountService: DiscountService,
    protected staffService: StaffService,
    protected paymentService: PaymentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ order }) => {
      this.updateForm(order);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const order = this.createFromForm();
    if (order.id !== undefined) {
      this.subscribeToSaveResponse(this.orderService.update(order));
    } else {
      this.subscribeToSaveResponse(this.orderService.create(order));
    }
  }

  trackDiscountById(index: number, item: IDiscount): number {
    return item.id!;
  }

  trackStaffById(index: number, item: IStaff): number {
    return item.id!;
  }

  trackPaymentById(index: number, item: IPayment): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrder>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(order: IOrder): void {
    this.editForm.patchValue({
      id: order.id,
      status: order.status,
      dateOrdered: order.dateOrdered,
      discount: order.discount,
      cashier: order.cashier,
      payment: order.payment,
    });

    this.discountsCollection = this.discountService.addDiscountToCollectionIfMissing(this.discountsCollection, order.discount);
    this.cashiersCollection = this.staffService.addStaffToCollectionIfMissing(this.cashiersCollection, order.cashier);
    this.paymentsCollection = this.paymentService.addPaymentToCollectionIfMissing(this.paymentsCollection, order.payment);
  }

  protected loadRelationshipsOptions(): void {
    this.discountService
      .query({ filter: 'order-is-null' })
      .pipe(map((res: HttpResponse<IDiscount[]>) => res.body ?? []))
      .pipe(
        map((discounts: IDiscount[]) =>
          this.discountService.addDiscountToCollectionIfMissing(discounts, this.editForm.get('discount')!.value)
        )
      )
      .subscribe((discounts: IDiscount[]) => (this.discountsCollection = discounts));

    this.staffService
      .query({ filter: 'order-is-null' })
      .pipe(map((res: HttpResponse<IStaff[]>) => res.body ?? []))
      .pipe(map((staff: IStaff[]) => this.staffService.addStaffToCollectionIfMissing(staff, this.editForm.get('cashier')!.value)))
      .subscribe((staff: IStaff[]) => (this.cashiersCollection = staff));

    this.paymentService
      .query({ filter: 'order-is-null' })
      .pipe(map((res: HttpResponse<IPayment[]>) => res.body ?? []))
      .pipe(
        map((payments: IPayment[]) => this.paymentService.addPaymentToCollectionIfMissing(payments, this.editForm.get('payment')!.value))
      )
      .subscribe((payments: IPayment[]) => (this.paymentsCollection = payments));
  }

  protected createFromForm(): IOrder {
    return {
      ...new Order(),
      id: this.editForm.get(['id'])!.value,
      status: this.editForm.get(['status'])!.value,
      dateOrdered: this.editForm.get(['dateOrdered'])!.value,
      discount: this.editForm.get(['discount'])!.value,
      cashier: this.editForm.get(['cashier'])!.value,
      payment: this.editForm.get(['payment'])!.value,
    };
  }
}
