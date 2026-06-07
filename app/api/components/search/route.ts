import { NextResponse } from "next/server";
import { inspireComponent } from "@/lib/21stdev/mcp-client";
import { transformComponent, parseComponentResponse, detectMissingDeps } from "@/lib/21stdev/transform";
import { isAdminRequest } from "@/lib/cms/admin-check";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!await isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json({ error: "Missing ?q= query" }, { status: 400 });
  }

  try {
    const raw = await inspireComponent(q);
    const { code: rawCode, name } = parseComponentResponse(raw);
    const code = transformComponent(rawCode);
    const missingDeps = detectMissingDeps(code);

    return NextResponse.json({ ok: true, name, code, missingDeps, raw });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
