import firebase, { FirebaseOptions } from "firebase/app";
import { connectAuthEmulator, getAuth, initializeAuth } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import {
	connectFirestoreEmulator,
	Firestore,
	getFirestore,
	initializeFirestore,
} from "firebase/firestore";
import { getAnalytics, initializeAnalytics } from "firebase/analytics";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { getPerformance, initializePerformance } from "firebase/performance";

// This tells next to bundle these sdks to be sent down to the client application.
const firebaseConfig: FirebaseOptions = {
	apiKey: "AIzaSyD5veY38eFVPONwsSQnP6p1j_qjyG1I0u4",
	authDomain: "fireship-e8def.firebaseapp.com",
	projectId: "fireship-e8def",
	storageBucket: "fireship-e8def.appspot.com",
	messagingSenderId: "49766349473",
	appId: "1:49766349473:web:397a7d59a62a0578fe8ee0",
	measurementId: "G-H64H9JFJWX",
};

// Keeps Next from running the firebase application twice,
// checks to see if the app is running in the firebase obj.
if (!firebase.getApps().length) {
	firebase.initializeApp(firebaseConfig);
	console.log();
}

const app = firebase.getApp(firebase.getApps()[0].name);
console.log(`FIREBASE APPNAME: ${app}`);

export const auth = initializeAuth(app);
export const firestore = initializeFirestore(
	app,
	location.hostname === "localhost"
		? {
				host: "localhost:8080",
				ssl: false,
				experimentalForceLongPolling: true,
		  }
		: {
				ssl: true,
				experimentalForceLongPolling: false,
		  },
);
export const analytics = initializeAnalytics(app, { config: {} });
export const performance = initializePerformance(app);
export const storage = getStorage(app);
export const database = getDatabase(app);
export const functions = getFunctions(app);

connectStorageEmulator(storage, "localhost", 9199);
connectDatabaseEmulator(database, "localhost", 9000);
connectAuthEmulator(auth, "localhost:9099");
connectFirestoreEmulator(firestore, "localhost", 8080);
connectFunctionsEmulator(functions, "localhost", 5001);
