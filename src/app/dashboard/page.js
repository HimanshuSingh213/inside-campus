"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { logoutUser } from "@/lib/users";
import {
  getDashboardPosts,
  getTrendingOpportunities,
  getUpcomingDeadlines,
  getUserPosts,
} from "@/app/actions/posts";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { verifyPost } from "@/lib/posts";
import { useRouter } from "next/navigation";
import {
  Search,
  Home,
  TrendingUp,
  Award,
  Briefcase,
  Bookmark,
  User,
  Bell,
  Star,
  LogOut,
} from "lucide-react";

const filters = ["All", "Urgent", "Verified", "Internship", "Scholarship"];

export default function DashboardPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("Home");
  const [activeFilter, setActiveFilter] = useState("All");
  const [posts, setPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [trendingItems, setTrendingItems] = useState([]);
  const [deadlineItems, setDeadlineItems] = useState([]);
  const [savedPostIds, setSavedPostIds] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const isLoggedIn = Boolean(currentUser);
  const isSenior = isLoggedIn && Number(currentUser?.year) >= 3;

  useEffect(function loadAuth() {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setCurrentUser({ uid: user.uid, ...userSnap.data() });
          } else {
            setCurrentUser({ uid: user.uid, name: user.displayName || user.email });
          }
        } catch (error) {
          console.error("Failed to load user profile:", error);
          setCurrentUser({ uid: user.uid, name: user.displayName || user.email });
        }
      } else {
        setCurrentUser(null);
        router.push("/login");
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(function loadDashboardData() {
    if (authLoading) return; // Wait until Firebase Auth is ready

    async function loadData() {
      try {
        setPostsLoading(true);
        setPostsError("");

        const dashboardPosts = await getDashboardPosts();
        const trending = await getTrendingOpportunities();
        const deadlines = await getUpcomingDeadlines();
        const myPosts = currentUser ? await getUserPosts(currentUser.uid) : [];

        setPosts(dashboardPosts);
        setTrendingItems(trending);
        setDeadlineItems(deadlines);
        setUserPosts(myPosts);
      } catch (error) {
        setPostsError(error.message || "Could not load dashboard posts.");
      } finally {
        setPostsLoading(false);
      }
    }

    loadData();
  }, [authLoading]);

  async function handleVerify(postId) {
    if (!isLoggedIn) {
      return;
    }

    try {
      // Optimistic update
      setPosts((oldPosts) =>
        oldPosts.map((post) =>
          post.id === postId ? { ...post, verificationCount: post.verificationCount + 1 } : post
        )
      );
      setTrendingItems((oldItems) =>
        oldItems.map((post) =>
          post.id === postId ? { ...post, verificationCount: post.verificationCount + 1 } : post
        )
      );
      setUserPosts((oldPosts) =>
        oldPosts.map((post) =>
          post.id === postId ? { ...post, verificationCount: post.verificationCount + 1 } : post
        )
      );

      await verifyPost(postId, currentUser.uid);
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to verify post.");
      
      // Revert optimistic update
      setPosts((oldPosts) =>
        oldPosts.map((post) =>
          post.id === postId ? { ...post, verificationCount: post.verificationCount - 1 } : post
        )
      );
      setTrendingItems((oldItems) =>
        oldItems.map((post) =>
          post.id === postId ? { ...post, verificationCount: post.verificationCount - 1 } : post
        )
      );
      setUserPosts((oldPosts) =>
        oldPosts.map((post) =>
          post.id === postId ? { ...post, verificationCount: post.verificationCount - 1 } : post
        )
      );
    }
  }

  function savePost(postId) {
    if (!isLoggedIn) {
      return;
    }

    if (savedPostIds.includes(postId)) {
      setSavedPostIds((oldSavedIds) => {
        return oldSavedIds.filter((savedId) => {
          return savedId !== postId;
        });
      });

      return;
    }

    setSavedPostIds((oldSavedIds) => {
      return [...oldSavedIds, postId];
    });
  }

  const visiblePosts = getVisiblePosts({
    posts,
    activeSection,
    activeFilter,
    searchText,
    savedPostIds,
  });

  return (
    <main className="min-h-screen bg-background text-text">
      <Navbar 
        currentUser={currentUser} 
        searchText={searchText} 
        onSearchChange={setSearchText} 
        onSectionChange={setActiveSection} 
      />

      <div className="mx-auto flex max-w-[1440px] gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <Sidebar
          activeSection={activeSection}
          isLoggedIn={isLoggedIn}
          isSenior={isSenior}
          onSectionChange={setActiveSection}
        />

        <section className="min-w-0 flex-1">
          <MobileNavigation
            activeSection={activeSection}
            isLoggedIn={isLoggedIn}
            isSenior={isSenior}
            onSectionChange={setActiveSection}
          />

          {activeSection === "Profile" ? (
            <ProfileView
              user={currentUser}
              userPosts={userPosts}
              onVerify={handleVerify}
              onSave={savePost}
              savedPostIds={savedPostIds}
            />
          ) : (
            <>
              <FeedHeader
                activeSection={activeSection}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                isLoggedIn={isLoggedIn}
              />

              <Feed
                posts={visiblePosts}
                loading={postsLoading}
                error={postsError}
                isLoggedIn={isLoggedIn}
                savedPostIds={savedPostIds}
                onVerify={handleVerify}
                onSave={savePost}
              />

              {activeSection === "Home" ? (
                <div className="mt-6 grid gap-4 xl:hidden">
                  <TrendingWidget items={trendingItems} loading={postsLoading} />
                  <DeadlineWidget items={deadlineItems} loading={postsLoading} />
                </div>
              ) : null}
            </>
          )}
        </section>

        {activeSection === "Home" ? (
          <aside className="hidden w-[300px] shrink-0 space-y-4 xl:block">
            <TrendingWidget items={trendingItems} loading={postsLoading} />
            <DeadlineWidget items={deadlineItems} loading={postsLoading} />
          </aside>
        ) : null}
      </div>
    </main>
  );
}

function ProfileView({ user, userPosts, onVerify, onSave, savedPostIds }) {
  if (!user) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
      {/* Left Column */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-secondary/25 bg-text/[0.035] p-6 shadow-xl shadow-black/20">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="h-[72px] w-[72px] rounded-full bg-primary/20 text-2xl font-bold text-primary flex items-center justify-center mb-4 border-2 border-primary/30">
              {getInitials(user.name)}
            </div>
            <h2 className="text-xl font-bold leading-tight">{user.name}</h2>
            <p className="text-sm text-text/55 mt-1 leading-relaxed">
              {user.year ? `${user.year}${["1","2","3","4"].includes(String(user.year)) ? (String(user.year) === "1" ? "st" : String(user.year) === "2" ? "nd" : String(user.year) === "3" ? "rd" : "th") : ""} year` : "Year not set"} · {user.branch || "Branch not set"}
              <br />
              {user.college || "College not set"}
            </p>
          </div>

          <div className="mt-8">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-text/60">Credibility score</span>
              <span className="font-bold">{user.credibilityScore || 0}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-background/50 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-1000"
                style={{ width: `${user.credibilityScore || 0}%` }}
              />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-secondary/20 pt-6 px-1">
            <div className="text-center">
              <div className="text-base font-bold">{user.totalPosts || 0}</div>
              <div className="text-[9px] text-text/50 uppercase tracking-widest mt-1 font-semibold">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-base font-bold">{user.verifiedPosts || 0}</div>
              <div className="text-[9px] text-text/50 uppercase tracking-widest mt-1 font-semibold">Verified</div>
            </div>
            <div className="text-center">
              <div className="text-base font-bold">{savedPostIds.length}</div>
              <div className="text-[9px] text-text/50 uppercase tracking-widest mt-1 font-semibold">Saves</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-secondary/25 bg-text/[0.035] p-6 shadow-xl shadow-black/20">
          <h3 className="text-[10px] font-bold text-text/50 uppercase tracking-widest mb-5">Reputation badges</h3>
          <div className="space-y-5">
            {(user.badges || []).map((badge) => (
              <div key={badge} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-primary/20 bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Award size={14} strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-text/90">{badge}</div>
                  <div className="text-[10px] text-text/50 mt-0.5">Earned milestone</div>
                </div>
              </div>
            ))}
            {!(user.badges && user.badges.length > 0) && (
              <p className="text-sm text-text/50">No badges earned yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-2 ml-1">
          <Star className="text-primary" size={16} strokeWidth={2.5} />
          <h2 className="text-sm font-bold tracking-tight">Contribution history</h2>
        </div>

        <Feed
          posts={userPosts}
          loading={false}
          error=""
          isLoggedIn={true}
          savedPostIds={savedPostIds}
          onVerify={onVerify}
          onSave={onSave}
        />
      </div>
    </div>
  );
}

function Navbar({ currentUser, searchText, onSearchChange, onSectionChange }) {
  const isLoggedIn = Boolean(currentUser);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleProfileClick = () => {
    onSectionChange("Profile");
    setDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-secondary/20 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex shrink-0 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-background">
            IC
          </div>
          <span className="hidden text-sm font-semibold sm:block">Inside Campus</span>
        </Link>

        <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-xl border border-secondary/25 bg-text/[0.035] px-3 text-sm text-text/45">
          <Icon name="search" />
          <input
            type="search"
            value={searchText}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search opportunities, colleges, contributors..."
            className="w-full bg-transparent text-text outline-none placeholder:text-text/40"
          />
        </label>

        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            <button className="hidden rounded-xl border border-secondary/25 bg-text/[0.035] px-3 py-2 text-sm text-text/70 transition hover:border-primary/40 hover:text-text sm:block">
              Notifications
            </button>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/25 bg-primary/15 text-sm font-semibold text-primary transition hover:bg-primary/25 hover:shadow-lg hover:shadow-primary/20"
              >
                {getInitials(currentUser.name)}
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-secondary/25 bg-background p-1 shadow-2xl shadow-black/40 z-50">
                    <button
                      onClick={handleProfileClick}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text/80 transition hover:bg-white/[0.04] hover:text-text"
                    >
                      <User size={16} />
                      Profile
                    </button>
                    <div className="my-1 h-px w-full bg-secondary/20" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-accent transition hover:bg-accent/10"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex shrink-0 items-center gap-2">
            <Link href="/login" className="rounded-xl border border-secondary/25 px-4 py-2 text-sm text-text/75 transition hover:border-primary/40 hover:text-text">
              Login
            </Link>
            <Link href="/register" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-background transition hover:opacity-90">
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

function Sidebar({ activeSection, isLoggedIn, isSenior, onSectionChange }) {
  const basicItems = ["Home", "Trending", "Scholarships", "Internships"];
  const userItems = ["Saved", "Profile", "Notifications"];

  return (
    <aside className="sticky top-[76px] hidden h-[calc(100vh-96px)] w-60 shrink-0 flex-col justify-between rounded-2xl border border-secondary/20 bg-text/2.5 p-3 lg:flex">
      <div>
        <nav className="space-y-1">
          {basicItems.map(function (item) {
            return (
              <SidebarItem
                key={item}
                label={item}
                active={item === activeSection}
                onClick={() => onSectionChange(item)}
              />
            );
          })}

          {isLoggedIn ? (
            <div className="mt-4 border-t border-secondary/20 pt-4">
              {userItems.map(function (item) {
                return (
                  <SidebarItem
                    key={item}
                    label={item}
                    active={item === activeSection}
                    onClick={() => onSectionChange(item)}
                  />
                );
              })}
            </div>
          ) : null}
        </nav>
      </div>

      <div className="space-y-3">
        {isSenior ? (
          <Link
            href="/submit"
            className="flex h-11 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-background shadow-lg shadow-primary/15 transition hover:opacity-90"
          >
            Submit Update
          </Link>
        ) : null}

        {isLoggedIn ? (
          <div className="rounded-2xl border border-secondary/20 bg-background/60 p-3">
            <p className="text-sm font-semibold">You</p>
            <p className="mt-1 text-xs text-text/55">
              {isSenior ? "Senior contributor" : "Student contributor"}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-secondary/25 bg-background/60 p-3 text-sm leading-6 text-text/65">
            Login to contribute and verify updates.
          </div>
        )}
      </div>
    </aside>
  );
}

function SidebarItem({ label, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition " +
        (active
          ? "bg-primary/15 text-text"
          : "text-text/58 hover:bg-text/4 hover:text-text")
      }
    >
      <Icon name={label.toLowerCase()} />
      {label}
    </button>
  );
}

function MobileNavigation({ activeSection, isLoggedIn, isSenior, onSectionChange }) {
  return (
    <div className="mb-5 flex gap-2 overflow-x-auto pb-1 lg:hidden">
      {["Home", "Trending", "Scholarships", "Internships"].map(function (item) {
        const active = item === activeSection;

        return (
          <button
            key={item}
            onClick={() => onSectionChange(item)}
            className={
              "shrink-0 rounded-full border px-4 py-2 text-sm " +
              (active
                ? "border-primary/45 bg-primary/15 text-text"
                : "border-secondary/25 bg-text/[0.035] text-text/70")
            }
          >
            {item}
          </button>
        );
      })}

      {isLoggedIn ? (
        <button
          onClick={() => onSectionChange("Saved")}
          className="shrink-0 rounded-full border border-secondary/25 bg-text/[0.035] px-4 py-2 text-sm text-text/70"
        >
          Saved
        </button>
      ) : null}

      {isSenior ? (
        <Link
          href="/submit"
          className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-background"
        >
          Submit Update
        </Link>
      ) : null}
    </div>
  );
}

function FeedHeader({ activeSection, activeFilter, onFilterChange, isLoggedIn }) {
  const title = getSectionTitle(activeSection);

  return (
    <div className="mb-6 rounded-2xl border border-secondary/25 bg-text/2.5 p-5 sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-text/62">
            Verified opportunities surfaced for your college and branch.
          </p>
        </div>

        {!isLoggedIn ? (
          <p className="rounded-xl border border-primary/25 bg-primary/10 px-4 py-2 text-sm text-primary">
            Login to contribute and verify updates.
          </p>
        ) : null}
      </div>

      {activeSection === "Home" ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {filters.map(function (filter) {
            const active = filter === activeFilter;

            return (
              <button
                key={filter}
                onClick={() => onFilterChange(filter)}
                className={
                  "rounded-full border px-4 py-2 text-sm transition " +
                  (active
                    ? "border-primary/50 bg-primary/15 text-text"
                    : "border-secondary/25 bg-background/45 text-text/58 hover:border-primary/35 hover:text-text")
                }
              >
                {filter}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function Feed({ posts, loading, error, isLoggedIn, savedPostIds, onVerify, onSave }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-secondary/25 bg-text/[0.035] p-6 text-sm text-text/60">
        Loading updates...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-accent/35 bg-accent/10 p-6 text-sm text-accent">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-secondary/25 bg-text/[0.035] p-6">
        <h2 className="text-base font-semibold">No updates found yet</h2>
        <p className="mt-2 text-sm leading-6 text-text/58">
          Once students publish posts from the submit page, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map(function (post) {
        return (
          <InfoCard
            key={post.id}
            post={post}
            isLoggedIn={isLoggedIn}
            isSaved={savedPostIds.includes(post.id)}
            onVerify={onVerify}
            onSave={onSave}
          />
        );
      })}
    </div>
  );
}

function InfoCard({ post, isLoggedIn, isSaved, onVerify, onSave }) {
  const important = post.urgency === "High" || post.urgency === "Critical";

  return (
    <article className="rounded-2xl border border-secondary/25 bg-text/[0.035] p-5 shadow-xl shadow-black/20 transition hover:border-primary/25 sm:p-6">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span
          className={
            "rounded-full border px-3 py-1 font-medium " +
            (important
              ? "border-accent/40 bg-accent/10 text-accent"
              : "border-primary/30 bg-primary/10 text-primary")
          }
        >
          {post.urgency}
        </span>
        <span className="rounded-full border border-secondary/25 bg-background/45 px-3 py-1 text-text/60">
          {post.category}
        </span>
        <span className="ml-auto text-text/45">{post.createdAt}</span>
      </div>

      <h2 className="mt-4 text-lg font-semibold leading-7 text-text">{post.title}</h2>
      <p className="mt-2 text-sm leading-6 text-text/62">{post.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {(post.tags || []).map(function (tag) {
          return (
            <span
              key={tag}
              className="rounded-full border border-secondary/20 bg-background/45 px-3 py-1 text-xs text-text/48"
            >
              #{tag}
            </span>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-secondary/20 pt-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
            {getInitials(post.contributorName)}
          </div>
          <div>
            <p className="text-sm font-semibold">{post.contributorName}</p>
            <p className="text-xs text-text/50">{post.contributorRole}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs text-primary">
            {post.verificationCount} verifications
          </span>
          {post.credibilityScore > 0 ? (
            <span className="rounded-full border border-secondary/25 bg-background/45 px-3 py-1.5 text-xs text-text/65">
              {post.credibilityScore}% credibility
            </span>
          ) : null}
          <button
            disabled={!isLoggedIn}
            onClick={() => onVerify(post.id)}
            className="rounded-xl border border-primary/30 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-45"
          >
            Verify
          </button>
          <button
            disabled={!isLoggedIn}
            onClick={() => onSave(post.id)}
            className="rounded-xl border border-secondary/25 px-3 py-2 text-xs font-semibold text-text/70 transition hover:border-primary/35 hover:text-text disabled:cursor-not-allowed disabled:opacity-45"
          >
            {isSaved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </article>
  );
}

function TrendingWidget({ items, loading }) {
  return (
    <section className="rounded-2xl border border-secondary/25 bg-text/[0.035] p-5">
      <h2 className="text-sm font-semibold">Trending Opportunities</h2>
      <div className="mt-4 space-y-3">
        {loading ? <p className="text-sm text-text/45">Loading...</p> : null}

        {!loading && items.length === 0 ? (
          <p className="text-sm text-text/45">No trending posts yet.</p>
        ) : null}

        {!loading && items.map(function (item) {
          return (
            <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
              <span className="line-clamp-2 text-text/78">{item.title}</span>
              <span className="shrink-0 text-xs text-text/38">{item.count} verifies</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function DeadlineWidget({ items, loading }) {
  return (
    <section className="rounded-2xl border border-secondary/25 bg-text/[0.035] p-5">
      <h2 className="text-sm font-semibold">Upcoming Deadlines</h2>
      <div className="mt-4 space-y-3">
        {loading ? <p className="text-sm text-text/45">Loading...</p> : null}

        {!loading && items.length === 0 ? (
          <p className="text-sm text-text/45">No deadlines added yet.</p>
        ) : null}

        {!loading && items.map(function (item) {
          return (
            <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
              <span className="line-clamp-2 text-text/78">{item.title}</span>
              <span
                className={
                  "shrink-0 rounded-full px-2 py-1 text-xs " +
                  (item.urgent ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary")
                }
              >
                {item.date}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function getVisiblePosts({ posts, activeSection, activeFilter, searchText, savedPostIds }) {
  let visiblePosts = posts;

  if (activeSection === "Trending") {
    visiblePosts = [...visiblePosts].sort(function (firstPost, secondPost) {
      return secondPost.verificationCount - firstPost.verificationCount;
    });
  }

  if (activeSection === "Scholarships") {
    visiblePosts = visiblePosts.filter(function (post) {
      return post.category === "Scholarship";
    });
  }

  if (activeSection === "Internships") {
    visiblePosts = visiblePosts.filter(function (post) {
      return post.category === "Internship";
    });
  }

  if (activeSection === "Saved") {
    visiblePosts = visiblePosts.filter(function (post) {
      return savedPostIds.includes(post.id);
    });
  }

  if (activeFilter === "Urgent") {
    visiblePosts = visiblePosts.filter(function (post) {
      return post.urgency === "High" || post.urgency === "Critical";
    });
  }

  if (activeFilter === "Verified") {
    visiblePosts = visiblePosts.filter(function (post) {
      return post.verified === true;
    });
  }

  if (activeFilter === "Internship") {
    visiblePosts = visiblePosts.filter(function (post) {
      return post.category === "Internship";
    });
  }

  if (activeFilter === "Scholarship") {
    visiblePosts = visiblePosts.filter(function (post) {
      return post.category === "Scholarship";
    });
  }

  if (searchText.trim() !== "") {
    const search = searchText.toLowerCase();

    visiblePosts = visiblePosts.filter(function (post) {
      const tags = (post.tags || []).join(" ");
      const searchableText = [
        post.title,
        post.description,
        post.category,
        post.contributorName,
        tags,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(search);
    });
  }

  return visiblePosts;
}

function getSectionTitle(activeSection) {
  if (activeSection === "Trending") {
    return "Trending Now";
  }

  if (activeSection === "Scholarships") {
    return "Scholarships";
  }

  if (activeSection === "Internships") {
    return "Internship Opportunities";
  }

  if (activeSection === "Saved") {
    return "Saved Updates";
  }

  if (activeSection === "Profile") {
    return "Profile Overview";
  }

  if (activeSection === "Notifications") {
    return "Notifications";
  }

  return "Today's Updates";
}

function Icon({ name }) {
  const icons = {
    search: Search,
    home: Home,
    trending: TrendingUp,
    scholarships: Award,
    internships: Briefcase,
    saved: Bookmark,
    profile: User,
    notifications: Bell,
  };

  const LucideIcon = icons[name] || Home;

  return <LucideIcon className="h-4 w-4 shrink-0" strokeWidth={1.8} />;
}

function getInitials(name) {
  return name
    .split(" ")
    .map(function (word) {
      return word[0];
    })
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
