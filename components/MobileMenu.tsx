"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ChevronDown, ChevronRight, Briefcase, Sparkles, Code, Heart, Palette, DollarSign, Flame, Zap, Tag, Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
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

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 lg:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-50 lg:hidden overflow-y-auto shadow-2xl animate-in slide-in-from-left duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-gray-900">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-6">
          {/* Categories */}
          <div className="space-y-2 mb-8">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Categories
            </h3>
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isExpanded = expandedCategory === category.id;

              return (
                <div key={category.id}>
                  {/* Category Button */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent
                        className="w-5 h-5 text-[#0A3D62]"
                        strokeWidth={1.5}
                        style={{ opacity: 0.8 }}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {category.name}
                      </span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 text-gray-400 transition-transform",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </button>

                  {/* Subcategories */}
                  {isExpanded && (
                    <div className="mt-2 ml-8 space-y-1 animate-in slide-in-from-top-2 duration-200">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub.name}
                          href={`/products?category=${category.id}&subcategory=${sub.name}`}
                          onClick={onClose}
                          className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">
                            {sub.name}
                          </span>
                          <span className="text-xs text-gray-400">
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

