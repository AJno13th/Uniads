import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type {
  Lead,
  LeadFilters,
  LeadProfilePatch,
  LeadStage,
  NewAttachmentInput,
  NewLeadInput,
} from "./types";
import {
  applyFilters,
  applyProfilePatch,
  buildAttachment,
  computeStats,
  hydrateNewLead,
  makeActivity,
  normalizeLead,
  type LeadStats,
  type LeadStore,
} from "./shared";
import { stageLabels } from "./types";

function dataFilePath() {
  // Vercel’s filesystem is read-only except /tmp. Prefer an explicit
  // CRM_DATA_FILE, then /tmp on serverless, otherwise project-local .data.
  if (process.env.CRM_DATA_FILE) {
    const configured = process.env.CRM_DATA_FILE;
    return configured.startsWith("/")
      ? configured
      : join(/* turbopackIgnore: true */ process.cwd(), configured);
  }
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return "/tmp/uniads-leads.json";
  }
  return join(/* turbopackIgnore: true */ process.cwd(), ".data/leads.json");
}

/**
 * Serialises writes so concurrent submissions cannot clobber the file.
 */
let queue: Promise<unknown> = Promise.resolve();

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
}

async function readAll(): Promise<Lead[]> {
  try {
    const raw = await readFile(dataFilePath(), "utf8");
    const parsed = JSON.parse(raw) as Lead[];
    return Array.isArray(parsed) ? parsed.map(normalizeLead) : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function writeAll(leads: Lead[]) {
  await mkdir(dirname(dataFilePath()), { recursive: true });
  await writeFile(dataFilePath(), JSON.stringify(leads, null, 2), "utf8");
}

function sortNewestFirst(leads: Lead[]) {
  return [...leads].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export const jsonLeadStore: LeadStore = {
  async init() {
    await mkdir(dirname(dataFilePath()), { recursive: true });
  },

  async create(input: NewLeadInput): Promise<Lead> {
    return enqueue(async () => {
      const leads = await readAll();
      const lead = hydrateNewLead(input);
      leads.push(lead);
      await writeAll(leads);
      return lead;
    });
  },

  async list(filters: LeadFilters = {}): Promise<Lead[]> {
    const leads = await readAll();
    return sortNewestFirst(applyFilters(leads, filters));
  },

  async get(id: string): Promise<Lead | null> {
    const leads = await readAll();
    return leads.find((l) => l.id === id) ?? null;
  },

  async update(
    id: string,
    patch: { stage?: LeadStage; owner?: string | null },
    author: string
  ): Promise<Lead | null> {
    return enqueue(async () => {
      const leads = await readAll();
      const index = leads.findIndex((l) => l.id === id);
      if (index === -1) return null;
      const lead = leads[index];

      if (patch.stage && patch.stage !== lead.stage) {
        lead.activities.push(
          makeActivity(
            "stage_change",
            `Stage changed from ${stageLabels[lead.stage]} to ${stageLabels[patch.stage]}`,
            author
          )
        );
        lead.stage = patch.stage;
      }
      if (patch.owner !== undefined && patch.owner !== lead.owner) {
        lead.activities.push(
          makeActivity(
            "owner_change",
            patch.owner ? `Assigned to ${patch.owner}` : "Owner cleared",
            author
          )
        );
        lead.owner = patch.owner;
      }
      lead.updatedAt = new Date().toISOString();
      leads[index] = lead;
      await writeAll(leads);
      return lead;
    });
  },

  async updateProfile(
    id: string,
    patch: LeadProfilePatch,
    author: string
  ): Promise<Lead | null> {
    return enqueue(async () => {
      const leads = await readAll();
      const index = leads.findIndex((l) => l.id === id);
      if (index === -1) return null;
      const next = applyProfilePatch(leads[index], patch, author);
      leads[index] = next;
      await writeAll(leads);
      return next;
    });
  },

  async addAttachment(
    id: string,
    input: NewAttachmentInput,
    author: string
  ): Promise<Lead | null> {
    return enqueue(async () => {
      const leads = await readAll();
      const index = leads.findIndex((l) => l.id === id);
      if (index === -1) return null;
      const lead = leads[index];
      const attachment = buildAttachment(input, author);
      lead.attachments = [...lead.attachments, attachment];
      lead.activities.push(
        makeActivity(
          "attachment",
          `Uploaded “${attachment.label}” (${attachment.fileName})`,
          author
        )
      );
      lead.updatedAt = new Date().toISOString();
      leads[index] = lead;
      await writeAll(leads);
      return lead;
    });
  },

  async removeAttachment(
    id: string,
    attachmentId: string,
    author: string
  ): Promise<Lead | null> {
    return enqueue(async () => {
      const leads = await readAll();
      const index = leads.findIndex((l) => l.id === id);
      if (index === -1) return null;
      const lead = leads[index];
      const existing = lead.attachments.find((a) => a.id === attachmentId);
      if (!existing) return null;
      lead.attachments = lead.attachments.filter((a) => a.id !== attachmentId);
      lead.activities.push(
        makeActivity(
          "attachment",
          `Removed “${existing.label}” (${existing.fileName})`,
          author
        )
      );
      lead.updatedAt = new Date().toISOString();
      leads[index] = lead;
      await writeAll(leads);
      return lead;
    });
  },

  async continue(
    id: string,
    continueToken: string,
    patch: LeadProfilePatch,
    author = "applicant"
  ): Promise<Lead | null> {
    return enqueue(async () => {
      const leads = await readAll();
      const index = leads.findIndex((l) => l.id === id);
      if (index === -1) return null;
      const lead = leads[index];
      if (!lead.continueToken || lead.continueToken !== continueToken) return null;
      const next = applyProfilePatch(lead, patch, author);
      if (next === lead) {
        lead.activities.push(
          makeActivity("field_update", "Applicant continued application form", author)
        );
        lead.updatedAt = new Date().toISOString();
        leads[index] = lead;
        await writeAll(leads);
        return lead;
      }
      leads[index] = next;
      await writeAll(leads);
      return next;
    });
  },

  async addNote(id: string, body: string, author: string): Promise<Lead | null> {
    return enqueue(async () => {
      const leads = await readAll();
      const index = leads.findIndex((l) => l.id === id);
      if (index === -1) return null;
      leads[index].activities.push(makeActivity("note", body, author));
      leads[index].updatedAt = new Date().toISOString();
      await writeAll(leads);
      return leads[index];
    });
  },

  async delete(id: string): Promise<boolean> {
    return enqueue(async () => {
      const leads = await readAll();
      const next = leads.filter((l) => l.id !== id);
      if (next.length === leads.length) return false;
      await writeAll(next);
      return true;
    });
  },

  async stats(): Promise<LeadStats> {
    return computeStats(await readAll());
  },
};
