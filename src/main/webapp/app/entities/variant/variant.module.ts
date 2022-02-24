import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VariantComponent } from './list/variant.component';
import { VariantDetailComponent } from './detail/variant-detail.component';
import { VariantUpdateComponent } from './update/variant-update.component';
import { VariantDeleteDialogComponent } from './delete/variant-delete-dialog.component';
import { VariantRoutingModule } from './route/variant-routing.module';

@NgModule({
  imports: [SharedModule, VariantRoutingModule],
  declarations: [VariantComponent, VariantDetailComponent, VariantUpdateComponent, VariantDeleteDialogComponent],
  entryComponents: [VariantDeleteDialogComponent],
})
export class VariantModule {}
