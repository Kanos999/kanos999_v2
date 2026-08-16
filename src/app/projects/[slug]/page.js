import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import ProjectMedia from "@/components/ProjectMedia";
import ProjectDocument from "@/components/ProjectDocument";
import { DimensionLine, SectionHeading } from "@/components/Marks";
import { projects, detailedProjects } from "@/data/projects";
import { person } from "@/data/site";
import { JsonLd, projectSchema } from "@/lib/schema";

const bySlug = (slug) => projects.find((p) => p.slug === slug && p.detail);

/** One page per project carrying a `detail` block; the export needs them all up front. */
export function generateStaticParams() {
  return detailedProjects().map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }) {
  const project = bySlug(params.slug);
  if (!project) return {};

  const url = `/projects/${project.slug}`;
  const description = project.summary;

  return {
    title: project.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${project.title} | ${person.name}`,
      description,
      url,
      type: "article",
      ...(project.detail.figures?.[0]?.poster
        ? { images: [{ url: project.detail.figures[0].poster }] }
        : {}),
    },
  };
}

export default function ProjectPage({ params }) {
  const project = bySlug(params.slug);
  if (!project) notFound();

  const { detail } = project;
  const [hero, ...restFigures] = detail.figures || [];
  const documents = detail.documents || [];

  // Sections carry the running index; anything after them continues the count.
  const sections = detail.sections || [];
  const num = (i) => String(i + 1).padStart(2, "0");

  return (
    <>
      <JsonLd schemas={[projectSchema(project)]} />
      <SiteHeader />

      <main className="mx-auto max-w-sheet px-6 md:px-10">
        {/* ────────────────────────── Header ─────────────────────────── */}
        <section className="pb-10 pt-32 md:pt-40">
          <div className="mb-10 flex items-center justify-between border-b border-rule/10 pb-4 md:mb-16">
            <span className="label text-ink/30 tabular-nums">
              {project.id} / Project sheet
            </span>
            <span className="label text-ink/30">{project.status}</span>
          </div>

          <div className="grid grid-cols-1 items-end gap-x-12 gap-y-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal>
                <h1 className="text-5xl font-semibold leading-[0.95] tracking-tightest sm:text-6xl lg:text-7xl">
                  {project.title}
                </h1>
              </Reveal>
              {detail.lede ? (
                <Reveal delay={120}>
                  <p className="mt-6 max-w-xl font-serif text-2xl leading-[1.25] text-ink/70 sm:text-3xl">
                    {detail.lede}
                  </p>
                </Reveal>
              ) : null}
            </div>

            <div className="lg:col-span-5">
              <Reveal delay={220}>
                <p className="max-w-md text-[15px] leading-relaxed text-ink/60">{project.summary}</p>
                <div className="mt-8">
                  <DimensionLine label={`${project.year} · ${project.disciplines.join(" · ")}`} />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─────────────────────────── Hero figure ───────────────────── */}
        {hero ? (
          <section className="pb-14 md:pb-20">
            <Reveal>
              <ProjectMedia media={hero} fig="Fig. 01" />
            </Reveal>
          </section>
        ) : null}

        {/* ──────────────────── Field block + body ───────────────────── */}
        <section className="border-t border-rule/10 py-14 md:py-20">
          <div className="grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <dl className="border-t border-rule/12 lg:sticky lg:top-28">
                {(detail.specs || []).map((row) => (
                  <div key={row.name} className="border-b border-rule/10 py-4">
                    <dt className="label text-ink/30">{row.name}</dt>
                    <dd className="mt-2 text-[13px] leading-snug text-ink/60">{row.value}</dd>
                  </div>
                ))}
                {project.role ? (
                  <div className="border-b border-rule/10 py-4">
                    <dt className="label text-ink/30">Role</dt>
                    <dd className="mt-2 text-[13px] leading-snug text-ink/60">{project.role}</dd>
                  </div>
                ) : null}
                <div className="border-b border-rule/10 py-4">
                  <dt className="label text-ink/30">Stack</dt>
                  <dd className="mt-2 text-[13px] leading-snug text-ink/60">
                    {project.stack.join(", ")}
                  </dd>
                </div>
              </dl>
            </Reveal>

            <div className="lg:col-span-8">
              {sections.map((section, i) => (
                <Reveal key={section.heading} className={i === 0 ? "" : "mt-16 md:mt-20"}>
                  <SectionHeading index={num(i)} title={section.heading} />
                  {section.body.map((paragraph, j) => (
                    <p
                      key={j}
                      className="mt-6 max-w-prose text-[15px] leading-relaxed text-ink/60 first:mt-8"
                    >
                      {paragraph}
                    </p>
                  ))}
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────────────── Documents ───────────────────────── */}
        {documents.length > 0 ? (
          <section className="border-t border-rule/10 py-14 md:py-20">
            <Reveal>
              <SectionHeading index={num(sections.length)} title="Documents" />
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-6 md:mt-12">
              {documents.map((doc) => (
                <Reveal key={doc.href}>
                  <ProjectDocument document={doc} />
                </Reveal>
              ))}
            </div>
          </section>
        ) : null}

        {/* ──────────────────────── More figures ─────────────────────── */}
        {restFigures.length > 0 ? (
          <section className="border-t border-rule/10 py-14 md:py-20">
            <Reveal>
              <SectionHeading
                index={num(sections.length + (documents.length ? 1 : 0))}
                title="More"
              />
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-10 md:mt-12">
              {restFigures.map((figure, i) => (
                <Reveal key={figure.src}>
                  <ProjectMedia media={figure} fig={`Fig. ${num(i + 1)}`} />
                </Reveal>
              ))}
            </div>
          </section>
        ) : null}

        {/* ───────────────────────── Sheet foot ──────────────────────── */}
        <section className="border-t border-rule/10 py-14 md:py-16">
          <Reveal className="flex flex-wrap items-baseline justify-between gap-6">
            <p className="font-serif text-2xl text-ink/70 sm:text-3xl">
              Want the detail behind this one? Just ask.
            </p>
            <div className="flex items-center gap-8">
              <a
                href={`mailto:${person.email}`}
                className="link-draw text-[15px] text-ink/70 transition-colors hover:text-accent"
              >
                {person.email}
              </a>
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 text-[15px] text-ink/50 transition-colors hover:text-ink"
              >
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                >
                  ←
                </span>
                <span className="link-draw">All projects</span>
              </Link>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer sheet="3 of 3" title={`Personal Site / ${project.title}`} />
    </>
  );
}
