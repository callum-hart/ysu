Cypress.Commands.add("qa", (selector) => cy.get(`[data-qa="${selector}"]`));
