import { siteConfig } from "@/data/site";
import type { Lead, NewLeadInput } from "./types";
import { buildPresetMessage } from "./message";

/**
 * Notify advisors when a lead is captured. Used as a safety net when CRM
 * storage is ephemeral (Vercel file/tmp mode without DATABASE_URL).
 */
export async function notifyLeadCaptured(
  lead: Lead,
  input: NewLeadInput,
  meta: { persisted: boolean },
) {
  const subject = meta.persisted
    ? `New UNIADS ${input.source} lead ${lead.reference}`
    : `New UNIADS ${input.source} lead ${lead.reference} (not saved to CRM)`;

  const body = [
    buildPresetMessage(lead.reference, input),
    "",
    `Score: ${lead.scoreBand} (${lead.score})`,
    `Persisted to CRM: ${meta.persisted ? "yes" : "NO — add DATABASE_URL"}`,
    `Phone: ${lead.phone}`,
    lead.email ? `Email: ${lead.email}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const tasks: Promise<unknown>[] = [];

  const webhook = process.env.LEAD_NOTIFY_WEBHOOK_URL?.trim();
  if (webhook) {
    tasks.push(
      fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body, lead, input, persisted: meta.persisted }),
      }).catch((error) => {
        console.error("[crm/notify] webhook failed", error);
      }),
    );
  }

  const resendKey = process.env.RESEND_API_KEY?.trim();
  const notifyTo =
    process.env.LEAD_NOTIFY_EMAIL?.trim() || siteConfig.email;

  if (resendKey) {
    tasks.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL?.trim() || "UNIADS Leads <onboarding@resend.dev>",
          to: [notifyTo],
          subject,
          text: body,
        }),
      }).catch((error) => {
        console.error("[crm/notify] resend failed", error);
      }),
    );
  } else {
    // Zero-config email fallback (FormSubmit). First use may require confirming
    // the inbox once via an activation email.
    tasks.push(
      fetch(`https://formsubmit.co/ajax/${encodeURIComponent(notifyTo)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: subject,
          _template: "table",
          message: body,
          reference: lead.reference,
          source: input.source,
          fullName: lead.fullName,
          phone: lead.phone,
          email: lead.email,
          callDate: lead.callDate,
          callTime: lead.callTime,
          persisted: meta.persisted ? "yes" : "no",
        }),
      }).catch((error) => {
        console.error("[crm/notify] formsubmit failed", error);
      }),
    );
  }

  await Promise.allSettled(tasks);
}
