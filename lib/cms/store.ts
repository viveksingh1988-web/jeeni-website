/* Storage adapter.
 *
 * - On Netlify (process.env.NETLIFY set) → Netlify Blobs (managed datastore).
 * - Locally (`next dev` / `next start`) → filesystem under .cms-data/ so that
 *   Publish is reflected on localhost immediately.
 *
 * Two logical documents are stored: `published` (what the public site renders)
 * and `draft` (the owner's in-progress edits). Media (uploaded images) and
 * leads are stored alongside.
 */

import { EMPTY_DOC, type ContentDoc } from "./types";
import { migrateLegacy } from "./merge";

export type Media = { bytes: Buffer; contentType: string };

export type ContentVersion = {
  id: string;
  savedAt: string;
  label?: string;
};

export type MediaInfo = {
  key: string;
  url: string;
  contentType: string;
  kind: "image" | "pdf" | "other";
  uploadedAt: number;
  size?: number;
};

export interface ContentStore {
  getPublished(): Promise<ContentDoc>;
  getDraft(): Promise<ContentDoc>;
  saveDraft(doc: ContentDoc): Promise<void>;
  /** Promote draft → published, stamp updatedAt, return the published doc. */
  publish(): Promise<ContentDoc>;
  putMedia(key: string, bytes: Buffer, contentType: string): Promise<void>;
  getMedia(key: string): Promise<Media | null>;
  listMedia(): Promise<MediaInfo[]>;
  deleteMedia(key: string): Promise<void>;
  appendLead(lead: Record<string, unknown>): Promise<void>;
  listLeads(): Promise<Record<string, unknown>[]>;
  storeOtp(phone: string, otp: string): Promise<void>;
  verifyAndConsumeOtp(phone: string, otp: string): Promise<boolean>;
  listVersions(): Promise<ContentVersion[]>;
  getVersion(id: string): Promise<ContentDoc | null>;
  saveVersion(doc: ContentDoc, label?: string): Promise<void>;
}

export function mediaKind(contentType: string): MediaInfo["kind"] {
  if (contentType.startsWith("image/")) return "image";
  if (contentType === "application/pdf") return "pdf";
  return "other";
}

/** Keys are named `<timestamp>-<slug>.<ext>`; recover the upload time. */
function tsFromKey(key: string): number {
  const m = /(^|\/)(\d{10,})-/.exec(key);
  return m ? Number(m[2]) : 0;
}

const CONTENT_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
  svg: "image/svg+xml",
  pdf: "application/pdf",
};

export function contentTypeFor(key: string): string {
  const ext = key.split(".").pop()?.toLowerCase() ?? "";
  return CONTENT_TYPES[ext] ?? "application/octet-stream";
}

function withStamp(doc: ContentDoc): ContentDoc {
  return { ...doc, version: 2, updatedAt: new Date().toISOString() };
}

/* -------------------------------------------------------------------------- */
/* Netlify Blobs adapter                                                       */
/* -------------------------------------------------------------------------- */

function netlifyStore(): ContentStore {
  // Imported lazily so local dev works without the package installed.
  async function store(name: string) {
    const { getStore } = await import("@netlify/blobs");
    return getStore(name);
  }

  async function readDoc(key: "published" | "draft"): Promise<ContentDoc> {
    const s = await store("cms");
    const raw = await s.get(key, { type: "json" });
    return raw ? migrateLegacy(raw) : EMPTY_DOC;
  }

  return {
    async getPublished() {
      return readDoc("published");
    },
    async getDraft() {
      const draft = await readDoc("draft");
      // First-ever edit: seed the draft from published so the owner starts from live.
      if (!draft.updatedAt) return readDoc("published");
      return draft;
    },
    async saveDraft(doc) {
      const s = await store("cms");
      await s.setJSON("draft", withStamp(doc));
    },
    async publish() {
      const s = await store("cms");
      const draft = await readDoc("draft");
      const published = withStamp(draft);
      await s.setJSON("published", published);
      return published;
    },
    async putMedia(key, bytes, contentType) {
      const s = await store("cms-media");
      const ab = bytes.buffer.slice(
        bytes.byteOffset,
        bytes.byteOffset + bytes.byteLength
      ) as ArrayBuffer;
      await s.set(key, ab, { metadata: { contentType } });
    },
    async getMedia(key) {
      const s = await store("cms-media");
      const res = await s.getWithMetadata(key, { type: "arrayBuffer" });
      if (!res) return null;
      const contentType =
        (res.metadata?.contentType as string) || contentTypeFor(key);
      return { bytes: Buffer.from(res.data as ArrayBuffer), contentType };
    },
    async listMedia() {
      const s = await store("cms-media");
      const { blobs } = await s.list();
      return blobs
        .map((b: { key: string }) => {
          const contentType = contentTypeFor(b.key);
          return {
            key: b.key,
            url: `/api/media/${b.key}`,
            contentType,
            kind: mediaKind(contentType),
            uploadedAt: tsFromKey(b.key),
          } as MediaInfo;
        })
        .sort((a, b) => b.uploadedAt - a.uploadedAt);
    },
    async deleteMedia(key) {
      const s = await store("cms-media");
      await s.delete(key);
    },
    async appendLead(lead) {
      const s = await store("leads");
      const key = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      await s.setJSON(key, { ...lead, _id: key });
    },
    async listLeads() {
      const s = await store("leads");
      const { blobs } = await s.list();
      const out = await Promise.all(
        blobs.map((b: { key: string }) => s.get(b.key, { type: "json" }))
      );
      return out.filter(Boolean) as Record<string, unknown>[];
    },
    async storeOtp(phone, otp) {
      const s = await store("otps");
      const key = Buffer.from(phone).toString("base64url");
      await s.setJSON(key, { otp, expires: Date.now() + 5 * 60 * 1000 });
    },
    async verifyAndConsumeOtp(phone, otp) {
      const s = await store("otps");
      const key = Buffer.from(phone).toString("base64url");
      const data = await s.get(key, { type: "json" }).catch(() => null);
      if (!data || data.expires < Date.now() || data.otp !== otp) return false;
      await s.delete(key).catch(() => {});
      return true;
    },
    async listVersions() {
      const s = await store("cms-versions");
      const { blobs } = await s.list().catch(() => ({ blobs: [] }));
      const metas = await Promise.all(
        blobs.map(async (b: { key: string }) => {
          const meta = await s.getWithMetadata(b.key, { type: "json" }).catch(() => null);
          return meta ? { id: b.key, savedAt: (meta.metadata?.savedAt as string) || b.key, label: meta.metadata?.label as string | undefined } : null;
        })
      );
      return (metas.filter(Boolean) as ContentVersion[]).sort((a, b) => b.savedAt.localeCompare(a.savedAt));
    },
    async getVersion(id) {
      const s = await store("cms-versions");
      const raw = await s.get(id, { type: "json" }).catch(() => null);
      return raw ? migrateLegacy(raw) : null;
    },
    async saveVersion(doc, label) {
      const s = await store("cms-versions");
      const id = new Date().toISOString().replace(/[:.]/g, "-");
      await s.setJSON(id, doc, { metadata: { savedAt: new Date().toISOString(), label: label || "" } });
      // Prune: keep last 20
      const { blobs } = await s.list().catch(() => ({ blobs: [] }));
      if (blobs.length > 20) {
        const sorted = blobs.map((b: { key: string }) => b.key).sort();
        for (const old of sorted.slice(0, blobs.length - 20)) {
          await s.delete(old).catch(() => {});
        }
      }
    },
  };
}

/* -------------------------------------------------------------------------- */
/* Local filesystem adapter                                                    */
/* -------------------------------------------------------------------------- */

function localStore(): ContentStore {
  // Node APIs imported lazily to keep this module import-safe in any runtime.
  const dirP = import("node:path").then((p) =>
    p.join(process.cwd(), ".cms-data")
  );

  async function paths() {
    const path = await import("node:path");
    const dir = await dirP;
    return {
      path,
      dir,
      published: path.join(dir, "published.json"),
      draft: path.join(dir, "draft.json"),
      media: path.join(dir, "media"),
      leads: path.join(dir, "leads"),
    };
  }

  async function ensure(dir: string) {
    const { mkdir } = await import("node:fs/promises");
    await mkdir(dir, { recursive: true });
  }

  async function readJson(file: string): Promise<unknown | null> {
    try {
      const { readFile } = await import("node:fs/promises");
      return JSON.parse(await readFile(file, "utf8"));
    } catch {
      return null;
    }
  }

  async function writeJson(file: string, data: unknown) {
    const { writeFile } = await import("node:fs/promises");
    const path = await import("node:path");
    await ensure(path.dirname(file));
    await writeFile(file, JSON.stringify(data, null, 2) + "\n", "utf8");
  }

  return {
    async getPublished() {
      const p = await paths();
      const raw = await readJson(p.published);
      if (raw) return migrateLegacy(raw);
      // First run: carry over the original content/site.json if present.
      const legacy = await readJson(p.path.join(process.cwd(), "content", "site.json"));
      return legacy ? migrateLegacy(legacy) : EMPTY_DOC;
    },
    async getDraft() {
      const p = await paths();
      const raw = await readJson(p.draft);
      if (raw) return migrateLegacy(raw);
      // No draft yet → start from published.
      const pub = await readJson(p.published);
      return pub ? migrateLegacy(pub) : EMPTY_DOC;
    },
    async saveDraft(doc) {
      const p = await paths();
      await writeJson(p.draft, withStamp(doc));
    },
    async publish() {
      const p = await paths();
      const raw = await readJson(p.draft);
      const draft = raw ? migrateLegacy(raw) : EMPTY_DOC;
      const published = withStamp(draft);
      await writeJson(p.published, published);
      return published;
    },
    async putMedia(key, bytes, _contentType) {
      const p = await paths();
      const { writeFile } = await import("node:fs/promises");
      await ensure(p.media);
      await writeFile(p.path.join(p.media, key), bytes);
    },
    async getMedia(key) {
      const p = await paths();
      try {
        const { readFile } = await import("node:fs/promises");
        const bytes = await readFile(p.path.join(p.media, key));
        return { bytes, contentType: contentTypeFor(key) };
      } catch {
        return null;
      }
    },
    async listMedia() {
      const p = await paths();
      try {
        const { readdir, stat } = await import("node:fs/promises");
        const files = await readdir(p.media);
        const infos = await Promise.all(
          files.map(async (f) => {
            const contentType = contentTypeFor(f);
            let size: number | undefined;
            let uploadedAt = tsFromKey(f);
            try {
              const st = await stat(p.path.join(p.media, f));
              size = st.size;
              if (!uploadedAt) uploadedAt = st.mtimeMs;
            } catch {}
            return {
              key: f,
              url: `/api/media/${f}`,
              contentType,
              kind: mediaKind(contentType),
              uploadedAt,
              size,
            } as MediaInfo;
          })
        );
        return infos.sort((a, b) => b.uploadedAt - a.uploadedAt);
      } catch {
        return [];
      }
    },
    async deleteMedia(key) {
      const p = await paths();
      try {
        const { unlink } = await import("node:fs/promises");
        await unlink(p.path.join(p.media, key));
      } catch {}
    },
    async appendLead(lead) {
      const p = await paths();
      const key = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      await writeJson(p.path.join(p.leads, `${key}.json`), { ...lead, _id: key });
    },
    async storeOtp(phone, otp) {
      const p = await paths();
      const dir = p.path.join(p.dir, "otps");
      await ensure(dir);
      const key = Buffer.from(phone).toString("base64url");
      await writeJson(p.path.join(dir, `${key}.json`), { otp, expires: Date.now() + 5 * 60 * 1000 });
    },
    async verifyAndConsumeOtp(phone, otp) {
      const p = await paths();
      const key = Buffer.from(phone).toString("base64url");
      const file = p.path.join(p.dir, "otps", `${key}.json`);
      const data = await readJson(file);
      if (!data || (data as { expires: number; otp: string }).expires < Date.now() || (data as { otp: string }).otp !== otp) return false;
      try { const { unlink } = await import("node:fs/promises"); await unlink(file); } catch {}
      return true;
    },
    async listLeads() {
      const p = await paths();
      try {
        const { readdir } = await import("node:fs/promises");
        const files = await readdir(p.leads);
        const out = await Promise.all(
          files
            .filter((f) => f.endsWith(".json"))
            .map((f) => readJson(p.path.join(p.leads, f)))
        );
        return out.filter(Boolean) as Record<string, unknown>[];
      } catch {
        return [];
      }
    },
    async listVersions() {
      const p = await paths();
      try {
        const { readdir } = await import("node:fs/promises");
        const dir = p.path.join(p.dir, "versions");
        const files = await readdir(dir).catch(() => [] as string[]);
        const metas = await Promise.all(
          files
            .filter((f) => f.endsWith(".json"))
            .map(async (f) => {
              const raw = await readJson(p.path.join(dir, f)) as { _meta?: { savedAt: string; label?: string } } | null;
              const id = f.replace(".json", "");
              return raw ? { id, savedAt: raw._meta?.savedAt || id, label: raw._meta?.label } : null;
            })
        );
        return (metas.filter(Boolean) as ContentVersion[]).sort((a, b) => b.savedAt.localeCompare(a.savedAt));
      } catch {
        return [];
      }
    },
    async getVersion(id) {
      const p = await paths();
      const dir = p.path.join(p.dir, "versions");
      const raw = await readJson(p.path.join(dir, `${id}.json`)) as Record<string, unknown> | null;
      if (!raw) return null;
      const { _meta: _, ...doc } = raw;
      return migrateLegacy(doc);
    },
    async saveVersion(doc, label) {
      const p = await paths();
      const dir = p.path.join(p.dir, "versions");
      await ensure(dir);
      const id = new Date().toISOString().replace(/[:.]/g, "-");
      await writeJson(p.path.join(dir, `${id}.json`), { ...doc, _meta: { savedAt: new Date().toISOString(), label: label || "" } });
      // Prune: keep last 20
      const { readdir, unlink } = await import("node:fs/promises");
      const files = (await readdir(dir).catch(() => [] as string[])).filter((f) => f.endsWith(".json")).sort();
      for (const old of files.slice(0, Math.max(0, files.length - 20))) {
        await unlink(p.path.join(dir, old)).catch(() => {});
      }
    },
  };
}

let cached: ContentStore | null = null;
export function getStore(): ContentStore {
  if (cached) return cached;
  cached = process.env.NETLIFY ? netlifyStore() : localStore();
  return cached;
}
