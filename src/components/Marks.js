/**
 * Drafting marks. These are the vocabulary the whole site is drawn in:
 * registration ticks, dimension lines, section headings, tick rails.
 * All decorative, all aria-hidden unless they carry real text.
 */

/** Registration ticks at the corners of a block. Parent must be positioned. */
export function CornerTicks({ inset = "-1px", size = 9, className = "" }) {
  const arm = { position: "absolute", background: "rgb(var(--rule-rgb) / 0.28)" };
  const corners = [
    { top: inset, left: inset, h: { top: 0, left: 0 }, v: { top: 0, left: 0 } },
    { top: inset, right: inset, h: { top: 0, right: 0 }, v: { top: 0, right: 0 } },
    { bottom: inset, left: inset, h: { bottom: 0, left: 0 }, v: { bottom: 0, left: 0 } },
    { bottom: inset, right: inset, h: { bottom: 0, right: 0 }, v: { bottom: 0, right: 0 } },
  ];

  return (
    <span aria-hidden className={`pointer-events-none ${className}`}>
      {corners.map((c, i) => {
        const { h, v, ...pos } = c;
        return (
          <span key={i} style={{ position: "absolute", ...pos, width: size, height: size }}>
            <span style={{ ...arm, ...h, width: size, height: 1 }} />
            <span style={{ ...arm, ...v, width: 1, height: size }} />
          </span>
        );
      })}
    </span>
  );
}

/** Arrowhead used at the ends of dimension lines. Points outward, toward the
 * extension line it touches — the way a real dimension is drawn. */
function Arrow({ direction = "left" }) {
  return (
    <svg
      width="7"
      height="7"
      viewBox="0 0 7 7"
      className="shrink-0"
      style={{ transform: direction === "left" ? "rotate(180deg)" : "none" }}
      aria-hidden
    >
      <path d="M7 3.5 0 3.5M7 3.5 3 1.6M7 3.5 3 5.4" stroke="rgb(var(--rule-rgb) / 0.4)" strokeWidth="1" fill="none" />
    </svg>
  );
}

/**
 * A horizontal dimension line with extension ticks, arrowheads and a label
 * sitting in a break in the middle — the way a real drawing annotates a span.
 */
export function DimensionLine({ label, className = "" }) {
  const hair = "h-px flex-1 bg-rule/25";
  return (
    <div aria-hidden className={`flex w-full items-center gap-2 ${className}`}>
      <span className="h-2 w-px shrink-0 bg-rule/30" />
      <Arrow direction="left" />
      <span className={hair} />
      {label ? <span className="label shrink-0 text-ink/35">{label}</span> : null}
      <span className={hair} />
      <Arrow direction="right" />
      <span className="h-2 w-px shrink-0 bg-rule/30" />
    </div>
  );
}

/**
 * Section heading: mono index, title, and a hairline running out to the
 * right margin. The index numbers give the page a sheet-like order.
 */
export function SectionHeading({ index, title, id }) {
  return (
    <div id={id} className="scroll-mt-28">
      <div className="flex items-baseline gap-4 md:gap-6">
        <span className="label pt-1 text-ink/35 tabular-nums">{index}</span>
        <h2 className="text-2xl font-medium tracking-tight md:text-3xl">{title}</h2>
        <span className="mt-[-2px] hidden h-px flex-1 self-center bg-rule/12 sm:block" />
      </div>
    </div>
  );
}

/** A ruled tick rail — the vertical scale that runs beside the timeline. */
export function ScaleRail({ ticks = 12, className = "" }) {
  return (
    <div aria-hidden className={`relative flex flex-col justify-between ${className}`}>
      <span className="absolute inset-y-0 left-0 w-px bg-rule/15" />
      {Array.from({ length: ticks }).map((_, i) => (
        <span
          key={i}
          className="relative h-px bg-rule/25"
          style={{ width: i % 4 === 0 ? 9 : 4 }}
        />
      ))}
    </div>
  );
}
