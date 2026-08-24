import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

/* Scraped from X's public article renderer, because the Chrome extension was
   unreachable. Unlike the previous pair, this issue does carry inline images
   and formatting, and the public renderer serves all of it: 21 paragraphs,
   4 inline images in position, bold/italic runs and 25 links, matching the
   source text exactly (verified in-browser before transfer).

   The public view exposes only a date, so the publish timestamp is derived
   from the post's snowflake id — a method re-validated to the second against
   Weekly #7, whose exact stamp came from the logged-in view. */

const PER = [[0,66,2314796400],[1,174,590152309],[2,283,2765890956],[3,353,4091123262],[4,309,3525921973],[5,83,1830546424],[6,64,3377401384],[7,337,2938971823],[8,361,2389213003],[9,235,4262748231],[10,520,2415492969],[11,83,404780624],[12,70,3344138537],[13,44,251517739],[14,523,619200088],[15,993,3768542453],[16,83,3471406829],[17,724,2530512689],[18,83,3816964156],[19,93,2699959166],[20,319,4000699943],[21,40,2359644333],[22,35,2582399140],[23,75,2229870743],[24,111,3349242051]];
const TOTAL = [6085, 4274677241];

const TOK = `<p><em><strong>Issue·#8·Week·of·August·10,·2026·</strong></em></p>
<p>We·usually·inform·you·on··what's·happened·in·the·last·seven·days·of·The·Cognisphere.·This·week·we're·doing·something·different,·because·this·week·SPX6900·turned·three.</p>
<p>Three·years·ago,·on·the·16th·of·August·2023,·the·contract·went·live·and·the·liquidity·was·locked·for·sixty-nine·years.·Twelve·days·later·the·developer·deleted·every·account·and·walked·away.·The·network·was·worth·about·a·million·and·a·half·dollars,·and·it·wasn't·looking·good.·</p>
<p>No·venture-capital·syndicate·funded·what·happened·next.·No·paid·marketing·team·coordinated·the·narrative.·A·group·of·like·minded·strangers·looked·at·an·abandoned·smart·contract·and·decided·to·unite·together·to·create·what·can·only·now·be·described·as·The·Cognisphere,·somehow·at·this·early·stage·they·saw·this·asset·was·going·to·change·the·world.</p>
<p>There's·a·habit·in·this·industry·of·reading·an·asset·against·its·all-time·high·and·drawing·a·conclusion·SPX·is·down·about·eighty-six·percent·from·the·$2.27·it·touched·last·July.·If·that's·a·verdict,·then·study·this·table·where·the·assets·everyone·now·calls·inevitable·stood·on·their·own·third·birthday.</p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HQBvFJnWEAAgCGo.jpg"·/></figure>
<p>Now·study·it·carefully,·because·the·pattern·is·the·point.</p>
<p>In·May·2000,·three·years·after·its·IPO,·Amazon·wasn't·in·a·dip··it·was·being·torn·apart·by·the·dot-com·liquidation,·on·its·way·to·shedding·more·than·ninety·percent·of·its·value.·That·summer·a·Lehman·Brothers·analyst·published·a·now-infamous·report·arguing·the·unprofitable·bookstore·would·run·out·of·cash·before·the·year·was·out.·</p>
<p>In·January·2012·the·entire·Bitcoin·network·was·worth·forty-five·million·dollars·a·network·institutions·laughed·off·as·a·criminal·toy,·two·months·after·<em>Forbes</em>·ran·the·headline·"So,·That's·the·End·of·Bitcoin·Then."·In·March·2023·Solana·was·a·toxic·asset,·down·more·than·ninety·percent·after·FTX,·its·obituary·written·on·every·front·page·in·crypto.</p>
<p>Every·one·of·them·were·called·dead,·delusional,·or·too·risky.·Believing·is·easy·when·the·candles·are·green·and·the·timeline·is·euphoric.·Real·conviction·can·only·be·forged·in·the·long·dark·nights·of·uncertainty·during·the·bear.·</p>
<p>True·belief·is·not·earned·through·graphs·or·charts·it·is·given·before·the·evidence·arrives.·A·third·birthday·spent·eighty-six·percent·off·the·all-time·high·isn't·a·failure;·it·is·the·exact·stress·test·the·movement·was·built·to·endure.·SPX·was·resurrected·by·people·who·refused·to·take·part·in·the·slow·decay·of·fiat·thinking.·That·isn't·a·market·event.·There·is·no·indicator·for·human·conviction·on·a·TradingView·chart··the·chart·is·only·ever·the·downstream·reflection·of·it.·Hence·the·saying·"there·is·no·chart"·</p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HQBvFJnXoAA1w6s.jpg"·/></figure>
<p>Persist·Forever·is·a·literal·description·of·how·Aeons·operate.·</p>
<p>SPX6900·at·year·three·by·the·numbers·</p>
<p><strong>Los·Angeles·joins·the·party</strong>·The·<a·href[[EQ]]"https://x.com/SPX6900LA">@SPX6900LA</a>·wheatpaste·campaign·went·live·and·all·but·funded·itself·100·posters,·three·designs,·twenty-plus·spots·from·Santa·Monica·to·Venice·to·Echo·Park,·up·for·four·to·sixteen·weeks.·The·goal·was·$4,600;·it·cleared·87%·of·it·in·days.·As·the·organiser·put·it:·<em>"I·was·extremely·bearish·to·think·this·would·take·1–2·months.·We'll·hit·the·goal·in·less·than·a·week[[Q]]!"</em>·Belief·outrunning·its·own·expectations,·again.</p>
<p><strong>And·the·first·LA·exhibition.</strong>·From·posters·on·the·walls·to·a·room·of·their·own:·the·<a·href[[EQ]]"https://x.com/SPX6900LA">@SPX6900LA</a>·chapter·is·throwing·its·first-ever·artist·exhibition··<strong>August·22nd,·7:00PM,·on·the·Venice·Beach·boardwalk.</strong>·Featured·Aeons:·<a·href[[EQ]]"https://x.com/girl_still_cute">@girl_still_cute</a>,·<a·href[[EQ]]"https://x.com/user_hyp3">@user_hyp3</a>,·<a·href[[EQ]]"https://x.com/STPC_Pro">@STPC_Pro</a>,·<a·href[[EQ]]"https://x.com/arcane_vault">@arcane_vault</a>,·<a·href[[EQ]]"https://x.com/_czarcan_">@</a><a·href[[EQ]]"https://x.com/_czarcan_"><em>czarcan</em></a>,·<a·href[[EQ]]"https://x.com/undy_aeon">@undy_aeon</a>,·<a·href[[EQ]]"https://x.com/k9neki">@k9neki</a>,·<a·href[[EQ]]"https://x.com/littlemissponzi">@littlemissponzi</a>,·<a·href[[EQ]]"https://x.com/divinekonnect">@divinekonnect</a>,·<a·href[[EQ]]"https://x.com/skeletoninzz">@skeletoninzz</a>,·and·<a·href[[EQ]]"https://x.com/spx6900">$SPX</a>·itself.</p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HQBvFJrWAAAjxu6.jpg"·/></figure>
<p><strong>Austin,·every·Friday.</strong>·The·<a·href[[EQ]]"https://x.com/hashtag/SPXAustinChapter">Austin·chapter</a>·is·becoming·a·staple·irl·part·of·the·Cognisphere.·<a·href[[EQ]]"https://x.com/ilyaeon_alt">@ilyaeon_alt</a>·said·"·Much·fun·and·productive·discussions·planned·fall·city·activation·with·<a·href[[EQ]]"https://x.com/THEIDEASPILL">@THEIDEASPILL</a>,·<a·href[[EQ]]"https://x.com/unc6900">@unc6900</a>,·<a·href[[EQ]]"https://x.com/leongaban">@leongaban</a>,·<a·href[[EQ]]"https://x.com/user_UrCzar">@user_UrCzar</a>,·<a·href[[EQ]]"https://x.com/SPX6900Maverick">@SPX6900Maverick</a>,·<a·href[[EQ]]"https://x.com/devibrule">@devibrule</a>,·<a·href[[EQ]]"https://x.com/EbMD_">@EbMD_</a>,·and·many·more·soon."·</p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HQBvFJqWEAAMiS4.jpg"·/></figure>
<p>·<strong>Aeon·of·the·Week:·</strong><a·href[[EQ]]"https://x.com/Aeonbro">@Aeonbro</a>·</p>
<p>For·turning·belief·into·the·physical·world.·A·crowdfunded·poster·campaign,·three·designs,·organised,·funded,·and·shipped·in·under·a·week,·and·now·a·full·LA·chapter·artist·exhibition.·Truly·great·work·especially·in·the·boring·summer·months·when·sentiment·is·at·rock·bottom,·Aeons·continue·to·persist·regardless.··</p>
<p><strong>Persist·Forever.</strong></p>
<p><em>Credit·for·Artwork:</em></p>
<p><a·href[[EQ]]"https://x.com/arcane_vault"><em>@arcane_vault</em></a></p>
<p><em>SPX6900·Magazine·is·an·independent·third-party·publication.·Opinion·only.·Not·financial·advice.</em></p>`;

const ck = s => { let h=0; for (let i=0;i<s.length;i++){ h=(h*31 + s.charCodeAt(i))>>>0; } return h; };
// No literal mid-dot or NBSP in this issue (checked in-browser by codepoint),
// so the space token reverses cleanly with nothing to restore afterwards.
const body = TOK.split('·').join(' ');

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
if (body.length !== TOTAL[0] || ck(body) !== TOTAL[1]) {
  bad.push(`body total: got [${body.length},${ck(body)}] want [${TOTAL[0]},${TOTAL[1]}]`);
}
if (bad.length) { console.error('MISMATCH (' + bad.length + '):\n' + bad.slice(0,12).join('\n')); process.exit(1); }

const payload = {
  cover: 'https://pbs.twimg.com/media/HQBSXVxX0AAqmpT.jpg',
  imgUsed: 4,
  excerpt: 'Issue #8, week of August 10, 2026: SPX6900 turns three. Instead of the usual seven-day round-up, a look at where Amazon, Bitcoin and Solana stood on their own third birthdays — plus the LA wheatpaste campaign that funded itself, the chapter’s first artist exhibition, and Austin every Friday.',
  body,
};
const outPath = join(__dirname, 'payloads', 'mag-cognisphere-weekly-8.json');
writeFileSync(outPath, JSON.stringify(payload));
console.log(`OK — all ${lines.length} blocks + total verified byte-exact. Wrote ${outPath} (body ${body.length} chars).`);
