import { SITE_URL } from "@/lib/schema";
import { detailedProjects } from "@/data/projects";

/** Emitted as /sitemap.xml at build time. Submit it in Search Console. */
export default function sitemap() {
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
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
