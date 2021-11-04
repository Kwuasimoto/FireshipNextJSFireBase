"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the functions you need from the SDKs you need
const firebase_1 = __importDefault(require("firebase"));
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD5veY38eFVPONwsSQnP6p1j_qjyG1I0u4",
    authDomain: "fireship-e8def.firebaseapp.com",
    projectId: "fireship-e8def",
    storageBucket: "fireship-e8def.appspot.com",
    messagingSenderId: "49766349473",
    appId: "1:49766349473:web:a2725093d7a0fb4dfe8ee0",
    measurementId: "G-XLML6QZ73D",
};
// Initialize Firebase
const app = firebase_1.default.initializeApp(firebaseConfig);
const analytics = firebase_1.default.getAnalytics(app);
console.log(app);
