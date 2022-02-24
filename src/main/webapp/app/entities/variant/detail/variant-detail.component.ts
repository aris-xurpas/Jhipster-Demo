import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVariant } from '../variant.model';

@Component({
  selector: 'jhi-variant-detail',
  templateUrl: './variant-detail.component.html',
})
export class VariantDetailComponent implements OnInit {
  variant: IVariant | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ variant }) => {
      this.variant = variant;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
