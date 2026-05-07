import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { getVisibleSystems } from "@/data/systems";
import { getVisibleProjects } from "@/data/projects";
import { getVisibleNotes } from "@/data/notes";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/resume`, lastModified, changeFrequency: "monthly", priority: 0.7 },
  ];

  const systems = getVisibleSystems().map((s) => ({
    url: `${base}/systems/${s.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const projects = getVisibleProjects().map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const notes = getVisibleNotes().map((n) => ({
    url: `${base}/notes/${n.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...systems, ...projects, ...notes];
}
