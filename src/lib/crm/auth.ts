import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "uniads_crm_session";
const SESSION_HOURS = 12;

function adminPassword() {
  return process.env.CRM_ADMIN_PASSWORD ?? "";
}

function sessionSecret() {
  return process.env.CRM_SESSION_SECRET ?? adminPassword() ?? "";
}

export function isCrmConfigured() {
  return adminPassword().length > 0;
}

function sign(value: string) {
  return createHmac("sha256", sessionSecret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function verifyPassword(candidate: string) {
  const expected = adminPassword();
  if (!expected) return false;
  return safeEqual(candidate, expected);
}

export function createSessionToken(user = "advisor") {
  const expiresAt = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = `${user}:${expiresAt}`;
  return `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
}

export function readSessionToken(token: string | undefined) {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const payload = Buffer.from(encoded, "base64url").toString("utf8");
  if (!safeEqual(signature, sign(payload))) return null;

  const [user, expiresAt] = payload.split(":");
  if (!expiresAt || Number(expiresAt) < Date.now()) return null;
  return { user };
}

export async function getSession() {
  const store = await cookies();
  return readSessionToken(store.get(COOKIE_NAME)?.value);
}

export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
