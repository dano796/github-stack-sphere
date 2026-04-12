/**
 * Projects 3D sphere points through a rotation around a TILTED axis and
 * generates per-icon CSS @keyframes strings.
 *
 * Key insight: rotating purely around the Y-axis produces horizontal orbits.
 * To get diagonal orbits (matching react-icon-cloud's initial:[0.1,-0.1]),
 * we rotate around an axis that is tilted ~35° from vertical.
 * This uses Rodrigues' rotation formula so every icon — including poles —
 * traces a proper tilted ellipse.
 */

const TOTAL_FRAMES = 16; // keyframe stops (CSS interpolates between them)
const DEPTH_FACTOR = 0.1; // perspective strength — lower = flatter/more uniform

// Rotation axis tilted 35° from Y toward X, in the XY plane.
// This is what makes the motion feel like a naturally spinning globe
// rather than a horizontal carousel.
const AXIS_TILT = (Math.PI * 35) / 180; // 35°
const AXIS = {
  x: Math.sin(AXIS_TILT), // ≈ 0.574
  y: Math.cos(AXIS_TILT), // ≈ 0.819
  z: 0,
};

/**
 * Rodrigues' rotation formula.
 * Rotates `point` around the unit `axis` by `angle` radians.
 */
function rotateAroundAxis(point, axis, angle) {
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  const dot = axis.x * point.x + axis.y * point.y + axis.z * point.z;

  // cross = axis × point
  const crossX = axis.y * point.z - axis.z * point.y;
  const crossY = axis.z * point.x - axis.x * point.z;
  const crossZ = axis.x * point.y - axis.y * point.x;

  return {
    x: point.x * cosA + crossX * sinA + axis.x * dot * (1 - cosA),
    y: point.y * cosA + crossY * sinA + axis.y * dot * (1 - cosA),
    z: point.z * cosA + crossZ * sinA + axis.z * dot * (1 - cosA),
  };
}

/**
 * Projects a rotated 3D point onto the 2D SVG canvas with perspective.
 */
function projectPoint(point, angle, cx, cy, sphereRadius) {
  const r = rotateAroundAxis(point, AXIS, -angle);

  // Perspective projection: z controls foreshortening
  const perspScale = 1 / (1 - r.z * DEPTH_FACTOR);
  const px = cx + r.x * sphereRadius * perspScale;
  const py = cy + r.y * sphereRadius * perspScale;

  // Depth cues: front icons are larger and more opaque
  const depth = (r.z + 1) / 2; // 0 = back, 1 = front
  const opacity = 0.4 + 0.6 * depth;
  const scale = (0.75 + 0.25 * depth) * perspScale;

  return { px, py, opacity, scale, rz: r.z };
}

/**
 * Computes CSS keyframe strings and initial z-order for all icons.
 *
 * @param {Array<{x,y,z}>} spherePoints
 * @param {{ speed: number, size: number }} opts
 * @returns {{ keyframeCss: string, initialZOrder: number[] }}
 */
export function computeKeyframes(spherePoints, { speed = 30, size = 500 }) {
  const width = size;
  const height = Math.round(size * 0.8);
  const cx = width / 2;
  const cy = height / 2;

  // Larger radius → icons fill more of the canvas → less empty margin
  const sphereRadius = Math.min(width, height) * 0.36;

  // Compute initial rz values (frame 0) for z-ordering
  const initialZValues = spherePoints.map((point, i) => ({
    index: i,
    rz: projectPoint(point, 0, cx, cy, sphereRadius).rz,
  }));

  // Sort ascending: back (rz=-1) first, front (rz=+1) last → front renders on top
  const initialZOrder = [...initialZValues]
    .sort((a, b) => a.rz - b.rz)
    .map((p) => p.index);

  // Generate @keyframes for each icon
  const keyframeBlocks = spherePoints.map((point, i) => {
    const stops = [];

    for (let f = 0; f <= TOTAL_FRAMES; f++) {
      const angle = (f / TOTAL_FRAMES) * 2 * Math.PI;
      const { px, py, opacity, scale } = projectPoint(
        point,
        angle,
        cx,
        cy,
        sphereRadius,
      );
      const percent = Math.round((f / TOTAL_FRAMES) * 100);

      stops.push(
        `  ${percent}% { transform: translate(${px.toFixed(2)}px,${py.toFixed(2)}px) scale(${scale.toFixed(4)}); opacity: ${opacity.toFixed(4)}; }`,
      );
    }

    return `@keyframes orbit-${i} {\n${stops.join("\n")}\n}`;
  });

  // Per-icon animation rules
  const animationRules = spherePoints.map(
    (_, i) =>
      `.icon-${i} { animation: orbit-${i} ${speed}s linear infinite; transform-origin: 0 0; transform-box: fill-box; }`,
  );

  const keyframeCss = [...keyframeBlocks, "", ...animationRules].join("\n");

  return { keyframeCss, initialZOrder };
}
