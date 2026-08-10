import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import ProjectIndex from "@/components/ProjectIndex";
import { DimensionLine } from "@/components/Marks";
import { projects } from "@/data/projects";
import { person } from "@/data/site";
import { JsonLd, projectsSchema } from "@/lib/schema";

export const metadata = {
  title: "Projects",
  description:
    "Engineering projects by Kane Jackson: a dual disc cycloidal drive, a graph neural network for robotic health monitoring, proximity voice comms for motorcyclists, computer vision and full stack software.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects | Kane Jackson",
    description:
      "Engineering projects across space software, robotics, mechanical design and AI.",
    url: "/projects",
    type: "website",
  },
};

export default function Projects() {
  return (
    <>
      <JsonLd schemas={[projectsSchema()]} />
      <SiteHeader />

      <main className="mx-auto max-w-sheet px-6 md:px-10">
        <section className="pb-8 pt-32 md:pt-40">
          <div className="mb-10 flex items-center justify-between border-b border-rule/10 pb-4 md:mb-16">
            <span className="label text-ink/30">Sheet 02 / Index of work</span>
            <span className="label text-ink/30">{person.location}</span>
          </div>

          <div className="grid grid-cols-1 items-end gap-x-12 gap-y-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal>
                <h1 className="text-6xl font-semibold leading-[0.95] tracking-tightest sm:text-7xl">
                  Projects
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-6 max-w-xl font-serif text-2xl leading-[1.25] text-ink/70 sm:text-3xl">
                  Things I&apos;ve designed, built and had to make work.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal delay={220}>
                <p className="max-w-md text-[15px] leading-relaxed text-ink/60">
                  A working index rather than a highlight reel. Hardware, software, and the
                  places the two meet. Each entry says what it is and the constraint that made
                  it interesting.
                </p>
                <div className="mt-8">
                  <DimensionLine label="Filed by discipline" />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="pb-16 md:pb-24">
          <ProjectIndex projects={projects} />
        </section>

        <section className="border-t border-rule/10 py-14 md:py-16">
          <Reveal className="flex flex-wrap items-baseline justify-between gap-6">
            <p className="font-serif text-2xl text-ink/70 sm:text-3xl">
              Want more detail on any of these? Just ask.
            </p>
            <div className="flex items-center gap-8">
              <a
                href={`mailto:${person.email}`}
                className="link-draw text-[15px] text-ink/70 transition-colors hover:text-accent"
              >
                {person.email}
              </a>
              <Link
                href="/"
                className="group inline-flex items-center gap-2 text-[15px] text-ink/50 transition-colors hover:text-ink"
              >
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                >
                  ←
                </span>
                <span className="link-draw">Index</span>
              </Link>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer sheet="2 of 2" title="Personal Site / Projects" />
    </>
  );
}
