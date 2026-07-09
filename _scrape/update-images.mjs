import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const env = Object.fromEntries(
  readFileSync(join(ROOT, '.env.local'), 'utf8').split('\n').filter(Boolean)
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1)]; })
);
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const unsentinel = (s) => (s || '').split('[[AMP]]').join('&').split('[[EQ]]').join('=').split('[[Q]]').join('?');
const payload = (f) => JSON.parse(readFileSync(join(__dirname, 'payloads', f), 'utf8'));

const items = [
  { file: 'heehah-tyranny-of-measurement.json', slug: 'spx6900-tyranny-of-measurement', alt: 'SPX6900: Not Every Truth Yields to the Tyranny of Measurement' },
  { file: 'hyp3-my-opinion-on-cores-nft.json', slug: 'my-opinion-on-cores-nft', alt: 'My Opinion On Cores NFT' },
  { file: 'chang-memecoin-culture-young.json', slug: 'why-memecoin-culture-should-be-led-by-the-young', alt: 'Why Memecoin Culture Should Be Led by the Young' },
  { file: 'tdog-project-aeon.json', slug: 'project-aeon-art-crypto-belief', alt: 'Project Aeon: When Art, Crypto, and Belief Collide' },
  { file: 'tdog-culture-insiders-perspective.json', slug: 'spx6900-culture-an-insiders-perspective', alt: "SPX6900 Culture: An Insider's Perspective" },
];

for (const it of items) {
  const p = payload(it.file);
  const body = unsentinel(p.body);
  const imgs = (body.match(/<img /g) || []).length;
  const { error } = await supabase.from('posts')
    .update({ body_html: body, cover_image: p.cover || null, cover_image_alt: p.cover ? it.alt : null })
    .eq('slug', it.slug);
  console.log(error ? `FAILED ${it.slug}: ${error.message}` : `OK ${it.slug} — cover=${p.cover ? 'yes' : 'no'}, ${imgs} inline imgs`);
}
console.log('Done.');
