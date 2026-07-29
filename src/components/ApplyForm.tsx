"use client";

import { FormEvent, useMemo, useState } from "react";
import { services, courseTypes, siteConfig, whatsappLink } from "@/data/site";
import { universities, subjectAreas } from "@/data/universities";
import {
  settlementStatuses,
  residencyOptions,
  ageBrackets,
  qualificationOptions,
  studyModes,
  classPreferences,
  financeHistoryOptions,
  intakeOptions,
  preferredCities,
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
    "I saved my details on the website — please call me to finish.",
  ];
  return whatsappLink(lines.join("\n"));
}

export function ApplyForm() {
  const [step, setStep] = useState<Step>(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
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

  const selectedUniversity = useMemo(
    () => universities.find((u) => u.name === universityName),
    [universityName]
  );

  const courseOptions = useMemo(() => {
    if (selectedUniversity) {
      return selectedUniversity.courses
        .filter((c) => c.status !== "not-running")
        .map((c) => c.name);
    }
    return universities
      .flatMap((u) => u.courses.filter((c) => c.status !== "not-running"))
      .map((c) => c.name)
      .filter((name, index, all) => all.indexOf(name) === index)
      .sort();
  }, [selectedUniversity]);

  function toggleService(value: string) {
    setSelectedServices((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  async function onStageOne(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fullName = String(form.get("fullName") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const settlementStatus = String(form.get("settlementStatus") ?? "").trim();
    const company = String(form.get("company") ?? "");

    if (!fullName || !phone || !settlementStatus) {
      setError("Please enter your name, phone number and passport or permit.");
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
        // Still captured — jump to success with WhatsApp if we can't continue
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
    const form = new FormData(event.currentTarget);
    setStatus("sending");
    setError("");

    try {
      const response = await continueLead(draft.leadId, draft.continueToken, {
        email: String(form.get("email") ?? ""),
        ukResidency: String(form.get("ukResidency") ?? ""),
        ageBracket: String(form.get("ageBracket") ?? ""),
        highestQualification: String(form.get("highestQualification") ?? ""),
        previousStudentFinance: String(form.get("previousStudentFinance") ?? ""),
        university: universityName || null,
        course: course || null,
        courseLevel: String(form.get("courseLevel") ?? ""),
        studyMode: studyMode || null,
        classPreference: String(form.get("classPreference") ?? ""),
        preferredCity: String(form.get("preferredCity") ?? ""),
        intake: String(form.get("intake") ?? ""),
        services: selectedServices,
        notes: String(form.get("notes") ?? "").trim() || undefined,
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
        <h3 className="display text-3xl text-navy">Application received</h3>
        <p className="mt-3 text-muted">
          Your reference is <strong className="text-navy">{result.reference}</strong>.
          Continue on WhatsApp with your answers pre-filled — press send and an advisor
          will confirm your eligibility and next steps.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {result.whatsappUrl && (
            <a
              href={result.whatsappUrl}
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
            Email {siteConfig.email}
          </a>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <form
        onSubmit={onStageOne}
        className="space-y-7 rounded-xl border border-line bg-white p-6 shadow-sm sm:p-8"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal">
            Step 1 of 2 · 30 seconds
          </p>
          <h2 className="display mt-2 text-2xl text-navy sm:text-3xl">
            Start your application
          </h2>
          <p className="mt-2 text-sm text-muted">
            Tell us your name, phone and passport or permit. We’ll save this now so an
            advisor can help even if you leave the page.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="fullName">
              Full name *
            </label>
            <input id="fullName" name="fullName" required className="input" autoComplete="name" />
          </div>
          <div>
            <PhoneField name="phone" required />
          </div>
          <div>
            <label className="label" htmlFor="settlementStatus">
              What passport or permit do you have? *
            </label>
            <select
              id="settlementStatus"
              name="settlementStatus"
              required
              className="input"
              defaultValue=""
            >
              <option value="" disabled>
                Select an option
              </option>
              {settlementStatuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

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
          className="flex min-h-12 w-full items-center justify-center rounded-md bg-olive px-5 py-3.5 text-sm font-bold text-navy-deep transition hover:bg-olive-dark disabled:opacity-60 sm:w-auto"
        >
          {status === "sending" ? "Saving…" : "Next — save & continue"}
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={onStageTwo}
      className="space-y-9 rounded-xl border border-line bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal">
          Step 2 of 2 · Almost done
        </p>
        <h2 className="display mt-2 text-2xl text-navy sm:text-3xl">
          A few more details
        </h2>
        <p className="mt-2 text-sm text-muted">
          Saved as <strong className="text-navy">{draft?.reference}</strong> for{" "}
          {draft?.fullName}. Add what you can — you can skip anything you’re unsure
          about.
        </p>
        <div className="mt-3 rounded-lg border border-olive/40 bg-cream/70 px-3 py-2 text-xs text-navy">
          Your contact details are already with UNIADS. An advisor can call you even
          if you close this page now.
        </div>
      </div>

      <section className="space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-teal">
          Contact & eligibility
        </h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input id="email" name="email" type="email" className="input" autoComplete="email" />
          </div>
          <div>
            <label className="label" htmlFor="ageBracket">
              Your age
            </label>
            <select id="ageBracket" name="ageBracket" className="input" defaultValue="">
              <option value="" disabled>
                Select your age range
              </option>
              {ageBrackets.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="ukResidency">
              How long have you lived in the UK?
            </label>
            <select id="ukResidency" name="ukResidency" className="input" defaultValue="">
              <option value="" disabled>
                Select
              </option>
              {residencyOptions.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="highestQualification">
              Do you have any previous qualification?
            </label>
            <select
              id="highestQualification"
              name="highestQualification"
              className="input"
              defaultValue=""
            >
              <option value="" disabled>
                Select an option
              </option>
              {qualificationOptions.map((q) => (
                <option key={q}>{q}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="previousStudentFinance">
              Have you received UK student finance before?
            </label>
            <select
              id="previousStudentFinance"
              name="previousStudentFinance"
              className="input"
              defaultValue=""
            >
              <option value="" disabled>
                Select
              </option>
              {financeHistoryOptions.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-teal">
          Course choice
        </h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="university">
              University you want to attend
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
              <option value="">Select a university or college</option>
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
          <div>
            <label className="label" htmlFor="courseLevel">
              Course level
            </label>
            <select id="courseLevel" name="courseLevel" className="input" defaultValue="">
              <option value="" disabled>
                Select course level
              </option>
              <option>Foundation Year</option>
              <option>Undergraduate / HND</option>
              <option>CertHE</option>
              <option>Postgraduate / Master’s</option>
              <option>English &amp; Maths Certification only</option>
              <option>Not sure — need guidance</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="subject">
              Subject interest
            </label>
            <select id="subject" name="subject" className="input" defaultValue="">
              <option value="" disabled>
                Select a subject area
              </option>
              {subjectAreas.map((s) => (
                <option key={s}>{s}</option>
              ))}
              <option>Other / Not listed</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <span className="label">Full-time or part-time?</span>
            <div className="flex flex-wrap gap-2">
              {studyModes.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setStudyMode(mode)}
                  className={`min-h-12 min-w-[8.5rem] rounded-md px-4 py-2.5 text-sm font-semibold transition ${
                    studyMode === mode
                      ? "bg-olive text-navy-deep"
                      : "bg-cream text-navy hover:bg-olive/30"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label" htmlFor="classPreference">
              Class preference
            </label>
            <select
              id="classPreference"
              name="classPreference"
              className="input"
              defaultValue=""
            >
              <option value="" disabled>
                Select
              </option>
              {classPreferences.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="preferredCity">
              Preferred city / campus
            </label>
            <select
              id="preferredCity"
              name="preferredCity"
              className="input"
              defaultValue=""
            >
              <option value="" disabled>
                Select
              </option>
              {preferredCities.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="intake">
              Preferred intake
            </label>
            <select id="intake" name="intake" className="input" defaultValue="">
              <option value="" disabled>
                Select intake
              </option>
              {intakeOptions.map((i) => (
                <option key={i}>{i}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedUniversity && (
          <div className="rounded-lg bg-cream p-4 text-xs text-muted">
            <p className="font-semibold text-navy">
              {selectedUniversity.shortName} entry notes
            </p>
            <p className="mt-1">
              {selectedUniversity.schedule} · {selectedUniversity.interview} · Minimum
              age {selectedUniversity.minAge} · {selectedUniversity.qualifications}
            </p>
          </div>
        )}
      </section>

      <section className="space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-teal">
          Support you need
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {services.map((s) => (
            <label
              key={s.slug}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-line bg-cream/60 px-3 py-3 text-sm hover:border-teal"
            >
              <input
                type="checkbox"
                className="mt-1"
                checked={selectedServices.includes(s.title)}
                onChange={() => toggleService(s.title)}
              />
              <span className="font-semibold text-navy">{s.shortTitle}</span>
            </label>
          ))}
          {courseTypes.map((c) => (
            <label
              key={c.slug}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-line bg-cream/60 px-3 py-3 text-sm hover:border-teal"
            >
              <input
                type="checkbox"
                className="mt-1"
                checked={selectedServices.includes(c.title)}
                onChange={() => toggleService(c.title)}
              />
              <span className="font-semibold text-navy">{c.shortTitle}</span>
            </label>
          ))}
        </div>

        <div>
          <label className="label" htmlFor="notes">
            Anything else we should know?
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            className="input"
            placeholder="Work experience, documents you already have, funding questions…"
          />
        </div>
      </section>

      {status === "error" && (
        <p className="text-sm font-semibold text-red-600">{error}</p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "sending"}
          className="flex min-h-12 w-full items-center justify-center rounded-md bg-olive px-5 py-3.5 text-sm font-bold text-navy-deep transition hover:bg-olive-dark disabled:opacity-60 sm:w-auto"
        >
          {status === "sending"
            ? "Submitting…"
            : "Finish application & open WhatsApp"}
        </button>
        <button
          type="button"
          disabled={status === "sending"}
          onClick={() =>
            setResult({
              reference: draft?.reference ?? null,
              whatsappUrl: draft ? draftWhatsApp(draft) : undefined,
            })
          }
          className="min-h-12 w-full rounded-md border border-navy/20 px-5 py-3 text-sm font-semibold text-navy sm:w-auto"
        >
          I’m done for now — advisor will call
        </button>
      </div>
    </form>
  );
}
