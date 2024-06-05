// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDS3ObeGi2xIJQzcYCkExGIUBdvkOq4VUU",
  authDomain: "cmplegend-dba18.firebaseapp.com",
  projectId: "cmplegend-dba18",
  storageBucket: "cmplegend-dba18.appspot.com",
  messagingSenderId: "1044345720983",
  appId: "1:1044345720983:web:2ad771b47795f8b75499d2",
  measurementId: "G-2W6KKFQ0FM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
