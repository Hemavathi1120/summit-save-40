import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpcHSrUHBHON70iUzTznGsGN4Mb1hZjck",
  authDomain: "expenses-manager-3aa8c.firebaseapp.com",
  projectId: "expenses-manager-3aa8c",
  storageBucket: "expenses-manager-3aa8c.firebasestorage.app",
  messagingSenderId: "936020154461",
  appId: "1:936020154461:web:166ad08377abf22ff895b4",
  measurementId: "G-F3PVTGQ63X"
};

// Firebase is now configured
const isConfigured = true;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export { isConfigured };
export default app;