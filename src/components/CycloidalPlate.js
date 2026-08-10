import { drive } from "@/data/drive";
import { deriveDrive } from "@/lib/cycloidal";

/**
 * Drawing plate of Kane's cycloidal drive.
 *
 * Two views on one vertical axis: an assembled front elevation that runs the
 * real kinematics, and an exploded view on the same centreline. Every curve,
 * pin position and callout is computed from `@/data/drive` at build time —
 * change a parameter there and the drawing follows.
 */

const LINE = "rgb(var(--rule-rgb) / 0.4)";
const LINE_SOFT = "rgb(var(--rule-rgb) / 0.22)";
const LINE_DIM = "rgb(var(--rule-rgb) / 0.3)";
const DISC = "rgb(var(--rule-rgb) / 0.55)";
const TEXT = "rgb(var(--ink-rgb) / 0.38)";
const ACCENT = "rgb(var(--accent-rgb) / 0.6)";

const label = {
  fontFamily: "var(--font-mono), ui-monospace, monospace",
  fontSize: 9.5,
  letterSpacing: "0.1em",
  fill: TEXT,
};

// Assembled view
const CX = 230;
const CY = 178;
const OUTER = 146;

// Input revolution period. The other two rates fall out of the ratio, so the
// drawing turns at the reduction the drive actually produces.
const T = 7;

const d = deriveDrive(drive, OUTER);
const N = drive.pinCount;

const PERIOD = {
  input: T,
  disc: (T * (N - 1)) / N, // spin about its own centre, reversed
  output: T * (N - 1), // (N−1):1, reversed
};

// `extra` is merged rather than replaced: spreading these helpers onto an
// element that also carries a style would otherwise drop its fill, and an
// SVG child with no fill inherits fill="none" from the root — invisible text.
const drawn = (delay, extra) => ({
  className: "draw-in",
  style: { "--draw-delay": `${delay}ms`, ...extra },
});
const faded = (delay, extra) => ({
  className: "fade-in",
  style: { "--draw-delay": `${delay}ms`, ...extra },
});
const kin = (dir, dur, ox, oy) => ({
  className: `kin kin-${dir}`,
  style: { "--dur": `${dur.toFixed(4)}s`, transformOrigin: `${ox}px ${oy}px` },
});

const round = (n) => Number(n.toFixed(2));

/**
 * One entry per disc, equally spaced around the input.
 *
 * A disc whose eccentric sits at phase ψ has to be rotated by −ψ/(N−1) for its
 * lobes to engage the same fixed pins — half a lobe pitch for a 180° pair.
 * Rear discs are drawn hidden-line, so the front disc is listed last and
 * painted over them.
 */
const discs = Array.from({ length: drive.discCount }, (_, i) => {
  const phase = (i * 2 * Math.PI) / drive.discCount;
  return {
    index: i,
    front: i === 0,
    phase,
    cx: CX + d.ecc * Math.cos(phase),
    cy: CY + d.ecc * Math.sin(phase),
    clocking: -(phase * (180 / Math.PI)) / (N - 1),
  };
}).sort((a, b) => b.index - a.index);

// ── Exploded view: axial thicknesses are exaggerated so thin parts read ──
const SIDE_AXIS = 432;
const radial = OUTER / (drive.pinCircleRadius + drive.pinRadius + drive.housingWall) * 0.23;
const axial = radial * 1.6;

const GAP = 26;

// The twin discs sit together in the stack, under a single balloon.
const discPack = Array.from({ length: drive.discCount }, (_, i) => ({
  item: 2,
  w: drive.discThickness * axial,
  h: d.discOuter * 0.23,
  gapBefore: i === 0 ? GAP : drive.discGap * axial + 4,
  balloon: i === 0,
  spans: i === 0 ? drive.discCount : 0,
}));

const parts = [
  { item: 4, w: drive.shaftLength * axial, h: Math.max(5, drive.shaftRadius * radial), gapBefore: 0, balloon: true },
  ...discPack,
  { item: 1, w: drive.housingDepth * axial, h: OUTER * 0.23, gapBefore: GAP, balloon: true },
  {
    item: 3,
    w: drive.flangeDepth * axial,
    h: (drive.rollerCircleRadius + drive.rollerRadius) * radial,
    gapBefore: GAP,
    balloon: true,
  },
];

const stackWidth = parts.reduce((sum, p) => sum + p.w + p.gapBefore, 0);
let cursor = CX - stackWidth / 2;
const stack = parts.map((p, i) => {
  cursor += p.gapBefore;
  const x = cursor;
  cursor += p.w;
  return { ...p, x, key: i };
});

// A balloon that covers several identical parts is centred over the group.
const balloonX = (p, i) => {
  if (!p.spans || p.spans < 2) return p.x + p.w / 2;
  const last = stack[i + p.spans - 1];
  return (p.x + last.x + last.w) / 2;
};

const qty = (n) => (n > 1 ? ` × ${n}` : "");

const legend = [
  `1  RING PINS  ⌀${drive.pinRadius * 2} × ${N}`,
  `2  CYCLOIDAL DISC  ${d.lobes} LOBES${qty(drive.discCount)}, ${round(360 / drive.discCount)}° APART`,
  `3  OUTPUT ROLLERS  ⌀${drive.rollerRadius * 2} × ${drive.rollerCount}`,
  `4  ECCENTRIC INPUT  e${drive.eccentricity}${qty(drive.discCount)}, OPPOSED`,
];

export default function CycloidalPlate({ className = "" }) {
  return (
    <svg
      viewBox="0 0 460 646"
      fill="none"
      role="img"
      aria-label={`Engineering drawing of a ${d.ratio} to 1 ${
        drive.discCount > 1 ? `${drive.discCount}-disc ` : ""
      }cycloidal drive: assembled front elevation with the discs orbiting on opposed eccentrics inside ${N} ring pins, and an exploded view on the same axis.`}
      className={className}
      style={{ width: "100%", height: "auto", overflow: "visible" }}
    >
      {/* ── centrelines ── */}
      <g stroke={LINE_SOFT} strokeWidth="0.75" strokeDasharray="14 3 2 3">
        <line x1={CX} y1="18" x2={CX} y2="350" pathLength="1" {...drawn(120)} />
        <line x1={CX - OUTER - 22} y1={CY} x2={CX + OUTER + 22} y2={CY} pathLength="1" {...drawn(220)} />
      </g>

      {/* ── housing ── */}
      <g stroke={LINE} strokeWidth="1">
        <circle cx={CX} cy={CY} r={round(d.housingOuter)} pathLength="1" {...drawn(0)} />
        <circle
          cx={CX}
          cy={CY}
          r={round(d.pinCircle + d.pinR)}
          stroke={LINE_SOFT}
          pathLength="1"
          {...drawn(260)}
        />
      </g>

      {/* ── ring pins: fixed, the reaction member ── */}
      <g stroke={LINE} strokeWidth="1">
        {d.pins.map(([px, py], i) => (
          <circle
            key={i}
            cx={round(CX + px)}
            cy={round(CY + py)}
            r={round(d.pinR)}
            pathLength="1"
            {...drawn(340 + i * 26)}
          />
        ))}
      </g>

      {/* ── pin-circle diameter callout ── */}
      <g stroke={LINE_DIM} strokeWidth="0.75" {...faded(1500)}>
        <path
          d={`M${round(CX + d.pinCircle * 0.707)} ${round(CY - d.pinCircle * 0.707)} L${CX + 122} ${CY - 130} L${CX + 166} ${CY - 130}`}
        />
      </g>
      <text x={CX + 166} y={CY - 134} textAnchor="end" {...faded(1560, label)}>
        {`⌀${drive.pinCircleRadius * 2} PIN CIRCLE`}
      </text>

      {/* ── eccentricity callout ── */}
      <g stroke={ACCENT} strokeWidth="0.75" {...faded(1620)}>
        {/* leader touches the eccentric boss itself, not the axis */}
        <path
          d={`M${round(CX + d.ecc - d.bore * 0.86 * 0.7071)} ${round(CY + d.bore * 0.86 * 0.7071)} L${CX - 104} ${CY + 92} L${CX - 148} ${CY + 92}`}
        />
      </g>
      <text
        x={CX - 148}
        y={CY + 88}
        textAnchor="end"
        {...faded(1660, { ...label, fill: "rgb(var(--accent-rgb) / 0.8)" })}
      >
        {`e${drive.eccentricity} THROW`}
      </text>

      {/* ── the discs ──
       * Each is carried round by its own eccentric while spinning back on
       * itself, netting −ω/(N−1). The rear disc is drawn in hidden line.
       * Its profile carries a static clocking of −phase/(N−1): without it a
       * disc on an opposed eccentric cannot mesh with the same pin ring.
       * The roller holes take no such offset — both discs drive the same
       * output pins, so their hole patterns stay in step. */}
      {discs.map((disc) => (
        <g key={disc.index} {...kin("cw", PERIOD.input, CX, CY)}>
          <g {...kin("ccw", PERIOD.disc, disc.cx, disc.cy)}>
            <g transform={`translate(${round(disc.cx)} ${round(disc.cy)})`}>
              <path
                d={d.discPath}
                transform={`rotate(${round(disc.clocking)})`}
                stroke={disc.front ? DISC : LINE_SOFT}
                strokeWidth={disc.front ? 1.15 : 0.9}
                strokeDasharray={disc.front ? undefined : "5 3.5"}
                pathLength="1"
                {...drawn(560 + disc.index * 120)}
              />
              <circle
                r={round(d.bore)}
                stroke={disc.front ? LINE : LINE_SOFT}
                strokeWidth="1"
                strokeDasharray={disc.front ? undefined : "5 3.5"}
                pathLength="1"
                {...drawn(760)}
              />
              {disc.front
                ? d.rollers.map(([rx, ry], i) => (
                    <circle
                      key={i}
                      cx={round(rx)}
                      cy={round(ry)}
                      r={round(d.holeR)}
                      stroke={LINE_SOFT}
                      strokeWidth="1"
                      pathLength="1"
                      {...drawn(820 + i * 40)}
                    />
                  ))
                : null}
            </g>
          </g>
        </g>
      ))}

      {/* ── output rollers: the reduced, reversed output ── */}
      <g {...kin("ccw", PERIOD.output, CX, CY)}>
        {d.rollers.map(([rx, ry], i) => (
          <circle
            key={i}
            cx={round(CX + rx)}
            cy={round(CY + ry)}
            r={round(d.rollerR)}
            stroke={LINE}
            strokeWidth="1"
            pathLength="1"
            {...drawn(1060 + i * 40)}
          />
        ))}
      </g>

      {/* ── input eccentrics, one per disc, opposed for balance ── */}
      <g {...kin("cw", PERIOD.input, CX, CY)}>
        {discs.map((disc) => (
          <circle
            key={disc.index}
            cx={round(disc.cx)}
            cy={round(disc.cy)}
            r={round(d.bore * 0.86)}
            stroke={ACCENT}
            strokeWidth="1"
            strokeDasharray={disc.front ? undefined : "5 3.5"}
            pathLength="1"
            {...drawn(1300 + disc.index * 80)}
          />
        ))}
      </g>
      <circle
        cx={CX}
        cy={CY}
        r={round(drive.shaftRadius * d.scale)}
        stroke={LINE}
        strokeWidth="1"
        pathLength="1"
        {...drawn(1360)}
      />

      {/* centre mark */}
      <g stroke={LINE_DIM} strokeWidth="0.75" {...faded(1400)}>
        <path d={`M${CX - 7} ${CY}h14M${CX} ${CY - 7}v14`} />
      </g>

      <text x={CX} y="352" textAnchor="middle" {...faded(1700, label)}>
        FRONT ELEVATION / ASSEMBLED
      </text>

      {/* ── exploded view on the same axis ── */}
      <line x1="28" y1="372" x2="432" y2="372" stroke={LINE_SOFT} strokeWidth="0.75" {...faded(1760)} />

      <g {...faded(1820)}>
        <line
          x1="40"
          y1={SIDE_AXIS}
          x2="420"
          y2={SIDE_AXIS}
          stroke={LINE_SOFT}
          strokeWidth="0.75"
          strokeDasharray="14 3 2 3"
        />
        {stack.map((p, i) => (
          <g key={p.key}>
            <rect
              x={round(p.x)}
              y={round(SIDE_AXIS - p.h)}
              width={round(p.w)}
              height={round(p.h * 2)}
              stroke={LINE}
              strokeWidth="1"
            />
            {p.balloon ? (
              <>
                <circle
                  cx={round(balloonX(p, i))}
                  cy={SIDE_AXIS - 62}
                  r="8.5"
                  stroke={LINE_DIM}
                  strokeWidth="0.75"
                />
                <text
                  x={round(balloonX(p, i))}
                  y={SIDE_AXIS - 59}
                  textAnchor="middle"
                  style={{ ...label, letterSpacing: 0 }}
                >
                  {p.item}
                </text>
                <line
                  x1={round(balloonX(p, i))}
                  y1={SIDE_AXIS - 53}
                  x2={round(balloonX(p, i))}
                  y2={round(SIDE_AXIS - p.h - 4)}
                  stroke={LINE_DIM}
                  strokeWidth="0.75"
                />
              </>
            ) : null}
          </g>
        ))}
      </g>

      <text x={CX} y="482" textAnchor="middle" {...faded(1880, label)}>
        EXPLODED ON AXIS
      </text>

      {/* ── item list ── */}
      <g {...faded(1940)}>
        <line x1="28" y1="502" x2="432" y2="502" stroke={LINE_SOFT} strokeWidth="0.75" />
        {legend.map((row, i) => (
          <text key={row} x="28" y={522 + i * 16} style={{ ...label, letterSpacing: "0.06em" }}>
            {row}
          </text>
        ))}
      </g>

      {/* ── notes ── */}
      <g {...faded(2000)}>
        {[
          `REDUCTION ${d.ratio}:1, OUTPUT REVERSED.`,
          drive.discCount > 1
            ? `DISCS CLOCKED ${(360 / drive.discCount / d.lobes).toFixed(1)}°, HALF LOBE PITCH.`
            : null,
          "AXIAL SCALE EXAGGERATED IN EXPLODED VIEW.",
        ]
          .filter(Boolean)
          .map((note, i) => (
            <text key={note} x="28" y={598 + i * 16} style={{ ...label, letterSpacing: "0.06em" }}>
              {note}
            </text>
          ))}
      </g>
    </svg>
  );
}
