"use client";

import { FormEvent, useMemo, useState } from "react";
import { siteConfig, whatsappLink } from "@/data/site";

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
  return d.toISOString().slice(0, 10);
}

export function BookingCalendar() {
  const days = useMemo(() => nextDays(14), []);
  const [date, setDate] = useState(isoDate(days[0]));
  const [time, setTime] = useState("10:00");
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const message = [
      "UNIADS phone consultation booking request",
      `Name: ${form.get("fullName")}`,
      `Phone: ${form.get("phone")}`,
      `Email: ${form.get("email")}`,
      `Preferred date: ${date}`,
      `Preferred time: ${time} (UK time)`,
      `Topic: ${form.get("topic")}`,
      `Notes: ${form.get("notes")}`,
    ].join("\n");
    setDone(true);
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
  }

  if (done) {
    return (
      <div className="rounded-xl border border-olive/40 bg-white p-8 text-center">
        <h3 className="display text-3xl text-navy">Call requested</h3>
        <p className="mt-3 text-muted">
          Thanks — we will confirm your phone consultation shortly. For a faster
          response, keep WhatsApp open or call{" "}
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
          Choose a date and time that works for you. A UNIADS advisor will call
          you to discuss courses, applications and funding.
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
                className={`rounded-lg border px-3 py-3 text-left text-sm transition ${
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
          <label className="label" htmlFor="topic">
            What would you like to discuss?
          </label>
          <select id="topic" name="topic" className="input" defaultValue="University application">
            <option>University application</option>
            <option>Course advice</option>
            <option>Student finance</option>
            <option>Childcare grant</option>
            <option>English & Maths certification</option>
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
        <p className="text-xs text-muted">
          Selected: <strong>{date}</strong> at <strong>{time}</strong>
        </p>
        <button
          type="submit"
          className="w-full rounded-md bg-navy px-5 py-3.5 text-sm font-bold text-white transition hover:bg-navy-deep"
        >
          Confirm phone call booking
        </button>
      </div>
    </form>
  );
}
