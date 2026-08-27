/**
 * Site content. Everything you'd routinely edit lives here rather than in JSX.
 */

export const person = {
  name: "Kane Jackson",
  role: "Mission Software Lead at ANT61",
  discipline: "Mechatronics / Computer Science",
  location: "Sydney, Australia",
  locality: "Sydney",
  region: "NSW",
  country: "AU",
  email: "hello@kanejackson.com",
  university: "UNSW Sydney",
  universityLegalName: "University of New South Wales",
  degree: "B.E. (Hons) Mechatronic Engineering and B.Sc. Computer Science",
  graduating: "Dec 2026",
  // Drop the PDF at /public/kane-jackson-cv.pdf for this link to resolve.
  cv: "/kane-jackson-cv.pdf",

  /* Entity disambiguation ------------------------------------------------
   * There is a better known Kane Jackson in Australian fintech. The aim is
   * not to outrank him for the bare name, it is to be unmistakably a
   * different person: space rather than finance, Sydney rather than
   * Melbourne, ANT61 and UNSW rather than his employer and school.
   *
   * `alternateName` gives the name a second surface form to match on, and
   * `descriptor` is the qualifier that rides along with the name in titles
   * so the two entities never have to be told apart from context alone.
   */
  alternateName: "Kane H. Jackson",
  descriptor: "Space Software Engineer",
};

/**
 * Organisations Kane is linked to, kept here so the same URLs are used as
 * structured data `@id`s, as llms.txt links, and as visible page copy. A
 * consistent URL is what lets a search engine merge these into one entity
 * rather than treating each mention as a new unknown.
 */
export const orgs = {
  ant61: {
    name: "ANT61",
    url: "https://www.ant61.com/",
    description: "Space robotics company building satellite recovery and diagnostics hardware.",
  },
  innersteps: {
    name: "InnerSteps",
    url: "https://www.innersteps.org/",
    // Engineering credential only. Their clinical and marketing claims are
    // theirs to make, not ours to repeat.
    description: "Australian developer of a children's mobile application.",
  },
  unsw: {
    name: "University of New South Wales",
    alternateName: "UNSW Sydney",
    url: "https://www.unsw.edu.au/",
  },
};

/** The ANT61 product Kane works on. The strongest single name+work signal. */
export const beacon = {
  name: "ANT61 Beacon",
  url: "https://www.ant61.com/beacon",
  description:
    "A satellite recovery and diagnostics module providing independent two way inter satellite communication, real time spacecraft telemetry and anomaly detection, and remote recovery when a spacecraft's primary systems fail.",
};

export const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/kanehjackson/", handle: "kanehjackson" },
  { label: "GitHub", href: "https://github.com/Kanos999", handle: "Kanos999" },
  { label: "Instagram", href: "https://www.instagram.com/kane.json/", handle: "kane.json" },
];

/**
 * Career. `period` is optional: leave it blank and the timeline drops the
 * column cleanly rather than showing a placeholder.
 */
export const career = [
  {
    period: "Sep 2024 – Present",
    position: "Mission Software Lead",
    company: "ANT61",
    discipline: "Software / Mechanical",
    description: [
      "Lead the mission (ground) software team, owning project planning and delivery across the mission software stack.",
      "Define system architecture and drive integration level implementation and testing for spaceflight operations.",
      "Designed mechanical fixtures for spaceflight hardware testing, and ran thermal vacuum and vibration campaigns aligned with SpaceX qualification standards.",
      "Analysed the structural integrity and reliability of flight enclosures.",
    ],
  },
  {
    period: "Sep 2023 – Dec 2024",
    position: "Lead Software Engineer",
    company: "InnerSteps",
    discipline: "Software",
    description: [
      "Led a team of 3 to 4 engineers designing and building a full stack web and mobile application.",
      "Built responsive front end components in React.js, React Native, Tailwind and MUI.",
      "Developed and optimised the AWS hosted backend on Node.js, MongoDB and WebSockets.",
      "Implemented authentication with Google and Facebook login integrations.",
      "Integrated OpenAI GPT-3.5 and Google Gemini Pro 1.5 for AI driven content generation, cutting manual data processing by 80%.",
    ],
  },
  {
    period: "Oct 2022 – Sep 2024",
    position: "Software Engineer, CAD Specialist",
    company: "Gaming Entertainment Systems",
    discipline: "Software / Mechanical",
    description: [
      "Developed interactive web applications in HTML, CSS and JavaScript, integrating REST APIs for real time data display.",
      "Created 3D CAD models to enhance digital product presentations.",
    ],
  },
];

export const nav = [
  { label: "About", href: "/#about" },
  { label: "Career", href: "/#career" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/#contact" },
];
