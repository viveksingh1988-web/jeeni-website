import { getStore } from "@/lib/cms/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* GET /api/media/<key> → stream an uploaded image (public). */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ key: string[] }> }
) {
  const { key } = await ctx.params;
  const media = await getStore().getMedia(key.join("/"));
  if (!media) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(media.bytes), {
    headers: {
      "Content-Type": media.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
