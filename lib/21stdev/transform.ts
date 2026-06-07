/**
 * Jeeni brand transformer for 21st.dev components.
 * Rewrites generic Tailwind tokens → Jeeni design tokens,
 * fixes animation library imports, and adjusts timing — all without
 * any AI in the loop.
 */

// ─── Color mapping ────────────────────────────────────────────────────────────

/**
 * Maps generic Tailwind color + shade → Jeeni token name.
 * Returns null to leave the class unchanged.
 */
function jeeniToken(prop: string, color: string, shade: number): string | null {
  // Blues / Sky / Cyan
  if (["blue", "sky"].includes(color)) {
    if (shade <= 400) return "blue-bright";
    if (shade <= 600) return "blue";
    return "navy";
  }
  if (color === "cyan") return shade <= 500 ? "blue-bright" : "blue";

  // Indigo
  if (color === "indigo") {
    if (shade <= 400) return "blue-bright";
    if (shade <= 600) return "navy";
    return "navy-deep";
  }

  // Violet / Purple → authority navy
  if (["violet", "purple"].includes(color)) {
    return shade <= 500 ? "navy" : "navy-deep";
  }

  // Yellow / Amber → gold
  if (["yellow", "amber"].includes(color)) {
    return shade <= 400 ? "gold-soft" : "gold";
  }
  if (color === "orange") return "gold";

  // Green / Emerald / Teal → blue (Jeeni has no green)
  if (["green", "emerald"].includes(color)) {
    return shade <= 500 ? "blue-bright" : "blue";
  }
  if (color === "teal") return shade <= 400 ? "blue-bright" : "blue";

  // Neutrals
  if (["slate", "gray", "zinc", "neutral", "stone"].includes(color)) {
    if (shade >= 800) return prop === "text" ? "foreground" : "navy-deep";
    if (shade >= 700) return prop === "text" ? "foreground" : "navy-deep";
    if (shade >= 500) return prop === "text" ? "muted" : null;
    if (shade <= 100) return prop === "bg" ? "surface-muted" : null;
    if (shade <= 300) return prop === "border" || prop === "ring" ? "border-subtle" : null;
  }

  return null;
}

/** Replace `{prop}-{color}-{shade}` (and optional opacity `/N`) with Jeeni tokens. */
function transformColorClasses(code: string): string {
  return code.replace(
    /\b(bg|text|border|ring|from|to|via|fill|stroke|outline|accent|caret|decoration)-([a-z]+)-(\d{3})(\/([\d.]+))?\b/g,
    (match, prop, color, shadeStr, opacityPart, opacity) => {
      const token = jeeniToken(prop, color, parseInt(shadeStr, 10));
      if (!token) return match;
      return opacity ? `${prop}-${token}/${opacity}` : `${prop}-${token}`;
    }
  );
}

// ─── Hardcoded hex → CSS var ───────────────────────────────────────────────────

const HEX_TO_VAR: [RegExp, string][] = [
  [/#2563[Ee][Bb]/g, "var(--blue-bright)"],
  [/#3[Bb]82[Ff]6/gi, "var(--blue-bright)"],
  [/#0369[Aa]1/gi, "var(--blue)"],
  [/#0284[Cc]7/gi, "var(--blue)"],
  [/#1[Dd]4[Ee][Dd]8/gi, "var(--navy)"],
  [/#1[Ee]3[Aa]8[Aa]/gi, "var(--navy)"],
  [/#0[Ff]172[Aa]/gi, "var(--foreground)"],
  [/#[Cc][Aa]8[Aa]04/gi, "var(--gold)"],
  [/#[Ee][Aa][Bb]308/gi, "var(--gold-soft)"],
  [/#6366[Ff]1/gi, "var(--navy)"],
  [/#8[Bb]5[Cc][Ff]6/gi, "var(--navy)"],
  [/#[Ff]59[Ee]0[Bb]/gi, "var(--gold)"],
];

function transformHexColors(code: string): string {
  for (const [pattern, replacement] of HEX_TO_VAR) {
    code = code.replace(pattern, replacement);
  }
  return code;
}

// ─── Import fixes ──────────────────────────────────────────────────────────────

function transformImports(code: string): string {
  // framer-motion → motion/react (Jeeni uses motion@12 which uses this API)
  code = code.replace(/from ['"]framer-motion['"]/g, "from 'motion/react'");
  code = code.replace(/from ['"]@framer-motion\/[^'"]+['"]/g, "from 'motion/react'");

  // External font references → Jeeni font utilities
  code = code.replace(/font-\['(?:Inter|Geist|Poppins|DM_Sans|Plus_Jakarta_Sans|Nunito|Manrope)'\]/g, "font-sans");
  code = code.replace(/font-\['(?:Montserrat|Space_Grotesk|Outfit|Raleway|Oswald|Lexend)'\]/g, "font-display");

  return code;
}

// ─── Animation timing ──────────────────────────────────────────────────────────

function transformAnimations(code: string): string {
  // Jarring bounce → Jeeni's gentle float
  code = code.replace(/\banimate-bounce\b/g, "animate-float");

  // Overly long durations → Jeeni's snappier 300ms style
  code = code.replace(/\bduration-\[(?:800|900|1000|1200|1500|2000)ms\]\b/g, "duration-500");
  code = code.replace(/\bduration-700\b/g, "duration-500");
  code = code.replace(/\bduration-1000\b/g, "duration-500");

  // Neon/harsh glows that clash with Jeeni palette
  code = code.replace(/shadow-\[0_0_\d+px_rgba\(99,102,241[^)]+\)\]/g, "shadow-xl");
  code = code.replace(/shadow-\[0_0_\d+px_rgba\(139,92,246[^)]+\)\]/g, "shadow-xl");

  return code;
}

// ─── Typography: add font-display to heading sizes ─────────────────────────────

function transformTypography(code: string): string {
  // If a className string contains a large text size but no font-display, inject it
  return code.replace(
    /className=["']([^"']*\btext-(?:2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\b[^"']*)["']/g,
    (match, classes) => {
      if (classes.includes("font-display")) return match;
      const q = match[10]; // the quote char (" or ')
      return `className=${q}font-display ${classes}${q}`;
    }
  );
}

// ─── Detected dependencies ────────────────────────────────────────────────────

const KNOWN_INSTALLED = new Set(["react", "react-dom", "next", "motion", "three", "lenis"]);

export function detectMissingDeps(code: string): string[] {
  const deps = new Set<string>();
  const importRe = /from ['"]([^./][^'"]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = importRe.exec(code)) !== null) {
    const pkg = m[1].startsWith("@") ? m[1].split("/").slice(0, 2).join("/") : m[1].split("/")[0];
    if (!KNOWN_INSTALLED.has(pkg) && !pkg.startsWith("@/")) {
      deps.add(pkg);
    }
  }
  return [...deps];
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function transformComponent(rawCode: string): string {
  let code = rawCode;
  code = transformImports(code);
  code = transformColorClasses(code);
  code = transformHexColors(code);
  code = transformAnimations(code);
  code = transformTypography(code);
  return code;
}

/** Extract TSX code block and component export name from MCP response text. */
export function parseComponentResponse(text: string): { code: string; name: string } {
  const codeMatch = text.match(/```(?:tsx?|jsx?)\n([\s\S]+?)```/);
  const code = codeMatch ? codeMatch[1].trim() : text.trim();

  const nameMatch = code.match(/export\s+(?:default\s+)?function\s+(\w+)/) ??
                    code.match(/export\s+const\s+(\w+)\s*[=:]/);
  const name = nameMatch ? nameMatch[1] : "CustomComponent";

  return { code, name };
}
