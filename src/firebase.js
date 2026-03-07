// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase config snippet from the console
const firebaseConfig = {
  apiKey: "AIzaSyBmMgR2qgm5KwA3wdAdWcRA-Ct_5ZTbs2U",
  authDomain: "smartharvesting-f53ac.firebaseapp.com",
  projectId: "smartharvesting-f53ac",
  storageBucket: "smartharvesting-f53ac.firebasestorage.app",
  messagingSenderId: "831843197273",
  appId: "1:831843197273:web:6d39c549dd2bd2d9852c48",
  measurementId: "G-FHVCTZCSQR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
