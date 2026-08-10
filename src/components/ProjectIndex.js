"use client";

import { useMemo, useState } from "react";
import ProjectCard from "./ProjectCard";
import Reveal from "./Reveal";
import { DISCIPLINES } from "@/data/projects";

/**
 * Filterable index of projects. The filter is deliberately plain — chips that
 * read as drawing-sheet field labels, with a live count on the right.
 */
export default function ProjectIndex({ projects }) {
  const [active, setActive] = useState("All");

  const available = useMemo(() => {
    const used = new Set(projects.flatMap((p) => p.disciplines || []));
    return ["All", ...DISCIPLINES.filter((d) => used.has(d))];
  }, [projects]);

  const filtered = useMemo(
    () =>
      active === "All"
        ? projects
        : projects.filter((p) => (p.disciplines || []).includes(active)),
    [projects, active]
  );

  if (projects.length === 0) {
    return (
      <div className="mt-16 border border-dashed border-rule/20 px-8 py-20 text-center">
        <p className="label text-ink/30">No entries on this sheet</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-b border-rule/12 pb-4 md:mt-16">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
          {available.map((discipline) => {
            const isActive = discipline === active;
            return (
              <button
                key={discipline}
                type="button"
                onClick={() => setActive(discipline)}
                aria-pressed={isActive}
                className={`label border px-3 py-2 transition-colors ${
                  isActive
                    ? "border-ink/80 text-ink"
                    : "border-rule/15 text-ink/35 hover:border-rule/30 hover:text-ink/60"
                }`}
              >
                {discipline}
              </button>
            );
          })}
        </div>

        <span className="label text-ink/25 tabular-nums">
          {String(filtered.length).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:mt-12 md:grid-cols-2 md:gap-8">
        {filtered.map((project, i) => (
          <Reveal key={project.id} delay={Math.min(i, 4) * 80} className="h-full">
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 border border-dashed border-rule/20 px-8 py-16 text-center">
          <p className="label text-ink/30">Nothing filed under {active}</p>
        </div>
      ) : null}
    </>
  );
}
