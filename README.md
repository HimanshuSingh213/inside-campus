# Inside Campus 🎓

**Inside Campus** is a premium, high-fidelity college opportunities platform built specifically for students. It bridges the gap between senior students who have experienced campus life and juniors/freshers who need accurate, reliable, and timely college updates.

The platform serves as a single, verified source of truth for hidden institutional knowledge, ensuring that critical campus opportunities are never lost in chaotic group chats.

---

## 🌟 Key Platform Features

### 1. Unified Opportunity Feed
* **College-Specific Filtering:** Instantly see announcements, deadlines, and guidelines relevant strictly to your college and branch.
* **Double-Filtering Controls:** Filter posts by category (Internships or Scholarships) and urgency/status (All, Urgent, or Community-Verified) in a single click.
* **Instant Search:** Quickly find specific opportunities, companies, subjects, tags, or contributors with instant, client-side fuzzy searching.

### 2. Peer Verification System
To ensure absolute reliability, Inside Campus does not rely on a single moderator. Instead, it utilizes **community consensus**:
* Any logged-in student can click **Verify** on an update.
* Once a post achieves **3 peer verifications**, the post is formally certified and labeled as **"Verified"** across the platform.

### 3. Smart Opportunity Actions
* **Submit Updates:** A simple and intuitive posting interface allowing contributors to share titles, descriptions, categories, urgency levels, deadlines, and searchable tags.
* **Personal Save List:** Save posts to a personal bookmark collection, making them instantly accessible from your sidebar for later reference.
* **Self-Service Deletions:** Post authors can remove their own published updates directly from the dashboard, which automatically cleanses them from the global feed and database.

---

## 🛡️ Multi-Factor Trust Engine (Credibility Scores)

The **Credibility Score** represents how reliable a contributor is on the platform. It is calculated using a robust **Multi-Factor Trust Engine** to make sure new users aren't unfairly marked with low scores, while active spammers are naturally filtered out.

Your score is calculated in three simple steps:

### Step 1: Identity & Institution Trust (Base Score)
Proving you are a legitimate student at an approved university (using domains like `@dtu.ac.in`, `@nsut.ac.in`, `@iiitd.ac.in`, or `@ipu.ac.in`) is a strong signal of reliability:
* **Verified Institutional Email:** Starts with a high-fidelity baseline of **`65%`** credibility.
* **General Email:** Starts with a **`40%`** baseline.

### Step 2: Academic Seniority Boost
Seniors and final-year students have accumulated multiple years of campus experience, which increases the accuracy of their shared insights. We award a gradual modifier based on your college year:
* **1st Year:** `+0%` boost
* **2nd Year:** `+5%` boost
* **3rd Year:** `+10%` boost
* **4th Year & Above:** `+15%` boost

> **Example:** A 3rd-year student with a verified institutional email starts with a strong baseline **Credential Trust** of **`75%`** (`65%` base + `10%` seniority).

### Step 3: Contribution Performance (Post Accuracy)
As you actively post updates, your score adjusts to reflect the community's trust in your shared information:
* **New Contributors (Under 3 Posts):** We protect new users from being penalized for posts that haven't been verified yet. Instead, we add a encouraging reward of **`+5%`** for every post that gets successfully verified.
* **Active Contributors (3 or More Posts):** We dynamically blend your identity trust and actual verification rate:
  $$\text{Credibility Score} = (40\% \times \text{Credential Trust}) + (60\% \times \text{Post Verification Rate})$$

This blending ensures that active, reliable contributors can easily reach **`90% - 100%`** credibility, while users who share unverified spam or false rumors see their scores safely deflate without losing their verified student status.

---

## 🏅 Reputation Badges

Inside Campus displays special milestones as badges on student profiles to showcase experience and accuracy:

| Badge | How to Earn It |
| :--- | :--- |
| **🌱 New Contributor** | Automatically assigned to users with fewer than 3 total posts. |
| **🎓 Senior Contributor** | Awarded automatically if you are in your 3rd year or higher. |
| **📧 Institutional Email Verified** | Earned by verifying your registration with a recognized university email. |
| **✅ Community Verified** | Earned when you have successfully published at least 5 fully-verified posts. |
| **⭐ Trusted Contributor** | Awarded to outstanding contributors who maintain a Credibility Score of **`80%` or higher**. |

---

## 💻 Tech Stack

Inside Campus is engineered with a modern, lightning-fast stack:
* **Frontend Framework:** Next.js (App Router, Server Actions)
* **Styling Engine:** Vanilla CSS custom theme & Tailwind CSS utility system
* **Icons:** Lucide React
* **Backend Database:** Firebase Firestore (with high-performance multi-document atomic transactions)
* **Authentication:** Firebase Authentication

---

## 🚀 Getting Started

To run the application locally:

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Run the local development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to experience the application.
