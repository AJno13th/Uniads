"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ALLOWED_ATTACHMENT_EXTENSIONS,
  formatBytes,
  MAX_ATTACHMENT_BYTES,
} from "@/lib/crm/attachments";

export type AttachmentMeta = {
  id: string;
  label: string;
  fileName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
};

const SUGGESTED_LABELS = [
  "Passport",
  "CV",
  "Qualification certificate",
  "Proof of address",
  "Share code / BRP",
  "Student finance letter",
  "Offer letter",
  "Other",
];

export function LeadDocuments({
  leadId,
  attachments,
}: {
  leadId: string;
  attachments: AttachmentMeta[];
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [label, setLabel] = useState("");

  async function onUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const chosenLabel = String(data.get("label") ?? "").trim();
    const file = data.get("file");

    if (!chosenLabel) {
      setError("Name this file first (e.g. Passport).");
      return;
    }
    if (!(file instanceof File) || file.size === 0) {
      setError("Choose a file to upload.");
      return;
    }
    if (file.size > MAX_ATTACHMENT_BYTES) {
      setError("File is too large. Maximum size is 3 MB.");
      return;
    }

    setBusy(true);
    setError("");

    const response = await fetch(`/api/leads/${leadId}/attachments`, {
      method: "POST",
      body: data,
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setError(payload.error ?? "Upload failed.");
      setBusy(false);
      return;
    }

    form.reset();
    setLabel("");
    if (fileRef.current) fileRef.current.value = "";
    setBusy(false);
    router.refresh();
  }

  async function onDelete(attachmentId: string, attachmentLabel: string) {
    if (!window.confirm(`Remove “${attachmentLabel}” from this client file?`)) {
      return;
    }
    setBusy(true);
    setError("");
    const response = await fetch(
      `/api/leads/${leadId}/attachments/${attachmentId}`,
      { method: "DELETE" }
    );
    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setError(payload.error ?? "Could not remove file.");
      setBusy(false);
      return;
    }
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-sm font-bold uppercase tracking-wider text-teal">
        Documents
      </h2>
      <p className="mt-1 text-xs text-muted">
        Add passport, CV, certificates, and other files. Name each file so the
        team can find it quickly. Max {formatBytes(MAX_ATTACHMENT_BYTES)} ·{" "}
        {ALLOWED_ATTACHMENT_EXTENSIONS.join(", ")}.
      </p>

      <form onSubmit={onUpload} className="mt-4 space-y-3 border-b border-line/70 pb-5">
        <div>
          <label className="label" htmlFor="doc-label">
            File name / label
          </label>
          <input
            id="doc-label"
            name="label"
            className="input"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Passport, CV, Level 3 Certificate"
            list="doc-label-suggestions"
          />
          <datalist id="doc-label-suggestions">
            {SUGGESTED_LABELS.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="label" htmlFor="doc-file">
            Choose file
          </label>
          <input
            ref={fileRef}
            id="doc-file"
            name="file"
            type="file"
            className="block w-full text-sm text-navy file:mr-3 file:rounded-md file:border-0 file:bg-cream file:px-3 file:py-2 file:text-sm file:font-semibold"
            accept={ALLOWED_ATTACHMENT_EXTENSIONS.join(",")}
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-md bg-olive px-4 py-2.5 text-sm font-bold text-navy-deep disabled:opacity-60"
        >
          {busy ? "Uploading…" : "Add file"}
        </button>
      </form>

      {attachments.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No documents on this client file yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {attachments.map((file) => (
            <li
              key={file.id}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-line/60 pb-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-navy">{file.label}</p>
                <p className="truncate text-xs text-muted">
                  {file.fileName} · {formatBytes(file.size)} ·{" "}
                  {new Date(file.uploadedAt).toLocaleString("en-GB")} ·{" "}
                  {file.uploadedBy}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <a
                  href={`/api/leads/${leadId}/attachments/${file.id}`}
                  className="rounded-md border border-navy/20 px-3 py-1.5 text-xs font-bold text-navy"
                >
                  Download
                </a>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onDelete(file.id, file.label)}
                  className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-bold text-red-700 disabled:opacity-60"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
    </div>
  );
}
