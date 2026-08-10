import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import CycloidalPlate from "@/components/CycloidalPlate";
import ProjectCard from "@/components/ProjectCard";
import CareerTimeline from "@/components/CareerTimeline";
import { CornerTicks, DimensionLine, SectionHeading } from "@/components/Marks";
import { person, socials } from "@/data/site";
import { projects } from "@/data/projects";
import { JsonLd, profilePageSchema } from "@/lib/schema";

const about = {
  meta: [
    { name: "Based", value: person.location },
    { name: "Now", value: person.role },
    { name: "Focus", value: "Space systems, robotics, AI" },
    { name: "Study", value: `Mechatronic Eng. + Computer Science, ${person.university}` },
  ],
  lede:
    "I'm a space industry engineer working on mission and ground software, with a mechatronics background that covers the hardware it runs on.",
  body: [
    "At ANT61 I lead the mission software team. That means owning project planning and delivery across the ground software stack, defining the system architecture, and taking integration level implementation and testing through to spaceflight operations. On the hardware side I've designed mechanical fixtures for flight hardware testing, run thermal vacuum and vibration campaigns to SpaceX qualification standards, and analysed the structural integrity of flight enclosures.",
    "The mechatronics background is why I can work on both. Knowing how a part is toleranced changes how I write the software that drives it, and knowing what the software needs changes how I draw the part. I'm finishing a double degree in Mechatronic Engineering and Computer Science at UNSW, and I want to keep building across that boundary in space and robotics.",
  ],
};

const featured = projects.slice(0, 4);

export default function Home() {
  return (
    <>
      <JsonLd schemas={[profilePageSchema()]} />
      <SiteHeader />

      <main className="mx-auto max-w-sheet px-6 md:px-10">
        {/* ─────────────────────────── 00 · Hero ─────────────────────────── */}
        <section className="flex min-h-[88svh] flex-col justify-center pb-16 pt-32 md:pt-40">
          <div className="mb-10 flex items-center justify-between border-b border-rule/10 pb-4 md:mb-16">
            <span className="label text-ink/30">Portfolio / 2026</span>
            <span className="label text-ink/30">{person.location}</span>
          </div>

          <div className="grid grid-cols-1 items-center gap-x-12 gap-y-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal>
                <h1 className="text-6xl font-semibold leading-[0.95] tracking-tightest sm:text-7xl lg:text-8xl">
                  {person.name}
                </h1>
              </Reveal>

              <Reveal delay={120}>
                <p className="mt-6 font-serif text-3xl leading-[1.15] tracking-tight text-ink/70 sm:text-4xl">
                  Engineering across <em className="italic text-ink">software</em>,{" "}
                  <em className="italic text-ink">mechanical</em>, and the{" "}
                  <em className="italic text-ink">mechatronics</em> between them.
                </p>
              </Reveal>

              <Reveal delay={240}>
                <p className="mt-8 max-w-lg text-[15px] leading-relaxed text-ink/60">
                  Mission Software Lead at ANT61, building the ground software behind spaceflight
                  operations. My background is mechatronics, so the hardware side is home too.
                </p>
              </Reveal>

              <Reveal delay={340}>
                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <Link
                    href="/projects"
                    className="group inline-flex items-center gap-3 border border-ink bg-ink px-6 py-3 text-[13px] font-medium text-paper transition-colors hover:border-accent hover:bg-accent"
                  >
                    View projects
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                  <a
                    href={person.cv}
                    className="inline-flex items-center gap-3 border border-rule/20 px-6 py-3 text-[13px] font-medium text-ink/70 transition-colors hover:border-rule/40 hover:text-ink"
                  >
                    Download CV
                  </a>
                </div>
              </Reveal>

              <Reveal delay={460} className="mt-14 max-w-lg">
                <DimensionLine label="Software · Mechanical · Mechatronics" />
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <CycloidalPlate className="mx-auto max-w-[330px] lg:max-w-none" />
            </div>
          </div>
        </section>

        {/* ─────────────────────────── 01 · About ────────────────────────── */}
        <section className="py-16 md:py-24">
          <Reveal>
            <SectionHeading id="about" index="01" title="About" />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-12 md:mt-16 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <dl className="border-t border-rule/12">
                {about.meta.map((row) => (
                  <div key={row.name} className="flex justify-between gap-6 border-b border-rule/10 py-4">
                    <dt className="label text-ink/30">{row.name}</dt>
                    <dd className="text-right text-[13px] text-ink/60">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={120} className="lg:col-span-8">
              <p className="font-serif text-2xl leading-[1.3] text-ink/85 sm:text-3xl">{about.lede}</p>
              {about.body.map((para, i) => (
                <p key={i} className="mt-6 max-w-prose text-[15px] leading-relaxed text-ink/60">
                  {para}
                </p>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ────────────────────────── 02 · Career ────────────────────────── */}
        <section className="py-16 md:py-24">
          <Reveal>
            <SectionHeading id="career" index="02" title="Career" />
          </Reveal>
          <CareerTimeline />
        </section>

        {/* ─────────────────────── 03 · Selected work ────────────────────── */}
        <section className="py-16 md:py-24">
          <Reveal>
            <SectionHeading id="work" index="03" title="Selected work" />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2 md:gap-8">
            {featured.map((project, i) => (
              <Reveal key={project.id} delay={i * 90} className="h-full">
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={180}>
            <Link
              href="/projects"
              className="group mt-10 inline-flex items-center gap-3 text-[15px] text-ink/70 transition-colors hover:text-accent"
            >
              <span className="link-draw">All projects</span>
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </Reveal>
        </section>

        {/* ────────────────────────── 04 · Contact ───────────────────────── */}
        <section className="py-16 md:py-24">
          <Reveal>
            <SectionHeading id="contact" index="04" title="Contact" />
          </Reveal>

          <Reveal delay={100}>
            <div className="relative mt-12 border border-rule/12 bg-paper p-8 md:mt-16 md:p-14">
              <CornerTicks inset="-4px" />

              <p className="max-w-2xl font-serif text-3xl leading-[1.2] text-ink/85 sm:text-4xl">
                Working on something in space, robotics or AI? I&apos;d like to hear about it.
              </p>

              <a
                href={`mailto:${person.email}`}
                className="link-draw mt-8 inline-block text-lg text-ink/70 transition-colors hover:text-accent md:text-xl"
              >
                {person.email}
              </a>

              <div className="mt-12 grid grid-cols-1 gap-px border-t border-rule/10 bg-rule/10 pt-px sm:grid-cols-3">
                {socials.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group/social flex items-baseline justify-between gap-4 bg-paper px-1 py-5 transition-colors sm:px-4"
                  >
                    <span className="label text-ink/30">{s.label}</span>
                    <span className="text-[13px] text-ink/60 transition-colors group-hover/social:text-accent">
                      {s.handle}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer sheet="1 of 2" title="Personal Site / Index" />
    </>
  );
}
