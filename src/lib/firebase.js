
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};


const requiredKeys = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);
if (missingKeys.length > 0) {
  console.warn(
    `Missing Firebase configuration keys: ${missingKeys.join(', ')}. 
    Please check your .env.local file.`
  );
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

// Optional: Connect to emulators for local development
// Uncomment these lines if you're using Firebase emulators
/*
if (process.env.NODE_ENV === 'development') {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    console.log('✅ Connected to Firebase emulators');
  } catch (error) {
    // Emulator already connected
  }
}
*/

export default app;

/**
 * SETUP INSTRUCTIONS FOR .env.local
 * 
 * Create a file named .env.local in your project root:
 * 
 * NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
 * NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
 * NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
 * NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
 * NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
 * NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
 * 
 * To find these values:
 * 1. Go to https://console.firebase.google.com
 * 2. Select your project
 * 3. Click on "Project Settings" (gear icon)
 * 4. Select your app under "Your apps"
 * 5. Copy the config values
 * 
 * IMPORTANT: Add .env.local to your .gitignore file
 * Add this line to .gitignore:
 * .env.local
 * 
 * NOTE: Variables prefixed with NEXT_PUBLIC_ are exposed to the browser
 * Use them only for non-sensitive configuration (API keys are okay since
 * Firebase security rules protect your data)
 */
