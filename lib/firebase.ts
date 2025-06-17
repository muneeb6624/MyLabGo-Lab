// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 


const firebaseConfig = {
  apiKey: "AIzaSyD_V_fev6TkcrIBInf9BUTLWK-XJQKCtNc",
  authDomain: "mylabgo-9dcb4.firebaseapp.com",
  projectId: "mylabgo-9dcb4",
  storageBucket: "mylabgo-9dcb4.appspot.com",
  messagingSenderId: "333597660008",
  appId: "1:333597660008:web:3e08744b7caa2c541cfcdd",
  measurementId: "G-1KV393YQ4S",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app); // ✅ Export auth

export { app };