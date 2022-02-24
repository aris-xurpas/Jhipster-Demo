import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OrderService } from '../service/order.service';
import { IOrder, Order } from '../order.model';
import { IDiscount } from 'app/entities/discount/discount.model';
import { DiscountService } from 'app/entities/discount/service/discount.service';
import { IStaff } from 'app/entities/staff/staff.model';
import { StaffService } from 'app/entities/staff/service/staff.service';
import { IPayment } from 'app/entities/payment/payment.model';
import { PaymentService } from 'app/entities/payment/service/payment.service';

import { OrderUpdateComponent } from './order-update.component';

describe('Order Management Update Component', () => {
  let comp: OrderUpdateComponent;
  let fixture: ComponentFixture<OrderUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let orderService: OrderService;
  let discountService: DiscountService;
  let staffService: StaffService;
  let paymentService: PaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OrderUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(OrderUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrderUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    orderService = TestBed.inject(OrderService);
    discountService = TestBed.inject(DiscountService);
    staffService = TestBed.inject(StaffService);
    paymentService = TestBed.inject(PaymentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call discount query and add missing value', () => {
      const order: IOrder = { id: 456 };
      const discount: IDiscount = { id: 26204 };
      order.discount = discount;

      const discountCollection: IDiscount[] = [{ id: 6425 }];
      jest.spyOn(discountService, 'query').mockReturnValue(of(new HttpResponse({ body: discountCollection })));
      const expectedCollection: IDiscount[] = [discount, ...discountCollection];
      jest.spyOn(discountService, 'addDiscountToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ order });
      comp.ngOnInit();

      expect(discountService.query).toHaveBeenCalled();
      expect(discountService.addDiscountToCollectionIfMissing).toHaveBeenCalledWith(discountCollection, discount);
      expect(comp.discountsCollection).toEqual(expectedCollection);
    });

    it('Should call cashier query and add missing value', () => {
      const order: IOrder = { id: 456 };
      const cashier: IStaff = { id: 6659 };
      order.cashier = cashier;

      const cashierCollection: IStaff[] = [{ id: 95450 }];
      jest.spyOn(staffService, 'query').mockReturnValue(of(new HttpResponse({ body: cashierCollection })));
      const expectedCollection: IStaff[] = [cashier, ...cashierCollection];
      jest.spyOn(staffService, 'addStaffToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ order });
      comp.ngOnInit();

      expect(staffService.query).toHaveBeenCalled();
      expect(staffService.addStaffToCollectionIfMissing).toHaveBeenCalledWith(cashierCollection, cashier);
      expect(comp.cashiersCollection).toEqual(expectedCollection);
    });

    it('Should call payment query and add missing value', () => {
      const order: IOrder = { id: 456 };
      const payment: IPayment = { id: 70603 };
      order.payment = payment;

      const paymentCollection: IPayment[] = [{ id: 14742 }];
      jest.spyOn(paymentService, 'query').mockReturnValue(of(new HttpResponse({ body: paymentCollection })));
      const expectedCollection: IPayment[] = [payment, ...paymentCollection];
      jest.spyOn(paymentService, 'addPaymentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ order });
      comp.ngOnInit();

      expect(paymentService.query).toHaveBeenCalled();
      expect(paymentService.addPaymentToCollectionIfMissing).toHaveBeenCalledWith(paymentCollection, payment);
      expect(comp.paymentsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const order: IOrder = { id: 456 };
      const discount: IDiscount = { id: 70308 };
      order.discount = discount;
      const cashier: IStaff = { id: 6314 };
      order.cashier = cashier;
      const payment: IPayment = { id: 85409 };
      order.payment = payment;

      activatedRoute.data = of({ order });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(order));
      expect(comp.discountsCollection).toContain(discount);
      expect(comp.cashiersCollection).toContain(cashier);
      expect(comp.paymentsCollection).toContain(payment);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Order>>();
      const order = { id: 123 };
      jest.spyOn(orderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ order });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: order }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(orderService.update).toHaveBeenCalledWith(order);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Order>>();
      const order = new Order();
      jest.spyOn(orderService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ order });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: order }));
      saveSubject.complete();

      // THEN
      expect(orderService.create).toHaveBeenCalledWith(order);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Order>>();
      const order = { id: 123 };
      jest.spyOn(orderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ order });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(orderService.update).toHaveBeenCalledWith(order);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackDiscountById', () => {
      it('Should return tracked Discount primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackDiscountById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackStaffById', () => {
      it('Should return tracked Staff primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackStaffById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackPaymentById', () => {
      it('Should return tracked Payment primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPaymentById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
