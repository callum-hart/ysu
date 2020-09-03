export const History = {
  getViewButton() {
    return cy.get('[data-qa="view-button"]');
  },

  getBackButton() {
    return cy.get('[data-qa="back-button"]');
  },

  getForwardButton() {
    return cy.get('[data-qa="forward-button"]');
  },
};
