
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCsPCYMdr3ogtU0Hon3s4pBe-N0o9hrInc",
  authDomain: "leftover-app-cc969.firebaseapp.com",
  projectId: "leftover-app-cc969",
  storageBucket: "leftover-app-cc969.appspot.com",
  messagingSenderId: "433684615099",
  appId: "1:433684615099:web:00320358770245ce45fe9e",
  measurementId: "G-SS2LESKVRS"
};


const app = initializeApp(firebaseConfig);


const auth = getAuth(app);


const db = getFirestore(app);


const loadAnalytics = async () => {
  if (typeof window !== 'undefined') {
    try {
      const { getAnalytics, isSupported } = await import('firebase/analytics');
      const analyticsSupported = await isSupported();
      
      if (analyticsSupported) {
        return getAnalytics(app);
      }
    } catch (error) {
      console.error("Analytics could not be loaded:", error);
    }
  }
  return null;
};

export { app, auth, db, loadAnalytics };