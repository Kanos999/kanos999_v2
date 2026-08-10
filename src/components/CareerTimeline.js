import Reveal from "./Reveal";
import { career } from "@/data/site";

/** Origin marker — the node where each role attaches to the rail. */
function Node() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      aria-hidden
      className="absolute -left-[6.5px] top-[6px] bg-paper"
    >
      <circle cx="6.5" cy="6.5" r="4" fill="none" stroke="rgb(var(--rule-rgb) / 0.35)" strokeWidth="1" />
      <circle
        cx="6.5"
        cy="6.5"
        r="1.75"
        fill="rgb(var(--accent-rgb) / 0)"
        className="transition-[fill] duration-500 group-hover:fill-accent/70"
      />
    </svg>
  );
}

export default function CareerTimeline() {
  const total = career.length;

  return (
    <ol className="mt-12 md:mt-16">
      {career.map((job, i) => (
        <Reveal
          as="li"
          key={`${job.company}-${i}`}
          delay={i * 90}
          className="group grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-12"
        >
          {/* gutter: index + period */}
          <div className="flex items-baseline gap-4 md:col-span-4 md:flex-col md:items-start md:gap-2 md:pt-1">
            <span className="label text-ink/30 tabular-nums">
              {String(total - i).padStart(2, "0")}
            </span>
            {job.period ? (
              <span className="label text-ink/40">{job.period}</span>
            ) : null}
            <span className="label text-ink/25">{job.discipline}</span>
          </div>

          {/* rail + content */}
          <div className="relative border-l border-rule/12 pb-14 pl-8 group-last:pb-0 md:col-span-8 md:pb-16 md:group-last:pb-0">
            <Node />

            <h3 className="text-lg font-medium tracking-tight md:text-xl">{job.position}</h3>
            <p className="mt-1 font-serif text-lg italic text-ink/55 md:text-xl">{job.company}</p>

            <ul className="mt-5 space-y-3">
              {job.description.map((item, j) => (
                <li key={j} className="flex gap-4 text-[15px] leading-relaxed text-ink/60">
                  <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-rule/30" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
