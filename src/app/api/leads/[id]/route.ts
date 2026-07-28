import { NextResponse } from "next/server";
import { getSession } from "@/lib/crm/auth";
import { getLeadStore } from "@/lib/crm/store";
import { leadStages, type LeadProfilePatch, type LeadStage } from "@/lib/crm/types";

type Params = { params: Promise<{ id: string }> };

function cleanString(value: unknown, max: number): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().slice(0, max);
  return trimmed.length ? trimmed : null;
}

function parseProfilePatch(body: Record<string, unknown>): LeadProfilePatch {
  const patch: LeadProfilePatch = {};

  const fullName = cleanString(body.fullName, 120);
  if (fullName !== undefined && fullName !== null) patch.fullName = fullName;

  const email = cleanString(body.email, 160);
  if (email !== undefined && email !== null) patch.email = email;

  const phone = cleanString(body.phone, 40);
  if (phone !== undefined && phone !== null) patch.phone = phone;

  const stringFields: [keyof LeadProfilePatch, number][] = [
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
    if (!(key in body)) continue;
    const value = cleanString(body[key], max);
    if (value !== undefined) {
      (patch as Record<string, unknown>)[key] = value;
    }
  }

  if (body.services !== undefined) {
    if (Array.isArray(body.services)) {
      patch.services = body.services
        .map((s) => (typeof s === "string" ? s.trim().slice(0, 160) : ""))
        .filter(Boolean)
        .slice(0, 20);
    } else if (typeof body.services === "string") {
      patch.services = body.services
        .split(/[\n,]+/)
        .map((s) => s.trim().slice(0, 160))
        .filter(Boolean)
        .slice(0, 20);
    }
  }

  return patch;
}

function stripAttachmentData<T extends { attachments?: { data?: string }[] }>(
  lead: T
): T {
  if (!lead.attachments) return lead;
  return {
    ...lead,
    attachments: lead.attachments.map(({ data: _data, ...meta }) => meta),
  };
}

export async function PATCH(request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  const store = await getLeadStore();
  let lead = null;

  if (typeof body.note === "string" && body.note.trim()) {
    lead = await store.addNote(id, body.note.trim().slice(0, 2000), session.user);
  }

  const stage =
    typeof body.stage === "string" && leadStages.includes(body.stage as LeadStage)
      ? (body.stage as LeadStage)
      : undefined;
  const owner =
    body.owner === undefined
      ? undefined
      : body.owner === null || body.owner === ""
        ? null
        : String(body.owner).slice(0, 80);

  if (stage !== undefined || owner !== undefined) {
    lead = await store.update(id, { stage, owner }, session.user);
  }

  const profile = parseProfilePatch(body);
  if (Object.keys(profile).length > 0) {
    lead = await store.updateProfile(id, profile, session.user);
  }

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, lead: stripAttachmentData(lead) });
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { id } = await params;
  const store = await getLeadStore();
  const deleted = await store.delete(id);

  if (!deleted) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
