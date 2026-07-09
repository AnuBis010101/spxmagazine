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

const payload = (f) => JSON.parse(readFileSync(join(__dirname, 'payloads', f), 'utf8'));

// ---- @Spx6900Magazine long-form articles -> SPX Magazine section ----
// The `spx-magazine` tag is the discriminator that routes these to
// /articles/magazine (see lib/constants MAGAZINE_TAG). Individual writer
// bylines are preserved inside each article body.
const MAG = 'spx-magazine';
const AUTHOR = 'SPX Magazine';

const articles = [
  { file: 'mag-cognisphere-weekly-2.json',
    title: 'The Cognisphere Weekly #2', slug: 'the-cognisphere-weekly-2',
    published_at: '2026-07-03T00:00:00Z',
    excerpt: 'While crypto cried, Aeons coordinated — a conference in South Carolina, Maddox’s 365-day DCA streak, 27 YouTube winners crowned, and the Aeon Terminal levels up.',
    tags: [MAG, 'weekly', 'community', 'cognisphere'] },
  { file: 'mag-cognisphere-weekly-1.json',
    title: 'The Cognisphere Weekly #1', slug: 'the-cognisphere-weekly-1',
    published_at: '2026-06-23T00:00:00Z',
    excerpt: 'They said we wouldn’t survive the bear. This week SPX listed on Korea’s two biggest exchanges, an Aeon built an un-censorable swap, and the movement took to the streets of Barcelona.',
    tags: [MAG, 'weekly', 'community', 'cognisphere'] },
  { file: 'mag-trillions.json',
    title: 'Trillions', slug: 'trillions',
    published_at: '2026-04-09T00:00:00Z',
    excerpt: 'How much is a trillion dollars? The path to $1T is compressing every cycle — and SPX6900 is positioned to become the fastest asset in history to reach it.',
    tags: [MAG, 'macro', 'markets', 'analysis'] },
  { file: 'mag-how-to-persist-forever.json',
    title: 'How to Persist Forever', slug: 'how-to-persist-forever',
    published_at: '2026-03-06T00:00:00Z',
    excerpt: 'Surviving the bear market is brutal. But the tourists leave, the grifters move on, and what remains are the believers who DCA gracefully and persist.',
    tags: [MAG, 'bear-market', 'conviction', 'strategy'] },
  { file: 'mag-peaceful-life-over-greed.json',
    title: 'Peaceful Life Over Greed', slug: 'peaceful-life-over-greed',
    published_at: '2026-02-23T00:00:00Z',
    excerpt: 'Greed has taken over everything. But peace isn’t found in chasing more — it’s found in believing in something bigger than yourself and stepping into the Cognisphere.',
    tags: [MAG, 'philosophy', 'cognisphere', 'culture'] },
  { file: 'mag-finite-time.json',
    title: 'Finite Time', slug: 'finite-time',
    published_at: '2026-02-12T00:00:00Z',
    excerpt: 'We live on borrowed time yet act as though we’ll be here forever. The next five years are coming regardless — the only question is where you’ll be when they arrive.',
    tags: [MAG, 'philosophy', 'time', 'conviction'] },
  { file: 'mag-stop-trading.json',
    title: 'Stop Trading', slug: 'stop-trading',
    published_at: '2026-01-29T00:00:00Z',
    excerpt: 'Trading is a zero-sum game that leads to unhappiness and ruin. History keeps repeating from 1929 to today — the real solution is to stop trading and believe in something.',
    tags: [MAG, 'trading', 'history', 'philosophy'] },
  { file: 'mag-ai-revolution.json',
    title: 'The AI Revolution', slug: 'the-ai-revolution',
    published_at: '2026-01-22T00:00:00Z',
    excerpt: 'The idea of a “secure” job in 2026 is laughable. AI is coming for the four pillars of certainty at once — stable income, shelter, community, and identity.',
    tags: [MAG, 'ai', 'macro', 'society'] },
  { file: 'mag-finding-hope-2026.json',
    title: 'Finding Hope in 2026', slug: 'finding-hope-in-2026',
    published_at: '2026-01-15T00:00:00Z',
    excerpt: 'In a world where hope is becoming increasingly rare, billions feel outcast by financial constraints. 2025 showed the old playbook is breaking — and true assets can’t be taken.',
    tags: [MAG, 'macro', 'philosophy', 'hope'] },
];

function buildRows() {
  return articles.map((a) => {
    const p = payload(a.file);
    return {
      title: a.title, slug: a.slug,
      excerpt: a.excerpt || unsentinel(p.excerpt),
      body_html: unsentinel(p.body), cover_image: p.cover || null,
      author_name: AUTHOR, content_type: 'article', status: 'published',
      published_at: a.published_at, tags: a.tags, view_count: 0,
    };
  });
}

const DRY = process.argv.includes('--dry');

async function main() {
  const rows = buildRows();
  const { data: existing, error: exErr } = await supabase.from('posts').select('slug');
  if (exErr) { console.error('Failed to read existing slugs', exErr); process.exit(1); }
  const have = new Set((existing || []).map((r) => r.slug));

  console.log(`Prepared ${rows.length} SPX Magazine rows. ${DRY ? '(DRY RUN)' : ''}\n`);
  let inserted = 0, skipped = 0;
  for (const r of rows) {
    if (have.has(r.slug)) { console.log(`SKIP (exists): ${r.slug}`); skipped++; continue; }
    const imgs = (r.body_html.match(/<img /g) || []).length;
    console.log(`${DRY ? 'WOULD INSERT' : 'INSERT'}: "${r.title}"  (${(r.published_at||'').slice(0,10)}, ${r.body_html.length} chars, ${imgs} inline imgs, cover=${r.cover_image ? 'yes' : 'no'}, tags=[${r.tags.join(', ')}])`);
    if (DRY) continue;
    const { data, error } = await supabase.from('posts').insert(r).select('id').single();
    if (error) { console.error(`  FAILED: ${error.message}`); }
    else { console.log(`  OK id=${data.id}`); inserted++; }
  }
  console.log(`\nDone. Inserted ${inserted}, skipped ${skipped}.`);
}
main();
