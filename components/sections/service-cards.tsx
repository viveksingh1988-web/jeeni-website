"use client";

import Link from "next/link";
import { Stagger, StaggerItem } from "@/components/motion-primitives";
import { Card3D, Card3DItem } from "@/components/card-3d";
import { Editable } from "@/components/cms/editable";
import { EditableImage } from "@/components/cms/editable-image";
import { EditableIcon } from "@/components/cms/editable-icon";
import {
  useCollectionItems,
  ItemControls,
  AddItem,
} from "@/components/cms/collection-editor";
import { SERVICES_CARDS } from "@/lib/cms/seeds/services";

const LOC = { kind: "top", id: SERVICES_CARDS.id } as const;

export function ServiceCards() {
  const { editing, items } = useCollectionItems(SERVICES_CARDS);
  const ids = items.map((i) => i._id);

  return (
    <>
      <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((s, i) => {
          return (
            <StaggerItem
              key={s._id}
              id={s._id}
              className={`scroll-mt-28 ${editing ? "cms-item cms-on relative" : ""}`}
            >
              {editing && (
                <ItemControls
                  seed={SERVICES_CARDS}
                  currentIds={ids}
                  item={s}
                  index={i}
                  total={items.length}
                />
              )}
              <Card3D className="h-full">
                <div
                  className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white card-shadow"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="relative h-44 overflow-hidden">
                    <EditableImage
                      src={s.fields.image}
                      alt={s.fields.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 380px"
                      className="object-cover"
                      bind={{ loc: LOC, itemId: s._id, field: "image" }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-deep/45 to-transparent" />
                    <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 text-blue">
                      <EditableIcon
                        bind={{ loc: LOC, itemId: s._id, field: "icon" }}
                        fallback={s.fields.icon || "spark"}
                        className="h-6 w-6"
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <Card3DItem z={45}>
                      <Editable
                        as="h2"
                        bind={{ loc: LOC, itemId: s._id, field: "title" }}
                        className="font-display text-xl font-semibold leading-snug"
                      >
                        {s.fields.title}
                      </Editable>
                    </Card3DItem>
                    <Card3DItem z={28} className="mt-3 flex-1">
                      <Editable
                        as="p"
                        bind={{ loc: LOC, itemId: s._id, field: "body" }}
                        className="text-sm leading-relaxed text-muted"
                      >
                        {s.fields.body}
                      </Editable>
                    </Card3DItem>
                    <Card3DItem z={60} className="mt-6">
                      <Link
                        href="/contact-us"
                        onClick={(e) => editing && e.preventDefault()}
                        className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-blue"
                      >
                        <Editable bind={{ loc: LOC, itemId: s._id, field: "cta" }}>
                          {s.fields.cta}
                        </Editable>
                        <span className="transition-transform group-hover/link:translate-x-1">
                          →
                        </span>
                      </Link>
                    </Card3DItem>
                  </div>
                </div>
              </Card3D>
            </StaggerItem>
          );
        })}
      </Stagger>
      <div className="flex justify-center">
        <AddItem
          seed={SERVICES_CARDS}
          currentIds={ids}
          label="Add service"
          fields={() => ({
            title: "New service",
            body: "Describe this service.",
            cta: "Learn more",
            image:
              "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
          })}
        />
      </div>
    </>
  );
}
