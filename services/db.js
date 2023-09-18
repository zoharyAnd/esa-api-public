require("dotenv").config();
require('firebase');
// require('firebase/auth');
// require('firebase/database');

// const firebaseConfig = {
//   apiKey: process.env.API_KEY,
//   authDomain: process.env.AUTH_DOMAIN,
//   databaseUrl: process.env.DATABASE_URL,
//   projectId: process.env.PROJECT_ID,
//   storageBucket: process.env.STORAGE_BUCKET,
//   messagingSenderId: process.env.MESSAGING_SENDER_ID,
//   appId: process.env.APP_ID,
// };

// const firebaseApp = firebase.initializeApp(firebaseConfig);
// test


var admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIRESTORE_TYPE,
    project_id: process.env.FIRESTORE_PROJECT_ID,
    private_key_id: process.env.FIRESTORE_PRIVATE_KEY_ID,
    private_key: process.env.FIRESTORE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIRESTORE_CLIENT_EMAIL,
    client_id: process.env.FIRESTORE_CLIENT_ID,
    auth_uri: process.env.FIRESTORE_AUTH_URL,
    token_uri: process.env.FIRESTORE_TOKEN_URL,
    auth_provider_x509_cert_url: process.env.FIRESTORE_AUTH_PROVIDER,
    client_x509_cert_url: process.env.FIRESTORE_CLIENT_CERT_URL
  }),
  databaseURL: process.env.FIRESTORE_DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET
});

// app.locals.bucket = admin.storage().bucket();
const bucket = admin.storage().bucket();

const firebaseApp = admin.firestore();

module.exports = {
  firebaseApp,
  bucket,
}