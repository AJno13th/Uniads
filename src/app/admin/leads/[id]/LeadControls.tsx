"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { leadStages, stageLabels, type LeadStage } from "@/lib/crm/types";

export function LeadControls({
  leadId,
  leadName,
  stage,
  owner,
}: {
  leadId: string;
  leadName: string;
  stage: LeadStage;
  owner: string | null;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function patch(body: Record<string, unknown>) {
    setBusy(true);
    setError("");
    const response = await fetch(`/api/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Update failed.");
    } else {
      router.refresh();
    }
    setBusy(false);
  }

  async function onNoteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const note = String(data.get("note") ?? "").trim();
    if (!note) return;
    await patch({ note });
    form.reset();
  }

  async function onDelete() {
    const confirmed = window.confirm(
      `Permanently delete ${leadName}'s client file?\n\nThis removes notes, documents and activity. This cannot be undone.`
    );
    if (!confirmed) return;

    setBusy(true);
    setError("");
    const response = await fetch(`/api/leads/${leadId}`, { method: "DELETE" });
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Could not delete this lead.");
      setBusy(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
      <div>
        <label className="label" htmlFor="stage">
          Pipeline stage
        </label>
        <select
          id="stage"
          className="input"
          defaultValue={stage}
          disabled={busy}
          onChange={(e) => patch({ stage: e.target.value })}
        >
          {leadStages.map((s) => (
            <option key={s} value={s}>
              {stageLabels[s]}
            </option>
          ))}
        </select>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          const value = new FormData(event.currentTarget).get("owner");
          patch({ owner: String(value ?? "") });
        }}
      >
        <label className="label" htmlFor="owner">
          Assigned advisor
        </label>
        <div className="flex gap-2">
          <input
            id="owner"
            name="owner"
            className="input"
            defaultValue={owner ?? ""}
            placeholder="Advisor name"
          />
          <button
            type="submit"
            disabled={busy}
            className="shrink-0 rounded-md bg-navy px-4 text-sm font-bold text-white disabled:opacity-60"
          >
            Save
          </button>
        </div>
      </form>

      <form onSubmit={onNoteSubmit}>
        <label className="label" htmlFor="note">
          Add a note
        </label>
        <textarea
          id="note"
          name="note"
          rows={4}
          className="input"
          placeholder="Call outcome, documents received, next steps…"
        />
        <button
          type="submit"
          disabled={busy}
          className="mt-3 w-full rounded-md bg-olive px-4 py-2.5 text-sm font-bold text-navy-deep disabled:opacity-60"
        >
          {busy ? "Saving…" : "Add note"}
        </button>
      </form>

      <div className="border-t border-line/70 pt-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          Danger zone
        </p>
        <button
          type="button"
          disabled={busy}
          onClick={onDelete}
          className="mt-3 w-full rounded-md border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-800 disabled:opacity-60"
        >
          {busy ? "Working…" : "Delete client file"}
        </button>
      </div>

      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
    </div>
  );
}
