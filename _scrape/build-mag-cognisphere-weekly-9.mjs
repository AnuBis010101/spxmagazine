import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

/* Scraped from X's public article renderer (.x-article-body). Confirmed
   in-browser before transfer that it serves everything this issue carries:
   28 paragraphs, 4 inline images in position, 18 bold and 18 italic runs and
   8 links. The recovered plain text was compared against the DOM's own
   innerText and matched exactly at 3,000 characters.

   X double-wraps every bold run (<b> inside <strong>), so the extractor
   tracks which formats an ancestor already opened and emits one tag rather
   than the 21 redundant nestings a naive walk produces.

   The public view exposes only a date, so the publish timestamp is derived
   from the post's snowflake id — the same method validated to the second
   against Weekly #7, whose exact stamp came from the logged-in view. */

const PER = [[0,367,2578984848],[1,117,3777002929],[2,74,751802638],[3,115,1500887439],[4,44,2026021432],[5,78,462010891],[6,87,1275675608],[7,93,430448689],[8,199,1512806132],[9,45,3464864951],[10,78,2822364883],[11,93,1895620966],[12,150,3485212146],[13,92,2165195896],[14,214,2091987272],[15,126,176197241],[16,70,1641464136],[17,78,340057209],[18,267,2938760153],[19,115,4271016386],[20,410,3191741665],[21,317,3745994833],[22,78,249641029],[23,239,4084578285],[24,136,2350115146],[25,112,4215972515],[26,90,1721753841],[27,73,518803612],[28,50,2882185358],[29,134,1937338727],[30,104,516597734],[31,50,2246847639]];
const TOTAL = [4326, 547812251];

const TOK = `<p>As·of·today,·we're·236·days·into·2026.·The·long·summer·evenings·are·drawing·in·and·Autumn·Is·on·the·horizon.·The·consensus·on·twitter·is·that·the·4·year·cycle·is·playing·out·perfectly,·and·that·October·will·be·the·turning·point.·Surely·it's·not·that·easy,·right[[Q]]·With·only·129·days·left·until·we·enter·2027·it's·starting·to·seem·like·it·could·be·time·to·focus.</p>
<p><em><strong>New·on·the·site.·</strong></em>A·dedicated·Project·Aeon·page·went·live·on·the·Magazine·this·week.·</p>
<p>"if·we·could·hardness·the·power·of·God,·could·we·flip·the·S[[AMP]]P500[[Q]]"·</p>
<p>3,333·Aeons,·born·out·of·experiment·embraced·by·the·community·it·was·only·right·they·got·their·own·section.·</p>
<p>It's·live·now·at·spx6900magazine.com.</p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HQhVS_PXsAE9mh5.jpg"·/></figure>
<p><em><strong>Aeons·head·to·Reddit.·</strong></em>The·push·this·week·is·r/SPX6900·</p>
<p>Cross-post·your·work,·comment·under·other·Aeon's·posts,·build·a·second·home·off·of·X.·</p>
<p>The·timeline·is·noisy·and·forgetful,·it's·a·constant·battle·for·attention.·A·thread·on·Reddit·stays·put,·searchable,·archived,·logged·for·the·next·Aeon·that·shows·up·asking·the·same·question.·</p>
<p>If·you·post·on·X,·post·on·Reddit·too.·</p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HQhXPzPWQAE_96V.jpg"·/></figure>
<p>A·post·<a·href[[EQ]]"https://x.com/maddox00000">@maddox00000</a>·made·this·week·on·Reddit:·</p>
<p>"800k·+·views!·>·Came·up·with·relevant·post·(a·screenshot·of·a·highly·popular·post·I·saw·on·the·internet·and·added·a·thought-provoking·title)"·</p>
<p><em><strong>Austin,·again.</strong></em>·The·chapter·ran·its·regular·Friday·meet-up.·</p>
<p><a·href[[EQ]]"https://x.com/leongaban">@leongaban</a>·says:·"we·talked·stories,·SPX,·crypto·/·defi·the·power·of·movements,·believing·in·something,·and·dozens·of·other·topics,·great·to·touch·grass·on·green·days."·</p>
<p>We·are·watching·the·Austin·chapter·quickly·become·a·physical·hub·for·the·community·on·a·weekly·basis.·Exciting·to·see.·</p>
<p>Have·you·considered·starting·a·local·chapter·in·your·city·Aeon[[Q]]</p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HQha6uJXUAI_rKi.jpg"·/></figure>
<p><em><strong>"This·was·a·great·experiment."··</strong></em><a·href[[EQ]]"https://x.com/SPX6900LA"><em><strong>@SPX6900LA</strong></em></a><em><strong>·held·SPX6900's·first·ever·artist·exhibition·on·the·Venice·Beach·boardwalk·in·California·on·Saturday.·</strong></em></p>
<p><em><strong>Work·from·10·talented·Aeons·within·the·community·on·display·for·the·world·to·see.·</strong></em></p>
<p><a·href[[EQ]]"https://x.com/@spx6900LA"><em><strong>@spx6900LA</strong></em></a><em><strong>·said:·"That·was·a·great·experiment,·we're·looking·forward·to·doing·another·very·soon·with·a·few·improvements.·We·had·some·conversations·with·groups·of·different·people·and·handed·out·</strong></em><a·href[[EQ]]"https://x.com/captainvess"><em><strong>@captainvess</strong></em></a><em><strong>·gift·cards."·</strong></em></p>
<p><em><strong>A·year·ago·Aeons·only·existed·on·the·timeline,·one·year·two·conferences·later·and·the·Cognisphere·continues·to·grow·in·real·time.·Aeons·creative·outlet·will·surely·reach·a·certain·boiling·point·where·there·are·so·many·SPX6900·events·happening·that·it·becomes·hard·not·to·take·notice.·</strong></em></p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HQhgMuuXwAA_8w-.jpg"·/></figure>
<p><a·href[[EQ]]"https://x.com/maddox00000"><em><strong>@maddox00000</strong></em></a>··reaches·day·428·of·DCA'ing·$1,000·into·SPX6900·every·single·day.·An·incredible·achievement·demonstrating·unshakeable·belief,·conviction·and·discipline.·</p>
<p>"·An·Aeon·who·DCA's·any·amount·every·day·does·more·for·SPX600·than·a·person·who·makes·a·big·lump·sun·buy.·Consistency·is·power."·</p>
<p>Maddox·is·single·handedly·showing·the·community·that·conviction·and·consistency·will·always·beat·timing.·</p>
<p><a·href[[EQ]]"https://x.com/muststopmurad"><em><strong>@muststopmurad</strong></em></a>·</p>
<p>"Growing·up·is·realising·that·charts·are·not·the·path·to·wealth."·</p>
<p><em><strong>Persist·Forever.·</strong></em></p>
<p><em><strong>Credit·for·Artwork:·</strong></em><a·href[[EQ]]"https://x.com/Arcane_vault"><em><strong>@Arcane_vault</strong></em></a>·</p>
<p>SPX6900·Magazine·is·an·independent·third-party·publication.·Opinion·only.·Not·financial·advice.·
</p>
<p><em><strong>SPX6900·Magazine</strong></em>
</p>`;

const ck = s => { let h=0; for (let i=0;i<s.length;i++){ h=(h*31 + s.charCodeAt(i))>>>0; } return h; };

/* No literal mid-dot and no NBSP anywhere in this issue (checked in-browser by
   codepoint), so the space token reverses cleanly with nothing to restore.
   Every sentinel is reversed here rather than left for insert time, which
   makes the checksums below verify the finished HTML rather than a halfway
   form — insert's own unsentinel pass is then a no-op. */
const body = TOK
  .split('·').join(' ')
  .split('[[Q]]').join('?')
  .split('[[EQ]]').join('=')
  .split('[[AMP]]').join('&');

/* A block only ever opens with a block-level tag — testing for a bare '<'
   would split on any line that happens to start with an inline <a>, and the
   last two blocks genuinely carry a <br>-derived newline before </p>. */
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
  cover: 'https://pbs.twimg.com/media/HQhGS7SWUAM_Hjs.jpg',
  imgUsed: 4,
  excerpt: '236 days into 2026, and the consensus says October is the turning point. A dedicated Project Aeon page goes live on the Magazine, the push moves to r/SPX6900, Austin runs another Friday, Los Angeles holds SPX6900’s first artist exhibition on the Venice Beach boardwalk, and Maddox reaches day 428 of DCA’ing.',
  body,
};
const outPath = join(__dirname, 'payloads', 'mag-cognisphere-weekly-9.json');
writeFileSync(outPath, JSON.stringify(payload));
console.log(`OK — all ${lines.length} blocks + total verified byte-exact. Wrote ${outPath} (body ${body.length} chars).`);
