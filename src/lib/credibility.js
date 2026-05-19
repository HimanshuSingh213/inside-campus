const institutionalEmailDomains = ["ipu.ac.in", "iiitd.ac.in", "dtu.ac.in", "nsut.ac.in"];

export function hasInstitutionalEmail(email = "") {
  const emailParts = email.toLowerCase().split("@");
  const domain = emailParts[1] || "";

  for (const institutionalDomain of institutionalEmailDomains) {
    const isExactMatch = domain === institutionalDomain;
    const isSubdomainMatch = domain.endsWith("." + institutionalDomain);

    if (isExactMatch || isSubdomainMatch) {
      return true;
    }
  }

  return false;
}

export function calculateCredibility(user) {
  const verifiedPosts = Math.max(0, Number(user.verifiedPosts) || 0);
  const totalPosts = Math.max(0, Number(user.totalPosts) || 0);
  const year = getYearNumber(user.year);

  // 1. Identity & Institution Trust (Base Score)
  const baseScore = user.verifiedInstitutionalEmail ? 65 : 40;

  // 2. Academic Seniority Modifier
  let academicModifier = 0;
  if (year === 1) academicModifier = 0;
  else if (year === 2) academicModifier = 5;
  else if (year === 3) academicModifier = 10;
  else if (year >= 4) academicModifier = 15;

  const credentialTrust = baseScore + academicModifier;

  let score = 0;

  // 3. Blended Contribution Performance
  if (totalPosts === 0) {
    score = credentialTrust;
  } else if (totalPosts < 3) {
    // Reward verified posts without penalizing unverified posts
    score = credentialTrust + (verifiedPosts * 5);
  } else {
    // 3 or more posts: blend credential trust and post accuracy (40% credentials, 60% verification rate)
    const verificationTrust = (verifiedPosts / totalPosts) * 100;
    score = (0.4 * credentialTrust) + (0.6 * verificationTrust);
  }

  score = Math.round(score);
  score = Math.max(0, Math.min(score, 100));

  return score;
}


export function getContributorBadges(user) {
  const badges = [];
  const year = getYearNumber(user.year);
  const totalPosts = Math.max(0, Number(user.totalPosts) || 0);

  if (totalPosts < 3) {
    badges.push("New Contributor");
  }

  if (year >= 3) {
    badges.push("Senior Contributor");
  }

  if (Number(user.credibilityScore) >= 80) {
    badges.push("Trusted Contributor");
  }

  if (Number(user.verifiedPosts) >= 5) {
    badges.push("Community Verified");
  }

  if (user.verifiedInstitutionalEmail) {
    badges.push("Institutional Email Verified");
  }

  return badges;
}

export function buildTrustFields(user) {
  const credibilityScore = calculateCredibility(user);
  const badges = getContributorBadges({
    ...user,
    credibilityScore,
  });

  return {
    credibilityScore,
    badges,
  };
}

function getYearNumber(year) {
  return Number.parseInt(String(year), 10) || 0;
}
