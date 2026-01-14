import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://vibe-architect.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/auth/callback", "/profile/edit"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
