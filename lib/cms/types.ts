/* CMS content model.
 *
 * Principle: CODE owns the schema, the seed values, and the default order.
 * The STORE only holds what the owner changed — scalar overrides, collection
 * membership/order, and per-item field overrides. This keeps the persisted
 * document small and lets code-side copy edits to *untouched* fields keep
 * flowing through after a redeploy.
 */

export type Scalars = Record<string, string>;

export type CollectionItem = {
  /** Stable id. Seed items reuse their code id ("roadmap"); owner-created
   *  items get a generated id ("c_xx…"). Never the array index. */
  _id: string;
  /** Only the fields the owner overrode. Missing fields fall back to the seed. */
  fields: Record<string, string>;
  /** Nested ordered lists, e.g. a blog post's body `blocks`, or a `ul` block's `items`. */
  children?: Record<string, Collection>;
};

export type Collection = {
  /** Authoritative membership + sequence (list of `_id`s). */
  order: string[];
  items: Record<string, CollectionItem>;
  /** Seed `_id`s the owner deleted, so we don't re-add them from code. */
  removedSeeds?: string[];
};

export type SEOData = {
  title?: string;
  description?: string;
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
};

export type Redirect = {
  id: string;
  from: string;
  to: string;
  permanent: boolean;
  enabled: boolean;
};

export type ContentDoc = {
  version: 2;
  scalars: Scalars;
  collections: Record<string, Collection>;
  /** Section ids the owner has removed (hidden from the published site). */
  hidden: Record<string, boolean>;
  settings: {
    crmWebhookUrl: string;
    crmProvider: string;
    siteName?: string;
    siteDescription?: string;
    logoUrl?: string;
  };
  seo?: Record<string, SEOData>;
  redirects?: Redirect[];
  updatedAt: string;
};

export const EMPTY_DOC: ContentDoc = {
  version: 2,
  scalars: {},
  collections: {},
  hidden: {},
  settings: { crmWebhookUrl: "", crmProvider: "webhook" },
  seo: {},
  redirects: [],
  updatedAt: "",
};

/* ---- Seed (code-side default) shapes ---- */

export type SeedItem = {
  _id: string;
  /** Default field values for this item. */
  fields: Record<string, string>;
  /** Default nested collections (e.g. blocks). */
  children?: Record<string, SeedCollection>;
};

export type SeedCollection = {
  /** Stable collection id, e.g. "services.cards", "blog.posts". */
  id: string;
  items: SeedItem[];
};

/* ---- Resolved (effective) shapes handed to the UI ---- */

export type ResolvedItem = {
  _id: string;
  /** Whether this item exists in the code seed (vs owner-created). */
  seed: boolean;
  fields: Record<string, string>;
  children?: Record<string, ResolvedItem[]>;
};
