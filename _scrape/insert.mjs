import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const env = Object.fromEntries(
  readFileSync(join(ROOT, '.env.local'), 'utf8')
    .split('\n').filter(Boolean)
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1)]; })
);
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// Reverse the query-string-safe sentinels used while exfiltrating scraped HTML.
const unsentinel = (s) =>
  (s || '').split('[[AMP]]').join('&').split('[[EQ]]').join('=').split('[[Q]]').join('?');

// Pull a body_html template literal for a given slug out of an existing repo script.
function bodyFromScript(file, slug) {
  const txt = readFileSync(join(ROOT, file), 'utf8');
  const re = new RegExp('slug:\\s*["\']' + slug + '["\'][\\s\\S]*?body_html:\\s*`([\\s\\S]*?)`');
  const m = txt.match(re);
  if (!m) throw new Error(`body_html not found for ${slug} in ${file}`);
  return m[1];
}

const payload = (f) => JSON.parse(readFileSync(join(__dirname, 'payloads', f), 'utf8'));

// ---- Newly scraped X articles (essays) -> content_type 'article' ----
const scraped = [
  { file: 'polymetric-hegelian-revolution.json',
    title: 'SPX6900: A Hegelian Revolution in Collective Consciousness',
    slug: 'spx6900-hegelian-revolution-collective-consciousness',
    author_name: 'polymetric', published_at: '2025-07-17T00:00:00Z',
    tags: ['philosophy', 'hegel', 'consciousness', 'belief'] },
  { file: 'heehah-tyranny-of-measurement.json',
    title: 'SPX6900: Not Every Truth Yields to the Tyranny of Measurement',
    slug: 'spx6900-tyranny-of-measurement',
    author_name: 'Heehah', published_at: '2026-05-21T00:00:00Z',
    tags: ['philosophy', 'culture', 'spirituality'] },
  { file: 'hyp3-my-opinion-on-cores-nft.json',
    title: 'My Opinion On Cores NFT',
    slug: 'my-opinion-on-cores-nft',
    author_name: 'HYP3', published_at: '2026-01-29T00:00:00Z',
    tags: ['nft', 'community', 'opinion', 'project-aeon'] },
  { file: 'chang-memecoin-culture-young.json',
    title: 'Why Memecoin Culture Should Be Led by the Young',
    slug: 'why-memecoin-culture-should-be-led-by-the-young',
    author_name: 'Chang', published_at: '2026-07-05T00:00:00Z',
    tags: ['culture', 'memecoins', 'opinion'] },
  { file: 'ebbie-authentic-human-coordination.json',
    title: 'Authentic Human Coordination Around a Shared Idea Has Economic Value',
    slug: 'authentic-human-coordination-economic-value',
    author_name: 'ebbie', published_at: '2026-04-10T00:00:00Z',
    tags: ['philosophy', 'ai', 'attention', 'networks'] },
  { file: 'ebbie-2020s-barbell.json',
    title: 'The 2020s Barbell: Bitcoin Is Your Bond, Tokenized Decentralized Communities Are Your Moonshot',
    slug: 'the-2020s-barbell-bitcoin-tdc-moonshot',
    author_name: 'ebbie', published_at: '2025-11-15T00:00:00Z',
    tags: ['macro', 'decentralization', 'network-state', 'philosophy'] },
  { file: 'ebbie-memecoins-irl-activity.json',
    title: 'Meme Coins Promoting IRL Activity Will Outcompete Coins That Do Not',
    slug: 'meme-coins-promoting-irl-activity',
    author_name: 'ebbie', published_at: '2025-10-17T00:00:00Z',
    tags: ['action', 'memecoins', 'strategy'] },
  { file: 'tdog-project-aeon.json',
    title: 'Project Aeon: When Art, Crypto, and Belief Collide',
    slug: 'project-aeon-art-crypto-belief',
    author_name: 'T-Dog', published_at: '2026-01-21T00:00:00Z',
    tags: ['nft', 'aeon', 'lore', 'art'] },
  { file: 'tdog-culture-insiders-perspective.json',
    title: "SPX6900 Culture: An Insider's Perspective",
    slug: 'spx6900-culture-an-insiders-perspective',
    author_name: 'T-Dog', published_at: '2025-03-28T00:00:00Z',
    tags: ['culture', 'community', 'guide'] },
];

// ---- Repo-prepared T-Dog pieces (never inserted). Bodies pulled from existing scripts. ----
const prepared = [
  { title: 'SPX6900 Amsterdam Conference', slug: 'spx6900-amsterdam-conference',
    author_name: 'T-Dog', published_at: '2026-03-25T00:00:00Z',
    cover_image: 'https://pbs.twimg.com/media/HEQc4webIAA0muv.jpg',
    excerpt: 'The SPX6900 community brings the Cognisphere into the physical world — builders, creators, and believers gather in Amsterdam.',
    tags: ['conference', 'amsterdam', 'irl', 'event'],
    body: bodyFromScript('update-articles.mjs', 'spx6900-amsterdam-conference') },
  { title: 'The Cognisphere Container', slug: 'the-cognisphere-container',
    author_name: 'T-Dog', published_at: '2025-11-21T00:00:00Z',
    cover_image: 'https://pbs.twimg.com/media/G6SImo0X0AAgF04.jpg',
    excerpt: 'A traveling immersive cypherpunk art installation syncing visitors into SPX6900 — a mobile node of the Cognisphere.',
    tags: ['art', 'cognisphere', 'irl', 'installation'],
    body: bodyFromScript('fix-articles.mjs', 'the-cognisphere-container') },
  { title: 'Aeons Are Building: A Guide to SPX6900 Community Websites, Apps & Channels',
    slug: 'aeons-are-building-guide-to-spx6900-community',
    author_name: 'T-Dog', published_at: '2025-05-30T00:00:00Z',
    cover_image: 'https://pbs.twimg.com/media/G7L17MgWcAAqQhD.jpg',
    excerpt: "Before you copy someone's conviction, ask yourself: do you truly understand what you're joining? A tour of every community resource built by Aeons.",
    tags: ['community', 'resources', 'guide'],
    body: bodyFromScript('seed-articles.mjs', 'aeons-are-building-guide-to-spx6900-community') },
  { title: "SPX6900's Most Significant Moments (2023-2025)",
    slug: 'spx6900-most-significant-moments-2023-2025',
    author_name: 'T-Dog', published_at: '2025-10-29T00:00:00Z',
    cover_image: 'https://pbs.twimg.com/media/G4cfpkTXcAAlrrN.jpg',
    excerpt: 'A comprehensive timeline of the movement, from a fair-launched token to a decentralized cultural phenomenon spanning the digital and physical worlds.',
    tags: ['timeline', 'history', 'milestones'],
    body: bodyFromScript('seed-articles.mjs', 'spx6900-most-significant-moments-2023-2025') },
  { title: 'SPX6900 Docs — All Resources in One Place',
    slug: 'spx6900-docs-all-resources',
    author_name: 'T-Dog', published_at: '2025-03-31T00:00:00Z',
    cover_image: 'https://pbs.twimg.com/media/GnXYsy1XQAAUGo5.jpg',
    excerpt: 'All the SPX6900 articles and resources compiled in one place — the Timeline, Fact Sheet, and key comparisons.',
    tags: ['docs', 'resources', 'index'],
    body: bodyFromScript('seed-articles.mjs', 'spx6900-docs-all-resources') },
];

function buildRows() {
  const rows = [];
  for (const a of scraped) {
    const p = payload(a.file);
    rows.push({
      title: a.title, slug: a.slug, excerpt: a.excerpt || unsentinel(p.excerpt),
      body_html: unsentinel(p.body), cover_image: p.cover || null,
      author_name: a.author_name, content_type: 'article', status: 'published',
      published_at: a.published_at, tags: a.tags, view_count: 0,
    });
  }
  for (const a of prepared) {
    rows.push({
      title: a.title, slug: a.slug, excerpt: a.excerpt,
      body_html: a.body, cover_image: a.cover_image,
      author_name: a.author_name, content_type: 'article', status: 'published',
      published_at: a.published_at, tags: a.tags, view_count: 0,
    });
  }
  return rows;
}

const DRY = process.argv.includes('--dry');

async function main() {
  const rows = buildRows();
  const { data: existing, error: exErr } = await supabase.from('posts').select('slug');
  if (exErr) { console.error('Failed to read existing slugs', exErr); process.exit(1); }
  const have = new Set((existing || []).map((r) => r.slug));

  console.log(`Prepared ${rows.length} rows. ${DRY ? '(DRY RUN)' : ''}\n`);
  let inserted = 0, skipped = 0;
  for (const r of rows) {
    if (have.has(r.slug)) {
      console.log(`SKIP (exists): ${r.slug}`);
      skipped++; continue;
    }
    const imgs = (r.body_html.match(/<img /g) || []).length;
    console.log(`${DRY ? 'WOULD INSERT' : 'INSERT'}: [${r.author_name}] "${r.title}"  (${(r.published_at||'').slice(0,10)}, ${r.body_html.length} chars, ${imgs} inline imgs, cover=${r.cover_image ? 'yes' : 'no'})`);
    if (DRY) continue;
    const { data, error } = await supabase.from('posts').insert(r).select('id').single();
    if (error) { console.error(`  FAILED: ${error.message}`); }
    else { console.log(`  OK id=${data.id}`); inserted++; }
  }
  console.log(`\nDone. Inserted ${inserted}, skipped ${skipped}.`);
}
main();
