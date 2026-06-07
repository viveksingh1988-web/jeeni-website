/* Renders a JSON-LD structured-data script. Server component.
   Structured data is read by Google AND by AI answer engines
   (ChatGPT/SearchGPT, Perplexity, Gemini, Claude) to understand and cite the site. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
