"use client";

import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { createPost } from "@/lib/posts";

const emptyForm = {
  title: "",
  description: "",
  category: "",
  college: "",
  branch: "",
  urgency: "",
  deadline: "",
  tags: "",
};

const categories = [
  "Internship",
  "Scholarship",
  "Placement",
  "Research",
  "Professor Insight",
  "Club Recruitment",
  "Hackathon",
  "Academic",
];

const colleges = ["USICT", "MAIT", "MSIT", "DTU", "NSUT", "IIIT-D"];
const branches = ["CSE", "IT", "ECE", "AI-DS", "ME"];
const urgencies = ["Low", "Medium", "High", "Critical"];
const requiredFields = ["title", "description", "category", "college", "branch", "urgency"];

export default function SubmitPage() {
  const [form, setForm] = useState(emptyForm);
  const [touchedFields, setTouchedFields] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(function watchLoggedInUser() {
    const stopWatching = onAuthStateChanged(auth, function (user) {
      setCurrentUser(user);
      setAuthLoading(false);
    });

    return stopWatching;
  }, []);

  const formIsValid = requiredFields.every(function (fieldName) {
    return form[fieldName].trim() !== "";
  });

  function updateField(fieldName, value) {
    setForm(function (oldForm) {
      return {
        ...oldForm,
        [fieldName]: value,
      };
    });
  }

  function markFieldTouched(fieldName) {
    setTouchedFields(function (oldTouchedFields) {
      return {
        ...oldTouchedFields,
        [fieldName]: true,
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!formIsValid) {
      showAllRequiredErrors();
      setMessage("Please fill all required fields before publishing.");
      return;
    }

    if (!currentUser) {
      setMessage("Please login before publishing intelligence.");
      return;
    }

    try {
      setIsSaving(true);

      await createPost(form);

      setForm(emptyForm);
      setTouchedFields({});
      setMessage("Intelligence published successfully.");
    } catch (error) {
      setMessage(error.message || "Something went wrong while publishing.");
    } finally {
      setIsSaving(false);
    }
  }

  function showAllRequiredErrors() {
    const newTouchedFields = {};

    for (const fieldName of requiredFields) {
      newTouchedFields[fieldName] = true;
    }

    setTouchedFields(newTouchedFields);
  }

  const submitButtonDisabled = !formIsValid || isSaving || authLoading || !currentUser;
  const tagsPreview = makeTagsArray(form.tags);

  return (
    <main className="min-h-screen bg-background text-text">
      <nav className="sticky top-0 z-20 border-b border-secondary/25 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-sm font-semibold tracking-wide text-text">
            Inside Campus
          </Link>
          <p className="hidden rounded-full border border-secondary/30 bg-text/[0.03] px-3 py-1.5 text-xs text-text/65 sm:block">
            Contributor workspace
          </p>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
        <header className="max-w-3xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-primary/80">
            Submit Intelligence
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Share Intelligence
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-text/68 sm:text-lg">
            Help juniors discover opportunities, deadlines, and insider academic guidance
            before they miss out.
          </p>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-secondary/35 bg-text/[0.035] p-5 shadow-2xl shadow-black/30 sm:p-6 lg:p-8"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                name="title"
                label="Title"
                value={form.title}
                placeholder="Adobe internship referrals usually start unofficially in August"
                required
                touched={touchedFields.title}
                onBlur={markFieldTouched}
                onChange={updateField}
                className="md:col-span-2"
              />

              <TextAreaField
                name="description"
                label="Description"
                value={form.description}
                placeholder="Provide detailed context, timelines, preparation advice, or hidden insights."
                required
                touched={touchedFields.description}
                onBlur={markFieldTouched}
                onChange={updateField}
                className="md:col-span-2"
              />

              <SelectField
                name="category"
                label="Category"
                value={form.category}
                options={categories}
                required
                touched={touchedFields.category}
                onBlur={markFieldTouched}
                onChange={updateField}
              />

              <SelectField
                name="college"
                label="College"
                value={form.college}
                options={colleges}
                required
                touched={touchedFields.college}
                onBlur={markFieldTouched}
                onChange={updateField}
              />

              <SelectField
                name="branch"
                label="Branch"
                value={form.branch}
                options={branches}
                required
                touched={touchedFields.branch}
                onBlur={markFieldTouched}
                onChange={updateField}
              />

              <SelectField
                name="urgency"
                label="Urgency"
                value={form.urgency}
                options={urgencies}
                required
                touched={touchedFields.urgency}
                onBlur={markFieldTouched}
                onChange={updateField}
                useAccentColor={form.urgency === "High" || form.urgency === "Critical"}
              />

              <InputField
                name="deadline"
                label="Deadline"
                type="date"
                value={form.deadline}
                helper="Optional"
                onBlur={markFieldTouched}
                onChange={updateField}
              />

              <InputField
                name="tags"
                label="Tags"
                value={form.tags}
                placeholder="internship, placement, google"
                helper="Separate tags with commas"
                onBlur={markFieldTouched}
                onChange={updateField}
              />
            </div>

            {message ? (
              <p className="mt-5 rounded-xl border border-secondary/30 bg-background/55 px-4 py-3 text-sm text-text/75">
                {message}
              </p>
            ) : null}

            <div className="mt-6 flex flex-col gap-4 border-t border-secondary/25 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-h-6">
                {form.urgency ? <UrgencyBadge urgency={form.urgency} /> : null}
              </div>

              <button
                type="submit"
                disabled={submitButtonDisabled}
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-background shadow-lg shadow-primary/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45 sm:min-w-52"
              >
                {isSaving ? "Publishing..." : "Publish Intelligence"}
              </button>
            </div>

            {!authLoading && !currentUser ? (
              <p className="mt-3 text-xs text-accent">
                You need to login first because every post is linked to its creator.
              </p>
            ) : null}
          </form>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-secondary/30 bg-text/[0.035] p-5">
              <h2 className="text-sm font-semibold">How this form works</h2>
              <div className="mt-4 space-y-3 text-sm leading-6 text-text/65">
                <p>Fill the form fields on the left.</p>
                <p>Click Publish Intelligence.</p>
                <p>The page sends this data to Firestore using createPost().</p>
              </div>
            </section>

            <section className="rounded-2xl border border-secondary/30 bg-text/[0.035] p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold">Preview</h2>
                {form.urgency ? <UrgencyBadge urgency={form.urgency} compact /> : null}
              </div>
              <p className="mt-4 text-sm font-medium leading-6 text-text/85">
                {form.title || "Your intelligence title will appear here."}
              </p>
              <p className="mt-2 text-sm leading-6 text-text/55">
                {form.description ||
                  "Add context, timeline, preparation advice, or hidden insight."}
              </p>
              <TagPreview tags={tagsPreview} />
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

function InputField(props) {
  const inputType = props.type || "text";
  const showError = props.required && props.touched && props.value.trim() === "";
  const dateInputFix = inputType === "date" ? { colorScheme: "dark" } : undefined;

  return (
    <div className={props.className || ""}>
      <FieldLabel label={props.label} helper={props.helper} showError={showError} />
      <input
        id={props.name}
        name={props.name}
        type={inputType}
        value={props.value}
        placeholder={props.placeholder}
        style={dateInputFix}
        onBlur={() => props.onBlur(props.name)}
        onChange={(event) => props.onChange(props.name, event.target.value)}
        className="h-12 w-full rounded-xl border border-secondary/25 bg-background/70 px-4 text-sm text-text outline-none transition placeholder:text-text/32 hover:border-secondary/45 focus:border-primary/70 focus:ring-4 focus:ring-primary/10"
      />
    </div>
  );
}

function TextAreaField(props) {
  const showError = props.required && props.touched && props.value.trim() === "";

  return (
    <div className={props.className || ""}>
      <FieldLabel
        label={props.label}
        helper={props.value.length + "/900"}
        showError={showError}
      />
      <textarea
        id={props.name}
        name={props.name}
        value={props.value}
        placeholder={props.placeholder}
        maxLength={900}
        rows={7}
        onBlur={() => props.onBlur(props.name)}
        onChange={(event) => props.onChange(props.name, event.target.value)}
        className="min-h-40 w-full resize-y rounded-xl border border-secondary/25 bg-background/70 px-4 py-3 text-sm leading-6 text-text outline-none transition placeholder:text-text/32 hover:border-secondary/45 focus:border-primary/70 focus:ring-4 focus:ring-primary/10"
      />
    </div>
  );
}

function SelectField(props) {
  const showError = props.required && props.touched && props.value.trim() === "";

  let textColor = "text-text";

  if (!props.value) {
    textColor = "text-text/38";
  }

  if (props.useAccentColor) {
    textColor = "text-accent";
  }

  return (
    <div>
      <FieldLabel label={props.label} showError={showError} />
      <select
        id={props.name}
        name={props.name}
        value={props.value}
        onBlur={() => props.onBlur(props.name)}
        onChange={(event) => props.onChange(props.name, event.target.value)}
        className={
          "h-12 w-full rounded-xl border border-secondary/25 bg-background/70 px-4 text-sm outline-none transition hover:border-secondary/45 focus:border-primary/70 focus:ring-4 focus:ring-primary/10 " +
          textColor
        }
      >
        <option value="">Select {props.label.toLowerCase()}</option>
        {props.options.map(function (option) {
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

function FieldLabel({ label, helper, showError }) {
  return (
    <div className="mb-2 flex items-center justify-between gap-3">
      <label className="text-sm font-medium text-text/88">{label}</label>
      <span className={showError ? "text-xs text-accent" : "text-xs text-text/38"}>
        {showError ? "Required" : helper}
      </span>
    </div>
  );
}

function UrgencyBadge({ urgency, compact = false }) {
  const isImportant = urgency === "High" || urgency === "Critical";
  const badgeColor = isImportant
    ? "border-accent/45 bg-accent/10 text-accent"
    : "border-primary/35 bg-primary/10 text-primary";

  return (
    <span
      className={
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium " +
        badgeColor +
        (compact ? " shrink-0" : "")
      }
    >
      {urgency} urgency
    </span>
  );
}

function TagPreview({ tags }) {
  if (tags.length === 0) {
    return <p className="mt-4 text-xs text-text/35">Tags will preview here.</p>;
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {tags.map(function (tag) {
        return (
          <span
            key={tag}
            className="rounded-full border border-secondary/25 bg-background/60 px-3 py-1 text-xs text-text/62"
          >
            {tag}
          </span>
        );
      })}
    </div>
  );
}

function makeTagsArray(tagsText) {
  if (!tagsText) {
    return [];
  }

  return tagsText
    .split(",")
    .map(function (tag) {
      return tag.trim();
    })
    .filter(function (tag) {
      return tag !== "";
    })
    .slice(0, 6);
}
