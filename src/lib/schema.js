/**
 * JSON-LD structured data.
 *
 * This is how search engines are told who Kane is as an *entity* rather than
 * as a page of words: the job title, the employer, the university, the
 * verified profiles elsewhere, and the subjects he works in. For a query like
 * "Kane Jackson" that entity signal is what separates one person from every
 * other person with the same name.
 *
 * `sameAs` is the important one. It is the claim "this site and these profiles
 * are the same person", and it only pays off if those profiles link back here.
 */

import { person, socials } from "@/data/site";
import { allSkills } from "@/data/skills";
import { projects, projectHref } from "@/data/projects";

export const SITE_URL = "https://kanejackson.com";
const PERSON_ID = `${SITE_URL}/#kane-jackson`;

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: person.name,
    givenName: "Kane",
    familyName: "Jackson",
    url: SITE_URL,
    image: `${SITE_URL}/og.png`,
    email: `mailto:${person.email}`,
    jobTitle: "Mission Software Lead",
    description:
      "Kane Jackson is a space industry engineer in Sydney, Australia, working on mission and ground software at ANT61, with a mechatronics background spanning software, mechanical and systems engineering.",
    worksFor: {
      "@type": "Organization",
      name: "ANT61",
      description: "Space robotics company",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: person.university,
      url: "https://www.unsw.edu.au",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: person.locality,
      addressRegion: person.region,
      addressCountry: person.country,
    },
    nationality: { "@type": "Country", name: "Australia" },
    // Machine readable skills. Kept out of the visible page on purpose.
    knowsAbout: allSkills,
    hasOccupation: {
      "@type": "Occupation",
      name: "Mission Software Lead",
      occupationalCategory: "Software and mechatronics engineering",
      skills: allSkills.join(", "),
    },
    sameAs: socials.map((s) => s.href),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: `${person.name}, engineering portfolio`,
    inLanguage: "en-AU",
    publisher: { "@id": PERSON_ID },
  };
}

export function profilePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/#profilepage`,
    url: SITE_URL,
    name: `${person.name}, ${person.role}`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": PERSON_ID },
    mainEntity: { "@id": PERSON_ID },
  };
}

export function projectsSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/projects#collection`,
    url: `${SITE_URL}/projects`,
    name: `Projects by ${person.name}`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": PERSON_ID },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Projects", item: `${SITE_URL}/projects` },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: projects.length,
      itemListElement: projects.map((project, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: creativeWork(project),
      })),
    },
  };
}

/** One project as a CreativeWork. Shared by the index listing and its own page. */
function creativeWork(project) {
  const href = projectHref(project);
  const image = project.media?.poster || project.detail?.figures?.[0]?.poster;

  return {
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    creator: { "@id": PERSON_ID },
    keywords: [...(project.stack || []), ...(project.disciplines || [])].join(", "),
    ...(project.year ? { dateCreated: project.year } : {}),
    ...(href ? { url: /^https?:\/\//.test(href) ? href : `${SITE_URL}${href}` } : {}),
    ...(image ? { image: `${SITE_URL}${image}` } : {}),
  };
}

/**
 * A project's own page. The breadcrumb is the part that pays: it tells search
 * engines these pages hang off /projects rather than floating loose.
 */
export function projectSchema(project) {
  const url = `${SITE_URL}/projects/${project.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#page`,
    url,
    name: `${project.title}, ${person.name}`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": PERSON_ID },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Projects", item: `${SITE_URL}/projects` },
        { "@type": "ListItem", position: 3, name: project.title, item: url },
      ],
    },
    mainEntity: {
      ...creativeWork(project),
      "@id": `${url}#project`,
      ...(project.detail?.documents?.length
        ? {
            associatedMedia: project.detail.documents.map((doc) => ({
              "@type": "DigitalDocument",
              name: doc.title,
              url: `${SITE_URL}${doc.href}`,
              encodingFormat: "application/pdf",
            })),
          }
        : {}),
    },
  };
}

/** Renders one or more schema objects into a single script tag. */
export function JsonLd({ schemas }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemas.length === 1 ? schemas[0] : schemas),
      }}
    />
  );
}
