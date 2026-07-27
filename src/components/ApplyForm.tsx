"use client";

import { FormEvent, useState } from "react";
import { services, courseTypes, siteConfig, whatsappLink } from "@/data/site";
import { universities, subjectAreas } from "@/data/universities";

const studyModes = [
  "Full-time",
  "Part-time",
  "Online",
  "On-campus",
  "Evening / Weekend",
  "Not sure yet",
];

export function ApplyForm() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  function toggleService(value: string) {
    setSelectedServices((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("fullName") || "");
    const phone = String(form.get("phone") || "");
    const courseInterest = String(form.get("courseInterest") || "");
    const university = String(form.get("university") || "");
    const message = [
      "New UNIADS application enquiry",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${form.get("email")}`,
      `Services: ${selectedServices.join(", ") || "Not specified"}`,
      `Course type: ${form.get("courseType")}`,
      `Subject: ${courseInterest}`,
      `University preference: ${university}`,
      `Study mode: ${form.get("studyMode")}`,
      `Start: ${form.get("intake")}`,
      `Notes: ${form.get("notes")}`,
    ].join("\n");

    setSubmitted(true);
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-olive/40 bg-white p-8 text-center shadow-sm">
        <h3 className="display text-3xl text-navy">Application started</h3>
        <p className="mt-3 text-muted">
          Thank you. Continue the conversation on WhatsApp so our advisors can
          guide your next steps. You can also email{" "}
          <a className="font-semibold text-teal" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-8 rounded-xl border border-line bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <h2 className="display text-2xl text-navy sm:text-3xl">
          Start your application
        </h2>
        <p className="mt-2 text-sm text-muted">
          Tell us exactly what you need using the options below. A UNIADS advisor
          will follow up by phone, email or WhatsApp.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="fullName">
            Full name *
          </label>
          <input id="fullName" name="fullName" required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="phone">
            Phone / WhatsApp *
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
          <label className="label" htmlFor="intake">
            Preferred intake
          </label>
          <select id="intake" name="intake" className="input" defaultValue="">
            <option value="" disabled>
              Select intake
            </option>
            <option>As soon as possible</option>
            <option>Next available intake</option>
            <option>September</option>
            <option>January</option>
            <option>May / June</option>
            <option>Not sure yet</option>
          </select>
        </div>
      </div>

      <fieldset>
        <legend className="label">Services you need *</legend>
        <p className="mb-3 text-xs text-muted">
          Tick all that apply so we can tailor your support.
        </p>
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
              <span>
                <span className="font-semibold text-navy">{s.shortTitle}</span>
                <span className="mt-0.5 block text-xs text-muted">
                  {s.description.slice(0, 90)}…
                </span>
              </span>
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
              <span className="font-semibold text-navy">{c.title}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="courseType">
            Course level
          </label>
          <select id="courseType" name="courseType" className="input" defaultValue="">
            <option value="" disabled>
              Select course level
            </option>
            <option>Foundation Year</option>
            <option>Undergraduate / HND</option>
            <option>CertHE</option>
            <option>Postgraduate / Master’s</option>
            <option>English & Maths Certification only</option>
            <option>Not sure — need guidance</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="courseInterest">
            Subject interest
          </label>
          <select
            id="courseInterest"
            name="courseInterest"
            className="input"
            defaultValue=""
          >
            <option value="" disabled>
              Select a subject area
            </option>
            {subjectAreas.map((s) => (
              <option key={s}>{s}</option>
            ))}
            <option>Other / Not listed</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="university">
            Preferred university / college
          </label>
          <select id="university" name="university" className="input" defaultValue="">
            <option value="" disabled>
              Select a partner institution
            </option>
            <option>No preference — advise me</option>
            {universities.map((u) => (
              <option key={u.slug}>{u.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="studyMode">
            Preferred study mode
          </label>
          <select id="studyMode" name="studyMode" className="input" defaultValue="">
            <option value="" disabled>
              Select study mode
            </option>
            {studyModes.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
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
          placeholder="Qualifications, work experience, funding questions, preferred city…"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-olive px-5 py-3.5 text-sm font-bold text-navy-deep transition hover:bg-olive-dark sm:w-auto"
      >
        Submit &amp; Continue on WhatsApp
      </button>
    </form>
  );
}
