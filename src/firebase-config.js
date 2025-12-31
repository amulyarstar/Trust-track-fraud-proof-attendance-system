// firebase-config.js - FIXED
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzLeWzpK49u5um-nrUY2taKNAuLybpshw",
  authDomain: "fraud-proof-attendance-tracker.firebaseapp.com",
  projectId: "fraud-proof-attendance-tracker",
  storageBucket: "fraud-proof-attendance-tracker.firebasestorage.app",
  messagingSenderId: "365571732856",
  appId: "1:365571732856:web:0788ce1df5264d8a45848d",
  measurementId: "G-GP1GMYW825"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// If you need storage for files/images
const storage = getStorage(app);

// Export everything you need
export { app, analytics, auth, db, storage };
