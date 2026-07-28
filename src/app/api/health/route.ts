import { NextResponse } from "next/server";
import { isDurableStorage, resolveDatabaseUrl } from "@/lib/crm/store";

export const dynamic = "force-dynamic";

/**
 * Lightweight uptime check for Vercel / monitoring.
 * Does not expose secrets — only connectivity shape.
 */
export async function GET() {
  const durable = isDurableStorage();
  let dbOk: boolean | null = null;
  let dbError: string | null = null;

  if (durable && resolveDatabaseUrl()) {
    try {
      const { getLeadStore } = await import("@/lib/crm/store");
      const store = await getLeadStore();
      await store.stats();
      dbOk = true;
    } catch (error) {
      dbOk = false;
      dbError = error instanceof Error ? error.message.slice(0, 160) : "db_error";
    }
  }

  const ok = !durable || dbOk === true;
  return NextResponse.json(
    {
      ok,
      service: "uniads",
      storage: durable ? "postgres" : "file",
      dbOk,
      dbError,
      time: new Date().toISOString(),
    },
    { status: ok ? 200 : 503 }
  );
}
