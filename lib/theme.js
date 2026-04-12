export const THEMES = {
  dark: { bg: "#0d1117", sphereStroke: "rgba(255,255,255,0.06)" },
  light: { bg: "#f6f8fa", sphereStroke: "rgba(0,0,0,0.06)" },
};

/**
 * WCAG relative luminance for a hex color string (without '#').
 */
export function relativeLuminance(hex) {
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const toLinear = (c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Returns the display color for an icon given the requested theme.
 *
 * - dark/light: returns a single hex string (no '#')
 * - auto: returns { dark: string, light: string }
 */
export function computeIconColor(hex, theme) {
  const lum = relativeLuminance(hex);

  if (theme === "dark") {
    return lum < 0.12 ? "ffffff" : hex; // too dark on dark bg → white
  }

  if (theme === "light") {
    return lum > 0.88 ? "111111" : hex; // too light on light bg → near-black
  }

  // theme === 'auto': compute both
  return {
    dark: lum < 0.12 ? "ffffff" : hex,
    light: lum > 0.88 ? "111111" : hex,
  };
}
