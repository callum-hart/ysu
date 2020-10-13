import { History } from "../../src/lib/components/History/History.testObject";

describe("Suspend", () => {
  before(() => {
    cy.visit("/qa/suspend");
  });

  it("the running signal should be shown", () => {
    History.getRunningSignal().should("be.visible");
  });

  it("the stop button should be shown", () => {
    History.getStopButton().should("be.visible");
  });

  describe("when I click stop from devTools", () => {
    before(() => {
      History.getStopButton().click();
    });

    it("the suspended signal should be shown", () => {
      History.getSuspendedSignal().should("be.visible");
    });

    it("the stop button should be hidden", () => {
      History.getStopButton().should("not.be.visible");
    });
  });

  describe("when I click start from consumer", () => {
    before(() => {
      cy.qa("start-button").click();
    });

    it("the running signal should be shown", () => {
      History.getRunningSignal().should("be.visible");
    });

    it("the stop button should be shown", () => {
      History.getStopButton().should("be.visible");
    });
  });

  describe("when I click suspend from consumer", () => {
    before(() => {
      cy.qa("suspend-button").click();
    });

    it("the suspended signal should be shown", () => {
      History.getSuspendedSignal().should("be.visible");
    });

    it("the stop button should be hidden", () => {
      History.getStopButton().should("not.be.visible");
    });
  });
});
