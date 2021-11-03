import { RulesTestEnvironment } from "@firebase/rules-unit-testing";
import * as H from "./helpers";
import firebase from "firebase/compat";

test("jest works", () => {
	expect(2).toBe(2);
});

describe("Database rules", () => {
	let id = "tdank";
	let env: RulesTestEnvironment;
	let firestore: firebase.firestore.Firestore;
	let storage: firebase.storage.Storage;

	beforeAll(async () => {
		env = await H.setupTestEnvironment(id);
		firestore = await H.setupFirestore(id, env);
		storage = await H.setupStorage(id, env);
	});

	afterAll(async () => {
		await H.teardown();
	});

	test("test firebase db", () => {
		expect(firestore).toBe(null);
	});
});
