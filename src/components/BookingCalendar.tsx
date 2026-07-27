"use client";

import { FormEvent, useMemo, useState } from "react";
import { siteConfig } from "@/data/site";
import { settlementStatuses, studyModes } from "@/data/qualification";
import { universities } from "@/data/universities";
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

function formatDay(d: Date) {
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function isoDate(d: Date) {
  const offsetMs = d.getTimezoneOffset() * 60 * 1000;
  return new Date(d.getTime() - offsetMs).toISOString().slice(0, 10);
}

export function BookingCalendar() {
  const days = useMemo(() => nextDays(14), []);
  const [date, setDate] = useState(isoDate(days[0]));
  const [time, setTime] = useState("10:00");
  const [studyMode, setStudyMode] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [course, setCourse] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");
  const [reference, setReference] = useState<string | null>(null);

  const courseOptions = useMemo(() => {
    const uni = universities.find((u) => u.name === universityName);
    if (!uni) return [];
    return uni.courses.filter((c) => c.status !== "not-running").map((c) => c.name);
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
      if (response.whatsappUrl) {
        window.open(response.whatsappUrl, "_blank", "noopener,noreferrer");
      }
    } catch (submitError) {
      setStatus("error");
      setError((submitError as Error).message);
    }
  }

  if (reference) {
    return (
      <div className="rounded-xl border border-olive/40 bg-white p-8 text-center">
        <h3 className="display text-3xl text-navy">Call requested</h3>
        <p className="mt-3 text-muted">
          Reference <strong className="text-navy">{reference}</strong>. We will confirm
          your phone consultation for <strong>{date}</strong> at <strong>{time}</strong>.
          For a faster response, call{" "}
          <a className="font-semibold text-teal" href={`tel:+${siteConfig.phone}`}>
            {siteConfig.phoneDisplay}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-8 rounded-xl border border-line bg-white p-6 shadow-sm lg:grid-cols-[1.1fr_0.9fr] lg:p-8"
    >
      <div>
        <h2 className="display text-2xl text-navy sm:text-3xl">
          Book a phone consultation
        </h2>
        <p className="mt-2 text-sm text-muted">
          Choose a date and time that works for you. A UNIADS advisor will call you to
          discuss courses, applications and funding.
        </p>

        <p className="label mt-6">Select a date</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {days.map((d) => {
            const value = isoDate(d);
            const active = value === date;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setDate(value)}
                className={`rounded-lg border px-3 py-3.5 text-left text-sm transition min-h-12 ${
                  active
                    ? "border-navy bg-navy text-white"
                    : "border-line bg-cream/50 text-navy hover:border-teal"
                }`}
              >
                {formatDay(d)}
              </button>
            );
          })}
        </div>

        <p className="label mt-6">Select a time (UK)</p>
        <div className="flex flex-wrap gap-2">
          {timeSlots.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => setTime(slot)}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
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
        <div>
          <label className="label" htmlFor="fullName">
            Full name *
          </label>
          <input id="fullName" name="fullName" required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="phone">
            Phone number *
          </label>
          <input id="phone" name="phone" type="tel" required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="email">
            Email *
          </label>
          <input id="email" name="email" type="email" required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="settlementStatus">
            Settlement status *
          </label>
          <select
            id="settlementStatus"
            name="settlementStatus"
            required
            className="input"
            defaultValue=""
          >
            <option value="" disabled>
              Select your status
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
                <option key={c} value={c}>
                  {c}
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
                className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
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

        <p className="text-xs text-muted">
          Selected: <strong>{date}</strong> at <strong>{time}</strong>
        </p>
        {status === "error" && (
          <p className="text-sm font-semibold text-red-600">{error}</p>
        )}
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-md bg-navy px-5 py-3.5 text-sm font-bold text-white transition hover:bg-navy-deep disabled:opacity-60"
        >
          {status === "sending" ? "Booking…" : "Confirm phone call booking"}
        </button>
      </div>
    </form>
  );
}
