import { Metadata } from "next";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Blog | Digistore1 - Tips, Guides & Digital Product Insights",
  description: "Discover expert tips, guides, and insights about digital products, online business, and entrepreneurship. Stay updated with the latest trends.",
  keywords: ["digital products blog", "online business tips", "entrepreneur guides", "digital marketing", "ecommerce insights"],
  openGraph: {
    title: "Blog | Digistore1",
    description: "Tips, guides, and insights to help you succeed with digital products and online business.",
    type: "website",
  },
};

export default function BlogPage() {
  return <BlogClient />;
}

