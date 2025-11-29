import { create } from 'zustand';

interface BundleProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
}

interface Bundle {
  id: string;
  name: string;
  description: string;
  products: BundleProduct[];
  originalPrice: number;
  bundlePrice: number;
  discount: number; // percentage
  image: string;
  slug: string;
  featured: boolean;
}

interface BundleState {
  bundles: Bundle[];
  selectedBundle: Bundle | null;
  
  // Actions
  setBundles: (bundles: Bundle[]) => void;
  selectBundle: (bundle: Bundle | null) => void;
  getBundleBySlug: (slug: string) => Bundle | undefined;
}

// Demo bundles
export const demoBundles: Bundle[] = [
  {
    id: '1',
    name: 'Digital Marketing Mastery Bundle',
    description: 'Everything you need to master digital marketing. Includes SEO, social media, and content marketing guides.',
    products: [
      { id: 'p1', title: 'SEO Complete Guide', price: 29.99, image: '/placeholder.jpg', slug: 'seo-guide' },
      { id: 'p2', title: 'Social Media Marketing', price: 24.99, image: '/placeholder.jpg', slug: 'social-media' },
      { id: 'p3', title: 'Content Marketing Playbook', price: 19.99, image: '/placeholder.jpg', slug: 'content-marketing' },
    ],
    originalPrice: 74.97,
    bundlePrice: 49.99,
    discount: 33,
    image: '/placeholder.jpg',
    slug: 'digital-marketing-bundle',
    featured: true,
  },
  {
    id: '2',
    name: 'Web Development Starter Pack',
    description: 'Start your web development journey with these essential resources.',
    products: [
      { id: 'p4', title: 'HTML & CSS Fundamentals', price: 19.99, image: '/placeholder.jpg', slug: 'html-css' },
      { id: 'p5', title: 'JavaScript Essentials', price: 34.99, image: '/placeholder.jpg', slug: 'javascript' },
      { id: 'p6', title: 'React for Beginners', price: 39.99, image: '/placeholder.jpg', slug: 'react-beginners' },
    ],
    originalPrice: 94.97,
    bundlePrice: 59.99,
    discount: 37,
    image: '/placeholder.jpg',
    slug: 'web-dev-bundle',
    featured: true,
  },
  {
    id: '3',
    name: 'Productivity Power Pack',
    description: 'Boost your productivity with these time-tested templates and guides.',
    products: [
      { id: 'p7', title: 'Notion Templates Pack', price: 14.99, image: '/placeholder.jpg', slug: 'notion-templates' },
      { id: 'p8', title: 'Time Management Guide', price: 9.99, image: '/placeholder.jpg', slug: 'time-management' },
    ],
    originalPrice: 24.98,
    bundlePrice: 17.99,
    discount: 28,
    image: '/placeholder.jpg',
    slug: 'productivity-bundle',
    featured: false,
  },
];

export const useBundleStore = create<BundleState>((set, get) => ({
  bundles: demoBundles,
  selectedBundle: null,

  setBundles: (bundles) => set({ bundles }),
  
  selectBundle: (bundle) => set({ selectedBundle: bundle }),
  
  getBundleBySlug: (slug) => {
    return get().bundles.find((b) => b.slug === slug);
  },
}));

// Calculate savings
export const calculateSavings = (originalPrice: number, bundlePrice: number): number => {
  return originalPrice - bundlePrice;
};

// Calculate discount percentage
export const calculateDiscount = (originalPrice: number, bundlePrice: number): number => {
  return Math.round(((originalPrice - bundlePrice) / originalPrice) * 100);
};

