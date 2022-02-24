import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VariantDetailComponent } from './variant-detail.component';

describe('Variant Management Detail Component', () => {
  let comp: VariantDetailComponent;
  let fixture: ComponentFixture<VariantDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VariantDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ variant: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(VariantDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(VariantDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load variant on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.variant).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
