import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

const PER = [[0,98,1259952501],[1,49,1174634796],[2,47,90619789],[3,37,2949437043],[4,38,3848802835],[5,182,2243369524],[6,351,3145157970],[7,53,2697408663],[8,44,397099120],[9,93,4138409813],[10,52,1288108152],[11,62,4026828879],[12,82,3794009896],[13,146,2749543737],[14,43,164071112],[15,30,3007609306],[16,132,1942492968],[17,57,2546568885],[18,53,4071462160],[19,81,1663595146],[20,50,3815891110],[21,94,1689918202],[22,60,91512468],[23,26,7917694],[24,43,181694484],[25,72,2866642218],[26,55,4009862778],[27,66,1082178831],[28,36,2351277645],[29,57,2050451816],[30,26,3486368911],[31,28,3607280061],[32,38,3278957620],[33,97,1236399174],[34,35,1975861582],[35,27,2958459213],[36,37,3766072588],[37,105,2731035402],[38,74,2137368981],[39,80,2054338039],[40,72,117235745],[41,65,1217056006],[42,85,3859124365],[43,88,914024526],[44,47,2722609390],[45,78,279545788],[46,54,449882259],[47,55,200523341],[48,51,541967647],[49,51,2512275116],[50,75,2804518707],[51,66,1529276035],[52,39,3477053812],[53,40,2618174385],[54,68,1014440601],[55,68,308090800],[56,56,1631049314],[57,34,768646916],[58,38,414129126],[59,85,753438237],[60,41,3498816773],[61,48,420424586],[62,59,3725336295],[63,50,943017124],[64,39,2572156029],[65,35,2564397217],[66,30,2090383749],[67,42,2649946068],[68,64,1157646898],[69,20,3087478496],[70,24,2095149817],[71,32,3130929856],[72,38,1903913957],[73,30,2482980864],[74,101,382415785],[75,27,506973320],[76,33,2672885434],[77,41,4069878238],[78,58,3808116265],[79,74,1314810178],[80,70,528249897],[81,48,494322848],[82,58,4236447314],[83,86,1698334905],[84,79,2541316901],[85,69,1606534665],[86,42,300834446],[87,38,294662587],[88,43,1411679365],[89,27,177075785],[90,18,791229319],[91,32,1829572404],[92,26,3593372571],[93,20,249282795],[94,61,1881247573],[95,60,827794002],[96,47,2429357854],[97,163,815377543],[98,49,2558151375],[99,34,2854287988],[100,31,3228655857],[101,43,2521068832],[102,57,941030036],[103,191,1942136471]];
const TOTAL = [6432, 3220770028];

const TOK = `<p>"We·are·generalists,·you·can't·draw·neat·lines·around·planet-wide·problems."·-·Pardot·Kynes</p>
<p><em>Listen·carefully,·young·chudcell.</em></p>
<p>Every·civilization·inherits·two·deserts.</p>
<p>One·is·made·of·stone·and·wind.</p>
<p>The·other·is·made·of·certainty.</p>
<p>The·first·strips·the·body·until·only·endurance·remains.·The·second·strips·the·imagination·until·every·future·resembles·the·past.·It·is·the·latter·desert·that·consumes·empires.</p>
<p>You·have·been·taught·that·value·is·discovered·through·numbers·alone.·Markets·present·themselves·as·natural·phenomena,·as·though·their·laws·descended·from·the·heavens·complete·and·unquestionable.·Their·charts·are·treated·as·landscapes·that·cannot·be·reshaped.·Their·institutions·claim·permanence·because·they·have·forgotten·their·own·beginnings.</p>
<p>Yet·every·empire·was·once·an·improbable·story.</p>
<p>Every·currency·was·once·an·agreement.</p>
<p>Every·throne·was·first·assembled·in·the·minds·of·those·who·believed·it·belonged·there.</p>
<p>The·oldest·lesson·is·not·that·power·corrupts.</p>
<p>It·is·that·power·eventually·mistakes·itself·for·nature.</p>
<p>There·are·ancient·prophecies·that·speak·not·of·heroes,·but·of·environments.</p>
<p>Not·because·the·future·belongs·to·extraordinary·people,·but·because·extraordinary·people·are·always·shaped·by·the·worlds·that·sustain·them.</p>
<p>A·desert·does·not·produce·abundance.</p>
<p>It·produces·adaptation.</p>
<p>Scarcity·becomes·its·teacher.·Patience·becomes·its·calendar.·Survival·becomes·a·language·spoken·long·before·it·is·understood.</p>
<p>The·wise·learn·that·prophecy·is·rarely·prediction.</p>
<p>Prophecy·is·ecology·expressed·through·symbols.</p>
<p>It·describes·the·conditions·under·which·transformation·becomes·inevitable.</p>
<p>The·digital·world·has·become·such·a·desert.</p>
<p>Never·has·humanity·possessed·so·much·information·while·suffering·so·little·orientation.</p>
<p>Attention·is·extracted·faster·than·it·can·regenerate.</p>
<p>Meaning·evaporates.</p>
<p>Communities·dissolve·into·audiences.</p>
<p>Every·day·brings·another·flood·of·content,·yet·the·wells·run·dry.</p>
<p>Water·is·scarce·not·because·the·oceans·vanished.</p>
<p>Water·is·scarce·because·little·remains·fit·to·sustain·life.</p>
<p>Meaning·follows·the·same·law.</p>
<p>This·is·the·landscape·into·which·SPX6900·appeared.</p>
<p>Not·as·a·conqueror.</p>
<p>Not·as·a·corporation.</p>
<p>Not·even·primarily·as·an·asset.</p>
<p>It·arrived·like·an·improbable·spring·discovered·where·every·map·insisted·none·could·exist.</p>
<p>Its·language·was·irreverent.</p>
<p>Its·symbols·playful.</p>
<p>Its·existence·easy·to·dismiss.</p>
<p>History·has·often·overlooked·the·first·signs·of·ecological·change·because·they·resemble·accidents.</p>
<p>The·first·green·shoot·in·a·wasteland·is·easily·mistaken·for·a·weed.</p>
<p>Those·who·ask·whether·SPX6900·is·"real"·may·be·asking·the·wrong·question.</p>
<p>Reality·has·always·been·constructed·through·shared·participation.</p>
<p>Nations·are·real·because·people·behave·as·though·they·are.</p>
<p>Money·is·real·because·strangers·trust·one·another·across·impossible·distances.</p>
<p>Markets·are·real·because·billions·agree,·every·morning,·to·continue·their·ritual.</p>
<p>Stories·are·not·the·opposite·of·reality.</p>
<p>Stories·are·often·the·machinery·through·which·reality·organizes·itself.</p>
<p>The·wise·chudcell·understands·this·distinction.</p>
<p>Every·living·ecosystem·depends·upon·circulation.</p>
<p>Water·that·no·longer·moves·becomes·stagnant.</p>
<p>Ideas·that·no·longer·evolve·become·doctrine.</p>
<p>Institutions·that·no·longer·adapt·become·monuments·awaiting·erosion.</p>
<p>Memes·possess·an·unusual·resilience·because·they·circulate.</p>
<p>Every·participant·reshapes·them.</p>
<p>Every·generation·translates·them.</p>
<p>They·survive·not·by·resisting·change,·but·by·metabolizing·it.</p>
<p>SPX6900·behaves·according·to·this·older·ecological·principle.</p>
<p>It·spreads·less·like·a·product·than·like·weather.</p>
<p>Price·measures·its·surface.</p>
<p>Culture·determines·its·climate.</p>
<p>The·old·financial·empire·believes·legitimacy·flows·downward·from·institutions.</p>
<p>Living·systems·teach·the·opposite.</p>
<p>Forests·are·not·commanded·into·existence.</p>
<p>Rivers·require·no·permission·to·change·their·course.</p>
<p>Life·expands·wherever·conditions·permit·it.</p>
<p>Communities·follow·similar·laws.</p>
<p>Shared·symbols·become·roots.</p>
<p>Humor·becomes·rainfall.</p>
<p>Participation·becomes·fertile·soil.</p>
<p>From·enough·small·acts·of·cultivation,·landscapes·change.</p>
<p>Not·suddenly.</p>
<p>Then·all·at·once.</p>
<p>Many·misunderstand·irony.</p>
<p>They·imagine·it·to·be·distance.</p>
<p>Often·it·is·incubation.</p>
<p>Communities·begin·by·laughing·together·because·laughter·lowers·defenses·that·certainty·cannot.</p>
<p>Enough·seasons·pass.</p>
<p>Enough·stories·accumulate.</p>
<p>Enough·strangers·become·neighbors.</p>
<p>One·morning,·the·joke·has·quietly·become·tradition.</p>
<p>The·banner·that·began·as·parody·now·gathers·real·people·beneath·it.</p>
<p>The·transformation·is·complete·before·anyone·thinks·to·name·it.</p>
<p>Still,·every·prophecy·contains·a·warning.</p>
<p>The·greatest·danger·does·not·arrive·from·disbelief.</p>
<p>It·arrives·when·believers·conclude·that·destiny·no·longer·requires·stewardship.</p>
<p>The·oasis·survives·only·because·someone·continues·protecting·the·spring.</p>
<p>The·moment·abundance·is·assumed,·the·desert·begins·its·return.</p>
<p>Carry·conviction·without·arrogance.</p>
<p>Carry·ambition·without·worship.</p>
<p>Carry·humor·as·though·it·were·water.</p>
<p>Spend·it·generously.</p>
<p>Waste·none.</p>
<p>Treat·memes·as·campfires.</p>
<p>Gather·around·them.</p>
<p>Share·warmth.</p>
<p>Then·leave·enough·fuel·for·those·who·arrive·after·you.</p>
<p>Perhaps·SPX6900·is·not·the·fulfillment·of·a·prophecy.</p>
<p>Perhaps·it·is·only·the·beginning·of·one.</p>
<p>Not·a·promise·that·history·has·chosen·a·victor,·but·a·reminder·that·civilizations·are·always·terraformed·long·before·they·realize·the·landscape·has·changed.</p>
<p>Empires·imagine·they·are·built·from·stone.</p>
<p>They·are·built·from·belief.</p>
<p>Belief·flows·like·water.</p>
<p>It·disappears·from·exhausted·ground.</p>
<p>It·gathers·where·communities·learn·to·preserve·it.</p>
<p>And·in·every·age,·the·future·belongs·not·to·those·who·possess·the·largest·reservoirs,·but·to·those·who·recognize·the·first·hidden·spring·while·everyone·else·is·still·studying·the·sand.</p>`;

const ck = s => { let h=0; for (let i=0;i<s.length;i++){ h=(h*31 + s.charCodeAt(i))>>>0; } return h; };
const body = TOK.split('·').join(' ').split('⍽').join(' ');
const lines = body.split('\n');
let bad = [];
if (lines.length !== PER.length) bad.push(`LINE COUNT ${lines.length} != ${PER.length}`);
lines.forEach((l,i)=>{const e=PER[i]; if(!e) return;
  if(l.length!==e[1]||ck(l)!==e[2]) bad.push(`line ${i}: got [${l.length},${ck(l)}] want [${e[1]},${e[2]}] :: ${JSON.stringify(l.slice(0,70))}`);});
if (body.length!==TOTAL[0]||ck(body)!==TOTAL[1]) bad.push(`body total: got [${body.length},${ck(body)}] want [${TOTAL[0]},${TOTAL[1]}]`);
if (bad.length) { console.error('MISMATCH:\n'+bad.join('\n')); process.exit(1); }

const payload = {
  cover: 'https://pbs.twimg.com/media/HFZSD5JbwAAGugf.jpg',
  imgUsed: 0,
  excerpt: 'Every civilization inherits two deserts: one of stone and wind, the other of certainty. On SPX6900 as an improbable spring found where every map insisted none could exist.',
  body,
};
const outPath = join(__dirname, 'payloads', 'slow-water-in-a-world-dying-of-thirst.json');
writeFileSync(outPath, JSON.stringify(payload));
console.log(`OK — all ${lines.length} lines + total verified byte-exact. Wrote ${outPath} (body ${body.length} chars).`);
