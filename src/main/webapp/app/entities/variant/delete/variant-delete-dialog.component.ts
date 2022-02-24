import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVariant } from '../variant.model';
import { VariantService } from '../service/variant.service';

@Component({
  templateUrl: './variant-delete-dialog.component.html',
})
export class VariantDeleteDialogComponent {
  variant?: IVariant;

  constructor(protected variantService: VariantService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.variantService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
