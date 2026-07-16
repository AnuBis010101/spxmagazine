import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

const PER = [[0,38,2332546575],[1,62,4134208608],[2,100,2232877198],[3,56,733555807],[4,74,387266229],[5,143,77965428],[6,95,3662304090],[7,21,3640341117],[8,74,3890930023],[9,45,3083438071],[10,63,3252156070],[11,107,1499051099],[12,76,27593471],[13,87,640616536],[14,89,170022629],[15,182,1415361587],[16,89,2498324481],[17,37,2182280705],[18,35,607991470],[19,23,2369031175],[20,49,1685647083],[21,67,218446850],[22,40,2136107874],[23,83,4032517690],[24,105,1798427898],[25,171,2611328854],[26,92,3640019511],[27,123,2209882516],[28,57,322707756],[29,39,969106678],[30,41,895612385],[31,41,606632502],[32,52,952804040],[33,41,4220448975],[34,23,1180838376],[35,24,3229496232],[36,32,2125170300],[37,160,2665351821],[38,33,3887912075],[39,83,2188086474],[40,111,2754441489],[41,35,1780771259],[42,47,1991045831],[43,76,1997175234],[44,130,3611916646],[45,59,2244195631],[46,68,3200083518],[47,96,2539957679],[48,140,2804386469],[49,158,4057272164],[50,72,1431065694],[51,126,4116560120],[52,308,2753800950],[53,24,1074611376],[54,153,2970544113],[55,107,4209083556],[56,101,2031979241],[57,116,1997721527],[58,23,1898424474],[59,145,2964551487],[60,18,718557252],[61,158,3720698944],[62,171,3551318231],[63,60,1008717831],[64,277,2202571272],[65,174,2069933562],[66,103,3340506994],[67,121,2472960336],[68,41,4216298539]];
const TOTAL = [6138, 2556635136];

const TOK = `<p>Everyone·wants·Bitcoin·upside.·</p>
<p>But·nobody·wants·to·get·wicked·out·of·a·5x·perp·at·3am.</p>
<p>There·is·exactly·one·asset·that·gives·you·BTC-cycle·leverage·without·the·liquidation·engine.·</p>
<h2>The·Bitcoin·spirit,·reincarnated·and·amplified.</h2>
<p>Bitcoin·wasn't·built·by·a·price·chart.·It·was·built·by·a·community.</p>
<p>The·conferences.·The·podcasts.·The·books.·The·fanatical,·hard-working,·long-termist·people·who·showed·up·every·day·and·refused·to·leave.</p>
<p>For·ten·years,·every·wave·of·crypto·has·tried·to·recreate·that·energy.·None·of·them·did.</p>
<p>Until·SPX6900.</p>
<p>—·<strong>10+·weekly·podcasts.</strong>·Every·week.·No·off-season.·</p>
<p>—·<strong>5·books·published.·</strong></p>
<p>—·<strong>4·international·conferences·in·2026.</strong>·</p>
<p>—·<strong>Selling·is·treated·as·a·moral·failure.</strong>·85%+·diamond·hands.·Sub-1%·daily·turnover.</p>
<p>—·<strong>DCA·discipline·as·religion.</strong>·Public·daily·stackers.</p>
<p>—·<strong>Fair·launch.·No·team·tokens.·No·VCs.·No·presale.</strong>·Same·as·BTC.</p>
<p>Bitcoin·came·for·the·central·banks.·SPX6900·is·coming·for·the·entire·stock·market.</p>
<p>The·same·mix·of·pure,·hard-working,·long-termist·energy·that·took·BTC·from·pennies·to·six·figures·is·now·pointed·at·SPX.·Same·archetype.·Same·fanaticism.·Same·refusal·to·fold.</p>
<p>This·kind·of·collective·alignment·happens·once·a·decade.·Maybe·twice·a·generation.</p>
<p>Most·people·don't·see·it·yet.·</p>
<p><strong>They·will.·</strong></p>
<p>Now·to·the·math.</p>
<h2>Dataset:·18·months,·Oct·2024·→·Mar·2026.</h2>
<p>Full·window.·Bull·months·and·bear·months.·No·cherry-picking.</p>
<p>What·does·the·regression·say[[Q]]</p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HHUqoDmagAASvpH.jpg"·/></figure>
<p>📊·Beta·(SPX·vs·BTC):·<strong>2.29·</strong>—·for·every·1%·BTC·moves,·SPX·moves·~2.29%·on·average.</p>
<p>📊·Alpha:·<strong>+7.7%/month</strong>·(+92%·annualized)·—·the·average·return·SPX·delivered·<em>beyond</em>·what·BTC's·move·alone·explains.·SPX·has·its·own·gravity.</p>
<p>📊·Spearman·correlation:·<strong>0.74·</strong>—·strong·co-movement,·not·coincidence.</p>
<p>📊·Directional·agreement:·<strong>83%·of·months·</strong>—·when·BTC·moves,·SPX·moves·the·same·way·5·out·of·6·months.</p>
<h2>Where·it·gets·interesting·—·conditional·capture.</h2>
<p>🟢·Months·BTC·was·up·(n[[EQ]]9):</p>
<p>—·Avg·BTC:·<strong>+12.1%</strong></p>
<p>—·Avg·SPX:·<strong>+51.5%</strong></p>
<p>—·Mean·upside·capture:·<strong>4.25x</strong></p>
<p>🔴·Months·BTC·was·down·(n[[EQ]]9):</p>
<p>—·Avg·BTC:·−8.3%</p>
<p>—·Avg·SPX:·−27.2%</p>
<p>—·Downside·capture:·3.29x</p>
<p>More·upside·per·BTC-up·month·than·downside·per·BTC-down·month.·That's·positive·convexity.·A·<em>structurally·asymmetric</em>·expression·of·the·BTC·cycle.</p>
<h2>The·bull·months,·ranked.</h2>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HHUv6nuasAAM8au.jpg"·/></figure>
<p>Every·meaningul·BTC-up·month,·SPX·ran·harder.·Best·month·delivered·<strong>17.6x·BTC's·return</strong>.·</p>
<p>The·asymmetry·is·not·subtle.</p>
<h2>Spot·vs·perps:·who·survived·the·cycle.</h2>
<p>SPX·gave·you·that·4.25x·mean·/·10x·median·upside·—·without·leverage.·</p>
<p>Now·look·what·happens·when·you·try·to·get·the·same·exposure·with·actual·leverage·over·the·same·period,·Oct·2024·→·Apr·2026:</p>
<p>—·<strong>4x·BTC·perp:</strong>·you·died·twice.·💀💀</p>
<p>—·<strong>5x·BTC·perp:</strong>·you·died·four·times.·💀💀💀💀</p>
<p>—·<strong>10x·BTC·perp:</strong>·uncountable.·You·weren't·a·trader.·You·were·a·sacrifice.</p>
<p>Even·if·you·somehow·survived·every·wick,·the·5x·perp·funding·+·drawdown·drag·would·have·closed·the·window·at·<strong>−99.3%</strong>.</p>
<p>BTC's·peak-to-trough·over·the·window:·<strong>126K·→·60K·[[EQ]]·−52.4%.</strong>·Anything·leveraged·above·<strong>1.91x</strong>·was·guaranteed·to·die.</p>
<p>There·was·no·leverage-and-hold·strategy·that·survived·this·cycle.</p>
<p>The·only·way·to·express·bullish-BTC·conviction·across·an·entire·cycle·without·getting·wicked·is·spot<strong>.</strong>·</p>
<p>The·highest-beta·spot·expression·on·the·board·is·<a·href[[EQ]]"https://x.com/search[[Q]]q[[EQ]]%24SPX[[AMP]]src[[EQ]]cashtag_click"><strong>$SPX</strong></a><strong>.·</strong>It·is<strong>·t</strong>he·only<strong>·</strong>synthetic·perpetual·on·BTC·with·no·funding·rate,·no·expiry,·no·margin·calls.</p>
<h2>Honest·summary.</h2>
<p>📈·<strong>Quant·edge:</strong>·2x·beta,·+92%·annualized·alpha,·83%·directional·agreement.·SPX·is·a·high-beta·BTC·expression·with·its·own·gravity.</p>
<p>🟢·<strong>Bull·months:</strong>·4.25x·average,·10x·median,·17.6x·peak.·The·asymmetry·is·structural.</p>
<p>💎·<strong>Structural·edge:</strong>·No·liquidation.·No·funding.·No·counterparty.·Fair·launch.</p>
<p>⚠️·<strong>The·honest·downside:</strong>·3.3x·downside·capture.·SPX·is·volatile.·This·only·works·if·you·hold.</p>
<h2>The·real·talk.</h2>
<p>BTC·delivered·the·greatest·wealth·transfer·in·financial·history.·Nothing·else·came·close,·not·Amazon,·not·Apple,·not·gold,·not·the·Nasdaq.</p>
<p>Past·tense.</p>
<p>Bitcoin·was·born·in·2009·as·a·rebellion,·against·central·banks,·against·bailouts,·against·a·financial·system·rigged·for·insiders.·It·worked.·Too·well.·</p>
<p>At·$1.5T·market·cap,·BTC·isn't·going·to·100x·you.·It's·not·life-changing·money·anymore.·It's·macro·money.·Treasury·reserve·money.·And·that's·a·feature,·not·a·flaw.·</p>
<p>From·here,·BTC·is·the·foundation.·Not·the·multiplier.</p>
<p><a·href[[EQ]]"https://x.com/search[[Q]]q[[EQ]]%24SPX[[AMP]]src[[EQ]]cashtag_click"><strong>$SPX</strong></a><strong>·is·$300M·market·cap.</strong>·Five·thousand·times·smaller·than·BTC.·Same·supply·discipline.·Same·"we·don't·sell"·religion·that·built·BTC·into·what·it·is.</p>
<p>SPX6900·is·a·new·paradigm·built·<em>because</em>·Bitcoin·exists,·for·a·generation·priced·out·of·housing,·priced·out·of·stocks,·and·now·priced·out·of·work·itself·by·AI.</p>
<p>This·isn't·BTC·vs·SPX.·This·is·BTC's·old·playbook·running·on·a·new·ticker,·in·the·early·innings.</p>
<p>The·math·is·in·front·of·you.·The·thesis·is·in·front·of·you.·The·community·is·in·front·of·you.·Pick·your·asymmetry.</p>
<p>Spot.·DCA.·Hold.·Ignore·the·noise.</p>`;

const ck = s => { let h=0; for (let i=0;i<s.length;i++){ h=(h*31 + s.charCodeAt(i))>>>0; } return h; };
const body = TOK.split('·').join(' ').split('⍽').join(' ');
const lines = body.split('\n');
let bad = [];
if (lines.length !== PER.length) bad.push(`LINE COUNT ${lines.length} != ${PER.length}`);
lines.forEach((l,i) => { const e = PER[i]; if (!e) return;
  if (l.length !== e[1] || ck(l) !== e[2]) bad.push(`line ${i}: got [${l.length},${ck(l)}] want [${e[1]},${e[2]}]  ::  ${JSON.stringify(l.slice(0,70))}`); });
if (body.length !== TOTAL[0] || ck(body) !== TOTAL[1]) bad.push(`body total: got [${body.length},${ck(body)}] want [${TOTAL[0]},${TOTAL[1]}]`);
if (bad.length) { console.error('MISMATCH:\n' + bad.join('\n')); process.exit(1); }

const payload = {
  cover: 'https://pbs.twimg.com/media/HHUg18pbUAAIHhl.jpg',
  imgUsed: 2,
  excerpt: "Everyone wants Bitcoin upside, but nobody wants to get wicked out of a 5x perp at 3am. 18 months of data on why SPX6900 is the highest-beta, no-liquidation expression of the BTC cycle.",
  body,
};
const outPath = join(__dirname, 'payloads', 'zokinomics-long-bitcoin.json');
writeFileSync(outPath, JSON.stringify(payload));
console.log(`OK — all ${lines.length} lines + total verified byte-exact. Wrote ${outPath} (body ${body.length} chars, ${payload.imgUsed} imgs).`);
