/**
 * 21st.dev component inspiration via their REST API.
 * Replaces the previous MCP/stdio approach which required spawning npx
 * interactively (doesn't work headlessly on Windows).
 */

export async function inspireComponent(query: string): Promise<string> {
  const apiKey = process.env.TWENTY_FIRST_API_KEY;
  if (!apiKey) throw new Error("TWENTY_FIRST_API_KEY is not set in .env.local");

  const res = await fetch("https://magic.21st.dev/api/fetch-ui", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({ message: query, searchQuery: query }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`21st.dev ${res.status}: ${txt.slice(0, 300) || res.statusText}`);
  }

  const data: unknown = await res.json();

  // Normalise the response to a string with a TSX code block so the existing
  // transform pipeline (parseComponentResponse → transformComponent) works.
  if (typeof data === "string") return data;
  const d = data as Record<string, unknown>;
  if (typeof d.code === "string") return "```tsx\n" + d.code + "\n```";
  if (typeof d.content === "string") return d.content;
  if (Array.isArray(d.content)) {
    return (d.content as Array<{ type?: string; text?: string }>)
      .map((c) => (c.type === "text" ? (c.text ?? "") : ""))
      .join("\n");
  }
  if (d.data && typeof (d.data as Record<string, unknown>).code === "string") {
    return "```tsx\n" + (d.data as Record<string, unknown>).code + "\n```";
  }
  // Fallback: stringify so the caller can at least show something
  return JSON.stringify(data, null, 2);
}
