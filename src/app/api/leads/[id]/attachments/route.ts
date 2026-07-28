import { NextResponse } from "next/server";
import { getSession } from "@/lib/crm/auth";
import {
  ALLOWED_ATTACHMENT_EXTENSIONS,
  isAllowedAttachment,
  MAX_ATTACHMENT_BYTES,
} from "@/lib/crm/attachments";
import { getLeadStore } from "@/lib/crm/store";

type Params = { params: Promise<{ id: string }> };

function stripAttachmentData<T extends { attachments?: { data?: string }[] }>(
  lead: T
): T {
  if (!lead.attachments) return lead;
  return {
    ...lead,
    attachments: lead.attachments.map(({ data: _data, ...meta }) => meta),
  };
}

export async function POST(request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { id } = await params;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload payload." }, { status: 400 });
  }

  const label = String(form.get("label") ?? "").trim().slice(0, 120);
  const file = form.get("file");

  if (!label) {
    return NextResponse.json(
      { error: "Please name this file (e.g. Passport, CV)." },
      { status: 422 }
    );
  }
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Please choose a file to upload." }, { status: 422 });
  }
  if (file.size > MAX_ATTACHMENT_BYTES) {
    return NextResponse.json(
      { error: "File is too large. Maximum size is 3 MB." },
      { status: 413 }
    );
  }

  const fileName = file.name.slice(0, 200) || "upload";
  const mimeType = file.type || "application/octet-stream";
  if (!isAllowedAttachment(fileName, mimeType)) {
    return NextResponse.json(
      {
        error: `File type not allowed. Use: ${ALLOWED_ATTACHMENT_EXTENSIONS.join(", ")}`,
      },
      { status: 415 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const store = await getLeadStore();
  const lead = await store.addAttachment(
    id,
    {
      label,
      fileName,
      mimeType,
      size: buffer.length,
      data: buffer.toString("base64"),
    },
    session.user
  );

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, lead: stripAttachmentData(lead) });
}
