import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://forge.app";
  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/free-reading`, lastModified: new Date() },
    { url: `${base}/app`, lastModified: new Date() },
    { url: `${base}/app/train`, lastModified: new Date() },
    { url: `${base}/app/nutrition`, lastModified: new Date() },
    { url: `${base}/app/records`, lastModified: new Date() },
    { url: `${base}/app/body`, lastModified: new Date() },
  ];
}
