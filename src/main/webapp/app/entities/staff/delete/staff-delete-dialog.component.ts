import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IStaff } from '../staff.model';
import { StaffService } from '../service/staff.service';

@Component({
  templateUrl: './staff-delete-dialog.component.html',
})
export class StaffDeleteDialogComponent {
  staff?: IStaff;

  constructor(protected staffService: StaffService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.staffService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
