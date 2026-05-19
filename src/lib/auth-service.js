/**
 * Firebase Authentication Service
 * Handles user signup, login, logout, and profile management
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

/**
 * Sign up a new user
 * @param {Object} userData - User data object
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @param {string} userData.collegeName - User's college name
 * @param {string} userData.branch - User's branch
 * @param {string} userData.year - User's academic year
 * @returns {Promise<Object>} Created user object
 */
export const signupUser = async (userData) => {
  try {
    // Validate input
    if (!userData.email || !userData.password) {
      throw new Error('Email and password are required');
    }

    // Set persistence before creating user
    await setPersistence(auth, browserLocalPersistence);

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );

    const user = userCredential.user;

    // Update user profile with display name
    await updateProfile(user, {
      displayName: userData.name,
    });

    // Store additional user data in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      name: userData.name,
      email: userData.email,
      collegeName: userData.collegeName,
      branch: userData.branch,
      year: userData.year,
      credibilityScore: 0,
      totalPosts: 0,
      verifiedPosts: 0,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      verified: false,
      isActive: true,
    });

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  } catch (error) {
    // Handle specific Firebase errors
    const errorMessages = {
      'auth/email-already-in-use': 'This email is already registered. Please try logging in.',
      'auth/invalid-email': 'Invalid email address format.',
      'auth/weak-password': 'Password is too weak. Use 8+ characters with uppercase, lowercase, and numbers.',
      'auth/operation-not-allowed': 'Account creation is currently disabled.',
      'auth/too-many-requests': 'Too many signup attempts. Please try again later.',
    };

    const errorMessage = errorMessages[error.code] || error.message;
    throw new Error(errorMessage);
  }
};

/**
 * Sign in an existing user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} Logged in user object
 */
export const loginUser = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Set persistence
    await setPersistence(auth, browserLocalPersistence);

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user additional data from Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        ...userData,
      };
    }

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    };
  } catch (error) {
    const errorMessages = {
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/too-many-requests': 'Too many login attempts. Please try again later.',
    };

    const errorMessage = errorMessages[error.code] || error.message;
    throw new Error(errorMessage);
  }
};

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error('Failed to logout: ' + error.message);
  }
};

/**
 * Get current user data from Firestore
 * @param {string} uid - User ID
 * @returns {Promise<Object>} User data object
 */
export const getUserData = async (uid) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return userDocSnap.data();
    } else {
      throw new Error('User data not found');
    }
  } catch (error) {
    throw new Error('Failed to fetch user data: ' + error.message);
  }
};

/**
 * Update user profile information
 * @param {string} uid - User ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (uid, updates) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    
    // Update profile name in Auth if provided
    if (updates.name && auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: updates.name,
      });
    }

    // Update Firestore document
    await updateDoc(userDocRef, {
      ...updates,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    throw new Error('Failed to update profile: ' + error.message);
  }
};

/**
 * Send password reset email
 * @param {string} email - User's email
 * @returns {Promise<void>}
 */
export const sendPasswordResetEmail = async (email) => {
  try {
    if (!email) {
      throw new Error('Email is required');
    }

    // This requires importing sendPasswordResetEmail from Firebase
    const { sendPasswordResetEmail: firebaseSendReset } = await import('firebase/auth');
    await firebaseSendReset(auth, email);
  } catch (error) {
    throw new Error('Failed to send reset email: ' + error.message);
  }
};

/**
 * Verify user email
 * @param {string} uid - User ID
 * @returns {Promise<void>}
 */
export const verifyUserEmail = async (uid) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
      verified: true,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    throw new Error('Failed to verify email: ' + error.message);
  }
};

/**
 * Delete user account
 * @param {string} uid - User ID
 * @returns {Promise<void>}
 */
export const deleteUserAccount = async (uid) => {
  try {
    // Delete from Firestore
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
      isActive: false,
      deletedAt: new Date().toISOString(),
    });

    // Delete from Firebase Auth
    if (auth.currentUser) {
      await auth.currentUser.delete();
    }
  } catch (error) {
    throw new Error('Failed to delete account: ' + error.message);
  }
};

/**
 * Get user credibility score
 * @param {string} uid - User ID
 * @returns {Promise<number>} Credibility score
 */
export const getCredibilityScore = async (uid) => {
  try {
    const userData = await getUserData(uid);
    const { verifiedPosts = 0, totalPosts = 0 } = userData;

    if (totalPosts === 0) return 0;
    return Math.round((verifiedPosts / totalPosts) * 100);
  } catch (error) {
    throw new Error('Failed to calculate credibility score: ' + error.message);
  }
};

/**
 * Update user posts count
 * @param {string} uid - User ID
 * @param {Object} counts - Post counts
 * @param {number} counts.totalPosts - Total posts
 * @param {number} counts.verifiedPosts - Verified posts
 * @returns {Promise<void>}
 */
export const updatePostCounts = async (uid, counts) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
      totalPosts: counts.totalPosts,
      verifiedPosts: counts.verifiedPosts,
      credibilityScore: (counts.verifiedPosts / counts.totalPosts) * 100,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    throw new Error('Failed to update post counts: ' + error.message);
  }
};

export default {
  signupUser,
  loginUser,
  logoutUser,
  getUserData,
  updateUserProfile,
  sendPasswordResetEmail,
  verifyUserEmail,
  deleteUserAccount,
  getCredibilityScore,
  updatePostCounts,
};
