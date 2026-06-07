import { NextResponse } from "next/server";
import { getStore } from "@/lib/cms/store";

export const runtime = "nodejs";

/* Built-in lead endpoint. Receives contact-form submissions, persists them to
   the content store, and forwards them to your CRM. Configure via env:
     - LEAD_FORWARD_URL : a CRM/Zapier/Make/HubSpot webhook to forward leads to
     - LEAD_NOTIFY_EMAIL: (optional) wire to an email service of your choice
   With nothing configured it still persists the lead and returns 200. */
export async function POST(req: Request) {
  let lead: Record<string, unknown>;
  try {
    lead = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const payload = { ...lead, receivedAt: new Date().toISOString(), source: "jeeniai.com" };

  // Always persist the lead so submissions are never lost.
  try {
    await getStore().appendLead(payload);
  } catch (e) {
    console.error("[lead] persist failed", e);
  }

  const forwardUrl = process.env.LEAD_FORWARD_URL;
  if (forwardUrl) {
    try {
      await fetch(forwardUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      return NextResponse.json(
        { ok: false, error: "Forward failed: " + String(e) },
        { status: 502 }
      );
    }
  } else {
    console.log("[lead]", payload);
  }

  return NextResponse.json({ ok: true });
}
