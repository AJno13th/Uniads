import { MetadataRoute } from "next";
import { siteConfig, services, courseTypes } from "@/data/site";
import { universities } from "@/data/universities";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.domain;
  const now = new Date();

  const entries: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/about", priority: 0.9, changeFrequency: "monthly" },
    { path: "/services", priority: 0.85, changeFrequency: "monthly" },
    { path: "/courses", priority: 0.85, changeFrequency: "weekly" },
    { path: "/apply", priority: 0.8, changeFrequency: "monthly" },
    { path: "/book", priority: 0.8, changeFrequency: "monthly" },
    { path: "/study-without-qualifications", priority: 0.75, changeFrequency: "monthly" },
    { path: "/privacy-policy", priority: 0.3, changeFrequency: "monthly" },
    ...services.map((s) => ({
      path: s.href,
      priority: 0.75,
      changeFrequency: "monthly" as const,
    })),
    ...courseTypes.map((c) => ({
      path: c.href,
      priority: 0.8,
      changeFrequency: "weekly" as const,
    })),
    ...universities.map((u) => ({
      path: `/courses/${u.slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
  ];

  return entries.map(({ path, priority, changeFrequency }) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
