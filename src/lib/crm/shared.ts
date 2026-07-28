import { randomUUID } from "node:crypto";
import { scoreLead } from "@/data/qualification";
import type {
  Activity,
  Lead,
  LeadAttachment,
  LeadFilters,
  LeadProfilePatch,
  LeadStage,
  NewAttachmentInput,
  NewLeadInput,
} from "./types";

export type LeadStats = {
  total: number;
  hot: number;
  last7Days: number;
  byStage: Record<string, number>;
};

export interface LeadStore {
  init(): Promise<void>;
  create(input: NewLeadInput): Promise<Lead>;
  list(filters?: LeadFilters): Promise<Lead[]>;
  get(id: string): Promise<Lead | null>;
  update(
    id: string,
    patch: { stage?: LeadStage; owner?: string | null },
    author: string
  ): Promise<Lead | null>;
  updateProfile(
    id: string,
    patch: LeadProfilePatch,
    author: string
  ): Promise<Lead | null>;
  addAttachment(
    id: string,
    input: NewAttachmentInput,
    author: string
  ): Promise<Lead | null>;
  removeAttachment(
    id: string,
    attachmentId: string,
    author: string
  ): Promise<Lead | null>;
  addNote(id: string, body: string, author: string): Promise<Lead | null>;
  delete(id: string): Promise<boolean>;
  stats(): Promise<LeadStats>;
}

export function buildReference(createdAt: Date, seed: string) {
  const y = createdAt.getUTCFullYear().toString().slice(-2);
  const m = String(createdAt.getUTCMonth() + 1).padStart(2, "0");
  return `UA-${y}${m}-${seed.replace(/-/g, "").slice(0, 5).toUpperCase()}`;
}

/** Ensure older leads without attachments / attribution still work. */
export function normalizeLead(lead: Lead): Lead {
  return {
    ...lead,
    attachments: Array.isArray(lead.attachments) ? lead.attachments : [],
    activities: Array.isArray(lead.activities) ? lead.activities : [],
    services: Array.isArray(lead.services) ? lead.services : [],
    utmSource: lead.utmSource ?? null,
    utmMedium: lead.utmMedium ?? null,
    utmCampaign: lead.utmCampaign ?? null,
    utmContent: lead.utmContent ?? null,
    utmTerm: lead.utmTerm ?? null,
    fbclid: lead.fbclid ?? null,
    ttclid: lead.ttclid ?? null,
    gclid: lead.gclid ?? null,
    landingPage: lead.landingPage ?? null,
    referrer: lead.referrer ?? null,
  };
}

export function hydrateNewLead(input: NewLeadInput): Lead {
  const now = new Date();
  const id = randomUUID();
  const { score, band } = scoreLead(input);

  return {
    ...input,
    id,
    reference: buildReference(now, id),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    stage: input.stage ?? "new",
    owner: null,
    score,
    scoreBand: band,
    utmSource: input.utmSource ?? null,
    utmMedium: input.utmMedium ?? null,
    utmCampaign: input.utmCampaign ?? null,
    utmContent: input.utmContent ?? null,
    utmTerm: input.utmTerm ?? null,
    fbclid: input.fbclid ?? null,
    ttclid: input.ttclid ?? null,
    gclid: input.gclid ?? null,
    landingPage: input.landingPage ?? null,
    referrer: input.referrer ?? null,
    attachments: [],
    activities: [
      {
        id: randomUUID(),
        at: now.toISOString(),
        type: "created",
        body: `Lead captured from ${input.source.replace("_", " ")} form`,
        author: "website",
      },
    ],
  };
}

export function makeActivity(
  type: Activity["type"],
  body: string,
  author: string
): Activity {
  return { id: randomUUID(), at: new Date().toISOString(), type, body, author };
}

export function applyProfilePatch(
  lead: Lead,
  patch: LeadProfilePatch,
  author: string
): Lead {
  const next: Lead = { ...lead };
  const changed: string[] = [];

  const setString = (
    key: keyof LeadProfilePatch,
    label: string,
    max = 500
  ) => {
    if (patch[key] === undefined) return;
    const raw = patch[key];
    const value =
      raw === null || raw === ""
        ? null
        : typeof raw === "string"
          ? raw.trim().slice(0, max) || null
          : null;
    if ((next[key as keyof Lead] as unknown) !== value) {
      (next as Record<string, unknown>)[key] = value;
      changed.push(label);
    }
  };

  if (patch.fullName !== undefined) {
    const value = patch.fullName.trim().slice(0, 120);
    if (value && value !== next.fullName) {
      next.fullName = value;
      changed.push("name");
    }
  }
  if (patch.email !== undefined) {
    const value = patch.email.trim().slice(0, 160);
    if (value !== next.email) {
      next.email = value;
      changed.push("email");
    }
  }
  if (patch.phone !== undefined) {
    const value = patch.phone.trim().slice(0, 40);
    if (value && value !== next.phone) {
      next.phone = value;
      changed.push("phone");
    }
  }

  setString("settlementStatus", "residency status", 120);
  setString("ukResidency", "time in the UK", 60);
  setString("ageBracket", "age", 30);
  setString("highestQualification", "highest qualification", 120);
  setString("previousStudentFinance", "student finance history", 120);
  setString("university", "university", 160);
  setString("course", "course", 200);
  setString("courseLevel", "course level", 80);
  setString("studyMode", "study mode", 40);
  setString("classPreference", "class preference", 80);
  setString("preferredCity", "preferred city", 60);
  setString("intake", "intake", 60);
  setString("notes", "notes", 2000);
  setString("callDate", "call date", 20);
  setString("callTime", "call time", 10);

  if (patch.services !== undefined) {
    const services = patch.services
      .map((s) => s.trim().slice(0, 160))
      .filter(Boolean)
      .slice(0, 20);
    if (JSON.stringify(services) !== JSON.stringify(next.services)) {
      next.services = services;
      changed.push("support requested");
    }
  }

  if (changed.length === 0) return lead;

  const { score, band } = scoreLead(next);
  next.score = score;
  next.scoreBand = band;
  next.updatedAt = new Date().toISOString();
  next.activities = [
    ...next.activities,
    makeActivity(
      "field_update",
      `Updated ${changed.join(", ")}`,
      author
    ),
  ];
  return next;
}

export function buildAttachment(
  input: NewAttachmentInput,
  author: string
): LeadAttachment {
  return {
    id: randomUUID(),
    label: input.label.trim().slice(0, 120) || input.fileName,
    fileName: input.fileName.trim().slice(0, 200),
    mimeType: input.mimeType.slice(0, 120) || "application/octet-stream",
    size: input.size,
    data: input.data,
    uploadedAt: new Date().toISOString(),
    uploadedBy: author,
  };
}

export function applyFilters(leads: Lead[], filters: LeadFilters = {}): Lead[] {
  const term = filters.search?.trim().toLowerCase();

  return leads.filter((lead) => {
    if (filters.stage && filters.stage !== "all" && lead.stage !== filters.stage) {
      return false;
    }
    if (
      filters.settlementStatus &&
      filters.settlementStatus !== "all" &&
      lead.settlementStatus !== filters.settlementStatus
    ) {
      return false;
    }
    if (
      filters.university &&
      filters.university !== "all" &&
      lead.university !== filters.university
    ) {
      return false;
    }
    if (
      filters.studyMode &&
      filters.studyMode !== "all" &&
      lead.studyMode !== filters.studyMode
    ) {
      return false;
    }
    if (filters.band && filters.band !== "all" && lead.scoreBand !== filters.band) {
      return false;
    }
    if (filters.source && filters.source !== "all" && lead.source !== filters.source) {
      return false;
    }
    if (term) {
      const hay = [
        lead.fullName,
        lead.email,
        lead.phone,
        lead.reference,
        lead.university,
        lead.course,
        lead.owner,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!hay.includes(term)) return false;
    }
    return true;
  });
}

export function computeStats(leads: Lead[]): LeadStats {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const byStage: Record<string, number> = {};
  let hot = 0;
  let last7Days = 0;

  for (const lead of leads) {
    byStage[lead.stage] = (byStage[lead.stage] ?? 0) + 1;
    if (lead.scoreBand === "hot") hot += 1;
    if (new Date(lead.createdAt).getTime() >= weekAgo) last7Days += 1;
  }

  return { total: leads.length, hot, last7Days, byStage };
}
