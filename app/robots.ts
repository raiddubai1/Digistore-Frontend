import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://digistore1.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/account/",
          "/checkout/",
          "/cart/",
          "/_next/",
          "/unauthorized/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

