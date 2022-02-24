import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'staff',
        data: { pageTitle: 'restoJhipsterJenkinsApp.staff.home.title' },
        loadChildren: () => import('./staff/staff.module').then(m => m.StaffModule),
      },
      {
        path: 'item',
        data: { pageTitle: 'restoJhipsterJenkinsApp.item.home.title' },
        loadChildren: () => import('./item/item.module').then(m => m.ItemModule),
      },
      {
        path: 'variant',
        data: { pageTitle: 'restoJhipsterJenkinsApp.variant.home.title' },
        loadChildren: () => import('./variant/variant.module').then(m => m.VariantModule),
      },
      {
        path: 'category',
        data: { pageTitle: 'restoJhipsterJenkinsApp.category.home.title' },
        loadChildren: () => import('./category/category.module').then(m => m.CategoryModule),
      },
      {
        path: 'order',
        data: { pageTitle: 'restoJhipsterJenkinsApp.order.home.title' },
        loadChildren: () => import('./order/order.module').then(m => m.OrderModule),
      },
      {
        path: 'payment',
        data: { pageTitle: 'restoJhipsterJenkinsApp.payment.home.title' },
        loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule),
      },
      {
        path: 'discount',
        data: { pageTitle: 'restoJhipsterJenkinsApp.discount.home.title' },
        loadChildren: () => import('./discount/discount.module').then(m => m.DiscountModule),
      },
      {
        path: 'customer',
        data: { pageTitle: 'restoJhipsterJenkinsApp.customer.home.title' },
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
