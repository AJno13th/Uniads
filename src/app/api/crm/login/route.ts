import { NextResponse } from "next/server";
import {
  createSessionToken,
  isCrmConfigured,
  setSessionCookie,
  verifyPassword,
} from "@/lib/crm/auth";

const attempts = new Map<string, number[]>();
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: Request) {
  if (!isCrmConfigured()) {
    return NextResponse.json(
      { error: "CRM_ADMIN_PASSWORD is not configured on the server." },
      { status: 503 }
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);
  if (recent.length > MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    password?: string;
    name?: string;
  };

  if (!body.password || !verifyPassword(body.password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const user = body.name?.trim().slice(0, 40) || "advisor";
  await setSessionCookie(createSessionToken(user));
  return NextResponse.json({ ok: true });
}
