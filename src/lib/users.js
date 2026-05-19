import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { buildTrustFields, hasInstitutionalEmail } from "./credibility";
import { auth, db } from "./firebase";

export async function registerUser(formData) {

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    formData.email,
    formData.password
  );

  const firebaseUser = userCredential.user;

  if (formData.name) {
    await updateProfile(firebaseUser, {
      displayName: formData.name,
    });
  }

  const verifiedInstitutionalEmail = hasInstitutionalEmail(formData.email);

  let newUser = {
    name: formData.name || "",
    email: firebaseUser.email || formData.email,
    college: formData.college || "",
    branch: formData.branch || "",
    year: formData.year || "",
    verifiedInstitutionalEmail: verifiedInstitutionalEmail,
    totalPosts: 0,
    verifiedPosts: 0,
    credibilityScore: 0,
    badges: [],
    createdAt: serverTimestamp(),
  };

  const trustFields = buildTrustFields(newUser);
  newUser = {
    ...newUser,
    ...trustFields,
  };

  const userRef = doc(db, "users", firebaseUser.uid);
  await setDoc(userRef, newUser);

  return {
    uid: firebaseUser.uid,
    ...newUser,
  };
}

export async function loginUser(formData) {

  const userCredential = await signInWithEmailAndPassword(
    auth,
    formData.email,
    formData.password
  );

  return userCredential.user;
}

export async function logoutUser() {
  await signOut(auth);
}
