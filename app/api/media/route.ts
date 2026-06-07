import { NextResponse } from "next/server";
import { getStore, contentTypeFor } from "@/lib/cms/store";
import { isAdminRequest } from "@/lib/cms/admin-check";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB (PDFs can be larger than images)
const ALLOWED = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
]);

const EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "application/pdf": "pdf",
};

/* GET /api/media → list all assets (token-gated; this is the DAM library). */
export async function GET(req: Request) {
  if (!await isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ assets: await getStore().listMedia() });
}

/* DELETE /api/media?key=... → remove an asset (token-gated). */
export async function DELETE(req: Request) {
  if (!await isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const key = new URL(req.url).searchParams.get("key");
  if (!key) return NextResponse.json({ error: "No key" }, { status: 400 });
  await getStore().deleteMedia(key);
  return NextResponse.json({ ok: true });
}

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/\.[a-z0-9]+$/, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "image"
  );
}

/* POST /api/media → upload an image (multipart form field "file"). Returns
 * { url } pointing at the GET media route. Token-gated. */
export async function POST(req: Request) {
  if (!await isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: `Unsupported type: ${file.type}` },
      { status: 415 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 413 });
  }

  const ext = EXT[file.type] ?? "bin";
  const key = `${Date.now()}-${slugify(file.name)}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  await getStore().putMedia(key, bytes, contentTypeFor(key));

  return NextResponse.json({ ok: true, url: `/api/media/${key}`, key });
}
