import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

/* Scraped from X's public article renderer (.x-article-body) rather than the
   logged-in Draft.js view, because the Chrome extension was unavailable.
   Verified beforehand that nothing is lost for this piece: the body carries
   18 uniform paragraphs, zero inline images, zero bold/italic runs and no
   links, so the two renderings agree. The publish timestamp is derived from
   the post's snowflake id (validated to the second against two earlier
   articles whose exact timestamps were captured from the logged-in view). */

const PER = [[0,115,1723666456],[1,132,2481518915],[2,38,1551588252],[3,425,1993772224],[4,180,1832534493],[5,336,3757468168],[6,157,1341596505],[7,178,2691815089],[8,447,699484531],[9,224,879441350],[10,204,2176760960],[11,54,3242609652],[12,85,135479673],[13,39,2717422795],[14,187,4085001072],[15,206,78930832],[16,16,635857119],[17,117,1215073101]];
const TOTAL = [3157, 318070953];

const TOK = `<p>Imagine·a·world·in·which·a·line·can·be·drawn·from·the·best·new·books,·films,·art,·etc,·to·spx·as·its·source.</p>
<p>Said·more·generally,·imagine·a·world·in·which·things·that·benefit·the·public·can·be·traced·back·to·spx·as·its·starting·point.</p>
<p>Why·would·this·be·valuable[[Q]]</p>
<p>First,·there·is·inherent·value·in·using·success·and·influence·to·create·things·for·public·enjoyment.·Any·worthwhile·society,·in·which·its·best·individuals,·after·succeeding·in·a·private·or·collective·venture,·historically·have·not·merely·kept·that·success·for·themselves,·but·rather·shared·it·with·the·rest·of·the·community.·I·personally·gravitate·towards·the·arts·but·there·is·no·shortage·of·ways·to·serve·the·public.</p>
<p>I·believe·strongly·that·there·is·a·lack·of·these·kinds·of·goals·today,·and·I·believe·even·more·strongly·(stronglier[[Q]])·that·the·public·craves·the·lofty·and·the·ambitious.</p>
<p>Second,·and·relatedly,·it·establishes·credibility·as·a·kind·of·role·model,·and·shows·the·public·that·when·you·win,·so·does·everyone·else.·This·kind·of·credibility·can·be·used·to·legitimize,·in·the·eyes·of·the·public,·and·especially·the·non-crypto·types·(of·which·there·are·many),·what·you·are·doing·and·why·there·is·value·in·it.·</p>
<p>Essentially,·something·tangible·that·can·be·pointed·to·and·used·as·an·example·or·reference·that·illuminates·an·otherwise·dark·and·murky·understanding.</p>
<p>Normally,·when·one·brings·to·mind·the·infrastructure·and·ways·in·which·something·like·this·is·typically·produced,·they·think·nonprofits,·foundations,·things·of·that·sort.·</p>
<p>A·reasonable·reaction·to·this·would·be·thinking·about·how·these·entities,·while·putting·out·the·image·that·they·exist·for·altruistic·and·public-beneficial·purposes,·actually·exist·to·enrich·those·involved·by·paying·six-figure·(or·more)·salaries·to·themselves·or·their·conspirators·in·what·amounts·to·a·fake·job·that·consists·of·pretending·to·be·important·and·going·to·expensive·and·fancy·fundraising·events·to·further·keep·the·party·going.·</p>
<p>And·in·addition,·and·most·importantly,·not·actually·benefitting·the·public·in·the·way·advertised,·but·rather·used·as·a·means·of·gaining·influence·or·status·for·private·and·personal·benefit·advancement·and·enrichment.·</p>
<p>The·infrastructure·is·being·poorly·utilized·by·bad·actors·(500),·but·it's·possible·to·imagine·a·world·in·which·it·is·well-utilized·by·good·actors·(6900)·that·are·aligned·with·its·intended·purpose.·</p>
<p>What·does·it·mean·to·flip·the·stock·market[[Q]]</p>
<p>On·one·level,·it·means·to·exceed·the·market·cap·of·the·standard·and·poors·500.</p>
<p>But·what·else·could·it·mean[[Q]]</p>
<p>To·me·it·also·means·replacing·the·existing·paradigm·and·assumptions·about·the·way·things·are·done·today·with·something·that·is·closer·to·the·ideals·of·truth,·beauty,·and·the·good.·</p>
<p>Ok·that's·a·bit·on·the·high-minded·side·and·perhaps·something·that·should·be·relegated·to·the·mind·of·an·indulgent·wordcel.·We're·at·the·point·where·all·the·hot·air·has·been·let·out·of·this·balloon.·</p>
<p>Although.</p>
<p>A·meme·that·does·more·to·serve·the·public·than·the·legacy·would·also·be·good·for·a·laugh·and·a·meme-in-itself.</p>`;

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
  cover: 'https://pbs.twimg.com/media/HPxwRWdWEAA-PJP.jpg',
  imgUsed: 0,
  excerpt: 'What if the best new books, films and art could be traced back to SPX as their source? A case that flipping the stock market means more than passing a market cap — it means putting the infrastructure of public benefit in the hands of people actually aligned with its purpose.',
  body,
};
const outPath = join(__dirname, 'payloads', 'aeon2567-not-another-spx-wordcel.json');
writeFileSync(outPath, JSON.stringify(payload));
console.log(`OK — all ${lines.length} blocks + total verified byte-exact. Wrote ${outPath} (body ${body.length} chars).`);
