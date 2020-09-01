import { History } from "../../src/lib/components/History/History.testObject";

describe("Time travel", () => {
  before(() => {
    cy.visit("/qa/time-travel");
  });

  beforeEach(() => {
    cy.get('[data-qa="result"]').as("result");
  });

  it("the result should be LAST", () => {
    cy.get("@result").should("contain", "LAST");
  });

  it("the forward button should be disabled", () => {
    History.getForwardButton().should("be.disabled");
  });

  /**
   * TODO:
   *
   * when I click back
   *    the result should be MIDDLE
   * when I click back again
   *    the result should contain FIRST
   * when I click back again
   *    the result should be @IDLE
   *    the back button should be disabled
   *
   * when I click the bottom view button
   *    the result should be LAST
   *    the forward button should be disabled
   *
   * when I click the top view button
   *    the result should be @IDLE
   *    the back button should be disabled
   */
});
