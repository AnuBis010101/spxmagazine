export const SITE_NAME = "SPX Magazine";
export const SITE_DESCRIPTION =
  "The premier source for SPX6900 news, insights, and community resources.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://spx6900magazine.com";

export type NavChild = { label: string; href: string; desc?: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

export const NAV_ITEMS: NavItem[] = [
  { label: "News", href: "/news" },
  { label: "Videos", href: "/videos" },
  { label: "Podcasts", href: "/podcasts" },
  {
    label: "Articles",
    href: "/articles",
    children: [
      {
        label: "SPX Magazine Articles",
        href: "/articles/magazine",
        desc: "Editorials from the magazine desk",
      },
      {
        label: "Community Articles",
        href: "/articles",
        desc: "Written by Aeons, for Aeons",
      },
    ],
  },
  {
    label: "Learn",
    href: "/learn",
    children: [
      { label: "Guides", href: "/learn", desc: "Your map to the Cognisphere" },
      { label: "How to Buy", href: "/how-to-buy", desc: "Get SPX6900 in minutes" },
      { label: "Glossary", href: "/learn/glossary", desc: "Every term, decoded" },
    ],
  },
  { label: "Data", href: "/data" },
  { label: "Magazines", href: "/magazines" },
  { label: "Books", href: "/books" },
  { label: "Store", href: "/store" },
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

/**
 * How long a post stays in the "This week" lead section on News and Community
 * Articles. Past this it moves to "Earlier" automatically — nothing is
 * unpublished or deleted, so permalinks, search and tags keep working.
 * Change this to retune the window for both listings.
 */
export const FRESH_WINDOW_DAYS = 7;
export const FEATURED_COUNT = 3;
