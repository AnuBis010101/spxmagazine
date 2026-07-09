import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
const env = Object.fromEntries(readFileSync('.env.local','utf8').split('\n').filter(Boolean).map(l=>{const i=l.indexOf('=');return [l.slice(0,i),l.slice(i+1)];}));
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const covers = [
  { slug:'the-2020s-barbell-bitcoin-tdc-moonshot', key:'G5xfbiaXIAABbLJ', alt:'The 2020s Barbell' },
  { slug:'authentic-human-coordination-economic-value', key:'HFgfEbsW8AEqwm8', alt:'Authentic Human Coordination Around a Shared Idea Has Economic Value' },
  { slug:'meme-coins-promoting-irl-activity', key:'G3fvWofWQAARDQj', alt:'Meme Coins Promoting IRL Activity Will Outcompete Coins That Do Not' },
];
for (const c of covers) {
  const { error } = await sb.from('posts').update({ cover_image:`https://pbs.twimg.com/media/${c.key}.jpg`, cover_image_alt:c.alt }).eq('slug', c.slug);
  console.log(error ? `FAILED ${c.slug}: ${error.message}` : `OK cover set: ${c.slug}`);
}
// Scan ALL published community articles for any still missing a cover
const { data } = await sb.from('posts').select('title,slug,cover_image,content_type,tags').eq('status','published').eq('content_type','article');
const noCover = data.filter(p=>!p.cover_image && !(p.tags||[]).includes('spx-magazine'));
console.log(`\nCommunity articles still WITHOUT a cover: ${noCover.length}`);
noCover.forEach(p=>console.log('   - '+p.title));
