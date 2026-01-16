import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const baseUrl = "https://vibe-architect.vercel.app";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/prompts`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/submit/tool`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/submit/prompt`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // Dynamic tool pages (if you have individual tool pages)
  const { data: tools } = await supabase
    .from("tools")
    .select("id, updated_at")
    .order("updated_at", { ascending: false });

  const toolPages: MetadataRoute.Sitemap =
    tools?.map((tool) => ({
      url: `${baseUrl}/tools/${tool.id}`,
      lastModified: new Date(tool.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })) ?? [];

  // Dynamic prompt pages (if you have individual prompt pages)
  const { data: prompts } = await supabase
    .from("prompts")
    .select("id, updated_at")
    .order("updated_at", { ascending: false });

  const promptPages: MetadataRoute.Sitemap =
    prompts?.map((prompt) => ({
      url: `${baseUrl}/prompts/${prompt.id}`,
      lastModified: new Date(prompt.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })) ?? [];

  return [...staticPages, ...toolPages, ...promptPages];
}
