"use client";

import { Reveal } from "@/components/motion-primitives";
import { PostHero3D } from "@/components/post-hero-3d";
import { Editable } from "@/components/cms/editable";
import { EditableImage } from "@/components/cms/editable-image";
import { useCMS } from "@/components/cms/edit-context";
import {
  useCollectionItems,
  ItemControls,
  AddItem,
} from "@/components/cms/collection-editor";
import { BLOG_POSTS } from "@/lib/blog-data";
import { SectionShell } from "@/components/ui";

const POSTS_LOC = { kind: "top", id: BLOG_POSTS.id } as const;

export function PostBody({ slug }: { slug: string }) {
  const cms = useCMS();
  const { editing, items } = useCollectionItems(BLOG_POSTS);
  const post = items.find((p) => p._id === slug);

  if (!post) {
    // While edit mode / draft is loading, show a placeholder instead of blank.
    if (cms?.isAdmin && (cms.draftLoading || cms.editMode)) {
      return (
        <div className="grid min-h-[40vh] place-items-center px-6 pt-16 text-center text-muted">
          Loading your draft…
        </div>
      );
    }
    return null;
  }

  const f = post.fields;
  const blocks = post.children?.blocks ?? [];
  const blockIds = blocks.map((b) => b._id);
  const blocksLoc = {
    kind: "child" as const,
    parentId: BLOG_POSTS.id,
    itemId: slug,
    childKey: "blocks",
  };

  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-8 sm:pt-40">
        <SectionShell className="max-w-4xl">
          <Reveal>
            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue">
              <Editable bind={{ loc: POSTS_LOC, itemId: slug, field: "category" }}>
                {f.category}
              </Editable>
            </span>
            <Editable
              as="h1"
              bind={{ loc: POSTS_LOC, itemId: slug, field: "title" }}
              className="mt-5 font-display text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl"
            >
              {f.title}
            </Editable>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted">
              <Editable
                bind={{ loc: POSTS_LOC, itemId: slug, field: "author" }}
                className="font-medium text-foreground/90"
              >
                {f.author}
              </Editable>
              <span className="h-1 w-1 rounded-full bg-muted" />
              <Editable bind={{ loc: POSTS_LOC, itemId: slug, field: "date" }}>
                {f.date}
              </Editable>
              <span className="h-1 w-1 rounded-full bg-muted" />
              <Editable bind={{ loc: POSTS_LOC, itemId: slug, field: "readTime" }}>
                {f.readTime}
              </Editable>
            </div>
          </Reveal>
        </SectionShell>
      </section>

      <SectionShell className="max-w-4xl">
        {editing ? (
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-slate-200">
            <EditableImage
              src={f.image}
              alt={f.title}
              fill
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover"
              bind={{ loc: POSTS_LOC, itemId: slug, field: "image" }}
            />
          </div>
        ) : (
          <PostHero3D src={f.image} alt={f.title} />
        )}
      </SectionShell>

      <SectionShell className="max-w-3xl py-14">
        <div className="space-y-6">
          {blocks.map((block, i) => {
            const type = block.fields.type || "p";
            const controls = editing ? (
              <ItemControls
                loc={blocksLoc}
                currentIds={blockIds}
                item={block}
                index={i}
                total={blocks.length}
              />
            ) : null;

            if (type === "h2") {
              return (
                <div key={block._id} className={editing ? "cms-item cms-on relative" : ""}>
                  {controls}
                  <Editable
                    as="h2"
                    bind={{ loc: blocksLoc, itemId: block._id, field: "text" }}
                    className="pt-6 font-display text-2xl font-bold tracking-tight sm:text-3xl"
                  >
                    {block.fields.text}
                  </Editable>
                </div>
              );
            }

            if (type === "ul") {
              const lines = (block.fields.text ?? "")
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean);
              return (
                <div key={block._id} className={editing ? "cms-item cms-on relative" : ""}>
                  {controls}
                  {editing ? (
                    <Editable
                      as="div"
                      bind={{ loc: blocksLoc, itemId: block._id, field: "text" }}
                      className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-lg leading-relaxed text-foreground/85"
                    >
                      {block.fields.text}
                    </Editable>
                  ) : (
                    <ul className="space-y-3">
                      {lines.map((item, j) => (
                        <li key={j} className="flex gap-3 text-lg leading-relaxed text-foreground/85">
                          <span className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-gradient-to-br from-blue to-navy" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            }

            return (
              <div key={block._id} className={editing ? "cms-item cms-on relative" : ""}>
                {controls}
                <Editable
                  as="p"
                  bind={{ loc: blocksLoc, itemId: block._id, field: "text" }}
                  className="text-lg leading-relaxed text-foreground/85"
                >
                  {block.fields.text}
                </Editable>
              </div>
            );
          })}
        </div>

        {editing && (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <AddItem
              loc={blocksLoc}
              currentIds={blockIds}
              label="Paragraph"
              fields={() => ({ type: "p", text: "New paragraph." })}
            />
            <AddItem
              loc={blocksLoc}
              currentIds={blockIds}
              label="Heading"
              fields={() => ({ type: "h2", text: "New heading" })}
            />
            <AddItem
              loc={blocksLoc}
              currentIds={blockIds}
              label="List"
              fields={() => ({ type: "ul", text: "First bullet\nSecond bullet" })}
            />
          </div>
        )}
      </SectionShell>
    </>
  );
}
