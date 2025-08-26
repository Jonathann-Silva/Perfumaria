import { initializeApp, getApp, getApps, type FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyArQ_ubVkVG65jq2uWbf9CG0yX3PWyrMe4",
  authDomain: "autoflow-fd4n5.firebaseapp.com",
  projectId: "autoflow-fd4n5",
  storageBucket: "autoflow-fd4n5.appspot.com",
  messagingSenderId: "833766766449",
  appId: "1:833766766449:web:9bcc0930bfbc01e274e8d0"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
