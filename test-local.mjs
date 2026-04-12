/**
 * Local test script — generates a sample SVG and writes it to test-output.svg.
 * Open that file in Chrome/Firefox to verify the animation before deploying.
 *
 * Usage:
 *   cd svg-stack-cloud
 *   npm install
 *   node test-local.mjs
 */

import { writeFileSync } from "fs";
import { generateSpherePoints } from "./lib/fibonacci-sphere.js";
import { computeKeyframes } from "./lib/keyframe-generator.js";
import { resolveIcons } from "./lib/icon-resolver.js";
import { buildSVG, errorSVG } from "./lib/svg-builder.js";

// Same slugs used in the portfolio's IconCloud.tsx
const slugs = [
  "javascript",
  "typescript",
  "python",
  "postgresql",
  "mysql",
  "supabase",
  "express",
  "react",
  "angular",
  "tailwindcss",
  "git",
  "github",
  "figma",
  "trello",
  "html5",
  "css3",
  "docker",
  "pandas",
  "numpy",
];

const theme = "dark"; // try 'dark', 'light', 'auto'
const speed = 30;
const size = 500;

console.log(`Resolving ${slugs.length} icons…`);
const { resolved, skipped } = resolveIcons(slugs, theme);

if (resolved.length === 0) {
  console.error("No icons resolved. Writing error SVG.");
  writeFileSync("test-output.svg", errorSVG("No valid icons found"));
  process.exit(1);
}

if (skipped.length > 0) {
  console.warn(`Skipped (not in simple-icons): ${skipped.join(", ")}`);
}

console.log(
  `Resolved ${resolved.length} icons: ${resolved.map((i) => i.slug).join(", ")}`,
);

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

writeFileSync("test-output.svg", svg, "utf-8");

const sizeKb = (Buffer.byteLength(svg, "utf-8") / 1024).toFixed(1);
console.log(`\nDone! test-output.svg written (${sizeKb} KB)`);
console.log("Open it in Chrome or Firefox to verify the animation.");
