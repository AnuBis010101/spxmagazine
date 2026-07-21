import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

const PER = [[0,154,2089887866],[1,744,354374859],[2,58,989127170],[3,516,4053611182],[4,553,2997854233],[5,67,2202866564],[6,527,3152245091],[7,180,100583432],[8,61,3650954700],[9,440,1516402025],[10,176,857901295],[11,60,1121640760],[12,584,2111578565],[13,46,359936052],[14,396,2239963579],[15,294,350048558],[16,127,1831572760]];
const TOTAL = [4999, 2606668321];

const TOK = `<p><strong>A·DISCOURSE·upon·SPX6900,·that·daring·Memecoin·which·challengeth·the·ancient·S[[AMP]]amp;P·500·Index,·in·the·Year·of·Our·Lord·2026</strong></p>
<p>In·this·enlightened·age·of·digital·commerce·and·spirited·contest·upon·the·vast·ocean·of·speculation,·there·hath·arisen·a·most·singular·token·of·the·people’s·will,·known·unto·the·multitude·as·<strong>SPX6900</strong>,·or·simply·SPX.·This·memecoin·standeth·forth·as·a·bold·and·satirical·challenger·to·the·hoary·S[[AMP]]amp;P·500,·that·venerable·but·ponderous·index·of·the·old·financial·order.·With·the·cry·“Stop·Trading,·Believe·in·Something!”·upon·its·banners,·it·calleth·upon·the·freeborn·sons·and·daughters·of·crypto·to·cast·aside·the·shackles·of·tradition·and·rally·beneath·the·standard·of·6900·—·for·behold,·is·not·6900·greater·than·500[[Q]]·Wherefore·should·the·people·bow·before·the·lesser·number·when·a·mightier·one·awaiteth[[Q]]21</p>
<p><strong>Of·its·Origins·and·Bold·Conception</strong></p>
<p>This·noble·project·was·first·unfurled·in·the·month·of·August,·in·the·year·2023,·upon·the·Ethereum·blockchain,·by·anonymous·patriots·of·the·chain.·Inspired·by·the·grand·S[[AMP]]amp;P·500,·yet·scorning·its·limitations,·the·founders·proclaimed·a·new·and·glorious·index·—·SPX6900·—·which·should·encompass·6,900·assets·and·swell·to·the·prodigious·valuation·of·sixty-nine·trillion·dollars.·Thus·did·they·mock·the·tyranny·of·legacy·finance,·with·its·inflation,·its·gatekeepers,·and·its·exclusion·of·the·common·man.28</p>
<p>When·the·original·captains·of·the·venture·withdrew,·locking·the·liquidity·for·a·full·three-score·and·nine·years·and·burning·a·great·portion·of·the·supply,·the·valiant·community·rose·as·one·to·seize·the·helm.·No·longer·a·mere·token,·it·became·a·movement·coin·—·a·beacon·of·the·memecoin·supercycle,·championed·by·bold·voices·such·as·the·esteemed·Murad·Mahmudov.·Its·website,·fashioned·like·unto·a·martial·terminal·of·old,·proclaimeth·entertainment·and·mirth·alone,·warning·all·that·it·hath·no·alliance·with·stocks,·securities,·or·earthly·indices.27</p>
<p><strong>Concerning·its·Tokenomics·and·Martial·Array</strong></p>
<p>The·total·host·of·SPX·tokens·numbereth·one·billion,·with·near·nine·hundred·and·thirty-one·millions·now·in·circulation.·A·mighty·burning·hath·consumed·some·sixty-nine·millions,·or·six·and·nine-tenths·parts·in·the·hundred,·that·the·sacred·number·might·endure.·The·token·marcheth·across·many·chains·—·Ethereum·its·birthplace,·with·faithful·bridges·to·Solana·and·Base·—·that·the·people·in·every·corner·of·the·realm·might·trade·it·freely·upon·Uniswap,·Raydium,·and·other·noble·exchanges,·both·decentralized·and·centralized.26</p>
<p>Its·liquidity·remaineth·fast·locked,·a·bulwark·against·sudden·betrayal,·whilst·the·token·itself·serveth·as·both·weapon·and·prize·in·this·grand·contest·against·the·old·order.</p>
<p><strong>Of·the·AEON·Host·and·Auxiliary·Forces</strong></p>
<p>Not·content·with·the·token·alone,·the·SPX6900·cause·hath·raised·a·noble·legion·of·NFTs·under·the·banner·of·<strong>Project·AEON</strong>·—·three·thousand·three·hundred·and·thirty-three·digital·beings·of·winged·and·anime·aspect,·born·of·cosmic·anomaly,·sworn·to·overturn·the·S[[AMP]]amp;P·500.·These·rare·artifacts·serve·as·badges·of·honor·and·cultural·relics·within·the·cognisphere·of·the·movement,·much·debated·among·the·faithful.16</p>
<p>Music·and·other·arts·further·adorn·the·cause,·with·SPX·Originals·resounding·upon·SoundCloud·and·Spotify,·forging·the·hearts·of·the·brethren·into·one·unbreakable·phalanx.</p>
<p><strong>Upon·its·Campaigns·and·Present·State</strong></p>
<p>As·of·this·present·July·in·the·year·2026,·the·SPX·token·tradeth·near·thirty-four·or·thirty-five·cents·of·the·American·dollar,·commanding·a·market·host·of·some·three·hundred·and·fifteen·to·three·hundred·and·twenty-five·millions.·It·hath·known·glorious·victories,·scaling·to·heights·above·two·dollars·and·twenty-seven·cents,·yet·also·the·tempests·of·retreat.·Like·the·gallant·soldiers·of·1812,·it·endureth·volatility·with·the·spirit·of·free·men,·driven·by·the·fervor·of·the·community,·the·trumpet·of·social·media,·and·the·unyielding·belief·that·the·greater·number·shall·prevail.0</p>
<p><strong>A·Call·to·the·Faithful</strong></p>
<p>SPX6900·is·no·dry·utility·nor·soulless·protocol.·It·is·a·living·creed,·a·satirical·broadside·against·the·entrenched·powers·of·TradFi,·proclaiming·that·the·people,·through·memes,·numbers,·and·unbreakable·spirit,·may·forge·their·own·financial·destiny.·In·an·age·when·many·feel·barred·from·the·halls·of·wealth,·this·memecoin·offereth·a·new·banner·under·which·the·young·and·the·bold·may·march.</p>
<p>Let·every·reader·weigh·these·matters·with·prudence.·For·the·field·of·speculation·is·fraught·with·peril,·and·great·fortunes·have·both·been·won·and·lost·upon·its·bloody·ground.·Invest·only·what·thou·canst·afford·to·hazard,·and·may·fortune·smile·upon·those·who·believe·in·something·greater.</p>
<p><strong>Thus·endeth·this·humble·discourse,·offered·for·the·edification·and·amusement·of·the·Republic·of·Crypto.</strong></p>`;

const ck = s => { let h=0; for (let i=0;i<s.length;i++){ h=(h*31 + s.charCodeAt(i))>>>0; } return h; };
const body = TOK.split('·').join(' ').split('⍽').join(' ');
const lines = body.split('\n');
let bad = [];
if (lines.length !== PER.length) bad.push(`LINE COUNT ${lines.length} != ${PER.length}`);
lines.forEach((l,i)=>{const e=PER[i]; if(!e) return;
  if(l.length!==e[1]||ck(l)!==e[2]) bad.push(`line ${i}: got [${l.length},${ck(l)}] want [${e[1]},${e[2]}] :: ${JSON.stringify(l.slice(0,70))}`);});
if (body.length!==TOTAL[0]||ck(body)!==TOTAL[1]) bad.push(`body total: got [${body.length},${ck(body)}] want [${TOTAL[0]},${TOTAL[1]}]`);
if (bad.length) { console.error('MISMATCH:\n'+bad.join('\n')); process.exit(1); }

// The source carries stray citation markers left over from its drafting tool
// ("...one awaiteth?21", "...the common man.28"). The verification above is
// against the faithful scrape; strip them only for publication. Verified that
// no other paragraph in this piece ends in digits, so this cannot eat a real
// number (no decimals, years or figures sit in final position).
const CITES = /(\[\[Q\]\]|[.!?])\d+(?=<\/p>)/g;
const stripped = (body.match(CITES) || []).length;
const cleanBody = body.replace(CITES, '$1');

const payload = {
  cover: 'https://pbs.twimg.com/media/HNr74x1WAAAr1so.jpg',
  imgUsed: 0,
  excerpt: 'A satirical discourse in the old tongue upon SPX6900 — that daring memecoin which challengeth the ancient S&P 500 Index, in the Year of Our Lord 2026.',
  body: cleanBody,
};
const outPath = join(__dirname, 'payloads', 'blaze-discourse-upon-spx6900.json');
writeFileSync(outPath, JSON.stringify(payload));
console.log(`OK — all ${lines.length} lines + total verified byte-exact. Stripped ${stripped} stray citation markers. Wrote ${outPath} (body ${cleanBody.length} chars).`);
