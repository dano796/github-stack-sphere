import { validateParams } from "../lib/validate.js";
import { resolveIcons } from "../lib/icon-resolver.js";
import { generateSpherePoints } from "../lib/fibonacci-sphere.js";
import { computeKeyframes } from "../lib/keyframe-generator.js";
import { buildSVG, errorSVG } from "../lib/svg-builder.js";

/**
 * Vercel serverless handler.
 * Exposed at:  GET /api/stack
 * Rewritten to: GET /stack.svg  (via vercel.json)
 *
 * Query params:
 *   icons  (required) - comma-separated simple-icons slugs, e.g. typescript,react,docker
 *   theme  (default: dark)  - dark | light | auto
 *   speed  (default: 8)     - seconds per full rotation (2–30)
 *   size   (default: 500)   - SVG width in px (300–800)
 *   v      (ignored)        - cache-busting value
 */
export default function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).end("Method Not Allowed");
  }

  // --- Validate query params ---
  const validation = validateParams(req.query);

  if (validation.error) {
    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    return res.status(400).send(errorSVG(validation.error));
  }

  const { slugs, theme, speed, size } = validation;

  // --- Resolve icons from simple-icons ---
  const { resolved, skipped } = resolveIcons(slugs, theme);

  if (resolved.length === 0) {
    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    return res
      .status(400)
      .send(errorSVG("No valid icons found. Check slugs at simpleicons.org"));
  }

  // --- Core pipeline ---
  const spherePoints = generateSpherePoints(resolved.length);
  const { keyframeCss, initialZOrder } = computeKeyframes(spherePoints, {
    speed,
    size,
  });
  const svg = buildSVG({
    icons: resolved,
    keyframeCss,
    initialZOrder,
    theme,
    size,
    speed,
    skipped,
  });

  // --- Respond ---
  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400",
  );
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Access-Control-Allow-Origin", "*");

  // HEAD requests: send headers only
  if (req.method === "HEAD") return res.status(200).end();

  return res.status(200).send(svg);
}
