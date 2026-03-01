import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAQajyJl_EgGS6AHO8mWMsanuwlfrItkvA",
  authDomain: "gamthub-dc.firebaseapp.com",
  projectId: "gamthub-dc",
  storageBucket: "gamthub-dc.firebasestorage.app",
  messagingSenderId: "368710462220",
  appId: "1:368710462220:web:459a7771204ff220a5b729",
  measurementId: "G-VSS8HNB3VY"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);