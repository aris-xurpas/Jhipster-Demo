import { entityItemSelector } from '../../support/commands';
import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Discount e2e test', () => {
  const discountPageUrl = '/discount';
  const discountPageUrlPattern = new RegExp('/discount(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const discountSample = {};

  let discount: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/discounts+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/discounts').as('postEntityRequest');
    cy.intercept('DELETE', '/api/discounts/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (discount) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/discounts/${discount.id}`,
      }).then(() => {
        discount = undefined;
      });
    }
  });

  it('Discounts menu should load Discounts page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('discount');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Discount').should('exist');
    cy.url().should('match', discountPageUrlPattern);
  });

  describe('Discount page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(discountPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Discount page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/discount/new$'));
        cy.getEntityCreateUpdateHeading('Discount');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', discountPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/discounts',
          body: discountSample,
        }).then(({ body }) => {
          discount = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/discounts+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [discount],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(discountPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Discount page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('discount');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', discountPageUrlPattern);
      });

      it('edit button click should load edit Discount page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Discount');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', discountPageUrlPattern);
      });

      it('last delete button click should delete instance of Discount', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('discount').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', discountPageUrlPattern);

        discount = undefined;
      });
    });
  });

  describe('new Discount page', () => {
    beforeEach(() => {
      cy.visit(`${discountPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Discount');
    });

    it('should create an instance of Discount', () => {
      cy.get(`[data-cy="description"]`).type('compressing Kentucky Sharable').should('have.value', 'compressing Kentucky Sharable');

      cy.get(`[data-cy="rate"]`).type('19688').should('have.value', '19688');

      cy.get(`[data-cy="fixedAmount"]`).type('95829').should('have.value', '95829');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        discount = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', discountPageUrlPattern);
    });
  });
});
