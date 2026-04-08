import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://hvmndangtzarsnqgnuky.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bW5kYW5ndHphcnNucWdudWt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDYyNTQ1MSwiZXhwIjoyMDkwMjAxNDUxfQ.oWPVawa-d7-5i-3XFt0n-DUEI2po3OEwOr5hGcTExY0"
);

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const loreTerms = [
  {
    term: "AEON",
    definition:
      "The name given to SPX6900 token holders. The word means 'eternity' in ancient Latin, symbolizing the timeless commitment of the community to the mission.",
    category: "Lore",
    related_terms: ["Cognisphere", "Persist Forever"],
  },
  {
    term: "NO LEWD",
    definition:
      "A foundational community rule: sexual content is strictly forbidden within the SPX6900 ecosystem. This keeps the community focused, respectful, and welcoming to all.",
    category: "Rules",
    related_terms: ["Kill Them With Love"],
  },
  {
    term: "THE ONLY ENEMY IS TRADFI",
    definition:
      "The community operates as PvE (player vs. environment), not PvP (player vs. player). It does not attack other crypto communities. The sole focus is surpassing the S&P 500 and challenging traditional finance.",
    category: "Philosophy",
    related_terms: ["The Flippening", "6900 Is A Bigger Number Than 500"],
  },
  {
    term: "THE GIRL IS CUTE",
    definition:
      "Marie Rose from Dead Or Alive is the beloved project mascot. This phrase is a humorous, memetic answer to the question 'Why will SPX6900 pump?'",
    category: "Lore",
    related_terms: ["Aeon"],
  },
  {
    term: "6900 IS A BIGGER NUMBER THAN 500",
    definition:
      "A playful yet profound statement suggesting that the S&P 500 management is artificial and untrustworthy, and that the collective belief of Aeons surpasses old finance systems.",
    category: "Philosophy",
    related_terms: ["The Only Enemy Is TradFi", "The Flippening"],
  },
  {
    term: "PEACEFUL LIFE OVER GREED",
    definition:
      "A core philosophy opposing quick-pump chasing. It advocates long-term holding and building a resilient, antifragile community rather than seeking short-term profits.",
    category: "Philosophy",
    related_terms: ["Stop Trading And Believe In Something", "DCA, Chill And Shill"],
  },
  {
    term: "PERSIST FOREVER",
    definition:
      "Aeons will continue fighting forever with inexhaustible resilience. No matter the market conditions, the community endures and grows stronger.",
    category: "Philosophy",
    related_terms: ["Aeon", "Peaceful Life Over Greed"],
  },
  {
    term: "KILL THEM WITH LOVE",
    definition:
      "No trashtalking is allowed in the community. Love and positivity are recommended even toward SPX6900 detractors and critics. Kindness is the ultimate weapon.",
    category: "Rules",
    related_terms: ["Praying For Your Success", "No Lewd"],
  },
  {
    term: "DCA, CHILL AND SHILL",
    definition:
      "Dollar Cost Averaging is recommended to avoid entry-point stress. The mantra promotes peaceful, stress-free accumulation combined with organic social media promotion of the project.",
    category: "Strategy",
    related_terms: ["Peaceful Life Over Greed", "There Is No Chart"],
  },
  {
    term: "THERE IS NO CHART",
    definition:
      "The community avoids technical analysis and chart-sharing. The focus is on the long-term mission and belief in the project, not short-term price speculation or discussion.",
    category: "Rules",
    related_terms: ["Stop Trading And Believe In Something", "DCA, Chill And Shill"],
  },
  {
    term: "YOU'RE A BOT AND THAT'S OK",
    definition:
      "A witty response to accusations that community members are bots. The community has conducted operations against FUD spreaders, turning the accusation into a badge of honor.",
    category: "Lore",
    related_terms: ["Aeon", "Aeons Are Always Euphoric"],
  },
  {
    term: "PRAYING FOR YOUR SUCCESS",
    definition:
      "The community encourages love, hope, and genuine belief toward everyone, including critics and those outside the movement. Positivity is a cornerstone value.",
    category: "Philosophy",
    related_terms: ["Kill Them With Love", "Be The Change You Want To See"],
  },
  {
    term: "FEW UNDERSTAND MANY WILL",
    definition:
      "A conviction that SPX6900's unique characteristics will eventually be recognized by everyone. Early believers (the few) know what the masses will eventually discover.",
    category: "Lore",
    related_terms: ["Aeon", "Cognisphere"],
  },
  {
    term: "STOP TRADING AND BELIEVE IN SOMETHING",
    definition:
      "The main motto of the entire SPX6900 project. It encourages belief-based conviction over quick profits and day-trading. Hold, believe, and let the mission unfold.",
    category: "Philosophy",
    related_terms: ["Peaceful Life Over Greed", "There Is No Chart", "Persist Forever"],
  },
  {
    term: "COGNISPHERE",
    definition:
      "A shared consciousness where Aeons unite into one collective entity. The Cognisphere represents the hive mind of the community, bound by shared belief and purpose.",
    category: "Lore",
    related_terms: ["Aeon", "Few Understand Many Will"],
  },
  {
    term: "HEALING TECHNOLOGY",
    definition:
      "A community legend that autoheal cans possess the power to restore spiritual and physical health, as well as karma. A beloved piece of SPX6900 mythology.",
    category: "Lore",
    related_terms: ["Cognisphere", "Aeon"],
  },
  {
    term: "BE THE CHANGE YOU WANT TO SEE",
    definition:
      "Personal initiatives are encouraged within the community with no judgment. Love-based action drives improvement, and every Aeon is empowered to contribute in their own way.",
    category: "Philosophy",
    related_terms: ["Praying For Your Success", "Kill Them With Love"],
  },
  {
    term: "AEONS ARE ALWAYS EUPHORIC",
    definition:
      "The community thrives on daily engagement and genuine enthusiasm without letting financial considerations interfere with their promotion efforts and positive energy.",
    category: "Lore",
    related_terms: ["Aeon", "Persist Forever"],
  },
];

async function seed() {
  console.log("Seeding glossary with 18 lore expressions...\n");

  let inserted = 0;
  let skipped = 0;

  for (const entry of loreTerms) {
    const slug = slugify(entry.term);

    // Check if already exists
    const { data: existing } = await supabase
      .from("glossary_terms")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existing) {
      console.log(`  SKIP: "${entry.term}" already exists`);
      skipped++;
      continue;
    }

    const { error } = await supabase.from("glossary_terms").insert({
      term: entry.term,
      slug,
      definition: entry.definition,
      category: entry.category,
      related_terms: entry.related_terms,
      sort_order: 0,
    });

    if (error) {
      console.error(`  ERROR inserting "${entry.term}":`, error.message);
    } else {
      console.log(`  OK: "${entry.term}"`);
      inserted++;
    }
  }

  console.log(`\nDone! Inserted: ${inserted}, Skipped: ${skipped}`);
}

seed().catch(console.error);
