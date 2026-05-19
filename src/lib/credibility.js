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
  const verifiedPosts = Number(user.verifiedPosts) || 0;
  const totalPosts = Number(user.totalPosts) || 0;
  const year = getYearNumber(user.year);

  let score = 0;

  if (totalPosts >= 3) {
    score = (verifiedPosts / totalPosts) * 100;
  }

  if (user.verifiedInstitutionalEmail) {
    score = score + 5;
  }

  if (year >= 3) {
    score = score + 5;
  }

  score = Math.round(score);
  score = Math.min(score, 100);

  return score;
}

export function getContributorBadges(user) {
  const badges = [];
  const year = getYearNumber(user.year);

  if (Number(user.totalPosts) < 3) {
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
