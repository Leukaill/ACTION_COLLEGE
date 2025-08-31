// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "campusai-dbxpd",
  appId: "1:721111430911:web:92c2a0e4ddf5e7699a7eca",
  storageBucket: "campusai-dbxpd.firebasestorage.app",
  apiKey: "AIzaSyD_NmtDfo6fTlFRD0uBQtHmtWHaHizoviI",
  authDomain: "campusai-dbxpd.firebaseapp.com",
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export { app };
