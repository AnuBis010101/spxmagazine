import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

/* Scraped from X's public article renderer (.x-article-body) rather than the
   logged-in Draft.js view, because the Chrome extension was unavailable.
   Verified beforehand that nothing is lost for this piece: 9 uniform
   paragraphs, zero inline images, zero bold/italic runs, one link. The
   publish timestamp is derived from the post's snowflake id (validated to the
   second against two earlier articles whose exact timestamps were captured
   from the logged-in view). */

const PER = [[0,592,3427027668],[1,243,3944559920],[2,353,1285177681],[3,391,2935615721],[4,581,3363761186],[5,644,985164672],[6,65,3762576499],[7,24,483135236],[8,93,1681794886]];
const TOTAL = [2994, 80800687];

const TOK = `<p>The·growth·of·belief·influences·every·part·of·our·personality,·it·is·not·just·a·development·of·ideas,·but·a·desire·to·express·itself·through·action.·Belief·is·something·that·is·given,·not·something·earned.·It's·a·form·of·grace·which·comes·with·faith.·It·comes·to·people·in·different·ways,·but·mostly.·through·experience·of·senses·and·observing·the·world.·Very·few·men·come·to·believe·in·anything·in·life·because·of·abstract·argument.·There·are·few·men·that·have·the·intellect's·capable·of·focusing·on·such·arguments;·therefore·they·are·not·moved·by·abstractions·they·don't·understand.·</p>
<p>The·rest·of·us,·the·ones·who·have·chosen·to·believe·in·more·than·just·our·own·existence·have·come·to·do·so·again,·from·experience,·what·we·learn·and·what·we're·told.·So·what·is·it·that·separates·the·two·groups·other·than·intellect[[Q]]·</p>
<p>The·richest·nations·have·become·the·poorest·in·spiritual·terms,·debatably·the·system·itself·or·society·as·we·know·it·has·done·its·upmost·to·stomp·out·any·sort·of·belief·in·something·more·than·oneself.··For·the·most·part·why·one·person·believes·in·something·whole·heartedly·without·factual·evidence·and·why·others·simply·cannot·remains·a·mystery.·</p>
<p>Is·the·explanation·for·our·world·spiritual·or·material[[Q]]·Life·as·we·know·it·is·a·concept·that·belongs·to·time.·We·are·born·in·time,·live·in·time·and·die·in·time·and·without·time·the·sequence·of·causes·and·effects·that·make·up·our·world·cannot·exist,·but·if·Time·is·not·the·ultimate·reality·then·there·must·be·a·reality·where·everything·has·already·happened·or·continues·to·happen.·</p>
<p>we're·taught·that·when·time·has·passed·that·it·is·gone·forever·and·the·future·is·yet·to·happen·but·what·if·that's·not·true[[Q]]·Einstein·talked·about·this·in·his·theory·of·relativity;·"The·distinction·between·the·past,·present,·and·future·is·only·a·stubbornly·persistent·illusion."·The·theory·suggests·that·time·and·space·are·fused·together·into·a·four-dimensional·fabric·called·"spacetime"·Such·theories·have·since·been·considered·facts·and·is·one·of·the·most·profound·conclusions·of·modern·physics·now·called·"time·dilation"·also·known·as·"Eternalism"·or·"block·universe"·</p>
<p>in·short·this·means·that·1626,·1809·and·2035·and·2050·all·exist·simultaneously.·Our·consciousness·is·just·set·for·the·coordinates·of·2026.·If·theoretically·it's·still·2008·somewhere·and·Bitcoin·is·yet·to·be·created,·if·those·days·still·exist,·who's·to·say·we're·not·living·through·the·same·phenomenon·with·SPX6900[[Q]]·Perhaps·in·2029·on·another·timeline·spx·is·already·a·massive·success.·This·would·explain·why·Aeons·seem·to·be·able·to·find·unwavering·belief·for·SPX6900·comes·to·them·with·ease·while·others·that·take·the·time·to·research·and·study·do·so·to·no·prevail,·or·is·this·just·a·result·of·some·peoples·ability·to·believe[[Q]]··</p>
<p>Maybe·in·2042·the·Stock·market·has·already·been·flipped.··</p>
<p>Persist·Forever.·</p>
<p>Credit·for·artwork:·<a·href[[EQ]]"https://x.com/littlemissponzi">@littlemissponzi</a>·</p>`;

const ck = s => { let h=0; for (let i=0;i<s.length;i++){ h=(h*31 + s.charCodeAt(i))>>>0; } return h; };
const body = TOK.split('·').join(' ');

const OPENS_BLOCK = /^<(p>|h2>|h3>|figure>)/;
const lines = [];
for (const l of body.split('\n')) {
  if (OPENS_BLOCK.test(l) || lines.length === 0) lines.push(l);
  else lines[lines.length - 1] += '\n' + l;
}

let bad = [];
if (lines.length !== PER.length) bad.push(`BLOCK COUNT ${lines.length} != ${PER.length}`);
lines.forEach((l, i) => { const e = PER[i]; if (!e) return;
  if (l.length !== e[1] || ck(l) !== e[2]) bad.push(`block ${i}: got [${l.length},${ck(l)}] want [${e[1]},${e[2]}] :: ${JSON.stringify(l.slice(0,70))}`); });
if (body.length !== TOTAL[0] || ck(body) !== TOTAL[1]) {
  bad.push(`body total: got [${body.length},${ck(body)}] want [${TOTAL[0]},${TOTAL[1]}]`);
}
if (bad.length) { console.error('MISMATCH (' + bad.length + '):\n' + bad.slice(0,12).join('\n')); process.exit(1); }

const payload = {
  cover: 'https://pbs.twimg.com/media/HPwNRXPXkAAZF16.jpg',
  imgUsed: 0,
  excerpt: 'Belief is given rather than earned, and it arrives through the senses rather than through argument. An essay on why conviction comes easily to some and never to others, by way of Einstein, eternalism, and the possibility that on some other coordinate the stock market has already been flipped.',
  body,
};
const outPath = join(__dirname, 'payloads', 'mag-what-is-belief.json');
writeFileSync(outPath, JSON.stringify(payload));
console.log(`OK — all ${lines.length} blocks + total verified byte-exact. Wrote ${outPath} (body ${body.length} chars).`);
