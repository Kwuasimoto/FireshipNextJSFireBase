import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const httpFunc = functions.https.onRequest((request, response) => {
	// Accepting Query Params
	const name = request.query.name;

	functions.logger.info("Hello logs!", { structuredData: true });
	response.send(`Hello from Firebase! ${name}`);
});
