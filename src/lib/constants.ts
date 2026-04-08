export const SITE_NAME = "SPX Magazine";
export const SITE_DESCRIPTION =
  "The premier source for SPX6900 news, insights, and community resources.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://spxmagazine.com";

export const NAV_ITEMS = [
  { label: "News", href: "/news" },
  { label: "Articles", href: "/articles" },
  { label: "Learn", href: "/learn" },
  { label: "Data", href: "/data" },
  { label: "Glossary", href: "/glossary" },
] as const;

export const CONTENT_TYPES = {
  news: { label: "News", slug: "news" },
  article: { label: "Articles", slug: "articles" },
  learn: { label: "Learn", slug: "learn" },
} as const;

export const POSTS_PER_PAGE = 12;
export const FEATURED_COUNT = 3;
