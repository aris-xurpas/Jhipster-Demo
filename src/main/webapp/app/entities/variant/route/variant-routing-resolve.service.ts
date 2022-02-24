import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVariant, Variant } from '../variant.model';
import { VariantService } from '../service/variant.service';

@Injectable({ providedIn: 'root' })
export class VariantRoutingResolveService implements Resolve<IVariant> {
  constructor(protected service: VariantService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVariant> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((variant: HttpResponse<Variant>) => {
          if (variant.body) {
            return of(variant.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Variant());
  }
}
