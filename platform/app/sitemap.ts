import { MetadataRoute } from "next";
import { SEED_PROFILES } from "@/lib/seed-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://futurelabs.vip";

  const publicProfiles = SEED_PROFILES.filter((p) => p.privacy === "public");

  const profileEntries: MetadataRoute.Sitemap = publicProfiles.map((p) => ({
    url: `${appUrl}/profile/${p.username}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: appUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${appUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...profileEntries,
  ];
}
