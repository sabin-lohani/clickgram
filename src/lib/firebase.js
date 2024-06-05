import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "clickgram-c0410.firebaseapp.com",
  projectId: "clickgram-c0410",
  storageBucket: "clickgram-c0410.appspot.com",
  messagingSenderId: "88531995042",
  appId: "1:88531995042:web:47592d5e4fae00fb6e0afb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
