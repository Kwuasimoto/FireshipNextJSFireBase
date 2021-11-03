import * as functions from "firebase-functions";
import * as express from "express";

const app = express();

// Do Api Stuff :O

const api = functions.https.onRequest(app);
