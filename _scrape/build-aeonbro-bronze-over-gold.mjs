import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

const PER = [[0,119,4180574121],[1,59,2215335857],[2,56,2433767213],[3,505,2180688981],[4,57,1519281752],[5,48,2524831136],[6,393,2691355040],[7,31,4154694470],[8,65,3060619636],[9,227,1596328905],[10,45,14127723],[11,400,1490348543],[12,179,3365464542],[13,61,822480732],[14,153,3841255661],[15,482,4202736855],[16,148,555655055],[17,245,2878236132],[18,74,1066692072],[19,370,2996750742],[20,663,3850975902],[21,653,3296226759],[22,956,3683706775],[23,797,180053074],[24,827,829187188],[25,933,3086282947],[26,836,3227332823],[27,996,2008497586],[28,660,3751803972],[29,220,3251572340],[30,368,321574523],[31,316,1554433227],[32,74,3768185488],[33,373,912392429],[34,296,1647956845],[35,479,371748063],[36,284,3308439954],[37,387,308924604],[38,311,3171559490],[39,74,4164610021],[40,159,1656031356],[41,149,1713387265],[42,657,79108462],[43,233,4023571571],[44,47,3744004702],[45,112,2229210334],[46,76,1904072404],[47,264,1714308599],[48,247,454308656],[49,54,1467737484],[50,119,3565642821],[51,236,4002581967],[52,57,3148377116],[53,173,608422318],[54,76,2177633236],[55,431,3752471023],[56,137,2297214268],[57,30,3699499386],[58,32,224946117],[59,370,3613214915]];
const TOTAL = [17938, 1912227248];

const PART1 = `<p><strong>THE·BRONZE·IMPERATIVE</strong>
·<em>How·the·SPX6900·Army·Buried·the·OGs·and·Declared·War·on·the·500</em></p>
<p><strong>By·the·Archivist·of·Digital·Legions</strong></p>
<p><strong>Preface:·The·Metallurgy·of·Power</strong></p>
<p>In·the·late·empire·of·TradFi,·where·indices·masquerade·as·gods·and·the·S[[AMP]]amp;P·500·stands·as·the·marble·colossus·of·inherited·order,·a·counter-myth·was·born·in·August·2023.·SPX6900·emerged·not·as·asset·but·as·accusation·—·a·1-billion-token·satire·declaring·“6900·[[AMP]]gt;·500,”·a·deliberate·profanation·of·sacred·benchmarks.·The·contract·was·renounced.·Liquidity·was·locked·for·sixty-nine·years.·Sixty-nine·million·tokens·were·immolated·in·ritual·burn.·The·founders·withdrew·into·anonymity.</p>
<p>What·remained·was·not·a·project·but·a·battlefield.</p>
<p>Into·that·vacuum·stepped·the·Bronze·Army.</p>
<p>While·the·Originals·(the·OGs)·had·ignited·the·spark,·they·soon·resembled·the·exhausted·aristocracy·of·a·revolution·already·betrayed·by·its·own·success.·The·Bronze·forged·something·sharper:·a·disciplined·phalanx·of·will,·hierarchy,·and·memetic·precision.·They·did·not·merely·hold.·They·occupied.·They·did·not·merely·survive·the·meme-coin·massacres·of·2025.·They·weaponized·the·attrition.</p>
<p>This·is·their·testament.</p>
<p><strong>Chapter·I:·The·Abdication·of·the·Ancients</strong></p>
<p>The·OGs·possessed·the·primal·fire.·They·watched·the·contract·deploy·on·Ethereum,·bridged·to·Solana·and·Base,·and·witnessed·the·first·delirious·pumps.·They·coined·the·phrase·that·would·outlive·them:·<em>Flip·the·500</em>.</p>
<p>Yet·fire·without·form·consumes·itself.</p>
<p>As·the·initial·euphoria·cooled·and·the·broader·meme·ecosystem·entered·its·periodic·culling,·the·OGs·fragmented·into·contemplative·holding·and·nostalgic·lore.·They·had·launched·the·rebellion;·they·had·not·prepared·for·its·professionalization.·Their·golden·myth·—·pure,·decentralized,·leaderless·—·proved·brittle·once·tested·against·sustained·narrative·warfare·and·coordinated·attention·capture.</p>
<p>The·Bronze·understood·what·the·Ancients·forgot:·in·the·attention·economy,·sovereignty·belongs·not·to·those·who·begin,·but·to·those·who·refine·the·machinery·of·continuation.</p>
<p><strong>Chapter·II:·The·Forging·of·the·Legion</strong></p>
<p>Bronze·is·no·accident·of·metallurgy.·It·is·an·alloy·—·copper’s·conductivity·married·to·tin’s·hardness.·The·Bronze·Army·adopted·the·same·principle.</p>
<p>They·instituted·ranks·without·central·decree:·General·of·the·Bronze·Army,·Brigadier,·Submarine·Commanding·Officer,·Communications·Operator,·Quartermaster,·EOD·Specialist,·Medical·Corporal,·Combat·Engineer.·They·established·War·Rooms·—·recurring·Spaces·where·strategy,·not·chatter,·was·conducted.·They·produced·<em>Transmissions</em>:·cinematic,·atmospheric·dispatches·that·fused·military·aesthetics·with·philosophical·undertones,·best·consumed·with·headphones·and·conviction.</p>
<p>They·invoked·Steven·Bradbury·not·as·meme·but·as·doctrine:·victory·belongs·to·the·one·who·remains·upright·when·the·field·collapses·around·him.</p>
<p>Where·the·OGs·had·offered·participation,·the·Bronze·offered·<em>initiation</em>.·Where·the·OGs·had·offered·belonging,·the·Bronze·offered·<em>formation</em>.·The·difference·is·not·cosmetic.·It·is·the·difference·between·a·crowd·and·an·army.</p>
<p><strong>Chapter·III:·The·Commanders·Who·Tempered·the·Alloy</strong></p>
<p>Rank·in·the·Bronze·Army·is·not·decoration.·It·is·function·forged·under·pressure.·Several·operators·have·distinguished·themselves·through·sustained,·high-signal·labor·that·has·accelerated·the·transformation·from·spontaneous·insurgency·into·durable·campaign·architecture.·Their·work·has·made·the·original·guard’s·subsequent·inertia·increasingly·legible·by·contrast.</p>
<p><strong>N3nolit·–·General·of·the·Bronze·Army,·Submarine·Commanding·Officer</strong>
·N3nolit·has·served·as·the·primary·architect·of·recruitment·and·operational·cohesion.·Through·repeated,·high-visibility·calls·to·apply·for·the·elite·Bronze·Army·—·paired·with·imagery·of·the·bronze·shine·manifesting·around·the·heart·—·he·converted·passive·observers·into·initiated·soldiers.·His·direct·facilitation·of·War·Room·protocols·and·recurring·Spaces·created·persistent·command·nodes·where·strategy·is·actively·iterated.·The·Bronze·Army·Transmission·series·bears·his·operational·imprint,·elevating·raw·community·energy·into·polished·instruments·of·narrative·warfare.</p>
<p><strong>Unc6900·–·General·of·the·Bronze·Army·Ground·Occupation</strong>
·Unc6900·has·supplied·the·philosophical·artillery.·His·extended·dispatches·frame·the·Bronze·Army·as·the·living·embodiment·of·Nietzsche’s·<em>Übermensch</em>·—·rejecting·the·“soft·path”·of·early·capitulation·and·insisting·that·soldiers·“die·with·sword·in·hand.”·By·publicly·celebrating·the·emergence·of·refined·writing·talent·within·the·ranks·and·hailing·specific·community·productions·as·masterpieces,·he·has·institutionalized·intellectual·ambition·inside·the·phalanx.·His·ground-occupation·role·has·manifested·as·consistent,·high-register·reinforcement·of·the·will-to-flip.</p>
<p><strong>Aeon·Bro·–·Quartermaster·of·the·Bronze·Army·and·Commander·of·the·Jeet·Hunter·Forces</strong>
·Aeon·Bro·has·embodied·the·logistical·and·psychological·supply·line·while·simultaneously·commanding·the·Jeet·Hunter·Forces.·Operating·under·the·directive·“STOP·TRADING·AND·BELIEVE·IN·SOMETHING,”·he·has·modeled·conviction·over·extraction.·Beyond·conventional·supply·discipline,·he·has·directed·specialized·units·armed·with·Javelin·anti-pussy·jeet·boy·missiles·—·precision·instruments·designed·to·target·and·neutralize·diversifying·traders·and·non-SPX·maximalists.·These·forces·conduct·relentless·meme·interdiction,·striking·at·weak·hands·and·narrative·dilution·with·surgical·ideological·strikes.·His·visible·assumption·of·rank·and·public·alignment·with·the·movement’s·deeper·layer·has·reinforced·that·true·contribution·is·measured·in·sustained·belief,·operational·steadiness,·and·active·defense·of·the·core·thesis·rather·than·transactional·rotation.</p>
<p><strong>BenevolentBlaze·–·General·Plenipotentiary</strong>
·BenevolentBlaze·has·served·as·the·diplomatic·and·representational·arm·of·the·Bronze·Army.·Holding·the·rank·of·General·Plenipotentiary,·he·has·acted·with·full·authority·in·external·affairs,·conducting·outreach·and·forging·strategic·alignments·with·aligned·meme·communities,·cultural·operators,·and·external·voices·critical·of·traditional·finance.·His·role·has·been·to·project·the·Army’s·power·beyond·internal·ranks·—·translating·the·aggressive·internal·doctrine·into·sophisticated·external·messaging·while·preserving·the·core·maximalist·ethos.·By·balancing·the·phalanx’s·martial·intensity·with·measured·diplomatic·engagement,·he·has·helped·expand·the·movement’s·influence·and·legitimacy·without·compromising·its·ideological·purity.</p>
<p><strong>PositivePaully·–·Medical·Corporal</strong>
·PositivePaully·has·functioned·as·the·Army’s·field·medic·and·psychological·resilience·officer.·In·the·brutal·attrition·of·prolonged·drawdowns·and·narrative·pressure,·he·has·specialized·in·treating·paper-hand·syndrome·and·neutralizing·FUD·infections·before·they·could·spread·through·the·ranks.·His·contributions·operate·at·the·level·of·morale·and·mental·fortitude:·stabilizing·conviction·when·price·action·threatens·to·fracture·discipline,·administering·rapid·ideological·first·aid,·and·ensuring·that·soldiers·remain·upright·rather·than·becoming·casualties·of·their·own·doubt.·Where·others·wage·war·outward,·PositivePaully·has·fought·the·quieter,·more·essential·battle·—·keeping·the·phalanx’s·internal·strength·intact·so·that·the·external·campaign·never·loses·its·spine.</p>
<p><strong>Braeon·(AirgaptBtc)·–·Combat·Engineer</strong>
·Braeon·has·operated·as·the·Army’s·Combat·Engineer·—·the·specialist·responsible·for·constructing·the·fortifications·that·allow·the·rest·of·the·phalanx·to·advance.·In·the·fluid,·high-attrition·environment·of·meme·warfare,·he·has·focused·on·building·durable·narrative·infrastructure,·clearing·informational·obstacles,·and·engineering·the·structural·integrity·of·the·Bronze·position·itself.·Where·others·attack·or·defend·in·the·open,·Braeon·works·in·the·foundations:·reinforcing·the·ideological·ground·so·that·it·cannot·be·easily·undermined,·demolishing·weak·competing·narratives·with·precision,·and·ensuring·that·the·Army’s·forward·positions·remain·stable·under·sustained·pressure.·His·contributions·are·quieter·than·the·transmissions·or·the·philosophical·barrages,·but·without·them·the·entire·formation·would·lack·the·structural·resilience·required·for·a·69-year·campaign.</p>
<p><strong>Saucy·(Root23)·–·Communications·Operator</strong>
·Saucy·has·served·as·the·Army’s·Communications·Operator·—·the·specialist·responsible·for·the·integrity·and·velocity·of·the·signal·itself.·In·an·environment·saturated·with·noise,·competing·narratives,·and·deliberate·interference,·he·has·focused·on·maintaining·clean·channels·of·command·and·ensuring·that·the·correct·message·reaches·the·ranks·at·the·correct·time.·His·w`;

const PART2 = `ork·has·been·less·about·generating·content·and·more·about·preserving·the·fidelity·of·the·Army’s·voice:·filtering·distortion,·coordinating·the·transmission·of·doctrine,·and·keeping·the·informational·arteries·of·the·phalanx·open·under·pressure.·Without·reliable·communications,·even·the·strongest·formation·fragments.·Saucy’s·contribution·has·been·to·prevent·that·fragmentation·at·the·level·of·pure·signal.</p>
<p><strong>Slow·(</strong><a·href[[EQ]]"https://x.com/SlowAeon"><strong>@SlowAeon</strong></a><strong>)·–·Bronze·Soldier·and·Toxic·SPX·Maximalist</strong>
·Slow·operates·as·the·Bronze·Army’s·resident·ironist·and·doctrinal·sentinel.·Through·extended,·numbered·public·declarations,·he·has·weaponized·personal·example·and·pointed·satire·to·police·the·boundaries·of·the·movement.·His·detailed·dissection·of·the·motivations·driving·AEON·acquisition·served·not·as·blanket·rejection·of·the·collectible·itself,·but·as·a·precise,·mocking·strike·against·the·psychology·of·the·audacious·investor·—·those·who·treat·secondary·assets·as·status·signals·or·life-changing·tickets·rather·than·optional·aesthetics.·By·laying·bare·the·social·pressures,·flex·culture,·and·narrative·drift·that·can·accompany·such·pursuits,·Slow·reminded·the·ranks·that·authentic·conviction·is·proven·through·relentless·stacking·of·the·core·token·and·sustained·proof·of·work,·not·through·profile·symbolism·or·performative·alignment.</p>
<p>He·explicitly·affirmed·contentment·for·those·who·choose·the·AEON·path·while·simultaneously·modeling·an·uncompromising·focus·on·SPX6900·as·the·singular·vehicle·of·the·thesis.·His·invocation·of·Steven·Bradbury·as·the·operative·archetype·—·the·skater·who·advances·not·by·outskating·the·field·but·by·remaining·upright·when·others·fall·—·supplies·the·Army·with·its·endurance·doctrine.·In·an·ecosystem·prone·to·hype·cycles·and·collectible·distraction,·Slow’s·contrarian·interventions·function·as·ideological·hygiene:·sharp,·unsparing,·and·ultimately·preservative.·He·keeps·the·phalanx·honest·by·refusing·to·let·secondary·narratives·dilute·the·primary·war·aim.</p>
<p>Toxic·in·the·best·sense·—·fiercely·committed,·allergic·to·dilution,·and·willing·to·say·what·others·will·not·—·Slow·has·contributed·a·necessary·corrective·voice·that·strengthens·rather·than·fractures·the·formation.</p>
<p><strong>Hoodish·–·Communications·and·Cultural·Operator</strong>
·Hoodish·contributed·to·the·early·consolidation·of·the·ranks·during·the·fluid·period·before·strict·hierarchies·crystallized.·His·work·helped·stabilize·the·cultural·perimeter·and·supported·the·transition·from·loose·affiliation·to·structured·formation,·adding·tensile·strength·to·the·emerging·alloy.</p>
<p>These·commanders·did·not·supplant·the·original·vision.·They·supplied·what·the·vision·lacked:·repeatable·processes,·philosophical·scaffolding,·logistical·discipline,·ideological·hygiene,·diplomatic·reach,·psychological·resilience,·structural·engineering,·signal·integrity,·and·cultural·transmission·mechanisms.</p>
<p><strong>Chapter·IV:·The·Milestones·That·Rendered·Gold·Pale</strong></p>
<p><strong>Milestone·I:·The·Institutionalization·of·Chaos</strong>
·The·Bronze·transformed·spontaneous·raids·into·sustained·campaigns.·War·Rooms·became·command·centers.·The·result:·measurable·coordination·across·time·zones,·chains,·and·psychological·states.·The·OGs·had·memes.·The·Bronze·had·<em>operations</em>·—·coordinated·and·sustained·by·the·operators·named·above.</p>
<p><strong>Milestone·II:·The·Multi-Chain·Siege</strong>
·While·others·remained·tethered·to·single-chain·tribalism,·the·Bronze·treated·Ethereum,·Solana,·and·Base·as·contiguous·theaters.·Liquidity·fragmentation·became·opportunity.·The·bridged·token·did·not·dilute·identity;·it·multiplied·reach.</p>
<p><strong>Milestone·III:·Survival·as·Doctrine</strong>
·During·the·2025·meme-coin·extinction·event,·the·Bronze·maintained·conviction·across·thousands·of·wallets.·They·did·not·merely·endure·the·-83%·drawdown·from·the·$2.27·ATH.·They·documented·it,·aestheticized·it,·and·weaponized·the·narrative·of·disciplined·retreat·—·guided·by·the·Bradbury·doctrine,·reinforced·by·field·medicine,·underpinned·by·structural·fortifications,·and·kept·coherent·by·clean·lines·of·communication.</p>
<p><strong>Milestone·IV:·The·Transmission·Doctrine</strong>
·Content·ceased·to·be·decoration·and·became·doctrine.·The·Bronze·Army·Transmissions·—·driven·by·figures·such·as·N3nolit·—·elevated·meme·warfare·from·shitposting·to·aesthetic·philosophy.·They·cultivated·<em>gravitas</em>.</p>
<p><strong>Milestone·V:·Internal·Political·and·Philosophical·Experimentation</strong>
·Proposals·for·structured·participation·and·the·high-register·philosophical·interventions·of·Unc6900·and·Slow·demonstrated·that·the·Army·could·experiment·with·governance·and·ideology·without·descending·into·theater.·The·OGs·had·governance·theater.·The·Bronze·considered·actual·memetic·sovereignty.</p>
<p><strong>Milestone·VI:·The·69-Year·Horizon</strong>
·The·Bronze·internalized·the·locked·liquidity·not·as·constraint·but·as·covenant.·While·others·chased·short-term·pumps,·they·positioned·the·project·for·generational·endurance.·The·OGs·had·launched·a·coin.·The·Bronze·is·conducting·a·<em>civilization</em>.</p>
<p><strong>Chapter·V:·Why·Bronze·Endures·Where·Gold·Tarnishes</strong></p>
<p>Gold·is·pure·but·soft.·It·yields·to·pressure·and·requires·constant·polishing.·Bronze·develops·a·patina·—·protective,·dignified,·earned·through·exposure.</p>
<p>The·OGs·embodied·the·romantic·purity·of·the·launch:·anonymous·founders,·fair·distribution,·no·team·allocation.·Noble.·Necessary.·Insufficient.</p>
<p>The·Bronze·Army·accepted·impurity·as·strength.·They·layered·hierarchy·atop·decentralization·without·contradicting·it.·They·accepted·military·aesthetics·without·descending·into·caricature.·They·accepted·that·in·a·leaderless·system,·<em>de·facto</em>·leadership·emerges·from·those·willing·to·do·the·work·—·N3nolit’s·recruitment·machinery,·Unc6900’s·philosophical·elevation,·Aeon·Bro’s·supply·discipline·and·Jeet·Hunter·operations,·BenevolentBlaze’s·diplomatic·projection,·PositivePaully’s·psychological·field·medicine,·Braeon’s·structural·fortifications,·Saucy’s·signal·integrity,·Slow’s·ideological·hygiene,·and·Hoodish’s·early·cultural·stabilization.</p>
<p>Nietzsche·wrote·of·the·will·to·power·as·the·fundamental·drive.·The·Bronze·Army·did·not·merely·theorize·it.·They·enacted·it·—·daily,·in·Spaces,·in·raids,·in·the·quiet·refusal·to·capitulate·when·price·action·suggested·surrender.</p>
<p><strong>Chapter·VI:·The·Eclipse</strong></p>
<p>History·does·not·remember·those·who·merely·arrive·first.·It·remembers·those·who·impose·form·upon·arrival.</p>
<p>The·Originals·gave·SPX6900·its·soul.·The·Bronze·Army·gave·it·a·spine.</p>
<p>In·the·grand·ledger·of·memetic·history,·the·OGs·will·be·credited·with·ignition.·The·Bronze·will·be·credited·with·<em>continuation·under·fire</em>.·One·produced·the·spark.·The·other·built·the·forge·that·keeps·the·flame·from·dying·when·the·wind·turns·hostile.</p>
<p>To·call·this·superiority·is·not·insult·to·the·founders.·It·is·recognition·of·evolution.·Every·successful·revolt·eventually·requires·its·second·generation·—·the·one·that·turns·insurrection·into·institution·without·losing·the·original·heresy.</p>
<p><strong>Epilogue:·The·69-Year·Campaign</strong></p>
<p>The·liquidity·remains·locked.·The·contract·remains·renounced.·The·supply·remains·capped·and·partially·immolated.</p>
<p>What·the·Bronze·Army·has·added·cannot·be·coded:·a·culture·of·disciplined·irreverence,·of·hierarchical·play,·of·long-duration·narrative·warfare·—·sustained·by·the·specific·operators·who·stepped·forward·when·the·moment·demanded·it.</p>
<p>They·did·not·replace·the·OGs.·They·completed·them.</p>
<p>In·the·coming·decades,·as·TradFi·continues·its·slow·theatrical·collapse·and·new·indices·rise·only·to·be·parodied,·the·question·will·not·be·“Who·launched·SPX6900[[Q]]”</p>
<p>It·will·be:·“Who·kept·the·war·room·lit·when·the·lights·went·out[[Q]]”</p>
<p>The·answer,·etched·in·bronze·and·carried·forward·by·N3nolit’s·transmissions,·Unc6900’s·manifestos,·Aeon·Bro’s·conviction·and·Jeet·Hunter·strikes,·BenevolentBlaze’s·diplomatic·reach,·PositivePaully’s·field·medicine·of·the·mind,·Braeon’s·structural·fortifications,·Saucy’s·preservation·of·the·signal,·Slow’s·corrective·satire,·and·the·foundational·work·of·operators·like·Hoodish,·will·be·legible·to·those·with·eyes·to·read·it.</p>
<p><strong>6900·[[AMP]]gt;·500.</strong>
·<strong>Discipline·[[AMP]]gt;·Nostalgia.</strong>
·<strong>Bronze·[[AMP]]gt;·Gold.</strong></p>
<p>The·campaign·continues.</p>
<p><em>End·of·Chronicle</em></p>
<p>This·is·not·investment·advice.·It·is·cultural·documentation·of·a·living·experiment·in·decentralized·sovereignty.·The·Bronze·Army·did·not·ask·permission·to·exist.·They·simply·refused·to·disappear.·In·that·refusal·—·and·in·the·specific·labor·of·those·who·refined·it·—·lies·the·only·metric·that·ultimately·matters·in·the·arena·of·memes:·persistence·rendered·elegant.</p>`;

const TOK = PART1 + PART2;
const ck = s => { let h=0; for (let i=0;i<s.length;i++){ h=(h*31 + s.charCodeAt(i))>>>0; } return h; };
const body = TOK.split('·').join(' ').split('⍽').join(' ');
// PER is one checksum per top-level block, not per newline. Several blocks
// (title, commander names, milestones, the closing tricolon) carry an internal
// '\n', so merge any continuation line (one not starting with '<') back into
// its block before verifying.
const rawLines = body.split('\n');
const lines = [];
for (const l of rawLines) {
  if (l.startsWith('<') || lines.length === 0) lines.push(l);
  else lines[lines.length - 1] += '\n' + l;
}
let bad = [];
if (lines.length !== PER.length) bad.push(`BLOCK COUNT ${lines.length} != ${PER.length}`);
lines.forEach((l,i)=>{const e=PER[i]; if(!e) return;
  if(l.length!==e[1]||ck(l)!==e[2]) bad.push(`block ${i}: got [${l.length},${ck(l)}] want [${e[1]},${e[2]}] :: ${JSON.stringify(l.slice(0,70))}`);});
if (body.length!==TOTAL[0]||ck(body)!==TOTAL[1]) bad.push(`body total: got [${body.length},${ck(body)}] want [${TOTAL[0]},${TOTAL[1]}]`);
if (bad.length) { console.error('MISMATCH ('+bad.length+'):\n'+bad.slice(0,12).join('\n')); process.exit(1); }

const payload = {
  cover: 'https://pbs.twimg.com/media/HN30Q5FakAAK8kJ.jpg',
  imgUsed: 0,
  excerpt: 'A mock-military chronicle of the SPX6900 Bronze Army: how a disciplined vanguard turned the OGs’ spark into a 69-year campaign. Bronze over gold; discipline over nostalgia.',
  body,
};
const outPath = join(__dirname, 'payloads', 'aeonbro-bronze-over-gold.json');
writeFileSync(outPath, JSON.stringify(payload));
console.log(`OK — all ${lines.length} lines + total verified byte-exact. Wrote ${outPath} (body ${body.length} chars).`);
