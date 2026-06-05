// Firebase project settings
const firebaseConfig = {
  apiKey: "AIzaSyCNvKJZAsiX227CmM8jECSXeOJnBMY-_WQ",
  authDomain: "assessment-3-e4563.firebaseapp.com",
  projectId: "assessment-3-e4563",
  storageBucket: "assessment-3-e4563.firebasestorage.app",
  messagingSenderId: "673526224139",
  appId: "1:673526224139:web:3fc3856c5c18e4aeaf3e0e",
  measurementId: "G-YJC4Z0QEW0"
};

// Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  getFirestore,
  query,
  serverTimestamp,
  where
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// Connect this web app to Firebase services
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Shared Firebase functions used by the other pages
export {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  onAuthStateChanged,
  query,
  serverTimestamp,
  signInWithEmailAndPassword,
  signOut,
  where
};
