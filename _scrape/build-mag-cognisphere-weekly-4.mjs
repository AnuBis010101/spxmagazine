import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

// Per-line [index, length, checksum] + full-body [len, checksum] captured in-browser.
const PER = [[0,38,2567720218],[1,83,1556426059],[2,215,2028206948],[3,53,4243095059],[4,51,2026298652],[5,83,2463246486],[6,77,2346422306],[7,250,397616657],[8,124,2917342470],[9,141,3536498331],[10,118,2190396711],[11,92,3758618037],[12,44,809553923],[13,83,1788468412],[14,324,3220903653],[15,92,4083002989],[16,48,1463371278],[17,83,3747695892],[18,408,2598213989],[19,122,892997917],[20,23,2262572924],[21,132,4290268765],[22,58,1708270667],[23,83,3898803291],[24,181,1450908724],[25,252,3685291803],[26,222,2805743757],[27,176,2402345201],[28,71,304906939],[29,104,1936668859],[30,83,865665270],[31,354,2504571669],[32,24,1049473890],[33,121,1522148984],[34,110,3330739838],[35,329,1086821981],[36,16,2860567405],[37,218,2557600962],[38,62,1920914755],[39,111,3349242051]];
const TOTAL = [5298, 4269639518];

// Tokenized body: · = space, ⍽ = nbsp. Reversed below, then verified byte-exact.
const TOK = `<p>Issue·#04·Week·of·July·13,·2026</p>
<p>----------------------------------------------------------------------------</p>
<p>Euphoria·is·a·constant·in·the·Cognisphere·but·this·week,·it·was·amplified.·Things·are·heating·up.·Aeons·are·shining·through·the·bear,·and·the·strength·of·the·SPX6900·community·continues·to·grow·beyond·belief.</p>
<p><strong>THIS·WEEK·IN·THE·COGNISPHERE:</strong></p>
<p><strong>SPX6900·Magazine·Has·a·Home</strong></p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HNWyEwNXMAAKeig.jpg"·/></figure>
<p>SPX6900·Magazine·was·once·an·idea.·Then·a·dream.·Now,·it·is·a·reality.</p>
<p>A·special·thank·you·to·the·talented·<a·href[[EQ]]"https://x.com/MikeFlipthe500">@MikeFlipthe500</a>,·who·built·the·site·from·the·ground·up.·The·energy·and·effort·Mike·brought·to·this·project·were·nothing·short·of·exceptional.·A·true·gentleman.</p>
<p>In·his·own·words:·<em>"Made·with·love·for·the·community.·Damn,·we·have·our·own·magazine·now.·I·love·you,·Aeons."</em></p>
<p>News,·community·articles,·videos,·podcasts,·guides,·data,·and·the·Weekly·Newsletter·all·in·one·place.·The·print·edition·is·on·its·way.</p>
<p>To·every·Aeon·who·has·supported·this·publication:·we·appreciate·you.·We·are·only·getting·warmed·up.·Stay·tuned.</p>
<p>→·<a·href[[EQ]]"https://spx6900magazine.com"><strong>spx6900magazine.com</strong></a></p>
<p><strong>DC·Chapter·Activated</strong></p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HNWy3b4XAAEUM5n.jpg"·/></figure>
<p>Four·Aeons·gathered·at·an·undisclosed·location·in·Washington,·DC.·<a·href[[EQ]]"https://x.com/ilyaeon_alt">@ilyaeon_alt</a>·reported·back:·four·hours·with·men·he·had·never·met·in·his·life,·half·the·restaurant·staff·onboarded·by·the·end·of·the·night,·and·one·clear·conclusion·it·is·time·to·build·SPX·chapters·globally.</p>
<p><em>"By·an·act·of·pure·Spirit·SPX·primarily·attracts·good,·long-termist·people."</em></p>
<p><strong>Aeons·Online:·Episode·26</strong></p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HNWzWFAXkAA5uSZ.jpg"·/></figure>
<p>Every·Wednesday·at·5PM·EST·<a·href[[EQ]]"https://x.com/jordanriz">@jordanriz</a>··<a·href[[EQ]]"https://x.com/MrDaJuice">@MrDaJuice</a>,·<a·href[[EQ]]"https://x.com/Root23">@Root23</a>·and·<a·href[[EQ]]"https://x.com/veryhoodish">@veryhoodish</a>·deliver·SPX6900·news,·updates·and·events.·Twenty-six·consecutive·episodes.·Week·in,·week·out·precisely·the·kind·of·consistency·this·community·is·built·on.</p>
<p>We·will·be·honest:·the·magazine·unintentionally·has·not·given·the·show·the·exposure·it·deserves.·That·changes·now.·</p>
<p>Go·and·watch·it.</p>
<p><a·href[[EQ]]"https://www.youtube.com/watch[[Q]]v[[EQ]]vNm62-Gpe-M">https://www.youtube.com/watch[[Q]]v[[EQ]]vNm62-Gpe-M</a>·</p>
<p><strong>MOMENT·OF·THE·WEEK:·WASHINGTON,·DC</strong></p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HNW0ZzTXUAAnCB7.jpg"·/></figure>
<p>A·handful·of·Aeons·who·had·never·met·in·person·sat·down·together·in·Washington,·DC.·Four·hours·later,·half·the·restaurant·staff·had·been·onboarded·and·nobody·wanted·to·leave.</p>
<p><a·href[[EQ]]"https://x.com/cogaeon">@cogaeon</a>·put·it·best:·<em>"I·walked·through·a·new·door·yesterday·by·meeting·some·fellow·Aeons·IRL.·Not·only·am·I·bullish·beyond·belief·as·a·result…·I·would·genuinely·like·to·meet·up·with·them·again."</em></p>
<p>What·struck·him·most·was·this:·<em>"Watch·out·because·these·guys·are·high·agency·and·are·obviously·used·to·being·successful·in·general."</em>·The·meeting·almost·fell·apart·more·than·once.·They·pushed·through·anyway.</p>
<p>That·is·the·entire·thesis·in·a·single·dinner.·No·marketing·plan.·No·incentive·scheme.·Just·people·who·believe·the·same·thing,·in·a·room,·discovering·the·others·are·real.</p>
<p><em>"It·would·be·extremely·foolish·to·bet·against·SPX6900."</em></p>
<p><strong>AEON·OF·THE·WEEK··</strong><a·href[[EQ]]"https://x.com/EBMD_"><strong>@EBMD_</strong></a></p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HNW1r8mXkAEr6Zy.jpg"·/></figure>
<p>When·<a·href[[EQ]]"https://x.com/ghostoftanzco">@ghostoftanzco</a>·was·needed·elsewhere,·Ebbie·stepped·in·at·a·moment's·notice·to·take·his·place·on·<a·href[[EQ]]"https://x.com/flipstockmarket">@flipstockmarket</a>·and·has·kept·stepping·up·for·three·months·since.·Seven·episodes·later,·Ebbie·has·his·name·is·cemented·as·a·legend·in·the·Cognisphere.</p>
<p>Great·job,·Ebbie.</p>
<p><strong>QUOTE·OF·THE·WEEK:·</strong><a·href[[EQ]]"https://x.com/muststopmurad"><strong>@muststopmurad</strong></a></p>
<p><em>"It·always·takes·a·little·longer·than·you·think.·And·always·goes·way·higher·than·you·think."··</em></p>
<p>Four·Aeons·met·this·week·and·quickly·reached·the·same·conclusion:·this·is·not·merely·an·online·phenomenon.·It·bridges·into·the·real·world·in·a·way·nothing·else·ever·has.·Four·men·travelled·to·meet·one·another·and·discuss·ideas··with·no·short-term·financial·incentive,·bound·only·by·a·shared·mission:·flip·the·stock·market.</p>
<p>Powerful.</p>
<p>Times·are·tough·in·2026.·Hope·can·feel·non-existent·as·we·navigate·a·confusing·world.·Yet·Aeons·continue·to·find·solace·and·hope·in·one·another,·a·true·reminder·that·collective·belief·is·powerful·beyond·measure.</p>
<p><strong>Stop·Trading·and·Believe·in·Something.</strong></p>
<p><em>SPX6900·Magazine·is·an·independent·third-party·publication.·Opinion·only.·Not·financial·advice.</em></p>`;

const ck = s => { let h=0; for (let i=0;i<s.length;i++){ h=(h*31 + s.charCodeAt(i))>>>0; } return h; };
const body = TOK.split('·').join(' ').split('⍽').join(' ');
const lines = body.split('\n');

let bad = [];
if (lines.length !== PER.length) bad.push(`LINE COUNT ${lines.length} != ${PER.length}`);
lines.forEach((l,i) => { const e = PER[i]; if (!e) return;
  if (l.length !== e[1] || ck(l) !== e[2]) bad.push(`line ${i}: got [${l.length},${ck(l)}] want [${e[1]},${e[2]}]  ::  ${JSON.stringify(l.slice(0,60))}`); });
if (body.length !== TOTAL[0] || ck(body) !== TOTAL[1]) bad.push(`body total: got [${body.length},${ck(body)}] want [${TOTAL[0]},${TOTAL[1]}]`);
if (bad.length) { console.error('MISMATCH:\n' + bad.join('\n')); process.exit(1); }

const payload = {
  cover: 'https://pbs.twimg.com/media/HNWxYlQWkAA9f1-.jpg',
  imgUsed: 5,
  excerpt: 'Euphoria, amplified: SPX6900 Magazine finds a home, the DC chapter activates, Aeons Online hits 26 straight episodes, and four strangers prove the whole thesis over dinner in Washington.',
  body,
};
const outPath = join(__dirname, 'payloads', 'mag-cognisphere-weekly-4.json');
writeFileSync(outPath, JSON.stringify(payload));
console.log(`OK — all ${lines.length} lines + total verified byte-exact. Wrote ${outPath} (body ${body.length} chars, ${payload.imgUsed} imgs).`);
