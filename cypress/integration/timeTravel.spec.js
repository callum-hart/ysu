import { History } from "../../src/lib/components/History/History.testObject";
import { pinDevTools } from "../utils";

describe("Time travel", () => {
  before(() => {
    cy.visit("/qa/time-travel");
    pinDevTools("timeTravel");
  });

  beforeEach(() => {
    cy.get('[data-qa="result"]').as("result");
  });

  it("the result should be LAST", () => {
    cy.get("@result").should("contain", "LAST");
  });

  it("the back button should be enabled", () => {
    History.getBackButton().should("not.be.disabled");
  });

  it("the forward button should be disabled", () => {
    History.getForwardButton().should("be.disabled");
  });

  describe("when I click back", () => {
    before(() => {
      History.getBackButton().click();
    });

    it("the result should be MIDDLE", () => {
      cy.get("@result").should("contain", "MIDDLE");
    });

    it("the forward button should be enabled", () => {
      History.getForwardButton().should("not.be.disabled");
    });
  });

  describe("when I click back again", () => {
    before(() => {
      History.getBackButton().click();
    });

    it("the result should be FIRST", () => {
      cy.get("@result").should("contain", "FIRST");
    });
  });

  describe("when I click back again", () => {
    before(() => {
      History.getBackButton().click();
    });

    it("the result should be @IDLE", () => {
      cy.get("@result").should("contain", "@IDLE");
    });

    it("the back button should be disabled", () => {
      History.getBackButton().should("be.disabled");
    });
  });

  describe("when I click the bottom view button", () => {
    before(() => {
      History.getViewButton().last().click();
    });

    it("the result should be LAST", () => {
      cy.get("@result").should("contain", "LAST");
    });

    it("the forward button should be disabled", () => {
      History.getForwardButton().should("be.disabled");
    });
  });

  describe("when I click the top view button", () => {
    before(() => {
      History.getViewButton().first().click();
    });

    it("the result should be @IDLE", () => {
      cy.get("@result").should("contain", "@IDLE");
    });

    it("the back button should be disabled", () => {
      History.getBackButton().should("be.disabled");
    });
  });
});
