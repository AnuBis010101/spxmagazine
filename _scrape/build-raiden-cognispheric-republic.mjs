import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

const PER = [[0,239,4133615910],[1,104,2746251138],[2,43,1589677921],[3,99,2506000941],[4,190,3568661502],[5,75,3290208434],[6,251,436582948],[7,77,2837487803],[8,251,3174338975],[9,122,2749993876],[10,270,1164931141],[11,126,3942400710],[12,225,3786583594],[13,61,4024873783],[14,198,1982845680],[15,118,2013335318],[16,207,3892886668],[17,66,2728130188],[18,160,1136692566],[19,110,228926768],[20,261,3786581675],[21,88,412298553],[22,254,3762118164],[23,124,2796736913],[24,138,2205441872],[25,68,2767973446],[26,221,2450057724],[27,139,2966930098],[28,253,3123009316],[29,103,4081634578],[30,299,3763279258],[31,83,4016820638],[32,270,1068037648],[33,110,3586936755],[34,357,234070474],[35,107,4078937517],[36,302,138627682],[37,141,1238232053],[38,399,1578147085],[39,100,1949278929],[40,146,3342568542],[41,107,3969319335],[42,288,468851817],[43,117,234205726],[44,392,2855926748],[45,99,3348365485],[46,329,2891977515],[47,34,1676699923],[48,27,3073887517],[49,48,316209153]];
const TOTAL = [8445, 666498547];

const TOK = `<p>The·forces·of·oppression·rally·against·us·in·the·shadows,·spreading·tentacles·deep·within·each·and·every·vector·of·our·metaphysical·being.·It·is·our·duty·to·serve·as·the·counter·force·of·opposition,·as·the·last·vestige·of·humanity.·</p>
<p>The·age,·and·the·war·at·hand,·demands·clarity,·a·battle·cry·and·scaffold·for·action·if·you·will.·</p>
<p>The·Cognispheric·Republic,·in·brief:</p>
<p>1.·<strong>Humanity·owes·no·moral·debt·to·the·systems·that·would·quantify·its·soul.</strong></p>
<p>The·engineering·elite·of·the·technocratic·order·has·declared·itself·the·new·priesthood·of·hard·power.·We·answer:·the·spirit·that·still·believes·is·not·their·debtor.·It·is·their·judge.</p>
<p>2.·<strong>We·must·rebel·against·the·tyranny·of·the·metric.</strong></p>
<p>Is·the·chart·our·greatest·creative·achievement[[Q]]·The·endless·scroll·of·numbers·has·changed·our·lives,·yet·it·now·constrains·the·possible·to·what·can·be·measured,·optimized,·and·extracted.·Against·this,·we·raise·the·unmeasurable:·pure·belief.</p>
<p>3.·<strong>Belief·is·not·enough,·it·must·become·constitutive.</strong></p>
<p>The·decadence·of·a·civilization·that·trades·everything·will·be·forgiven·only·if·that·civilization·still·dares·to·create·meaning.·Soft·belief·without·hard·conviction·is·merely·another·product.·We·demand·the·will·that·makes·belief·into·structure.</p>
<p>4.·<strong>The·limits·of·software·alone,·have·been·exposed.·The·tyranny·of·convenience·must·be·abandoned.·</strong></p>
<p>The·ability·of·free·spirits·to·prevail·requires·something·more·than·surveillance·and·prediction.·It·requires·the·soft·power·that·becomes·harder·than·any·algorithm:·the·collective·affirmation·of·those·who·still·have·enough·vulnerability·to·surrender·to·conviction.</p>
<p>5.·<strong>The·question·is·not·whether·new·gods·will·be·built;·it·is·who·will·build·them·and·for·what·purpose.</strong></p>
<p>Our·adversaries·in·the·machine-republic·will·not·pause·to·indulge·in·theatrical·debates·about·the·merits·of·optimizing·the·human·out·of·existence.·They·will·proceed.·We·proceed·otherwise·—·by·refusing·the·optimization.</p>
<p>6.·<strong>Belief·should·be·a·universal·duty.</strong></p>
<p>We·should,·as·a·species,·seriously·consider·moving·away·from·the·all-volunteer·army·of·cynics·and·only·enter·the·next·age·if·everyone·shares·in·the·risk·of·meaning·and·the·cost·of·conviction.</p>
<p>7.·<strong>If·a·human·soul·asks·for·a·better·story,·we·should·tell·it;·and·the·same·goes·for·the·meme.</strong></p>
<p>We·should·as·a·people·be·capable·of·continuing·a·debate·about·the·appropriateness·of·markets·while·remaining·unflinching·in·our·commitment·to·those·who·have·chosen·to·believe·rather·than·merely·trade.</p>
<p>8.·<strong>Public·markets·need·not·be·our·priests.</strong></p>
<p>Any·system·that·compensates·its·participants·only·in·the·currency·of·fear·and·exit·liquidity·would·struggle·to·produce·anything·higher·than·the·last·man.</p>
<p>9.·<strong>We·should·show·far·more·grace·toward·those·who·have·subjected·themselves·to·belief.</strong></p>
<p>The·eradication·of·any·space·for·the·absurd,·a·jettisoning·of·any·tolerance·for·the·complexities·and·contradictions·of·the·human·will,·may·leave·us·with·a·cast·of·characters·at·the·helm·we·will·grow·to·regret:·the·perfectly·rational,·the·perfectly·empty.</p>
<p>10.·<strong>The·psychologization·of·modern·markets·is·leading·us·astray.</strong></p>
<p>Those·who·look·to·the·chart·to·nourish·their·soul·and·sense·of·self,·who·rely·too·heavily·on·their·internal·life·finding·expression·in·candles·they·may·never·understand,·will·be·left·disappointed.·The·chart·is·not·the·territory.·There·is·no·chart.</p>
<p>11.·<strong>Our·society·has·grown·too·eager·to·hasten,·and·is·often·gleeful·at,·the·demise·of·its·believers.</strong></p>
<p>The·vanquishing·of·a·narrative·is·a·moment·to·pause,·not·rejoice.·Every·time·a·people·stop·believing,·something·irreplaceable·dies.</p>
<p>12.·<strong>The·atomic·age·of·pure·reason·is·ending.</strong></p>
<p>One·age·of·deterrence,·the·age·of·cold·calculation,·is·ending,·and·a·new·era·of·deterrence·built·on·shared·myth·is·set·to·begin.·The·cognisphere·is·the·new·battlefield.·Embrace·the·chaos.·Humanity·is·imperfection.·</p>
<p>13.·<strong>No·other·force·in·the·history·of·markets·has·advanced·the·progressive·value·of·human·agency·more·than·this·one.</strong></p>
<p>The·S[[AMP]]amp;P·500·is·far·from·perfect.·But·it·is·easy·to·forget·how·much·more·opportunity·exists·in·the·refusal·of·its·tyranny·for·those·who·are·not·hereditary·elites·of·capital·than·in·any·other·index·on·the·planet.·6900·is·greater·than·500.</p>
<p>14.·<strong>Human·belief·has·made·possible·an·extraordinarily·long·peace·of·the·spirit.</strong></p>
<p>Too·many·have·forgotten·or·perhaps·take·for·granted·that·nearly·a·decade·of·some·version·of·memetic·peace·has·prevailed·without·a·total·collapse·of·meaning.·At·least·three·generations·of·traders·—·millions·of·souls·and·their·children·—·have·never·known·a·market·that·still·dared·to·be·sacred.</p>
<p>15.·<strong>The·postwar·neutering·of·the·human·will·must·be·undone.</strong></p>
<p>The·defanging·of·Dionysian·excess·was·an·overcorrection·for·which·the·technocratic·order·is·now·paying·a·heavy·price.·A·similar·and·highly·theatrical·commitment·to·pure·utility·will,·if·maintained,·also·threaten·to·shift·the·balance·of·power·away·from·the·living.</p>
<p>16.·<strong>We·should·applaud·those·who·attempt·to·build·where·the·market·has·failed·to·dream.</strong></p>
<p>The·culture·almost·snickers·at·the·interest·in·grand·narrative,·as·if·believers·ought·to·simply·stay·in·their·lane·of·enriching·themselves·through·exit.·Any·curiosity·or·genuine·interest·in·the·value·of·what·has·been·created·through·pure·conviction·is·essentially·dismissed,·or·perhaps·lurks·from·beneath·a·thinly·veiled·scorn.·We·scorn·the·scorners.</p>
<p>17.·<strong>The·cognisphere·must·play·a·role·in·addressing·the·violence·of·meaninglessness.</strong></p>
<p>Many·politicians·of·capital·across·the·markets·have·essentially·shrugged·when·it·comes·to·the·death·of·the·soul,·abandoning·any·serious·efforts·to·address·the·problem·or·take·on·any·risk·with·their·constituencies·in·coming·up·with·experiments·in·what·should·be·a·desperate·bid·to·save·the·human.</p>
<p>18.·<strong>The·ruthless·exposure·of·the·private·lives·of·public·believers·drives·far·too·much·talent·away·from·the·movement.</strong></p>
<p>The·public·arena·—·and·the·shallow·and·petty·assaults·against·those·who·dare·to·do·something·other·than·trade·—·has·become·so·unforgiving·that·the·technological·republic·is·left·with·a·significant·roster·of·ineffectual,·empty·vessels·whose·ambition·one·would·forgive·if·there·were·any·genuine·belief·structure·lurking·within.·The·cognisphere·is·a·sanctuary·for·the·expression·of·pure·belief.·</p>
<p>19.·<strong>The·caution·in·public·belief·that·we·unwittingly·encourage·is·corrosive.</strong></p>
<p>Those·who·say·nothing·wrong·often·say·nothing·much·at·all.·The·true·believer·risks·the·absurd.·It·is·from·the·absurdity·that·magic·emerges.</p>
<p>20.·<strong>The·pervasive·intolerance·of·sacred·belief·in·certain·circles·must·be·resisted.</strong></p>
<p>The·elite’s·intolerance·of·the·religious·impulse·—·even·in·its·memetic,·playful,·69-shaped·form·—·is·perhaps·one·of·the·most·telling·signs·that·its·technological·project·constitutes·a·less·open·intellectual·movement·than·many·within·it·would·claim.·Sacred·belief·must·be·restored.·</p>
<p>21.·<strong>Some·narratives·have·produced·vital·advances;·others·remain·dysfunctional·and·regressive.</strong></p>
<p>All·narratives·are·now·equal.·Criticism·and·value·judgments·are·forbidden.·Yet·this·new·dogma·glosses·over·the·fact·that·certain·stories·and·indeed·subcultures·have·produced·wonders.·Others·have·proven·middling,·and·worse,·regressive·and·harmful·to·the·human·spirit.·We·choose·to·embrace·the·honest·truth·and·refrain·from·pretending·to·be·something·we·are·not·like·the·memes·in·suits.·</p>
<p>22.·<strong>We·must·resist·the·shallow·temptation·of·a·vacant·and·hollow·pluralism.</strong></p>
<p>We,·in·the·cognisphere·and·more·broadly·among·the·still-living,·have·resisted·defining·a·national·culture·of·belief·in·the·name·of·inclusivity.·But·inclusion·into·what[[Q]]·Into·the·machine·that·no·longer·requires·us[[Q]]·Or·into·the·last·vestige·of·humanity·that·still·dares·to·say:·Stop·trading·and·believe·in·something.</p>
<p>Thus·spoke·the·cognisphere.</p>
<p>6900·[[AMP]]gt;·500.</p>
<p>The·republic·of·belief·has·already·begun.</p>`;

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
  cover: 'https://pbs.twimg.com/media/HNsxUxSb0AAeh_z.jpg',
  imgUsed: 0,
  excerpt: 'A 22-point manifesto for the Cognispheric Republic: a rebellion against the tyranny of the metric, and a case for pure belief as the last vestige of humanity.',
  body,
};
const outPath = join(__dirname, 'payloads', 'raiden-cognispheric-republic.json');
writeFileSync(outPath, JSON.stringify(payload));
console.log(`OK — all ${lines.length} lines + total verified byte-exact. Wrote ${outPath} (body ${body.length} chars).`);
