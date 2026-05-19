"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getDashboardPosts,
  getTrendingOpportunities,
  getUpcomingDeadlines,
} from "@/app/actions/posts";

// const mockUser = {
//   name: "You",
//   year: 3,
//   role: "Senior Contributor",
//   credibilityScore: 88,
// };
const mockUser = null;

const filters = ["All", "Urgent", "Verified", "Internship", "Scholarship"];

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("Home");
  const [activeFilter, setActiveFilter] = useState("All");
  const [posts, setPosts] = useState([]);
  const [trendingItems, setTrendingItems] = useState([]);
  const [deadlineItems, setDeadlineItems] = useState([]);
  const [savedPostIds, setSavedPostIds] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState("");
  const currentUser = mockUser;
  const isLoggedIn = Boolean(currentUser);
  const isSenior = isLoggedIn && Number(currentUser.year) >= 3;

  useEffect(function loadDashboardData() {
    async function loadData() {
      try {
        setPostsLoading(true);
        setPostsError("");

        const dashboardPosts = await getDashboardPosts();
        const trending = await getTrendingOpportunities();
        const deadlines = await getUpcomingDeadlines();

        setPosts(dashboardPosts);
        setTrendingItems(trending);
        setDeadlineItems(deadlines);
      } catch (error) {
        setPostsError(error.message || "Could not load dashboard posts.");
      } finally {
        setPostsLoading(false);
      }
    }

    loadData();
  }, []);

  function verifyPost(postId) {
    if (!isLoggedIn) {
      return;
    }

    setPosts((oldPosts) => {
      return oldPosts.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        return {
          ...post,
          verificationCount: post.verificationCount + 1,
        };
      });
    });
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
      <Navbar currentUser={currentUser} searchText={searchText} onSearchChange={setSearchText} />

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
            onVerify={verifyPost}
            onSave={savePost}
          />

          <div className="mt-6 grid gap-4 xl:hidden">
            <TrendingWidget items={trendingItems} loading={postsLoading} />
            <DeadlineWidget items={deadlineItems} loading={postsLoading} />
          </div>
        </section>

        <aside className="hidden w-[300px] shrink-0 space-y-4 xl:block">
          <TrendingWidget items={trendingItems} loading={postsLoading} />
          <DeadlineWidget items={deadlineItems} loading={postsLoading} />
        </aside>
      </div>
    </main>
  );
}

function Navbar({ currentUser, searchText, onSearchChange }) {
  const isLoggedIn = Boolean(currentUser);

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
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/25 bg-primary/15 text-sm font-semibold text-primary">
              {getInitials(currentUser.name)}
            </div>
          </div>
        ) : (
          <div className="flex shrink-0 items-center gap-2">
            <button className="rounded-xl border border-secondary/25 px-4 py-2 text-sm text-text/75 transition hover:border-primary/40 hover:text-text">
              Login
            </button>
            <button className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-background transition hover:opacity-90">
              Register
            </button>
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
          <span className="rounded-full border border-secondary/25 bg-background/45 px-3 py-1.5 text-xs text-text/65">
            {post.credibilityScore}% credibility
          </span>
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
    return "Trending Updates";
  }

  if (activeSection === "Scholarships") {
    return "Scholarship Updates";
  }

  if (activeSection === "Internships") {
    return "Internship Updates";
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
    search: "M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z",
    home: "M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9z",
    trending: "M4 16l5-5 4 4 7-8M15 7h5v5",
    scholarships: "M4 8l8-4 8 4-8 4-8-4zM6 11v4c2 2 10 2 12 0v-4",
    internships: "M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M4 7h16v12H4V7zM9 7v12",
    saved: "M6 4h12v17l-6-4-6 4V4z",
    profile: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
    notifications: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4",
  };

  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d={icons[name] || icons.home} />
    </svg>
  );
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
