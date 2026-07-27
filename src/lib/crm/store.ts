import { jsonLeadStore } from "./json-store";
import type { LeadStore } from "./shared";

/**
 * Postgres is used whenever DATABASE_URL is configured (hosted deployments);
 * otherwise leads persist to a local JSON file so the CRM works out of the box.
 */
export async function getLeadStore(): Promise<LeadStore> {
  if (process.env.DATABASE_URL) {
    const { pgLeadStore } = await import("./pg-store");
    return pgLeadStore;
  }
  return jsonLeadStore;
}

export function storeMode(): "postgres" | "file" {
  return process.env.DATABASE_URL ? "postgres" : "file";
}

export type { LeadStore } from "./shared";
export type { LeadStats } from "./shared";
