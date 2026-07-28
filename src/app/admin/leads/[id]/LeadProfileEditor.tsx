"use client";

import { FormEvent, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  ageBrackets,
  classPreferences,
  financeHistoryOptions,
  intakeOptions,
  preferredCities,
  qualificationOptions,
  residencyOptions,
  settlementStatuses,
  studyModes,
} from "@/data/qualification";
import type { Lead } from "@/lib/crm/types";

type ProfileLead = Pick<
  Lead,
  | "fullName"
  | "email"
  | "phone"
  | "settlementStatus"
  | "ukResidency"
  | "ageBracket"
  | "highestQualification"
  | "previousStudentFinance"
  | "university"
  | "course"
  | "courseLevel"
  | "studyMode"
  | "classPreference"
  | "preferredCity"
  | "intake"
  | "services"
  | "notes"
  | "callDate"
  | "callTime"
  | "source"
>;

function Field({
  label,
  name,
  children,
}: {
  label: string;
  name: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      {children}
    </div>
  );
}

function SelectOrCustom({
  id,
  name,
  options,
  defaultValue,
}: {
  id: string;
  name: string;
  options: readonly string[];
  defaultValue: string | null;
}) {
  const value = defaultValue ?? "";
  const known = options.includes(value as (typeof options)[number]);
  return (
    <div className="space-y-2">
      <select
        id={id}
        name={name}
        className="input"
        defaultValue={known ? value : value ? "__custom__" : ""}
      >
        <option value="">—</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
        <option value="__custom__">Other / type below…</option>
      </select>
      <input
        name={`${name}Custom`}
        className="input"
        defaultValue={known || !value ? "" : value}
        placeholder="Custom value (if Other)"
      />
    </div>
  );
}

function resolveSelect(form: FormData, name: string): string | null {
  const selected = String(form.get(name) ?? "").trim();
  const custom = String(form.get(`${name}Custom`) ?? "").trim();
  if (selected === "__custom__") return custom || null;
  return selected || custom || null;
}

export function LeadProfileEditor({
  leadId,
  lead,
}: {
  leadId: string;
  lead: ProfileLead;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const body = {
      fullName: String(data.get("fullName") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      settlementStatus: resolveSelect(data, "settlementStatus"),
      ukResidency: resolveSelect(data, "ukResidency"),
      ageBracket: resolveSelect(data, "ageBracket"),
      highestQualification: resolveSelect(data, "highestQualification"),
      previousStudentFinance: resolveSelect(data, "previousStudentFinance"),
      university: String(data.get("university") ?? "").trim() || null,
      course: String(data.get("course") ?? "").trim() || null,
      courseLevel: String(data.get("courseLevel") ?? "").trim() || null,
      studyMode: resolveSelect(data, "studyMode"),
      classPreference: resolveSelect(data, "classPreference"),
      preferredCity: resolveSelect(data, "preferredCity"),
      intake: resolveSelect(data, "intake"),
      callDate: String(data.get("callDate") ?? "").trim() || null,
      callTime: String(data.get("callTime") ?? "").trim() || null,
      services: String(data.get("services") ?? "")
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean),
      notes: String(data.get("notes") ?? "").trim() || null,
    };

    if (!body.fullName || !body.phone) {
      setError("Name and phone are required.");
      return;
    }

    setBusy(true);
    setError("");
    setSaved(false);

    const response = await fetch(`/api/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setError(payload.error ?? "Could not save client file.");
      setBusy(false);
      return;
    }

    setSaved(true);
    setBusy(false);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-teal">
            Qualification answers
          </h2>
          <p className="mt-1 text-xs text-muted">
            Edit any field on this client file. Source: {lead.source.replace("_", " ")}.
          </p>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-navy px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save changes"}
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="fullName">
          <input
            id="fullName"
            name="fullName"
            className="input"
            defaultValue={lead.fullName}
            required
          />
        </Field>
        <Field label="Phone" name="phone">
          <input
            id="phone"
            name="phone"
            className="input"
            defaultValue={lead.phone}
            required
          />
        </Field>
        <Field label="Email" name="email">
          <input
            id="email"
            name="email"
            type="email"
            className="input"
            defaultValue={lead.email}
          />
        </Field>
        <Field label="University" name="university">
          <input
            id="university"
            name="university"
            className="input"
            defaultValue={lead.university ?? ""}
          />
        </Field>
        <Field label="Course" name="course">
          <input
            id="course"
            name="course"
            className="input"
            defaultValue={lead.course ?? ""}
          />
        </Field>
        <Field label="Course level" name="courseLevel">
          <input
            id="courseLevel"
            name="courseLevel"
            className="input"
            defaultValue={lead.courseLevel ?? ""}
            placeholder="e.g. Foundation, Undergraduate"
          />
        </Field>

        <Field label="Residency status" name="settlementStatus">
          <SelectOrCustom
            id="settlementStatus"
            name="settlementStatus"
            options={settlementStatuses}
            defaultValue={lead.settlementStatus}
          />
        </Field>
        <Field label="Time in the UK" name="ukResidency">
          <SelectOrCustom
            id="ukResidency"
            name="ukResidency"
            options={residencyOptions}
            defaultValue={lead.ukResidency}
          />
        </Field>
        <Field label="Age" name="ageBracket">
          <SelectOrCustom
            id="ageBracket"
            name="ageBracket"
            options={ageBrackets}
            defaultValue={lead.ageBracket}
          />
        </Field>
        <Field label="Highest qualification" name="highestQualification">
          <SelectOrCustom
            id="highestQualification"
            name="highestQualification"
            options={qualificationOptions}
            defaultValue={lead.highestQualification}
          />
        </Field>
        <Field label="Student finance history" name="previousStudentFinance">
          <SelectOrCustom
            id="previousStudentFinance"
            name="previousStudentFinance"
            options={financeHistoryOptions}
            defaultValue={lead.previousStudentFinance}
          />
        </Field>
        <Field label="Study mode" name="studyMode">
          <SelectOrCustom
            id="studyMode"
            name="studyMode"
            options={studyModes}
            defaultValue={lead.studyMode}
          />
        </Field>
        <Field label="Class preference" name="classPreference">
          <SelectOrCustom
            id="classPreference"
            name="classPreference"
            options={classPreferences}
            defaultValue={lead.classPreference}
          />
        </Field>
        <Field label="Preferred city" name="preferredCity">
          <SelectOrCustom
            id="preferredCity"
            name="preferredCity"
            options={preferredCities}
            defaultValue={lead.preferredCity}
          />
        </Field>
        <Field label="Intake" name="intake">
          <SelectOrCustom
            id="intake"
            name="intake"
            options={intakeOptions}
            defaultValue={lead.intake}
          />
        </Field>
        <Field label="Requested call date" name="callDate">
          <input
            id="callDate"
            name="callDate"
            type="date"
            className="input"
            defaultValue={lead.callDate ?? ""}
          />
        </Field>
        <Field label="Requested call time" name="callTime">
          <input
            id="callTime"
            name="callTime"
            type="time"
            className="input"
            defaultValue={lead.callTime ?? ""}
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Support requested (one per line)" name="services">
          <textarea
            id="services"
            name="services"
            rows={3}
            className="input"
            defaultValue={lead.services.join("\n")}
            placeholder="University application&#10;Student finance"
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Applicant / advisor notes" name="notes">
          <textarea
            id="notes"
            name="notes"
            rows={4}
            className="input"
            defaultValue={lead.notes ?? ""}
          />
        </Field>
      </div>

      {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
      {saved && !error && (
        <p className="mt-3 text-sm font-semibold text-teal">Client file saved.</p>
      )}
    </form>
  );
}
