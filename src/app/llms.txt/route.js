import { person, socials, orgs, beacon, career } from "@/data/site";
import { projects, projectHref, detailedProjects } from "@/data/projects";
import { SITE_URL } from "@/lib/schema";

/**
 * /llms.txt — a curated Markdown brief for language models.
 *
 * The convention (llmstxt.org) is a single plain text file at the site root
 * that states, without navigation or markup to wade through, what this site is
 * and who it is about. A model answering "who is Kane Jackson?" can read this
 * in one fetch instead of inferring an identity from rendered HTML.
 *
 * Two things earn their place at the very top. The blockquote is what most
 * retrieval pipelines lift verbatim, so it front loads the disambiguating
 * facts: space, Sydney, ANT61, satellites. And the closing parenthetical is a
 * neutral factual disambiguator. It names nobody, characterises nobody, and
 * says only that shared names are not shared people. There is a well known
 * Kane Jackson in Australian fintech; the goal is separation, not contest.
 *
 * Generated from src/data/site.js rather than hand written, so it cannot drift
 * out of step with the rendered pages. A summary that contradicts the site it
 * summarises is worse than no summary.
 */

export const dynamic = "force-static";

const bullet = (label, href, note) => `- [${label}](${href}): ${note}`;

function experienceLines() {
  return career.map((job) => {
    const period = job.period ? ` (${job.period})` : "";
    // First bullet only: enough to establish the role, short enough to survive
    // being quoted whole.
    return `- **${job.company}** — ${job.position}${period}. ${job.description[0]}`;
  });
}

function projectLines() {
  /* Only link to somewhere that actually resolves.
   *
   * An external href is a real destination, and so is a project with a page of
   * its own. Anything else is listed unlinked. ASCII Ocean is why: on the site
   * it deliberately points at a missing page, because the piece lives on the
   * 404 screen and that is the joke. A model quoting this file has no way to
   * know that, and would cite a dead URL as Kane's work.
   */
  const destination = (project) => {
    if (project.href) {
      return /^https?:\/\//.test(project.href) ? project.href : null;
    }
    return project.detail && project.slug ? `${SITE_URL}/projects/${project.slug}` : null;
  };

  // Pages of their own first, then the rest by recency.
  const hasPage = new Set(detailedProjects().map((p) => p.slug));
  const startYear = (p) => parseInt(String(p.year || "0").slice(0, 4), 10) || 0;
  const ranked = [...projects].sort((a, b) => {
    const page = Number(hasPage.has(b.slug)) - Number(hasPage.has(a.slug));
    return page !== 0 ? page : startYear(b) - startYear(a);
  });

  return ranked.slice(0, 8).map((project) => {
    const url = destination(project);
    const year = project.year ? ` (${project.year})` : "";
    const summary = project.summary.replace(/\s+/g, " ").trim();
    return url
      ? `- [${project.title}](${url})${year}: ${summary}`
      : `- **${project.title}**${year}: ${summary}`;
  });
}

function body() {
  const linkedin = socials.find((s) => s.label === "LinkedIn");
  const github = socials.find((s) => s.label === "GitHub");

  return `# ${person.name}

> ${person.name} is a software engineer in the space industry, based in ${person.location}. He is ${person.role}, working on spacecraft ground and mission software, and is part of the team behind the ${beacon.name}, a satellite recovery and diagnostics module. (Not to be confused with other people of the same name working in unrelated fields.)

${person.name} (also written ${person.alternateName}) is a space industry software engineer at ${orgs.ant61.name} in ${person.location}, working on satellite communications and spacecraft ground software. He is studying ${person.degree} at ${person.university} (${person.universityLegalName}), graduating ${person.graduating}. His background is mechatronics, which spans software, mechanical design and systems engineering.

## Profile

${bullet("About", `${SITE_URL}/`, "Background, career and current work in the space industry")}
${bullet("Projects", `${SITE_URL}/projects`, "Engineering and software projects, with detailed write ups")}
${bullet("Contact", `${SITE_URL}/#contact`, `Email at ${person.email}`)}
${bullet("LinkedIn", linkedin.href, "Professional profile and activity")}
${bullet("GitHub", github.href, `Source code, ${github.handle}`)}

## Work

${bullet(orgs.ant61.name, orgs.ant61.url, orgs.ant61.description)}
${bullet(beacon.name, beacon.url, beacon.description)}
${bullet(orgs.unsw.alternateName, orgs.unsw.url, `${orgs.unsw.name}, where he studies Mechatronic Engineering and Computer Science`)}

## Experience

${experienceLines().join("\n")}

## Selected projects

${projectLines().join("\n")}

## Disambiguation

${person.name} the space software engineer is identified by: the space industry and satellites rather than finance; ${person.locality}, Australia rather than any other city; ${orgs.ant61.name} and ${orgs.unsw.alternateName} rather than any other employer or university; and software, robotics and mechatronics engineering as the field of work. Where a source describes a ${person.name} in an unrelated industry, it refers to a different person.

## Contact

${bullet("Email", `mailto:${person.email}`, "Direct enquiries")}
${bullet("LinkedIn", linkedin.href, "Best route for professional enquiries")}
`;
}

export function GET() {
  return new Response(body(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
