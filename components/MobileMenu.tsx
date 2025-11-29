"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ChevronDown, ChevronRight, Briefcase, Sparkles, Code, Heart, Palette, DollarSign, Flame, Zap, Tag, Globe, Check, LucideIcon, Home, Search, Gift, Package, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/useCategories";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Icon mapping for categories
const iconMap: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  sparkles: Sparkles,
  code: Code,
  heart: Heart,
  palette: Palette,
  'dollar-sign': DollarSign,
  user: Sparkles,
  'paw-print': Heart,
  home: Home,
};

const demoCategories = [
  {
    id: "business",
    name: "Business and Marketing",
    icon: Briefcase,
    subcategories: [
      { name: "Digital Marketing", count: 234 },
      { name: "Social Media", count: 189 },
      { name: "Email Marketing", count: 156 },
      { name: "SEO & SEM", count: 145 },
      { name: "Content Marketing", count: 167 },
      { name: "Affiliate Marketing", count: 123 },
      { name: "Sales Funnels", count: 198 },
      { name: "Copywriting", count: 176 },
    ],
  },
  {
    id: "personal",
    name: "Personal Development",
    icon: Sparkles,
    subcategories: [
      { name: "Productivity", count: 201 },
      { name: "Time Management", count: 178 },
      { name: "Goal Setting", count: 156 },
      { name: "Mindfulness", count: 134 },
      { name: "Leadership", count: 189 },
      { name: "Communication", count: 167 },
      { name: "Confidence", count: 145 },
      { name: "Habits", count: 198 },
    ],
  },
  {
    id: "technology",
    name: "Technology",
    icon: Code,
    subcategories: [
      { name: "Web Development", count: 267 },
      { name: "Mobile Apps", count: 198 },
      { name: "AI & Machine Learning", count: 234 },
      { name: "Data Science", count: 189 },
      { name: "Cybersecurity", count: 156 },
      { name: "Cloud Computing", count: 178 },
      { name: "Blockchain", count: 145 },
      { name: "DevOps", count: 167 },
    ],
  },
  {
    id: "health",
    name: "Health and Fitness",
    icon: Heart,
    subcategories: [
      { name: "Workout Plans", count: 223 },
      { name: "Nutrition Guides", count: 198 },
      { name: "Yoga & Meditation", count: 176 },
      { name: "Weight Loss", count: 234 },
      { name: "Muscle Building", count: 189 },
      { name: "Mental Health", count: 167 },
      { name: "Sleep Optimization", count: 145 },
      { name: "Healthy Recipes", count: 201 },
    ],
  },
  {
    id: "creative",
    name: "Creative Arts",
    icon: Palette,
    subcategories: [
      { name: "Graphic Design", count: 245 },
      { name: "Photography", count: 198 },
      { name: "Video Editing", count: 223 },
      { name: "Music Production", count: 167 },
      { name: "Writing & Publishing", count: 189 },
      { name: "Animation", count: 156 },
      { name: "UI/UX Design", count: 234 },
      { name: "Illustration", count: 178 },
    ],
  },
  {
    id: "finance",
    name: "Finance and Investing",
    icon: DollarSign,
    subcategories: [
      { name: "Stock Trading", count: 234 },
      { name: "Cryptocurrency", count: 267 },
      { name: "Real Estate", count: 198 },
      { name: "Personal Finance", count: 223 },
      { name: "Passive Income", count: 289 },
      { name: "Budgeting", count: 167 },
      { name: "Retirement Planning", count: 145 },
      { name: "Tax Strategies", count: 156 },
    ],
  },
];

const featuredSections = [
  {
    title: "Trending Now",
    icon: Flame,
    items: ["AI Prompt Engineering", "ChatGPT Mastery", "Passive Income 2024", "TikTok Marketing"],
  },
  {
    title: "New Arrivals",
    icon: Zap,
    items: ["Instagram Reels Guide", "Notion Templates", "Canva Pro Designs", "Email Sequences"],
  },
  {
    title: "Deals",
    icon: Tag,
    items: ["50% Off Bundles", "Black Friday Deals", "Exclusive Templates", "Premium Courses"],
  },
];

const languages = [
  { code: "EN", name: "English", flag: "🇺🇸" },
  { code: "AR", name: "العربية", flag: "🇸🇦" },
  { code: "ES", name: "Español", flag: "🇪🇸" },
  { code: "FR", name: "Français", flag: "🇫🇷" },
  { code: "DE", name: "Deutsch", flag: "🇩🇪" },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("EN");
  const [languageExpanded, setLanguageExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch categories from API
  const { categories: apiCategories } = useCategories();

  // Use API categories if available, otherwise use demo categories
  const categories = apiCategories.length > 0 ? apiCategories.map(cat => ({
    id: cat.slug,
    name: cat.name,
    icon: iconMap[cat.icon || 'briefcase'] || Briefcase,
    subcategories: cat.children?.map(child => ({
      name: child.name,
      count: child._count?.products || 0,
      slug: child.slug,
    })) || [],
  })) : demoCategories;

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code);
    setLanguageExpanded(false);
    console.log(`Language changed to: ${code}`);
    // Ready for i18n integration
  };

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
      onClose();
    }
  };

  return (
    <>
      {/* Full-Screen Mobile Menu - App Style */}
      <div className="fixed inset-0 bg-white dark:bg-slate-900 z-50 lg:hidden overflow-y-auto animate-in slide-in-from-bottom duration-300">
        {/* Header with Search */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 z-10">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 active:bg-gray-200 dark:active:bg-slate-600 transition-colors"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-4 pb-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, categories..."
                  className="w-full h-12 pl-12 pr-4 rounded-full border-2 border-gray-200 dark:border-slate-600 focus:border-gray-400 dark:focus:border-slate-500 focus:ring-4 focus:ring-gray-100 dark:focus:ring-slate-700 focus:outline-none transition-all text-sm bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
            </form>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex gap-2 px-4 pb-4">
            <Link
              href="/products?filter=trending"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#ff6f61] to-gray-600 text-white rounded-full font-semibold text-sm shadow-lg active:scale-95 transition-transform"
            >
              <Flame className="w-4 h-4" />
              Trending
            </Link>
            <Link
              href="/products?filter=new"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full font-semibold text-sm shadow-lg active:scale-95 transition-transform"
            >
              <Zap className="w-4 h-4" />
              New
            </Link>
            <Link
              href="/products?filter=deals"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-semibold text-sm shadow-lg active:scale-95 transition-transform"
            >
              <Tag className="w-4 h-4" />
              Deals
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-6">
          {/* Categories */}
          <div className="space-y-1 mb-8">
            <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Categories
            </h3>
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isExpanded = expandedCategory === category.id;

              return (
                <div key={category.id}>
                  {/* Category Button - Larger Touch Target */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between px-4 py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 active:bg-gray-100 dark:active:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                        isExpanded ? "bg-gradient-to-r from-gray-600 to-[#ff6f61]" : "bg-gray-100 dark:bg-slate-700"
                      )}>
                        <IconComponent
                          className={cn("w-5 h-5 transition-colors", isExpanded ? "text-white" : "text-gray-600 dark:text-gray-300")}
                          strokeWidth={2}
                        />
                      </div>
                      <span className={cn(
                        "text-base font-medium transition-colors",
                        isExpanded ? "text-gray-900 dark:text-white font-semibold" : "text-gray-700 dark:text-gray-300"
                      )}>
                        {category.name}
                      </span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 text-gray-400 transition-transform duration-200",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </button>

                  {/* Subcategories - Improved Touch Targets */}
                  {isExpanded && (
                    <div className="mt-2 ml-14 mr-4 space-y-1 animate-in slide-in-from-top-2 duration-200 bg-gray-50 dark:bg-slate-800 rounded-xl p-2">
                      {category.subcategories.map((sub: any) => (
                        <Link
                          key={sub.name}
                          href={`/products?category=${sub.slug || sub.name}`}
                          onClick={onClose}
                          className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white dark:hover:bg-slate-700 active:bg-gray-100 dark:active:bg-slate-600 transition-colors group"
                        >
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                            {sub.name}
                          </span>
                          <span className="text-xs font-semibold text-gray-400 bg-white dark:bg-slate-600 dark:text-gray-300 px-2 py-1 rounded-full">
                            {sub.count}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Special Features */}
          <div className="space-y-2 border-t border-gray-200 pt-6 mb-6">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Special
            </h3>
            <Link
              href="/bundles"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#ff6f61] to-[#ff8a7a] flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-base font-medium text-gray-900">Product Bundles</span>
                <p className="text-xs text-gray-500">Save more when you buy together</p>
              </div>
            </Link>
            <Link
              href="/gift-cards"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-base font-medium text-gray-900">Gift Cards</span>
                <p className="text-xs text-gray-500">Give the gift of digital products</p>
              </div>
            </Link>
            <Link
              href="/account/referrals"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-base font-medium text-gray-900">Referral Program</span>
                <p className="text-xs text-gray-500">Earn 10% on every referral</p>
              </div>
            </Link>
          </div>

          {/* Featured Sections */}
          <div className="space-y-6 border-t border-gray-200 pt-6">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Featured
            </h3>
            {featuredSections.map((section) => {
              const SectionIcon = section.icon;
              return (
                <div key={section.title}>
                  <h4 className="flex items-center gap-2 px-3 text-sm font-semibold text-[#0A3D62] mb-2">
                    <SectionIcon className="w-4 h-4" strokeWidth={1.5} />
                    {section.title}
                  </h4>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item}>
                        <Link
                          href={`/products?search=${item}`}
                          onClick={onClose}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">
                            {item}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Language Switcher - Dropdown */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="space-y-2">
              {/* Language Dropdown Button */}
              <button
                onClick={() => setLanguageExpanded(!languageExpanded)}
                className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-[#0A3D62]" strokeWidth={1.5} style={{ opacity: 0.8 }} />
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{languages.find(l => l.code === selectedLanguage)?.flag}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {languages.find(l => l.code === selectedLanguage)?.name}
                    </span>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-gray-400 transition-transform",
                    languageExpanded && "rotate-180"
                  )}
                />
              </button>

              {/* Language Options */}
              {languageExpanded && (
                <div className="ml-8 space-y-1 animate-in slide-in-from-top-2 duration-200">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors",
                        selectedLanguage === lang.code && "bg-primary/5"
                      )}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-gray-900">{lang.name}</div>
                        <div className="text-xs text-gray-500">{lang.code}</div>
                      </div>
                      {selectedLanguage === lang.code && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

