"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginUser } from "@/lib/users";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function updateField(fieldName, value) {
    setFormData(function (oldFormData) {
      return {
        ...oldFormData,
        [fieldName]: value,
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
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
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-text">
      <section className="w-full max-w-md rounded-2xl border border-secondary/30 bg-text/[0.035] p-6 shadow-2xl shadow-black/30">
        <Link href="/" className="text-sm font-semibold text-primary">
          Inside Campus
        </Link>

        <div className="mt-8">
          <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm leading-6 text-text/60">
            Login to save posts, verify updates, and continue to your dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-text/80">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="you@example.com"
              className="h-12 w-full rounded-xl border border-secondary/25 bg-background/70 px-4 text-sm text-text outline-none transition placeholder:text-text/35 focus:border-primary/70 focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text/80">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(event) => updateField("password", event.target.value)}
              placeholder="Enter your password"
              className="h-12 w-full rounded-xl border border-secondary/25 bg-background/70 px-4 text-sm text-text outline-none transition placeholder:text-text/35 focus:border-primary/70 focus:ring-4 focus:ring-primary/10"
            />
          </div>

          {error ? (
            <p className="rounded-xl border border-accent/35 bg-accent/10 px-4 py-3 text-sm text-accent">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full rounded-xl bg-primary text-sm font-semibold text-background shadow-lg shadow-primary/25 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text/55">
          New to Inside Campus?{" "}
          <Link href="/auth/signup" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
