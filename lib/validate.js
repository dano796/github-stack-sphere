// Valid slug: lowercase alphanumeric, hyphens allowed in the middle.
// Single-character slugs (e.g. "r") are also valid.
const SLUG_RE = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

const VALID_THEMES = new Set(["dark", "light", "auto"]);

/**
 * Validates and normalises query parameters from the HTTP request.
 *
 * Returns { error: string } for fatal validation failures,
 * or the parsed + sanitised params on success.
 *
 * Numeric params are clamped rather than rejected — a value of 900
 * becomes 800 instead of an error.
 */
export function validateParams(query) {
  if (!query.icons) {
    return { error: "Missing required parameter: icons" };
  }

  const rawSlugs = String(query.icons)
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  if (rawSlugs.length === 0) {
    return { error: 'Parameter "icons" is empty' };
  }

  if (rawSlugs.length > 30) {
    return { error: `Too many icons: ${rawSlugs.length} (max 30)` };
  }

  const slugs = rawSlugs.filter((s) => SLUG_RE.test(s));

  if (slugs.length === 0) {
    return { error: "No valid icon slugs. Find slugs at simpleicons.org" };
  }

  const theme = VALID_THEMES.has(query.theme) ? query.theme : "dark";

  let speed = parseInt(query.speed, 10);
  if (isNaN(speed)) speed = 30;
  speed = Math.max(5, Math.min(60, speed));

  let size = parseInt(query.size, 10);
  if (isNaN(size)) size = 500;
  size = Math.max(300, Math.min(800, size));

  return { slugs, theme, speed, size };
}
