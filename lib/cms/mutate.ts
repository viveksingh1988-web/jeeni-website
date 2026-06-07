/* Pure, immutable mutations on a ContentDoc, used by the editor.
 *
 * A "locator" addresses either a top-level collection ("services.cards") or a
 * nested child collection inside an item (a blog post's "blocks"). Structural
 * ops materialize an explicit `order` from the currently-resolved ids so that
 * add/remove/reorder are unambiguous regardless of whether the owner had
 * touched the collection before. */

import type { ContentDoc, Collection, CollectionItem } from "./types";

export type Locator =
  | { kind: "top"; id: string }
  | { kind: "child"; parentId: string; itemId: string; childKey: string };

function clone(doc: ContentDoc): ContentDoc {
  return structuredClone(doc);
}

export function newId(): string {
  return "c_" + Math.random().toString(36).slice(2, 10);
}

/** Get the stored Collection for a locator, or undefined. */
function getColl(doc: ContentDoc, loc: Locator): Collection | undefined {
  if (loc.kind === "top") return doc.collections[loc.id];
  const item = doc.collections[loc.parentId]?.items?.[loc.itemId];
  return item?.children?.[loc.childKey];
}

/** Get-or-create the Collection for a locator, materializing `order` from
 *  `currentIds` when it's empty. Mutates `doc` in place (already cloned). */
function ensureColl(
  doc: ContentDoc,
  loc: Locator,
  currentIds: string[]
): Collection {
  let coll: Collection;
  if (loc.kind === "top") {
    coll = doc.collections[loc.id] ?? { order: [], items: {} };
    doc.collections[loc.id] = coll;
  } else {
    const parent = (doc.collections[loc.parentId] ??= { order: [], items: {} });
    const isNew = !parent.items[loc.itemId];
    const item = (parent.items[loc.itemId] ??= { _id: loc.itemId, fields: {} });
    // Ensure the item appears in the parent's order so resolveCollection can
    // find it. Without this, site.extras items (e.g. "page:home") would live
    // in .items but never in .order, so they'd never resolve.
    if (isNew && !parent.order.includes(loc.itemId)) {
      parent.order.push(loc.itemId);
    }
    item.children ??= {};
    coll = item.children[loc.childKey] ?? { order: [], items: {} };
    item.children[loc.childKey] = coll;
  }
  coll.items ??= {};
  coll.removedSeeds ??= [];
  if (!coll.order || coll.order.length === 0) coll.order = [...currentIds];
  return coll;
}

export function setScalar(doc: ContentDoc, id: string, val: string): ContentDoc {
  const d = clone(doc);
  d.scalars[id] = val;
  return d;
}

export function setSetting(
  doc: ContentDoc,
  key: keyof ContentDoc["settings"],
  val: string
): ContentDoc {
  const d = clone(doc);
  d.settings = { ...d.settings, [key]: val };
  return d;
}

export function setHidden(
  doc: ContentDoc,
  id: string,
  hidden: boolean
): ContentDoc {
  const d = clone(doc);
  d.hidden = { ...(d.hidden ?? {}) };
  if (hidden) d.hidden[id] = true;
  else delete d.hidden[id];
  return d;
}

/** Override a single field on an item. Does not force an order materialization
 *  (keeps the doc minimal for pure copy edits). */
export function setItemField(
  doc: ContentDoc,
  loc: Locator,
  itemId: string,
  field: string,
  val: string
): ContentDoc {
  const d = clone(doc);
  let coll: Collection;
  if (loc.kind === "top") {
    coll = d.collections[loc.id] ?? { order: [], items: {} };
    d.collections[loc.id] = coll;
  } else {
    const parent = (d.collections[loc.parentId] ??= { order: [], items: {} });
    const item = (parent.items[loc.itemId] ??= { _id: loc.itemId, fields: {} });
    item.children ??= {};
    coll = item.children[loc.childKey] ?? { order: [], items: {} };
    item.children[loc.childKey] = coll;
  }
  coll.items ??= {};
  const it: CollectionItem = coll.items[itemId] ?? { _id: itemId, fields: {} };
  it.fields = { ...it.fields, [field]: val };
  coll.items[itemId] = it;
  return d;
}

export function addItem(
  doc: ContentDoc,
  loc: Locator,
  currentIds: string[],
  fields: Record<string, string> = {},
  atIndex?: number,
  _id?: string
): { doc: ContentDoc; id: string } {
  const d = clone(doc);
  const coll = ensureColl(d, loc, currentIds);
  const id = _id ?? newId();
  coll.items[id] = { _id: id, fields };
  if (atIndex === undefined || atIndex >= coll.order.length) coll.order.push(id);
  else coll.order.splice(Math.max(0, atIndex), 0, id);
  return { doc: d, id };
}

export function removeItem(
  doc: ContentDoc,
  loc: Locator,
  currentIds: string[],
  itemId: string,
  isSeed: boolean
): ContentDoc {
  const d = clone(doc);
  const coll = ensureColl(d, loc, currentIds);
  coll.order = coll.order.filter((x) => x !== itemId);
  delete coll.items[itemId];
  if (isSeed) {
    coll.removedSeeds ??= [];
    if (!coll.removedSeeds.includes(itemId)) coll.removedSeeds.push(itemId);
  }
  return d;
}

/** Create a blog post (a top-level "blog.posts" item) with starter body blocks. */
export function addPost(
  doc: ContentDoc,
  currentIds: string[],
  postFields: Record<string, string>,
  blocks: { type: string; text: string }[]
): { doc: ContentDoc; id: string } {
  const d = clone(doc);
  const coll = ensureColl(d, { kind: "top", id: "blog.posts" }, currentIds);
  const id = newId();
  const blockColl: Collection = { order: [], items: {} };
  blocks.forEach((b, i) => {
    const bid = `b${i}`;
    blockColl.order.push(bid);
    blockColl.items[bid] = { _id: bid, fields: { type: b.type, text: b.text } };
  });
  coll.items[id] = { _id: id, fields: postFields, children: { blocks: blockColl } };
  coll.order.push(id);
  return { doc: d, id };
}

/** Create a custom page (a "site.pages" item) with a starter heading block.
 *  `parent` is the full path of a parent page ("" = root). The page's full path
 *  becomes `<parent>/<leaf>` so pages can be nested under root or any page. */
export function addPage(
  doc: ContentDoc,
  currentIds: string[],
  title: string,
  leaf: string,
  parent = ""
): { doc: ContentDoc; id: string } {
  const d = clone(doc);
  const coll = ensureColl(d, { kind: "top", id: "site.pages" }, currentIds);
  const basePath = parent ? `${parent}/${leaf}` : leaf;
  // Ensure a unique id/path.
  let id = basePath;
  let n = 2;
  while (coll.items[id] || currentIds.includes(id)) id = `${basePath}-${n++}`;
  const blocks: Collection = {
    order: ["b0", "b1"],
    items: {
      b0: { _id: "b0", fields: { type: "heading", eyebrow: "New page", title, subtitle: "Add your content with the + button below." } },
      b1: { _id: "b1", fields: { type: "paragraph", text: "Start writing here, or add blocks below." } },
    },
  };
  coll.items[id] = { _id: id, fields: { title, slug: id, parent }, children: { blocks } };
  coll.order.push(id);
  return { doc: d, id };
}

/** Duplicate an item (clone its fields + children), inserting the copy right
 *  after the original. */
export function duplicateItem(
  doc: ContentDoc,
  loc: Locator,
  currentIds: string[],
  itemId: string
): ContentDoc {
  const d = clone(doc);
  const coll = ensureColl(d, loc, currentIds);
  const orig = coll.items[itemId];
  const id = newId();
  const copy: CollectionItem = orig
    ? { ...structuredClone(orig), _id: id }
    : { _id: id, fields: {} };
  coll.items[id] = copy;
  const idx = coll.order.indexOf(itemId);
  if (idx === -1) coll.order.push(id);
  else coll.order.splice(idx + 1, 0, id);
  return d;
}

export function moveItem(
  doc: ContentDoc,
  loc: Locator,
  currentIds: string[],
  itemId: string,
  dir: -1 | 1
): ContentDoc {
  const d = clone(doc);
  const coll = ensureColl(d, loc, currentIds);
  const i = coll.order.indexOf(itemId);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= coll.order.length) return d;
  [coll.order[i], coll.order[j]] = [coll.order[j], coll.order[i]];
  return d;
}
