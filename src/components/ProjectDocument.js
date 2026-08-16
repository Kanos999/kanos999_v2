import { CornerTicks } from "./Marks";

/**
 * A document filed against a project: cover plate on the left, the record and
 * its two actions on the right. The cover is a render of the first page, so
 * the thing looks like the paper it is before anyone opens it.
 *
 * The plate isn't itself a link — it holds two, and nesting them would be
 * invalid. Opening is the primary action; downloading sits beside it.
 */
export default function ProjectDocument({ document }) {
  const {
    title,
    kind = "PDF",
    meta,
    href,
    description,
    cover,
    coverWidth,
    coverHeight,
  } = document;

  return (
    <div className="relative border border-rule/12 bg-paper p-6 md:p-8">
      <CornerTicks inset="-4px" />

      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        {cover ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${title}`}
            tabIndex={-1}
            className="block w-32 shrink-0 border border-rule/12 transition-colors hover:border-rule/30 sm:w-40"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, no image optimiser */}
            <img
              src={cover}
              alt=""
              width={coverWidth}
              height={coverHeight}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full"
            />
          </a>
        ) : null}

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-4">
            <span className="label text-ink/35">{kind}</span>
            {meta ? <span className="label text-ink/25">{meta}</span> : null}
          </div>

          <h3 className="mt-5 text-lg font-medium leading-snug tracking-tight md:text-xl">
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="link-draw transition-colors hover:text-accent"
            >
              {title}
            </a>
          </h3>

          {description ? (
            <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-ink/60">{description}</p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-rule/10 pt-4">
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 text-[15px] text-ink/70 transition-colors hover:text-accent"
            >
              <span className="link-draw">Read it</span>
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <a
              href={href}
              download
              className="label text-ink/35 transition-colors hover:text-ink/70"
            >
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
