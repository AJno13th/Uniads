import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { Lead, LeadFilters, LeadStage, NewLeadInput } from "./types";
import {
  applyFilters,
  computeStats,
  hydrateNewLead,
  makeActivity,
  type LeadStats,
  type LeadStore,
} from "./shared";
import { stageLabels } from "./types";

function dataFilePath() {
  const relative = process.env.CRM_DATA_FILE ?? ".data/leads.json";
  return join(/* turbopackIgnore: true */ process.cwd(), relative);
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
    return Array.isArray(parsed) ? parsed : [];
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

  async stats(): Promise<LeadStats> {
    return computeStats(await readAll());
  },
};
