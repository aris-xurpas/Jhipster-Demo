import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVariant, getVariantIdentifier } from '../variant.model';

export type EntityResponseType = HttpResponse<IVariant>;
export type EntityArrayResponseType = HttpResponse<IVariant[]>;

@Injectable({ providedIn: 'root' })
export class VariantService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/variants');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(variant: IVariant): Observable<EntityResponseType> {
    return this.http.post<IVariant>(this.resourceUrl, variant, { observe: 'response' });
  }

  update(variant: IVariant): Observable<EntityResponseType> {
    return this.http.put<IVariant>(`${this.resourceUrl}/${getVariantIdentifier(variant) as number}`, variant, { observe: 'response' });
  }

  partialUpdate(variant: IVariant): Observable<EntityResponseType> {
    return this.http.patch<IVariant>(`${this.resourceUrl}/${getVariantIdentifier(variant) as number}`, variant, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IVariant>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVariant[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addVariantToCollectionIfMissing(variantCollection: IVariant[], ...variantsToCheck: (IVariant | null | undefined)[]): IVariant[] {
    const variants: IVariant[] = variantsToCheck.filter(isPresent);
    if (variants.length > 0) {
      const variantCollectionIdentifiers = variantCollection.map(variantItem => getVariantIdentifier(variantItem)!);
      const variantsToAdd = variants.filter(variantItem => {
        const variantIdentifier = getVariantIdentifier(variantItem);
        if (variantIdentifier == null || variantCollectionIdentifiers.includes(variantIdentifier)) {
          return false;
        }
        variantCollectionIdentifiers.push(variantIdentifier);
        return true;
      });
      return [...variantsToAdd, ...variantCollection];
    }
    return variantCollection;
  }
}
