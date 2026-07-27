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
    notes: clean(payload.notes, 2000),
    callDate: clean(payload.callDate, 20),
    callTime: clean(payload.callTime, 10),
  };

  const store = await getLeadStore();
  const lead = await store.create(input);

  return NextResponse.json({
    ok: true,
    reference: lead.reference,
    scoreBand: lead.scoreBand,
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
