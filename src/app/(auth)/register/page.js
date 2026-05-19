"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { registerUser } from "@/lib/users";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  college: "",
  branch: "",
  year: "",
};

const colleges = ["USICT", "MAIT", "MSIT", "DTU", "NSUT", "IIIT-D"];
const branches = ["CSE", "IT", "ECE", "AI-DS", "ME"];
const years = ["1", "2", "3", "4"];

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        window.location.href = "/dashboard";
      }
    });
    return () => unsubscribe();
  }, []);

  function updateField(fieldName, value) {
    setFormData(function (oldFormData) {
      return {
        ...oldFormData,
        [fieldName]: value,
      };
    });
  }

  function validateForm() {
    if (!formData.name.trim()) {
      return "Full name is required.";
    }

    if (!formData.email.trim()) {
      return "Email is required.";
    }

    if (!formData.password) {
      return "Password is required.";
    }

    if (formData.password.length < 8) {
      return "Password must be at least 8 characters.";
    }

    if (!formData.college) {
      return "College is required.";
    }

    if (!formData.branch) {
      return "Branch is required.";
    }

    if (!formData.year) {
      return "Year is required.";
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
      await registerUser(formData);
      sessionStorage.setItem("justLoggedIn", "true");
      window.location.href = "/dashboard";
    } catch (registerError) {
      setError(registerError.message || "Could not create your account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthShell
      heading="Join the network"
      subheading="Start accessing community-verified academic intelligence."
      sideTitle="Build your campus advantage"
      sideText="Create your profile, follow relevant updates, and contribute useful opportunities for other students."
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <TextField
          label="Full Name"
          name="name"
          value={formData.name}
          placeholder="Himanshu Singh"
          onChange={updateField}
        />

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

        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField
            label="College"
            name="college"
            value={formData.college}
            options={colleges}
            onChange={updateField}
          />

          <SelectField
            label="Branch"
            name="branch"
            value={formData.branch}
            options={branches}
            onChange={updateField}
          />
        </div>

        <SelectField
          label="Year"
          name="year"
          value={formData.year}
          options={years}
          onChange={updateField}
        />

        {error ? <ErrorMessage message={error} /> : null}

        <button
          type="submit"
          disabled={isLoading}
          className="h-12 w-full rounded-xl bg-primary text-sm font-semibold text-background shadow-lg shadow-primary/25 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55"
        >
          {isLoading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text/55">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Login
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

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center gap-6 lg:grid-cols-[minmax(0,520px)_1fr]">
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
            <InfoPill label="College-specific updates" />
            <InfoPill label="Peer verification system" />
            <InfoPill label="Credibility-based contributors" />
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
          placeholder="Create a strong password"
          onChange={(event) => onChange(name, event.target.value)}
          className="h-full min-w-0 flex-1 bg-transparent px-4 text-sm text-text outline-none placeholder:text-text/35"
        />
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            onTogglePassword();
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            onTogglePassword();
          }}
          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-text/55 transition hover:bg-text/5 hover:text-text"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}

function SelectField({ label, name, value, options, onChange }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-text/82">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        className={
          "h-12 w-full rounded-xl border border-secondary/25 bg-background/70 px-4 text-sm outline-none transition focus:border-primary/70 focus:ring-4 focus:ring-primary/10 " +
          (value ? "text-text" : "text-text/40")
        }
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map(function (option) {
          return (
            <option key={option} value={option} className="bg-background text-text">
              {option}
            </option>
          );
        })}
      </select>
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
