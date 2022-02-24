import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DiscountDetailComponent } from './discount-detail.component';

describe('Discount Management Detail Component', () => {
  let comp: DiscountDetailComponent;
  let fixture: ComponentFixture<DiscountDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscountDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ discount: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DiscountDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DiscountDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load discount on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.discount).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
