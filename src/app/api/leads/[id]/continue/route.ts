import { NextResponse } from "next/server";
import { getLeadStore } from "@/lib/crm/store";
import type { LeadProfilePatch } from "@/lib/crm/types";
import { buildPresetMessage } from "@/lib/crm/message";
import { whatsappLink } from "@/data/site";

type Params = { params: Promise<{ id: string }> };

const MAX_FIELD = 500;

function clean(value: unknown, max = MAX_FIELD): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().slice(0, max);
  return trimmed.length ? trimmed : null;
}

function cleanList(value: unknown): string[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => (typeof v === "string" ? v.trim().slice(0, 160) : ""))
    .filter(Boolean)
    .slice(0, 20);
}

/**
 * Public continuation of a partial application (no admin session).
 * Requires the continueToken issued when the lead was first created.
 */
export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const continueToken =
    typeof payload.continueToken === "string" ? payload.continueToken.trim() : "";
  if (!continueToken) {
    return NextResponse.json({ error: "Missing continue token." }, { status: 422 });
  }

  const patch: LeadProfilePatch = {};
  const email = clean(payload.email, 160);
  if (email !== undefined) {
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email." }, { status: 422 });
    }
    patch.email = email ?? "";
  }

  const stringFields: [keyof LeadProfilePatch, number][] = [
    ["fullName", 120],
    ["phone", 40],
    ["settlementStatus", 120],
    ["ukResidency", 60],
    ["ageBracket", 30],
    ["highestQualification", 120],
    ["previousStudentFinance", 120],
    ["university", 160],
    ["course", 200],
    ["courseLevel", 80],
    ["studyMode", 40],
    ["classPreference", 80],
    ["preferredCity", 60],
    ["intake", 60],
    ["notes", 2000],
    ["callDate", 20],
    ["callTime", 10],
  ];

  for (const [key, max] of stringFields) {
    if (!(key in payload)) continue;
    const value = clean(payload[key], max);
    if (value !== undefined) {
      (patch as Record<string, unknown>)[key] = value;
    }
  }

  const services = cleanList(payload.services);
  if (services !== undefined) patch.services = services;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "No fields to update." }, { status: 422 });
  }

  const store = await getLeadStore();
  const lead = await store.continue(id, continueToken, patch, "applicant");
  if (!lead) {
    return NextResponse.json(
      { error: "This application link is invalid or expired." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    reference: lead.reference,
    scoreBand: lead.scoreBand,
    leadId: lead.id,
    whatsappUrl: whatsappLink(buildPresetMessage(lead.reference, lead)),
  });
}
