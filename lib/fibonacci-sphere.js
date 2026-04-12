/**
 * Distributes N points near-uniformly on the surface of a unit sphere
 * using the Fibonacci / golden angle algorithm.
 *
 * Returns an array of { x, y, z } objects where each vector has length ~1.
 */
export function generateSpherePoints(n) {
  if (n === 1) return [{ x: 0, y: 0, z: 1 }];

  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ≈ 2.39996 rad

  return Array.from({ length: n }, (_, i) => {
    const y = 1 - (i / (n - 1)) * 2; // +1 (top pole) → -1 (bottom pole)
    const radius = Math.sqrt(1 - y * y); // latitude circle radius
    const theta = goldenAngle * i;

    return {
      x: Math.cos(theta) * radius,
      y,
      z: Math.sin(theta) * radius,
    };
  });
}
