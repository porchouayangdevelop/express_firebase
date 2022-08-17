require('dotenv').config();
const {
    initializeApp,
    applicationDefault
} = require('firebase-admin/app');
const {
    getFirestore
} = require('firebase-admin/firestore');
const {
    initialize
} = require('fireorm');

const {
    getDatabase
} = require('firebase-admin/database');

initializeApp({
    credential: applicationDefault(),
    databaseURL: process.env.FIREBASE_DATABASE_URL
});

const fireStore = getFirestore();
const realtimeDB = getDatabase();
initialize(fireStore, realtimeDB);
module.exports = {
    fireStore,
    realtimeDB
}