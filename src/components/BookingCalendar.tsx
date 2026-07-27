"use client";

import { FormEvent, useMemo, useState } from "react";
import { siteConfig, whatsappLink } from "@/data/site";
import { settlementStatuses, studyModes } from "@/data/qualification";
import { levelLabel, universities } from "@/data/universities";
import { submitLead } from "@/lib/crm/client";

const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

function nextDays(count = 14) {
  const days: Date[] = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  for (let i = 1; days.length < count; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    if (d.getDay() !== 0) days.push(d);
  }
  return days;
}

/** Local calendar date as YYYY-MM-DD (no timezone shift). */
function toLocalDateValue(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseLocalDateValue(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDayButton(d: Date) {
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatSelectedSlot(dateValue: string, time: string) {
  const d = parseLocalDateValue(dateValue);
  const dayPart = d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${dayPart} at ${time}`;
}

export function BookingCalendar() {
  const days = useMemo(() => nextDays(14), []);
  const [date, setDate] = useState(() => toLocalDateValue(days[0]));
  const [time, setTime] = useState("10:00");
  const [studyMode, setStudyMode] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [course, setCourse] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");
  const [reference, setReference] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  const selectedLabel = formatSelectedSlot(date, time);

  const courseOptions = useMemo(() => {
    const uni = universities.find((u) => u.name === universityName);
    if (!uni) return [];
    return uni.courses
      .filter((c) => c.status !== "not-running")
      .map((c) => ({
        name: c.name,
        label: `${c.name} (${levelLabel(c.level)})`,
      }));
  }, [universityName]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("sending");
    setError("");

    try {
      const response = await submitLead({
        source: "booking",
        fullName: String(form.get("fullName") ?? ""),
        phone: String(form.get("phone") ?? ""),
        email: String(form.get("email") ?? ""),
        settlementStatus: String(form.get("settlementStatus") ?? ""),
        university: universityName,
        course,
        studyMode,
        callDate: date,
        callTime: time,
        notes: String(form.get("notes") ?? ""),
        services: [String(form.get("topic") ?? "")].filter(Boolean),
        company: String(form.get("company") ?? ""),
      });
      setReference(response.reference);
      const wa =
        response.whatsappUrl ||
        whatsappLink(
          `Hi UNIADS, I booked a phone call for ${selectedLabel}. Reference ${response.reference ?? ""}.`,
        );
      setWhatsappUrl(wa);
      setStatus("idle");
    } catch (submitError) {
      setStatus("error");
      setError((submitError as Error).message);
    }
  }

  if (reference) {
    return (
      <div className="rounded-xl border border-olive/40 bg-white p-6 text-center sm:p-8">
        <h3 className="display text-3xl text-navy">Call requested</h3>
        <p className="mt-3 text-muted">
          Reference <strong className="text-navy">{reference}</strong>. We will confirm
          your phone consultation for{" "}
          <strong className="text-navy">{selectedLabel}</strong>.
        </p>
        <p className="mt-3 text-sm text-muted">
          For a faster response, message us on WhatsApp or call{" "}
          <a className="font-semibold text-teal" href={`tel:+${siteConfig.phone}`}>
            {siteConfig.phoneDisplay}
          </a>
          .
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#25D366] px-5 py-3 text-sm font-bold text-white transition hover:brightness-95"
            >
              Continue on WhatsApp
            </a>
          )}
          <a
            href={`tel:+${siteConfig.phone}`}
            className="inline-flex min-h-12 items-center justify-center rounded-md border border-line bg-white px-5 py-3 text-sm font-bold text-navy transition hover:border-navy"
          >
            Call {siteConfig.phoneDisplay}
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-8 rounded-xl border border-line bg-white p-5 shadow-sm sm:p-6 lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
        <div>
          <h2 className="display text-2xl text-navy sm:text-3xl">
            Book a phone consultation
          </h2>
          <p className="mt-2 text-sm text-muted">
            Choose a date and time that works for you. A UNIADS advisor will call
            you to discuss courses, applications and funding.
          </p>

          <div
            className="mt-5 rounded-lg border border-olive/50 bg-olive/15 px-4 py-3 text-sm text-navy"
            aria-live="polite"
          >
            <span className="font-semibold">Selected slot:</span> {selectedLabel}
          </div>

          <p className="label mt-6">1. Select a date</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {days.map((d) => {
              const value = toLocalDateValue(d);
              const active = value === date;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDate(value)}
                  aria-pressed={active}
                  className={`min-h-12 rounded-lg border px-3 py-3.5 text-left text-sm transition ${
                    active
                      ? "border-navy bg-navy text-white"
                      : "border-line bg-cream/50 text-navy hover:border-teal"
                  }`}
                >
                  {formatDayButton(d)}
                </button>
              );
            })}
          </div>

          <p className="label mt-6">2. Select a time (UK)</p>
          <div className="flex flex-wrap gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setTime(slot)}
                aria-pressed={time === slot}
                className={`min-h-11 rounded-md px-3 py-2 text-sm font-semibold transition ${
                  time === slot
                    ? "bg-olive text-navy-deep"
                    : "bg-cream text-navy hover:bg-olive/40"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className="label !mt-0">3. Your details</p>
          <div>
            <label className="label" htmlFor="fullName">
              Full name *
            </label>
            <input id="fullName" name="fullName" required className="input" autoComplete="name" />
          </div>
          <div>
            <label className="label" htmlFor="phone">
              Phone number *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              className="input"
              autoComplete="tel"
            />
          </div>
          <div>
            <label className="label" htmlFor="email">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="label" htmlFor="settlementStatus">
              Residency status in the UK *
            </label>
            <select
              id="settlementStatus"
              name="settlementStatus"
              required
              className="input"
              defaultValue=""
            >
              <option value="" disabled>
                Select your residency status
              </option>
              {settlementStatuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="booking-university">
              University of interest
            </label>
            <select
              id="booking-university"
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
          {courseOptions.length > 0 && (
            <div>
              <label className="label" htmlFor="booking-course">
                Course of interest
              </label>
              <select
                id="booking-course"
                className="input"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              >
                <option value="">Select a course</option>
                {courseOptions.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.label}
                  </option>
                ))}
                <option value="Not sure — please advise">Not sure — please advise</option>
              </select>
            </div>
          )}
          <div>
            <span className="label">Full-time or part-time?</span>
            <div className="flex flex-wrap gap-2">
              {studyModes.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setStudyMode(mode)}
                  aria-pressed={studyMode === mode}
                  className={`min-h-11 rounded-md px-4 py-2 text-sm font-semibold transition ${
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
            <label className="label" htmlFor="topic">
              What would you like to discuss?
            </label>
            <select
              id="topic"
              name="topic"
              className="input"
              defaultValue="University application"
            >
              <option>University application</option>
              <option>Course advice</option>
              <option>Student finance</option>
              <option>Childcare grant</option>
              <option>English &amp; Maths certification</option>
              <option>Job sourcing support</option>
              <option>General enquiry</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="notes">
              Notes (optional)
            </label>
            <textarea id="notes" name="notes" rows={3} className="input" />
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

          <div className="hidden lg:block">
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-md bg-navy px-5 py-3.5 text-sm font-bold text-white transition hover:bg-navy-deep disabled:opacity-60"
            >
              {status === "sending" ? "Booking…" : `Confirm call — ${selectedLabel}`}
            </button>
          </div>
        </div>
      </div>

      {/* Sticky confirm on mobile — leave room for the WhatsApp float on the right */}
      <div className="sticky bottom-3 z-20 mr-[4.5rem] lg:hidden">
        <div className="rounded-xl border border-line bg-white/95 p-3 shadow-lg backdrop-blur">
          <p className="mb-2 text-center text-xs text-muted">{selectedLabel}</p>
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-md bg-navy px-5 py-3.5 text-sm font-bold text-white transition hover:bg-navy-deep disabled:opacity-60"
          >
            {status === "sending" ? "Booking…" : "Confirm phone call booking"}
          </button>
        </div>
      </div>
    </form>
  );
}
