import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDiscount } from '../discount.model';
import { DiscountService } from '../service/discount.service';
import { DiscountDeleteDialogComponent } from '../delete/discount-delete-dialog.component';

@Component({
  selector: 'jhi-discount',
  templateUrl: './discount.component.html',
})
export class DiscountComponent implements OnInit {
  discounts?: IDiscount[];
  isLoading = false;

  constructor(protected discountService: DiscountService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.discountService.query().subscribe({
      next: (res: HttpResponse<IDiscount[]>) => {
        this.isLoading = false;
        this.discounts = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IDiscount): number {
    return item.id!;
  }

  delete(discount: IDiscount): void {
    const modalRef = this.modalService.open(DiscountDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.discount = discount;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
