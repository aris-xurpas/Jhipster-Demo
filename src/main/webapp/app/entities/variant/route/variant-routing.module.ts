import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VariantComponent } from '../list/variant.component';
import { VariantDetailComponent } from '../detail/variant-detail.component';
import { VariantUpdateComponent } from '../update/variant-update.component';
import { VariantRoutingResolveService } from './variant-routing-resolve.service';

const variantRoute: Routes = [
  {
    path: '',
    component: VariantComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VariantDetailComponent,
    resolve: {
      variant: VariantRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VariantUpdateComponent,
    resolve: {
      variant: VariantRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VariantUpdateComponent,
    resolve: {
      variant: VariantRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(variantRoute)],
  exports: [RouterModule],
})
export class VariantRoutingModule {}
