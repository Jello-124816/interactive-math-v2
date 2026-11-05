
import { initializeApp } from 'firebase/app';

import {
  getAuth,
  GoogleAuthProvider
} from 'firebase/auth';

import { getFirestore } from 'firebase/firestore';

// Firebase project configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA06PahUFK7rfeKMaesu1qPgIeQB4QE_rk',
  authDomain: 'interactive-math-v2.firebaseapp.com',
  projectId: 'interactive-math-v2',
  storageBucket: 'interactive-math-v2.firebasestorage.app',
  messagingSenderId: '474014120871',
  appId: '1:474014120871:web:779e2e7e502f4c8d495482'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication
export const auth = getAuth(app);

// Google sign-in provider
export const googleProvider = new GoogleAuthProvider();

// Allow users to choose their Google account
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Cloud Firestore database
export const db = getFirestore(app);
