import * as si from "simple-icons";
import { computeIconColor } from "./theme.js";

/**
 * Build a slug → icon map at module load time.
 * This is safer than deriving the export key from the slug string,
 * since simple-icons titles don't always match the slug 1:1.
 */
const slugMap = new Map(
  Object.values(si)
    .filter((icon) => icon && typeof icon === "object" && "slug" in icon)
    .map((icon) => [icon.slug, icon]),
);

/**
 * Resolves an array of simple-icons slugs into icon objects with
 * theme-appropriate colors applied.
 *
 * Invalid slugs are skipped and collected in `skipped`.
 *
 * @param {string[]} slugs
 * @param {'dark'|'light'|'auto'} theme
 * @returns {{ resolved: IconData[], skipped: string[] }}
 */
export function resolveIcons(slugs, theme) {
  const resolved = [];
  const skipped = [];

  for (const slug of slugs) {
    const icon = slugMap.get(slug);

    if (!icon) {
      console.warn(`[svg-stack-cloud] Unknown slug: "${slug}"`);
      skipped.push(slug);
      continue;
    }

    resolved.push({
      slug: icon.slug,
      title: icon.title,
      color: computeIconColor(icon.hex, theme),
      path: icon.path,
    });
  }

  return { resolved, skipped };
}
