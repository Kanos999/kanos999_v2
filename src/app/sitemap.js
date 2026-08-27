import { SITE_URL } from "@/lib/schema";
import { detailedProjects } from "@/data/projects";

/**
 * Emitted as /sitemap.xml at build time. Submit it in Search Console.
 *
 * Only routes that actually exist go in here. Contact is a section of the home
 * page (/#contact), not a page, so it is deliberately absent: a sitemap entry
 * that 404s costs trust in the whole file.
 */
export default function sitemap() {
  const lastModified = new Date();

  return [
    {
      // Trailing slash, to match the canonical URL declared in the metadata.
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...detailedProjects().map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    })),
  ];
}
