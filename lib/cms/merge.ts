/* Merge code-side seeds (defaults) with stored overrides into the effective
 * content the UI renders. */

import type {
  ContentDoc,
  Collection,
  SeedCollection,
  SeedItem,
  ResolvedItem,
} from "./types";

/** Resolve a scalar: stored override wins, else the code default. */
export function resolveScalar(
  doc: ContentDoc | undefined,
  id: string,
  codeDefault: string
): string {
  const v = doc?.scalars?.[id];
  return v !== undefined ? v : codeDefault;
}

function resolveItem(
  seed: SeedItem | undefined,
  stored: Collection["items"][string] | undefined
): ResolvedItem {
  const _id = (seed?._id ?? stored?._id) as string;
  const fields = { ...(seed?.fields ?? {}), ...(stored?.fields ?? {}) };

  // Resolve nested children collections (union of seed + stored child keys).
  let children: ResolvedItem["children"];
  const childKeys = new Set<string>([
    ...Object.keys(seed?.children ?? {}),
    ...Object.keys(stored?.children ?? {}),
  ]);
  if (childKeys.size) {
    children = {};
    for (const key of childKeys) {
      const seedChild = seed?.children?.[key];
      const storedChild = stored?.children?.[key];
      children[key] = resolveCollectionParts(
        seedChild ? { id: key, items: seedChild.items } : undefined,
        storedChild
      );
    }
  }

  return { _id, seed: !!seed, fields, ...(children ? { children } : {}) };
}

/** Core resolver shared by top-level and nested collections. */
function resolveCollectionParts(
  seed: SeedCollection | undefined,
  stored: Collection | undefined
): ResolvedItem[] {
  const seedItems = new Map<string, SeedItem>(
    (seed?.items ?? []).map((it) => [it._id, it])
  );

  // Nothing stored at all → pure seed (code edits to defaults flow through).
  if (!stored) {
    return (seed?.items ?? []).map((it) => resolveItem(it, undefined));
  }

  const removed = new Set(stored.removedSeeds ?? []);
  // Stored order is authoritative when present; otherwise default to seed order.
  // Either way, stored per-item field overrides still apply.
  const order =
    stored.order && stored.order.length
      ? stored.order
      : (seed?.items ?? []).map((it) => it._id);

  const out: ResolvedItem[] = [];
  const placed = new Set<string>();

  for (const id of order) {
    if (removed.has(id) || placed.has(id)) continue;
    const seedItem = seedItems.get(id);
    const storedItem = stored.items?.[id];
    if (!seedItem && !storedItem) continue; // dangling id
    out.push(resolveItem(seedItem, storedItem));
    placed.add(id);
  }

  // Append any new code seeds the owner hasn't seen yet (added after they
  // customized this collection), unless they explicitly removed them.
  for (const it of seed?.items ?? []) {
    if (placed.has(it._id) || removed.has(it._id)) continue;
    out.push(resolveItem(it, stored.items?.[it._id]));
    placed.add(it._id);
  }

  // Recover stored items that were never added to `order` (e.g. "page:home"
  // entries in site.extras written via a child locator before the ensureColl
  // order-fix). Without this they silently disappear from resolved output.
  for (const id of Object.keys(stored.items ?? {})) {
    if (placed.has(id) || removed.has(id)) continue;
    out.push(resolveItem(seedItems.get(id), stored.items![id]));
    placed.add(id);
  }

  return out;
}

/** Resolve a top-level collection (e.g. "services.cards") to its effective items. */
export function resolveCollection(
  doc: ContentDoc | undefined,
  seed: SeedCollection
): ResolvedItem[] {
  return resolveCollectionParts(seed, doc?.collections?.[seed.id]);
}

/* ---- v1 → v2 migration ----
 * The original CMS stored a flat Record<string,string> in content/site.json
 * with keys like "hero.eyebrow", "cta.subline", "settings.crmWebhookUrl".
 */
export function migrateLegacy(raw: unknown): ContentDoc {
  const doc: ContentDoc = {
    version: 2,
    scalars: {},
    collections: {},
    hidden: {},
    settings: { crmWebhookUrl: "", crmProvider: "webhook" },
    updatedAt: "",
  };
  if (!raw || typeof raw !== "object") return doc;
  const r = raw as Record<string, unknown>;

  // Already v2.
  if (r.version === 2 && r.scalars) {
    const d = raw as ContentDoc;
    if (!d.hidden) d.hidden = {};
    return d;
  }

  for (const [k, v] of Object.entries(r)) {
    if (typeof v !== "string") continue;
    if (k === "settings.crmWebhookUrl") doc.settings.crmWebhookUrl = v;
    else if (k === "settings.crmProvider") doc.settings.crmProvider = v;
    else doc.scalars[k] = v;
  }
  return doc;
}
