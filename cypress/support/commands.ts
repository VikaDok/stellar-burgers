/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare global {
  namespace Cypress {
    interface Chainable {
      getByTestId(value: string): Chainable<JQuery<HTMLElement>>;
      clickIngredientItem(index?: number): Chainable<Element>;
      checkModalIsVisible(): Chainable<void>;
      checkModalIsNotVisible(): Chainable<void>;
      addIngredientsToConstructor(): Chainable<void>;
      setupInterceptors(): Chainable<void>;
      setupAuth(): Chainable<void>;
    }
  }
}

// Базовые команды
Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`);
});

Cypress.Commands.add('clickIngredientItem', (index: number = 0) => {
  cy.getByTestId('ingredient-item').eq(index).within(() => {
    cy.get('button').click();
  });
});

// Команды для работы с модальным окном
Cypress.Commands.add('checkModalIsVisible', () => {
  cy.getByTestId('modal-window').should('be.visible');
});

Cypress.Commands.add('checkModalIsNotVisible', () => {
  cy.getByTestId('modal-window').should('not.exist');
//   cy.getByTestId('modal-overlay').should('not.exist');
});

// Команды для работы с конструктором
Cypress.Commands.add('addIngredientsToConstructor', () => {
  // Добавляем булку
  cy.clickIngredientItem(0);
  // Добавляем начинку
  cy.clickIngredientItem(1);
  // Добавляем соус
  cy.clickIngredientItem(2);
});

// Команды для настройки тестового окружения
Cypress.Commands.add('setupInterceptors', () => {
  cy.intercept('GET', '**/api/ingredients**', {
    fixture: 'ingredients.json'
  }).as('getIngredients');
  
  cy.intercept('GET', '**/api/auth/user**', { 
    fixture: 'user.json' 
  }).as('getUser');
  
  cy.intercept('POST', '**/api/orders**', { 
    fixture: 'order.json' 
  }).as('createOrder');
});


Cypress.Commands.add('setupAuth', () => {
  cy.setCookie('accessToken', 'test-access-token');
  cy.window().then((win) => {
    win.localStorage.setItem('refreshToken', 'test-refresh-token');
  });
});


export {}

