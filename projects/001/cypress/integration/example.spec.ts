/// <reference types="cypress" />

import { describe } from "mocha";

const baseUrl = "http://localhost:5000";

describe("my app", () => {
	before(() => {
		indexedDB.deleteDatabase("firebaseLocalStorageDb");
	});

	it("loads", () => {
		cy.visit(baseUrl);
	});
});
