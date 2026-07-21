import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

const PER = [[0,55,2380174953],[1,99,2884930153],[2,137,312293921],[3,264,1878588584],[4,55,2460648823],[5,25,2753335109],[6,85,3678467378],[7,90,52794203],[8,128,3889871818],[9,84,3178180568],[10,60,313579242],[11,46,2769576030],[12,92,3043186278],[13,40,2832276915],[14,79,1673994907],[15,48,3544445702],[16,48,2403158354],[17,68,1820754265],[18,52,3350095670],[19,206,2772530677],[20,35,3179308527],[21,34,2754674839],[22,121,3241130009],[23,44,3915667914],[24,21,2072693088],[25,298,2666317545],[26,60,1705687450],[27,39,3091814795],[28,36,2932771847],[29,38,269579949],[30,264,1132317163],[31,30,3193676205],[32,51,1515409214],[33,99,3863409581],[34,119,355811622],[35,46,1739263239],[36,35,500055448],[37,142,3325025312],[38,52,2654115334],[39,85,2236081699],[40,59,588089384],[41,45,3217188300],[42,37,4269543854],[43,306,3288005516],[44,33,1209783024],[45,63,1630619768],[46,77,943681387],[47,90,3385523791],[48,49,1957543629],[49,45,429381295],[50,73,2755482780],[51,29,1757213124],[52,21,1509265192],[53,27,752314247],[54,25,4182606136],[55,59,3155797449],[56,27,1211264142],[57,254,564088620],[58,56,3798983540],[59,26,1908377987],[60,48,269704521],[61,27,2627889386],[62,56,2327290804],[63,39,1887703427],[64,46,3606555050],[65,33,4211628828],[66,19,3340462402],[67,107,314641035],[68,157,1716521947],[69,59,2325340993],[70,58,2380440812],[71,58,2481873475],[72,52,878450468],[73,79,1715050616],[74,29,2566543873],[75,32,513421698],[76,28,2772804864],[77,68,3900530833],[78,39,1011246035],[79,46,138989551],[80,175,3998204584],[81,82,4127166954],[82,99,2807426428],[83,22,549850940],[84,25,2180053561],[85,30,830520878],[86,22,1120820283],[87,25,571222475],[88,22,432031849],[89,78,3706120108],[90,90,1418245149],[91,72,2621227320],[92,93,179276788],[93,171,95575187],[94,63,4065595081],[95,74,3824934579],[96,79,2449820515],[97,47,2537939648],[98,32,1199341915],[99,76,3277695675],[100,97,980730645],[101,106,3204968806],[102,63,2585911560],[103,33,2162416096],[104,28,1827872115],[105,30,3712872034],[106,94,3939532617],[107,26,3171996487],[108,31,2718413956],[109,40,882080110],[110,22,4131705776],[111,43,987593580],[112,85,1291551337],[113,61,3317766999],[114,30,3830407656],[115,64,639651085],[116,19,2427404521],[117,25,805320308],[118,167,2170960206],[119,47,791436029],[120,60,4082352351],[121,44,4165494597],[122,35,2154596665],[123,39,1882484594],[124,37,180214757],[125,49,2902422055],[126,70,2804782270],[127,43,3959833372],[128,48,1461444979],[129,80,3352994102],[130,62,3143486731],[131,62,2356745341],[132,67,1118402998],[133,77,1354461310],[134,58,3742852583],[135,35,1182565851],[136,45,495815311],[137,43,3321205959],[138,51,2859418289],[139,39,3596431105],[140,44,4254931936],[141,108,252753628],[142,107,877395067],[143,62,658477552],[144,48,2222290388],[145,43,3439661201],[146,48,4003494544],[147,60,2305020864],[148,91,253448788],[149,45,2347061616],[150,45,3784377706],[151,119,2348418413],[152,188,4047875549],[153,57,2688861171],[154,52,932143544],[155,66,875101072],[156,55,3066294643],[157,54,371116189],[158,61,3136583004],[159,104,646550227],[160,33,1138169035],[161,43,4162780769],[162,43,2395634822],[163,56,1801909101],[164,26,2685011862],[165,25,4293147838],[166,74,445129709],[167,52,2606764738],[168,48,3707891647],[169,83,1645735164],[170,72,3679389691],[171,40,968580482],[172,41,2444212198],[173,28,3670667637],[174,108,4228848175],[175,61,1387485001],[176,66,104009253],[177,88,2386975393],[178,100,1082759133],[179,67,1131378933],[180,94,49389314],[181,27,2617580341],[182,28,2322893757],[183,38,505394738],[184,66,3863098755],[185,40,701327603],[186,61,3209966161],[187,23,1642518276],[188,27,598732348],[189,90,655979454],[190,72,3471422500],[191,101,2371811806],[192,61,3535625990],[193,59,1035689055],[194,129,2030209577],[195,120,1482769624],[196,50,4141138350],[197,30,277213761],[198,76,3690369490],[199,55,857846406],[200,28,393887282],[201,39,4018875922]];
const TOTAL = [13549, 2208721514];

const TOK = `<p>Every·generation·is·born·into·a·different·world.</p>
<p>The·battles·change.·The·tools·change.·The·language·changes.·But·the·search·remains·the·same.</p>
<p>Human·beings·have·always·wanted·the·same·things:·freedom,·belonging,·purpose,·and·something·greater·than·themselves·to·believe·in.</p>
<p>Our·ancestors·gathered·around·fires·and·told·stories·that·carried·their·hopes·and·fears.·Communities·were·built·around·villages,·religions,·nations,·music,·and·movements.·People·have·always·needed·something·that·connected·them·beyond·their·individual·lives.</p>
<p>Today,·many·of·those·fires·exist·somewhere·else.</p>
<p>They·exist·online.</p>
<p>They·exist·inside·communities·built·by·strangers·who·somehow·feel·like·family.</p>
<p>They·exist·around·ideas·that·at·first·look·strange,·impossible,·or·even·ridiculous.</p>
<p>But·history·has·always·been·written·by·people·willing·to·believe·in·something·before·the·rest·of·the·world·understood·it.</p>
<p>That·is·why·I·believe·the·next·chapter·of·digital·culture·deserves·attention.</p>
<p>Not·because·everything·new·is·automatically·valuable.</p>
<p>Not·because·every·project·will·succeed.</p>
<p>But·because·every·generation·creates·symbols·that·represent·what·it·is·searching·for.</p>
<p>Bitcoin·was·one·of·those·symbols.</p>
<p>And·for·many·of·us,·Bitcoin·was·the·first·time·we·saw·money·differently.</p>
<p><strong>Bitcoin:·The·First·Spark</strong></p>
<p>Bitcoin·was·never·just·a·financial·asset.</p>
<p>At·least,·that·wasn’t·the·reason·people·fell·in·love·with·it.</p>
<p>The·deeper·attraction·was·the·idea·behind·it.</p>
<p>A·world·where·individuals·could·own·something·outside·the·control·of·traditional·institutions.·A·system·built·on·mathematics·instead·of·trust.·A·network·where·participation·mattered·more·than·status.</p>
<p>It·represented·independence.</p>
<p>It·represented·questioning.</p>
<p>It·represented·the·possibility·that·ordinary·people·could·build·something·powerful·without·waiting·for·permission.</p>
<p>That·idea·changed·millions·of·people.</p>
<p>It·changed·me.</p>
<p>Bitcoin·will·always·have·a·special·place·in·my·story·because·it·was·the·first·thing·that·opened·my·eyes.·It·taught·me·that·the·world·wasn’t·as·fixed·as·people·told·us·it·was.·It·showed·me·that·systems·could·be·challenged·and·that·ideas·could·become·stronger·than·the·people·who·doubted·them.</p>
<p>But·every·revolution·eventually·reaches·a·crossroads.</p>
<p>The·outsider·becomes·recognized.</p>
<p>The·unknown·becomes·familiar.</p>
<p>The·rebellion·becomes·accepted.</p>
<p>Bitcoin·achieved·something·incredible.·It·went·from·being·dismissed·as·internet·money·to·becoming·one·of·the·most·recognized·financial·innovations·in·modern·history.·Governments·discuss·it.·Institutions·hold·it.·Traditional·finance·built·products·around·it.</p>
<p>That·is·not·a·weakness.</p>
<p>That·is·the·ultimate·proof·that·it·mattered.</p>
<p>But·every·success·changes·the·relationship·between·a·movement·and·the·people·discovering·it.</p>
<p>A·young·person·discovering·Bitcoin·today·is·entering·a·different·world·than·someone·who·discovered·it·years·ago.</p>
<p>They·are·not·finding·a·hidden·treasure.</p>
<p>They·are·finding·a·monument.</p>
<p>And·monuments·are·respected,·but·they·don’t·always·inspire·the·same·feeling·as·discovering·something·before·anyone·else·knows·its·name.</p>
<p><strong>The·Search·for·Something·New</strong></p>
<p>I·think·many·people·misunderstand·why·younger·generations·look·beyond·Bitcoin.</p>
<p>They·assume·it·is·only·about·chasing·higher·returns.</p>
<p>I·don’t·believe·that’s·the·full·story.</p>
<p>Something·deeper·is·happening.</p>
<p>The·world·younger·people·inherited·is·complicated.·They·grew·up·surrounded·by·technology,·but·many·feel·disconnected·from·each·other.·They·can·reach·anyone·instantly,·yet·genuine·connection·feels·harder·to·find.·They·have·access·to·endless·information,·but·finding·meaning·has·become·more·difficult.</p>
<p>We·live·in·a·strange·time.</p>
<p>People·are·more·visible·than·ever,·but·many·feel·unseen.</p>
<p>People·have·more·ways·to·communicate·than·ever,·but·many·feel·unheard.</p>
<p>People·have·more·entertainment·than·ever,·but·many·feel·empty·when·the·noise·stops.</p>
<p>Loneliness·is·not·just·an·emotion·anymore.</p>
<p>It·has·become·part·of·the·environment.</p>
<p>And·human·beings·have·always·searched·for·an·answer·to·loneliness.</p>
<p>We·create·communities.</p>
<p>We·create·art.</p>
<p>We·create·movements.</p>
<p>We·create·stories.</p>
<p>Because·deep·down,·people·don’t·only·want·ownership.</p>
<p>They·want·belonging.</p>
<p>That·is·something·many·people·overlook·when·they·look·at·crypto.·They·see·numbers,·charts,·and·speculation.·They·forget·that·behind·every·wallet·is·a·person.·Behind·every·transaction·is·someone·making·a·decision·based·on·a·belief·about·the·future.</p>
<p>The·strongest·movements·are·never·only·financial.</p>
<p>They·are·emotional.</p>
<p>They·give·people·a·reason·to·participate.</p>
<p>A·reason·to·wake·up.</p>
<p>A·reason·to·feel·like·they·are·part·of·something.</p>
<p><strong>Finding·SPX6900</strong></p>
<p>That·is·what·brought·me·toward·SPX6900.</p>
<p>Bitcoin·was·my·first·love.</p>
<p>It·still·is.</p>
<p>But·sometimes·you·can·respect·something·deeply·while·realizing·you·are·searching·for·something·else.</p>
<p>I·don’t·see·SPX6900·as·a·replacement·for·Bitcoin.·I·see·it·as·a·different·expression·of·the·same·human·desire·that·created·Bitcoin·in·the·first·place.</p>
<p>The·desire·to·create·something·outside·the·ordinary.</p>
<p>Something·that·doesn’t·follow·the·traditional·path.</p>
<p>Something·that·makes·people·stop·and·ask·questions.</p>
<p>At·first·glance,·many·people·see·only·a·meme.</p>
<p>But·throughout·history,·people·have·underestimated·the·power·of·symbols.</p>
<p>A·flag·is·just·fabric.</p>
<p>A·painting·is·just·paint.</p>
<p>A·song·is·just·sound.</p>
<p>Until·millions·of·people·decide·it·represents·something·more.</p>
<p>Meaning·is·created·collectively.</p>
<p>Culture·gives·objects·their·importance.</p>
<p>A·meme·is·not·just·a·joke·when·it·becomes·a·language·shared·by·millions·of·people.·It·becomes·a·reflection·of·a·generation’s·humor,·frustrations,·dreams,·and·worldview.</p>
<p>SPX6900·represents·something·that·is·difficult·to·measure·but·easy·to·feel.</p>
<p>It·represents·the·idea·that·the·internet·itself·has·become·a·place·where·movements·are·born.</p>
<p>Not·in·offices.</p>
<p>Not·in·boardrooms.</p>
<p>Not·through·permission.</p>
<p>Through·people.</p>
<p>Through·community.</p>
<p>Through·belief.</p>
<p>A·while·ago,·I·made·a·decision·that·many·people·would·consider·extreme.</p>
<p>I·swapped·all·of·my·Bitcoin·for·SPX6900,·while·keeping·part·of·my·portfolio·in·ETH.</p>
<p>That·decision·wasn’t·made·because·I·stopped·appreciating·Bitcoin.</p>
<p>It·was·made·because·I·believe·every·generation·eventually·searches·for·its·own·symbol.</p>
<p>The·same·way·previous·generations·found·their·identity·through·different·movements,·technologies,·and·cultural·moments,·the·internet·generation·will·create·its·own.</p>
<p>And·I·believe·SPX6900·represents·a·piece·of·that·search.</p>
<p><strong>Culture·Creates·Value·Before·Markets·Understand·It</strong></p>
<p>The·mistake·many·people·make·is·believing·value·only·comes·from·numbers.</p>
<p>But·numbers·are·often·the·final·chapter.</p>
<p>Culture·is·the·beginning.</p>
<p>Before·something·becomes·valuable,·people·have·to·believe·it·matters.</p>
<p>Before·a·piece·of·art·becomes·priceless,·someone·has·to·recognize·something·special·in·it.</p>
<p>Before·a·company·becomes·legendary,·someone·has·to·believe·in·its·mission·before·the·world·notices.</p>
<p>The·market·is·often·the·last·place·where·belief·appears.</p>
<p>First·comes·the·community.</p>
<p>Then·comes·the·story.</p>
<p>Then·comes·recognition.</p>
<p>This·is·why·I·believe·the·next·era·of·digital·assets·will·not·only·be·about·technology.</p>
<p>Technology·matters.</p>
<p>But·culture·matters·too.</p>
<p>Because·technology·can·be·copied.</p>
<p>Culture·cannot.</p>
<p>Anyone·can·create·a·similar·product.</p>
<p>Nobody·can·recreate·the·exact·moment·when·people·decide·something·has·meaning.</p>
<p><strong>Aeon:·The·Art·of·a·Digital·Generation</strong></p>
<p>This·brings·me·to·Aeon.</p>
<p>When·people·discuss·digital·art,·one·name·always·appears:</p>
<p>CryptoPunks.</p>
<p>And·rightfully·so.</p>
<p>CryptoPunks·became·a·historic·collection·because·they·were·early.·They·represented·the·beginning·of·a·new·relationship·between·ownership,·art,·and·the·internet.</p>
<p>They·became·symbols·of·a·moment·in·time.</p>
<p>But·history·doesn’t·stop·after·the·first·masterpiece.</p>
<p>Every·generation·creates·new·artists.</p>
<p>Every·era·creates·new·icons.</p>
<p>The·Renaissance·had·its·masters.</p>
<p>Modern·art·had·its·revolution.</p>
<p>The·digital·age·will·have·its·own·legends.</p>
<p>I·believe·Aeon·represents·the·possibility·of·that·next·chapter.</p>
<p>Not·because·it·replaces·CryptoPunks.</p>
<p>Not·because·the·past·should·be·forgotten.</p>
<p>But·because·every·generation·deserves·art·that·reflects·its·own·identity.</p>
<p>To·me,·Aeons·feel·like·the·Picassos·of·the·digital·era.</p>
<p>Not·because·everyone·recognizes·their·importance·today.</p>
<p>Great·art·is·rarely·universally·understood·at·the·beginning.</p>
<p>Many·important·artists·were·misunderstood·before·they·were·celebrated.</p>
<p>The·value·of·art·is·not·only·in·what·it·looks·like.</p>
<p>It·is·in·what·it·represents.</p>
<p>It·is·a·timestamp·of·human·creativity.</p>
<p>A·record·of·what·people·cared·about.</p>
<p>A·reflection·of·the·culture·that·created·it.</p>
<p>That·is·why·digital·art·matters.</p>
<p>It·is·not·just·a·picture·on·a·screen.</p>
<p>It·is·a·piece·of·history·from·the·first·generation·that·grew·up·completely·connected·to·the·internet.</p>
<p>Aeon·represents·a·world·where·identity,·creativity,·and·ownership·are·becoming·increasingly·digital.</p>
<p>A·world·where·future·generations·may·look·back·and·ask:</p>
<p>“What·did·people·of·this·era·create[[Q]]”</p>
<p>“What·symbols·represented·them[[Q]]”</p>
<p>“What·stories·did·they·leave·behind[[Q]]”</p>
<p><strong>The·Power·of·Scarcity·and·Conviction</strong></p>
<p>One·thing·that·separates·meaningful·collections·from·temporary·trends·is·conviction.</p>
<p>A·market·can·create·attention·quickly.</p>
<p>But·only·conviction·creates·longevity.</p>
<p>With·Aeon,·what·interests·me·is·not·only·the·artwork·itself,·but·the·people·behind·it·and·the·people·holding·it.</p>
<p>A·limited·amount·being·available,·combined·with·strong·long-term·holders,·creates·a·different·dynamic.·It·shows·that·many·people·don’t·view·these·pieces·as·simple·short-term·trades.</p>
<p>They·view·them·as·something·they·want·to·preserve.</p>
<p>Something·they·believe·belongs·to·the·future.</p>
<p>Whether·that·belief·proves·correct·will·be·decided·by·time.</p>
<p>But·every·cultural·artifact·begins·the·same·way.</p>
<p>Someone·has·to·believe·before·the·world·agrees.</p>
<p><strong>The·Future·Belongs·to·Those·Who·Build</strong></p>
<p>I·believe·the·youth·of·today·and·tomorrow·will·continue·searching·for·things·that·feel·authentic.</p>
<p>They·will·respect·Bitcoin.</p>
<p>They·will·understand·its·importance.</p>
<p>They·will·recognize·what·it·changed.</p>
<p>But·they·will·also·search·for·their·own·frontier.</p>
<p>Their·own·movement.</p>
<p>Their·own·symbols.</p>
<p>Because·every·generation·wants·to·build·something·that·feels·alive.</p>
<p>Something·that·feels·like·it·belongs·to·them.</p>
<p>Maybe·SPX6900·becomes·part·of·that·story.</p>
<p>Maybe·Aeon·becomes·one·of·the·defining·artistic·symbols·of·this·digital·age.</p>
<p>Maybe·other·movements·we·haven’t·even·discovered·yet·will·emerge.</p>
<p>That·is·the·beauty·of·the·future.</p>
<p>It·cannot·be·completely·predicted.</p>
<p>It·can·only·be·built.</p>
<p>The·world·often·laughs·at·new·ideas·because·the·future·always·looks·strange·before·it·becomes·normal.</p>
<p>The·first·people·who·believed·in·Bitcoin·looked·crazy.</p>
<p>The·first·people·who·believed·in·the·internet·looked·crazy.</p>
<p>The·first·people·who·believed·digital·art·could·have·cultural·value·looked·crazy.</p>
<p>But·every·once·in·a·while,·the·people·who·look·crazy·are·simply·the·people·who·arrived·early.</p>
<p>The·important·thing·is·not·blindly·believing·everything·new.</p>
<p>The·important·thing·is·learning·to·recognize·when·something·represents·a·deeper·change.</p>
<p>A·change·in·culture.</p>
<p>A·change·in·identity.</p>
<p>A·change·in·how·people·connect.</p>
<p>Because·at·the·end·of·the·day,·markets·are·built·by·people.</p>
<p>And·people·are·driven·by·stories.</p>
<p>The·greatest·assets·in·history·were·never·just·things.</p>
<p>They·were·ideas.</p>
<p>They·were·movements.</p>
<p>They·were·reminders·that·human·beings·can·create·meaning·where·none·existed·before.</p>
<p>Bitcoin·gave·an·entire·generation·a·new·way·to·think·about·money.</p>
<p>Perhaps·the·next·generation·will·create·new·ways·to·think·about·community,·art,·and·ownership.</p>
<p>Perhaps·the·next·revolution·will·not·happen·in·a·bank.</p>
<p>Perhaps·it·will·not·happen·in·a·government·building.</p>
<p>Perhaps·it·will·happen·quietly,·inside·communities·of·people·who·believe·that·the·future·can·look·different·from·the·past.</p>
<p>And·maybe·years·from·now,·when·people·look·back·at·this·era,·they·won’t·remember·every·chart·or·every·prediction.</p>
<p>They·will·remember·the·people·who·believed.</p>
<p>The·people·who·created.</p>
<p>The·people·who·built·something·when·nobody·knew·what·it·would·become.</p>
<p>Because·every·generation·leaves·behind·a·legacy.</p>
<p>The·only·question·is:</p>
<p>What·will·ours·leave·behind[[Q]]</p>`;

const ck = s => { let h=0; for (let i=0;i<s.length;i++){ h=(h*31 + s.charCodeAt(i))>>>0; } return h; };
const body = TOK.split('·').join(' ').split('⍽').join(' ');
const lines = body.split('\n');
let bad = [];
if (lines.length !== PER.length) bad.push(`LINE COUNT ${lines.length} != ${PER.length}`);
lines.forEach((l,i)=>{const e=PER[i]; if(!e) return;
  if(l.length!==e[1]||ck(l)!==e[2]) bad.push(`line ${i}: got [${l.length},${ck(l)}] want [${e[1]},${e[2]}] :: ${JSON.stringify(l.slice(0,70))}`);});
if (body.length!==TOTAL[0]||ck(body)!==TOTAL[1]) bad.push(`body total: got [${body.length},${ck(body)}] want [${TOTAL[0]},${TOTAL[1]}]`);
if (bad.length) { console.error('MISMATCH ('+bad.length+'):\n'+bad.slice(0,12).join('\n')); process.exit(1); }

const payload = {
  cover: 'https://pbs.twimg.com/media/HNtAgt0XgAEOh4H.jpg',
  imgUsed: 0,
  excerpt: 'Bitcoin was the first spark, but every generation searches for its own symbol. On SPX6900, Aeon, and why culture creates value long before markets understand it.',
  body,
};
const outPath = join(__dirname, 'payloads', 'solidsnake-children-of-the-internet.json');
writeFileSync(outPath, JSON.stringify(payload));
console.log(`OK — all ${lines.length} lines + total verified byte-exact. Wrote ${outPath} (body ${body.length} chars).`);
