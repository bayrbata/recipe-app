// plugins/firebase.ts
import { defineNuxtPlugin } from "#app";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore } from "firebase/firestore";  // Import Firestore
import { getStorage } from "firebase/storage";


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHQAnmJlgEkFrz-b0E7xCvepSY2YRtoPY",
  authDomain: "recipe-app-4fed8.firebaseapp.com",
  projectId: "recipe-app-4fed8",
  storageBucket: "recipe-app-4fed8.firebasestorage.app",
  messagingSenderId: "90280173564",
  appId: "1:90280173564:web:eed02e8a11afeba83e1c79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const storage = getStorage(app); // Initialize Firebase Storage

// Initialize Firestore
const db = getFirestore(app);

export default defineNuxtPlugin(() => {
  return {
    provide: {
      storage,
      auth,
      googleProvider,
      facebookProvider,
      db,
      collection,
      addDoc,
      getDocs,
      deleteDoc,
      doc,
    },
  };
});
