"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { ContentDoc, SeedCollection, ResolvedItem } from "@/lib/cms/types";
import { EMPTY_DOC } from "@/lib/cms/types";
import { resolveScalar, resolveCollection } from "@/lib/cms/merge";
import * as M from "@/lib/cms/mutate";
import type { Locator } from "@/lib/cms/mutate";

type CMS = {
  editMode: boolean;
  enterEdit: () => void;
  exitEdit: () => void;

  /** Active document: draft while editing, published otherwise. */
  doc: ContentDoc;

  // reads
  getScalar: (id: string, def: string) => string;
  getSetting: (key: keyof ContentDoc["settings"]) => string;
  resolve: (seed: SeedCollection) => ResolvedItem[];

  // scalar / settings writes
  setScalar: (id: string, val: string) => void;
  setSetting: (key: keyof ContentDoc["settings"], val: string) => void;

  // sections
  isHidden: (id: string) => boolean;
  setHidden: (id: string, hidden: boolean) => void;

  // collection writes (loc + currentIds let these work for top-level & nested)
  setItemField: (loc: Locator, itemId: string, field: string, val: string) => void;
  addItem: (
    loc: Locator,
    currentIds: string[],
    fields?: Record<string, string>,
    atIndex?: number
  ) => string;
  removeItem: (
    loc: Locator,
    currentIds: string[],
    itemId: string,
    isSeed: boolean
  ) => void;
  moveItem: (
    loc: Locator,
    currentIds: string[],
    itemId: string,
    dir: -1 | 1
  ) => void;
  /** Replace the whole draft (used by higher-level helpers like blog create). */
  applyDraft: (next: ContentDoc) => void;

  // blog helpers
  draftLoading: boolean;
  createPost: (
    currentIds: string[],
    fields: Record<string, string>,
    blocks: { type: string; text: string }[]
  ) => Promise<string>;
  duplicateItem: (loc: Locator, currentIds: string[], itemId: string) => void;

  // menu (header/footer links) editor
  menuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;

  // page builder
  pagesOpen: boolean;
  openPages: () => void;
  closePages: () => void;
  createPage: (
    currentIds: string[],
    title: string,
    slug: string,
    parent?: string
  ) => Promise<string>;

  // workflow
  dirty: boolean;
  hasUnpublished: boolean;
  saving: boolean;
  publishing: boolean;
  status: string;
  token: string;
  isAdmin: boolean;
  logout: () => void;
  save: () => Promise<boolean>;
  publish: () => Promise<void>;
  discard: () => void;

  // media library (DAM)
  library: { open: boolean; accept: MediaAccept };
  /** Open the asset library and resolve with the chosen URL (or null). */
  pickMedia: (accept?: MediaAccept) => Promise<string | null>;
  /** Open the asset library in browse mode (no selection). */
  openAssets: () => void;
  /** Called by the library to close and resolve any pending picker. */
  resolveLibrary: (url: string | null) => void;
};

export type MediaAccept = "image" | "pdf" | "all";

const Ctx = createContext<CMS | null>(null);
export const useCMS = () => useContext(Ctx);

const eq = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export function EditProvider({
  initial,
  isAdmin = false,
  children,
}: {
  initial: ContentDoc;
  isAdmin?: boolean;
  children: ReactNode;
}) {
  const router = useRouter();
  const [published] = useState<ContentDoc>(initial ?? EMPTY_DOC);
  const [draft, setDraft] = useState<ContentDoc>(initial ?? EMPTY_DOC);
  const [baseline, setBaseline] = useState<ContentDoc>(initial ?? EMPTY_DOC); // last saved draft
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [status, setStatus] = useState("");
  // Auth is via the httpOnly session cookie; token header kept only as a fallback.
  const [token] = useState("");

  const [draftLoading, setDraftLoading] = useState(false);

  // Load the saved draft from the server when entering edit mode (cookie auth).
  const loadDraft = useCallback(async () => {
    setDraftLoading(true);
    try {
      const res = await fetch("/api/content?draft=1");
      if (res.ok) {
        const d = (await res.json()) as ContentDoc;
        setDraft(d);
        setBaseline(d);
      }
    } catch {
    } finally {
      setDraftLoading(false);
    }
  }, []);

  // Ref tracks editMode so callbacks can read the current value without
  // needing it as a dependency (avoids stale-closure re-render loops).
  const editModeRef = useRef(false);
  editModeRef.current = editMode;

  const enterEdit = useCallback(() => {
    if (!isAdmin) return;
    setEditMode(true);
    // Guard: don't re-fetch draft if already in edit mode (e.g. called from
    // multiple places concurrently after page creation).
    if (!editModeRef.current) loadDraft();
  }, [isAdmin, loadDraft]);

  const exitEdit = useCallback(() => setEditMode(false), []);

  // The public site always loads looking normal. Edit chrome only turns on when
  // the admin actively clicks "Edit site" (or deep-links with ?edit). Edit mode
  // is kept in-memory, so it survives in-app navigation but a fresh load/reload
  // always returns to the normal preview.
  useEffect(() => {
    if (!isAdmin) return;
    try {
      if (new URL(window.location.href).searchParams.has("edit") && !editModeRef.current) {
        setEditMode(true);
        loadDraft();
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, loadDraft]);

  const logout = useCallback(async () => {
    // Clear both the HMAC session cookie and any NextAuth OAuth session.
    try { await fetch("/api/cms/login", { method: "DELETE" }); } catch {}
    try {
      const { signOut } = await import("next-auth/react");
      await signOut({ redirect: false });
    } catch {}
    window.location.href = "/studio";
  }, []);


  const active = editMode ? draft : published;

  const getScalar = useCallback(
    (id: string, def: string) => resolveScalar(active, id, def),
    [active]
  );
  const getSetting = useCallback(
    (key: keyof ContentDoc["settings"]) => active.settings?.[key] ?? "",
    [active]
  );
  const resolve = useCallback(
    (seed: SeedCollection) => resolveCollection(active, seed),
    [active]
  );

  const setScalar = useCallback(
    (id: string, val: string) => setDraft((d) => M.setScalar(d, id, val)),
    []
  );
  const setSetting = useCallback(
    (key: keyof ContentDoc["settings"], val: string) =>
      setDraft((d) => M.setSetting(d, key, val)),
    []
  );
  const isHidden = useCallback(
    (id: string) => !!active.hidden?.[id],
    [active]
  );
  const setHidden = useCallback(
    (id: string, hidden: boolean) => setDraft((d) => M.setHidden(d, id, hidden)),
    []
  );
  const setItemField = useCallback(
    (loc: Locator, itemId: string, field: string, val: string) =>
      setDraft((d) => M.setItemField(d, loc, itemId, field, val)),
    []
  );
  const addItem = useCallback(
    (
      loc: Locator,
      currentIds: string[],
      fields: Record<string, string> = {},
      atIndex?: number
    ) => {
      // Pre-generate ID so it can be returned synchronously, then use a
      // functional update so this always chains off the latest draft state
      // rather than a stale closure value (avoids losing concurrent mutations
      // such as site.pages created milliseconds earlier by createPage).
      const id = M.newId();
      setDraft((d) => M.addItem(d, loc, currentIds, fields, atIndex, id).doc);
      return id;
    },
    [] // no draft dep needed with functional update
  );
  const removeItem = useCallback(
    (loc: Locator, currentIds: string[], itemId: string, isSeed: boolean) =>
      setDraft((d) => M.removeItem(d, loc, currentIds, itemId, isSeed)),
    []
  );
  const moveItem = useCallback(
    (loc: Locator, currentIds: string[], itemId: string, dir: -1 | 1) =>
      setDraft((d) => M.moveItem(d, loc, currentIds, itemId, dir)),
    []
  );
  const applyDraft = useCallback((next: ContentDoc) => setDraft(next), []);

  /** Persist a specific doc to the server draft (used by create helpers so new
   *  content is saved immediately and survives a reload). Returns true on success. */
  const persistDoc = useCallback(
    async (d: ContentDoc): Promise<boolean> => {
      try {
        const res = await fetch("/api/content", {
          method: "PUT",
          headers: { "content-type": "application/json", "x-cms-token": token },
          body: JSON.stringify(d),
        });
        if (res.ok) {
          const j = await res.json();
          setBaseline(j.content as ContentDoc);
          return true;
        }
        const e = await res.json().catch(() => ({}));
        setStatus("Save failed: " + (e.error || `HTTP ${res.status}`));
        return false;
      } catch (err) {
        setStatus("Save failed: " + String(err));
        return false;
      }
    },
    [token]
  );

  const createPost = useCallback(
    async (
      currentIds: string[],
      fields: Record<string, string>,
      blocks: { type: string; text: string }[]
    ) => {
      const res = M.addPost(draft, currentIds, fields, blocks);
      setDraft(res.doc);
      const ok = await persistDoc(res.doc);
      if (ok) {
        setStatus("Post created & saved — click Publish to make it live");
        setTimeout(() => setStatus(""), 5000);
      }
      return res.id;
    },
    [draft, persistDoc]
  );

  const duplicateItem = useCallback(
    (loc: Locator, currentIds: string[], itemId: string) =>
      setDraft((d) => M.duplicateItem(d, loc, currentIds, itemId)),
    []
  );

  const [pagesOpen, setPagesOpen] = useState(false);
  const openPages = useCallback(() => setPagesOpen(true), []);
  const closePages = useCallback(() => setPagesOpen(false), []);
  const [menuOpen, setMenuOpen] = useState(false);
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const createPage = useCallback(
    async (currentIds: string[], title: string, slug: string, parent = "") => {
      const res = M.addPage(draft, currentIds, title, slug, parent);
      setDraft(res.doc);
      // Persist before navigating so the page survives a reload.
      const ok = await persistDoc(res.doc);
      if (ok) {
        setStatus("Page created & saved — click Publish to make it live");
        setTimeout(() => setStatus(""), 5000);
      }
      return res.id;
    },
    [draft, persistDoc]
  );

  const dirty = useMemo(() => !eq(draft, baseline), [draft, baseline]);
  const hasUnpublished = useMemo(
    () => !eq(draft, published),
    [draft, published]
  );

  const save = useCallback(async (): Promise<boolean> => {
    setSaving(true);
    setStatus("");
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "content-type": "application/json", "x-cms-token": token },
        body: JSON.stringify(draft),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || `HTTP ${res.status}`);
      }
      const j = await res.json();
      setBaseline(j.content as ContentDoc);
      setStatus("Draft saved");
      setTimeout(() => setStatus(""), 2000);
      return true;
    } catch (e) {
      setStatus("Error: " + String(e));
      return false;
    } finally {
      setSaving(false);
    }
  }, [draft, token]);

  const publish = useCallback(async () => {
    setPublishing(true);
    setStatus("");
    try {
      // Persist current draft first so what you see is what goes live.
      const ok = await save();
      if (!ok) throw new Error("save failed");
      const res = await fetch("/api/content/publish", {
        method: "POST",
        headers: { "x-cms-token": token },
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || `HTTP ${res.status}`);
      }
      setStatus("Published ✓ — live now");
      setTimeout(() => setStatus(""), 3000);
      router.refresh();
    } catch (e) {
      setStatus("Error: " + String(e));
    } finally {
      setPublishing(false);
    }
  }, [save, token, router]);

  const discard = useCallback(() => {
    setDraft(baseline);
    setStatus("Reverted to last saved");
    setTimeout(() => setStatus(""), 2000);
  }, [baseline]);

  // ---- media library ----
  const [library, setLibrary] = useState<{ open: boolean; accept: MediaAccept }>(
    { open: false, accept: "image" }
  );
  const pickResolver = useRef<((url: string | null) => void) | null>(null);

  const pickMedia = useCallback(
    (accept: MediaAccept = "image") =>
      new Promise<string | null>((resolve) => {
        pickResolver.current = resolve;
        setLibrary({ open: true, accept });
      }),
    []
  );
  const openAssets = useCallback(() => {
    pickResolver.current = null;
    setLibrary({ open: true, accept: "all" });
  }, []);
  const resolveLibrary = useCallback((url: string | null) => {
    setLibrary((l) => ({ ...l, open: false }));
    if (pickResolver.current) {
      pickResolver.current(url);
      pickResolver.current = null;
    }
  }, []);

  const value: CMS = {
    editMode,
    enterEdit,
    exitEdit,
    doc: active,
    getScalar,
    getSetting,
    resolve,
    setScalar,
    setSetting,
    isHidden,
    setHidden,
    setItemField,
    addItem,
    removeItem,
    moveItem,
    applyDraft,
    draftLoading,
    createPost,
    duplicateItem,
    menuOpen,
    openMenu,
    closeMenu,
    pagesOpen,
    openPages,
    closePages,
    createPage,
    dirty,
    hasUnpublished,
    saving,
    publishing,
    status,
    token,
    isAdmin,
    logout,
    save,
    publish,
    discard,
    library,
    pickMedia,
    openAssets,
    resolveLibrary,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
