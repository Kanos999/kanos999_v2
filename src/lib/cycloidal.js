/**
 * Cycloidal drive geometry.
 *
 * The disc profile is the standard trochoid traced by a cycloidal disc rolling
 * inside a ring of N pins. With N pins the disc has N−1 lobes, and the drive
 * reduces at (N−1):1 with a reversal at the output.
 *
 *   ψ(t) = atan2( sin((1−N)t), R/(eN) − cos((1−N)t) )
 *   x(t) =  R·cos t − Rr·cos(t + ψ) − e·cos(Nt)
 *   y(t) = −R·sin t + Rr·sin(t + ψ) + e·sin(Nt)
 *
 * where R is the pin-circle radius, Rr the pin radius and e the eccentricity.
 * Everything here runs at build time — the components import the finished path
 * strings, so no geometry maths reaches the browser.
 */

/** Points of the disc profile, centred on the origin, in input units (mm). */
export function discProfile({ pinCircleRadius: R, pinRadius: Rr, eccentricity: e, pinCount: N }, steps = 600) {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const psi = Math.atan2(Math.sin((1 - N) * t), R / (e * N) - Math.cos((1 - N) * t));
    points.push([
      R * Math.cos(t) - Rr * Math.cos(t + psi) - e * Math.cos(N * t),
      -R * Math.sin(t) + Rr * Math.sin(t + psi) + e * Math.sin(N * t),
    ]);
  }
  return points;
}

/** Turn a point list into an SVG path, scaled and rounded for a tidy DOM. */
export function toPath(points, scale = 1, decimals = 2) {
  const f = (n) => Number((n * scale).toFixed(decimals));
  return (
    points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${f(x)} ${f(y)}`).join("") + "Z"
  );
}

/** `count` points evenly spaced around a circle of `radius`, starting at 12 o'clock. */
export function circlePattern(count, radius, phase = -Math.PI / 2) {
  return Array.from({ length: count }, (_, i) => {
    const a = phase + (i / count) * Math.PI * 2;
    return [radius * Math.cos(a), radius * Math.sin(a)];
  });
}

/**
 * Everything the plate needs, derived once from the drive's parameters.
 * `scale` maps millimetres to viewBox units so the housing always lands on
 * `targetOuterRadius` no matter what numbers the drive is built from.
 */
export function deriveDrive(drive, targetOuterRadius) {
  const { pinCircleRadius: R, pinRadius: Rr, eccentricity: e, pinCount: N, rollerRadius, rollerCircleRadius, housingWall, boreRadius } = drive;

  const housingOuter = R + Rr + housingWall;
  const scale = targetOuterRadius / housingOuter;
  const lobes = N - 1;

  return {
    scale,
    lobes,
    ratio: lobes, // (N−1):1, output reversed
    // 1dp at this scale is ~0.04 mm — well inside line width, and it keeps
    // the inlined path under 8 KB.
    discPath: toPath(discProfile(drive), scale, 1),
    discOuter: (R - Rr + e) * scale,
    pins: circlePattern(N, R * scale),
    pinR: Rr * scale,
    housingOuter: housingOuter * scale,
    pinCircle: R * scale,
    ecc: e * scale,
    rollers: circlePattern(drive.rollerCount, rollerCircleRadius * scale),
    rollerR: rollerRadius * scale,
    // Output pins ride in oversized holes; the clearance is exactly the
    // eccentricity, which is what keeps them engaged through the orbit.
    holeR: (rollerRadius + e) * scale,
    rollerCircle: rollerCircleRadius * scale,
    bore: boreRadius * scale,
  };
}
