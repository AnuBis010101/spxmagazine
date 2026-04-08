// Seed community tools for SPX6900 Magazine
//
// Run: node src/scripts/seed-community-tools.mjs

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://hvmndangtzarsnqgnuky.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bW5kYW5ndHphcnNucWdudWt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDYyNTQ1MSwiZXhwIjoyMDkwMjAxNDUxfQ.oWPVawa-d7-5i-3XFt0n-DUEI2po3OEwOr5hGcTExY0"
);

const tools = [
  {
    name: "SPX6900 Official",
    slug: "spx6900-official",
    description: "Main website",
    url: "https://www.spx6900.com",
    category: "Official",
    is_featured: true,
    status: "published",
    sort_order: 1,
  },
  {
    name: "6900 Is Bigger Than 500",
    slug: "6900-is-bigger-than-500",
    description: "Toolbox: History, Builder, Calendar, Archive",
    url: "https://6900isbiggerthan500.com",
    category: "Community Sites",
    is_featured: false,
    status: "published",
    sort_order: 2,
  },
  {
    name: "Aeons 6900",
    slug: "aeons-6900",
    description: "Archive of everything SPX6900",
    url: "https://aeons6900.com",
    category: "Community Sites",
    is_featured: false,
    status: "published",
    sort_order: 3,
  },
  {
    name: "SPX6900 Resources",
    slug: "spx6900-resources",
    description: "Beginner guide and community resources",
    url: "https://spx6900resources.com",
    category: "Community Sites",
    is_featured: false,
    status: "published",
    sort_order: 4,
  },
  {
    name: "Flip The Stock Market (XYZ)",
    slug: "flip-the-stock-market-xyz",
    description: "Live metrics SPX6900 vs S&P500",
    url: "https://flipthestockmarket.xyz",
    category: "Trackers",
    is_featured: true,
    status: "published",
    sort_order: 5,
  },
  {
    name: "Flip The Stock Market (COM)",
    slug: "flip-the-stock-market-com",
    description: "SPX6900 vs SP500 performance tracker",
    url: "https://flipthestockmarket.com",
    category: "Trackers",
    is_featured: false,
    status: "published",
    sort_order: 6,
  },
  {
    name: "SPX6900 Mosaic",
    slug: "spx6900-mosaic",
    description: "Community PFP mosaic",
    url: "https://spx6900mosaic.com",
    category: "Culture",
    is_featured: true,
    status: "published",
    sort_order: 7,
  },
  {
    name: "SPX6900 Earth",
    slug: "spx6900-earth",
    description: "Global Aeon directory",
    url: "https://spx6900.earth",
    category: "Culture",
    is_featured: false,
    status: "published",
    sort_order: 8,
  },
  {
    name: "SPX6900 Merch",
    slug: "spx6900-merch",
    description: "Official merchandise",
    url: "https://spx6900merch.com",
    category: "Merch",
    is_featured: false,
    status: "published",
    sort_order: 9,
  },
  {
    name: "SPX6900 Gear",
    slug: "spx6900-gear",
    description: "Community gear",
    url: "https://spx6900gear.com",
    category: "Merch",
    is_featured: false,
    status: "published",
    sort_order: 10,
  },
  {
    name: "Flip the Stock Market (YouTube)",
    slug: "flip-the-stock-market-youtube",
    description: "Bi-weekly community show",
    url: "https://www.youtube.com/@flipthestockmarket",
    category: "Channels",
    is_featured: false,
    status: "published",
    sort_order: 11,
  },
  {
    name: "Persist Forever (YouTube)",
    slug: "persist-forever-youtube",
    description: "Aeon conversations",
    url: "https://www.youtube.com/@southernfriedchad",
    category: "Channels",
    is_featured: false,
    status: "published",
    sort_order: 12,
  },
  {
    name: "Murad's Channel",
    slug: "murads-channel",
    description: "Murad's YouTube",
    url: "https://youtube.com/@muststopmurad",
    category: "Channels",
    is_featured: false,
    status: "published",
    sort_order: 13,
  },
  {
    name: "Flip it with Nick",
    slug: "flip-it-with-nick",
    description: "Podcast interviews",
    url: "https://www.youtube.com/@FlipitwithNick",
    category: "Channels",
    is_featured: false,
    status: "published",
    sort_order: 14,
  },
  {
    name: "Buy on Uniswap (ETH)",
    slug: "buy-on-uniswap-eth",
    description: "Buy SPX6900 on Ethereum",
    url: "https://app.uniswap.org/swap?outputCurrency=0xe0f63a424a4439cbe457d80e4f4b51ad25b2c56c",
    category: "Buy SPX6900",
    is_featured: false,
    status: "published",
    sort_order: 15,
  },
  {
    name: "Buy on Aerodrome (Base)",
    slug: "buy-on-aerodrome-base",
    description: "Buy SPX6900 on Base",
    url: "https://aerodrome.finance/swap?from=eth&to=0x6806411765Af15Bddd26f8f544A34cC40cb9838B",
    category: "Buy SPX6900",
    is_featured: false,
    status: "published",
    sort_order: 16,
  },
];

async function seed() {
  console.log("Seeding community tools...");

  const { data, error } = await supabase
    .from("tools")
    .upsert(tools, { onConflict: "slug" })
    .select();

  if (error) {
    console.error("Error seeding community tools:", error.message);
    process.exit(1);
  }

  console.log(`Successfully seeded ${data.length} community tools.`);
}

seed();
