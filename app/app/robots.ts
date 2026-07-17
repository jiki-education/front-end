import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { isStaging } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  // Staging shares the production domain and API but must never be crawled or
  // indexed, so block everything and omit the sitemap.
  if (isStaging()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/"
      }
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: `${SITE_URL}/sitemap.xml`
  };
}
