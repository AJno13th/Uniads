import { jsonLeadStore } from "./json-store";
import type { LeadStore } from "./shared";
import { resolveDatabaseUrl } from "./db-url";

export { resolveDatabaseUrl } from "./db-url";

/**
 * Postgres is used whenever a database URL is configured (hosted deployments);
 * otherwise leads persist to a local JSON file so the CRM works out of the box.
 *
 * On Vercel without a Postgres URL, the JSON fallback writes under /tmp which is
 * NOT shared across serverless instances and is wiped on cold starts — so the
 * admin CRM will look empty even when bookings "succeed" for the visitor.
 */
export async function getLeadStore(): Promise<LeadStore> {
  if (resolveDatabaseUrl()) {
    const { pgLeadStore } = await import("./pg-store");
    return pgLeadStore;
  }
  return jsonLeadStore;
}

export function storeMode(): "postgres" | "file" {
  return resolveDatabaseUrl() ? "postgres" : "file";
}

/** True when leads survive redeploys / multiple serverless instances. */
export function isDurableStorage(): boolean {
  return Boolean(resolveDatabaseUrl());
}

export type { LeadStore } from "./shared";
export type { LeadStats } from "./shared";
