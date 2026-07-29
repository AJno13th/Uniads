"use client";

import { FormEvent, useMemo, useState } from "react";
import { siteConfig, whatsappLink } from "@/data/site";
import { universities } from "@/data/universities";
import {
  settlementStatuses,
  qualificationOptions,
  studyModes,
} from "@/data/qualification";
import { continueLead, submitLead } from "@/lib/crm/client";
import { PhoneField } from "@/components/PhoneField";

type Step = 1 | 2;

function draftWhatsApp(draft: {
  reference: string | null;
  fullName: string;
  phone: string;
  settlementStatus: string;
}) {
  const lines = [
    draft.reference
      ? `Hi UNIADS, I'd like to start my application. (Ref ${draft.reference})`
      : "Hi UNIADS, I'd like to start my application.",
    "",
    `Name: ${draft.fullName}`,
    `Phone: ${draft.phone}`,
    `Passport / permit: ${draft.settlementStatus}`,
  ];
  return whatsappLink(lines.join("\n"));
}

function ChoiceChips({
  options,
  value,
  onChange,
  name,
}: {
  options: readonly string[];
  value: string;
  onChange: (next: string) => void;
  name?: string;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2" role="radiogroup">
      {name ? <input type="hidden" name={name} value={value} /> : null}
      {options.map((option) => {
        const active = value === option;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option)}
            className={`flex min-h-12 items-center justify-between rounded-md border px-4 py-3 text-left text-sm font-semibold transition ${
              active
                ? "border-navy bg-navy text-white"
                : "border-line bg-white text-navy hover:border-navy/40"
            }`}
          >
            <span>{option}</span>
            <span
              className={`ml-3 h-4 w-4 shrink-0 rounded-full border-2 ${
                active ? "border-white bg-olive" : "border-line"
              }`}
              aria-hidden
            />
          </button>
        );
      })}
    </div>
  );
}

export function ApplyForm() {
  const [step, setStep] = useState<Step>(1);
  const [settlementStatus, setSettlementStatus] = useState("");
  const [highestQualification, setHighestQualification] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [course, setCourse] = useState("");
  const [studyMode, setStudyMode] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<{
    leadId: string;
    continueToken: string;
    reference: string | null;
    fullName: string;
    phone: string;
    settlementStatus: string;
  } | null>(null);
  const [result, setResult] = useState<{
    reference: string | null;
    whatsappUrl?: string;
  } | null>(null);

  const courseOptions = useMemo(() => {
    const uni = universities.find((u) => u.name === universityName);
    const list = uni
      ? uni.courses.filter((c) => c.status !== "not-running").map((c) => c.name)
      : universities
          .flatMap((u) => u.courses.filter((c) => c.status !== "not-running"))
          .map((c) => c.name)
          .filter((name, index, all) => all.indexOf(name) === index)
          .sort();
    return list;
  }, [universityName]);

  async function onStageOne(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fullName = String(form.get("fullName") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const company = String(form.get("company") ?? "");

    if (!fullName || !phone || !settlementStatus) {
      setError("Please enter your name, phone and passport or permit.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setError("");

    try {
      const response = await submitLead({
        source: "apply",
        partial: true,
        fullName,
        phone,
        settlementStatus,
        company,
      });

      if (!response.leadId || !response.continueToken) {
        setResult({
          reference: response.reference,
          whatsappUrl: response.whatsappUrl,
        });
        setStatus("idle");
        return;
      }

      setDraft({
        leadId: response.leadId,
        continueToken: response.continueToken,
        reference: response.reference,
        fullName,
        phone,
        settlementStatus,
      });
      setStep(2);
      setStatus("idle");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submitError) {
      setStatus("error");
      setError((submitError as Error).message);
    }
  }

  async function onStageTwo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;

    if (!course) {
      setError("Please select a course to continue.");
      setStatus("error");
      return;
    }
    if (!highestQualification) {
      setError("Please tell us if you have any previous qualification.");
      setStatus("error");
      return;
    }

    const form = new FormData(event.currentTarget);
    setStatus("sending");
    setError("");

    try {
      const response = await continueLead(draft.leadId, draft.continueToken, {
        email: String(form.get("email") ?? ""),
        highestQualification,
        university: universityName || null,
        course,
        studyMode: studyMode || null,
      });
      setResult({
        reference: response.reference ?? draft.reference,
        whatsappUrl: response.whatsappUrl,
      });
      setStatus("idle");
    } catch (submitError) {
      setStatus("error");
      setError((submitError as Error).message);
    }
  }

  if (result) {
    return (
      <div className="rounded-xl border border-olive/40 bg-white p-8 text-center shadow-sm">
        <h3 className="display text-3xl text-navy">You’re in</h3>
        <p className="mt-3 text-muted">
          Thanks{draft?.fullName ? `, ${draft.fullName.split(" ")[0]}` : ""}. Open
          WhatsApp to finish with an advisor — your answers are ready to send.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {(result.whatsappUrl || (draft && draftWhatsApp(draft))) && (
            <a
              href={result.whatsappUrl || (draft ? draftWhatsApp(draft) : "#")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#25D366] px-5 py-3 text-sm font-bold text-white transition hover:brightness-95"
            >
              Continue on WhatsApp
            </a>
          )}
          <a
            className="inline-flex min-h-12 items-center justify-center rounded-md border border-line bg-white px-5 py-3 text-sm font-bold text-navy transition hover:border-navy"
            href={`mailto:${siteConfig.email}`}
          >
            Email us
          </a>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <form
        onSubmit={onStageOne}
        className="space-y-6 rounded-xl border border-line bg-white p-6 shadow-sm sm:p-8"
      >
        <div>
          <div className="flex items-center gap-2" aria-hidden>
            <span className="h-1.5 w-10 rounded-full bg-olive" />
            <span className="h-1.5 w-10 rounded-full bg-line" />
          </div>
          <h2 className="display mt-4 text-2xl text-navy sm:text-3xl">
            Start your application
          </h2>
          <p className="mt-2 text-sm text-muted">Three quick answers. Takes about 30 seconds.</p>
        </div>

        <div>
          <label className="label" htmlFor="fullName">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            required
            className="input"
            autoComplete="name"
            placeholder="Your full name"
          />
        </div>

        <div>
          <span className="label">What passport or permit do you have?</span>
          <ChoiceChips
            options={settlementStatuses}
            value={settlementStatus}
            onChange={setSettlementStatus}
            name="settlementStatus"
          />
        </div>

        <PhoneField name="phone" required />

        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden
        />

        {status === "error" && (
          <p className="text-sm font-semibold text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="flex min-h-12 w-full items-center justify-center rounded-md bg-olive px-5 py-3.5 text-sm font-bold text-navy-deep transition hover:bg-olive-dark disabled:opacity-60"
        >
          {status === "sending" ? "Saving…" : "Next"}
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={onStageTwo}
      className="space-y-6 rounded-xl border border-line bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <div className="flex items-center gap-2" aria-hidden>
          <span className="h-1.5 w-10 rounded-full bg-olive" />
          <span className="h-1.5 w-10 rounded-full bg-olive" />
        </div>
        <h2 className="display mt-4 text-2xl text-navy sm:text-3xl">Almost there</h2>
        <p className="mt-2 text-sm text-muted">Pick your course and one more answer.</p>
      </div>

      <div>
        <label className="label" htmlFor="university">
          University (optional)
        </label>
        <select
          id="university"
          className="input"
          value={universityName}
          onChange={(e) => {
            setUniversityName(e.target.value);
            setCourse("");
          }}
        >
          <option value="">No preference — advise me</option>
          {universities.map((u) => (
            <option key={u.slug} value={u.name}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label" htmlFor="course">
          What course do you want to study?
        </label>
        <select
          id="course"
          className="input"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          required
        >
          <option value="" disabled>
            Select an option
          </option>
          {courseOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
          <option value="Not sure — please advise">Not sure — please advise</option>
        </select>
      </div>

      <div>
        <span className="label">Do you have any previous qualification?</span>
        <ChoiceChips
          options={qualificationOptions}
          value={highestQualification}
          onChange={setHighestQualification}
          name="highestQualification"
        />
      </div>

      <div>
        <span className="label">Full-time or part-time? (optional)</span>
        <ChoiceChips
          options={studyModes}
          value={studyMode}
          onChange={setStudyMode}
          name="studyMode"
        />
      </div>

      <div>
        <label className="label" htmlFor="email">
          Email (optional)
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="input"
          autoComplete="email"
          placeholder="you@email.com"
        />
      </div>

      {status === "error" && (
        <p className="text-sm font-semibold text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="flex min-h-12 w-full items-center justify-center rounded-md bg-olive px-5 py-3.5 text-sm font-bold text-navy-deep transition hover:bg-olive-dark disabled:opacity-60"
      >
        {status === "sending" ? "Submitting…" : "Submit & continue on WhatsApp"}
      </button>
    </form>
  );
}
