import { NextResponse } from "next/server";
import { getLeadStore } from "@/lib/crm/store";
import { getSession } from "@/lib/crm/auth";
import type { LeadFilters, LeadSource, LeadStage, NewLeadInput } from "@/lib/crm/types";
import { leadStages } from "@/lib/crm/types";
import { buildPresetMessage } from "@/lib/crm/message";
import { whatsappLink } from "@/data/site";

const MAX_FIELD = 500;
const RATE_LIMIT = 6;
const RATE_WINDOW_MS = 10 * 60 * 1000;

const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > RATE_LIMIT;
}

function clean(value: unknown, max = MAX_FIELD): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().slice(0, max);
  return trimmed.length ? trimmed : null;
}

function cleanList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => clean(v, 160))
    .filter((v): v is string => Boolean(v))
    .slice(0, 20);
}

const validSources: LeadSource[] = ["apply", "booking", "quick_qualifier", "landing"];

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Hidden field that only automated submissions tend to fill in.
  if (clean(payload.company)) {
    return NextResponse.json({ ok: true, reference: null });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  const fullName = clean(payload.fullName, 120);
  const email = clean(payload.email, 160);
  const phone = clean(payload.phone, 40);

  if (!fullName || !phone) {
    return NextResponse.json(
      { error: "Please provide your name and phone number." },
      { status: 422 }
    );
  }
  // Prefer E.164 (+447…) from the country-code picker; reject tiny stubs.
  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    return NextResponse.json(
      { error: "Please enter a valid phone number with country code." },
      { status: 422 }
    );
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email." }, { status: 422 });
  }

  const rawSource = clean(payload.source, 30) as LeadSource | null;
  const source: LeadSource =
    rawSource && validSources.includes(rawSource) ? rawSource : "apply";

  const input: NewLeadInput = {
    source,
    fullName,
    email: email ?? "",
    phone,
    settlementStatus: clean(payload.settlementStatus, 120),
    ukResidency: clean(payload.ukResidency, 60),
    ageBracket: clean(payload.ageBracket, 30),
    highestQualification: clean(payload.highestQualification, 120),
    previousStudentFinance: clean(payload.previousStudentFinance, 120),
    university: clean(payload.university, 160),
    course: clean(payload.course, 200),
    courseLevel: clean(payload.courseLevel, 80),
    studyMode: clean(payload.studyMode, 40),
    classPreference: clean(payload.classPreference, 80),
    preferredCity: clean(payload.preferredCity, 60),
    intake: clean(payload.intake, 60),
    services: cleanList(payload.services),
    notes:
      clean(payload.notes, 2000) ??
      (payload.partial === true
        ? "Partial application — waiting for more details"
        : null),
    callDate: clean(payload.callDate, 20),
    callTime: clean(payload.callTime, 10),
    utmSource: clean(payload.utmSource, 80),
    utmMedium: clean(payload.utmMedium, 80),
    utmCampaign: clean(payload.utmCampaign, 120),
    utmContent: clean(payload.utmContent, 120),
    utmTerm: clean(payload.utmTerm, 120),
    fbclid: clean(payload.fbclid, 200),
    ttclid: clean(payload.ttclid, 200),
    gclid: clean(payload.gclid, 200),
    landingPage: clean(payload.landingPage, 300),
    referrer: clean(payload.referrer, 300),
  };

  // Persist to CRM when possible. If storage fails (common on serverless
  // without DATABASE_URL), still return a WhatsApp handoff so booking works,
  // and notify advisors by email so the lead is not lost.
  let lead;
  let persisted = false;
  try {
    const store = await getLeadStore();
    lead = await store.create(input);
    persisted = true;
  } catch (error) {
    console.error("[api/leads] store.create failed", error);
    const { hydrateNewLead } = await import("@/lib/crm/shared");
    lead = hydrateNewLead(input);
  }

  // On Vercel file-mode, "persisted" only means written to ephemeral /tmp —
  // treat non-Postgres hosts as not durably saved for advisor notifications.
  const { isDurableStorage } = await import("@/lib/crm/store");
  const durablySaved = persisted && isDurableStorage();

  try {
    const { notifyLeadCaptured } = await import("@/lib/crm/notify");
    await notifyLeadCaptured(lead, input, {
      persisted: durablySaved,
      partial: payload.partial === true,
    });
  } catch (error) {
    console.error("[api/leads] notify failed", error);
  }

  return NextResponse.json({
    ok: true,
    reference: lead.reference,
    scoreBand: lead.scoreBand,
    persisted: durablySaved,
    leadId: lead.id,
    continueToken: lead.continueToken,
    whatsappUrl: whatsappLink(buildPresetMessage(lead.reference, input)),
  });
}

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const url = new URL(request.url);
  const stageParam = url.searchParams.get("stage");
  const filters: LeadFilters = {
    search: url.searchParams.get("search") ?? undefined,
    stage:
      stageParam && leadStages.includes(stageParam as LeadStage)
        ? (stageParam as LeadStage)
        : "all",
    settlementStatus: url.searchParams.get("settlementStatus") ?? undefined,
    university: url.searchParams.get("university") ?? undefined,
    studyMode: url.searchParams.get("studyMode") ?? undefined,
  };

  const store = await getLeadStore();
  const leads = await store.list(filters);
  return NextResponse.json({ leads });
}
