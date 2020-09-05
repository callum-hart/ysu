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

  getErrorMessage() {
    return cy.get('[data-qa="error-message"]');
  },

  getErrorSignal() {
    return cy.get('[data-qa="error-signal"]');
  },

  getHistoryList() {
    return cy.get('[data-qa="history-list"]');
  },

  getActiveEntry() {
    return cy.get('[data-qa="active-entry"]');
  },
};
