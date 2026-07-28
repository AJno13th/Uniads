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

  let url = raw
    // node-pg does not support channel_binding
    .replace(/([?&])channel_binding=require&?/gi, "$1")
    .replace(/[?&]$/, "")
    .replace(/\?&/, "?");

  // pg@8.22+ warns/breaks on bare sslmode=require unless libpq-compat is set.
  if (/sslmode=require/i.test(url) && !/uselibpqcompat=/i.test(url)) {
    url += url.includes("?") ? "&uselibpqcompat=true" : "?uselibpqcompat=true";
  }

  // Repair truncated sslmode values from some Neon template pastes
  url = url.replace(/sslmode=requir(?!e)/i, "sslmode=require");

  return url;
}
