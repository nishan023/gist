import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { isDemo } from "@/lib/github";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", ...(isDemo ? { disallow: "/" } : { allow: "/" }) },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
