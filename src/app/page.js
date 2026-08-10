'use client'

import { useEffect, useMemo, useRef, useState } from 'react';
import { createNoise3D } from 'simplex-noise';
import { animate, createTimeline, set, stagger } from 'animejs';
import Link from 'next/link';
import { Courier_Prime, Poppins, Homemade_Apple } from "next/font/google";
import { useInterval } from '../util/useInterval'

//👇 Configure our font object
const courier = Courier_Prime({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})
const poppinsBold = Poppins({
  subsets: ['latin'],
  weight: '600',
  display: 'swap',
})
const cedarville = Homemade_Apple({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})

const career = [
  {
    position: "Mechanical Engineering Intern",
    company: "ANT61",
    description: [
      "Designed mechanical fixtures for validating our product in a vibration test, qualifying it for space flight.",
      "Facilitated thermal cycling tests (vacuum and in-air) in accordance with SpaceX qualification standards.",
      "Analytically verified designs of product enclosures and its overall mechanical integrity."
    ]
  },
  {
    position: "Lead Software Engineer",
    company: "InnerSteps",
    description: [
      "Coordinated with a team of skilled engineers to deliver a high-quality, child-friendly mobile app.",
      "Produced an MVP in a few months, leading to a user base growth of over 700.",
      "Implemented agile methodologies to ensure efficient project delivery and meet tight deadlines."
    ]
  },
  {
    position: "Software Engineer",
    company: "Gaming Entertainment Systems",
    description: [
      "Implemented engaging visual displays using HTML, CSS and JavaScript.",
      "Designed printable CAD models to enhance product presentations for potential clients."
    ]
  }
];


const clamp01 = (n) => Math.min(1, Math.max(0, n));

const COLLAPSE_DISTANCE = 1000;



export default function Home() {
  const perlin = useMemo(() => createNoise3D(), []);
  const [openCareerDescription, setOpenCareerDescription] = useState(-1);

  const revealClass = 'opacity-0 data-[revealed=true]:opacity-100 transition-opacity duration-700 ease-out';

  const heroRef = useRef(null);
  const heroCenterRef = useRef(null);
  const heroHeaderRef = useRef(null);
  const heroMenuRef = useRef(null);

  const timelineRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const heroEl = heroRef.current;
    const heroCenterEl = heroCenterRef.current;
    const heroHeaderEl = heroHeaderRef.current;
    const heroMenuEl = heroMenuRef.current;
    const backgroundEl = typeof document !== 'undefined' ? document.getElementById('ascii-background') : null;
    if (!heroEl || !heroCenterEl || !heroHeaderEl || !heroMenuEl) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const headerHeight = 88;
    const collapseDistance = COLLAPSE_DISTANCE;

    const buildTimeline = () => {
      const viewportHeight = Math.max(1, window.innerHeight || 1);

      set(heroEl, {
        height: viewportHeight,
        borderRadius: 0,
      });
      set(heroCenterEl, { opacity: 1, translateY: 0 });
      set(heroHeaderEl, { opacity: 0, translateY: -8 });
      set(heroMenuEl, { opacity: 0, translateY: -6 });
      if (backgroundEl) set(backgroundEl, { opacity: 0 });

      if (timelineRef.current) timelineRef.current.pause();

      const tl = createTimeline({
        autoplay: false,
      })
        .add(
          backgroundEl,
          {
            opacity: [0, 1],
            duration: 1000,
            ease: 'inOut(2)',
          },
          0
        )
        .add(
          heroEl,
          {
            height: [viewportHeight, headerHeight],
            borderRadius: [0, 24],
            marginTop: [0, 40],
            marginLeft: [0, '25%'],
            marginRight: [0, '25%'],
            duration: 1000,
            ease: 'inOut(2)',
          },
          0
        )
        .add(
          heroCenterEl,
          {
            opacity: [1, 0],
            translateY: [0, -18],
            duration: 650,
            ease: 'inOut(2)',
          },
          0
        )
        .add(
          heroHeaderEl,
          {
            opacity: [0, 1],
            translateY: [-8, 0],
            duration: 350,
            ease: 'inOut(2)',
          },
          650
        )
        .add(
          heroMenuEl,
          {
            opacity: [0, 1],
            translateY: [-6, 0],
            duration: 180,
            ease: 'inOut(2)',
          },
          820
        );

      timelineRef.current = tl;

      const sync = () => {
        const progress = clamp01((window.scrollY || 0) / collapseDistance);
        const totalDuration = (typeof tl.duration === 'number' ? tl.duration : 0) || tl.iterationDuration || 1000;
        tl.seek(totalDuration * progress);
        rafRef.current = window.requestAnimationFrame(sync);
      };

      if (!prefersReducedMotion) {
        if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
        rafRef.current = window.requestAnimationFrame(sync);
      } else {
        tl.seek(tl.duration);
        if (backgroundEl) set(backgroundEl, { opacity: 1 });
      }
    };

    buildTimeline();

    const onResize = () => buildTimeline();
    window.addEventListener('resize', onResize);

    if (!prefersReducedMotion) {
      animate(heroCenterEl.querySelectorAll('[data-hero]'), {
        opacity: [0, 1],
        translateY: [10, 0],
        delay: stagger(120),
        duration: 700,
        ease: 'out(2)',
      });
    }

    return () => {
      window.removeEventListener('resize', onResize);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      if (timelineRef.current) timelineRef.current.pause();
    };
  }, []);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const nodes = Array.from(document.querySelectorAll('[data-reveal]'));
    if (nodes.length === 0) return;

    if (prefersReducedMotion) {
      nodes.forEach((node) => {
        node.dataset.revealed = 'true';
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target;
          el.dataset.revealed = entry.isIntersecting ? 'true' : 'false';
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  
  return (
    <main className="relative min-h-screen">
      <div className="relative w-full min-h-screen">
        {/* ASCII background revealed as hero collapses */}
        <div className={courier.className}>
          <Background
            perlin={perlin}
            aboutText={
              'Passionate about leveraging software development and robotics to drive innovation in the space industry. '
              + 'My journey as a coder and problem-solver has been fueled by a fascination with the limitless possibilities '
              + 'of technology and a deep admiration for the extraordinary accomplishments of the aerospace sector'
            }
          />
        </div>

        {/* Animated hero -> header */}
        <div
          ref={heroRef}
          className="fixed top-0 left-0 right-0 z-50 bg-white text-zinc-950/80 overflow-hidden border border-zinc-500/20"
          style={{ willChange: 'height, border-radius' }}
        >
          {/* Full-screen center */}
          <div
            ref={heroCenterRef}
            className={`${poppins.className} absolute inset-0 flex flex-col items-center justify-center text-center px-6`}
            style={{ willChange: 'opacity, transform' }}
          >
            <div data-hero className={`${cedarville.className} text-md italic`}>Hi! My name is</div>
            <div data-hero className={`${poppinsBold.className} text-6xl md:text-7xl leading-none mt-3`}>Kane Jackson</div>
            <div data-hero className="text-2xl md:text-3xl mt-4">Mechatronics / Computer Science</div>
          </div>

          {/* Collapsed header */}
          <div
            ref={heroHeaderRef}
            className={`${poppins.className} absolute inset-0 flex items-center justify-between  mx-auto px-6 md:px-10`}
            style={{ willChange: 'opacity, transform' }}
          >
            <div className="flex flex-col leading-tight">
              <div className={`${poppinsBold.className} text-xl md:text-2xl`}>Kane Jackson</div>
              <div className="text-sm md:text-base text-zinc-950/60">Mechatronics / Computer Science</div>
            </div>

            <nav
              ref={heroMenuRef}
              className="hidden md:flex items-center gap-8 text-sm text-zinc-950/60"
              style={{ willChange: 'opacity, transform' }}
            >
              <a href="#about" className="hover:text-zinc-950/80 transition-colors">About</a>
              <a href="#career" className="hover:text-zinc-950/80 transition-colors">Career</a>
              <a href="#projects" className="hover:text-zinc-950/80 transition-colors">Projects</a>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className={`${poppins.className} relative z-30 max-w-4xl mx-auto px-6 md:px-0`}>
          {/* Push content below the initial full-screen hero */}
          <div className="h-[100vh]" aria-hidden />

          {/* Anchor only: About text is spliced into the ASCII background */}
          <div id="about" className="scroll-mt-28" />

          {/* Links */}
          <div data-reveal data-revealed="false" className={`flex flex-row mb-8 ${revealClass}`}>
            <a href="https://www.linkedin.com/in/kanehjackson/">
              <img src="linkedin.png" className="opacity-50 mr-6 h-8" alt="Kane Jackson on LinkedIn" />
            </a>
            <a href="https://github.com/Kanos999">
              <img src="github.png" className="opacity-50 mr-4 h-10 -mt-1" alt="Kane Jackson on GitHub" />
            </a>
            <a href="https://www.instagram.com/kane.json/">
              <img src="instagram.png" className="opacity-30 mr-6 h-12 -mt-2" alt="Kane Jackson on Instagram" />
            </a>
          </div>

          <div className="h-[120vh]" aria-hidden />

          {/* Career */}
          <section
            id="career"
            data-reveal
            data-revealed="false"
            className={`scroll-mt-28 bg-white text-zinc-950/80 border border-zinc-950/10 rounded-3xl p-8 md:p-12 ${revealClass}`}
          >
            <div className={`${poppinsBold.className} text-2xl mb-6 md:mb-8 font-bold`}>Career</div>

            <div className="divide-y divide-gray-200 md:divide-y-0">
              {career.map((job, i) => {
                const isOpen = openCareerDescription === i;
                return (
                  <div
                    key={i}
                    className={`${isOpen ? "!border-l-zinc-900" : ""} transition-all duration-500 grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l`}
                  >
                    <button
                      type="button"
                      className="mt-4 md:mt-0 text-left"
                      onClick={() => {
                        setOpenCareerDescription(isOpen ? -1 : i);
                      }}
                    >
                      <div
                        className={`absolute -ml-[29px] bg-white h-auto w-auto overflow-visible -mb-full
                                      ${isOpen ? "text-zinc-900" : "text-gray-300"} transition-all duration-500`}
                      >
                        o
                      </div>
                      <div className="font-bold">{job.position}</div>
                      <div className="italic">{job.company}</div>
                    </button>

                    <div
                      className={`${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"} transition-all duration-500 ease-in-out overflow-y-hidden pl-4 md:max-h-96 md:opacity-100 md:mb-12`}
                    >
                      <ul className="text-zinc-500 list-disc">
                        {job.description.map((descriptionItem, j) => {
                          return (
                            <li className="list-disc mb-4" key={j}>
                              {descriptionItem}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Projects */}
          <section
            id="projects"
            data-reveal
            data-revealed="false"
            className={`scroll-mt-28 mt-8 md:mt-12 bg-white text-zinc-950/80 border border-zinc-950/10 rounded-3xl p-8 md:p-12 ${revealClass}`}
          >
            <div className={`${poppinsBold.className} text-2xl mb-6 font-bold`}>Projects</div>
            <div className="text-zinc-950/70 mb-6">
              A curated set of work across software, robotics, and generative visuals.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-950/10 rounded-3xl p-6">
                <div className={`${poppinsBold.className} text-lg mb-2 text-zinc-950/80`}>Selected Projects</div>
                <div className="text-sm text-zinc-950/60 mb-4">
                  Browse write-ups, demos, and experiments.
                </div>
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-3xl bg-zinc-950 text-white text-sm"
                >
                  View projects
                </Link>
              </div>

              <div className="border border-zinc-950/10 rounded-3xl p-6">
                <div className={`${poppinsBold.className} text-lg mb-2 text-zinc-950/80`}>ASCII Ocean</div>
                <div className="text-sm text-zinc-950/60 mb-4">
                  The generative ASCII background you&apos;re seeing here.
                </div>
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-3xl border border-zinc-950/20 text-zinc-950/70 text-sm">
                  Case study coming soon
                </div>
              </div>
            </div>
          </section>

          <div data-reveal data-revealed="false" className={`text-white p-12 text-center ${revealClass}`}>{"Made with <3 by @Kanos999"}</div>
        </div>
      </div>
    </main>
  );
}


const Background = ({ perlin, aboutText }) => {
  const outerRef = useRef(null);
  const measureRef = useRef(null);
  const [frame, setFrame] = useState(0);

  const fps = 30;
  const chars = "..//{#(;%)!};..:''";
  const resolution = 80;
  const overscanRows = 10;

  const [metrics, setMetrics] = useState({
    charWidth: 1,
    charHeight: 1,
    cols: 0,
    totalRows: 0,
  });
  const [scrollState, setScrollState] = useState({
    scrollTop: 0,
    viewportHeight: 0,
  });
  const [rendered, setRendered] = useState({ startRow: 0, lines: [], aboutTopPx: 0, aboutHeightPx: 0 });

  const wrapText = (text, maxWidth) => {
    const clean = (text || '').replace(/\s+/g, ' ').trim();
    if (!clean || maxWidth <= 0) return [];

    const words = clean.split(' ');
    const lines = [];
    let current = '';
    for (const word of words) {
      const next = current ? `${current} ${word}` : word;
      if (next.length <= maxWidth) {
        current = next;
      } else {
        if (current) lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);
    return lines;
  };

  useEffect(() => {
    if (!outerRef.current || !measureRef.current) return;

    const recompute = () => {
      if (!outerRef.current || !measureRef.current) return;
      const charRect = measureRef.current.getBoundingClientRect();
      const outerRect = outerRef.current.getBoundingClientRect();

      const charWidth = Math.max(1, charRect.width);
      const charHeight = Math.max(1, charRect.height);
      const cols = Math.max(0, Math.ceil(outerRect.width / charWidth) + 2);
      const totalRows = Math.max(0, Math.ceil(outerRef.current.offsetHeight / charHeight) + 1);

      setMetrics({ charWidth, charHeight, cols, totalRows });
    };

    recompute();

    const ro = new ResizeObserver(() => {
      recompute();
    });
    ro.observe(outerRef.current);

    window.addEventListener('resize', recompute);
    return () => {
      window.removeEventListener('resize', recompute);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = window.requestAnimationFrame(() => {
        setScrollState({
          scrollTop: window.scrollY || 0,
          viewportHeight: window.innerHeight || 0,
        });
      });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const generateVisibleLines = (nextFrame) => {
    if (metrics.cols <= 0 || metrics.totalRows <= 0 || metrics.charHeight <= 0) {
      return { startRow: 0, lines: [] };
    }

    const startCol = Math.max(3, Math.min(metrics.cols - 1, Math.floor(metrics.cols * 0.5)));
    const endCol = Math.max(startCol, Math.min(metrics.cols, Math.floor(metrics.cols * 0.9)));
    // Splice position is fixed in the Background's own grid (document space),
    // so it scrolls naturally with the page instead of tracking the viewport.
    // Place it below the full-screen hero area so it’s actually visible.
    const viewportHeight = scrollState.viewportHeight || window.innerHeight || 0;
    const insertTopPx = viewportHeight * 2.0; // 200vh from the top of the Background
    const insertStartRow = Math.max(0, Math.floor(insertTopPx / metrics.charHeight));

    const lineGap = 3; // render wrapped lines with 2 blank ASCII lines between

    const startColor = { r: 15, g: 23, b: 42 }; // slate-900 (#0f172a)
    const endColor = { r: 228, g: 228, b: 231 }; // zinc-200 (#e4e4e7)

    const maxTextWidth = Math.max(0, endCol - startCol);
    const bodyLines = wrapText(aboutText, maxTextWidth);
    const spliceLines = bodyLines;

    const aboutBlockRows = spliceLines.length > 0 ? (spliceLines.length - 1) * lineGap + 1 : 0;
    const aboutHeightPx = Math.max(0, aboutBlockRows * metrics.charHeight);

    const insertEndRow = insertStartRow + Math.max(0, (spliceLines.length - 1) * lineGap);

    // Scroll-driven "typing" effect: reveal lines sequentially based on scroll position,
    // and type characters on the current line.
    const typeStart = Math.max(0, insertTopPx - viewportHeight * 0.7);
    const typeEnd = Math.max(typeStart + 1, insertTopPx + viewportHeight * 0.12);
    const typeProgress = clamp01(
      2.3 * (((scrollState.scrollTop || 0) - typeStart) / (typeEnd - typeStart))
    );

    // Keep opacity/color transitions aligned with typing duration.
    const spliceOpacity = typeProgress;
    const spliceColor = {
      r: Math.round(startColor.r + (endColor.r - startColor.r) * typeProgress),
      g: Math.round(startColor.g + (endColor.g - startColor.g) * typeProgress),
      b: Math.round(startColor.b + (endColor.b - startColor.b) * typeProgress),
    };

    const typedFloat = typeProgress * spliceLines.length;
    const fullyTypedLines = Math.floor(typedFloat);
    const partialLineProgress = typedFloat - fullyTypedLines;

    const startRow = Math.max(
      0,
      Math.floor(scrollState.scrollTop / metrics.charHeight) - overscanRows
    );
    const endRow = Math.min(
      metrics.totalRows - 1,
      Math.floor((scrollState.scrollTop + scrollState.viewportHeight) / metrics.charHeight) +
        overscanRows
    );

    const lines = [];
    for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
      let line = "";
      for (let colIndex = 0; colIndex < metrics.cols; colIndex++) {
        const value = perlin(
          rowIndex / resolution,
          colIndex / resolution,
          (nextFrame * fps) / 6000
        );
        line += chars.charAt(Math.floor(Math.abs(value) * chars.length));
      }

      const withinAboutBlock = rowIndex >= insertStartRow && rowIndex <= insertEndRow;

      const deltaFromInsert = rowIndex - insertStartRow;
      const spliceIndex =
        deltaFromInsert >= 0 && deltaFromInsert % lineGap === 0
          ? Math.floor(deltaFromInsert / lineGap)
          : -1;
      let spliceText = null;
      if (spliceIndex >= 0 && spliceIndex < spliceLines.length) {
        const full = spliceLines[spliceIndex];
        if (spliceIndex < fullyTypedLines) {
          spliceText = full;
        } else if (spliceIndex === fullyTypedLines) {
          const take = Math.max(0, Math.min(full.length, Math.floor(partialLineProgress * (full.length + 1))));
          spliceText = full.slice(0, take);
        }
      }

      if (withinAboutBlock) {
        if (spliceText && maxTextWidth > 0) {
          const clipped = spliceText.slice(0, maxTextWidth);
          const before = line.slice(0, startCol);
          const after = line.slice(startCol + clipped.length);
          lines.push({ before, splice: clipped, after, color: spliceColor, opacity: spliceOpacity });
        } else {
          lines.push(line);
        }
      } else if (spliceText && maxTextWidth > 0) {
        const clipped = spliceText.slice(0, maxTextWidth);
        const before = line.slice(0, startCol);
        const after = line.slice(startCol + clipped.length);
        lines.push({ before, splice: clipped, after, color: spliceColor, opacity: spliceOpacity });
      } else {
        lines.push(line);
      }
    }

    return { startRow, lines, aboutTopPx: insertTopPx, aboutHeightPx };
  };

  useInterval(() => {
    const nextFrame = frame + 1;
    setRendered(generateVisibleLines(nextFrame));
    setFrame(nextFrame);
  }, 1000 / fps);

  return (
    <div
      ref={outerRef}
      id="ascii-background"
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none bg-zinc-950 text-slate-900"
      style={{ willChange: 'opacity' }}
    >
      <span
        ref={measureRef}
        className="absolute invisible whitespace-pre leading-4 text-nowrap"
      >
        M
      </span>

      <div
        className="absolute left-0 top-0 leading-4 text-nowrap select-none"
        style={{
          transform: `translateY(${rendered.startRow * metrics.charHeight}px)`,
        }}
      >
        {rendered.lines.map((line, idx) => {
          if (typeof line === 'string') {
            return <div key={rendered.startRow + idx}>{line}</div>;
          }
          return (
            <div key={rendered.startRow + idx}>
              {line.before}
              <span
                style={{
                  color: `rgb(${line.color.r}, ${line.color.g}, ${line.color.b})`,
                  opacity: line.opacity,
                  fontWeight: 700,
                }}
              >
                {line.splice}
              </span>
              {line.after}
            </div>
          );
        })}
      </div>

      {/* About-me overlay panel (left half), aligned with spliced text band */}
      {(() => {
        const panelGapPx = 28;
        const panelPadYPx = 20;
        const top = Math.max(0, (rendered.aboutTopPx || 0) - panelPadYPx);
        const height = Math.max(200, (rendered.aboutHeightPx || 0) + panelPadYPx * 2);

        return (
      <div
        className="absolute left-0 bg-white rounded-r-3xl flex items-center justify-end text-right px-10"
        style={{
          top,
          height,
          width: `calc(50% - ${panelGapPx}px)`,
        }}
      >
        <div className={`${poppinsBold.className} text-5xl md:text-6xl text-zinc-950/80 leading-none`}>
          About me
        </div>
      </div>
        );
      })()}
    </div>
  );
}
