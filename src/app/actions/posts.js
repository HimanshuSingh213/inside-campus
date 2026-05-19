"use server";

import { collection, doc, getDoc, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function getDashboardPosts() {
  const postsCollection = collection(db, "posts");
  const postsQuery = query(postsCollection, orderBy("createdAt", "desc"), limit(20));
  const postsSnapshot = await getDocs(postsQuery);
  const posts = [];

  for (const postDoc of postsSnapshot.docs) {
    const postData = postDoc.data();
    const contributor = await getContributor(postData.createdBy);

    posts.push({
      id: postDoc.id,
      title: postData.title || "",
      description: postData.description || "",
      category: postData.category || "",
      urgency: postData.urgency || "Low",
      tags: Array.isArray(postData.tags) ? postData.tags : [],
      contributorName: contributor.name,
      contributorRole: contributor.role,
      credibilityScore: Number(postData.creatorCredibility || contributor.credibilityScore || 0),
      verificationCount: Number(postData.verificationCount || 0),
      verified: postData.verified === true,
      deadline: postData.deadline || "",
      createdAt: formatCreatedAt(postData.createdAt),
    });
  }

  return posts;
}

export async function getTrendingOpportunities() {
  const postsCollection = collection(db, "posts");
  const postsQuery = query(postsCollection, orderBy("verificationCount", "desc"), limit(5));
  const postsSnapshot = await getDocs(postsQuery);
  const trendingPosts = [];

  postsSnapshot.forEach(function (postDoc) {
    const postData = postDoc.data();

    trendingPosts.push({
      id: postDoc.id,
      title: postData.title || "",
      count: Number(postData.verificationCount || 0),
    });
  });

  return trendingPosts;
}

export async function getUpcomingDeadlines() {
  const postsCollection = collection(db, "posts");
  const postsQuery = query(postsCollection, orderBy("deadline", "asc"), limit(10));
  const postsSnapshot = await getDocs(postsQuery);
  const deadlines = [];

  postsSnapshot.forEach(function (postDoc) {
    const postData = postDoc.data();

    if (!postData.deadline) {
      return;
    }

    deadlines.push({
      id: postDoc.id,
      title: postData.title || "",
      date: formatDeadline(postData.deadline),
      urgent: postData.urgency === "High" || postData.urgency === "Critical",
    });
  });

  return deadlines.slice(0, 4);
}

async function getContributor(userId) {
  if (!userId) {
    return {
      name: "Inside Campus Contributor",
      role: "Community Contributor",
      credibilityScore: 0,
    };
  }

  const userRef = doc(db, "users", userId);
  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    return {
      name: "Inside Campus Contributor",
      role: "Community Contributor",
      credibilityScore: 0,
    };
  }

  const userData = userSnapshot.data();
  const badges = Array.isArray(userData.badges) ? userData.badges : [];

  return {
    name: userData.name || "Inside Campus Contributor",
    role: getContributorRole(badges),
    credibilityScore: Number(userData.credibilityScore || 0),
  };
}

function getContributorRole(badges) {
  if (badges.includes("Trusted Contributor")) {
    return "Trusted Contributor";
  }

  if (badges.includes("Senior Contributor")) {
    return "Senior Contributor";
  }

  if (badges.includes("Community Verified")) {
    return "Community Verified";
  }

  return "Community Contributor";
}

function formatCreatedAt(createdAt) {
  if (!createdAt || !createdAt.toDate) {
    return "Just now";
  }

  const createdDate = createdAt.toDate();
  const now = new Date();
  const minutesAgo = Math.floor((now.getTime() - createdDate.getTime()) / 60000);

  if (minutesAgo < 1) {
    return "Just now";
  }

  if (minutesAgo < 60) {
    return minutesAgo + "m ago";
  }

  const hoursAgo = Math.floor(minutesAgo / 60);

  if (hoursAgo < 24) {
    return hoursAgo + "h ago";
  }

  const daysAgo = Math.floor(hoursAgo / 24);
  return daysAgo + "d ago";
}

function formatDeadline(deadline) {
  const date = new Date(deadline);

  if (Number.isNaN(date.getTime())) {
    return deadline;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
