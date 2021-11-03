import {
	initializeTestEnvironment,
	RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import firebase from "../node_modules/firebase/compat";

const { readFileSync } = require("fs");

const projectId = `firebase-security-mc`;
let db: RulesTestEnvironment;

export const setupTestEnvironment = async (
	user_id: string,
): Promise<RulesTestEnvironment> =>
	initializeTestEnvironment({
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
	await db.clearStorage();
	await db.clearFirestore();
	await db.cleanup();
};
