/**
 * JSON-LD structured data.
 *
 * This is how search engines are told who Kane is as an *entity* rather than
 * as a page of words: the job title, the employer, the university, the
 * verified profiles elsewhere, and the subjects he works in.
 *
 * The nodes are emitted as one `@graph` with stable `@id`s that point at each
 * other. That matters more than any single node. A loose Person with a string
 * employer is a claim about words; a Person whose `worksFor` resolves to an
 * Organization node carrying ANT61's real URL, which in turn publishes a
 * SoftwareApplication that names the same Person as a contributor, is a small
 * connected graph. Search engines and language models reconcile that against
 * what they already know about ANT61 and land on one specific person.
 *
 * That is the whole disambiguation strategy. There is a better known Kane
 * Jackson in Australian fintech, and the goal is not to outrank him for the
 * bare name but to make the two impossible to merge: space and Sydney and
 * ANT61 and UNSW, stated the same way every time, in every machine readable
 * surface. `disambiguatingDescription` is schema.org's sanctioned field for
 * exactly this, and is deliberately neutral. It never names anyone else.
 *
 * `sameAs` is the other load bearing part. It is the claim "this site and
 * these profiles are the same person", and it only pays off if those profiles
 * link back here.
 */

import { person, socials, orgs, beacon } from "@/data/site";
import { allSkills } from "@/data/skills";
import { projects, projectHref } from "@/data/projects";

export const SITE_URL = "https://kanejackson.com";

/**
 * Stable node identifiers. An `@id` is a name for a thing, not a page you can
 * visit, so these stay fixed even if the URLs behind them move. Anything that
 * refers to a node refers to it by one of these.
 */
export const ID = {
  person: `${SITE_URL}/#kane`,
  website: `${SITE_URL}/#website`,
  ant61: `${orgs.ant61.url.replace(/\/$/, "")}/#org`,
  innersteps: `${orgs.innersteps.url.replace(/\/$/, "")}/#org`,
  unsw: `${orgs.unsw.url.replace(/\/$/, "")}/#org`,
  beacon: `${beacon.url}#app`,
};

const PERSON_ID = ID.person;

/**
 * Subject matter, most disambiguating first. These are the terms that should
 * co-occur with the name: space, satellites, Sydney, mechatronics. The flat
 * skills list follows and carries the long tail.
 */
const KNOWS_ABOUT = [
  "Space systems engineering",
  "Satellite communications",
  "Spacecraft ground software",
  "Spacecraft telemetry",
  "Mission software",
  "Embedded systems",
  "Robotics",
  "Mechatronics",
  "Software engineering",
  ...allSkills,
];
// Same term can arrive from both lists; emit each once.
const knowsAbout = [...new Set(KNOWS_ABOUT)];

/* ── Entity nodes ────────────────────────────────────────────────────────
 * Each returns a bare node (no @context). `identityGraph()` wraps them.
 */

function ant61Node() {
  return {
    "@type": "Organization",
    "@id": ID.ant61,
    name: orgs.ant61.name,
    url: orgs.ant61.url,
    description: orgs.ant61.description,
    industry: "Space technology",
  };
}

function innerstepsNode() {
  return {
    "@type": "Organization",
    "@id": ID.innersteps,
    name: orgs.innersteps.name,
    url: orgs.innersteps.url,
    description: orgs.innersteps.description,
  };
}

function unswNode() {
  return {
    "@type": "CollegeOrUniversity",
    "@id": ID.unsw,
    name: orgs.unsw.name,
    alternateName: orgs.unsw.alternateName,
    url: orgs.unsw.url,
  };
}

/**
 * The Beacon. `contributor` pointing back at the Person is the reciprocal
 * half of the Person's `hasOccupation`, and is the single strongest unique
 * signal on the site: nobody else of this name is attached to this product.
 */
function beaconNode() {
  return {
    "@type": "SoftwareApplication",
    "@id": ID.beacon,
    name: beacon.name,
    url: beacon.url,
    applicationCategory: "Satellite recovery and diagnostics module",
    operatingSystem: "Embedded",
    description: beacon.description,
    contributor: { "@id": PERSON_ID },
    publisher: { "@id": ID.ant61 },
  };
}

export function personSchema() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: person.name,
    alternateName: person.alternateName,
    givenName: "Kane",
    familyName: "Jackson",
    url: `${SITE_URL}/`,
    image: `${SITE_URL}/og.png`,
    email: `mailto:${person.email}`,
    jobTitle: "Mission Software Lead",
    description:
      "Kane Jackson is a space industry software engineer in Sydney, Australia. He is Mission Software Lead at ANT61, working on spacecraft ground and mission software behind the ANT61 Beacon satellite recovery module, with a mechatronics background spanning software, mechanical and systems engineering.",
    // Neutral, factual, and names no one else. Its only job is to stop this
    // person being merged with a same named person in an unrelated field.
    disambiguatingDescription:
      "Software engineer in the space industry, based in Sydney, Australia, and working at ANT61 on satellite software. Not the same person as others of the same name working in unrelated fields.",
    homeLocation: {
      "@type": "Place",
      name: person.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: person.locality,
        addressRegion: person.region,
        addressCountry: person.country,
      },
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: person.locality,
      addressRegion: person.region,
      addressCountry: person.country,
    },
    workLocation: {
      "@type": "Place",
      name: person.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: person.locality,
        addressRegion: person.region,
        addressCountry: person.country,
      },
    },
    nationality: { "@type": "Country", name: "Australia" },
    worksFor: { "@id": ID.ant61 },
    alumniOf: { "@id": ID.unsw },
    // Everything he is attached to, current or past. Past employment has no
    // dedicated property, and `affiliation` is the honest way to say it.
    affiliation: [{ "@id": ID.ant61 }, { "@id": ID.innersteps }, { "@id": ID.unsw }],
    hasOccupation: [
      {
        "@type": "Occupation",
        name: "Mission Software Lead",
        occupationalCategory: "Software and mechatronics engineering",
        occupationLocation: {
          "@type": "City",
          name: person.locality,
          address: {
            "@type": "PostalAddress",
            addressLocality: person.locality,
            addressRegion: person.region,
            addressCountry: person.country,
          },
        },
        description:
          "Leads the mission and ground software team at ANT61, owning architecture, delivery and integration testing for spaceflight operations, including work on the ANT61 Beacon.",
        skills: allSkills.join(", "),
      },
      {
        "@type": "Occupation",
        name: "Lead Software Engineer",
        occupationalCategory: "Software engineering",
        description:
          "Led the software development of a children's mobile application at InnerSteps, from concept through to a released MVP.",
      },
    ],
    /* Machine readable skills, kept out of the visible page on purpose.
     * The Beacon node is referenced by `@id` rather than named as a string, so
     * the Person <-> product link runs in both directions instead of only from
     * the product back to him. */
    knowsAbout: [{ "@id": ID.beacon }, ...knowsAbout],
    sameAs: socials.map((s) => s.href),
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": ID.website,
    url: `${SITE_URL}/`,
    name: `${person.name}, engineering portfolio`,
    alternateName: `${person.name}, ${person.descriptor}`,
    inLanguage: "en-AU",
    publisher: { "@id": PERSON_ID },
    about: { "@id": PERSON_ID },
  };
}

export function profilePageSchema() {
  return {
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/#profilepage`,
    url: `${SITE_URL}/`,
    name: `${person.name}, ${person.descriptor} in ${person.locality}`,
    description:
      "Portfolio of Kane Jackson, a space industry software engineer in Sydney and Mission Software Lead at ANT61.",
    isPartOf: { "@id": ID.website },
    about: { "@id": PERSON_ID },
    mainEntity: { "@id": PERSON_ID },
  };
}

export function projectsSchema() {
  return {
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/projects#collection`,
    url: `${SITE_URL}/projects`,
    name: `Projects by ${person.name}`,
    isPartOf: { "@id": ID.website },
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
    "@type": "WebPage",
    "@id": `${url}#page`,
    url,
    name: `${project.title}, ${person.name}`,
    isPartOf: { "@id": ID.website },
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

/**
 * The identity graph, emitted on every page.
 *
 * Repeating it site wide is deliberate. A crawler that only ever fetches one
 * project page still comes away with the full entity, and the nodes dedupe by
 * `@id` rather than piling up.
 */
export function identityGraph() {
  return [
    personSchema(),
    websiteSchema(),
    ant61Node(),
    innerstepsNode(),
    unswNode(),
    beaconNode(),
  ];
}

/**
 * Renders schema nodes as one `@graph` in a single script tag.
 *
 * A page ends up with two of these: the identity graph from the layout, and
 * its own page node. That is fine, because the page node refers to the
 * identity nodes by `@id` and search engines reconcile `@id`s across every
 * block on the page. The grouping is what matters, not the tag count: nodes
 * that name each other resolve into one connected shape rather than a handful
 * of unrelated claims.
 */
export function JsonLd({ schemas }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": schemas.flat(),
        }),
      }}
    />
  );
}
