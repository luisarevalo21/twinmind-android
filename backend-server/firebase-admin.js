// firebaseAdmin.js
const admin = require("firebase-admin");
const { cert } = require("firebase-admin/app");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

let serviceAccountKey;
if (process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64) {
  // Decode from base64
  serviceAccountKey = JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, "base64").toString("utf-8"));
} else {
  // Fallback for local development
  serviceAccountKey = require("./serviceAccountKey.json");
}

const app = initializeApp({
  credential: cert(serviceAccountKey),
});

const db = admin.firestore();
const auth = getAuth(app);

module.exports = { auth, db, FieledValue: admin.firestore.FieldValue };
