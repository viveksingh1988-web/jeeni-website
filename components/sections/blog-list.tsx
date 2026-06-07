"use client";

import { useRouter } from "next/navigation";
import { BlogCard3D } from "@/components/blog-card-3d";
import { useCMS } from "@/components/cms/edit-context";
import { useCollectionItems } from "@/components/cms/collection-editor";
import { BLOG_POSTS } from "@/lib/blog-data";
import type { ResolvedPost } from "@/lib/blog-data";

const STARTER_BLOCKS = [
  { type: "h2", text: "A new section heading" },
  { type: "p", text: "Write your first paragraph here." },
];

export function BlogList({ columns = 3 }: { columns?: 2 | 3 }) {
  const cms = useCMS();
  const router = useRouter();
  const { editing, items } = useCollectionItems(BLOG_POSTS);
  const ids = items.map((i) => i._id);
  const loc = { kind: "top", id: BLOG_POSTS.id } as const;

  // ResolvedItem.fields -> ResolvedPost shape for the card.
  const posts: ResolvedPost[] = items.map((it) => ({
    _id: it._id,
    slug: it._id,
    seed: it.seed,
    title: it.fields.title ?? "",
    excerpt: it.fields.excerpt ?? "",
    category: it.fields.category ?? "",
    author: it.fields.author ?? "",
    date: it.fields.date ?? "",
    readTime: it.fields.readTime ?? "",
    image: it.fields.image ?? "",
    blocks: [],
  }));

  async function newPost() {
    if (!cms) return;
    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const id = await cms.createPost(
      ids,
      {
        title: "Untitled post",
        excerpt: "A short summary of this article.",
        category: "Insights",
        author: "Jeeni",
        date: today,
        readTime: "5 min read",
        image:
          "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1600&q=80",
      },
      STARTER_BLOCKS
    );
    router.push(`/what-we-do/f/${id}`);
  }

  return (
    <>
      {editing && (
        <div className="mb-8 flex justify-center">
          <button type="button" className="cms-add" onClick={newPost}>
            + New blog post
          </button>
        </div>
      )}
      <div
        className={`grid gap-7 md:grid-cols-2 ${columns === 3 ? "lg:grid-cols-3" : ""}`}
      >
        {posts.map((post, i) => (
          <div key={post._id} className={editing ? "cms-item cms-on relative" : ""}>
            {editing && (
              <div className="cms-controls" contentEditable={false}>
                <button
                  type="button"
                  className="cms-ctl cms-ctl-danger"
                  title="Delete post"
                  onClick={() => {
                    if (window.confirm(`Delete “${post.title}”?`))
                      cms!.removeItem(loc, ids, post._id, post.seed);
                  }}
                >
                  ✕
                </button>
              </div>
            )}
            <BlogCard3D post={post} index={i} />
          </div>
        ))}
      </div>
    </>
  );
}
