import {
	assertFails,
	assertSucceeds,
	RulesTestContext,
	RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import * as H from "./helpers";
import firebase from "firebase/compat";
import { doc, setDoc } from "firebase/firestore";

test("ROOT: Jest Working", () => {
	expect(2).toBe(2);
});

describe("Database rules", () => {
	/**
	 * The ID Used to set the authenticatedContext,
	 *
	 * plug this into firestore and storage, and any userId for example,
	 * that uses tdank, will be "authenticated"
	 */
	let id = "tdank";

	let env: RulesTestEnvironment;
	let context: RulesTestContext;
	let firestore: firebase.firestore.Firestore;
	let storage: firebase.storage.Storage;
	let user: firebase.firestore.DocumentData;

	beforeAll(async () => {
		env = await H.setupTestEnvironment();
		context = await H.setContext(id, env);
		firestore = await H.setupFirestore(id, env);
		storage = await H.setupStorage(id, env);
		user = firestore.collection("users").doc(id);
	});

	afterAll(async () => {
		await H.teardown();
	});

	test("Firebase Testing Environment", () => {
		expect(env).toBeDefined();
		expect(context).toBeDefined();
		expect(firestore).toBeDefined();
		expect(storage).toBeDefined();
	});

	test("Is Owner Rule on /users/{userId}", async () => {
		expect(await assertSucceeds(user.get()));
	});
});
