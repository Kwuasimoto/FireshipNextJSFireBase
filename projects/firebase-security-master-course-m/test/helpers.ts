import {
	initializeTestEnvironment,
	RulesTestEnvironment,
	RulesTestContext,
} from "@firebase/rules-unit-testing";
import firebase from "../node_modules/firebase/compat";
import {
	getFirestore,
	connectFirestoreEmulator,
	Firestore,
} from "firebase/firestore";

const { readFileSync } = require("fs");

const projectId = `firebase-security-mc`;
let env: RulesTestEnvironment;
let context: RulesTestContext;
let db: Firestore;

export const setupTestEnvironment = async (): Promise<RulesTestEnvironment> => {
	env = await initializeTestEnvironment({
		projectId,
		firestore: {
			rules: readFileSync(`firestore.rules`, `utf8`),
			host: "localhost",
			port: 8080,
		},
		storage: {
			host: "localhost",
			port: 9199,
		},
	});

	return env;
};

export const setContext = async (
	userId: string,
	env: RulesTestEnvironment,
): Promise<RulesTestContext> => {
	return env.authenticatedContext(userId);
};

export const setupFirestore = async (
	userId: string,
	testEnv: RulesTestEnvironment,
): Promise<firebase.firestore.Firestore> =>
	testEnv.authenticatedContext(userId).firestore();

export const setupStorage = async (
	userId: string,
	testEnv: RulesTestEnvironment,
): Promise<firebase.storage.Storage> =>
	testEnv.authenticatedContext(userId).storage();

export const teardown = async () => {
	await env.clearStorage();
	await env.clearFirestore();
	await env.cleanup();
};
