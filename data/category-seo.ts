// SEO content for each category - unique, keyword-rich content
export interface CategorySEO {
  slug: string;
  title: string; // H1 title
  metaTitle: string;
  metaDescription: string;
  introText: string; // 2-3 lines, 40-60 words
  bottomContent: string; // 100-300 words, detailed SEO content
}

export const categorySEOContent: Record<string, CategorySEO> = {
  "business-and-marketing": {
    slug: "business-and-marketing",
    title: "Business & Marketing Templates for Canva",
    metaTitle: "Business & Marketing Canva Templates | Digistore1",
    metaDescription: "Download professional business and marketing Canva templates. Boost your brand with ready-to-edit presentations, social media posts, business cards, and marketing materials.",
    introText: "Elevate your business presence with our professionally designed Canva templates. From stunning presentations to eye-catching social media graphics, our business and marketing collection helps entrepreneurs and marketers create impactful content without design skills.",
    bottomContent: `Our Business & Marketing template collection is designed for entrepreneurs, small business owners, marketing professionals, and agencies looking to create professional-quality content quickly and efficiently.

Whether you're launching a startup, running marketing campaigns, or building your personal brand, these Canva templates provide the perfect foundation. Each template is fully customizable—simply drag, drop, and edit to match your brand colors, fonts, and messaging.

**What's included in this collection:**
- Social media post templates for Instagram, Facebook, LinkedIn, and Twitter
- Business presentation decks and pitch deck templates
- Marketing flyers and promotional materials
- Business cards and letterhead designs
- Email newsletter templates
- Infographic templates for data visualization
- Brand kit elements and logo placeholders

**Why choose our templates:**
All templates are created by professional designers with marketing expertise. They follow current design trends while maintaining timeless appeal. Compatible with free Canva accounts, these templates help you maintain brand consistency across all your marketing channels.

Perfect for coaches, consultants, real estate agents, digital marketers, and any business professional looking to stand out in a crowded marketplace.`
  },
  "personal-development": {
    slug: "personal-development",
    title: "Personal Development & Self-Improvement Templates",
    metaTitle: "Personal Development Canva Templates | Digistore1",
    metaDescription: "Transform your life with personal development Canva templates. Planners, goal trackers, affirmation cards, and self-improvement worksheets ready to customize.",
    introText: "Unlock your potential with our personal development template collection. Designed for coaches, therapists, and individuals committed to growth, these templates include planners, journals, goal trackers, and motivational content to support your transformation journey.",
    bottomContent: `Our Personal Development collection empowers life coaches, wellness practitioners, therapists, and self-improvement enthusiasts with beautifully designed templates that inspire action and positive change.

**Transform lives with these template categories:**
- Daily, weekly, and monthly planner templates
- Goal setting worksheets and vision board templates
- Habit tracker and gratitude journal pages
- Affirmation cards and motivational quote graphics
- Self-reflection prompts and journaling templates
- Mindfulness and meditation guides
- Coaching workbooks and client worksheets

**Ideal for:**
Life coaches creating client materials, therapists designing homework assignments, wellness influencers sharing content, and anyone on a personal growth journey.

Each template combines beautiful aesthetics with practical functionality. The clean, modern designs create a calm visual experience that supports focus and reflection. Customize colors, fonts, and content in Canva to match your brand or personal style.

Whether you're building a coaching business, launching a self-help product, or simply organizing your own development journey, these templates provide the structure and inspiration you need to succeed.`
  },
  "animals-and-pets": {
    slug: "animals-and-pets",
    title: "Pet Business & Animal Lover Templates",
    metaTitle: "Pet Business Canva Templates | Digistore1",
    metaDescription: "Adorable pet business Canva templates for groomers, trainers, vets, and pet shops. Social media posts, flyers, and marketing materials for animal lovers.",
    introText: "Capture hearts with our charming pet-themed Canva templates. Perfect for pet groomers, veterinarians, dog trainers, pet sitters, and animal-focused businesses looking to connect with pet parents through irresistible designs.",
    bottomContent: `Our Animals & Pets template collection is crafted specifically for the pet industry—one of the fastest-growing markets worldwide. Whether you run a grooming salon, veterinary clinic, pet store, or dog training business, these templates help you attract and retain pet-loving customers.

**Template categories for pet businesses:**
- Social media templates featuring adorable pet photography placeholders
- Pet grooming price lists and service menus
- Veterinary clinic appointment cards and reminders
- Pet sitting and dog walking service flyers
- Pet adoption event promotional materials
- Pet birthday and celebration templates
- Animal rescue and shelter marketing materials
- Pet photography session booking graphics

**Who benefits from these templates:**
Pet groomers and mobile grooming services, veterinary clinics and animal hospitals, pet stores and online pet shops, dog trainers and behaviorists, pet sitters and dog walkers, animal shelters and rescue organizations, pet photographers and pet influencers.

Every template is designed with warmth and playfulness that resonates with pet parents. The designs feature space for pet photos, paw print accents, and color schemes that appeal to animal lovers. Fully editable in Canva with any account level.`
  },
  "home-and-lifestyle": {
    slug: "home-and-lifestyle",
    title: "Home & Lifestyle Design Templates",
    metaTitle: "Home & Lifestyle Canva Templates | Digistore1",
    metaDescription: "Beautiful home and lifestyle Canva templates for interior designers, home organizers, and lifestyle bloggers. Create stunning content for your audience.",
    introText: "Create inspiring home and lifestyle content with our curated template collection. Ideal for interior designers, home organizers, real estate professionals, and lifestyle influencers who want to showcase beautiful living spaces and inspire their audience.",
    bottomContent: `Our Home & Lifestyle collection brings together elegant designs for everyone passionate about creating beautiful living spaces and inspiring others to do the same.

**Perfect templates for:**
- Interior design portfolios and mood boards
- Home organization tips and decluttering guides
- Real estate listing presentations and open house flyers
- Home staging and renovation before/after posts
- Lifestyle blog graphics and Pinterest pins
- Recipe cards and meal planning templates
- DIY project guides and home improvement tips
- Seasonal home decor inspiration posts

**Designed for professionals and enthusiasts:**
Interior designers showcasing their work, professional home organizers marketing services, real estate agents promoting listings, home décor influencers and bloggers, Airbnb hosts creating welcome guides, home renovation contractors, and lifestyle content creators.

Each template features sophisticated color palettes, clean typography, and layouts that highlight beautiful spaces. The minimalist aesthetic appeals to modern homeowners while remaining versatile enough for various home styles.

Whether you're building a design business, growing your home lifestyle brand, or creating content that inspires your community, these templates provide the professional polish your audience expects.`
  },
  "technology": {
    slug: "technology",
    title: "Technology & Digital Product Templates",
    metaTitle: "Technology Canva Templates | Digistore1",
    metaDescription: "Modern technology and SaaS Canva templates. Perfect for tech startups, software companies, app developers, and digital product launches.",
    introText: "Launch your tech brand with confidence using our modern technology templates. Designed for startups, SaaS companies, app developers, and tech influencers, this collection features sleek, contemporary designs that communicate innovation and expertise.",
    bottomContent: `Our Technology collection provides cutting-edge designs for the fast-paced world of tech, software, and digital innovation. Stand out in the competitive tech landscape with templates that speak to your audience.

**Templates for every tech need:**
- SaaS product launch graphics and feature announcements
- App store screenshots and promotional materials
- Tech startup pitch deck presentations
- Software tutorial and how-to graphics
- Coding bootcamp and tech course materials
- Podcast cover art for tech shows
- Tech blog headers and featured images
- Product comparison charts and pricing tables
- Tech conference and webinar promotions

**Built for the tech industry:**
SaaS and software companies, mobile app developers, tech startups and founders, IT service providers, coding bootcamps and tech educators, tech podcasters and YouTubers, cybersecurity firms, AI and machine learning companies.

These templates feature dark modes, gradient accents, and modern geometric patterns that resonate with tech-savvy audiences. Clean layouts effectively communicate complex features and benefits. Device mockups and screenshot placeholders help showcase your digital products professionally.

Whether you're announcing a new feature, recruiting developers, or building your tech brand presence, these templates give you the polished, professional look that tech audiences expect.`
  },
  "society-and-politics": {
    slug: "society-and-politics",
    title: "Social Causes & Community Templates",
    metaTitle: "Social Causes Canva Templates | Digistore1",
    metaDescription: "Powerful social cause and community Canva templates. Perfect for nonprofits, advocacy groups, and organizations making a difference.",
    introText: "Amplify your message with our impactful social cause templates. Designed for nonprofits, advocacy organizations, community groups, and changemakers who want to inspire action and create meaningful change through compelling visual content.",
    bottomContent: `Our Society & Social Causes collection empowers organizations and individuals working to make a positive impact in their communities and beyond. These templates help you communicate your mission effectively and inspire action.

**Template categories for changemakers:**
- Nonprofit fundraising campaign graphics
- Volunteer recruitment and event flyers
- Awareness campaign social media posts
- Petition and advocacy call-to-action materials
- Community event announcements
- Educational infographics on social issues
- Newsletter templates for nonprofits
- Annual report and impact statement designs
- Donation thank-you cards and certificates

**Who uses these templates:**
Nonprofit organizations and charities, community advocacy groups, political campaigns and civic organizations, environmental organizations, social justice movements, religious and faith-based organizations, educational institutions, healthcare awareness campaigns.

Each template is designed to evoke emotion and inspire action. Bold typography, impactful imagery placeholders, and clear calls-to-action help your message resonate with supporters and potential donors.

These templates respect the serious nature of social causes while maintaining visual appeal that captures attention in crowded social media feeds. Customize colors to match your organization's brand while keeping the powerful messaging intact.`
  }
};

// Get SEO content by category slug
export function getCategorySEO(slug: string): CategorySEO | null {
  return categorySEOContent[slug] || null;
}

// Get all category slugs for static generation
export function getAllCategorySlugs(): string[] {
  return Object.keys(categorySEOContent);
}

