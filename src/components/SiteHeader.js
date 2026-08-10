"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav, person } from "@/data/site";

/**
 * Fixed header. Sits flush over the sheet at the top of the page, then takes
 * on a paper backing and a hairline once you scroll past it.
 */
export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || 0) > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-rule/12 bg-paper/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-sheet items-center justify-between px-6 py-4 md:px-10 md:py-5">
        <Link href="/" className="group flex items-baseline gap-3" onClick={() => setMenuOpen(false)}>
          <span className="text-[15px] font-semibold tracking-tight">{person.name}</span>
          <span className="label hidden text-ink/40 transition-colors group-hover:text-ink/60 sm:inline">
            {person.discipline}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="label link-draw text-ink/50 transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="label text-ink/60 md:hidden"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="site-menu"
        className={`overflow-hidden border-t border-rule/10 bg-paper/95 backdrop-blur-md transition-[max-height,opacity] duration-300 md:hidden ${
          menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mx-auto flex max-w-sheet flex-col px-6 py-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="label border-b border-rule/8 py-4 text-ink/60 last:border-b-0"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
