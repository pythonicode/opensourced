// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfwxjRjBXEEsTzGgqPFByvcV5Plp59NvQ",
  authDomain: "opensourced-org.firebaseapp.com",
  projectId: "opensourced-org",
  storageBucket: "opensourced-org.appspot.com",
  messagingSenderId: "949572707282",
  appId: "1:949572707282:web:28619c5f7e4b7d1ff59e0b",
  measurementId: "G-MD8M7EPBS2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app)