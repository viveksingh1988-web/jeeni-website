"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Editable } from "@/components/cms/editable";
import { useCMS } from "@/components/cms/edit-context";
import {
  useCollectionItems,
  ItemControls,
  AddItem,
} from "@/components/cms/collection-editor";
import type { SeedCollection } from "@/lib/cms/types";
import { NAV_LINKS } from "@/lib/cms/seeds/nav";
import { FOOTER_ACTIONS } from "@/lib/cms/seeds/footer";

/* A column of editable links (label + href, reorder/add/delete in edit mode). */
function LinkColumn({ seed }: { seed: SeedCollection }) {
  const cms = useCMS();
  const { editing, items } = useCollectionItems(seed);
  const ids = items.map((i) => i._id);

  return (
    <ul className="mt-4 space-y-3">
      {items.map((l, i) => (
        <li
          key={l._id}
          className={`relative ${editing ? "cms-item cms-on" : ""}`}
        >
          {editing && (
            <ItemControls
              seed={seed}
              currentIds={ids}
              item={l}
              index={i}
              total={items.length}
            />
          )}
          {editing ? (
            <span className="flex items-center gap-2">
              <Editable
                bind={{ loc: { kind: "top", id: seed.id }, itemId: l._id, field: "label" }}
                className="text-sm text-muted"
              >
                {l.fields.label}
              </Editable>
              <button
                type="button"
                className="cms-ctl"
                title="Edit link URL"
                onClick={() => {
                  const href = window.prompt("Link URL", l.fields.href ?? "/");
                  if (href != null)
                    cms!.setItemField(
                      { kind: "top", id: seed.id },
                      l._id,
                      "href",
                      href
                    );
                }}
              >
                🔗
              </button>
            </span>
          ) : (
            <Link
              href={l.fields.href || "/"}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {l.fields.label}
            </Link>
          )}
        </li>
      ))}
      <AddItem
        seed={seed}
        currentIds={ids}
        label="Add link"
        fields={() => ({ label: "New link", href: "/" })}
      />
    </ul>
  );
}

export function Footer() {
  const pathname = usePathname();
  if (pathname === "/studio") return null;
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-24 border-t border-slate-200 bg-background-soft">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="max-w-md">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue via-blue-bright to-gold">
                <span className="text-lg font-bold text-white">J</span>
              </div>
              <span className="font-display text-xl font-bold tracking-tight">
                <Editable id="brand.name">Jeeni</Editable>
              </span>
            </div>
            <Editable
              as="p"
              id="footer.tagline"
              className="mt-5 text-balance text-sm leading-relaxed text-muted"
            >
              We turn futurist research into measurable value. We track revenue
              and savings from day one for clear ROI.
            </Editable>
            <Link
              href="/contact-us"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-blue/50 hover:text-blue"
            >
              <Editable id="footer.cta">Calculate Your ROI</Editable>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <Editable
                as="h4"
                id="footer.navHeading"
                className="text-xs font-semibold uppercase tracking-widest text-muted"
              >
                Navigate
              </Editable>
              <LinkColumn seed={NAV_LINKS} />
            </div>
            <div>
              <Editable
                as="h4"
                id="footer.getStartedHeading"
                className="text-xs font-semibold uppercase tracking-widest text-muted"
              >
                Get started
              </Editable>
              <LinkColumn seed={FOOTER_ACTIONS} />
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-8 text-sm text-muted sm:flex-row sm:items-center">
          <p>
            Copyright © {year}{" "}
            <Editable id="footer.rights">
              Jeeni LLC — All Rights Reserved.
            </Editable>
          </p>
          <Editable as="p" id="footer.bottomTagline" className="text-xs">
            We turn futurist research into measurable value.
          </Editable>
        </div>
      </div>
    </footer>
  );
}
