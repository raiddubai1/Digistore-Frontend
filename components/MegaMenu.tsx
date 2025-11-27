"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, TrendingUp, Sparkles, Clock, Tag, Home, Briefcase, Code, Heart, Palette, DollarSign, ArrowRight, Flame, Zap, ShoppingBag } from "lucide-react";

const categories = [
  {
    id: "business",
    name: "Business and Marketing",
    icon: Briefcase,
    subcategories: [
      { name: "Digital Marketing", count: 234 },
      { name: "Social Media Marketing", count: 189 },
      { name: "Email Marketing", count: 156 },
      { name: "SEO & SEM", count: 142 },
      { name: "Content Marketing", count: 128 },
      { name: "Affiliate Marketing", count: 98 },
      { name: "E-commerce", count: 176 },
      { name: "Business Strategy", count: 145 },
    ],
  },
  {
    id: "personal",
    name: "Personal Development",
    icon: Sparkles,
    subcategories: [
      { name: "Productivity", count: 167 },
      { name: "Time Management", count: 134 },
      { name: "Goal Setting", count: 112 },
      { name: "Mindfulness", count: 98 },
      { name: "Self-Improvement", count: 203 },
      { name: "Leadership", count: 145 },
      { name: "Communication Skills", count: 156 },
      { name: "Motivation", count: 189 },
    ],
  },
  {
    id: "technology",
    name: "Technology",
    icon: Code,
    subcategories: [
      { name: "Programming", count: 312 },
      { name: "Web Development", count: 289 },
      { name: "Mobile Apps", count: 178 },
      { name: "Data Science", count: 156 },
      { name: "AI & Machine Learning", count: 134 },
      { name: "Cybersecurity", count: 98 },
      { name: "Cloud Computing", count: 112 },
      { name: "DevOps", count: 87 },
    ],
  },
  {
    id: "health",
    name: "Health and Fitness",
    icon: Heart,
    subcategories: [
      { name: "Workout Plans", count: 198 },
      { name: "Nutrition Guides", count: 167 },
      { name: "Weight Loss", count: 234 },
      { name: "Yoga & Meditation", count: 145 },
      { name: "Mental Health", count: 178 },
      { name: "Healthy Recipes", count: 203 },
      { name: "Fitness Tracking", count: 123 },
      { name: "Wellness", count: 156 },
    ],
  },
  {
    id: "creative",
    name: "Creative Arts",
    icon: Palette,
    subcategories: [
      { name: "Graphic Design", count: 245 },
      { name: "Photography", count: 198 },
      { name: "Video Editing", count: 167 },
      { name: "Music Production", count: 134 },
      { name: "Writing & Blogging", count: 289 },
      { name: "Illustration", count: 156 },
      { name: "UI/UX Design", count: 178 },
      { name: "Animation", count: 112 },
    ],
  },
  {
    id: "finance",
    name: "Finance and Investing",
    icon: DollarSign,
    subcategories: [
      { name: "Stock Trading", count: 178 },
      { name: "Cryptocurrency", count: 156 },
      { name: "Personal Finance", count: 234 },
      { name: "Real Estate", count: 145 },
      { name: "Budgeting", count: 198 },
      { name: "Retirement Planning", count: 123 },
      { name: "Tax Planning", count: 98 },
      { name: "Wealth Building", count: 167 },
    ],
  },
];

const featuredSections = [
  {
    title: "Trending Now",
    icon: Flame,
    items: [
      "AI Prompt Engineering",
      "ChatGPT Mastery",
      "Passive Income 2024",
      "TikTok Marketing",
    ],
  },
  {
    title: "New Arrivals",
    icon: Zap,
    items: [
      "Instagram Reels Guide",
      "Notion Templates",
      "Canva Pro Designs",
      "Email Sequences",
    ],
  },
  {
    title: "Deals",
    icon: Tag,
    items: [
      "50% Off Bundles",
      "Black Friday Deals",
      "Seasonal Templates",
      "Holiday Specials",
    ],
  },
];

export default function MegaMenu() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [clickedLink, setClickedLink] = useState<string | null>(null);

  const handleMouseEnter = () => {
    setIsOpen(true);
    if (!activeCategory) {
      setActiveCategory(categories[0].id); // Set first category as default
    }
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
    setActiveCategory(null);
  };

  const handleLinkClick = (linkId: string) => {
    setClickedLink(linkId);
    setTimeout(() => setClickedLink(null), 200);
  };

  return (
    <div className="sticky top-20 z-30 bg-white border-b border-gray-200 hidden lg:block">
      {/* Main Navigation Bar */}
      <nav className="bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-14">
            {/* Categories Dropdown */}
            <div className="flex items-center gap-6">
              <button
                onMouseEnter={handleMouseEnter}
                onClick={() => setIsOpen(!isOpen)}
                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <span className="text-lg">☰</span>
                <span>All Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Quick Links */}
              <div className="hidden lg:flex items-center gap-6">
                <Link
                  href={`/${locale}`}
                  onClick={() => handleLinkClick('home')}
                  className={`text-sm font-medium text-gray-700 hover:text-primary transition-all flex items-center gap-1 ${
                    clickedLink === 'home' ? 'scale-95' : ''
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Home
                </Link>
                <Link
                  href={`/${locale}/products`}
                  onClick={() => handleLinkClick('shop')}
                  className={`text-sm font-medium text-gray-700 hover:text-primary transition-all flex items-center gap-1 ${
                    clickedLink === 'shop' ? 'scale-95' : ''
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Shop
                </Link>
                <Link
                  href={`/${locale}/products?filter=trending`}
                  onClick={() => handleLinkClick('trending')}
                  className={`text-sm font-medium text-gray-700 hover:text-primary transition-all flex items-center gap-1 ${
                    clickedLink === 'trending' ? 'scale-95' : ''
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  Trending
                </Link>
                <Link
                  href={`/${locale}/products?filter=new`}
                  onClick={() => handleLinkClick('new')}
                  className={`text-sm font-medium text-gray-700 hover:text-primary transition-all flex items-center gap-1 ${
                    clickedLink === 'new' ? 'scale-95' : ''
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  New Arrivals
                </Link>
                <Link
                  href={`/${locale}/products?filter=bestsellers`}
                  onClick={() => handleLinkClick('bestsellers')}
                  className={`text-sm font-medium text-gray-700 hover:text-primary transition-all flex items-center gap-1 ${
                    clickedLink === 'bestsellers' ? 'scale-95' : ''
                  }`}
                >
                  <Tag className="w-4 h-4" />
                  Best Sellers
                </Link>
                <Link
                  href={`/${locale}/products?filter=deals`}
                  onClick={() => handleLinkClick('deals')}
                  className={`text-sm font-medium text-red-600 hover:text-red-700 transition-all flex items-center gap-1 ${
                    clickedLink === 'deals' ? 'scale-95' : ''
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Deals
                </Link>
              </div>
            </div>

            {/* Right Side - Promo */}
            <div className="hidden md:block">
              <div className="text-sm">
                <span className="text-gray-600">🎉 </span>
                <span className="font-semibold text-primary">50% OFF</span>
                <span className="text-gray-600"> on selected items!</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mega Menu Dropdown */}
      {isOpen && (
        <div
          className="absolute left-0 right-0 top-full bg-white shadow-2xl z-40 border-t border-gray-200"
          onMouseLeave={handleMouseLeave}
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 -z-10"
            onClick={handleMouseLeave}
          />

          {/* Mega Menu Content */}
          <div className="relative bg-white">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
              <div className="grid grid-cols-12 gap-8">
                {/* Left Sidebar - Categories */}
                <div className="col-span-3 border-r border-gray-200 pr-6">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Browse by Category
                  </h3>
                  <div className="space-y-1">
                    {categories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <button
                          key={category.id}
                          onMouseEnter={() => setActiveCategory(category.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all group ${
                            activeCategory === category.id
                              ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-semibold shadow-sm"
                              : "hover:bg-[#F7F7F7] text-gray-700 hover:text-gray-900"
                          }`}
                        >
                          <IconComponent
                            className={`w-5 h-5 ${activeCategory === category.id ? 'text-primary' : 'text-[#0A3D62]'}`}
                            strokeWidth={1.5}
                            style={{ opacity: activeCategory === category.id ? 1 : 0.8 }}
                          />
                          <span className="text-sm flex-1">{category.name}</span>
                          <ArrowRight className={`w-4 h-4 transition-transform ${activeCategory === category.id ? 'text-primary translate-x-0.5' : 'text-gray-400 group-hover:translate-x-0.5'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Subtle Divider */}
                <div className="w-px bg-gray-200/50"></div>

                {/* Middle - Subcategories */}
                <div className="col-span-6">
                  {activeCategory ? (
                    <>
                      <h3 className="text-lg font-bold mb-4 text-gray-900">
                        {categories.find((c) => c.id === activeCategory)?.name}
                      </h3>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                        {categories
                          .find((c) => c.id === activeCategory)
                          ?.subcategories.map((sub) => (
                            <Link
                              key={sub.name}
                              href={`/${locale}/products?category=${activeCategory}&subcategory=${sub.name}`}
                              className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#F7F7F7] transition-all group"
                            >
                              <span className="text-sm text-gray-700 group-hover:text-gray-900 group-hover:font-medium transition-all">
                                {sub.name}
                              </span>
                              <span className="text-xs text-gray-400 opacity-50 group-hover:opacity-70">
                                {sub.count}
                              </span>
                            </Link>
                          ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <div className="text-4xl mb-2">👈</div>
                        <p className="text-sm">Hover over a category to see subcategories</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Subtle Divider */}
                <div className="w-px bg-gray-200/50"></div>

                {/* Right Sidebar - Featured */}
                <div className="col-span-3 space-y-10">
                  {featuredSections.map((section) => {
                    const SectionIcon = section.icon;
                    return (
                      <div key={section.title} className="py-2">
                        <h3 className="flex items-center gap-2 text-sm font-semibold mb-2 pb-2 border-b border-[#ECECEC]" style={{ color: '#0A3D62', fontWeight: 600 }}>
                          <SectionIcon className="w-4 h-4" strokeWidth={1.5} style={{ color: '#0A3D62', opacity: 0.8 }} />
                          {section.title}
                        </h3>
                        <ul className="space-y-1 mt-3" style={{ lineHeight: 1.6 }}>
                          {section.items.map((item) => (
                            <li key={item}>
                              <Link
                                href={`/${locale}/products?search=${item}`}
                                className="text-sm text-gray-700 transition-all duration-[250ms] ease-in-out block px-3 py-2 rounded-lg hover:bg-[#F7F7F7] group flex items-center justify-between"
                              >
                                <span>{item}</span>
                                <ArrowRight
                                  className="w-3.5 h-3.5 text-gray-400 arrow-hover transition-opacity duration-[250ms] ease-in-out"
                                  style={{ opacity: 0.4 }}
                                  strokeWidth={1.5}
                                />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

