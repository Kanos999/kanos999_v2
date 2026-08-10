/**
 * ─────────────────────────────────────────────────────────────────────────
 *  YOUR CYCLOIDAL DRIVE — replace these numbers with the real ones.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * The hero drawing is generated from this object: the disc profile, the pin
 * ring, the roller engagement and every callout are computed from these
 * values, so the plate always draws the drive these numbers describe. Change
 * a number and the drawing changes with it.
 *
 * All dimensions in millimetres. `pinCount` sets the reduction: N pins gives
 * an N−1 lobe disc and an (N−1):1 ratio.
 *
 * Constraint worth respecting: eccentricity must stay below R/N or the
 * profile self-intersects (here R/N = 3.75, so e = 2.5 is comfortable).
 */
export const drive = {
  name: "Cycloidal Drive",
  designation: "KJ-CD-01", // whatever you call it

  pinCount: 12, // N ring pins → 11 lobes → 11:1
  pinCircleRadius: 45, // R — pin centres sit on this circle
  pinRadius: 4, // Rr — radius of each ring pin
  eccentricity: 2.5, // e — throw of each eccentric

  // Discs equally spaced around the input, i.e. 2 → 180° apart, 3 → 120°.
  // Each disc's lobes are clocked by its phase / (N−1) so it meshes with the
  // same pin ring; the plate derives that, you don't set it.
  discCount: 2,

  rollerCount: 6, // output rollers
  rollerRadius: 5,
  rollerCircleRadius: 28, // bolt circle the rollers sit on

  boreRadius: 14, // input bearing bore in the disc
  housingWall: 6, // material outboard of the pin circle

  // Side-elevation proportions for the exploded view (axial thicknesses).
  discThickness: 8,
  discGap: 1.5, // spacer between the twin discs
  housingDepth: 20,
  flangeDepth: 12,
  shaftLength: 62,
  shaftRadius: 6,

  material: "AL 6061 / PA12",
  process: "CNC / SLS",
};
