import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hvmndangtzarsnqgnuky.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bW5kYW5ndHphcnNucWdudWt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDYyNTQ1MSwiZXhwIjoyMDkwMjAxNDUxfQ.oWPVawa-d7-5i-3XFt0n-DUEI2po3OEwOr5hGcTExY0'
);

function textToHtml(text) {
  // Split into paragraphs by double newlines or section headers
  const lines = text.split('\n');
  let html = '';
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    // Detect headings (lines that are short and don't end with period, or are ALL CAPS sections)
    if (trimmed.match(/^\d+\.\s/) || (trimmed.length < 120 && !trimmed.endsWith('.') && !trimmed.endsWith(',') && !trimmed.endsWith(';') && trimmed.includes(':') === false && trimmed.length > 10 && !trimmed.startsWith('"') && !trimmed.startsWith('—'))) {
      html += `<h2>${trimmed}</h2>\n`;
    } else {
      html += `<p>${trimmed}</p>\n`;
    }
  }
  return html;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80)
    .replace(/-$/, '');
}

const articles = [
  {
    title: "SPX6900 Declares What Bitcoin Whispers",
    slug: "spx6900-declares-what-bitcoin-whispers",
    excerpt: "Many do not understand SPX6900, but many will, and many will join. The Movement as a Meme of Financial Protest.",
    cover_image: "https://pbs.twimg.com/media/GcSSlC9XMAAZ-3X.jpg",
    author_name: "Plutermes",
    content_type: "article",
    published_at: "2024-11-13T00:00:00Z",
    tags: ["philosophy", "movement", "protest"],
    body_html: `<p>Many do not understand SPX6900 (hereinafter referred to as the "Movement") but many will, and many will join.</p>

<h2>The Movement as a Meme of Financial Protest</h2>
<p>A gene is a biological unit of information. A meme is a cultural unit of information. A gene spreads itself through biological transmission and replication. A meme spreads itself through cultural transmission and replication. A meme propagates itself though the collective human mind. Simply put, a meme is an idea. Popular ideas spread, unpopular ideas die. Memes are created through cultural and social context. The most popular ideas of today are those which were visionary at some point in the past, until the next visionary meme is created.</p>
<p>Bitcoin was the first financial meme. And arguably, the first vehicle of subtle financial protest. As logic follows: the very act of buying Bitcoin, you are subtly agreeing with the message of its Genesis Block, you are subtly seeking protection from inflation, you are subtly expressing distrust in and bearishness on government fiat, you are subtly participating in a form of financial protest, and you are subtly telling the Greedy Bankers to go fuck themselves.</p>
<p>There have been many forms of financial protest, from Occupy Wallstreet to the GME short squeeze. These protests are loud, collective, and strategically orchestrated to damage and be HEARD. The Movement is the natural evolution of this financial protest.</p>

<h2>The Movement as a Mission</h2>
<p><em>"There is no chart. There is no price."</em></p>
<p>The inherent mission of the Movement is to flip (destroy/humiliate/conquer) the symbolic bulwark of traditional finance, the S&P500.</p>
<p>For the purpose of this analysis I must, for a brief moment, break our own philosophy and focus your attention on the "chart" and "price." The sellers you see dumping in the charts are nonbelievers, traders, doubters. They need to be shaken out, they need to return their tiny little cryptocoins to the market for the true believers to join.</p>
<p>Traditional technical analysis is futile on this new asset class. The reasons are as follows:</p>
<ul>
<li>The Movement is a novel emerging financial vehicle of protest.</li>
<li>The Movement is a financialized ideology where people vote with their capital.</li>
<li>The Movement realizes increasingly more mindshare, mimetic power, and propagation based on believers who align themselves with the ideological mission of the Movement.</li>
<li>Fanaticism and zealotry exists and/or develops in early believers and the converts which join the Movement thereafter.</li>
</ul>
<p>The zealots, the converts, and the revolutionaries align themselves with the Movement by contributing large amounts of energy (money) in order to be a holder/believer of the Movement and its message. As a result, these Aeons, holding large supply, do not sell or sell minimally.</p>
<p>THIS IS NOT TO DISSUADE YOU FROM SELLING. There is absolutely nothing wrong with taking profits. However, the true Aeons know peaceful life over greed. Take what you need, start the family, buy the house, take care of your loved ones. But do not succumb to greed, to the very beast of materialism which has been programmed in the western consumer by the Bankers. Peaceful life over greed.</p>
<p>The mission is one big fucking joke. The journey of the Movement is one big fucking joke. The purpose of the Movement is to literally mog the Boomers Casino. The Movement as a meme WILL be seen by its intended target, by its punchline, by the Greedy. Traditional Finance will finally look at itself in the mirror.</p>
<p>The Movement is a declaration. The Movement is thunder to Bitcoin's lightning.</p>
<p><strong>Aeon.</strong></p>`
  },
  {
    title: "SPX6900: At the Intersection of Bitcoin, Dogecoin, and GameStop",
    slug: "spx6900-at-the-intersection-of-bitcoin-dogecoin-and-gamestop",
    excerpt: "The history of financial markets is shaped by movements that transcend mere trading and evolve into cultural phenomena. Today, a new contender is emerging: SPX6900.",
    cover_image: "https://pbs.twimg.com/media/GmfAGg9WMAAT6C2.jpg",
    author_name: "T-Dog",
    content_type: "article",
    published_at: "2025-03-20T00:00:00Z",
    tags: ["bitcoin", "dogecoin", "gamestop", "comparison"],
    body_html: `<p>The history of financial markets is shaped by movements that transcend mere trading and evolve into cultural phenomena. Bitcoin (BTC), Dogecoin (DOGE), and GameStop (GME) are prime examples. Each of these revolutions began as an outsider narrative, driven by belief rather than institutional backing.</p>
<p>What they all have in common is that they emerged from the bottom, not the top—from retail traders, internet communities, and believers challenging the financial establishment.</p>

<h2>1. Bitcoin: The Revolt Against the System</h2>
<p>Bitcoin was born out of rebellion. In 2009, Satoshi Nakamoto introduced BTC as an alternative to the traditional banking system, rooted in cypherpunk ideology. Bitcoin embodies decentralization and resistance to financial institutions.</p>
<p>SPX6900 shares this same dynamic. Its slogan, "Flip the Stock Market," directly challenges traditional finance, particularly the S&P 500. While BTC aims to replace the monetary system, SPX6900 seeks to reshape financial reality.</p>
<p>But beyond the symbolism, SPX6900 also shares Bitcoin's purity:</p>
<ul>
<li><strong>Limited Supply</strong> — Unlike Dogecoin or GameStop, SPX6900 has a fixed supply. No minting, no inflation—just like Bitcoin.</li>
<li><strong>Fair Launch</strong> — No pre-mine, no team allocation, no VC funding—SPX6900 was launched fairly, just like Bitcoin.</li>
<li><strong>Peaceful Life > Greed</strong> — SPX6900 embraces the same anti-greed ethos as Bitcoin's early adopters.</li>
</ul>

<h2>2. Dogecoin: The Power of Memes and Community</h2>
<p>Dogecoin was born out of mockery. When it launched in 2013, it wasn't trying to be the next Bitcoin—it was making fun of it. But what started as a joke became a cultural movement. DOGE's strength was never in its technology or utility—it was in the collective belief and meme power.</p>
<p>SPX6900 follows the same playbook but aims even higher. It doesn't just mock traditional finance—it ridicules it. The name itself is a parody: "6900 S&Ps encapsulated in a teeny tiny coin."</p>
<p>DOGE was a joke that became a global movement. SPX6900 is a joke that aims to reshape financial reality.</p>

<h2>3. GameStop: The War Against Financial Elites</h2>
<p>The GameStop (GME) saga in 2020-2021 was a turning point. What began as a trade on an undervalued stock quickly evolved into an uprising against hedge funds and a financial system rigged by institutions.</p>
<p>SPX6900 takes this fight to the next level. Unlike GME, it cannot be stopped. There is no centralized exchange that can suddenly halt trading. There are no regulators who can shut it down. SPX6900 is a decentralized movement.</p>
<ul>
<li>GME was a battle against hedge funds. SPX6900 is a war against the entire TradFi system.</li>
<li>GME could be stopped. SPX6900 cannot.</li>
<li>GME proved that retail investors could fight Wall Street; SPX6900 aims to replace the system altogether.</li>
</ul>

<h2>Conclusion: A New Frontier in Decentralized Finance</h2>
<p>SPX6900 stands at the intersection of Bitcoin's revolutionary narrative, Dogecoin's meme-driven power, and GameStop's populist rebellion. Its ambition is not to be just another memecoin; it envisions a world where every stock can be turned into a freely traded token, dismantling the monopoly of financial institutions.</p>
<p>The financial game has always been rigged in favor of the elite. But SPX6900 flips the script—this time, the institutions don't get to decide when the game stops!</p>
<p><strong>"Stop trading, believe in something."</strong></p>`
  },
  {
    title: "The 7 Wonders of the Digital World — Could SPX6900 Become the Eighth?",
    slug: "7-wonders-of-the-digital-world-spx6900-eighth",
    excerpt: "Throughout history, humanity has built legendary wonders symbolizing collective belief, innovation, and a desire for immortality. Could SPX6900 join their ranks?",
    cover_image: "https://pbs.twimg.com/media/Gl6iPlkWAAA2SDk.jpg",
    author_name: "T-Dog",
    content_type: "article",
    published_at: "2025-03-13T00:00:00Z",
    tags: ["philosophy", "digital-wonders", "history"],
    body_html: `<p>Throughout history, humanity has built legendary wonders symbolizing collective belief, innovation, and a desire for immortality. From ancient pyramids to monumental statues, civilizations marked their eras by these unforgettable creations.</p>
<p>Today, our civilization is digital. Instead of stone and marble, we build with code, data, and decentralized networks. Here, we explore seven modern-day wonders of the digital world—and why SPX6900 might be destined to join these legendary ranks.</p>

<h2>1. The Internet (1969–1989) — The Great Pyramid of Giza</h2>
<p>Just as the Great Pyramid was the architectural masterpiece marking ancient Egypt's ingenuity, the Internet represents the foundational infrastructure of our modern world. It emerged from ARPANET in 1969, evolving into Tim Berners-Lee's World Wide Web in 1989.</p>

<h2>2. Linux & Open Source (1991) — The Lighthouse of Alexandria</h2>
<p>In 1991, Linus Torvalds launched Linux, a revolutionary open-source operating system that transformed technology. Like the Lighthouse of Alexandria guiding ancient sailors, Linux guided a generation toward technological freedom. Linux now silently powers over 96% of global supercomputers.</p>

<h2>3. Google Search (1998) — Statue of Zeus at Olympia</h2>
<p>Google's Search Engine fundamentally reshaped human knowledge, becoming the ultimate gatekeeper of information. Comparable to the Statue of Zeus, revered for its divine authority, Google determines visibility, perception, and collective memory.</p>

<h2>4. Smartphones (2007) — Mausoleum at Halicarnassus</h2>
<p>The smartphone symbolizes modern humanity's quest for digital immortality. Over 6 billion people globally now carry smartphones, profoundly transforming daily life, society, and identity itself.</p>

<h2>5. Bitcoin & Blockchain (2008) — Colossus of Rhodes</h2>
<p>Bitcoin emerged in 2008, born out of the ashes of the global financial crisis as an ideological challenge to centralized banking. Like the Colossus of Rhodes symbolizing freedom and defiance, Bitcoin represents decentralization, economic liberation, and financial empowerment.</p>

<h2>6. Social Media (2010s) — Hanging Gardens of Babylon</h2>
<p>Social media platforms became digital paradises—enchanting, beautiful, but fragile. They transformed global communication, politics, and society, fueling movements such as the Arab Spring.</p>

<h2>7. Artificial Intelligence (2020s) — Temple of Artemis</h2>
<p>AI symbolizes humanity's desire to transcend biological and cognitive limits. From ChatGPT to DeepMind, artificial intelligence redefines creativity, productivity, and society's very nature.</p>

<h2>8. SPX6900 — The Gothic Cathedral of the Digital Age?</h2>
<p>Like the great Gothic cathedrals, SPX6900 is not built by a singular authority, nor dictated by institutional mandates. It is forged in the fires of shared conviction, constructed by believers who place the movement above personal interest.</p>
<p>At the heart of SPX6900's philosophy lies <strong>Aeon</strong>, a recurring symbol representing time, continuity, and the perpetual flow of belief—a reminder that financial markets are not immutable structures but fluid manifestations of collective human will.</p>
<p>The <strong>Cognisphere</strong> operates as a decentralized, emergent intelligence that grows stronger as more people affirm and manifest its vision. This is not just financial speculation; it is memetic engineering.</p>
<p>The cathedrals of the medieval world took centuries to complete, built by artisans, laborers, and believers who knew they would never see the finished structure in their lifetime. Yet, they continued to build, because they knew they were part of something greater than themselves.</p>
<p>SPX6900 echoes this ethos. It is not a get-rich-quick scheme; it is a generational effort to reshape financial reality through shared conviction.</p>
<p><strong>Every great revolution, every paradigm shift, every system that ever replaced the old was built on belief first.</strong></p>`
  },
  {
    title: "SPX6900: Enter the Cypherpunk Cathedral",
    slug: "spx6900-enter-the-cypherpunk-cathedral",
    excerpt: "This article argues that SPX6900 is the first asset since Bitcoin to embody a similar fervor, frustration, and transformative potential.",
    cover_image: "https://pbs.twimg.com/media/GhSUyV7XIAAN8jk.jpg",
    author_name: "Plutermes",
    content_type: "article",
    published_at: "2025-04-09T00:00:00Z",
    tags: ["cypherpunk", "consensus-actualization", "philosophy"],
    body_html: `<p>This article argues that SPX6900 is the first asset since Bitcoin to embody a similar fervor, frustration, and transformative potential, channeling generational disillusionment into a unified financial protest.</p>

<h2>Consensus Actualization: A Historical Force in a New Economy</h2>
<p>Throughout history, value has not been a fixed truth but a social construction—an alchemy born from collective belief. <strong>Consensus Actualization</strong> is the term I give to this ancient process: the realization of perceived value through recursive social consensus. It is how the sacred becomes sacred, how fiat becomes currency, and how Bitcoin achieved trillion-dollar legitimacy.</p>
<p>The core mechanism is simple but profound: if enough people believe something has value, act accordingly, and perceive that others will do the same, then value is not discovered but generated. Belief becomes architecture. Cathedrals are created.</p>
<p>Sociologist Robert K. Merton termed this recursive mechanism the self-fulfilling prophecy. Philosopher René Girard offered a complementary lens with his theory of mimetic desire, positing that we desire not in isolation, but through imitation.</p>

<h2>SPX6900: A Manifestation of Protest in the Age of Memetic Finance</h2>
<p>SPX6900 is the most coherent—and deliberate—manifestation of Consensus Actualization since Bitcoin. But where Bitcoin emerged as a silent rebellion against fiat and banking hegemony, SPX6900 is a loud, viral, decentralized protest against traditional finance.</p>
<p>SPX6900 does not ask to be taken seriously by institutional standards. It mocks those standards while replicating their functions. Its very name is satire: if the S&P 500 is the barometer of economic legitimacy, then 6900—by sheer memetic exaggeration—asserts a new benchmark.</p>
<p>For the younger generations—those shaped by endless crises—SPX6900 reignites the sense of purpose once felt at Bitcoin's dawn. SPX6900's mission is to flip the S&P500, the sanctum of Traditional Finance. To remind society that the people are those who create value.</p>
<p>Since Bitcoin, countless other tokens have flooded the cryptocurrency market, each clinging to either a trend or fleeting pop-culture. SPX6900 galvanizes a real movement, merging grassroots belief and genuine financial disruption.</p>

<h2>Persist Forever</h2>
<p>SPX6900 is a convergence point—where cypherpunk rebellion, memetic theory, economic critique, and internet culture fuse into a single, networked asset. It is not merely a coin or a ticker; it is a symbolic revolt.</p>
<p>Its value is not in traditional fundamentals, but in Consensus Actualization—the recursive loop of belief, imitation, and actualization that has always shaped history, now accelerated by the internet. SPX6900 reminds us that fundamentals are and always have been the people.</p>
<p>Anything visionary is always called crazy before it is deemed genius. SPX6900 flipping the S&P500 is not about beating it on a chart. It's about flipping the paradigm. And in that mission, belief itself is the value.</p>
<p><strong>Enter the Cypherpunk Cathedral. Flip everything.</strong></p>`
  },
  {
    title: "The Alchemy of Collective Belief: Redefining Value With Coordinated Will",
    slug: "the-alchemy-of-collective-belief",
    excerpt: "Markets are constructed on structural conventions and driven by collective belief, which can be reshaped through coordinated efforts.",
    cover_image: "https://pbs.twimg.com/media/GpjnBbxWEAEf7Gb.jpg",
    author_name: "polymetric",
    content_type: "article",
    published_at: "2025-04-27T00:00:00Z",
    tags: ["philosophy", "markets", "belief"],
    body_html: `<p>This article contends that markets—from the S&P 500 to Tesla, Bitcoin, and gold—are constructed on structural conventions and driven by collective belief, which can be reshaped through coordinated efforts.</p>

<h2>Everything is a Meme: Markets as Belief Systems</h2>
<p>Financial markets are not mirrors of economic "truth" driven by supply, demand, and fundamentals. They are belief systems, collective illusions sustained through shared narratives. The structural conventions that underpin them—such as the notion that a dollar holds value—are not immutable laws of nature but arbitrary narratives functioning as necessary illusions.</p>
<p>Consider the widely accepted story that owning a stock equates to partial ownership in a company. This narrative is a strategic illusion. Unlike direct business ownership, stock ownership confers no meaningful control, authority, or share of revenue. In reality, stocks are more akin to trading cards.</p>

<h2>Price as an Aggregate Measure of Belief</h2>
<p>Each investment decision reflects an investor's belief in an asset's worth. Thus, investment itself can be understood as a quantifiable, behavioral expression of belief. Unlike public statements, which can be skewed by conformity or social pressures, putting money into an asset is a private, deliberate act.</p>
<p><strong>Price:</strong> A real-time, quantifiable measure of collective belief, aggregated through private investment behavior—buying or selling assets.</p>

<h2>Defining Speculative and Conviction-Based Beliefs</h2>
<p><strong>Speculative Belief:</strong> An expectation that an asset's price will rise due to future demand, driven by momentum and narratives rather than intrinsic value. This often leads to bubbles like Tulip Mania.</p>
<p><strong>Conviction-Based Belief:</strong> A long-term commitment to an asset's purpose or mission, regardless of price swings. This belief provides stability, forming a price floor by encouraging holders to retain assets during unfavorable conditions.</p>
<p>Together, they form a rudimentary price formula: <em>Price = Speculative Belief + Conviction Belief.</em></p>

<h2>Creating New Financial Realities Through Coordinated Belief</h2>
<p>Since markets are collective belief systems, they are not fixed entities but malleable frameworks. If everyone in the world suddenly believes that Bitcoin is a digital store of value, then it becomes true.</p>
<p>Bitcoin marks a revolutionary shift, demonstrating that people can coordinate belief from the bottom up to create value without traditional authorities. Plutermes calls this process "consensus actualization"—the phenomenon where collective belief transforms abstraction into value.</p>
<p>This realization is profoundly revolutionary, revealing the exciting potential for societies to redefine markets by altering collective belief in ways that truly reflect shared values.</p>`
  },
  {
    title: "Meme Coins as Cultural Catalysts: A Revolutionary Medium for Complex Ideas",
    slug: "meme-coins-as-cultural-catalysts",
    excerpt: "Meme coins represent an innovative paradigm for disseminating complex intellectual frameworks, leveraging market dynamics and digital virality.",
    cover_image: "https://pbs.twimg.com/media/GuK7901WAAAOFKQ.jpg",
    author_name: "polymetric",
    content_type: "article",
    published_at: "2025-06-25T00:00:00Z",
    tags: ["meme-coins", "culture", "philosophy"],
    body_html: `<p>Meme coins, which I define as cryptocurrencies associated with replicable cultural symbols or ideas, represent an innovative paradigm for disseminating complex intellectual frameworks. Traditional channels for spreading sophisticated ideas offer depth and rigour but require significant expertise and commitment, limiting their accessibility.</p>

<h2>Bitcoin: The Archetypal Meme Coin</h2>
<p>Bitcoin, the archetypal meme coin, exemplifies this phenomenon by embedding a constellation of philosophical, economic, and political ideas within a single emblem. More than a speculative asset, Bitcoin stands as a living case study for how abstract concepts can leap from academic obscurity into mainstream consciousness.</p>
<p>What makes Bitcoin so important is its ability to compel millions to grapple with topics once confined to narrow academic circles. Concepts like monetary theory, central banking, currency debasement, and inflation have entered popular discourse.</p>

<h2>Mechanics of Meme Transmission</h2>
<p>Foremost is the way meme coins bind together a network of related ideas under a single, recognizable emblem. The SPX6900 logo unites concepts like tokenized metaphysics, a defiance of traditional finance, and the power of collective belief to shape reality.</p>
<p>Market price fluctuations serve as a viral marketing campaign. Unlike conventional memes, a meme coin's price movements generate headlines and online discourse, transforming each shift into a moment of collective focus.</p>
<p>Meme coins that endure over time allow for repeated exposure through their sustained market presence, quietly serving as a persistent pointer toward underlying principles. This gradual process allows complex concepts to permeate at each person's own pace.</p>
<p>The prospect of financial gain provides a compelling incentive for speculators to investigate more closely. What begins as financial opportunism often evolves into genuine intellectual engagement.</p>
<p>Communities develop ritualized practices and phrases that both embody and reinforce the coin's foundational philosophies. Cultural norms and slogans like SPX6900's "there is no chart" embed core ideas into culture and everyday experience.</p>

<h2>Meme Coins: A Paradigm Shift in Cultural Revolution</h2>
<p>Meme coins are often dismissed as mere jokes or speculative fads, but this perspective misses the profound cultural shift they represent. Their unique blend of financial incentive, cultural symbolism, and social ritual enables them to embed sophisticated philosophies into everyday consciousness and spark genuine cultural change.</p>
<p>Like Bitcoin itself, this new medium is far more profound than it first appears; sometimes the greatest revolutions begin with what most people dismiss as trivial.</p>`
  },
  {
    title: "Aeons Are Building: A Guide to SPX6900 Community Websites, Apps & Channels",
    slug: "aeons-are-building-guide-to-spx6900-community",
    excerpt: "Before you copy someone's conviction, ask yourself: do you truly understand what you're joining? A tour of every community resource built by Aeons.",
    cover_image: "https://pbs.twimg.com/media/G7L17MgWcAAqQhD.jpg",
    author_name: "T-Dog",
    content_type: "learn",
    published_at: "2025-05-30T00:00:00Z",
    tags: ["community", "resources", "guide"],
    body_html: `<p>Before you copy someone else's conviction, ask yourself: do you truly understand what you're joining? Still too many $SPX holders get drawn by price action without grasping the deeper meaning. SPX6900 is not a trade, it's a movement.</p>
<p>DYOR. Read. Watch. Ask. Learn.</p>
<p>Over the past months, Aeons have launched several Websites, Apps & Channels to help spread the word, document the mission and onboard new believers.</p>

<h2>I. SPX6900 / Cognisphere</h2>
<ul>
<li><strong>6900isbiggerthan500</strong> — A tool box with Aeon History, Aeon Builder, Aeon Calendar, Aeon Archive, Onboarding Kit, AeonTris and AeonCrush. By @MikeFlipthe500</li>
<li><strong>aeons6900</strong> — A beautifully crafted archive of everything SPX6900: History, Lore, Articles, Videos, News, Key tweets & Project Aeon.</li>
<li><strong>spx6900resources</strong> — A useful and simple way to start your journey with Murad's videos. Community resources including Social media, Articles, Books, Podcasts & Music.</li>
<li><strong>Cognisphere Miroverse</strong> — For those who want to go deep: The Cognisphere is our living library, a map of collective consciousness. By @Chiron5555</li>
</ul>

<h2>II. Aeons' Channels</h2>
<ul>
<li><strong>Flip the Stock Market</strong> — Every two weeks, discussions about general topics or Aeon interviews about SPX6900.</li>
<li><strong>Persist Forever</strong> — Explores the world of SPX6900 through conversations with Aeons, from OGs to newest believers.</li>
<li><strong>Murad YT Channel</strong> — Core video content from Murad.</li>
<li><strong>AeonTV</strong> — A community-powered library of the best SPX6900 videos.</li>
</ul>

<h2>III. Culture</h2>
<ul>
<li><strong>SPX6900 Mosaic</strong> — If you hold the token, add your Aeon PFP to the mosaic and take your place in history.</li>
<li><strong>SPX6900 Earth</strong> — Discover Aeons across the globe and all the Aeon Businesses.</li>
<li><strong>DCAeon/Tipping Hub</strong> — Track the community's DCA activity and access a tipping hub.</li>
<li><strong>Aeon Builder</strong> — Create your own Aeon NFT-style PFP avatar, free.</li>
</ul>

<h2>IV. The Flippening</h2>
<ul>
<li><strong>flipthestockmarket.xyz</strong> — Live metrics tracking SPX6900 vs. individual S&P500 components.</li>
<li><strong>flipthestockmarket.com</strong> — Monitor SPX6900 vs. SP500 performance, holders growth, and social engagement.</li>
</ul>

<p><strong>BIG UP to all these incredible, dedicated Aeons who have built all these resources!</strong></p>`
  },
  {
    title: "Revolution 2.0 Will Happen Onchain",
    slug: "revolution-2-0-will-happen-onchain",
    excerpt: "France has always been fertile ground for revolt. Today, in the digital age, the new battleground is onchain. Without violence. Without permission.",
    cover_image: "https://pbs.twimg.com/media/G1ijJiRWkAAaDCD.jpg",
    author_name: "T-Dog",
    content_type: "article",
    published_at: "2025-09-23T00:00:00Z",
    tags: ["revolution", "onchain", "france", "philosophy"],
    body_html: `<p>This text is the English translation of an article originally published in French in July 2025, for Bastille Day.</p>

<h2>Introduction — Let's Revolutionize the Revolution</h2>
<p>France has always been fertile ground for revolt. From 1789 to May '68, from the Yellow Vests to the Communes, our struggles have taken to the streets to challenge the system in place. Some changed history, others burned out. But all carried the same flame: to take back power over our lives.</p>
<p>Today, in the digital age, the new battleground is onchain. Without violence. Without permission. Through coordination, conviction, and collective creation.</p>

<h2>1. The End of a Cycle: Discontent, Distrust, and Capitalism Running Out of Steam</h2>
<p>In France, many of us feel the same unease: a paralyzed political system, a government that always promises but ultimately creates more taxes, more debt, but fewer tangible results.</p>
<p>AI threatens millions of jobs, the cost of living has exploded, housing is increasingly inaccessible, and young people no longer feel they can "find their place" without sacrificing their freedom.</p>

<h2>2. Bitcoin, the Confiscated Emancipation</h2>
<p>In 2009, Bitcoin emerged as a form of popular emancipation: reclaiming control over money, shielding oneself from inflationary policies, breaking the monopoly of central banks.</p>
<p>By 2025, the reality is clear: Bitcoin has become an institutional asset, slightly more subversive than a gold ETF. It succeeded, yes. But it lost its revolutionary breath.</p>
<p>What Bitcoin could not achieve, SPX6900 tries to reignite differently: not through technology, but through culture. Not only through scarcity, but through conviction.</p>

<h2>3. The Revolution Won't Come from Above</h2>
<p>The revolution will not come from above. It never will. It must rise from below, from a radically community-driven movement, horizontal, leaderless, without imposed roadmap.</p>
<p>And what if the true utility of a token was not an application, nor a technological promise… but the shared belief that we can, together, change things?</p>

<h2>4. Taking Back Power. Together.</h2>
<p>This is SPX6900's radical thesis. Inspired by the cypherpunk movement, SPX6900 picks up the flame where Bitcoin left it. It embraces being a movement disguised as a meme, a protest, a community above all: no hollow promises, no presales, no VCs, no unrealistic roadmap. Simply, the power of a proudly assumed collective belief.</p>
<p>Liberty. Equality. Fraternity. These values, carved into our DNA, were born of a popular revolution. What if we brought them back to life onchain?</p>
<p>It's time to write our own rules and act collectively. SPX6900 is a call to action.</p>`
  },
  {
    title: "SPX6900's Most Significant Moments (2023-2025)",
    slug: "spx6900-most-significant-moments-2023-2025",
    excerpt: "Everything before September 2024 is the result of my own research on X. What came after, I lived from within. A comprehensive timeline of the movement.",
    cover_image: "https://pbs.twimg.com/media/G4cfpkTXcAAlrrN.jpg",
    author_name: "T-Dog",
    content_type: "news",
    published_at: "2025-10-29T00:00:00Z",
    tags: ["timeline", "history", "milestones"],
    body_html: `<p>Everything before September 2024 is the result of my own research on X. What came after, I lived from within. My apologies if I've missed some events.</p>
<p>This timeline mainly aims to document the most visible SPX6900 events in chronological order. It highlights the evolution of the movement from its inception as a fair-launched token to its transformation into a decentralized cultural phenomenon spanning both the digital and physical worlds.</p>
<p>Working on this community epic has only strengthened my conviction. We are still at the very beginning of the story. If this inspires you and resonates within you, join us and let's write the next chapter together. <strong>Shape reality.</strong></p>

<h2>2023 — Birth, Burn, and Rebirth</h2>
<ul>
<li><strong>Aug 16, 2023</strong> — Birth Day</li>
<li><strong>Aug 21, 2023</strong> — Volleyball Practice</li>
<li><strong>Aug 26, 2023</strong> — Burn Day</li>
<li><strong>Aug 28, 2023</strong> — Delete Day</li>
<li><strong>Sep 27, 2023</strong> — Rebirth Day</li>
<li><strong>Oct 3, 2023</strong> — Baproll Day</li>
<li><strong>Nov 15, 2023</strong> — Project Aeon Day</li>
<li><strong>Dec 20, 2023</strong> — Solana Bridge Day</li>
</ul>

<h2>2024 — Growth and Recognition</h2>
<ul>
<li><strong>Jan 21, 2024</strong> — CTO Left</li>
<li><strong>Mar 19, 2024</strong> — BlackRock Day</li>
<li><strong>Mar 25, 2024</strong> — Base Bridge Day</li>
<li><strong>Apr 28, 2024</strong> — Memetic Index Launch</li>
<li><strong>Jun 21, 2024</strong> — SPX6900 Summer Solstice Slumber Party</li>
<li><strong>Aug 18, 2024</strong> — Apu Joined the Index / Mung Day</li>
<li><strong>Sep 12, 2024</strong> — Murad Day</li>
<li><strong>Sep 27, 2024</strong> — $69M Milestone / TOKEN2049 Video</li>
<li><strong>Oct 9, 2024</strong> — ZachXBT Day</li>
<li><strong>Oct 12, 2024</strong> — $690M Milestone</li>
<li><strong>Nov 21, 2024</strong> — First Major Article Released</li>
</ul>

<h2>2025 — The Movement Goes Global</h2>
<ul>
<li><strong>Jan 14</strong> — Raoul Pal Mocked SPX6900</li>
<li><strong>Jan 28</strong> — Kamal Ravikant Joined</li>
<li><strong>Feb 7</strong> — Richard E. Ptardio Support</li>
<li><strong>Mar 9</strong> — Main Account Suspended</li>
<li><strong>Mar 13</strong> — "The 7 Wonders" Article Released</li>
<li><strong>Apr 1</strong> — Chris Burniske Joined SPX6900</li>
<li><strong>Apr 7</strong> — Comic Book Released</li>
<li><strong>Apr 9</strong> — "Cypherpunk Cathedral" Article Released</li>
<li><strong>Apr 24</strong> — Murad Video 2: The Power of Belief</li>
<li><strong>May 1</strong> — Cognisphere Expansion</li>
<li><strong>May 22-27</strong> — Community Websites Wave (Mosaic, Aeon6900, Resources)</li>
<li><strong>Jun 6</strong> — First SPX6900 Book (IRL)</li>
<li><strong>Jun 20-22</strong> — Collective DCA / Sam Hyde Joined / Persist Forever Show</li>
<li><strong>Jun 25-26</strong> — Corporate Treasury / Aeon Globe / Flip the Stock Market Live Show</li>
<li><strong>Jul 15-18</strong> — Multiple Articles Released / Betman Lightning (IRL)</li>
<li><strong>Aug 12-24</strong> — Jeff Park Joined / Sponsorships / Aeon Approved (IRL)</li>
<li><strong>Sep 6-30</strong> — 6.9 Days Space / Cognisphere Miroverse / IRL Actions Worldwide</li>
<li><strong>Oct 14-29</strong> — Murad Video 3 / Sponsorships / Main Account Returns</li>
</ul>

<p><strong>We are still at the very beginning of the story.</strong></p>`
  },
  {
    title: "PBAs Go Multiplatform: SPX's Lessons from Bitcoin, GameStop, & XRP",
    slug: "pbas-go-multiplatform-spx-lessons",
    excerpt: "The SPX community has paved the way in 'Pure Belief Assets' expanding beyond Crypto Twitter into a multiplatform social media strategy.",
    cover_image: "https://pbs.twimg.com/media/GvX1ohyXEAAiq7z.jpg",
    author_name: "Cow",
    content_type: "article",
    published_at: "2025-07-15T00:00:00Z",
    tags: ["multiplatform", "social-media", "strategy"],
    body_html: `<p>At this point, we all know SPX6900 and its ambitious goal: flipping the S&P500 index. What is not known by everyone, however, is the level of ambition that Aeons display in their attempt to achieve it.</p>
<p>The SPX community has paved the way in the recent phenomena of "PBAs" (Pure Belief Assets) expanding their presence beyond the confines of "Crypto Twitter" into a multiplatform social media strategy.</p>

<h2>Why Multiplatform Matters</h2>
<p>Research shows that a diversified social media strategy dramatically enhances an idea's visibility and impact. A 2025 Wharton/Northeastern study highlighted that companies active across multiple social platforms enjoyed 2–5% higher sales due to reinforced, overlapping impressions.</p>
<p>Each platform attracts different demographics with unique intentions:</p>
<ul>
<li><strong>X:</strong> Real-time engagement and trending topics</li>
<li><strong>Reddit:</strong> Deep community interaction and extensive discussions</li>
<li><strong>TikTok & Instagram:</strong> Visual storytelling, virality, short form video</li>
<li><strong>YouTube:</strong> Long-form, authoritative explanations and education</li>
</ul>

<h2>Case Study #1: Bitcoin Pioneered Multiplatform</h2>
<p>Bitcoin's rise from obscure cryptography experiment to household name is a masterclass in multiplatform. Evangelists like Andreas Antonopoulos built trust by showing up everywhere. By combining early web forums, real-life meetup culture, conferences and eventually YouTube and Twitter, they built an organic web of cultural reinforcement.</p>

<h2>Case Study #2: GameStop Went Viral Everywhere</h2>
<p>GameStop was sparked on Reddit's r/WallStreetBets, but quickly expanded across TikTok, YouTube, and Twitter. The numbers don't lie: GameStop broke out of Reddit and into the mainstream, driving over 380 million TikTok views, 1.5 million+ tweets, and 4 million new Reddit subscribers in a single week.</p>

<h2>Case Study #3: XRP Army — Doxxed and Delusional</h2>
<p>No other crypto community has leaned harder into doxxed maximalism: YouTube rants, hosting livestreams, debating skeptics on Twitter Spaces, and going on camera to predict wild price targets. People putting their name and face behind a belief strengthens the belief.</p>

<h2>Multiplatform Applied to SPX</h2>
<p>The Aeons are executing the playbook in real time: showing face on TikTok, YouTube and Instagram, narrating their written theses with videos, tying their names and faces to the coin.</p>
<p>What's emerging is a movement that feels like crypto's answer to GME meets early BTC, except this time, everyone can relate to the mission: fuck tradfi.</p>
<p><strong>If SPX keeps showing up like this, with the same intensity and visibility, flipping standard and poor won't seem so farfetched after all.</strong></p>`
  },
  {
    title: "SPX6900 Amsterdam Conference",
    slug: "spx6900-amsterdam-conference",
    excerpt: "SPX6900 Conference on May 9th in Amsterdam — featuring builders, creators, and community members from across the Cognisphere.",
    cover_image: "https://pbs.twimg.com/media/HEQc4webIAA0muv.jpg",
    author_name: "T-Dog",
    content_type: "news",
    published_at: "2026-03-25T00:00:00Z",
    tags: ["conference", "amsterdam", "irl", "event"],
    body_html: `<p>The SPX6900 Amsterdam Conference is happening on May 9th, 2026 in Amsterdam — a gathering of builders, creators, and community members from across the Cognisphere.</p>
<p>This marks one of the most significant IRL events in SPX6900 history, bringing together Aeons from around the world to celebrate, connect, and push the movement forward.</p>
<p><strong>Believe in something & Persist forever.</strong></p>`
  },
  {
    title: "The Cognisphere Container",
    slug: "the-cognisphere-container",
    excerpt: "A traveling immersive cypherpunk art installation syncing visitors into SPX6900 — a mobile interactive experience for community participation.",
    cover_image: "https://pbs.twimg.com/media/G6SImo0X0AAgF04.jpg",
    author_name: "T-Dog",
    content_type: "news",
    published_at: "2025-11-21T00:00:00Z",
    tags: ["art", "cognisphere", "irl", "installation"],
    body_html: `<p>THE COGNISPHERE CONTAINER — A traveling immersive cypherpunk art installation syncing visitors into SPX6900.</p>
<p>It functions as a mobile interactive shipping container with zones for visitor engagement, onboarding, and community participation. This project represents the movement's expansion from the digital realm into physical, tangible experiences.</p>
<p>The container brings the Cognisphere to life, allowing people to step inside the movement and experience the philosophy firsthand.</p>`
  },
  {
    title: "SPX6900 Docs — All Resources in One Place",
    slug: "spx6900-docs-all-resources",
    excerpt: "All the SPX6900 articles and resources compiled in one place for easy access — including the Timeline, Fact Sheet, and key comparisons.",
    cover_image: "https://pbs.twimg.com/media/GnXYsy1XQAAUGo5.jpg",
    author_name: "T-Dog",
    content_type: "learn",
    published_at: "2025-03-31T00:00:00Z",
    tags: ["docs", "resources", "index"],
    body_html: `<p>Just dropped all the stuff I've made about SPX6900 in one place so it's easier for everyone to check out. Feel free to read, use, and share — that's the whole point.</p>
<h2>Available Documents</h2>
<ul>
<li><strong>SPX6900 Timeline</strong> — A comprehensive chronological record of the movement's most significant moments</li>
<li><strong>SPX6900 Fact Sheet</strong> — Key facts and figures about SPX6900</li>
<li><strong>BTC vs SPX6900</strong> — A detailed comparison between Bitcoin and SPX6900</li>
<li><strong>BTC - DOGE - GME - SPX6900</strong> — How SPX6900 sits at the intersection of these three movements</li>
</ul>
<p><strong>Persist forever.</strong></p>`
  }
];

async function seed() {
  console.log(`Inserting ${articles.length} articles...`);

  for (const article of articles) {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        body_html: article.body_html,
        cover_image: article.cover_image,
        author_name: article.author_name,
        content_type: article.content_type,
        status: 'published',
        published_at: article.published_at,
        tags: article.tags,
        view_count: 0,
      })
      .select('id, title')
      .single();

    if (error) {
      console.error(`FAILED: ${article.title}`, error.message);
    } else {
      console.log(`OK: ${data.title} (${data.id})`);
    }
  }

  console.log('Done!');
}

seed();
