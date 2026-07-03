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
      { label: "Guides", href: "/learn" },
      { label: "How to Buy", href: "/how-to-buy" },
      { label: "Glossary", href: "/learn/glossary" },
    ],
  },
  { label: "Data", href: "/data" },
];

// External newsletter signup page (Substack).
export const NEWSLETTER_SIGNUP_URL = "https://spx6900magazine.substack.com/subscribe";

// SPX6900 token contract addresses per chain (single source of truth — mirrored
// by the holders API). Keeps the how-to-buy page and swap links from drifting.
export const SPX6900_CONTRACTS = {
  ethereum: "0xe0f63a424a4439cbe457d80e4f4b51ad25b2c56c",
  base: "0x6806411765Af15Bddd26f8f544A34cC40cb9838B",
  solana: "J3NKxxXZcnNiMjKw9hYb2K4LUxgwB6t1FtPtQVsv3KFr",
} as const;

export const CONTENT_TYPES = {
  news: { label: "News", slug: "news" },
  article: { label: "Articles", slug: "articles" },
  learn: { label: "Learn", slug: "learn" },
} as const;

// Reserved tag that marks an `article` post as SPX Magazine editorial rather than
// a community submission. Single source of truth for the discriminator that the
// /articles (community) and /articles/magazine routes filter on, and that the
// admin PostForm's "Article Type" selector toggles. Absent = community.
export const MAGAZINE_TAG = "spx-magazine";

export const POSTS_PER_PAGE = 12;
export const FEATURED_COUNT = 3;
