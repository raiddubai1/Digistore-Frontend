"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

// Map of path segments to readable labels
const pathLabels: Record<string, string> = {
  products: "Products",
  categories: "Categories",
  category: "Category",
  cart: "Cart",
  checkout: "Checkout",
  account: "Account",
  orders: "Orders",
  wishlist: "Wishlist",
  compare: "Compare",
  search: "Search",
  deals: "Deals",
  contact: "Contact",
  login: "Login",
  register: "Register",
  admin: "Admin",
  "forgot-password": "Forgot Password",
  "reset-password": "Reset Password",
  "verify-email": "Verify Email",
};

export default function Breadcrumb({
  items,
  className = "",
  showHome = true,
}: BreadcrumbProps) {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;

    const segments = pathname.split("/").filter(Boolean);
    
    // Remove locale from segments (first segment like 'en', 'ar', etc.)
    const localePattern = /^[a-z]{2}(-[A-Z]{2})?$/;
    const startIndex = localePattern.test(segments[0]) ? 1 : 0;
    const locale = localePattern.test(segments[0]) ? segments[0] : "en";
    
    const breadcrumbs: BreadcrumbItem[] = [];
    let currentPath = `/${locale}`;

    for (let i = startIndex; i < segments.length; i++) {
      const segment = segments[i];
      currentPath += `/${segment}`;
      
      // Check if it's the last segment (current page)
      const isLast = i === segments.length - 1;
      
      // Get label from map or capitalize the segment
      const label = pathLabels[segment] || 
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't render if no breadcrumbs or only home
  if (breadcrumbs.length === 0) return null;

  // Extract locale from pathname
  const segments = pathname.split("/").filter(Boolean);
  const localePattern = /^[a-z]{2}(-[A-Z]{2})?$/;
  const locale = localePattern.test(segments[0]) ? segments[0] : "en";

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-sm ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-1">
        {showHome && (
          <li className="flex items-center">
            <Link
              href={`/${locale}`}
              className="flex items-center text-gray-500 dark:text-gray-400 hover:text-[#FF6B35] dark:hover:text-[#FF6B35] transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="sr-only">Home</span>
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400 dark:text-gray-500" />
          </li>
        )}
        
        {breadcrumbs.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.href ? (
              <>
                <Link
                  href={item.href}
                  className="text-gray-500 dark:text-gray-400 hover:text-[#FF6B35] dark:hover:text-[#FF6B35] transition-colors"
                >
                  {item.label}
                </Link>
                <ChevronRight className="w-4 h-4 mx-2 text-gray-400 dark:text-gray-500" />
              </>
            ) : (
              <span className="text-gray-900 dark:text-white font-medium">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

