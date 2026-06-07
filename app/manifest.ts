import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jeeni — Measurable AI ROI",
    short_name: "Jeeni",
    description:
      "Jeeni turns futurist research into measurable value. We track revenue and savings from day one for clear ROI.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0f172a",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
