import Link from "next/link";
import { CornerTicks } from "./Marks";
import ProjectMedia from "./ProjectMedia";
import { projectHref } from "@/data/projects";

/**
 * One project, drawn as a plate on the sheet: part number in the gutter,
 * status top-right, stack listed as annotations along the bottom.
 * Links to the project's own page, or out to an external one, and renders as
 * a plain block when there is neither, so half-finished entries still look
 * intentional.
 */
export default function ProjectCard({ project }) {
  const { id, title, year, summary, note, stack = [], status, media } = project;
  const href = projectHref(project);
  const isExternal = Boolean(href) && /^https?:\/\//.test(href);

  const body = (
    <>
      <CornerTicks inset="-4px" />

      <div className="flex items-baseline justify-between gap-4">
        <span className="label text-ink/35 tabular-nums">{id}</span>
        {status ? <span className="label text-ink/30">{status}</span> : null}
      </div>

      <div className="mt-8 flex items-baseline gap-3">
        <h3 className="text-xl font-medium tracking-tight transition-colors group-hover/card:text-accent md:text-2xl">
          {title}
        </h3>
        {href ? (
          <span
            aria-hidden
            className="translate-y-[-1px] text-ink/30 transition-all duration-300 group-hover/card:translate-x-1 group-hover/card:text-accent"
          >
            →
          </span>
        ) : null}
      </div>

      {note ? <p className="mt-2 font-serif text-lg italic text-ink/50">{note}</p> : null}

      <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-ink/60">{summary}</p>

      {media ? <ProjectMedia media={media} className="mt-8" /> : null}

      {/* Pushed to the foot of the card, so the annotation rule lines up
          across a row whether or not a card carries a figure. */}
      <div className="mt-auto pt-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3 border-t border-rule/10 pt-4">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {stack.map((tool, i) => (
              <span key={`${tool}-${i}`} className="label text-ink/30">
                {tool}
              </span>
            ))}
          </div>
          {/* ml-auto keeps the year on the right even when a long stack wraps. */}
          {year ? <span className="label ml-auto text-ink/30 tabular-nums">{year}</span> : null}
        </div>
      </div>
    </>
  );

  const shell =
    "group/card relative flex h-full flex-col border border-rule/12 bg-paper p-6 transition-colors duration-300 md:p-8";

  if (!href) {
    return <div className={shell}>{body}</div>;
  }

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`${shell} hover:border-rule/30`}
      >
        {body}
      </a>
    );
  }

  return (
    <Link href={href} className={`${shell} hover:border-rule/30`}>
      {body}
    </Link>
  );
}
