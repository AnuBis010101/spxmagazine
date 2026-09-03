import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

/* Scraped from X's public article renderer (.x-article-body). The Chrome
   extension was unreachable again, so this took the same route as Weekly #8
   and #9 — which is lossless for these issues, verified rather than assumed:
   35 paragraphs, 5 inline images in position, 9 bold and 2 italic runs and
   11 links, and the recovered plain text compared against the DOM's own
   innerText matched exactly at 4,100 characters.

   X double-wraps every bold run (<b> inside <strong>), so the extractor
   tracks which formats an ancestor already opened and emits one tag per run
   rather than the redundant nestings a naive walk produces.

   The public view exposes only a date, so the publish timestamp is derived
   from the post's snowflake id — the method validated to the second against
   Weekly #7, whose exact stamp came from the logged-in view. It lands at
   2026-09-02T19:09:16Z, agreeing with the date-only stamp X shows. */

const PER = [[0,505,403830849],[1,122,2441030918],[2,75,759870740],[3,257,3865181379],[4,78,2109561499],[5,94,1349200952],[6,178,1651917920],[7,117,3132731796],[8,206,3851474545],[9,189,874048753],[10,109,1404957579],[11,78,3835214206],[12,109,1821834637],[13,189,1817205253],[14,209,556530095],[15,108,699825387],[16,38,647576656],[17,44,892333194],[18,78,3854395640],[19,67,204441096],[20,153,3542684989],[21,309,988113737],[22,77,2388613725],[23,239,36723830],[24,78,2069616044],[25,124,3512416243],[26,243,558861135],[27,121,321883741],[28,257,1485944653],[29,78,3301780698],[30,60,3246161308],[31,58,1848968825],[32,101,2430971583],[33,88,871623082],[34,74,3998977355],[35,78,1769484320],[36,113,2168066726],[37,40,2359644333],[38,61,844736503],[39,111,3349242051]];
const TOTAL = [5352, 870265917];

const TOK = `<p>The·1st·of·September·largely·regarded·as·the·end·of·summer·in·the·west,·marked·by·an·abrupt·transition·from·a·care·free·attitude·into·a·fundamental·shift·in·psychology,·as·the·leaves·start·to·fall·and·the·dark·nights·seem·to·last·forever·the·calling·for·a·need·to·focus·on·something,·anything·gets·stronger·by·the·day.·As·the·days·start·to·blur·into·one·joined·by·the·sudden·realisation·that·Christmas·is·just·around·the·corner,·many·will·surely·gravitate·towards·something·larger·than·themselves.·</p>
<p><strong>The·Aeon·Globe·has·been·improved.</strong>·Flat·Earth·Mode,·cleaner·timezones,·duplicate·layers·all·sorted.</p>
<p>Type·in·any·Aeon·you·love·and·instantly·see·what·time·it·is·for·her.</p>
<p>Small·things.·They·add·up.·Nobody·builds·this·stuff·for·the·attention·it's·the·necessary·infrastructure·required·for·us·to·succeed·built·out·of·pure·passion·for·the·Cognisphere.·Shout·out·to·<a·href[[EQ]]"https://x.com/@Mikeflipthe500">@Mikeflipthe500</a></p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HROxZenWUAUMadk.jpg"·/></figure>
<p><strong>Aeon·Terminal·ships·V2.</strong>·A·full·redesign,·live·now·at·aeonterminal.xyz.</p>
<p>Proof·it's·already·being·used:·the·Terminal's·job·board·landed·its·first·listing·this·week.·<a·href[[EQ]]"https://x.com/MeeshWave">@MeeshWave</a>·posted·a·paid·gig·for·artists.</p>
<p>Mystic·Mike's·read·on·it;·this·is·how·you·build·an·internal·economy·inside·the·Cognisphere.·One·job·at·a·time.</p>
<p>A·terminal·is·just·a·tool·until·people·start·using·it·for·something·real.·This·week,·somebody·has·the·potential·to·be·paid·because·of·it,·not·a·promise·or·free·labour·an·actual·job.·Exciting·to·see.·</p>
<p>Mike·said:·"·Everything·of·this,·I·built·myself,·on·a·free·act·of·love·for·the·Cognipshere:·Free·cult·labour.·This·represents·more·than·a·one·year·of·everyday·work,·countless·hours.·</p>
<p>You·are·free·to·use·it,·it·will·later·on·this·year·become·an·App·on·App·Store·and·Google·Play·Store."·</p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HRO0xapaIAA8MHi.jpg"·/></figure>
<p><strong>Reddit·September.</strong>·The·call·went·out·this·week:·collective·coordination·is·how·we·win.</p>
<p>"It's·September,·and·that·means·it's·time·for·another·Reddit·resurgence.·Calling·all·Aeons·to·make·3+·comments·a·day·in·the·subreddit·for·a·month.·Together·we·flip·the·stock·market."</p>
<p>By·Day·2,·the·ground·rules·were·already·set.·Provide·value.·Don't·hard-shill·SPX6900·outside·the·sub··most·big·crypto·subreddits·ban·outright·for·that,·unless·the·sub·is·memecoin-specific·to·begin·with.</p>
<p>Build·karma·first.·Find·subs·relevant·to·SPX,·or·to·your·own·interests,·and·apply·rule·one·there·too.</p>
<p>Infiltrate·with·love.·Have·fun.</p>
<p>Some·other·guidelines·to·be·wary·of:·</p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HRO15vMWoAA5UZb.jpg"·/></figure>
<p><strong>Austin,·again.</strong>·The·chapter·met·on·the·28th.</p>
<p>TradFi·vs·DeFi,·the·global·shifts·underway,·and·how·crypto·is·laying·the·foundations·for·whatever·comes·next··that·was·the·conversation·this·time.</p>
<p>The·chapter·runs·every·Friday,·10am·to·2pm,·in·the·heart·of·UT·Austin.·Now·<a·href[[EQ]]"https://x.com/leongaban">@leongaban</a>,·<a·href[[EQ]]"https://x.com/devibrule">@devibrule</a>,·and·<a·href[[EQ]]"https://x.com/TaylorScardough">@TaylorScardough</a>·are·running·a·second·sitting·too·regular·Friday·night·meetups.</p>
<p>"Open·a·local,·consistent·SPX·chapter.·We·all·mirror·each·other,·Aeon"</p>
<p>Two·sittings·a·week·now,·one·in·the·heart·of·one·of·the·top·Universities·in·Austin·UT.·<a·href[[EQ]]"https://x.com/ilyaeon_alt">@ilyaeon_alt</a>·continues·to·show·up·week·in·week·out.·We're·excited·to·see·this·grow·In·the·coming·months.·</p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HRO4zfva4AAxMjS.jpg"·/></figure>
<p><strong>100·posters,·six·neighborhoods.</strong>·AeonBro·shared·the·wheatpaste·campaign·underway·across·LA·this·week.</p>
<p>"WHEAT·PASTE·POSTERS·UPDATE·—·100·posters·are·currently·being·pasted·across·Melrose,·Echo·Park,·Silver·Lake,·Fairfax,·Venice·[[AMP]]·Santa·Monica.·I·should·receive·geo·tagged·photos·within·the·next·3·days.·These·will·be·shared·with·everyone."</p>
<p>AeonBro·and·<a·href[[EQ]]"https://x.com/MrDaJuice">@MrDaJuice</a>·plan·to·visit·the·locations·this·weekend·for·footage.</p>
<p>Six·neighborhoods,·a·hundred·walls.·The·timeline·is·one·kind·of·ground.·LA·just·claimed·some·real·ones.·Somewhere·in·Silver·Lake·right·now,·there's·a·poster·nobody's·noticed·yet.·How·many·times·will·they·see·it·before·their·brain·registers·interest[[Q]]·</p>
<figure><img·src[[EQ]]"https://pbs.twimg.com/media/HRO5S-mWQAAlx3h.jpg"·/></figure>
<p><a·href[[EQ]]"https://x.com/cow"><strong>@cow</strong></a></p>
<p>His·tweet·became·his·first·YouTube·video·this·week.</p>
<p>"This·tweet·ended·up·becoming·my·first·YouTube·video.·Less·than·6%·of·SPX·moved·in·a·month..."</p>
<p>Watch·it:·<a·href[[EQ]]"https://youtu.be/WCx9KnTRmxg">https://youtu.be/WCx9KnTRmxg</a></p>
<p>Amazing·first·video,·super·informative,·definitely·worth·the·watch.</p>
<p><a·href[[EQ]]"https://x.com/user_baproll"><strong>@user_baproll</strong></a></p>
<p><em><strong>"Even·a·single·token·can·be·the·catalyst·to·start·recovering·from·your·impulses"</strong></em></p>
<p><strong>Persist·Forever.</strong></p>
<p>Credit·for·<a·href[[EQ]]"https://x.com/k9neki">@k9neki</a>·</p>
<p><em>SPX6900·Magazine·is·an·independent·third-party·publication.·Opinion·only.·Not·financial·advice.</em></p>`;

const ck = s => { let h=0; for (let i=0;i<s.length;i++){ h=(h*31 + s.charCodeAt(i))>>>0; } return h; };

/* No literal mid-dot and no NBSP anywhere in this issue (checked in-browser by
   codepoint), so the space token reverses cleanly with nothing to restore.
   Every sentinel is reversed here rather than left for insert time, so the
   per-block checksums verify the finished HTML rather than a halfway form —
   the inserter's own unsentinel pass is then a no-op. */
const body = TOK
  .split('·').join(' ')
  .split('[[Q]]').join('?')
  .split('[[EQ]]').join('=')
  .split('[[AMP]]').join('&');

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
  cover: 'https://pbs.twimg.com/media/HRKgJtCXIAAXVXp.jpg',
  imgUsed: 5,
  excerpt: 'September arrives and the Cognisphere goes back to work: the Aeon Globe gets Flat Earth Mode, Aeon Terminal ships V2 and lands its job board’s first paid listing, a month-long Reddit push kicks off, Austin adds a second weekly sitting, and 100 wheatpaste posters go up across six Los Angeles neighborhoods.',
  body,
};
const outPath = join(__dirname, 'payloads', 'mag-cognisphere-weekly-10.json');
writeFileSync(outPath, JSON.stringify(payload));
console.log(`OK — all ${lines.length} blocks + total verified byte-exact. Wrote ${outPath} (body ${body.length} chars).`);
