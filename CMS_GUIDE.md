# Jeeni inline CMS — guide

The whole site is editable in place. Edits are saved as a **draft**; clicking
**Publish** makes them live (and updates the running site, localhost included).

## Editing

1. Visit any page with `?edit` appended (e.g. `http://localhost:3000/?edit`).
   A floating toolbar appears at the bottom.
2. Click **✎ Edit site** and enter the passcode.
   - Local dev default: `jeeni-admin`
   - Production: whatever you set as `CMS_TOKEN` in Netlify.
3. Now everything is editable inline:
   - **Text** — click any heading / paragraph / button / list item and type.
   - **Images** — hover an image and choose **Replace image** (upload) or **Paste URL**.
   - **Collections** (service cards, FAQs, carousel slides, nav/footer links,
     principles, stats, blog posts, post body blocks) — hover an item for
     **↑ / ↓ / ✕** (reorder / delete) controls, and use the dashed **+ Add…**
     button to add new ones.
   - **Blog** — on `/blog`, **+ New blog post** creates a post and opens it;
     each card has a delete control. On a post, edit the title/meta/hero image
     and add/edit/reorder body blocks (Paragraph / Heading / List).
   - **Images everywhere** — every image (including page-body images, blog
     covers, the service/resource/whitepaper images) shows an **🖼 Edit image**
     badge; hover for **Asset library / Upload / Paste URL**.
   - **3D visuals** — the home hero 3D and similar visuals show **🖼 Replace
     visual**: swap them for an image from the library (and **↺ Use original**
     to revert).
   - **Stats / infographics** — the animated figures (hero cards, “Time
     Reclaimed”, findings) are editable; they keep the count-up until you edit.
   - **PDFs** — on Resources/Whitepaper, **📄 Change PDF** swaps the document
     from the asset library.
   - **Asset library (DAM)** — the toolbar’s **🗂 Assets** button (visible only
     in edit mode) opens the library: a built-in **Stock library** of HD photos
     + 3D renders, your own **uploads**, and **PDFs** — upload/browse/delete in
     one place. Any “Replace image”/“Change PDF” action picks from here.
   - **Remove whole sections** — hover any section and click **✕ Remove
     section**; it disappears from the published site and the spacing closes up
     automatically. While editing, a removed section stays dimmed with a **↺
     Restore section** button so you can bring it back. Publish to apply.
   - **Build new pages** — the toolbar’s **📄 Pages** button opens the page
     builder: **＋ New page** (give it a title) creates a page at
     `/p/<slug>` and opens it. Add blocks with the palette at the bottom
     (Heading, Text, Image, Text + Image, Stats, Quote, Call to action,
     Spacer), edit them inline, reorder/delete, then **Publish**. Link to a new
     page by adding a header/footer link pointing to `/p/<slug>`.
   - **CRM webhook** — the toolbar’s **CRM…** button sets where contact-form
     leads are POSTed (leads are also always saved to the store).
4. **Save draft** stores your work without changing the live site.
   **Publish** promotes the draft to live. **Discard** reverts to the last save.

## How it works

- Defaults live in code (`lib/cms/seeds/*`, `lib/blog-data.ts`). The datastore
  holds only your overrides + collection order/membership, so code-side copy
  changes still flow through for anything you haven’t touched.
- Storage adapter (`lib/cms/store.ts`):
  - **Local dev** → files under `.cms-data/` (gitignored).
  - **Netlify** → Netlify Blobs (managed datastore), automatic.
- The published doc is read server-side in `app/layout.tsx`, so the public HTML
  is fully rendered for SEO; edit mode overlays the draft on the client.

## Deploy to Netlify

1. Push the repo to GitHub/GitLab and “Add new site → Import” in Netlify
   (or `netlify deploy` with the CLI). `netlify.toml` + `@netlify/plugin-nextjs`
   are already configured — pages and `/api/*` deploy as Functions, and Blobs is
   available automatically.
2. Set environment variables in **Site settings → Environment variables**:
   - `AUTH_SECRET` (required) — a long random string used to sign editor
     sessions. Generate one with `openssl rand -base64 32`. Without it, login is
     disabled in production (fails closed).
   - `CMS_ADMIN_PASSWORD` (required) — the editor admin password.
   - `CMS_ADMIN_USER` (optional) — admin username (defaults to `admin`).
   - `CMS_TOKEN` (optional) — a token for headless/API access via the
     `x-cms-token` header.
   - `LEAD_FORWARD_URL` (optional) — CRM/Zapier/HubSpot webhook for leads.

   Locally (dev) it works out of the box with user `admin` / password
   `jeeni-admin`. For real use, create a `.env.local` with `AUTH_SECRET` and
   `CMS_ADMIN_PASSWORD`.
3. Deploy. Visit `https://<your-site>/?edit`, log in with `CMS_TOKEN`, edit,
   Publish. Content persists across redeploys (it lives in Blobs, not the build).

## API (all mutating routes require the `x-cms-token` header)

| Route | Method | Purpose |
|---|---|---|
| `/api/content` | GET | published content (public) |
| `/api/content?draft=1` | GET | draft (token) |
| `/api/content` | PUT | save draft (token) |
| `/api/content/publish` | POST | publish draft → live (token) |
| `/api/media` | POST | upload image (token) |
| `/api/media/<key>` | GET | serve uploaded image (public) |
| `/api/lead` | POST | capture a contact-form lead |
| `/api/leads` | GET | list captured leads (token) |
