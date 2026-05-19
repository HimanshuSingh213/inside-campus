"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loginUser } from "@/lib/users";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

const emptyForm = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [router]);

  function updateField(fieldName, value) {
    setFormData(function (oldFormData) {
      return {
        ...oldFormData,
        [fieldName]: value,
      };
    });
  }

  function validateForm() {
    if (!formData.email.trim()) {
      return "Email is required.";
    }

    if (!formData.password) {
      return "Password is required.";
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);
      await loginUser(formData);
      router.push("/dashboard");
    } catch (loginError) {
      setError(loginError.message || "Could not login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthShell
      heading="Welcome back"
      subheading="Access trusted student intelligence."
      sideTitle="Stay ahead of campus opportunities"
      sideText="Login to save updates, verify useful posts, and keep your dashboard focused on what matters."
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          placeholder="you@example.com"
          onChange={updateField}
        />

        <PasswordField
          label="Password"
          name="password"
          value={formData.password}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          onChange={updateField}
        />

        {error ? <ErrorMessage message={error} /> : null}

        <button
          type="submit"
          disabled={isLoading}
          className="h-12 w-full rounded-xl bg-primary text-sm font-semibold text-background shadow-lg shadow-primary/25 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text/55">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Register
        </Link>
      </p>
    </AuthShell>
  );
}

function AuthShell({ heading, subheading, sideTitle, sideText, children }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-10 text-text">
      <div className="absolute left-1/2 top-0 h-80 w-[540px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center gap-6 lg:grid-cols-[minmax(0,430px)_1fr]">
        <section className="rounded-2xl border border-secondary/30 bg-text/[0.035] p-6 shadow-2xl shadow-black/30 sm:p-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-background">
              IC
            </span>
            <span className="text-sm font-semibold">Inside Campus</span>
          </Link>

          <div className="mt-8">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{heading}</h1>
            <p className="mt-3 text-sm leading-6 text-text/62">{subheading}</p>
          </div>

          {children}
        </section>

        <aside className="hidden rounded-2xl border border-secondary/25 bg-secondary/10 p-8 lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
            Inside Campus
          </p>
          <h2 className="mt-5 max-w-md text-3xl font-semibold leading-tight tracking-tight">
            {sideTitle}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-text/62">{sideText}</p>
          <div className="mt-8 grid gap-3">
            <InfoPill label="Community verified posts" />
            <InfoPill label="Credibility-based contributors" />
            <InfoPill label="College and branch focused feed" />
          </div>
        </aside>
      </div>
    </main>
  );
}

function TextField({ label, name, type = "text", value, placeholder, onChange }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-text/82">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(name, event.target.value)}
        className="h-12 w-full rounded-xl border border-secondary/25 bg-background/70 px-4 text-sm text-text outline-none transition placeholder:text-text/35 focus:border-primary/70 focus:ring-4 focus:ring-primary/10"
      />
    </div>
  );
}

function PasswordField({ label, name, value, showPassword, onTogglePassword, onChange }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-text/82">
        {label}
      </label>
      <div className="flex h-12 items-center rounded-xl border border-secondary/25 bg-background/70 pr-2 transition focus-within:border-primary/70 focus-within:ring-4 focus-within:ring-primary/10">
        <input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          placeholder="Enter your password"
          onChange={(event) => onChange(name, event.target.value)}
          className="h-full min-w-0 flex-1 bg-transparent px-4 text-sm text-text outline-none placeholder:text-text/35"
        />
        <button
          type="button"
          onClick={onTogglePassword}
          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-text/55 transition hover:bg-text/5 hover:text-text"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="rounded-xl border border-accent/35 bg-accent/10 px-4 py-3 text-sm text-accent">
      {message}
    </p>
  );
}

function InfoPill({ label }) {
  return (
    <div className="rounded-xl border border-secondary/25 bg-background/45 px-4 py-3 text-sm text-text/70">
      {label}
    </div>
  );
}
