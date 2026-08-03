import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

const PER = [[0,57,2602739562],[1,98,298770080],[2,51,199010018],[3,198,3487940850],[4,94,505639656],[5,28,1861165656],[6,37,3068335270],[7,40,3575275861],[8,143,2736360094],[9,128,4041724127],[10,66,2045639527],[11,254,239950946],[12,114,1929213475],[13,162,2525989273],[14,215,2656360318],[15,25,86054644],[16,83,2289117040],[17,43,2283014186],[18,294,968906000],[19,179,2838048603],[20,140,2006435130],[21,83,1135075748],[22,41,1125649383],[23,189,4128479638],[24,221,4136681602],[25,83,3782729023],[26,27,2197883549],[27,46,1488832877],[28,244,2223475403],[29,159,4281981062],[30,26,1791197203],[31,170,3527416467],[32,187,3726143877],[33,158,2998991259],[34,200,1624816449],[35,53,126018198],[36,83,4129524381],[37,25,1960057914],[38,87,2859380345],[39,128,1322081666],[40,27,2758861157],[41,26,3208983183],[42,85,275934887],[43,51,3562574835],[44,53,3273761898],[45,40,2359644333],[46,104,2847262827],[47,111,3349242051]];
const TOTAL = [5209, 152772334];

const TOK = `<p><strong>Issue·#06·[[MID]]·Week·of·July·28,·2026</strong></p>
<p><strong>--------------------------------------------------------------------------</strong></p>
<p>One·of·the·quieter·weeks·in·the·Cognisphere.</p>
<p>The·Project·Aeon·girls·started·going·up·as·pfps,·and·somebody·made·sure·the·Aeons·who·couldn't·afford·one·could·still·put·a·girl·on.·Jinping·Labs·opened.·Austin·came·back·for·a·second·Friday.</p>
<p>In·Barcelona,·one·Aeon·said·he·would·be·at·the·table·whether·anybody·joined·him·or·not.</p>
<p>Here's·what·happened:</p>
<h3>THIS·WEEK·IN·THE·COGNISPHERE</h3>
<p><strong>Put·the·girl·on.</strong></p>
<p>The·Project·Aeon·girls·started·going·up·as·pfps·this·week.·Just·Aeons,·one·after·another,·putting·a·girl·where·their·old·pfp·used·to·be.</p>
<p>Every·one·of·them·is·unique.·That's·the·part·that·works,·you·can·tell·they're·together·and·you·can·still·tell·them·apart.</p>
<p>There·was·a·problem·with·that.·Not·everyone·can·afford·one.</p>
<p>So·<a·href[[EQ]]"https://x.com/MikeFlipthe500">@MikeFlipthe500</a>,·the·developer·who·built·the·SPX6900·Magazine·website·[[AMP]]amp;·also·the·Aeon·Builder,·has·given·the·site·an·update.·Choose·your·design,·make·the·one·you·want,·download·it.·Free.</p>
<p><a·href[[EQ]]"https://6900isbiggerthan500.com/builder"><strong>6900isbiggerthan500.com/builder</strong></a></p>
<p><a·href[[EQ]]"https://x.com/maddox00000">@maddox00000</a>·and·<a·href[[EQ]]"https://x.com/Matthew_C_Beck">@Matthew_C_Beck</a>·have·already·put·the·girl·on.</p>
<p>A·movement·that·only·lets·you·in·if·you·can·pay·isn't·a·movement.·It's·a·members'·club·with·better·branding.·This·week·somebody·spent·his·own·time·making·sure·the·door·stayed·open,·and·asked·for·nothing·back.</p>
<p>"Why·not·you[[Q]]"</p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HOv-YcnXYAAzOJU.jpg"·/></figure>
<p><strong>Jinping·Labs·opens.</strong></p>
<p><a·href[[EQ]]"https://x.com/user_aeon_one">@user_aeon_one</a>·has·built·the·Cognisphere·a·new·shop.·<a·href[[EQ]]"https://x.com/jinpingLabs">@jinpingLabs</a>·is·live,·and·Collection·One·<em>Quantum·Glitch</em>··is·in·it.·<a·href[[EQ]]"https://jinpinglabs.com">https://jinpinglabs.com</a></p>
<p>Shipping·opened·to·the·United·States.·Spain·went·on·within·days,·after·Aeons·asked.·Then·the·question·went·straight·back·out·to·everyone·else:·where·do·we·need·to·ship[[Q]]</p>
<p>Most·stores·decide·where·they'll·sell·and·wait·for·you·to·find·them.·This·one·is·being·drawn·by·the·people·who·want·to·be·on·the·map.</p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HOwA0ZCWYAA67zB.jpg"·/></figure>
<p><strong>Austin·came·back.</strong></p>
<p>One·week·ago·this·newsletter·covered·<a·href[[EQ]]"https://x.com/ilyaeon_alt">@ilyaeon_alt</a>·turning·a·Friday·at·Lucky·Lab·Coffee·into·a·chapter.·Plenty·of·things·get·covered·once.</p>
<p>This·week·<a·href[[EQ]]"https://x.com/ilyaeon_alt">@ilyaeon_alt</a>·came·back·and·<a·href[[EQ]]"https://x.com/THEIDEASPILL">@THEIDEASPILL</a>·met·him·there.·The·first·meet·up·is·an·event.·A·second·one·is·a·chapter.</p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HOwBcqxXYAAMKUv.jpg"·/></figure>
<h3>MOMENT·OF·THE·WEEK</h3>
<p><strong>"I'll·still·be·there."</strong></p>
<p>Thursday·30·July,·half·past·six·in·the·evening.·<a·href[[EQ]]"https://x.com/don_ninguno">@don_ninguno</a>·posted·the·details·of·the·Barcelona·meet-up·faborit,·Carrer·de·Còrsega·323,·just·off·Passeig·de·Gràcia.·Anyone·reading·was·welcome.</p>
<p>He·wrote·it·out·three·times.·Catalan,·Spanish,·English.·Nobody·made·him·do·that.·He·just·didn't·want·the·language·to·be·the·reason·somebody·stayed·home.</p>
<p>Then·he·added·this:</p>
<p><em>"Other·Aeons·may·not·be·able·to·come·this·week,·but·I'll·still·be·there.·You·never·know.·If·anyone·reads·this·and·is·interested,·they·will·find·me·there."</em></p>
<p>Read·that·again.·He·is·telling·you·in·advance·that·he·might·be·sitting·in·a·café·on·his·own,·and·that·he·is·going·anyway,·on·the·chance·that·one·stranger·reads·a·post·and·turns·up.</p>
<p>And·if·nobody·does,·he·has·a·plan·for·that·too.·<em>"I'll·use·the·trip·to·put·up·flyers·and·stickers·on·walls,·lampposts,·and·the·backs·of·buses."</em></p>
<p>This·is·what·building·actually·looks·like,·and·it·is·almost·never·the·part·anyone·photographs.·One·man,·a·café·table·he·might·sit·at·alone,·and·a·pocket·full·of·stickers·for·the·backs·of·buses.</p>
<p>He·also·wrote:·<em>"I·have·found·myself."</em></p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HOwCsOWWoAA9Cc3.jpg"·/></figure>
<h3>AEON·OF·THE·WEEK</h3>
<p><a·href[[EQ]]"https://x.com/MikeFlipthe500"><strong>@MikeFlipthe500</strong></a></p>
<p>He·saw·people·who·wanted·to·wear·the·movement·and·couldn't·afford·the·entry·fee,·so·he·built·the·way·in·and·gave·it·away.</p>
<p>Nobody·asked·him·to.</p>
<h3>QUOTE·OF·THE·WEEK</h3>
<p><a·href[[EQ]]"https://x.com/MustStopMurad"><strong>@MustStopMurad</strong></a></p>
<p><em>"It's·a·gigantic·marshmallow·test."</em></p>
<p>Said·on·Volleyball·Practice,·the·weekly·Space.</p>
<p><strong>Persist·Forever.</strong></p>
<p><strong>Credit·for·Artwork:</strong>·<a·href[[EQ]]"https://x.com/Arcane_vault">@Arcane_vault</a>·</p>
<p><em>SPX6900·Magazine·is·an·independent·third-party·publication.·Opinion·only.·Not·financial·advice.</em></p>`;

const ck = s => { let h=0; for (let i=0;i<s.length;i++){ h=(h*31 + s.charCodeAt(i))>>>0; } return h; };

/* The issue line uses a literal mid-dot, which could not double as the space
   token, so it travels as [[MID]]. The two checksum sets were taken either
   side of that substitution in the browser, so each is verified against the
   form it came from:
     bodyWithMid — placeholder in place   → matches TOTAL
     body        — real mid-dot restored  → matches PER (per-block) */
const bodyWithMid = TOK.split('·').join(' ');
const body = bodyWithMid.split('[[MID]]').join('·');

/* A block only ever opens with a block-level tag — testing for a bare '<'
   would split on any line that happens to start with an inline <a>. */
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
if (bodyWithMid.length !== TOTAL[0] || ck(bodyWithMid) !== TOTAL[1]) {
  bad.push(`body total: got [${bodyWithMid.length},${ck(bodyWithMid)}] want [${TOTAL[0]},${TOTAL[1]}]`);
}
if (bad.length) { console.error('MISMATCH (' + bad.length + '):\n' + bad.slice(0,12).join('\n')); process.exit(1); }

const payload = {
  cover: 'https://pbs.twimg.com/media/HOwEMpOXIAAcNxX.jpg',
  imgUsed: 4,
  excerpt: 'Issue #06, week of July 28, 2026: a quieter week. The Project Aeon girls go up as pfps and someone builds a free way in for Aeons who cannot afford one, Jinping Labs opens its doors, Austin returns for a second Friday, and in Barcelona one Aeon commits to the table whether anybody joins him or not.',
  body,
};
const outPath = join(__dirname, 'payloads', 'mag-cognisphere-weekly-6.json');
writeFileSync(outPath, JSON.stringify(payload));
console.log(`OK — all ${lines.length} blocks + total verified byte-exact. Wrote ${outPath} (body ${body.length} chars, mid-dots restored: ${(body.match(/·/g)||[]).length}).`);
