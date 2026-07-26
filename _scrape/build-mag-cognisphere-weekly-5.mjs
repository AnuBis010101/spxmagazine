import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

const PER = [[0,38,2957352376],[1,88,2918699108],[2,266,1007051829],[3,48,2198947854],[4,28,1850083404],[5,38,3128661312],[6,41,2478562102],[7,175,1662822246],[8,107,2746111274],[9,425,1176442794],[10,68,1153924877],[11,83,4294878374],[12,59,4128125649],[13,194,3683061010],[14,258,2077547213],[15,337,3719293448],[16,139,1412741848],[17,83,385604403],[18,42,3869391489],[19,374,1679656346],[20,92,2043897975],[21,83,2068640100],[22,27,3270985341],[23,47,1343209730],[24,171,3357410148],[25,112,3934000124],[26,73,2646328046],[27,29,3238156125],[28,51,314952750],[29,154,2403678812],[30,109,632213474],[31,25,1358189594],[32,81,3451889183],[33,227,3389858968],[34,26,780409487],[35,81,2837158501],[36,89,1253790731],[37,40,2359644333],[38,138,1917590385],[39,111,3349242051]];
const TOTAL = [4696, 2760603290];

const TOK = `<p>Issue·#05·Week·of·July·21,·2026</p>
<p>---------------------------------------------------------------------------------</p>
<p>Aeons·have·been·meeting·for·months.·Conferences,·dinners,·meet·ups·across·the·world.·This·week·they·started·locking·down·permanent·locations.·Texas·has·a·chapter·with·a·regular·Friday·spot.·Barcelona·has·a·chapter·and·a·new·chat·dedicated·to·Spanish·speakers.</p>
<p>And·in·Zurich,·two·Aeons·meet·by·chance.·</p>
<p>Here's·what·happened.</p>
<h3>This·Week·in·the·Cognisphere:</h3>
<p><strong>Austin·activates.</strong></p>
<p><a·href[[EQ]]"https://x.com/ilyaeon_alt">@ilyaeon_alt</a>·has·organised·an·SPX·chapter·in·Texas·and·called·it·what·it·is.·A·local·node,·the·first·of·hopefully·hundreds.</p>
<p>Every·Friday·at·Lucky·Lab·Coffee,·2421·San·Antonio·St,·Aeons·can·turn·up·to·talk,·and·explore·ideas.</p>
<p>The·location·is·deliberate.·It·sits·in·the·middle·of·the·University·of·Texas·at·Austin,·roughly·55,000·students·with·another·20,000·faculty·and·staff·around·them.·Somewhere·near·75,000·people·walking·past·the·same·coffee·shop·every·week,·and·<a·href[[EQ]]"https://x.com/ilyaeon_alt">@ilyaeon_alt</a>,·<a·href[[EQ]]"https://x.com/unc6900">@unc6900</a>·and·the·local·Aeons·intend·to·make·sure·all·of·them·hear·about·SPX.</p>
<p>If·you're·an·Aeon·in·Texas,·you·know·where·to·be·on·a·Friday.</p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HOLwLdMXkAApJW8.jpg"·/></figure>
<p><strong>Barcelona,·and·a·room·of·their·own.</strong></p>
<p><a·href[[EQ]]"https://x.com/don_ninguno">@don_ninguno</a>·and·<a·href[[EQ]]"https://x.com/movement6900">@movement6900</a>·met·at·Faborit·on·Carrer·de·Còrsega·and·turned·it·into·a·chapter.</p>
<p>The·mission·has·two·halves.·Carry·SPX·into·their·region,·and·hold·the·line·for·Spanish-speaking·Aeons·until·more·chapters·exist·to·take·the·weight.·They·have·since·opened·a·Spanish·language·chat·so·that·corner·of·the·Cognisphere·has·a·room·of·its·own.</p>
<p>Worth·pausing·on·that·second·half.·Spanish·is·the·second·most·spoken·native·language·on·earth,·behind·only·Mandarin,·with·close·to·half·a·billion·native·speakers.·Until·this·week,·essentially·every·one·of·them·who·found·SPX6900·had·to·find·it·in·English.·Two·men·in·a·café·have·just·changed·that,·because·nobody·else·was·going·to.</p>
<p>Two·men·who·barely·knew·each·other·a·few·months·ago,·now·the·only·people·in·their·own·city·they·can·talk·to·about·this·face·to·face.</p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HOLxFXVWwAA5iLK.jpg"·/></figure>
<p><strong>Lunch,·and·a·plan.</strong></p>
<p><a·href[[EQ]]"https://x.com/GrillapeTRW">@GrillapeTRW</a>·and·<a·href[[EQ]]"https://x.com/itscela100">@itscela100</a>·met·for·their·first·regional·chapter·meetup.·Lunch,·and·a·conversation·about·running·more·of·them·to·grow·together.·Hashtagged,·correctly.·<a·href[[EQ]]"https://x.com/search[[Q]]q[[EQ]]%23proofofhuman[[AMP]]src[[EQ]]hashtag_click">#proofofhuman</a>.</p>
<p>Grillape's·summary·needs·no·help·from·us:·<em>"This·is·how·you·persist·forever."</em></p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HOMDwhSXoAAnE8y.jpg"·/></figure>
<h3>Moment·of·the·Week</h3>
<p><strong>A·salad·shop·in·Zurich.</strong></p>
<p><a·href[[EQ]]"https://x.com/rocknrollareal1">@rocknrollareal1</a>·walked·in·wearing·an·SPX6900·shirt.·Nothing·more·than·that.·A·shirt,·on·a·weekday,·in·Switzerland.</p>
<p>The·man·behind·the·counter,·<a·href[[EQ]]"https://x.com/lordcanis">@lordcanis</a>,·looked·up·and·shouted:</p>
<p><em>"Is·that·SPX6900…·the·movement[[Q]]·Are·you·an·Aeon[[Q]]"</em></p>
<p>The·answer·was·simple.</p>
<p><em>"Yes.·I·am·an·Aeon,·just·like·you."</em></p>
<p>This·really·happened.·Coincidence·or·fate,·who·knows·but·what·a·feeling·it·must·be·when·you're·at·work·and·you·see·an·Aeon·walk·through·the·door.··</p>
<p>We·are·not·usernames·on·the·internet·any·more.·We·are·finding·each·other·in·the·real·world·by·chance.·</p>
<h3>Aeon·of·the·Week</h3>
<p><a·href[[EQ]]"https://x.com/don_ninguno"><strong>@don_ninguno</strong></a></p>
<p>He·didn't·wait·for·a·plan,·a·budget·or·permission.·He·found·the·one·other·person·in·his·city·who·believed·the·same·thing,·sat·down·with·him,·and·made·it·a·chapter.·Then·he·created·a·space·for·every·Spanish-speaking·Aeon.</p>
<h3>Quote·of·the·Week</h3>
<p><a·href[[EQ]]"https://x.com/ilyaeon_alt"><strong>@ilyaeon_alt</strong></a></p>
<p><em>"Just·one·SPX·is·enough.·I'm·here·for·the·movement,·not·the·money.·PLOG."</em></p>
<p><strong>Persist·Forever.</strong></p>
<p><strong>Credit·for·Artwork:·</strong><a·href[[EQ]]"https://x.com/arcane_vault"><strong>@arcane_vault</strong></a><strong>·</strong></p>
<p><em>SPX6900·Magazine·is·an·independent·third-party·publication.·Opinion·only.·Not·financial·advice.</em></p>`;

const ck = s => { let h=0; for (let i=0;i<s.length;i++){ h=(h*31 + s.charCodeAt(i))>>>0; } return h; };
const body = TOK.split('·').join(' ').split('⍽').join(' ');
const lines = body.split('\n');
let bad = [];
if (lines.length !== PER.length) bad.push(`BLOCK COUNT ${lines.length} != ${PER.length}`);
lines.forEach((l,i)=>{const e=PER[i]; if(!e) return;
  if(l.length!==e[1]||ck(l)!==e[2]) bad.push(`block ${i}: got [${l.length},${ck(l)}] want [${e[1]},${e[2]}] :: ${JSON.stringify(l.slice(0,70))}`);});
if (body.length!==TOTAL[0]||ck(body)!==TOTAL[1]) bad.push(`body total: got [${body.length},${ck(body)}] want [${TOTAL[0]},${TOTAL[1]}]`);
if (bad.length) { console.error('MISMATCH ('+bad.length+'):\n'+bad.slice(0,12).join('\n')); process.exit(1); }

const payload = {
  cover: 'https://pbs.twimg.com/media/HOLtC7fWQAAML1T.jpg',
  imgUsed: 3,
  excerpt: 'Issue #05, week of July 21, 2026: Aeons stop meeting and start settling. Austin gets a Friday spot, Barcelona gets a chapter and a Spanish-language room of its own, and two Aeons find each other by chance in a Zurich salad shop.',
  body,
};
const outPath = join(__dirname, 'payloads', 'mag-cognisphere-weekly-5.json');
writeFileSync(outPath, JSON.stringify(payload));
console.log(`OK — all ${lines.length} blocks + total verified byte-exact. Wrote ${outPath} (body ${body.length} chars).`);
