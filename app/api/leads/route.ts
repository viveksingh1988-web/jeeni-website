import { NextResponse } from "next/server";
import { getStore } from "@/lib/cms/store";
import { isAdminRequest } from "@/lib/cms/admin-check";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* GET /api/leads → list captured leads (token-gated, owner only). */
export async function GET(req: Request) {
  if (!await isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const leads = await getStore().listLeads();
  leads.sort((a, b) =>
    String(b.receivedAt ?? "").localeCompare(String(a.receivedAt ?? ""))
  );
  return NextResponse.json({ leads });
}
