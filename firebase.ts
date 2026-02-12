
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getAnalytics, Analytics } from "firebase/analytics";

// TEMPORARY: Hardcoded config for debugging
const firebaseConfig = {
  apiKey: "AIzaSyClFblVhaSPMWTXZTMisxxwkYrcg6iCkYI",
  authDomain: "skillgrid-b9ded.firebaseapp.com",
  projectId: "skillgrid-b9ded",
  storageBucket: "skillgrid-b9ded.firebasestorage.app",
  messagingSenderId: "297728445074",
  appId: "1:297728445074:web:acbb23e535c82f94f4344b",
  measurementId: "G-RQFXMZ2T4J"
};

console.log("Firebase Config (Hardcoded):", {
  apiKey: firebaseConfig.apiKey?.substring(0, 10) + "...",
  projectId: firebaseConfig.projectId
});

let app;
let auth: Auth;
let googleProvider: GoogleAuthProvider;
let analytics: Analytics;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  analytics = getAnalytics(app);
  console.log("Firebase initialized successfully!");
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export { auth, googleProvider, analytics };
