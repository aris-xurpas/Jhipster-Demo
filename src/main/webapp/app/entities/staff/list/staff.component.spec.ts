import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { StaffService } from '../service/staff.service';

import { StaffComponent } from './staff.component';

describe('Staff Management Component', () => {
  let comp: StaffComponent;
  let fixture: ComponentFixture<StaffComponent>;
  let service: StaffService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [StaffComponent],
    })
      .overrideTemplate(StaffComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StaffComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(StaffService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.staff?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
