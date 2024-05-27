import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDtdWTIKm-vdC1mLLkVf-H-AQloMIIojzM",
  authDomain: "capstone-46186.firebaseapp.com",
  projectId: "capstone-46186",
  storageBucket: "capstone-46186.appspot.com",
  messagingSenderId: "954659151935",
  appId: "1:954659151935:web:e731844029a8e7350b588a",
  measurementId: "G-N6WKF8LBVF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
