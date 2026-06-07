import { NextResponse } from "next/server";
import { getStore } from "@/lib/cms/store";
import { migrateLegacy } from "@/lib/cms/merge";
import { isAdminRequest } from "@/lib/cms/admin-check";
import type { ContentDoc } from "@/lib/cms/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* GET /api/content            → published content (public)
 * GET /api/content?draft=1    → draft content (token-gated; drafts are unreviewed) */
export async function GET(req: Request) {
  const wantsDraft = new URL(req.url).searchParams.get("draft") === "1";
  const store = getStore();
  if (wantsDraft) {
    if (!await isAdminRequest(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(await store.getDraft());
  }
  return NextResponse.json(await store.getPublished());
}

/* PUT /api/content → save the draft (token-gated). */
export async function PUT(req: Request) {
  if (!await isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const doc: ContentDoc = migrateLegacy(body);
  await getStore().saveDraft(doc);
  return NextResponse.json({ ok: true, content: doc });
}
