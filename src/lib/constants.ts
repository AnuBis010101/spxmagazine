export const SITE_NAME = "SPX Magazine";
export const SITE_DESCRIPTION =
  "The premier source for SPX6900 news, insights, and community resources.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://spxmagazine.com";

export type NavChild = { label: string; href: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

export const NAV_ITEMS: NavItem[] = [
  { label: "News", href: "/news" },
  {
    label: "Articles",
    href: "/articles",
    children: [
      { label: "SPX Magazine Articles", href: "/articles/magazine" },
      { label: "Community Articles", href: "/articles" },
    ],
  },
  {
    label: "Learn",
    href: "/learn",
    children: [
      { label: "Learn", href: "/learn" },
      { label: "Glossary", href: "/learn/glossary" },
    ],
  },
  { label: "Data", href: "/data" },
];

// External newsletter signup page (client-provided). Placeholder until the link is supplied.
export const NEWSLETTER_SIGNUP_URL = "#";

export const CONTENT_TYPES = {
  news: { label: "News", slug: "news" },
  article: { label: "Articles", slug: "articles" },
  learn: { label: "Learn", slug: "learn" },
} as const;

export const POSTS_PER_PAGE = 12;
export const FEATURED_COUNT = 3;
