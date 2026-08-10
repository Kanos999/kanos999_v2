"use client";

import { useEffect, useRef } from "react";

/**
 * Reveals its children once they enter the viewport. Reveals once and stays
 * revealed — re-hiding content on scroll-up reads as a glitch, not a flourish.
 * Honours prefers-reduced-motion via CSS in globals.css.
 */
export default function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      el.dataset.revealed = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.dataset.revealed = "true";
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-revealed="false"
      style={{ "--reveal-delay": `${delay}ms` }}
      className={`reveal ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
