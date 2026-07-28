import { NextResponse } from "next/server";
import { getSession } from "@/lib/crm/auth";
import { getLeadStore } from "@/lib/crm/store";

type Params = { params: Promise<{ id: string; attachmentId: string }> };

export async function GET(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { id, attachmentId } = await params;
  const store = await getLeadStore();
  const lead = await store.get(id);
  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const attachment = lead.attachments.find((a) => a.id === attachmentId);
  if (!attachment) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const bytes = Buffer.from(attachment.data, "base64");
  return new NextResponse(new Uint8Array(bytes), {
    status: 200,
    headers: {
      "Content-Type": attachment.mimeType || "application/octet-stream",
      "Content-Length": String(bytes.length),
      "Content-Disposition": `attachment; filename="${attachment.fileName.replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store",
    },
  });
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { id, attachmentId } = await params;
  const store = await getLeadStore();
  const lead = await store.removeAttachment(id, attachmentId, session.user);

  if (!lead) {
    return NextResponse.json({ error: "Lead or file not found" }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    lead: {
      ...lead,
      attachments: lead.attachments.map(({ data: _data, ...meta }) => meta),
    },
  });
}
