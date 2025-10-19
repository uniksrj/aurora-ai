import {initializeApp} from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBN42NFiK8OsvHqZkpouGrls_6h6R4l5LE",
  authDomain: "ai-image-4aebe.firebaseapp.com",
  projectId: "ai-image-4aebe",
  storageBucket: "ai-image-4aebe.firebasestorage.app",
  messagingSenderId: "785926259309",
  appId: "1:785926259309:web:8364ef8d22fa5d7bfdb564",
  measurementId: "G-NED6FSEZ3S"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);

// Export all auth functions
export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

// Export Firestore functions
export {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp
} from 'firebase/firestore';

export default app;