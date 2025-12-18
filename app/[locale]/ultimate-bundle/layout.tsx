import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ultimate Digital Business Starter Mega Bundle | Digistore1",
  description: "Everything you need to start & scale a digital business. Massive eBook libraries, Canva templates, AI prompts, marketing funnels & more. One-time payment, lifetime access.",
  keywords: ["digital products", "mega bundle", "PLR", "ebook bundle", "canva templates", "digital business", "online business starter kit"],
  openGraph: {
    title: "Ultimate Digital Business Starter Mega Bundle",
    description: "Launch faster, sell smarter, and build digital income using proven resources — all in one bundle.",
    type: "website",
  },
};

export default function UltimateBundleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout removes the default header/footer for a clean landing page experience
  return (
    <div className="ultimate-bundle-landing">
      {children}
    </div>
  );
}

