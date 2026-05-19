import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAhmVvI4nvkcr9LBzZAdjv4zD_WnBXimEs",
    authDomain: "the-conscious-chronicles.firebaseapp.com",
    projectId: "the-conscious-chronicles",
    storageBucket: "the-conscious-chronicles.firebasestorage.app",
    messagingSenderId: "45814651601",
    appId: "1:45814651601:web:a3e58000d08520b96c83f0",
    measurementId: "G-SH0XZKXF6P"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
