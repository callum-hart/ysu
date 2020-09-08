import { History } from "../../src/lib/components/History/History.testObject";

describe("Validation", () => {
  before(() => {
    cy.visit("/qa/validation");
  });

  beforeEach(() => {
    cy.get('[data-qa="result"]').as("result");
  });

  it("the result should be BEFORE ERROR", () => {
    cy.get("@result").should("contain", "BEFORE ERROR");
  });

  it("the error message should be shown", () => {
    History.getErrorMessage().should("be.visible");
  });

  it("the error signal should be shown", () => {
    History.getErrorSignal().should("be.visible");
  });

  it("the sequence should be stopped", () => {
    History.getHistoryList().should("not.contain", "AFTER ERROR");
  });
});
