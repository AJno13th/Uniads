"use client";

import { FormEvent, useMemo, useState } from "react";
import { universities } from "@/data/universities";
import {
  settlementStatuses,
  studyModes,
  residencyOptions,
  ageBrackets,
} from "@/data/qualification";
import { submitLead } from "@/lib/crm/client";
import { whatsappLink } from "@/data/site";
import { PhoneField } from "@/components/PhoneField";

/**
 * Compact qualifier used on high-intent pages: the student picks their
 * residency status, university, course and study mode, and WhatsApp opens
 * with a preset message containing all of it.
 */
export function LeadQualifier({
  variant = "light",
  source = "quick_qualifier",
}: {
  variant?: "light" | "dark";
  source?: "quick_qualifier" | "landing";
}) {
  const [settlementStatus, setSettlementStatus] = useState("");
  const [ukResidency, setUkResidency] = useState("");
  const [ageBracket, setAgeBracket] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [course, setCourse] = useState("");
  const [studyMode, setStudyMode] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");
  const [reference, setReference] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  const courseOptions = useMemo(() => {
    const uni = universities.find((u) => u.name === universityName);
    if (!uni) {
      return universities
        .flatMap((u) => u.courses.filter((c) => c.status !== "not-running"))
        .map((c) => c.name)
        .filter((name, index, all) => all.indexOf(name) === index)
        .sort();
    }
    return uni.courses.filter((c) => c.status !== "not-running").map((c) => c.name);
  }, [universityName]);

  const dark = variant === "dark";
  const panel = dark
    ? "bg-white/10 border-white/20 text-white"
    : "bg-white border-line text-navy";
  const labelClass = dark
    ? "block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5"
    : "label";
  const fieldClass = dark
    ? "w-full min-h-12 rounded-md border border-white/25 bg-navy-deep/70 px-3 py-3 text-base text-white outline-none transition focus:border-olive focus:shadow-[0_0_0_3px_rgba(194,204,96,0.25)]"
    : "input";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("sending");
    setError("");

    try {
      const result = await submitLead({
        source,
        fullName: String(form.get("fullName") ?? ""),
        phone: String(form.get("phone") ?? ""),
        email: String(form.get("email") ?? ""),
        settlementStatus,
        ukResidency,
        ageBracket,
        university: universityName,
        course,
        studyMode,
        company: String(form.get("company") ?? ""),
      });
      setReference(result.reference);
      setWhatsappUrl(
        result.whatsappUrl ||
          whatsappLink(
            `Hi UNIADS, I'd like to start my application. (Ref ${result.reference ?? ""})`,
          ),
      );
      setStatus("idle");
    } catch (submitError) {
      setStatus("error");
      setError((submitError as Error).message);
    }
  }

  if (reference) {
    return (
      <div className={`rounded-xl border p-6 ${panel}`}>
        <h3 className="display text-2xl">Message ready</h3>
        <p className={`mt-2 text-sm ${dark ? "text-white/75" : "text-muted"}`}>
          Your reference is <strong>{reference}</strong>. Continue on WhatsApp with
          your details pre-filled — press send and an advisor will reply.
        </p>
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-[#25D366] px-5 py-3 text-sm font-bold text-white transition hover:brightness-95 sm:w-auto"
          >
            Continue on WhatsApp
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`rounded-xl border p-6 ${panel}`}>
      <h3 className="display text-2xl">Check your options in 60 seconds</h3>
      <p className={`mt-2 text-sm ${dark ? "text-white/70" : "text-muted"}`}>
        Pick your details below and we will open WhatsApp with a ready-made message
        so an advisor can confirm your eligibility straight away.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="qual-settlement">
            What passport or permit do you have? *
          </label>
          <select
            id="qual-settlement"
            required
            className={fieldClass}
            value={settlementStatus}
            onChange={(e) => setSettlementStatus(e.target.value)}
          >
            <option value="">Select an option</option>
            {settlementStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="qual-residency">
            How long in the UK?
          </label>
          <select
            id="qual-residency"
            className={fieldClass}
            value={ukResidency}
            onChange={(e) => setUkResidency(e.target.value)}
          >
            <option value="">Select</option>
            {residencyOptions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="qual-age">
            Your age
          </label>
          <select
            id="qual-age"
            className={fieldClass}
            value={ageBracket}
            onChange={(e) => setAgeBracket(e.target.value)}
          >
            <option value="">Select</option>
            {ageBrackets.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="qual-university">
            University you want to attend *
          </label>
          <select
            id="qual-university"
            required
            className={fieldClass}
            value={universityName}
            onChange={(e) => {
              setUniversityName(e.target.value);
              setCourse("");
            }}
          >
            <option value="">Select a university</option>
            {universities.map((u) => (
              <option key={u.slug} value={u.name}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="qual-course">
            Course you want to study *
          </label>
          <select
            id="qual-course"
            required
            className={fieldClass}
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          >
            <option value="">
              {universityName ? "Select a course" : "Select a university first"}
            </option>
            {courseOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value="Not sure — please advise">Not sure — please advise</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <span className={labelClass}>Full-time or part-time? *</span>
          <div className="flex flex-wrap gap-2">
            {studyModes.map((mode) => {
              const active = studyMode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setStudyMode(mode)}
                  className={`rounded-md px-4 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-olive text-navy-deep"
                      : dark
                        ? "bg-white/10 text-white hover:bg-white/20"
                        : "bg-cream text-navy hover:bg-olive/30"
                  }`}
                >
                  {mode}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="qual-name">
            Full name *
          </label>
          <input id="qual-name" name="fullName" required className={fieldClass} />
        </div>

        <div>
          <PhoneField
            name="phone"
            required
            id="qual-phone"
            labelClassName={labelClass}
            inputClassName={fieldClass}
            selectClassName={fieldClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="qual-email">
            Email (optional)
          </label>
          <input id="qual-email" name="email" type="email" className={fieldClass} />
        </div>

        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden
        />
      </div>

      {status === "error" && (
        <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending" || !studyMode}
        className="mt-6 min-h-12 w-full rounded-md bg-olive px-5 py-3.5 text-sm font-bold text-navy-deep transition hover:bg-olive-dark disabled:opacity-60"
      >
        {status === "sending"
          ? "Preparing your message…"
          : "Send my details on WhatsApp"}
      </button>
      <p className={`mt-2 text-xs ${dark ? "text-white/60" : "text-muted"}`}>
        {studyMode
          ? "Free · Takes about 60 seconds · Opens WhatsApp with your answers ready"
          : "Select full-time or part-time to continue."}
      </p>
    </form>
  );
}
