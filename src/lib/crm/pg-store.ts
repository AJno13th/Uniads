import { Pool } from "pg";
import type { Lead, LeadFilters, LeadStage, NewLeadInput } from "./types";
import { stageLabels } from "./types";
import {
  applyFilters,
  computeStats,
  hydrateNewLead,
  makeActivity,
  type LeadStats,
  type LeadStore,
} from "./shared";

let pool: Pool | null = null;
let initPromise: Promise<void> | null = null;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === "false" ? undefined : { rejectUnauthorized: false },
      max: 5,
    });
  }
  return pool;
}

async function ensureSchema() {
  if (!initPromise) {
    initPromise = getPool()
      .query(
        `CREATE TABLE IF NOT EXISTS uniads_leads (
          id UUID PRIMARY KEY,
          reference TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL,
          stage TEXT NOT NULL,
          data JSONB NOT NULL
        );
        CREATE INDEX IF NOT EXISTS uniads_leads_created_at_idx ON uniads_leads (created_at DESC);
        CREATE INDEX IF NOT EXISTS uniads_leads_stage_idx ON uniads_leads (stage);`
      )
      .then(() => undefined);
  }
  return initPromise;
}

type Row = { data: Lead };

async function fetchAll(): Promise<Lead[]> {
  await ensureSchema();
  const result = await getPool().query<Row>(
    "SELECT data FROM uniads_leads ORDER BY created_at DESC"
  );
  return result.rows.map((r) => r.data);
}

async function save(lead: Lead) {
  await ensureSchema();
  await getPool().query(
    `INSERT INTO uniads_leads (id, reference, created_at, updated_at, stage, data)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (id) DO UPDATE
       SET updated_at = EXCLUDED.updated_at,
           stage = EXCLUDED.stage,
           data = EXCLUDED.data`,
    [lead.id, lead.reference, lead.createdAt, lead.updatedAt, lead.stage, lead]
  );
}

export const pgLeadStore: LeadStore = {
  async init() {
    await ensureSchema();
  },

  async create(input: NewLeadInput): Promise<Lead> {
    const lead = hydrateNewLead(input);
    await save(lead);
    return lead;
  },

  async list(filters: LeadFilters = {}): Promise<Lead[]> {
    return applyFilters(await fetchAll(), filters);
  },

  async get(id: string): Promise<Lead | null> {
    await ensureSchema();
    const result = await getPool().query<Row>(
      "SELECT data FROM uniads_leads WHERE id = $1",
      [id]
    );
    return result.rows[0]?.data ?? null;
  },

  async update(
    id: string,
    patch: { stage?: LeadStage; owner?: string | null },
    author: string
  ): Promise<Lead | null> {
    const lead = await pgLeadStore.get(id);
    if (!lead) return null;

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
    await save(lead);
    return lead;
  },

  async addNote(id: string, body: string, author: string): Promise<Lead | null> {
    const lead = await pgLeadStore.get(id);
    if (!lead) return null;
    lead.activities.push(makeActivity("note", body, author));
    lead.updatedAt = new Date().toISOString();
    await save(lead);
    return lead;
  },

  async stats(): Promise<LeadStats> {
    return computeStats(await fetchAll());
  },
};
