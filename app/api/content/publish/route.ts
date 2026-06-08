import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getStore } from "@/lib/cms/store";
import { isAdminRequest } from "@/lib/cms/admin-check";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* POST /api/content/publish → promote draft to published, then revalidate the
 * whole site so the live render (including localhost) reflects it. */
export async function POST(req: Request) {
  if (!await isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const store = getStore();
  // Auto-save a version snapshot before publishing so history is preserved.
  const draft = await store.getDraft();
  await store.saveVersion(draft).catch(() => {}); // non-fatal
  const published = await store.publish();

  // Belt-and-suspenders for any cached routes (pages are also force-dynamic).
  revalidatePath("/", "layout");
  revalidatePath("/what-we-do/f/[slug]", "page");

  return NextResponse.json({ ok: true, content: published });
}
