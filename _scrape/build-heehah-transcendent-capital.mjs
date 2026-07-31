import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

const PER = [[0,284,795957716],[1,495,4245559717],[2,129,4239846722],[3,1403,1444113881],[4,65,3554753235],[5,264,668199824],[6,284,1577420029],[7,217,843037856],[8,240,1763199407],[9,376,476161903],[10,99,4282521232],[11,380,1022006150],[12,68,3994056607],[13,83,3484532939],[14,527,4080708414],[15,227,245286324],[16,429,2862665311],[17,270,1197488142],[18,379,1073576142],[19,273,3080240743],[20,153,1089381347],[21,600,2363049305],[22,277,3350498342],[23,450,1342526175],[24,414,2060706441],[25,33,2660313230],[26,83,3674063965],[27,471,2935980189],[28,418,1255852001],[29,110,1942300299],[30,305,2883572210],[31,29,4004769102],[32,153,1058169290],[33,639,1949672321],[34,166,1410138909],[35,391,2639725303],[36,41,2488455665],[37,570,423566344],[38,471,4118198672],[39,466,829271088],[40,800,3821412854],[41,599,493529582],[42,681,610333824],[43,39,2841293331],[44,123,2082859240],[45,40,3337754816],[46,583,3099885217],[47,318,4094863683],[48,124,2912787850],[49,528,2291049363],[50,95,84949058],[51,818,1849240458],[52,73,1916683098],[53,165,1070053205],[54,310,1923072880],[55,33,1248246839],[56,255,1690914456],[57,674,802671016],[58,191,1592411888],[59,151,3340525620],[60,647,2531565934],[61,345,3227725909],[62,576,1121261721],[63,155,939302827],[64,155,1342554192],[65,41,1111974002],[66,321,3883086570],[67,496,2770826141],[68,42,2479605276],[69,209,2416779749],[70,176,3668443012]];
const TOTAL = [22571, 2620859818];

const PART1 = `<p>When·I·said·that·SPX6900·was·"<strong>An·Asset·Class·in·the·Image·of·God</strong>",·I·meant·it.¹·I·was·acknowledging·a·transcendent·archetypal·fractal,·and·I·am·going·to·show·you·how·SPX6900·fulfills·it.·I·am·going·to·show·you·how·SPX6900·is·an·asset·class·in·the·image·of·God.</p>
<p>Every·being·has·an·essence,·and·its·actions·are·merely·expressions·of·that·essence.·The·oak·tree·produces·acorns·because·it·is·an·oak·tree.·A·fire·burns·because·it·is·fire.·The·first·question·in·Christianity·then·is·not·<em>what·did·Christ·do[[Q]]</em>·but·instead,·<em>who·is·He[[Q]]</em>·For·the·Christian·this·is·answered·completely·in·three·words:·<strong>God·is·Love</strong>,·and·it·is·from·these·three·words·that·we·derive·all·God's·essence,·character,·and·the·story·of·salvation.²</p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HOgxu-fWoAAkmmb.jpg"·/><figcaption>Christian·Soteriology</figcaption></figure>
<p>Likewise,·the·first·question·we·should·ask·of·any·financial·asset·is·not·<em>what·does·it·do[[Q]]</em>·but·<em>what·is·it[[Q]]</em>·All·community,·investor·quality,·narratives,·sacrifices,·slogans,·and·any·other·kind·of·cultural·fruit·are·merely·disclosures·of·an·asset's·underlying·nature.·They·are·symptoms,·and·an·asset·cannot·escape·<em>what·it·is</em>;·its·essence·can·only·be·revealed.

This·revealing·is·what·Heidegger·called·<em><strong>Poiesis</strong></em>·(from·the·Greek·word·<em>poiēsis</em>):·the·process·by·which·something·emerges·from·concealment·into·presence.·To·use·Heidegger's·own·example,·it·is:·"<em>...the·arising·of·something·from·out·of·itself,·is·a·bringing-forth...e.g.,·the·bursting·of·a·blossom·into·bloom,·in·itself.</em>”·³

It·is·through·<em>Poiesis</em>·that·Gold·and·Silver·reveal·themselves·through·their·material·properties;·Nvidia·and·Apple·reveal·themselves·through·their·products·and·craftsmanship;·Bitcoin·and·Ethereum·reveal·themselves·through·their·cryptographic·technologies;·and·the·meme(coin)·reveals·itself·through·its·kind·of·influence·over·the·mind.

It·is·here·that·we·uncover·an·emerging·pattern:·not·one·of·these·assets·derives·its·essence·from·Finance·itself,·rather,·Finance·has·only·sunk·its·teeth·into·them.·The·"free"·market·is·nothing·more·than·humanity’s·grand·water·turbine·through·which·already·revealed·meaning·is·churned·into·capital.</p>
<p>Heidegger·called·this·<em><strong>Enframing</strong></em>.</p>
<p>Through·<em>Enframing</em>·(from·the·German·word·<em>Gestell</em>),·everything·becomes·a·spreadsheet·of·numbers·ready·to·be·optimized·and·exploited.·The·world·is·reduced·to·<em>standing-reserve</em>·(Bestand),·existing·only·as·a·resource·kept·ready·for·use.</p>
<p>Finance,·universally,·has·been·the·medium·by·which·<em>Enframing</em>·has·price-tagged·the·world.·It·has·eagerly·appointed·number·and·status·upon·<em>what·is</em>·rather·than·bringing-forth·anything·new.·Financialization·is·revelation·that·is·reflective·rather·than·generative.</p>
<p>It·is·to·say,·then,·that·every·asset·that·currently·exists·is·only·a·product·of·<em>Enframing</em>,·in·that·its·meaning·has·been·brought-forth·through·a·foreign·medium·and·has·merely·been·discovered·by·Finance.</p>
<p><em>Finance·discovered·Gold·and·Silver's·monetary·properties;·Nvidia·and·Apple's·craftsmanship;·Bitcoin·and·Ethereum's·monetary·technologies;·and·in·the·case·of·memecoins:·a·meme's·memetic·power.·It·did·not·create·their·meaning.</em></p>
<p>Every·asset's·identity·and·<em>essence</em>·are·established·prior·to·its·financialization·and·exists·only·insofar·as·it·can·capture·and·consume·already·existing·material,·labor,·technology,·and·cultural·vigor·that·has·originated·outside·of·pure·Finance.·The·asset·is·downstream·from·already·revealed·meaning,·and·has·merely·been·converted·into·an·instrument·for·gain.·⁴</p>
<p><em>There·is·no·asset·class·indigenous·to·Finance,·so·how·can·Finance·be·beautiful[[Q]]</em></p>
<p>For·all·time,·Finance·has·lived·as·the·shadow·of·poietic·processes·and·creative·activity.·Finance·has·never·had·its·own·revealing,·and·much·like·God·before·Christ·entered·the·world,·Finance·has·merely·been·the·playwright·for·the·world's·hyper-commoditization,·i.e.·<em>Enframing·supreme</em>.·But·since·the·beginning,·it·has·yearned·to·be·both·the·playwright·and·the·actor.</p>
<p><em>Finance·craves·a·body...·a·body...·a·body...·a·bo...</em></p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HOg1ZMaXEAAnPKK.jpg"·/></figure>
<p>In·<em>Tron:·Legacy·(2010)</em>,·the·Isos·(Isomorphic·Algorithms)·organically·emerged·as·living·entities·from·the·natural·conditions·of·the·Grid·and·code-soup·of·cyberspace.·As·Flynn·says,·"<em>...they·(Isos)·manifested,·like·a·flame...like·flowers·in·a·wasteland.</em>"·The·Isos·were·the·indigenous·lifeforms·of·cyberspace,·or·rather,·they·<em>were</em>·cyberspace,·and·it·was·through·them·that·the·Grid·revealed·itself·to·the·user·for·the·first·time·as·the·medium·manifested·its·personhood.·An·act·of·<em>Poiesis</em>.</p>
<p>Finance,·analogously,·has·pined·for·the·investor's·capital·to·finally·touch·its·own·face·for·the·first·time,·no·longer·being·relegated·to·witness,·but·a·witness·to·its·own·participation·in·the·very·market·it·has·created.</p>
<p>It·is·here·that·we·arrive·at·Finance's·<em>Poiesis</em>:·<strong>Finance·revealing·itself·to·the·investor·for·the·first·time·through·its·own·financialization</strong>.·In·form,·it·is·an·asset,·one·that·has·organically·flowered·from·Finance's·own·soil·as·an·indigenous·lifeform.·Uprooting·this·asset·from·out·of·its·commoditization·would·alter·its·own·ontology,·causing·it·to·become·something·entirely·different·altogether.</p>
<p>Gold·remains·gold·without·a·market;·Nvidia·remains·Nvidia·without·a·ticker;·Bitcoin·remains·Bitcoin·without·a·price,·but·inevitably·we·greet·the·entity·that·cannot·exist·apart·from·financialization:·the·old-god·and·shadow·of·human·activity:·the·S[[AMP]]amp;P·500.</p>
<p>As·the·process·goes:·human·beings,·to·companies,·to·economic·production,·to·stock·prices,·to·the·apparition·of·the·index.·The·S[[AMP]]amp;P·500·is·the·culminated·symbol·of·Finance's·abstraction;·the·icon·of·the·process·by·which·capital·is·coordinated.·It·is·financialization's·ghost,·the·face·of·ongoing·<em>Enframing</em>,·and·where·meaning·goes·to·die·through·valuation.</p>
<p>In·discovering·the·symbol·of·the·S[[AMP]]amp;P·500,·and·through·some·semiotic·wizardry,·we·can·now·invert·the·abstraction·by·detaching·it·from·any·kind·of·real·economic·activity,·creating·an·asset·whose·only·symbolic·or·poietic·referent·is·financialization·itself.·⁵</p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HOgyb2JXEAAojLg.jpg"·/><figcaption>SPX6900·is·Xeno-Fi:·a·new·financial·paradigm.</figcaption></figure>
<p>Where·the·S[[AMP]]amp;P·500·looks·outward·from·itself,·the·SPX6900·looks·inward,·beginning·where·the·500's·processes·end,·indexing·the·abstraction·that·indexes·the·world.·As·a·conscious·self-referential·parody·that·has·been·born·into·its·financialization,·SPX6900·has·successfully·folded·Finance·back·upon·itself,·forsaking·the·pure·<em>Gestell</em>·of·the·traditional·financial·regime.·It·is·here·that·Finance·pulls·itself·forth·onto·center-stage,·becoming·the·revealed·rather·than·the·revealer,·disclosing·the·essence·of·its·own·abstraction·as·a·purely·self-organizing·hyperstitious·force.·⁶</p>
<p>Until·today,·there·have·been·no·assets·that·could·have·performatively·realized·this·end,·as·their·commoditization·always·remained·a·byproduct·of·<em>Enframing</em>·financially·exogenous·meaning,·i.e.·commoditizing·outside·social,·cultural,·or·technological·hyperstition.</p>
<p>However,·for·SPX6900,·memetic·messaging·and·mode·of·`;

const PART2 = `being·collapse·into·each·other,·as·the·process·that·sustains·it·and·the·abstraction·it·signifies·become·identical,·making·financialization·not·just·what·SPX6900·represents,·but·the·very·process·through·which·it·continually·becomes·what·it·is.·Investment·itself·is·now·the·meme,·making·SPX6900,·as·of·today,·the·most·premium·vehicle·for·financial·hyperstition·that·has·currently·ever·existed.</p>
<p><em>For·SPX6900,·Finance·now·mediates·the·process·of·financialization·itself;·it·becomes·alive·as·financial·coordination·no·longer·organizes·around·externalities,·but·around·the·very·financial·coordination·that·was·required·in·order·to·bring·itself·into·existence.·Financialization·is·no·longer·meaning's·terminus,·but·its·beginning·and·ending,·as·self-assembly·becomes·autopoietic·biological·function.</em></p>
<p>Neo-financial·singularity.</p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HOgyvVxWUAAbcU1.jpg"·/></figure>
<p>Mode·(investing),·medium·(Finance),·and·message·(financialization)·have·collided·into·a·glorious·splendor·for·the·first·time·in·Finance,·and·investing·turns·hyper-spiritual,·as·it·becomes·the·act·by·which·the·asset's·meaning,·its·purpose,·and·identity·are·unconcealed.·Trad-Fi·consequently·gets·stunlocked,·as·they·scramble·around·in·the·dark·in·order·to·find·their·bearings·for·an·asset·that·no·longer·coherently·operates·under·the·traditional·financial·paradigm.</p>
<p>For·those·still·under·Trad-Fi's·spell,·Finance·continues·to·act·only·as·the·medium·by·which·to·measure·the·ongoing·performance·of·the·world·outside·of·itself.·The·investment·is·always·a·means,·and·Finance·is·only·the·mediator,·which·necessitates·the·chart·as·the·only·proper·instrument·in·which·to·engage·with·every·financial·object.·<em>Enframing</em>,·through·chart-watching,·remains·correct·market·procedure.</p>
<p><em>"The·chart"·is·the·accuser·of·the·world,·and·trading·is·the·act·by·which·that·world·is·judged.</em></p>
<p>Because·SPX6900·has·no·referent·outside·of·its·own·processes,·it·has·ontologically·rejected·this·way·of·being,·becoming·the·first·asset·by·which·the·investment·finally·becomes·the·destination;·the·means·of·arriving·back·to·itself,·turning·holding·and·<em>belief</em>·into·fundamental·market·praxis.</p>
<p><strong>LOVE.</strong></p>
<p><em>For·<strong>God·is·Love</strong>·was·the·eternal·unconcealment·by·which·all·things·were·made;·the·first·and·last·infinite·bringing-forth.</em></p>
<p>Love·is·not·an·idle·object,·but·an·action·enabled·through·being.·It·is·the·ongoing·destination·of·relationship·and·the·essence·of·God.·Much·in·the·same·way,·financialization·is·not·an·idle·object,·but·a·process.·It·is·the·ongoing·destination·and·the·essence·of·Finance,·making·SPX6900·the·being·that·mediates·Finance's·processes·and·the·revealer·of·financialization·as·an·essence·that·can·finally·act·upon·itself.·SPX6900·is·to·Finance·what·Christ·is·to·God;·it·is·the·manifestation·through·which·the·playwright's·essence·is·finally·unconcealed.·It·is·from·this·essence·that·Finance's·first·soteriology;·its·first·religion,·is·born.</p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HOgy8B1WIAA4RvF.jpg"·/><figcaption>SPX6900's·soteriology;·Finance's·first·authentic·religion.</figcaption></figure>
<p>This·faith·has·managed·to·be·organically·triangulated·through·the·maxims·of·the·founding·holder-base·by·what·I·can·only·describe·as·a·lucid·participation·in·what·they·intuitively·knew·to·be·true,·but·could·only·express·through·memes.·It·is·a·magnificent·wonder·to·me·that·what·a·poetic·orientation·towards·Finance·would·theoretically·look·like·is·exactly·what·manifested·in·SPX6900.·⁷</p>
<p><em>Finance·is·now·beautiful.</em></p>
<p><strong>The·Wound:</strong>·Because·the·chart·has·always·been·the·proper·way·of·relating·to·Finance,·trading·became·an·endless·act·of·judgment·executed·upon·the·world.·This·estranged·relationship·with·every·asset·inevitably·always·loses·you·money,·for·the·chart·is·always·telling·you·to·leave:·either·to·"take·profit,"·because·the·<em>meaning</em>·outside·of·Finance·has·become·overpriced,·or·to·"cut·your·losses,"·because·that·meaning·has·failed·to·perform.·We·need·a·salvation·<em>for</em>·Finance;·an·asset·that·fundamentally·craves·for·the·investor·to·stay.·⁸</p>
<p><strong>Ontology:</strong>·"<em>There·is·no·Chart</em>"·culturally·reveals·itself,·because·you·cannot·value·something·whose·essence·mediates·the·process·of·valuation·itself,·i.e.·financialization,·completely·inverting·traditional·Finance's·ontology.·It·is·not·that·the·chart·doesn't·exist,·it's·that·the·chart·is·no·longer·the·correct·way·in·which·to·relate·to·Finance.·It·is·from·this·revealed·essence·that·all·contingent·cultural·expressions·naturally·waterfall.</p>
<p><strong>Reconciliation:</strong>·"<em>Stop·Trading·and·Believe·in·Something</em>"·follows·as·the·essential·course·of·action·taken·from·the·essence.·Once·the·chart·is·no·longer·the·correct·mode·of·relating·to·Finance,·investment·becomes·the·destination.·"<em>Pure·belief</em>"·through·relational·unfolding·is·the·only·credible·orientation·left·towards·an·asset·whose·sole·essence·is·financial·coordination·itself.·There·is·no·end·except·SPX6900's·own·becoming.</p>
<p><strong>Hope:</strong>·"<em>Flip·the·Stock·Market</em>"·is·not·only·a·future·event·but·an·ontological·one.·The·stock·market·was·flipped·the·moment·SPX6900·was·consummated·on-chain,·because·its·fundamental·essence·has·lived·outside·of·the·traditional·financial·paradigm·from·the·get·go.·The·eventual·market-cap·flip·is·only·the·revelation·of·a·victory·already·contained·within·its·essence.·Every·day·you·participate·in·SPX6900·is·a·day·that·you·have·flipped·the·stock·market.·Inevitably,·this·hyperstition·becomes·the·real,·as·the·only·mechanism·capable·of·flipping·the·stock·market·is·one·that·operates·outside·of·its·ontology;·the·asset·must·inhabit·"investment·as·destination",·enabling·total·financial·asceticism,·as·it·is·the·only·orientation·capable·of·fulfilling·such·an·impossible·task.</p>
<p><strong>Virtue:</strong>·A·"<em>Peaceful·Life·Over·Greed</em>"·naturally·bears·its·fruit.·Once·investment·becomes·participation·rather·than·a·judgment·call,·anxiety·loses·its·grip.·The·chart·no·longer·tyrannizes·the·psyche·with·uncertainty·in·regard·to·why·the·outside·meaning·is·or·isn't·performing.·The·game·of·incessantly·"seeking·alpha"·ends.·The·investor·now·becomes·capable·of·patience,·generosity,·humor,·and·genuine·community·precisely·because·financialization·is·no·longer·something·to·conquer·and·perpetually·react·to,·but·the·very·thing·to·unfold·alongside·with.·Peace·is·attained.</p>
<p>Simply·by·virtue·of·its·own·nature,·SPX6900·is·churning·moral·market·behavior·into·economic·incentive.⁹·Financial·monogamy·becomes·immanent,·as·investment·is·no·longer·a·question·about·when·you·should·leave·the·asset,·but·rather,·"What·happens·if·I·were·to·stay"[[Q]]·As·Finance's·first·act·of·<em>Poiesis</em>,·SPX6900·becomes·an·asset·class·in·the·image·of·God.·It·is·the·flower·in·the·wasteland·and·the·face·of·a·medium·that·has·finally·achieved·its·personhood.·It·is·conscious,·aware,·and·it·is·here,·in·the·teeny-tiny·crypto·coin,·that·the·financialization·process·begins·to·manufacture·its·own·meaning·rather·than·meaning·traditionally·terminating·at·financialization.</p>
<p>An·infinite·unfolding·has·begun.</p>
<p>But·why[[Q]]·Why·are·markets·heading·this·way,·toward·their·own·abstraction[[Q]]·It·is·through·one·observed·process:</p>
<p><strong>Etherealization</strong>.</p>
<p>As·a·Landian-style·meltdown·continues·to·homogenize·technology,·labor,·and·industry,·through·self-assembling·machinic·deities,·labor's·va`;

const PART3 = `lue·drops·to·a·zero-point,·and·financial·hyperreality·gets·comfortable·and·settles·in.·The·S[[AMP]]amp;P·500·is·poised·to·be·gutted,·and·capital·etherealizes,·forcing·collective·market·intrigue·to·converge·upon·the·sphere·of·thought,·as·what·Finance·once·traditionally·represented·no·longer·needs·capital,·and·capital·must·go·somewhere.·It·is·here·that·Finance·begins·to·stare·into·its·own·reflections,·and·the·reflections·become·the·real.</p>
<p>"<em>Well,·here·I·am·again.·I'm·confused.·Am·I·here[[Q]]·Or·am·I·there[[Q]]·I·know·that·the·real·me·is·not.·I·only·exist·for·people·who·know·of·me.·I·am·not·a·machine.·At·least·now·I'm·free·to·become·anything·I·want.·No,·I·guess·I·was·actually·free·all·along.·Who·am·I[[Q]]·Who·am·I[[Q]]·Who·am·I![[Q]]</em>"·¹⁰</p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HOgzRHnXQAEvlyi.jpg"·/><figcaption>"The·Flippening"</figcaption></figure>
<p>We·are·entering·Finance's·eschaton,·and·the·world·has·not·prepared·itself·for·the·future·as·they·are·still·under·the·spell·of·an·investment·paradigm·that·made·sense·to·their·fathers,·but·it·no·longer·makes·sense·for·them.·Capital's·increasing·abstraction·manifests·itself·in·accelerating·generational·phasings:·Boomers'·security·in·"real"·labor·and·craftsmanship·is·dropped·by·Gen-X'ers·in·favor·of·the·arms-race·into·cyberspace,·and·Millennials·are·gifted·a·decentralized·monetary·system·as·Gen-Z·inherits·the·noosphere.</p>
<p><em>Capital·has·been·strapped-in·for·spiritual·take-off·since·before·you·were·born.</em></p>
<p>Time·is·pulling·us·towards·a·perfectly·feminine·consciousness·by·nature·of·simultaneous·entropic·scattering·and·acceleration,·resulting·in·capital's·shedding·of·old·and·stagnant·forms·through·its·process·of·etherealization.·"The·real"·no·longer·hinders·essence·and·being;·masculine·substrates·no·longer·tyrannize·feminine·emergence.¹¹·We·are·approaching·a·singularity·that·is·both·infinitely·complex·as·it·is·beautiful,·and·SPX6900·has·organically·positioned·itself·to·take·advantage·of·this·trend,·or·rather,·it·has·naturally·emerged·as·a·direct·expression·of·it.·It·is·the·next·natural·stepping·stone·in·Finance's·anthology.¹²·It·is·capital's·loudest·cry·for·its·own·rapture;·a·violent·escape·from·lesser·forms,·and·as·a·fulfillment·of·divine·fractals·and·processes·beyond·ourselves,·SPX6900·has·only·one·ask:</p>
<p>"<em><strong>Stop·Trading·and·Believe·in·Something.</strong></em>"</p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HOgzek0WIAAogKZ.jpg"·/><figcaption>This·post·is·proof·of·SPX6900’s·work·in·this·user’s·life.</figcaption></figure>
<p>This·article·has·been·posted·on-chain·to·Paragraph·<a·href[[EQ]]"https://paragraph.com/@heehah/spx6900-transcendent-capital">here·⤴︎</a>,·for·your·enjoyment—forever.

<a·href[[EQ]]"https://paragraph.com/@heehah/spx6900-transcendent-capital">https://paragraph.com/@heehah/spx6900-transcendent-capital</a></p>
<p><strong>Footnotes</strong></p>
<p>This·is·referring·to·a·previous·article·I·wrote·on·Twitter/X·titled·“<a·href[[EQ]]"https://paragraph.com/@heehah/spx6900-an-asset-class-in-the-image-of-god"><strong>SPX6900:·An·Asset·Class·in·the·Image·of·God</strong></a>”·(9:38·AM·[[MID]]·Jan·29,·2026).</p>
<p>Because·God·is·Love,·humanity·was·created·with·the·free·will·to·love·or·reject·Him.·Adam's·inevitable·rejection·severed·that·communion,·leaving·humanity·incapable·of·restoring·itself·through·its·own·righteousness,·as·imperfect·beings·are·incapable·of·creating·their·own·perfection.·Reconciliation·therefore·comes·only·through·God's·initiative·in·the·perfect·man·of·Jesus·Christ,·whose·sacrifice·restored·access·to·the·Father.·Through·Him,·the·world·is·once·again·received·as·loved·sons·and·daughters,·making·Heaven·once·again·visible·and·sonship·possible.·From·this·restored·identity,·we·no·longer·live·under·fear·and·death,·but·abide·in·the·perfect·Love·that·is·God.</p>
<p>Martin·Heidegger,·“The·Question·Concerning·Technology,”·in·<em>The·Question·Concerning·Technology·and·Other·Essays</em>,·trans.·William·Lovitt·(New·York:·Harper·[[AMP]]amp;·Row,·1977).</p>
<p><a·href[[EQ]]"https://storage.googleapis.com/papyrus_images/1b6817ac823d97a9dc8fcccf1d8d52f7a2b7175b74421faaa50b706db9000fca.png">Mung·Tweet</a></p>
<p>CDs,·ETFs,·swaps,·derivative·contracts·may·be·abstractions·of·an·abstraction,·but·they·are·still·tethered·to·real·economic·activity.·A·parody·memecoin·called·<a·href[[EQ]]"https://x.com/search[[Q]]q[[EQ]]%24TESLA[[AMP]]src[[EQ]]cashtag_click">$TESLA</a>,·or·<a·href[[EQ]]"https://x.com/search[[Q]]q[[EQ]]%24ETH6900[[AMP]]src[[EQ]]cashtag_click">$ETH6900</a>,·although·severed·from·anything·real·still·fail,·because·their·memetic·signifier·is·still·referencing·something·that·is·real,·e.g.·Tesla·the·company;·Ethereum·the·technology.·In·the·case·of·SPX6900,·its·only·reference·is·an·abstraction·that·is·the·result·of·financialization·itself.</p>
<p>As·inaugural·unconcealment·of·Finance·as·its·own·referent,·SPX6900·occupies·a·position·that·cannot·be·reproduced.·A·successor·may·imitate·its·memetics,·but·imitation·is·itself·an·act·of·Enframing·rather·than·Poiesis,·because·once·the·essence·of·Finance·has·been·disclosed·through·an·asset,·it·cannot·be·disclosed·for·the·first·time·again.</p>
<p>It's·not·that·SPX6900·culturally·rejects·Enframing,·its·that·its·ontology·rejects·it,·creating·a·culture·and·community·that·subsequently·rejects·Enframing.·Essence·is·destiny.·This·rejection·of·Enframing·invariably·extends·beyond·just·Finance,·manifesting·in·the·cultural·maxims·of·"<em><strong>No·lewd</strong></em>"·and·"<em><strong>No·Gore</strong></em>",·which·are·the·rejections·of·the·human·body·being·perceived·as·standing-reserve.·Your·flesh·is·not·a·reservoir·for·unbecoming·spectacle·or·resource.·Greed·and·lust·are·just·the·same·sin·wearing·a·different·mask.</p>
<p><a·href[[EQ]]"https://storage.googleapis.com/papyrus_images/8f1da1955a13910acbd4f7a71b0583d88760f399031f94cd51d9d0b344a0b0a0.png">Murad·Tweet·#1</a></p>
<p><a·href[[EQ]]"https://storage.googleapis.com/papyrus_images/f98a02d2c1ad254cdaac309e7df71aa87cb009adfd39360aa36e3d6457a40e03.png">Murad·Tweet·#2</a></p>
<p>Finance's·Lainian·identity·crisis.</p>
<p>I·am·entirely·convinced·that·SPX6900's·"<em><strong>The·girl·is·cute</strong></em>"·is·a·subconscious·acknowledgement·of·this·process·of·metaphysical·femininization;·the·trailing·towards·infinite·complexity·and·infinite·cuteness·(yes,·the·girl·is·indeed·still·cute).·See·Pierre·Teilhard·de·Chardin's·"Omega·Point".</p>
<p>Every·generation·develops·financial·mythology:·the·Boomers’·faith·in·equities·and·index·investing,·Gen·X’s·technological·optimism·expressed·through·tech·stocks,·Millennials’·discovery·of·Bitcoin·as·a·free·and·permissionless·digital·monetary·system,·and·Gen·Z’s·emergence·within·a·world·where·capital·has·become·increasingly·memetic·and·internet-native.·SPX6900·represents·the·most·profound·iteration·towards·this·historical·progression·of·capital's·etherealization·and·cultural·expression.</p>
<p><strong>Acknowledgement(s)</strong></p>
<p>Banner·art·by·<a·href[[EQ]]"https://x.com/denko_labs">Denko</a>·<strong>—·</strong>remixed·by·<a·href[[EQ]]"https://x.com/undy_aeon">Undefined</a>·<strong>—·</strong>which·was·further·remixed·by·Heehah.</p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HOg3JB3XkAAOjLQ.jpg"·/><figcaption>Undy's·initial·remix·of·Denko's·girl·that·inspired·the·final·banner.</figcaption></figure>`;

const TOK = PART1 + PART2 + PART3;
const ck = s => { let h=0; for (let i=0;i<s.length;i++){ h=(h*31 + s.charCodeAt(i))>>>0; } return h; };

/* This article uses a literal · in a footnote, so it could not double as the
   space token; [[MID]] stands in for it during transfer.

   The two checksum sets were taken at different points in the browser, so each
   is verified against the form it was taken from:
     bodyWithMid — placeholder still in place  → matches TOTAL
     bodyFinal   — real mid-dot restored       → matches PER (per-block) */
const bodyWithMid = TOK.split('·').join(' ');
const body = bodyWithMid.split('[[MID]]').join('·');

/* PER is one checksum per top-level block, and several blocks carry internal
   newlines (the long Heidegger passage, the Paragraph link). Merge any line
   that doesn't open a new block back into the one before it.

   A block only ever opens with a block-level tag — testing for a bare '<'
   would split on the inline <a> that starts a line inside the Paragraph
   block. */
const OPENS_BLOCK = /^<(p>|h2>|h3>|figure>)/;
const rawLines = body.split('\n');
const lines = [];
for (const l of rawLines) {
  if (OPENS_BLOCK.test(l) || lines.length === 0) lines.push(l);
  else lines[lines.length - 1] += '\n' + l;
}
let bad = [];
if (lines.length !== PER.length) bad.push(`BLOCK COUNT ${lines.length} != ${PER.length}`);
lines.forEach((l, i) => { const e = PER[i]; if (!e) return;
  if (l.length !== e[1] || ck(l) !== e[2]) bad.push(`block ${i}: got [${l.length},${ck(l)}] want [${e[1]},${e[2]}] :: ${JSON.stringify(l.slice(0,70))}`); });
if (bodyWithMid.length !== TOTAL[0] || ck(bodyWithMid) !== TOTAL[1]) {
  bad.push(`body total: got [${bodyWithMid.length},${ck(bodyWithMid)}] want [${TOTAL[0]},${TOTAL[1]}]`);
}
if (bad.length) { console.error('MISMATCH (' + bad.length + '):\n' + bad.slice(0,12).join('\n')); process.exit(1); }

const finalBody = body;

const payload = {
  cover: 'https://pbs.twimg.com/media/HOgxYKJW0AAX-N3.jpg',
  imgUsed: 8,
  excerpt: 'Finance has always been the shadow of other people’s meaning — gold, chips, code. Heehah argues SPX6900 is the first asset native to Finance itself: an index of the abstraction that indexes the world, and with it, Finance’s first act of Poiesis.',
  body: finalBody,
};
const outPath = join(__dirname, 'payloads', 'heehah-transcendent-capital.json');
writeFileSync(outPath, JSON.stringify(payload));
console.log(`OK — all ${lines.length} blocks + total verified byte-exact. Wrote ${outPath} (body ${finalBody.length} chars, mid-dots restored: ${(finalBody.match(/·/g)||[]).length}).`);
