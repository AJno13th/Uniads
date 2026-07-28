import { jsonLeadStore } from "./json-store";
import type { LeadStore } from "./shared";

/**
 * Postgres is used whenever DATABASE_URL is configured (hosted deployments);
 * otherwise leads persist to a local JSON file so the CRM works out of the box.
 *
 * On Vercel without DATABASE_URL, the JSON fallback writes under /tmp which is
 * NOT shared across serverless instances and is wiped on cold starts — so the
 * admin CRM will look empty even when bookings "succeed" for the visitor.
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

/** True when leads survive redeploys / multiple serverless instances. */
export function isDurableStorage(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export type { LeadStore } from "./shared";
export type { LeadStats } from "./shared";
