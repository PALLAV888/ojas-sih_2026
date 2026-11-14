// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDI-uX4ztDDPe1WVPap-TdgpeDWNbBn6Co",
  authDomain: "ojasv3.firebaseapp.com",
  projectId: "ojasv3",
  storageBucket: "ojasv3.firebasestorage.app",
  messagingSenderId: "439790545450",
  appId: "1:439790545450:web:ad9ca7166443a54ad63153"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication only (Firestore and Storage not initialized)
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Safe stubs so Firestore is not initialized or used
export const db = null as any;
export const doc = (..._args: any[]) => null as any;
export const setDoc = async (..._args: any[]) => {};
export const getDoc = async (..._args: any[]) => ({ exists: () => false, data: () => null } as any);
export const updateDoc = async (..._args: any[]) => {};
export const collection = (..._args: any[]) => null as any;
export const query = (..._args: any[]) => null as any;
export const where = (..._args: any[]) => null as any;
export const orderBy = (..._args: any[]) => null as any;
export const getDocs = async (..._args: any[]) => ({ empty: true, docs: [] } as any);
export const serverTimestamp = () => new Date().toISOString();

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  onAuthStateChanged
};
export type { FirebaseUser };
