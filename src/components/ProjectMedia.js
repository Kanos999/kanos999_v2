"use client";

import { useEffect, useRef } from "react";

const isVideo = (src = "") => /\.(mp4|webm|mov)$/i.test(src);

/**
 * A figure on the sheet: hairline frame, numbered caption, and either a still
 * or a silent looping recording depending on what `src` points at.
 *
 * For video, nothing is fetched until the frame is actually on screen —
 * preload is off and playback is driven by an observer — so a card that never
 * gets scrolled to costs nothing, and one that scrolls past stops playing.
 *
 * Silent, looping and deliberately control-free: a card is often a link, and
 * a <video controls> is interactive content, which must not sit inside one.
 * Under prefers-reduced-motion the poster stands in and the video is never
 * downloaded at all.
 */
export default function ProjectMedia({ media, fig = "Fig. 01", className = "" }) {
  const ref = useRef(null);
  const {
    src,
    poster,
    width,
    height,
    caption,
    alt,
    fit = "cover",
    frame,
    background,
    maxWidth,
  } = media;
  const video = isVideo(src);

  // `frame` lets the plate keep a shape the source doesn't have — a portrait
  // render sitting in a landscape frame, say — in which case the source is
  // contained inside it rather than cropped to fill.
  const ratio = frame || (width && height ? `${width} / ${height}` : "16 / 9");
  const objectFit = fit === "contain" ? "object-contain" : "object-cover";

  useEffect(() => {
    const el = ref.current;
    if (!el || !video) return;

    const prefersReducedMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") return;

    // React doesn't reliably render `muted` into the served markup, and
    // autoplay is only permitted on a muted element.
    el.muted = true;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // Rejects if the browser declines to autoplay; nothing to recover.
            Promise.resolve(entry.target.play()).catch(() => {});
          } else {
            entry.target.pause();
          }
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [video]);

  return (
    // `maxWidth` centres a narrow figure — a portrait source shown at its own
    // shape rather than letterboxed into a page-width landscape frame.
    <figure
      className={className}
      style={maxWidth ? { maxWidth, marginInline: "auto" } : undefined}
    >
      <div
        className="relative overflow-hidden border border-rule/12 bg-paper-2"
        // A contained source pillarboxes against this ground, so `background`
        // exists to match it to the source's own edges rather than the plate's.
        style={{ aspectRatio: ratio, ...(background ? { background } : {}) }}
      >
        {video ? (
          <video
            ref={ref}
            src={src}
            poster={poster}
            preload="none"
            muted
            loop
            playsInline
            disablePictureInPicture
            aria-label={alt || caption}
            className={`h-full w-full ${objectFit}`}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- static export, no image optimiser
          <img
            src={src}
            alt={alt || caption || ""}
            width={width}
            height={height}
            loading="lazy"
            decoding="async"
            className={`h-full w-full ${objectFit}`}
          />
        )}
      </div>

      {caption ? (
        <figcaption className="mt-3 flex items-baseline gap-3">
          <span className="label shrink-0 text-ink/30">{fig}</span>
          <span className="text-[13px] leading-relaxed text-ink/40">{caption}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}
