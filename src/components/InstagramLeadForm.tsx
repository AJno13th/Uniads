"use client";

import { FormEvent, useState } from "react";
import { subjectAreas } from "@/data/universities";
import {
  settlementStatuses,
  qualificationOptions,
} from "@/data/qualification";
import { submitLead } from "@/lib/crm/client";
import { whatsappLink } from "@/data/site";
import { PhoneField } from "@/components/PhoneField";

function RadioRow({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="divide-y divide-line/80 rounded-xl border border-line bg-white">
      {options.map((option) => {
        const active = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className="flex w-full items-center justify-between px-4 py-3.5 text-left text-[15px] font-medium text-navy transition hover:bg-cream/60"
          >
            <span>{option}</span>
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                active ? "border-navy" : "border-line"
              }`}
              aria-hidden
            >
              {active ? <span className="h-2.5 w-2.5 rounded-full bg-navy" /> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Mobile Instant Form for Instagram bio / ads — Name, passport, course, Yes/No.
 */
export function InstagramLeadForm() {
  const [settlementStatus, setSettlementStatus] = useState("");
  const [course, setCourse] = useState("");
  const [highestQualification, setHighestQualification] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    reference: string | null;
    whatsappUrl?: string;
  } | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fullName = String(form.get("fullName") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();

    if (!fullName || !phone) {
      setError("Please enter your name and phone number.");
      setStatus("error");
      return;
    }
    if (!settlementStatus) {
      setError("To continue, select your passport or permit.");
      setStatus("error");
      return;
    }
    if (!course) {
      setError("To continue, select a course.");
      setStatus("error");
      return;
    }
    if (!highestQualification) {
      setError("To continue, select Yes or No for previous qualification.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setError("");

    try {
      const response = await submitLead({
        source: "instagram",
        fullName,
        phone,
        settlementStatus,
        course,
        highestQualification,
        company: String(form.get("company") ?? ""),
        utmSource: "instagram",
        utmMedium: "social",
        utmCampaign: "bio_link",
      });
      setResult({
        reference: response.reference,
        whatsappUrl: response.whatsappUrl,
      });
      setStatus("idle");
    } catch (submitError) {
      setStatus("error");
      setError((submitError as Error).message);
    }
  }

  if (result) {
    const wa =
      result.whatsappUrl ||
      whatsappLink(
        result.reference
          ? `Hi UNIADS, I'd like to start my application. (Ref ${result.reference})`
          : "Hi UNIADS, I'd like to start my application.",
      );
    return (
      <div className="rounded-2xl border border-line bg-white p-6 text-center shadow-sm">
        <h2 className="display text-2xl text-navy">You’re in</h2>
        <p className="mt-2 text-sm text-muted">
          Message us on WhatsApp and an advisor will confirm your next steps.
        </p>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#25D366] px-5 text-sm font-bold text-white"
        >
          Continue on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-navy" htmlFor="ig-name">
          Full Name
        </label>
        <input
          id="ig-name"
          name="fullName"
          required
          autoComplete="name"
          placeholder="Your full name"
          className="w-full rounded-xl border border-line bg-white px-4 py-3.5 text-base text-navy outline-none focus:border-navy"
        />
      </div>

      <div>
        <p className="mb-1.5 text-sm font-semibold text-navy">
          What PASSPORT or PERMIT do you have?
        </p>
        <RadioRow
          options={settlementStatuses}
          value={settlementStatus}
          onChange={setSettlementStatus}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-navy" htmlFor="ig-course">
          What COURSE do you want to STUDY?
        </label>
        <select
          id="ig-course"
          required
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="w-full appearance-none rounded-xl border border-line bg-white px-4 py-3.5 text-base text-navy outline-none focus:border-navy"
        >
          <option value="" disabled>
            Select an option
          </option>
          {subjectAreas.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
          <option value="Not sure — please advise">Not sure — please advise</option>
        </select>
      </div>

      <div>
        <p className="mb-1.5 text-sm font-semibold text-navy">
          Do you have any previous qualification?
        </p>
        <RadioRow
          options={qualificationOptions}
          value={highestQualification}
          onChange={setHighestQualification}
        />
      </div>

      <PhoneField
        name="phone"
        required
        id="ig-phone"
        label="Phone / WhatsApp"
        labelClassName="mb-1.5 block text-sm font-semibold text-navy"
        inputClassName="w-full rounded-xl border border-line bg-white px-4 py-3.5 text-base text-navy outline-none focus:border-navy"
      />

      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      {status === "error" && (
        <p className="text-sm font-semibold text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="flex min-h-12 w-full items-center justify-center rounded-full bg-navy px-5 text-sm font-bold text-white transition hover:bg-navy-deep disabled:opacity-60"
      >
        {status === "sending" ? "Submitting…" : "Next page"}
      </button>
    </form>
  );
}
