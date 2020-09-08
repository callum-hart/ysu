import { History } from "../../src/lib/components/History/History.testObject";

describe("Usability", () => {
  before(() => {
    cy.visit("/qa/usability");
  });

  it("the sequence name should be shown", () => {
    History.getHeader().should("contain", "usability");
  });

  it("the dark theme should be enabled", () => {
    History.getThemeSwitch().should("contain", "Light");
  });

  describe("when I click light theme", () => {
    before(() => {
      History.getThemeSwitch().click();
    });

    it("the light theme should be enabled", () => {
      History.getThemeSwitch().should("contain", "Dark");
    });
  });

  describe("when I click dark theme", () => {
    before(() => {
      History.getThemeSwitch().click();
    });

    it("the dark theme should be enabled", () => {
      History.getThemeSwitch().should("contain", "Light");
    });
  });
});
