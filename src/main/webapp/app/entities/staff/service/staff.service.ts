import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStaff, getStaffIdentifier } from '../staff.model';

export type EntityResponseType = HttpResponse<IStaff>;
export type EntityArrayResponseType = HttpResponse<IStaff[]>;

@Injectable({ providedIn: 'root' })
export class StaffService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/staff');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(staff: IStaff): Observable<EntityResponseType> {
    return this.http.post<IStaff>(this.resourceUrl, staff, { observe: 'response' });
  }

  update(staff: IStaff): Observable<EntityResponseType> {
    return this.http.put<IStaff>(`${this.resourceUrl}/${getStaffIdentifier(staff) as number}`, staff, { observe: 'response' });
  }

  partialUpdate(staff: IStaff): Observable<EntityResponseType> {
    return this.http.patch<IStaff>(`${this.resourceUrl}/${getStaffIdentifier(staff) as number}`, staff, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IStaff>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IStaff[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addStaffToCollectionIfMissing(staffCollection: IStaff[], ...staffToCheck: (IStaff | null | undefined)[]): IStaff[] {
    const staff: IStaff[] = staffToCheck.filter(isPresent);
    if (staff.length > 0) {
      const staffCollectionIdentifiers = staffCollection.map(staffItem => getStaffIdentifier(staffItem)!);
      const staffToAdd = staff.filter(staffItem => {
        const staffIdentifier = getStaffIdentifier(staffItem);
        if (staffIdentifier == null || staffCollectionIdentifiers.includes(staffIdentifier)) {
          return false;
        }
        staffCollectionIdentifiers.push(staffIdentifier);
        return true;
      });
      return [...staffToAdd, ...staffCollection];
    }
    return staffCollection;
  }
}
