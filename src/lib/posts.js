import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { buildTrustFields } from "./credibility";
import { auth, db } from "./firebase";

export async function createPost(formData) {

  if (!auth.currentUser) {
    throw new Error("You must be logged in to create a post.");
  }

  const userId = auth.currentUser.uid;
  const userRef = doc(db, "users", userId);
  const userSnapshot = await getDoc(userRef);
  const userData = userSnapshot.exists() ? userSnapshot.data() : {};

  const newPost = {
    title: formData.title || "",
    description: formData.description || "",
    category: formData.category || "",
    college: formData.college || "",
    branch: formData.branch || "",
    urgency: formData.urgency || "",
    deadline: formData.deadline || "",
    tags: makeTagsArray(formData.tags),
    createdBy: userId,
    creatorYear: userData.year || "",
    creatorCredibility: userData.credibilityScore || 0,
    verificationCount: 0,
    verified: false,
    verifiedBy: [],
    createdAt: serverTimestamp(),
  };

  const postsCollection = collection(db, "posts");
  const postRef = await addDoc(postsCollection, newPost);

  if (userSnapshot.exists()) {
    const updatedUser = {
      ...userData,
      totalPosts: Number(userData.totalPosts || 0) + 1,
    };

    const trustFields = buildTrustFields(updatedUser);

    await updateDoc(userRef, {
      totalPosts: updatedUser.totalPosts,
      credibilityScore: trustFields.credibilityScore,
      badges: trustFields.badges,
    });
  }

  return {
    id: postRef.id,
    ...newPost,
  };
}

export async function getPosts() {
  const postsCollection = collection(db, "posts");
  const postsQuery = query(postsCollection, orderBy("createdAt", "desc"));
  const postsSnapshot = await getDocs(postsQuery);

  const posts = [];

  postsSnapshot.forEach(function (postDoc) {
    posts.push({
      id: postDoc.id,
      ...postDoc.data(),
    });
  });

  return posts;
}

export async function verifyPost(postId, userId) {
  if (!postId || !userId) {
    throw new Error("postId and userId are required.");
  }

  const postRef = doc(db, "posts", postId);

  return runTransaction(db, async function (transaction) {
    const postSnapshot = await transaction.get(postRef);

    if (!postSnapshot.exists()) {
      throw new Error("Post not found.");
    }

    const postData = postSnapshot.data();
    const verifiedBy = postData.verifiedBy || [];

    if (verifiedBy.includes(userId)) {
      throw new Error("You have already verified this post.");
    }

    const newVerificationCount = Number(postData.verificationCount || 0) + 1;
    const updatedVerifiedBy = [...verifiedBy, userId];
    const postIsAlreadyVerified = postData.verified === true;
    const postShouldBecomeVerified = !postIsAlreadyVerified && newVerificationCount >= 3;

    const postUpdate = {
      verificationCount: newVerificationCount,
      verifiedBy: updatedVerifiedBy,
    };

    if (postShouldBecomeVerified) {
      postUpdate.verified = true;
    }

    if (!postShouldBecomeVerified) {
      transaction.update(postRef, postUpdate);

      return {
        verified: postIsAlreadyVerified,
        verificationCount: newVerificationCount,
      };
    }

    const creatorId = postData.createdBy;

    if (!creatorId) {
      transaction.update(postRef, postUpdate);

      return {
        verified: true,
        verificationCount: newVerificationCount,
      };
    }

    const creatorRef = doc(db, "users", creatorId);
    const creatorSnapshot = await transaction.get(creatorRef);

    if (!creatorSnapshot.exists()) {
      transaction.update(postRef, postUpdate);

      return {
        verified: true,
        verificationCount: newVerificationCount,
      };
    }

    const creatorData = creatorSnapshot.data();
    const updatedCreator = {
      ...creatorData,
      verifiedPosts: Number(creatorData.verifiedPosts || 0) + 1,
    };
    const trustFields = buildTrustFields(updatedCreator);

    transaction.update(postRef, {
      ...postUpdate,
      creatorCredibility: trustFields.credibilityScore,
    });

    transaction.update(creatorRef, {
      verifiedPosts: updatedCreator.verifiedPosts,
      credibilityScore: trustFields.credibilityScore,
      badges: trustFields.badges,
    });

    return {
      verified: true,
      verificationCount: newVerificationCount,
      creatorCredibility: trustFields.credibilityScore,
    };
  });
}

function makeTagsArray(tags) {
  if (!tags) {
    return [];
  }

  if (Array.isArray(tags)) {
    return tags;
  }

  return tags
    .split(",")
    .map(function (tag) {
      return tag.trim();
    })
    .filter(function (tag) {
      return tag !== "";
    });
}
