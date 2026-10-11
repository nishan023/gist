import type { MetadataRoute } from "next";
import { getGists, isDemo } from "@/lib/github";
import { site } from "@/lib/site";
export const revalidate = 300;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (isDemo) return [];
  const gists = await getGists();
  return [
    { url: site.url, changeFrequency: "daily", priority: 1 },
    ...gists.map((gist) => ({
      url: `${site.url}/gist/${gist.id}`,
      lastModified: gist.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
