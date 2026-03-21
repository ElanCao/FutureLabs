import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://futurelabs.vip";

  return {
    rules: [
      {
        userAgent: ["Googlebot", "Twitterbot", "facebookexternalhit"],
        allow: ["/profile/", "/explore"],
        disallow: ["/dashboard", "/onboarding", "/api/"],
      },
      {
        userAgent: "*",
        allow: ["/profile/", "/explore"],
        disallow: ["/dashboard", "/onboarding", "/api/"],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
