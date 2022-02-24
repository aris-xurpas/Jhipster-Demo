import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { StaffDetailComponent } from './staff-detail.component';

describe('Staff Management Detail Component', () => {
  let comp: StaffDetailComponent;
  let fixture: ComponentFixture<StaffDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StaffDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ staff: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(StaffDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(StaffDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load staff on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.staff).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
