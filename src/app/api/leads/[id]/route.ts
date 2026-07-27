import { NextResponse } from "next/server";
import { getSession } from "@/lib/crm/auth";
import { getLeadStore } from "@/lib/crm/store";
import { leadStages, type LeadStage } from "@/lib/crm/types";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as {
    stage?: string;
    owner?: string | null;
    note?: string;
  };

  const store = await getLeadStore();
  let lead = null;

  if (body.note?.trim()) {
    lead = await store.addNote(id, body.note.trim().slice(0, 2000), session.user);
  }

  const stage =
    body.stage && leadStages.includes(body.stage as LeadStage)
      ? (body.stage as LeadStage)
      : undefined;
  const owner =
    body.owner === undefined
      ? undefined
      : body.owner === null || body.owner === ""
        ? null
        : body.owner.slice(0, 80);

  if (stage !== undefined || owner !== undefined) {
    lead = await store.update(id, { stage, owner }, session.user);
  }

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, lead });
}
