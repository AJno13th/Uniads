import { MetadataRoute } from "next";
import { siteConfig, services, courseTypes } from "@/data/site";
import { universities } from "@/data/universities";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.domain;
  const now = new Date();

  const staticRoutes = [
    "",
    "/services",
    "/courses",
    "/about",
    "/apply",
    "/book",
    "/privacy-policy",
    ...services.map((s) => s.href),
    ...courseTypes.map((c) => c.href),
    ...universities.map((u) => `/courses/${u.slug}`),
  ];

  return staticRoutes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.includes("courses") || path.includes("services") ? 0.8 : 0.6,
  }));
}
