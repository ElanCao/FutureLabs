import type { MetadataRoute } from "next";

const SITE_URL = "https://futurelabs.vip";

// Live blog posts — keep in sync with app/blog/page.tsx and the corresponding
// app/blog/[slug]/page.tsx files. lastModified is ISO date of publication.
const blogPosts: { slug: string; lastModified: string }[] = [
  { slug: "open-skilltree-schema", lastModified: "2026-04-15" },
  { slug: "building-skill-taxonomy", lastModified: "2026-04-08" },
  { slug: "collaborative-future", lastModified: "2026-03-25" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/product`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/research`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.lastModified,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}
