import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

const PER = [[0,39,3290843986],[1,85,643979371],[2,67,996668817],[3,88,3496727996],[4,225,1853092285],[5,28,1850083404],[6,36,1418670638],[7,62,2342270243],[8,215,267362638],[9,93,138101475],[10,61,1419123666],[11,328,704304784],[12,106,1010263772],[13,83,3056665995],[14,386,3665261130],[15,30,3394106513],[16,156,941964173],[17,190,1167932592],[18,83,1848836034],[19,71,4136317773],[20,83,2290754936],[21,47,1580228902],[22,199,3261045430],[23,214,3125261134],[24,228,924170694],[25,98,2350213515],[26,194,510813754],[27,62,1747017974],[28,83,2387582676],[29,25,2702822039],[30,45,3602021384],[31,173,2531972269],[32,148,2612819321],[33,80,2518305600],[34,328,3297658259],[35,108,3155091224],[36,244,31665203],[37,95,228227899],[38,129,2515692267],[39,83,1743211303],[40,24,3004705090],[41,81,2837158501],[42,114,4003061533],[43,76,3564995886],[44,25,328161661],[45,85,275934887],[46,134,499655165],[47,40,2359644333],[48,120,1005095914],[49,111,3349242051]];
const TOTAL = [5957, 4006562621];

const TOK = `<p>Issue·#07·Week·of·August·4,·2026</p>
<p>------------------------------------------------------------------------------</p>
<p>Another·fairly·quiet·week·in·the·summer·for·the·Cognisphere.</p>
<p>·Start·of·August,·middle·of·a·bear·market,·Aeons·continue·to·show·up·regardless.·</p>
<p>A·study·landed·on·the·timeline·showing·what·day·trading·is·doing·to·young·men.·Austin·opened·its·doors·again·and·Los·Angeles·booked·a·table·for·the·end·of·the·month,·and·two·Aeons·met·up·and·stayed·the·whole·afternoon.</p>
<p>Here's·what·happened.</p>
<p>This·Week·in·the·Cognisphere:</p>
<p><strong>Stop·trading·and·believe·in·something.</strong></p>
<p><a·href[[EQ]]"https://x.com/JoeCarlasare">@JoeCarlasare</a>·posted·a·report·from·the·Institute·for·Family·Studies·this·week,·drawn·from·a·survey·of·2,000·American·men·aged·18·to·29,·carried·out·in·April·2025.</p>
<p>A·quarter·of·them·trade·stocks·every·day.·Among·those·still·in·school·it·rises·to·38%.</p>
<p>Forty-two·per·cent·of·them·see·themselves·as·failures.</p>
<p>The·report·links·daily·trading·to·higher·rates·of·loneliness,·depression·and·anxiety,·and·puts·it·in·the·same·bracket·as·gaming,·pornography·and·fantasy·sports.·Correlation,·not·proof·of·cause.·But·the·picture·it·describes·is·a·generation·of·young·men·sitting·alone·with·a·screen,·moving·numbers·around,·feeling·terrible.</p>
<p>Carlasare·posted·it·with·four·words·on·top.·<strong>Stop·trading·and·believe·in·something.</strong></p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HPUFTWqXsAANotO.jpg"·/></figure>
<p>Last·week·we·covered·the·Project·Aeon·girls·going·up·as·pfps,·one·Aeon·after·another,·and·<a·href[[EQ]]"https://x.com/MikeFlipthe500">@MikeFlipthe500</a>·building·a·free·way·in·for·anyone·who·couldn't·afford·one.·This·week·<a·href[[EQ]]"https://x.com/MustStopMurad">@MustStopMurad</a>·put·one·on·too,·a·girl·from·<a·href[[EQ]]"https://x.com/projectaeon3333">@projectaeon3333</a>·</p>
<p>Supply·is·running·out.·</p>
<p><a·href[[EQ]]"https://x.com/realcryptocow">@realcryptocow</a>·posted·the·chart·this·week.·Less·than·6%·of·the·SPX6900·supply·moved·in·the·last·month.</p>
<p>Turn·it·around.·More·than·94%·of·every·coin·in·existence·sat·completely·still·through·a·month·where·the·timeline·went·to·sleep.·No·panic.·No·capitulation.·Nobody·heading·for·the·door.</p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HPUGybAWsAMGtTV.jpg"·/></figure>
<p>The·mosaic·continues·to·grow·when·there·is·nothing·to·celebrate.</p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HPUHF1lWYAA704r.jpg"·/></figure>
<p><strong>The·chapters·continue.·</strong></p>
<p><a·href[[EQ]]"https://x.com/ilyaeon_alt">@ilyaeon_alt</a>·was·at·the·Austin·chapter·again·this·week,·with·the·same·standing·invitation.·Every·Friday.·Come·by.·Have·a·conversation·worth·having.</p>
<p>And·this·week·Los·Angeles·picked·its·Saturday.·Korean·BBQ,·29·August,·two·in·the·afternoon.·RSVP·to·<a·href[[EQ]]"https://x.com/aeonbro">@aeonbro</a>·or·<a·href[[EQ]]"https://x.com/MrDaJuice">@MrDaJuice</a>.</p>
<p>Thirteen·million·people·live·in·the·Los·Angeles·metropolitan·area,·the·second·largest·in·the·United·States·and·one·of·the·most·culturally·productive·places·on·earth.·Until·this·month·not·one·of·them·had·a·table·to·sit·at.</p>
<p>The·flyers·were·made·by·<a·href[[EQ]]"https://x.com/littlemissponzi">@littlemissponzi</a>.·</p>
<p>Austin·on·a·Friday.·Barcelona·holding·its·corner·and·its·Spanish-language·room.·Los·Angeles·on·the·29th.·Chapters·used·to·be·news·in·this·newsletter.·They·are·turning·into·infrastructure.</p>
<p>If·you're·anywhere·near·LA·at·the·end·of·the·month,·go.</p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HPUIEBSXEAE4SZS.jpg"·/></figure>
<p>Moment·of·the·Week</p>
<p><strong>"Almost·immediately."</strong></p>
<p><a·href[[EQ]]"https://x.com/rheydt2703">@rheydt2703</a>·and·<a·href[[EQ]]"https://x.com/AeonReborn">@AeonReborn</a>·met·up·this·week·and·spent·the·afternoon·together.</p>
<p>That's·the·whole·event.·Two·people·who·found·each·other·through·a·mission·and·shared·belief,·sitting·down·together·on·an·afternoon·in·August.</p>
<p>Afterwards·<a·href[[EQ]]"https://x.com/rheydt2703">@rheydt2703</a>·wrote:</p>
<p><em>"Great·company,·great·conversations,·and·such·a·good·time·together.·It's·crazy·how·comfortable·you·can·feel·with·each·other·almost·immediately.·There's·truly·something·special·happening·within·</em><a·href[[EQ]]"https://x.com/search[[Q]]q[[EQ]]%23SPX6900[[AMP]]src[[EQ]]hashtag_click"><em>#SPX6900</em></a><em>."</em></p>
<p>He·tagged·it·<a·href[[EQ]]"https://x.com/hashtag/ProofBestCommunityEver">#ProofBestCommunityEver</a>.</p>
<p>Read·it·against·the·study·at·the·top·of·this·issue.·Two·thousand·young·men,·a·quarter·of·them·trading·every·day,·four·in·ten·convinced·they·are·failures,·and·the·thread·running·underneath·all·of·it·was·disconnection·from·real-world·ties.</p>
<p>Then·this.·Two·men·who·knew·each·other·off·the·timeline,·becoming·friends·in·real·life.·</p>
<p>A·salad·shop·in·Zurich.·A·dinner·in·Washington.·A·café·on·Carrer·de·Còrsega.·Now·this.·The·Cognisphere·continues·to·grow.·</p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HPUIgU4XkAAzfMt.jpg"·/></figure>
<p>Aeon·of·the·Week:</p>
<p><a·href[[EQ]]"https://x.com/ilyaeon_alt"><strong>@ilyaeon_alt</strong></a></p>
<p>Three·Fridays·running·at·Lucky·Lab·Coffee.·Same·spot,·same·open·invitation,·whether·anyone·turns·up·or·not.</p>
<p>Being·consistent·is·hard,·and·nobody·hands·out·medals·for·turning·up.</p>
<p>Quote·of·the·Week:</p>
<p><a·href[[EQ]]"https://x.com/MustStopMurad"><strong>@MustStopMurad</strong></a></p>
<p><em>"Trading·is·not·the·way·out.·Diamond-handing·the·right·thing·is.·Obsessing·over·what·the·right·thing·is,·is·the·task."</em></p>
<p><strong>Persist·Forever.</strong></p>
<p><strong>Credit·for·Artwork:</strong>·<a·href[[EQ]]"https://x.com/arcane_vault"><strong>@arcane_vault</strong></a></p>
<p><em>SPX6900·Magazine·is·an·independent·third-party·publication.·Opinion·only.·Not·financial·advice.</em></p>`;

const ck = s => { let h=0; for (let i=0;i<s.length;i++){ h=(h*31 + s.charCodeAt(i))>>>0; } return h; };

// No literal mid-dot or NBSP in this issue (verified in-browser by codepoint),
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
  cover: 'https://pbs.twimg.com/media/HPT9eqmXkAAlqlR.jpg',
  imgUsed: 5,
  excerpt: 'Issue #07, week of August 4, 2026: a study on what daily trading is doing to young men lands on the timeline, under 6% of SPX6900 supply moves in a month, Austin runs a third Friday, Los Angeles books its first table, and two Aeons meet and stay the whole afternoon.',
  body,
};
const outPath = join(__dirname, 'payloads', 'mag-cognisphere-weekly-7.json');
writeFileSync(outPath, JSON.stringify(payload));
console.log(`OK — all ${lines.length} blocks + total verified byte-exact. Wrote ${outPath} (body ${body.length} chars).`);
