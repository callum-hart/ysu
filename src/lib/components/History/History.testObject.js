export const History = {
  getHeader() {
    return cy.qa("ysu-header");
  },

  getThemeSwitch() {
    return cy.qa("ysu-theme-switch");
  },

  getViewButton() {
    return cy.qa("ysu-view-button");
  },

  getStopButton() {
    return cy.qa("ysu-stop-button");
  },

  getBackButton() {
    return cy.qa("ysu-back-button");
  },

  getForwardButton() {
    return cy.qa("ysu-forward-button");
  },

  getErrorMessage() {
    return cy.qa("ysu-error-message");
  },

  getErrorSignal() {
    return cy.qa("ysu-error-signal");
  },

  getRunningSignal() {
    return cy.qa("ysu-running-signal");
  },

  getSuspendedSignal() {
    return cy.qa("ysu-suspended-signal");
  },

  getHistoryList() {
    return cy.qa("ysu-history-list");
  },

  getActiveEntry() {
    return cy.qa("ysu-active-entry");
  },
};
