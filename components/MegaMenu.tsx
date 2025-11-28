"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ChevronDown, TrendingUp, Sparkles, Clock, Tag, Home, Briefcase, Code, 
  Heart, Palette, DollarSign, ArrowRight, Flame, Zap, ShoppingBag, 
  LucideIcon, Star, Gift, Rocket
} from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

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
    name: "Business & Marketing",
    icon: Briefcase,
    color: "from-gray-400 to-[#ff6f61]",
    subcategories: [
      { name: "Digital Marketing", count: 234 },
      { name: "Social Media", count: 189 },
      { name: "Email Marketing", count: 156 },
      { name: "SEO & SEM", count: 142 },
      { name: "Content Marketing", count: 128 },
      { name: "E-commerce", count: 176 },
    ],
  },
  {
    id: "personal",
    name: "Personal Development",
    icon: Sparkles,
    color: "from-gray-400 to-pink-500",
    subcategories: [
      { name: "Productivity", count: 167 },
      { name: "Time Management", count: 134 },
      { name: "Goal Setting", count: 112 },
      { name: "Mindfulness", count: 98 },
      { name: "Self-Improvement", count: 203 },
      { name: "Leadership", count: 145 },
    ],
  },
  {
    id: "technology",
    name: "Technology",
    icon: Code,
    color: "from-green-500 to-emerald-500",
    subcategories: [
      { name: "Programming", count: 312 },
      { name: "Web Development", count: 289 },
      { name: "Mobile Apps", count: 178 },
      { name: "Data Science", count: 156 },
      { name: "AI & ML", count: 134 },
      { name: "Cybersecurity", count: 98 },
    ],
  },
  {
    id: "health",
    name: "Health & Fitness",
    icon: Heart,
    color: "from-red-500 to-orange-500",
    subcategories: [
      { name: "Workout Plans", count: 198 },
      { name: "Nutrition Guides", count: 167 },
      { name: "Weight Loss", count: 234 },
      { name: "Yoga & Meditation", count: 145 },
      { name: "Mental Health", count: 178 },
      { name: "Healthy Recipes", count: 203 },
    ],
  },
  {
    id: "creative",
    name: "Creative Arts",
    icon: Palette,
    color: "from-pink-500 to-rose-500",
    subcategories: [
      { name: "Graphic Design", count: 245 },
      { name: "Photography", count: 198 },
      { name: "Video Editing", count: 167 },
      { name: "Music Production", count: 134 },
      { name: "Writing & Blogging", count: 289 },
      { name: "UI/UX Design", count: 178 },
    ],
  },
  {
    id: "finance",
    name: "Finance & Investing",
    icon: DollarSign,
    color: "from-yellow-500 to-amber-500",
    subcategories: [
      { name: "Stock Trading", count: 189 },
      { name: "Cryptocurrency", count: 234 },
      { name: "Real Estate", count: 156 },
      { name: "Personal Finance", count: 203 },
      { name: "Budgeting", count: 145 },
      { name: "Retirement Planning", count: 112 },
    ],
  },
];

export default function MegaMenu() {
  const pathname = usePathname();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = (categoryId: string) => {
    setActiveCategory(categoryId);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setActiveCategory(null);
    setIsOpen(false);
  };

  const activeCategoryData = demoCategories.find(cat => cat.id === activeCategory);

  return (
    <nav className="hidden lg:block border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-14">
          {/* Main Navigation Links */}
          <div className="flex items-center gap-1">
            {/* Categories Dropdown Trigger - First Item */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter(demoCategories[0].id)}
              onMouseLeave={handleMouseLeave}
            >
              <button className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isOpen
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-700 hover:text-gray-500 hover:bg-gray-50'
              }`}>
                <ShoppingBag className="w-4 h-4" />
                All Categories
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:text-gray-500 hover:bg-gray-50 transition-all"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>

            <Link
              href="/products?filter=trending"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:text-gray-500 hover:bg-gray-50 transition-all"
            >
              <TrendingUp className="w-4 h-4" />
              Trending
            </Link>

            <Link
              href="/products?filter=new"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:text-gray-500 hover:bg-gray-50 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              New Arrivals
            </Link>

            <Link
              href="/products?filter=bestsellers"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:text-gray-500 hover:bg-gray-50 transition-all"
            >
              <Flame className="w-4 h-4" />
              Bestsellers
            </Link>
          </div>

          {/* Right Side - Special Links */}
          <div className="flex items-center gap-1">
            <Link
              href="/products?filter=free"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[#ff6f61] hover:bg-orange-50 transition-all"
            >
              <Gift className="w-4 h-4" />
              Free Products
            </Link>

            <Link
              href="/deals"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:shadow-lg hover:shadow-gray-200 transition-all"
            >
              <Tag className="w-4 h-4" />
              Hot Deals
            </Link>
          </div>
        </div>
      </div>

      {/* Mega Menu Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute left-0 right-0 top-full bg-white border-t-2 border-gray-300 shadow-2xl z-[100]"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8">
            <div className="grid grid-cols-12 gap-8">
              {/* Left Sidebar - Category List */}
              <div className="col-span-3 space-y-1">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-3">
                  All Categories
                </h3>
                {demoCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onMouseEnter={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                        activeCategory === category.id
                          ? 'bg-gradient-to-r ' + category.color + ' text-white shadow-lg'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        activeCategory === category.id
                          ? 'bg-white/20'
                          : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium">{category.name}</div>
                      </div>
                      <ArrowRight className={`w-4 h-4 transition-transform ${
                        activeCategory === category.id ? 'translate-x-1' : ''
                      }`} />
                    </button>
                  );
                })}
              </div>

              {/* Right Content - Subcategories */}
              {activeCategoryData && (
                <div className="col-span-9">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-2xl bg-gradient-to-r ${activeCategoryData.color}`}>
                      <activeCategoryData.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{activeCategoryData.name}</h3>
                      <p className="text-sm text-gray-500">Explore our collection of digital products</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {activeCategoryData.subcategories.map((sub) => (
                      <Link
                        key={sub.name}
                        href={`/products?category=${activeCategoryData.id}&subcategory=${sub.name}`}
                        className="group p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-gray-900 group-hover:text-gray-500">
                            {sub.name}
                          </h4>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
                        </div>
                        <p className="text-xs text-gray-500">{sub.count} products</p>
                      </Link>
                    ))}
                  </div>

                  {/* View All Link */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Link
                      href={`/products?category=${activeCategoryData.id}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-gray-200 transition-all group"
                    >
                      View All {activeCategoryData.name}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}


