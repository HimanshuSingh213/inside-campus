"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  Building2,
  ShieldCheck,
  Award,
  BellRing,
  Network,
  GraduationCap,
  Users,
  Medal,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Why It Matters", href: "#why-it-matters" },
];

const FEATURES = [
  {
    title: "College-Specific Feeds",
    desc: "Every insight is tagged to your institution, branch, and year. No noise — only what's relevant to your academic context.",
    icon: Building2,
  },
  {
    title: "Peer Verification",
    desc: "Content is reviewed by trusted seniors before it surfaces. Community trust replaces bureaucratic gatekeeping.",
    icon: ShieldCheck,
  },
  {
    title: "Credibility Scoring",
    desc: "Contributors earn reputation over time. The most reliable seniors rise to the top — so you know who to trust.",
    icon: Award,
  },
  {
    title: "Urgent Alerts",
    desc: "Scholarship portals. Referral windows. Application cutoffs. Get notified before the opportunity quietly disappears.",
    icon: BellRing,
  },
  {
    title: "Branch-Tagged Insights",
    desc: "CS, ECE, MBA, Civil — filter insights by discipline. Stop wading through content meant for another department.",
    icon: Network,
  },
  {
    title: "Senior Contributor Network",
    desc: "Structured mentorship at scale. Seniors document what they wish they knew — so juniors don't start from zero.",
    icon: GraduationCap,
  },
];

const WHY_CARDS = [
  {
    icon: Users,
    title: "Built for first-generation students",
    desc: "No alumni network? No senior connections? Inside Campus levels the playing field — giving every student access to the same insider knowledge.",
  },
  {
    icon: ShieldCheck,
    title: "Community-verified intelligence",
    desc: "Every post is reviewed by peers. Credibility scores surface the most reliable voices so misinformation never reaches you.",
  },
  {
    icon: Medal,
    title: "Trust through credibility scoring",
    desc: "Contributors build reputation over time. The platform rewards accuracy and experience — not follower counts.",
  },
];

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background font-sans text-text">

      {/* Ambient glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none glow-pulse"
        style={{ background: "radial-gradient(ellipse at center, color-mix(in srgb, var(--color-primary) 18%, transparent) 0%, transparent 70%)" }}
      />

      {/* NAVBAR */}
      <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4">
        <nav className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-full px-6 py-3 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
              <div className="w-2 h-2 rounded-full bg-background" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-text">Inside Campus</span>
          </div>

          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-text/60">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} className="hover:text-text transition-colors duration-200">
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3 text-sm font-medium">
            <Link
              href="/login"
              className="text-text/70 hover:text-text transition-colors duration-200 px-3 py-1.5"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-primary text-background px-5 py-2 rounded-full font-semibold hover:brightness-110 transition-all duration-200 shadow-lg shadow-primary/25"
            >
              Register
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <main id="hero" className="relative pt-44 pb-24 text-center overflow-hidden">
        {/* Badge */}
        <div className="flex justify-center mb-8 animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-white/[0.05] border border-white/[0.1] rounded-full px-4 py-1.5 text-xs font-medium text-text/60 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-primary urgency-pulse inline-block" />
            College intelligence, structured for students
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-6 animate-fade-up">
          <h1 className="text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight text-text">
            The insider network<br />
            every student{" "}
            <span className="text-primary">deserves.</span>
          </h1>

          <p className="text-lg text-text/55 max-w-2xl mx-auto leading-relaxed animate-fade-up-delay">
            Students miss opportunities not because they lack talent — but because important information
            stays hidden inside informal senior networks.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 animate-fade-up-delay-2">
            <Link
              href="/register"
              className="bg-primary text-background px-8 py-3.5 rounded-full font-semibold text-sm hover:brightness-110 transition-all duration-200 shadow-lg shadow-primary/30"
            >
              Explore Intelligence
            </Link>
            <Link
              href="/login"
              className="px-8 py-3.5 rounded-full text-text/80 font-semibold text-sm border border-white/[0.1] hover:bg-white/[0.05] hover:text-text transition-all duration-200"
            >
              Join the Network
            </Link>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div className="relative z-10 mt-16 max-w-5xl mx-auto px-4">
          <div className="backdrop-blur-2xl bg-white/[0.04] border border-white/[0.08] rounded-3xl p-1 shadow-2xl shadow-black/60">
            {/* Window chrome */}
            <div className="bg-white/[0.03] border-b border-white/[0.06] rounded-t-[1.4rem] px-5 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="flex-1 mx-4">
                <div className="w-48 h-5 bg-white/[0.05] border border-white/[0.07] rounded-full mx-auto flex items-center justify-center">
                  <span className="text-[9px] text-text/30 tracking-wider">app.insidecampus.in</span>
                </div>
              </div>
            </div>

            {/* App layout */}
            <div className="flex min-h-[360px] rounded-b-[1.4rem] overflow-hidden">
              {/* Sidebar */}
              <div className="w-48 border-r border-white/[0.06] p-4 flex flex-col gap-1 bg-white/[0.01] hidden sm:flex">
                <div className="text-[9px] text-text/30 uppercase tracking-widest font-bold px-3 mb-2">Feeds</div>
                {["All Insights", "Internships", "Scholarships", "Placements", "Professors", "Hidden Opps"].map(
                  (item, i) => (
                    <div
                      key={item}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                        i === 0
                          ? "bg-primary/15 text-primary border border-primary/20"
                          : "text-text/50 hover:text-text hover:bg-white/[0.04]"
                      }`}
                    >
                      {item}
                    </div>
                  )
                )}
              </div>

              {/* Main Feed */}
              <div className="flex-1 p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-text/70">Latest Intelligence</span>
                  <span className="text-[10px] text-text/30 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-full">
                    Updated today
                  </span>
                </div>

                {[
                  {
                    tag: "Internship",
                    tagColor: "bg-primary/15 text-primary border-primary/20",
                    title: "Adobe referrals usually begin unofficially in August.",
                    author: "Priya S. · CSE 2024",
                    meta: "Deadline: Aug 15",
                    metaUrgent: true,
                    cred: 94,
                  },
                  {
                    tag: "Scholarship",
                    tagColor: "bg-accent/15 text-accent border-accent/20",
                    title: "Scholarship portal closes silently every November.",
                    author: "Rahul M. · ECE 2023",
                    meta: "Closes: Nov 30",
                    metaUrgent: true,
                    cred: 88,
                  },
                  {
                    tag: "Placement",
                    tagColor: "bg-secondary/20 text-text/70 border-secondary/30",
                    title: "Start DSA prep before placement season — ideally by June.",
                    author: "Anjali K. · IT 2024",
                    meta: "Evergreen",
                    metaUrgent: false,
                    cred: 97,
                  },
                ].map((post) => (
                  <div
                    key={post.title}
                    className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 flex items-start gap-4 hover:bg-white/[0.06] transition-colors duration-200"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase tracking-wider ${post.tagColor}`}>
                          {post.tag}
                        </span>
                        <span className="text-text/40 text-[10px]">{post.author}</span>
                      </div>
                      <p className="text-sm font-semibold text-text/90 leading-snug">{post.title}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <div className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${post.metaUrgent ? "border-accent/30 text-accent bg-accent/10 urgency-pulse" : "border-white/[0.08] text-text/40"}`}>
                        {post.meta}
                      </div>
                      <div className="text-[10px] text-text/30 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-primary/60 inline-block" />
                        {post.cred}% cred
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Panel */}
              <div className="w-48 border-l border-white/[0.06] p-4 hidden lg:flex flex-col gap-3 bg-white/[0.01]">
                <div className="text-[9px] text-text/30 uppercase tracking-widest font-bold mb-1">Quick Stats</div>
                {[
                  { label: "Active Contributors", value: "Senior Network" },
                  { label: "Posts this week", value: "Verified Feed" },
                  { label: "Your branch", value: "CSE Branch" },
                ].map((s) => (
                  <div key={s.label} className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3">
                    <div className="text-[9px] text-text/35 mb-0.5">{s.label}</div>
                    <div className="text-xs font-semibold text-text/70">{s.value}</div>
                  </div>
                ))}
                <div className="mt-auto">
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                    <div className="text-[9px] text-primary/80 font-bold uppercase tracking-wider mb-1">Your Score</div>
                    <div className="text-lg font-bold text-primary">—</div>
                    <div className="text-[9px] text-text/40">Join to build credibility</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FEATURES */}
      <section id="features" className="relative py-28 container mx-auto px-4 max-w-6xl">
        <div className="max-w-2xl mb-16 space-y-3">
          <p className="text-[10px] text-primary font-bold tracking-widest uppercase">Platform Intelligence</p>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
            Structured intelligence,<br />not another social feed.
          </h2>
          <p className="text-text/55 text-lg leading-relaxed">
            Every insight is tagged by college, branch, and urgency — and verified by trusted seniors before it reaches your feed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group border border-white/[0.07] rounded-2xl p-6 bg-white/[0.02] backdrop-blur-sm space-y-4 hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/[0.04] group-hover:to-transparent transition-all duration-500 rounded-2xl pointer-events-none" />
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-primary relative z-10 group-hover:border-primary/30 transition-colors duration-300">
                <f.icon size={20} strokeWidth={2} />
              </div>
              <div className="relative z-10">
                <h3 className="text-base font-bold mb-2 group-hover:text-text transition-colors">{f.title}</h3>
                <p className="text-sm text-text/50 leading-relaxed group-hover:text-text/65 transition-colors duration-300">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section id="why-it-matters" className="relative py-24 border-y border-white/[0.06] overflow-hidden">
        <div
          className="absolute left-[-15%] top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 12%, transparent) 0%, transparent 70%)" }}
        />

        <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10 items-center">
          {/* Left copy */}
          <div className="space-y-6">
            <p className="text-[10px] text-primary font-bold tracking-widest uppercase">Why It Matters</p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              Most students miss opportunities they were qualified for.
            </h2>
            <p className="text-lg text-text/55 leading-relaxed">
              Not because they lacked ability — but because the information that mattered lived inside
              informal WhatsApp groups, senior coffee chats, and undocumented college systems.
            </p>
            <p className="text-lg text-primary/75 leading-relaxed font-medium">
              Inside Campus makes that hidden knowledge structured, searchable, and accessible to every
              student — regardless of who they know.
            </p>
          </div>

          {/* Right cards */}
          <div className="space-y-4">
            {WHY_CARDS.map((card, i) => (
              <div
                key={i}
                className="border border-white/[0.08] rounded-2xl p-5 bg-white/[0.03] backdrop-blur-sm hover:border-primary/25 hover:bg-white/[0.05] transition-all duration-300 cursor-default"
              >
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-lg shrink-0">
                    <card.icon size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1 text-text/90">{card.title}</h3>
                    <p className="text-sm text-text/50 leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-28 container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16 space-y-3">
          <p className="text-[10px] text-primary font-bold tracking-widest uppercase">How It Works</p>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
            Intelligence flows<br />from senior to junior.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Seniors Contribute",
              desc: "Experienced students document internship timelines, professor insights, scholarship deadlines, and placement strategies from their real experience.",
            },
            {
              step: "02",
              title: "Peers Verify",
              desc: "The community reviews each post. Credibility scores reward accuracy and experience. Only trustworthy content surfaces to the feed.",
            },
            {
              step: "03",
              title: "Juniors Act",
              desc: "Freshers and juniors access structured, institution-specific intelligence — and apply before the window quietly closes.",
            },
          ].map((s) => (
            <div key={s.step} className="border border-white/[0.07] rounded-2xl p-7 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-300 group">
              <div className="text-5xl font-bold text-primary/15 group-hover:text-primary/25 transition-colors duration-300 mb-4 leading-none">
                {s.step}
              </div>
              <h3 className="text-base font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-text/50 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container mx-auto px-4 max-w-6xl mb-24 relative z-10">
        <div
          className="rounded-3xl p-12 md:p-16 relative overflow-hidden border border-white/[0.08]"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--color-background) 85%, var(--color-primary)) 0%, color-mix(in srgb, var(--color-secondary) 35%, var(--color-background)) 100%)",
          }}
        >
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle at top right, color-mix(in srgb, var(--color-primary) 15%, transparent) 0%, transparent 70%)" }}
          />

          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-text">
              Stop hearing about opportunities<br />after they close.
            </h2>
            <p className="text-lg text-text/55 leading-relaxed max-w-xl mx-auto">
              Join a trusted student intelligence network built to make insider knowledge accessible —
              for every student, at every college.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/register"
                className="bg-primary text-background px-8 py-3.5 rounded-full font-bold text-sm hover:brightness-110 transition-all duration-200 shadow-xl shadow-primary/30 hover:scale-105 active:scale-95"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="px-8 py-3.5 rounded-full text-text/70 font-semibold text-sm border border-white/[0.1] hover:bg-white/[0.05] hover:text-text transition-all duration-200"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06] py-8 container mx-auto px-4 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-background" />
          </div>
          <span className="text-sm font-semibold text-text/70">Inside Campus</span>
        </div>
        <p className="text-xs text-text/30">
          © {new Date().getFullYear()} Inside Campus. Built for students, by students.
        </p>
        <div className="flex items-center gap-5 text-xs text-text/40">
          <a href="#" className="hover:text-text/70 transition-colors">Privacy</a>
          <a href="#" className="hover:text-text/70 transition-colors">Terms of Use</a>
          <a href="#" className="hover:text-text/70 transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}
