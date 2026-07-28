/**
 * Resolve a Postgres URL from common Vercel / Neon env names.
 * Neon’s Vercel integration often sets POSTGRES_URL but not DATABASE_URL.
 */
export function resolveDatabaseUrl(): string | undefined {
  const raw =
    process.env.DATABASE_URL?.trim() ||
    process.env.POSTGRES_URL?.trim() ||
    process.env.POSTGRES_PRISMA_URL?.trim() ||
    process.env.POSTGRES_URL_NON_POOLING?.trim() ||
    process.env.DATABASE_URL_UNPOOLED?.trim();

  if (!raw) return undefined;

  // node-pg does not support channel_binding; strip it to avoid connection errors.
  return raw
    .replace(/([?&])channel_binding=require&?/g, "$1")
    .replace(/[?&]$/, "")
    .replace(/\?&/, "?");
}
