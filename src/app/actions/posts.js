
import { collection, doc, getDoc, getDocs, limit, orderBy, query, writeBatch, where, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function getDashboardPosts() {
  cleanupExpiredPosts().catch(console.error);

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
      creatorYear: Number(postData.creatorYear || 1),
      credibilityScore: Number(postData.creatorCredibility || contributor.credibilityScore || 0),
      verificationCount: Number(postData.verificationCount || 0),
      verified: postData.verified === true,
      deadline: postData.deadline || "",
      createdAt: formatCreatedAt(postData.createdAt),
      createdBy: postData.createdBy,
    });
  }

  return posts;
}

export async function getUserPosts(userId) {
  if (!userId) return [];

  const postsCollection = collection(db, "posts");
  const postsQuery = query(postsCollection, orderBy("createdAt", "desc"));
  const postsSnapshot = await getDocs(postsQuery);
  const posts = [];

  for (const postDoc of postsSnapshot.docs) {
    const postData = postDoc.data();
    if (postData.createdBy === userId) {
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
        creatorYear: Number(postData.creatorYear || 1),
        credibilityScore: Number(postData.creatorCredibility || contributor.credibilityScore || 0),
        verificationCount: Number(postData.verificationCount || 0),
        verified: postData.verified === true,
        deadline: postData.deadline || "",
        createdAt: formatCreatedAt(postData.createdAt),
        createdBy: postData.createdBy,
      });
    }
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

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  postsSnapshot.forEach(function (postDoc) {
    const postData = postDoc.data();

    if (!postData.deadline) {
      return;
    }

    if (postData.deadline < todayStr) {
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

  if (badges.includes("New Contributor")) {
    return "New Contributor";
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

async function cleanupExpiredPosts() {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    const postsCollection = collection(db, "posts");
    const expiredQuery = query(postsCollection, where("deadline", "<", todayStr));
    const expiredSnapshot = await getDocs(expiredQuery);

    if (expiredSnapshot.empty) return;

    const batch = writeBatch(db);
    expiredSnapshot.docs.forEach((postDoc) => {
      batch.delete(postDoc.ref);
      const postData = postDoc.data();
      if (postData.createdBy) {
        const userRef = doc(db, "users", postData.createdBy);
        batch.update(userRef, {
          totalPosts: increment(-1),
        });
      }
    });

    await batch.commit();
    console.log(`Cleaned up ${expiredSnapshot.size} expired posts from Firestore.`);
  } catch (error) {
    console.error("Expired posts cleanup failed:", error);
  }
}
