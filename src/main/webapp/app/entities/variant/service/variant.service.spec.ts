import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IVariant, Variant } from '../variant.model';

import { VariantService } from './variant.service';

describe('Variant Service', () => {
  let service: VariantService;
  let httpMock: HttpTestingController;
  let elemDefault: IVariant;
  let expectedResult: IVariant | IVariant[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VariantService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      price: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Variant', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Variant()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Variant', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          price: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Variant', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
        },
        new Variant()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Variant', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          price: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Variant', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addVariantToCollectionIfMissing', () => {
      it('should add a Variant to an empty array', () => {
        const variant: IVariant = { id: 123 };
        expectedResult = service.addVariantToCollectionIfMissing([], variant);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(variant);
      });

      it('should not add a Variant to an array that contains it', () => {
        const variant: IVariant = { id: 123 };
        const variantCollection: IVariant[] = [
          {
            ...variant,
          },
          { id: 456 },
        ];
        expectedResult = service.addVariantToCollectionIfMissing(variantCollection, variant);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Variant to an array that doesn't contain it", () => {
        const variant: IVariant = { id: 123 };
        const variantCollection: IVariant[] = [{ id: 456 }];
        expectedResult = service.addVariantToCollectionIfMissing(variantCollection, variant);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(variant);
      });

      it('should add only unique Variant to an array', () => {
        const variantArray: IVariant[] = [{ id: 123 }, { id: 456 }, { id: 9503 }];
        const variantCollection: IVariant[] = [{ id: 123 }];
        expectedResult = service.addVariantToCollectionIfMissing(variantCollection, ...variantArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const variant: IVariant = { id: 123 };
        const variant2: IVariant = { id: 456 };
        expectedResult = service.addVariantToCollectionIfMissing([], variant, variant2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(variant);
        expect(expectedResult).toContain(variant2);
      });

      it('should accept null and undefined values', () => {
        const variant: IVariant = { id: 123 };
        expectedResult = service.addVariantToCollectionIfMissing([], null, variant, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(variant);
      });

      it('should return initial array if no Variant is added', () => {
        const variantCollection: IVariant[] = [{ id: 123 }];
        expectedResult = service.addVariantToCollectionIfMissing(variantCollection, undefined, null);
        expect(expectedResult).toEqual(variantCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
