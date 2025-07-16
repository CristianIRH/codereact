// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRMTevuaXWSbt9O2QQ4s95DVbA2ipcYos",
  authDomain: "eva4-codereact-e6915.firebaseapp.com",
  projectId: "eva4-codereact-e6915",
  storageBucket: "eva4-codereact-e6915.firebasestorage.app",
  messagingSenderId: "869567333200",
  appId: "1:869567333200:web:829a03c22e6c2e5eda6255",
  measurementId: "G-MCDVVLBX2X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);