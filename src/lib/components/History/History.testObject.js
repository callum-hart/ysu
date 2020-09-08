export const History = {
  getHeader() {
    return cy.qa("header");
  },

  getThemeSwitch() {
    return cy.qa("theme-switch");
  },

  getViewButton() {
    return cy.qa("view-button");
  },

  getStopButton() {
    return cy.qa("stop-button");
  },

  getBackButton() {
    return cy.qa("back-button");
  },

  getForwardButton() {
    return cy.qa("forward-button");
  },

  getErrorMessage() {
    return cy.qa("error-message");
  },

  getErrorSignal() {
    return cy.qa("error-signal");
  },

  getRunningSignal() {
    return cy.qa("running-signal");
  },

  getSuspendedSignal() {
    return cy.qa("suspended-signal");
  },

  getHistoryList() {
    return cy.qa("history-list");
  },

  getActiveEntry() {
    return cy.qa("active-entry");
  },
};
