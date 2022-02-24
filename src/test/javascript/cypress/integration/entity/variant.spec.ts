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

describe('Variant e2e test', () => {
  const variantPageUrl = '/variant';
  const variantPageUrlPattern = new RegExp('/variant(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const variantSample = {};

  let variant: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/variants+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/variants').as('postEntityRequest');
    cy.intercept('DELETE', '/api/variants/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (variant) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/variants/${variant.id}`,
      }).then(() => {
        variant = undefined;
      });
    }
  });

  it('Variants menu should load Variants page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('variant');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Variant').should('exist');
    cy.url().should('match', variantPageUrlPattern);
  });

  describe('Variant page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(variantPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Variant page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/variant/new$'));
        cy.getEntityCreateUpdateHeading('Variant');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', variantPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/variants',
          body: variantSample,
        }).then(({ body }) => {
          variant = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/variants+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/variants?page=0&size=20>; rel="last",<http://localhost/api/variants?page=0&size=20>; rel="first"',
              },
              body: [variant],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(variantPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Variant page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('variant');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', variantPageUrlPattern);
      });

      it('edit button click should load edit Variant page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Variant');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', variantPageUrlPattern);
      });

      it('last delete button click should delete instance of Variant', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('variant').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', variantPageUrlPattern);

        variant = undefined;
      });
    });
  });

  describe('new Variant page', () => {
    beforeEach(() => {
      cy.visit(`${variantPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Variant');
    });

    it('should create an instance of Variant', () => {
      cy.get(`[data-cy="name"]`).type('Avon Tokelau Unbranded').should('have.value', 'Avon Tokelau Unbranded');

      cy.get(`[data-cy="price"]`).type('77250').should('have.value', '77250');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        variant = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', variantPageUrlPattern);
    });
  });
});
