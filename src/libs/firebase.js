import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "<user-key>",
  authDomain: "<user-auth-domain>",
  projectId: "<user-project-id>",
  storageBucket: "<user-storage-bucket>",
  messagingSenderId: "<user-messaging-sender-id>",
  appId: "<user-app-id>",
  measurementId: "<user-measurement-id>"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);