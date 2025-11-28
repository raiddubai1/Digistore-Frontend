"use client";

import Link from "next/link";
import { ArrowRight, Briefcase, User, Heart, Code, Palette, Music, BookOpen, Camera } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  productCount?: number;
  _count?: {
    products: number;
  };
}

interface CategoriesSectionProps {
  categories: Category[];
}

const iconMap: { [key: string]: any } = {
  briefcase: Briefcase,
  user: User,
  heart: Heart,
  code: Code,
  palette: Palette,
  music: Music,
  "book-open": BookOpen,
  camera: Camera,
};

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
  // Filter only parent categories (no parentId)
  const parentCategories = categories.filter((cat: any) => !cat.parentId).slice(0, 8);

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">
            Browse by <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Category</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of digital products across different categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {parentCategories.map((category) => {
            const IconComponent = iconMap[category.icon || "briefcase"] || Briefcase;
            const productCount = category._count?.products || category.productCount || 0;

            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group relative bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-primary overflow-hidden"
              >
                {/* Background on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-7 h-7 text-primary" strokeWidth={1.5} />
                  </div>

                  {/* Category Name */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>

                  {/* Product Count */}
                  <p className="text-sm text-gray-600">
                    {productCount} {productCount === 1 ? "Product" : "Products"}
                  </p>

                  {/* Arrow Icon */}
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Categories Button */}
        <div className="text-center">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-[15px] font-semibold hover:shadow-xl hover:shadow-primary/25 transition-all hover:scale-105"
          >
            View All Categories
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

