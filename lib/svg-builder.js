import { THEMES } from "./theme.js";

/** Escape user-derived strings before embedding in SVG XML. */
function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Builds a self-contained animated SVG string.
 *
 * @param {object} opts
 * @param {IconData[]}  opts.icons         - resolved icon objects
 * @param {string}      opts.keyframeCss   - CSS @keyframes + .icon-N rules
 * @param {number[]}    opts.initialZOrder - icon indices sorted back→front
 * @param {string}      opts.theme         - 'dark' | 'light' | 'auto'
 * @param {number}      opts.size          - SVG width in px
 * @param {string[]}    [opts.skipped]     - slugs that were not found
 */
export function buildSVG({
  icons,
  keyframeCss,
  initialZOrder,
  theme,
  size,
  skipped = [],
}) {
  const width = size;
  const height = Math.round(size * 0.8);

  const label = escapeXml(
    "Tech Stack: " + icons.map((i) => i.title).join(", "),
  );

  // --- <defs>: one <symbol> per icon ---
  const symbols = icons
    .map((icon) => {
      // For 'auto' theme, color is an object; use dark variant as the path fill
      // and override via CSS custom property
      const fillHex =
        typeof icon.color === "object" ? icon.color.dark : icon.color;

      const fillAttr =
        theme === "auto"
          ? `fill="var(--c-${icon.slug}, #${fillHex})"`
          : `fill="#${fillHex}"`;

      return (
        `    <symbol id="si-${icon.slug}" viewBox="0 0 24 24">\n` +
        `      <path d="${icon.path}" ${fillAttr}/>\n` +
        `    </symbol>`
      );
    })
    .join("\n");

  // --- <style> block ---
  let bgCss = "";
  let autoIconVars = "";

  if (theme === "auto") {
    // Background & sphere stroke
    bgCss = `
  :root { --bg: #0d1117; --sphere-stroke: rgba(255,255,255,0.06); }
  @media (prefers-color-scheme: light) {
    :root { --bg: #f6f8fa; --sphere-stroke: rgba(0,0,0,0.06); }
  }
  .bg  { fill: var(--bg); }
  .sph { stroke: var(--sphere-stroke); }`;

    // Per-icon CSS custom properties
    const darkVars = icons
      .map(
        (i) =>
          `    --c-${i.slug}: #${typeof i.color === "object" ? i.color.dark : i.color};`,
      )
      .join("\n");
    const lightVars = icons
      .map(
        (i) =>
          `    --c-${i.slug}: #${typeof i.color === "object" ? i.color.light : i.color};`,
      )
      .join("\n");

    autoIconVars = `
  :root {
${darkVars}
  }
  @media (prefers-color-scheme: light) {
    :root {
${lightVars}
    }
  }`;
  }

  // --- Background & sphere attributes ---
  const themeConfig = THEMES[theme] || THEMES.dark;

  const bgAttrs = theme === "auto" ? 'class="bg"' : `fill="${themeConfig.bg}"`;

  // --- Icon <g> elements in z-order (back → front) ---
  const iconGroups = initialZOrder
    .map((idx) => {
      const icon = icons[idx];
      return (
        `  <g class="icon-${idx}">\n` +
        `    <use href="#si-${icon.slug}" xlink:href="#si-${icon.slug}" x="-20" y="-20" width="32" height="32"/>\n` +
        `  </g>`
      );
    })
    .join("\n");

  // Skipped notice (hidden, for debugging via browser devtools)
  const skippedComment =
    skipped.length > 0
      ? `\n  <!-- Skipped slugs (not found in simple-icons): ${skipped.join(", ")} -->`
      : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"
     role="img" aria-label="${label}">
  <defs>
${symbols}
  </defs>
  <style>
${bgCss}
${autoIconVars}
${keyframeCss}
  </style>
  <rect ${bgAttrs} width="${width}" height="${height}" rx="12"/>
${skippedComment}
${iconGroups}
</svg>`;
}

/**
 * Returns a minimal error SVG so GitHub READMEs show a message
 * instead of a broken image icon.
 */
export function errorSVG(message) {
  const safe = escapeXml(message);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="500" height="80" viewBox="0 0 500 80">
  <rect width="500" height="80" fill="#1e1e2e" rx="8"/>
  <text x="250" y="30" text-anchor="middle"
        font-family="ui-monospace,SFMono-Regular,Menlo,monospace"
        font-size="13" fill="#f38ba8">svg-stack-cloud: Error</text>
  <text x="250" y="55" text-anchor="middle"
        font-family="ui-monospace,SFMono-Regular,Menlo,monospace"
        font-size="11" fill="#6c7086">${safe}</text>
</svg>`;
}
