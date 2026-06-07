import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/cms/admin-check";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toKebab(name: string): string {
  return name
    .replace(/([A-Z])/g, (m, c, i) => (i > 0 ? "-" : "") + c.toLowerCase())
    .replace(/--+/g, "-");
}

export async function POST(req: Request) {
  if (!await isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { name?: string; code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, code } = body;
  if (!name || !code) {
    return NextResponse.json({ error: "name and code are required" }, { status: 400 });
  }

  const fileName = `${toKebab(name)}.tsx`;
  const dir = join(process.cwd(), "components", "custom");
  const filePath = join(dir, fileName);

  try {
    await mkdir(dir, { recursive: true });
    await writeFile(filePath, code, "utf8");
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to write file: " + String(e) },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    path: `components/custom/${fileName}`,
    importPath: `@/components/custom/${toKebab(name)}`,
  });
}
