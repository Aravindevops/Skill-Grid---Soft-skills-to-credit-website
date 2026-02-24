
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyClFblVhaSPMWTXZTMisxxwkYrcg6iCkYI",
  authDomain: "skillgrid-b9ded.firebaseapp.com",
  projectId: "skillgrid-b9ded",
  storageBucket: "skillgrid-b9ded.firebasestorage.app",
  messagingSenderId: "297728445074",
  appId: "1:297728445074:web:acbb23e535c82f94f4344b",
  measurementId: "G-RQFXMZ2T4J"
};

let app;
let auth: Auth;
let googleProvider: GoogleAuthProvider;
let analytics: Analytics;
let db: Firestore;
let storage: FirebaseStorage;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  analytics = getAnalytics(app);
  db = getFirestore(app);
  storage = getStorage(app);
  console.log("Firebase initialized successfully!");
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export { auth, googleProvider, analytics, db, storage };
