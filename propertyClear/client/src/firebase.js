// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_82mmWSwdJn-zm8Nu8p1yCNItm_1Wrfo",
  authDomain: "clearproperty-d4203.firebaseapp.com",
  projectId: "clearproperty-d4203",
  storageBucket: "clearproperty-d4203.firebasestorage.app",
  messagingSenderId: "717959667587",
  appId: "1:717959667587:web:1f4dc89491b5cbe88220b6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase Auth instance
export const auth = getAuth(app);

export default app;
