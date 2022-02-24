import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { StaffComponent } from './list/staff.component';
import { StaffDetailComponent } from './detail/staff-detail.component';
import { StaffUpdateComponent } from './update/staff-update.component';
import { StaffDeleteDialogComponent } from './delete/staff-delete-dialog.component';
import { StaffRoutingModule } from './route/staff-routing.module';

@NgModule({
  imports: [SharedModule, StaffRoutingModule],
  declarations: [StaffComponent, StaffDetailComponent, StaffUpdateComponent, StaffDeleteDialogComponent],
  entryComponents: [StaffDeleteDialogComponent],
})
export class StaffModule {}
