"use client";

import { useCMS } from "./edit-context";
import { useState } from "react";
import { openComponentPicker } from "./component-picker";

/* Floating editor toolbar. Only ever renders for authenticated admins (the
   server sets isAdmin from the session cookie), so visitors never see it.
   When not actively editing it's just a small "Edit site" pill. */
export function EditBar() {
  const cms = useCMS();
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (!cms || !cms.isAdmin) return null;

  // Preview mode (logged in but not editing): the site looks normal; only a
  // small pill is shown to start editing.
  if (!cms.editMode) {
    return (
      <div className="fixed bottom-5 right-5 z-[120]">
        <button
          onClick={cms.enterEdit}
          className="rounded-full bg-navy-deep px-5 py-2.5 text-sm font-semibold text-white shadow-2xl transition-transform hover:scale-[1.03]"
        >
          ✎ Edit site
        </button>
      </div>
    );
  }

  const tool =
    "rounded-lg px-3 py-2 text-xs font-semibold text-muted transition-colors hover:bg-slate-100 hover:text-foreground";

  return (
    <div className="fixed inset-x-0 bottom-4 z-[120] flex justify-center px-4">
      <div className="w-full max-w-4xl">
        {settingsOpen && (
          <div className="mb-2 ml-auto w-80 rounded-2xl glass-strong p-4 shadow-2xl">
            <label className="text-xs font-semibold text-foreground">
              CRM webhook URL (form submissions)
            </label>
            <input
              value={cms.getSetting("crmWebhookUrl")}
              onChange={(e) => cms.setSetting("crmWebhookUrl", e.target.value)}
              placeholder="https://hooks.zapier.com/…  or  /api/lead"
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue/60"
            />
            <p className="mt-2 text-[11px] leading-relaxed text-muted">
              Leads POST here as JSON. Use a Zapier/Make/HubSpot webhook, or the
              built-in <code>/api/lead</code> endpoint. Leads are also saved to
              the site&apos;s store automatically.
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-1 gap-y-2 rounded-2xl glass-strong px-3 py-2 shadow-2xl">
          {/* status */}
          <span className="flex items-center gap-1.5 px-2 text-xs font-semibold text-blue">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue" />
            </span>
            Editing
          </span>

          <span className="mx-1 h-5 w-px bg-slate-300" />

          {/* manage */}
          <button onClick={cms.openPages} className={tool}>📄 Pages</button>
          <button onClick={cms.openMenu} className={tool}>🔗 Menu</button>
          <button onClick={cms.openAssets} className={tool}>🗂 Assets</button>
          <button onClick={() => setSettingsOpen((s) => !s)} className={tool}>⚙ CRM</button>
          <button onClick={openComponentPicker} className={tool}>🧩 Components</button>

          <span className="mx-1 h-5 w-px bg-slate-300" />

          {/* save / publish */}
          <button
            onClick={cms.save}
            disabled={!cms.dirty || cms.saving}
            className="rounded-lg px-3.5 py-2 text-xs font-semibold text-navy-deep ring-1 ring-slate-300 transition-colors hover:bg-white disabled:opacity-40"
          >
            {cms.saving ? "Saving…" : cms.dirty ? "Save draft" : "Saved"}
          </button>
          <button
            onClick={cms.publish}
            disabled={!cms.hasUnpublished || cms.publishing}
            className="rounded-lg bg-gradient-to-r from-blue to-navy px-4 py-2 text-xs font-semibold text-white shadow disabled:opacity-40"
          >
            {cms.publishing ? "Publishing…" : "Publish"}
          </button>
          <button onClick={cms.discard} disabled={!cms.dirty} className={`${tool} disabled:opacity-40`}>
            Discard
          </button>

          <span className="mx-1 h-5 w-px bg-slate-300" />

          {/* session */}
          <button onClick={cms.exitEdit} className={tool}>Done</button>
          <button onClick={cms.logout} className={tool} title="Sign out of the editor">⏻ Sign out</button>

          {cms.status && (
            <span className="ml-auto px-2 text-xs text-muted">{cms.status}</span>
          )}
        </div>
      </div>
    </div>
  );
}
