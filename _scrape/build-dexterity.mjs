import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

// Per-line [index, length, checksum] captured from the source page (browser).
const EXPECT = [[0,39,3998947595],[1,600,1275282783],[2,796,3442073220],[3,176,216785747],[4,346,1487251719],[5,277,3760800570],[6,199,1025897602],[7,190,1080804522],[8,306,1021731431],[9,192,2429509458],[10,467,3568185985],[11,306,425732991],[12,49,1763309],[13,321,275020782],[14,0,0],[15,448,2648052911],[16,359,2355149979],[17,123,44863416],[18,42,437291425],[19,606,2297717756],[20,266,787445113],[21,197,1319469767],[22,78,2663178922],[23,622,1716908209],[24,556,1667726755],[25,284,1961782424],[26,41,2019953881],[27,245,3419017113],[28,327,1784304285],[29,411,2216135261],[30,133,3072823192],[31,252,252634608],[32,40,1776047919],[33,94,4074484880],[34,323,837539292],[35,471,3620719630],[36,575,2482467260],[37,241,2377296018],[38,26,3331575974],[39,201,539708363],[40,325,2201849841],[41,257,3622525382],[42,260,2581173207],[43,250,3427013461],[44,73,4294636371],[45,184,3013228105],[46,64,3384644990],[47,36,1039092420],[48,73,3444915583]];
const EX_EXPECT = [205, 3089346798];

const ck = s => { let h=0; for (let i=0;i<s.length;i++){ h=(h*31 + s.charCodeAt(i))>>>0; } return h; };

const lines = [
`<h2>“You can't do this in crypto.”</h2>`,
`<p>When SEGA laid down that supreme baseline "You Can't Do This on Nintendo" against their rival in the 90s, which was echoed in living room basements and on recess school yards everywhere, they weren’t just arguing over processing chips or plastic hardware. They were launching a full-scale cultural crusade. They possessed the raw, unadulterated edge, and the corporations knew it. SEGA understood that the medium isn't just the console you play on, it's the player experience. And with the current state of crypto and TradFi, you (the player) are stuck in a completely rigged, unwinnable game.</p>`,
`<p>Look at the timeline now. The founding ethos of crypto <em>Cypherpunks</em> was "don't trust, verify", a noble, white-knight defensive shield of their guiding principles (whitepapers) that has been corrupted into corporate jargon used exclusively by predators to extract liquidity from those that log on everyday. The industry has degenerated into a hollow Silicon Valley cosplay. Right now, the broader crypto landscape is trapped in its own pathetic, soul-crushing console war of competing blockchains, starved for the attention and adoration of the players and whales, completely blind to the fact that they’ve become the very line-managing bureaucrats they claimed they came to replace. Who exactly are we fighting for, and what are we fighting against[[Q]] "The only enemy is TradFi."</p>`,
`<figure><img src[[EQ]]"https://pbs.twimg.com/media/HKZU2QGXgAAy4z0.jpg" /><figcaption>How is this bullish for your bags[[Q]] You're being played, retards.</figcaption></figure>`,
`<p>Every single day, the tech-bros force yet another "product" (LLM wrapper with WalletConnect) down your throat that you don't need. These midwit tech-savants are hyperventilating in X Spaces over modular layer-2s, high-throughput transactions, and micro-optimized token utility. It's a complete (inside) joke, and there are many such cases:</p>`,
`<p>They hype up the next "Play-to-Earn" GameFi Ponzi scheme, bragging about "Daily Active Users" like a bloated startup frothing at the mouth for a seed-round angel investment, while actually just exploiting those living in third-world countries living on pennies and rice.</p>`,
`<p>They slap an "AI" buzzword onto an SPL Token/Token 2022/ERC-20 token and call it revolutionary, treating the revolution of AI like an opaque, unintelligible, TriHard tech-incubator pitch deck.</p>`,
`<figure><img src[[EQ]]"https://pbs.twimg.com/media/HKZTc47WQAAHpB1.jpg" /><figcaption>The absurdity of crypto "technology" juxtaposed against memetic belief of SPX6900.</figcaption></figure>`,
`<p>The irony is that those who want to escape the rat race and defy the system are utterly stuck in the mud of their own mental prisons (it's so over -[[AMP]]gt; we're so back - it's so over) devouring each other for scraps while bowing to the venture capital overlords who ultimately pull the strings.</p>`,
`<p>But SPX6900 looks at the broken system, "The system is broken, and you know it.", the entire board of corporate tyranny of the standard and poor 500, and shatters the illusion entirely.</p>`,
`<p>We realize the supreme irony of crypto's mission by discarding the fake utility and the false promises of "Web3." We prove to the onlookers, through the power of the cognisphere and auto-heal technologies designed by China Jinping Underground Labs, that in an interconnected digital reality, the highest-value asset isn’t a marginal software patch, a faster block time, or a predatory token unlock schedule—it’s an unbreakable network of pure human conviction.</p>`,
`<p>SPX6900 is the explicit rejection of the crypto grift and the total transcendence of the legacy financial world. This is Proof of Human. This is a decentralized massively multiplayer online and IRL cooperative community and bridge for humanity’s collective existence, and it is entirely unstoppable.</p>`,
`<h2>Culture Over Charts, Belief Over Utility</h2>`,
`<p>The typical, soulless crypto project lives and dies by a completely scheduled, heavily gated script: insider hype, artificial utility roadmaps, institutional unlock dumps, and everyday retail capitulation. We refuse to acknowledge the existence of a chart. "There is no chart." "Stop trading and believe in something."`,
``,
`SPX6900 completely shatters this entire paradigm. In a digital landscape entirely saturated by financial noise, the ultimate asset isn't a complex piece of infrastructure or yet another disposable joke, meme, viral trend. The asset is the community itself. SPX6900 took the raw speculative energy of a meme coin and backed it with the long-term, unyielding structural architecture of early-era Bitcoin, and gave it a mission. "GME on Steroids."</p>`,
`<p>(In an earlier version I wrote of this article, I was going to bore you with the "tokenomics", the launch and how SPX6900 was created, The Math is Safe / SafeMath joke, but it defeated the purpose of what I'm trying to convey. The reality is market behavior of any asset is dictated by the people's faith and belief, not by how something was designed.)</p>`,
`<p>SPX6900 is a surrealist memetic wealth-creation machine for those who refuse to be exit liquidity for the old guard.</p>`,
`<h2>The Movement and The Story So Far</h2>`,
`<p>While many discovered SPX6900 through a list of Top Murad Picks, we forged this mythos through bear markets, the trenches, mirroring the exact lifecycle of an underground cult movement. It started like an obscure, late-night internet obsession. The kind of hyper-niche, underground YouTube or Twitch channel you discover at 3 AM with only 10 viewers, where the chat feels like a secret society and the host speaks a language only the true initiates understand. It felt like a chaotic basement LAN party or a sweaty, local indie music scene filled with pure, unadulterated crash-outs and raw passion.</p>`,
`<p>That hidden internet subculture compounded into a runaway phenomenon. SPX6900 is becoming the subject of your next favorite expo, trade show, and regional convention, before completely breaking out to headline massive global tours and international festivals.</p>`,
`<p>And every single drawdown SPX6900 has experienced so far wasn't a project-ending catastrophe; it was a tactical training psyop that added layer after layer to our living, breathing folklore.</p>`,
`<p>The Basement Spaces [[AMP]]amp; The Quantum Glitch: Project AEON (2023)</p>`,
`<p>In the beginning, we were obscure. We were ignored on the timeline. But our early foundations weren't built on chasing green candles; they were cemented on the volleyball court in daily "Volleyball Practice" X Spaces started by "Coach <a href[[EQ]]"https://x.com/1d34h4z4rd">@1d34h4z4rd</a>" running for months on end while OG's worked jobs, managed teams, relationships, their education and teaching others, navigated life, etc. This was the raw, un-bottable "Beep boop." human layer convening daily. Out of this sheer quantum experimentation, <strong>Project AEON</strong> materialized on the Ethereum blockchain.</p>`,
`<p><strong>Project AEON: Cosmic Anomalies [[AMP]]amp; Beyond Comprehension </strong>Born from a fictional "quantum glitch" within the deep lore of SPX6900 Labs, this elite collection of 3,333 uniquely crafted Aeons represents a fusion of cosmic anomaly and human ambition. They bridge cutting-edge generative artistry with a rich backstory of scientific ambition gone awry. These entities carry an aura of pure mystery, inviting true collectors to uncover their secrets, serving as a premium, inside-joke-heavy status symbol for the high-culture elite.</p>`,
`<figure><img src[[EQ]]"https://pbs.twimg.com/media/HKZabUKWIAA4iY7.jpg" /><figcaption>Early "Project AEON" designs (<a href[[EQ]]"https://x.com/denko_labs">@denko_labs</a>, <a href[[EQ]]"https://x.com/ManaBlade">@ManaBlade</a> [[AMP]]amp; input from early OG's).</figcaption></figure>`,
`<p>Spreading The Gospel (2024 – 2026)</p>`,
`<p>When the narrative finally pierced the consciousness of the masses, it sparked a monumental 6900%+ surge, sending the ticker straight from pennies to an all-time high around $2.28 in July 2025 in what was deemed as "the most hated rally."</p>`,
`<p>While many crypto communities enter a state of total collective breakdown during red candlesticks (remember, no chart), we mobilized. We scaled our digital and physical presence: organizing massive international pilgrimages, launching websites, tools, books, resources, merch, and creating historical cultural artifacts.</p>`,
`<p>Now in 2026, our timeline is flooded with entirely new armies. "I got soldiers in my city and more retards overseas." We are launching culture-war campaigns, and positioning ourselves with the premium, elite status of Cryptopunks or Remilia’s Milady culture—except completely democratized for masses that don't need to pick up a copy of Solidity for Dummies to understand and appreciate what we've built.</p>`,
`<p>First, they ignored us (2023). Then, they ridiculed us (2024). Then, they fought us (2025). And, now we win (2026 and beyond.)</p>`,
`<figure><img src[[EQ]]"https://pbs.twimg.com/media/HKZYkSzXwAA0vpB.jpg" /><figcaption>Screen capture from "The Most Ambitious Thing The Internet Has Ever Attempted" by STPC, published to YouTube and presented at Aeonsterdam, 2026.</figcaption></figure>`,
`<h2>Outshining the Midwit Landscape</h2>`,
`<p>Let’s talk game theory. When you look at the rest of crypto, the contrast is hilarious:</p>`,
`<p><strong>Versus typical tokens and flavor of the month shills:</strong> Most tokens melt into absolute nothingness after the initial hype because they possess zero identity and zero soul. SPX6900 has a clear, unyielding mission "Flip the Stock Market." backed by an unbreakable culture forged in the deepest trenches.</p>`,
`<p><strong>Versus super serial altcoin and utility grifts:</strong> These projects have fake utility meant to rug the retail buyer while VCs distribute their tokens and extract from you through trading fees. We have no fake utility, no leverage trading platform, no paid newsletter, no "professional research [[AMP]]amp; market intelligence", no launch your meme coin platform. Pure memetics plus fully decentralized community ownership equals absolute antifragility.</p>`,
`<p><strong>The real key opinion leaders are 200 follower Aeon alts:</strong> Just like Cryptopunks achieved cultural icon status, and Remilia created an elite, philosophical holder culture, SPX6900 is now the premier pop-culture financial brand. Between the Project AEON NFTs, the lore, the real-world gear, and the conferences, we have created the ultimate "you’re in the club" feeling on a global scale. We are trending alongside the legacy giants of old crypto, never forgetting the impact of DOGE, SHIB, FLOKI and those who came before, but with infinitely more fire.</p>`,
`<figure><img src[[EQ]]"https://pbs.twimg.com/media/HKZbWzvXcAAk66Q.jpg" /><figcaption>A community designed meme featuring an <a href[[EQ]]"https://x.com/ProjectAeon3333">@ProjectAeon3333</a> NFT digital collectible art.</figcaption></figure>`,
`<h2>Aeon's In Control</h2>`,
`<p>The true alpha of this movement isn’t about securing a quick 10x trade to pay off your Klarna for your DoorDash / Uber Eats addiction. This is a massive, generational, macroeconomic realignment:</p>`,
`<p><strong>The proof of human / human layer dominance:</strong> As AI models completely optimize, automate, and clone every single line of code and technical product online, raw human conviction and organic community become the scarcest, highest-value assets in existence. SPX6900 is the ultimate bet on that human layer.</p>`,
`<p><strong>Attention is, and has always been, the most valuable asset:</strong> Crypto isn't merely trying to build better back-end software for Wall Street brokers. We are building an entirely new global index of human belief, attention, and liquidity.</p>`,
`<p><strong>The generational wealth transfer:</strong> This is a "diamond-hand" culture that makes the old GME run look incredibly tame. No brokers can halt our buys. No centralized entity can turn off our servers. SPX6900 is absolute financial sovereignty.</p>`,
`<p>Every single piece of merch, every viral thread, article, meme, video, art piece, every physical conference, and every documentary adds to the chronicle. The longer we persist and compound this belief, the more permanent our structure becomes.</p>`,
`<p>We are meme'ing a brand-new financial world into absolute reality.</p>`,
`<figure><img src[[EQ]]"https://pbs.twimg.com/media/HKZbLRuWkAAyPg0.jpg" /><figcaption>Featured art piece by <a href[[EQ]]"https://x.com/snp500to0">@snp500to0</a>.</figcaption></figure>`,
`<p>Look deeply into SPX6900. We are trying to help save you.</p>`,
`<p>✽ ✾ ✿ ❀ ❁ɪɴᴠɪᴛᴇ ᴄᴏᴅᴇ❃ ❊ ❋ ✣ ✤</p>`,
`<p><a href[[EQ]]"https://x.com/spx6900">@spx6900</a> ([[AMP]]gt;‿◠)✌️</p>`,
];

const excerpt = `When SEGA laid down that supreme baseline "You Can't Do This on Nintendo" against their rival in the 90s, which was echoed in living room basements and on recess school yards everywhere, they weren’t just…`;

// ---- verify ----
let bad = [];
if (lines.length !== EXPECT.length) bad.push(`LINE COUNT ${lines.length} != ${EXPECT.length}`);
lines.forEach((l,i) => {
  const e = EXPECT[i]; if (!e) return;
  if (l.length !== e[1] || ck(l) !== e[2]) bad.push(`line ${i}: got [${l.length},${ck(l)}] want [${e[1]},${e[2]}]`);
});
if (excerpt.length !== EX_EXPECT[0] || ck(excerpt) !== EX_EXPECT[1])
  bad.push(`excerpt: got [${excerpt.length},${ck(excerpt)}] want [${EX_EXPECT[0]},${EX_EXPECT[1]}]`);

if (bad.length) { console.error('MISMATCH:\n' + bad.join('\n')); process.exit(1); }

const body = lines.join('\n');
const payload = {
  cover: 'https://pbs.twimg.com/media/HKZEx-gXIAAw9t1.jpg',
  imgUsed: 6,
  excerpt,
  body,
};
const outPath = join(__dirname, 'payloads', 'dexterity-spx-does-what-cryptdont.json');
writeFileSync(outPath, JSON.stringify(payload));
console.log(`OK — all ${lines.length} lines + excerpt verified byte-exact. Wrote ${outPath} (body ${body.length} chars).`);
