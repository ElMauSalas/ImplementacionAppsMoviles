
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAD9fXv_XAviynZCWKUyFB09CARy0pQHLg",
  authDomain: "fir-8e30c.firebaseapp.com",
  projectId: "fir-8e30c",
  storageBucket: "fir-8e30c.firebasestorage.app",
  messagingSenderId: "881175564557",
  appId: "1:881175564557:web:3af2b4b75097f14ca8a044",
  measurementId: "G-63W0TTNWHF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAuth(app);

