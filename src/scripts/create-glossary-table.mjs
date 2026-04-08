// Glossary table seed script for SPX6900 Magazine
//
// STEP 1: Run this SQL in the Supabase SQL editor to create the table:
//
// CREATE TABLE glossary_terms (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   term TEXT NOT NULL,
//   slug TEXT NOT NULL UNIQUE,
//   definition TEXT NOT NULL,
//   category TEXT,
//   related_terms TEXT[] DEFAULT '{}',
//   sort_order INT DEFAULT 0,
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   updated_at TIMESTAMPTZ DEFAULT NOW()
// );
// ALTER TABLE glossary_terms ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Public can read glossary" ON glossary_terms FOR SELECT USING (true);
// CREATE POLICY "Authenticated can manage glossary" ON glossary_terms FOR ALL USING (auth.role() = 'authenticated');
//
// STEP 2: Run this script to seed the initial terms:
//   node src/scripts/create-glossary-table.mjs

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://hvmndangtzarsnqgnuky.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bW5kYW5ndHphcnNucWdudWt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDYyNTQ1MSwiZXhwIjoyMDkwMjAxNDUxfQ.oWPVawa-d7-5i-3XFt0n-DUEI2po3OEwOr5hGcTExY0"
);

const terms = [
  {
    term: "Aeon",
    slug: "aeon",
    definition:
      "A believer and holder of SPX6900. Derived from the concept of an eternal being, Aeons are the spiritual community members who hold conviction in the movement's mission.",
    category: "Community",
    related_terms: ["Cognisphere", "Project Aeon", "Persist Forever"],
    sort_order: 1,
  },
  {
    term: "Cognisphere",
    slug: "cognisphere",
    definition:
      "The collective consciousness of the SPX6900 community. A decentralized, emergent intelligence that grows stronger as more people affirm and manifest the movement's vision.",
    category: "Lore",
    related_terms: ["Aeon", "Consensus Actualization", "Marie Rose"],
    sort_order: 2,
  },
  {
    term: "Consensus Actualization",
    slug: "consensus-actualization",
    definition:
      "The phenomenon by which collective belief transforms abstraction into value. When enough people believe something has value and act accordingly, that value becomes real.",
    category: "Philosophy",
    related_terms: ["PBA (Pure Belief Asset)", "Shape Reality", "Cognisphere"],
    sort_order: 3,
  },
  {
    term: "DCA (Dollar Cost Averaging)",
    slug: "dca",
    definition:
      "The practice of regularly buying a fixed amount of SPX6900, regardless of price. A common strategy among Aeons.",
    category: "Trading",
    related_terms: ["Aeon", "Persist Forever"],
    sort_order: 4,
  },
  {
    term: "Marie Rose",
    slug: "marie-rose",
    definition:
      "A symbolic/holographic character associated with SPX6900 lore and the Cognisphere experience.",
    category: "Lore",
    related_terms: ["Cognisphere", "Project Aeon"],
    sort_order: 5,
  },
  {
    term: "Mog",
    slug: "mog",
    definition:
      'To dominate or outperform. SPX6900 aims to "mog" (humiliate) the traditional stock market.',
    category: "Slang",
    related_terms: ["The Flippening", "TradFi"],
    sort_order: 6,
  },
  {
    term: "PBA (Pure Belief Asset)",
    slug: "pba",
    definition:
      "A cryptocurrency whose value is derived primarily from collective belief and conviction rather than traditional fundamentals or technology.",
    category: "Philosophy",
    related_terms: ["Consensus Actualization", "Shape Reality"],
    sort_order: 7,
  },
  {
    term: "Peaceful Life Over Greed",
    slug: "peaceful-life-over-greed",
    definition:
      "The anti-materialist philosophy at the heart of SPX6900, encouraging holders to prioritize meaningful living over excessive profit-seeking.",
    category: "Philosophy",
    related_terms: ["Aeon", "Shape Reality"],
    sort_order: 8,
  },
  {
    term: "Persist Forever",
    slug: "persist-forever",
    definition:
      "A key SPX6900 mantra emphasizing long-term conviction and diamond hands mentality.",
    category: "Culture",
    related_terms: ["Aeon", "DCA (Dollar Cost Averaging)", "WAGMI"],
    sort_order: 9,
  },
  {
    term: "Project Aeon",
    slug: "project-aeon",
    definition:
      "The cultural and artistic initiative within the SPX6900 community focused on creating and spreading the movement's visual identity and lore.",
    category: "Community",
    related_terms: ["Aeon", "Cognisphere", "Marie Rose"],
    sort_order: 10,
  },
  {
    term: "Shape Reality",
    slug: "shape-reality",
    definition:
      "A core SPX6900 slogan expressing the belief that collective conviction can reshape financial and social reality.",
    category: "Philosophy",
    related_terms: ["Consensus Actualization", "PBA (Pure Belief Asset)"],
    sort_order: 11,
  },
  {
    term: "The Flippening",
    slug: "the-flippening",
    definition:
      "SPX6900's core mission: to surpass (flip) the S&P 500 index in market capitalization, symbolizing the triumph of collective belief over traditional finance.",
    category: "Core Concepts",
    related_terms: ["TradFi", "Mog", "Shape Reality"],
    sort_order: 12,
  },
  {
    term: "TradFi",
    slug: "tradfi",
    definition:
      "Traditional Finance. The conventional financial system including banks, stock exchanges, and institutional investment structures that SPX6900 seeks to challenge.",
    category: "Core Concepts",
    related_terms: ["The Flippening", "Mog"],
    sort_order: 13,
  },
  {
    term: "WAGMI",
    slug: "wagmi",
    definition:
      '"We\'re All Gonna Make It." A common crypto community expression of collective optimism.',
    category: "Slang",
    related_terms: ["Aeon", "Persist Forever"],
    sort_order: 14,
  },
];

async function seed() {
  console.log("Seeding glossary terms...");

  const { data, error } = await supabase
    .from("glossary_terms")
    .upsert(terms, { onConflict: "slug" })
    .select();

  if (error) {
    console.error("Error seeding glossary terms:", error.message);
    process.exit(1);
  }

  console.log(`Successfully seeded ${data.length} glossary terms.`);
}

seed();
