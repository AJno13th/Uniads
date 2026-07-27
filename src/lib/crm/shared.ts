import { randomUUID } from "node:crypto";
import { scoreLead } from "@/data/qualification";
import type { Activity, Lead, LeadFilters, LeadStage, NewLeadInput } from "./types";

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
  addNote(id: string, body: string, author: string): Promise<Lead | null>;
  stats(): Promise<LeadStats>;
}

export function buildReference(createdAt: Date, seed: string) {
  const y = createdAt.getUTCFullYear().toString().slice(-2);
  const m = String(createdAt.getUTCMonth() + 1).padStart(2, "0");
  return `UA-${y}${m}-${seed.replace(/-/g, "").slice(0, 5).toUpperCase()}`;
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
      const haystack = [
        lead.fullName,
        lead.email,
        lead.phone,
        lead.reference,
        lead.university,
        lead.course,
        lead.notes,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(term)) return false;
    }
    return true;
  });
}

export function computeStats(leads: Lead[]): LeadStats {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const byStage: Record<string, number> = {};
  for (const lead of leads) {
    byStage[lead.stage] = (byStage[lead.stage] ?? 0) + 1;
  }
  return {
    total: leads.length,
    hot: leads.filter((l) => l.scoreBand === "hot").length,
    last7Days: leads.filter((l) => new Date(l.createdAt).getTime() >= sevenDaysAgo)
      .length,
    byStage,
  };
}
