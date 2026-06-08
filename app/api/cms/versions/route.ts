import { NextResponse } from "next/server";
import { getStore } from "@/lib/cms/store";
import { isAdminRequest } from "@/lib/cms/admin-check";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* GET /api/cms/versions — list saved content versions */
export async function GET(req: Request) {
  if (!await isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const store = getStore();
  const versions = await store.listVersions();
  return NextResponse.json({ versions });
}

/* POST /api/cms/versions
 *   { action: "save" }               → save current draft as a version
 *   { action: "restore", id: string } → restore a version to draft
 */
export async function POST(req: Request) {
  if (!await isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const store = getStore();
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { action, id, label } = body as { action?: string; id?: string; label?: string };

  if (action === "save") {
    const draft = await store.getDraft();
    await store.saveVersion(draft, label);
    return NextResponse.json({ ok: true });
  }

  if (action === "restore" && id) {
    const doc = await store.getVersion(id);
    if (!doc) return NextResponse.json({ error: "Version not found" }, { status: 404 });
    await store.saveDraft(doc);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
