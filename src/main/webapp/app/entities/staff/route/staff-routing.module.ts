import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { StaffComponent } from '../list/staff.component';
import { StaffDetailComponent } from '../detail/staff-detail.component';
import { StaffUpdateComponent } from '../update/staff-update.component';
import { StaffRoutingResolveService } from './staff-routing-resolve.service';

const staffRoute: Routes = [
  {
    path: '',
    component: StaffComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StaffDetailComponent,
    resolve: {
      staff: StaffRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StaffUpdateComponent,
    resolve: {
      staff: StaffRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StaffUpdateComponent,
    resolve: {
      staff: StaffRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(staffRoute)],
  exports: [RouterModule],
})
export class StaffRoutingModule {}
