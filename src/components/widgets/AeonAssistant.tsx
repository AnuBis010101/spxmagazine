"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import styles from "./aeon-assistant.module.css";

/* ------------------------------------------------------------------ *
 * Aeon Assistant — a Clippy-style helper for spxmag (desktop only).
 * Pseudo-3D SVG mascot with the full Office-assistant move set, and
 * context-aware tips that adapt to the page you're on.
 * ------------------------------------------------------------------ */

type Anim =
  | "wave" | "knock" | "flip" | "think" | "pointL" | "pointR" | "pointU"
  | "celebrate" | "alert" | "write" | "search";

const ANIM_MS: Record<Anim, number> = {
  wave: 2300, knock: 2300, flip: 1000, think: 2400, pointL: 2200, pointR: 2200,
  pointU: 2200, celebrate: 1700, alert: 700, write: 2100, search: 1900,
};

interface Tip { content: ReactNode; anim?: Anim }

const MANTRAS = [
  "Stop trading and believe in something.",
  "There is no chart. There is no price.",
  "6900 > 500. Mathematically undeniable.",
  "Peaceful life over greed, Aeon.",
  "We are praying for your success. 🙏",
  "It's a joke until it isn't.",
  "Persist forever.",
];

/** Tips tailored to where the user currently is. */
function tipsForPath(path: string): Tip[] {
  if (path === "/") return [
    { content: <>gm, Aeon. Welcome to the <b>Cognisphere</b>. I&apos;m here if you get lost. 🐾</>, anim: "wave" },
    { content: <>Start with <b>Articles</b> up top for community writing, or hit <b>Data</b> to watch the flippening live.</>, anim: "pointU" },
    { content: <>Tip: press <b>/</b> or the search icon to find anything on the site.</>, anim: "think" },
  ];
  if (path.startsWith("/articles/") && path.split("/").length > 3) return [
    { content: <>Great pick. Give it a proper read — and remember, <b>there is no chart</b>. 📈🚫</>, anim: "think" },
    { content: <>Loved it? Scroll to the bottom to react and find related Aeon writing.</>, anim: "pointU" },
    { content: <>Every one of these was written by a real community member. Wholesome, right?</>, anim: "celebrate" },
  ];
  if (path.startsWith("/articles")) return [
    { content: <>These are <b>community articles</b> by Aeons. Click any card to dive in.</>, anim: "pointR" },
    { content: <>Use the <b>tag filters</b> below the title to find your vibe — philosophy, culture, macro…</>, anim: "pointU" },
    { content: <>Looking for the official editorial instead? That&apos;s the <b>Magazine</b> feed.</>, anim: "search" },
  ];
  if (path.startsWith("/news")) return [
    { content: <>Freshest <b>SPX6900 news</b> lands right here. Stay caught up.</>, anim: "write" },
    { content: <>Big moves get the front page — check back often, ser.</>, anim: "wave" },
  ];
  if (path.startsWith("/learn")) return [
    { content: <>New here? <b>Learn</b> is your onboarding. No question is too basic.</>, anim: "think" },
    { content: <>Confused by a word? The <b>Glossary</b> decodes the whole Aeon dialect.</>, anim: "pointR" },
  ];
  if (path.startsWith("/data")) return [
    { content: <><b>6900 &gt; 500.</b> Watch SPX6900 vs the S&amp;P 500 in real time here.</>, anim: "celebrate" },
    { content: <>The Flippening tracker updates live. It&apos;s not <i>if</i>, it&apos;s <i>when</i>.</>, anim: "pointU" },
  ];
  if (path.startsWith("/videos")) return [
    { content: <>Aeon <b>video</b> content. Grab popcorn. 🍿</>, anim: "wave" },
  ];
  if (path.startsWith("/authors")) return [
    { content: <>Meet the <b>Aeons</b> behind the words. Click an author for their full body of work.</>, anim: "pointR" },
  ];
  if (path.startsWith("/bookmarks")) return [
    { content: <>Everything you saved lives here. Good curation, anon.</>, anim: "celebrate" },
  ];
  if (path.startsWith("/search")) return [
    { content: <>Type anything — articles, news, terms. I&apos;ll wait right here.</>, anim: "search" },
  ];
  if (path.startsWith("/how-to-buy")) return [
    { content: <>Ready to become an Aeon? Follow the steps — DYOR, then <b>DCA</b>.</>, anim: "pointU" },
  ];
  return [
    { content: <>Need a hand navigating? Use the menu up top to explore the Cognisphere.</>, anim: "pointU" },
  ];
}

const HIDE_KEY = "aeon-assistant-hidden";

export default function AeonAssistant() {
  const pathname = usePathname() || "/";
  const [enabled, setEnabled] = useState(false);   // desktop + not dismissed
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);   // poofed in
  const [anim, setAnim] = useState<Anim | null>(null);
  const [tip, setTip] = useState<Tip | null>(null);
  const [tipIdx, setTipIdx] = useState(0);

  const animTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tipsRef = useRef<Tip[]>([]);

  /* -- desktop gating (no SSR mismatch: nothing until mounted) -- */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const isHidden = window.localStorage.getItem(HIDE_KEY) === "1";
    setDismissed(isHidden);
    const apply = () => setEnabled(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  /* -- play an animation, then fall back to idle -- */
  const play = useCallback((a: Anim) => {
    if (animTimer.current) clearTimeout(animTimer.current);
    setAnim(null);
    // next frame → set, so the CSS animation restarts even if same value
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnim(a));
    });
    animTimer.current = setTimeout(() => setAnim(null), ANIM_MS[a] + 60);
  }, []);

  const showTip = useCallback((t: Tip) => {
    setTip(t);
    if (t.anim) play(t.anim);
  }, [play]);

  /* -- idle re-engagement: knock on the glass after inactivity -- */
  const armIdle = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduce) play("knock");
      const list = tipsRef.current;
      if (list.length) showTip(list[Math.floor(Math.random() * list.length)]);
      armIdle();
    }, 32000);
  }, [play, showTip]);

  /* -- entrance + per-route context tips -- */
  useEffect(() => {
    if (!enabled || dismissed) return;
    tipsRef.current = tipsForPath(pathname);
    setTipIdx(0);
    let t1: ReturnType<typeof setTimeout>, t2: ReturnType<typeof setTimeout>;
    if (!visible) {
      t1 = setTimeout(() => {
        setVisible(true);
        t2 = setTimeout(() => { play("wave"); showTip(tipsRef.current[0]); armIdle(); }, 500);
      }, 1100);
    } else {
      // route changed → greet with the new page's first tip
      play("pointU");
      showTip(tipsRef.current[0]);
      armIdle();
    }
    return () => { clearTimeout(t1); clearTimeout(t2); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, dismissed, pathname]);

  /* -- reset idle timer on real user activity -- */
  useEffect(() => {
    if (!enabled || dismissed || !visible) return;
    const onActivity = () => armIdle();
    window.addEventListener("pointerdown", onActivity, { passive: true });
    window.addEventListener("keydown", onActivity, { passive: true });
    window.addEventListener("scroll", onActivity, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", onActivity);
      window.removeEventListener("keydown", onActivity);
      window.removeEventListener("scroll", onActivity);
    };
  }, [enabled, dismissed, visible, armIdle]);

  useEffect(() => () => {
    if (animTimer.current) clearTimeout(animTimer.current);
    if (idleTimer.current) clearTimeout(idleTimer.current);
  }, []);

  const nextTip = () => {
    const list = tipsRef.current;
    if (!list.length) return;
    const i = (tipIdx + 1) % list.length;
    setTipIdx(i);
    showTip(list[i]);
  };

  const onCharClick = () => {
    const fun: Anim[] = ["flip", "wave", "knock", "celebrate", "alert"];
    play(fun[Math.floor(Math.random() * fun.length)]);
    setTip({ content: <>{MANTRAS[Math.floor(Math.random() * MANTRAS.length)]}</> });
    armIdle();
  };

  const hide = () => {
    setTip(null);
    setAnim("flip");
    setTimeout(() => {
      setVisible(false);
      setDismissed(true);
      window.localStorage.setItem(HIDE_KEY, "1");
    }, 420);
  };

  const reopen = () => {
    window.localStorage.removeItem(HIDE_KEY);
    setDismissed(false);
    setVisible(false); // effect will re-enter
  };

  if (!enabled) return null;

  if (dismissed) {
    return (
      <button className={styles.reopen} onClick={reopen} aria-label="Show the Aeon assistant">
        <span aria-hidden>🐾</span> Ask Aeon
      </button>
    );
  }

  return (
    <div className={styles.wrap} aria-live="polite">
      {visible && tip && (
        <div className={styles.bubble} role="status">
          <div className={styles.titlebar}>
            <span className={styles.dot} aria-hidden />
            <span>Aeon Assistant</span>
            <span className={styles.grow} />
            <button className={styles.xbtn} onClick={hide} aria-label="Dismiss assistant" title="Hide">✕</button>
          </div>
          <div className={styles.body}>
            <svg className={styles.icon} viewBox="0 0 32 32" aria-hidden>
              <circle cx="16" cy="16" r="15" fill="#2158d8" />
              <circle cx="16" cy="16" r="15" fill="none" stroke="#0a246a" />
              <text x="16" y="22" textAnchor="middle" fontSize="17" fontWeight="700" fill="#fff" fontFamily="Georgia, serif">i</text>
            </svg>
            <div className={styles.msg}>{tip.content}</div>
          </div>
          <div className={styles.btnrow}>
            <button className={styles.xpbtn} onClick={nextTip}>Next tip</button>
            <button className={`${styles.xpbtn} ${styles.primary}`} onClick={() => setTip(null)}>Got it</button>
          </div>
        </div>
      )}

      <div className={styles.stage} onClick={onCharClick} role="img" aria-label="Aeon, your SPX6900 guide">
        <span className={styles.shadow} aria-hidden />
        <div className={styles.charWrap} data-state={visible ? "in" : undefined}>
          <div className={styles.char} data-anim={anim ?? undefined}>
            <span className={styles.ripple} aria-hidden />
            <AeonSvg />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * The character. Chibi Aeon: red twin-tails, glowing mecha cat ears,
 * white star clip, cute face. SFW ("the girl is cute", no lewd).
 * Each rig group carries a module class so the CSS can animate it.
 * ------------------------------------------------------------------ */
function AeonSvg() {
  return (
    <svg viewBox="0 0 150 190" width="150" height="190" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="aeHair" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#E63535" />
          <stop offset="0.5" stopColor="#C21A1A" />
          <stop offset="1" stopColor="#8E1212" />
        </linearGradient>
        <linearGradient id="aeHairF" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F04A3A" />
          <stop offset="1" stopColor="#C21A1A" />
        </linearGradient>
        <radialGradient id="aeSkin" cx="0.5" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#FDEADA" />
          <stop offset="1" stopColor="#F6CDB2" />
        </radialGradient>
        <linearGradient id="aeTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#20242c" />
          <stop offset="1" stopColor="#101318" />
        </linearGradient>
        <radialGradient id="aeEarGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFB65C" />
          <stop offset="0.6" stopColor="#FF7A00" />
          <stop offset="1" stopColor="#C24700" />
        </radialGradient>
        <linearGradient id="aeIris" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7B4B2A" />
          <stop offset="1" stopColor="#3A2113" />
        </linearGradient>
      </defs>

      <g className={styles.floaty}>
        {/* ---- twin-tails (behind) ---- */}
        <g className={styles.tailL}>
          <path d="M45 52 C20 62 14 110 20 150 C22 168 34 176 40 168 C34 140 40 96 54 74 Z" fill="url(#aeHair)" />
          <path d="M45 56 C30 66 26 104 30 140" fill="none" stroke="#F0574733" strokeWidth="4" strokeLinecap="round" />
        </g>
        <g className={styles.tailR}>
          <path d="M105 52 C130 62 136 110 130 150 C128 168 116 176 110 168 C116 140 110 96 96 74 Z" fill="url(#aeHair)" />
          <path d="M105 56 C120 66 124 104 120 140" fill="none" stroke="#F0574733" strokeWidth="4" strokeLinecap="round" />
        </g>

        {/* ---- body / top ---- */}
        <g>
          <path d="M42 140 C42 128 54 122 75 122 C96 122 108 128 108 140 L112 186 L38 186 Z" fill="url(#aeTop)" />
          {/* off-shoulder trim + collar */}
          <path d="M42 140 C42 128 54 122 75 122 C96 122 108 128 108 140" fill="none" stroke="#D4AF37" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M63 124 C66 132 84 132 87 124" fill="none" stroke="#D4AF37" strokeWidth="1.6" opacity="0.7" />
          {/* little gold star emblem */}
          <path d="M75 150 l2.6 5.4 5.9 .8 -4.3 4.2 1 5.9 -5.2 -2.8 -5.2 2.8 1 -5.9 -4.3 -4.2 5.9 -.8 Z" fill="#D4AF37" />
        </g>

        {/* ---- arms ---- */}
        <g className={styles.armL}>
          <path d="M45 138 C36 150 33 166 34 176 C41 178 46 176 47 172 C46 160 50 150 56 142 Z" fill="url(#aeSkin)" />
          <ellipse cx="37" cy="177" rx="8" ry="7.5" fill="url(#aeSkin)" />
        </g>
        <g className={styles.armR}>
          <path d="M105 138 C114 150 117 166 116 176 C109 178 104 176 103 172 C104 160 100 150 94 142 Z" fill="url(#aeSkin)" />
          <ellipse cx="113" cy="177" rx="8" ry="7.5" fill="url(#aeSkin)" />
        </g>

        {/* ---- head ---- */}
        <g className={styles.head}>
          {/* cat ears (mecha) */}
          <g className={styles.earL}>
            <path d="M40 44 C30 24 44 20 52 34 C56 42 54 52 48 56 Z" fill="#17181c" />
            <path d="M44 26 l7 -8 3 9 -8 4 Z" fill="#B6FF3A" />
            <circle cx="45" cy="42" r="5.4" fill="url(#aeEarGlow)" />
            <circle cx="45" cy="42" r="2" fill="#3a1400" />
          </g>
          <g className={styles.earR}>
            <path d="M110 44 C120 24 106 20 98 34 C94 42 96 52 102 56 Z" fill="#17181c" />
            <path d="M106 26 l-7 -8 -3 9 8 4 Z" fill="#B6FF3A" />
            <circle cx="105" cy="42" r="5.4" fill="url(#aeEarGlow)" />
            <circle cx="105" cy="42" r="2" fill="#3a1400" />
          </g>

          {/* face */}
          <ellipse cx="75" cy="76" rx="40" ry="42" fill="url(#aeSkin)" />

          {/* back-of-hair sides framing the face */}
          <path d="M35 72 C33 52 44 40 56 40 L52 92 C44 92 37 86 35 72 Z" fill="url(#aeHair)" />
          <path d="M115 72 C117 52 106 40 94 40 L98 92 C106 92 113 86 115 72 Z" fill="url(#aeHair)" />

          {/* eyes */}
          <g className={styles.eyes}>
            <ellipse cx="60" cy="82" rx="8.5" ry="10.5" fill="#fff" />
            <ellipse cx="90" cy="82" rx="8.5" ry="10.5" fill="#fff" />
            <g className={styles.pupils}>
              <ellipse cx="60" cy="83" rx="6.2" ry="8.4" fill="url(#aeIris)" />
              <ellipse cx="90" cy="83" rx="6.2" ry="8.4" fill="url(#aeIris)" />
              <circle cx="60" cy="84" r="3" fill="#1c1108" />
              <circle cx="90" cy="84" r="3" fill="#1c1108" />
              <circle cx="62.4" cy="79.5" r="2.4" fill="#fff" />
              <circle cx="92.4" cy="79.5" r="2.4" fill="#fff" />
              <circle cx="58" cy="86" r="1.1" fill="#ffffffaa" />
              <circle cx="88" cy="86" r="1.1" fill="#ffffffaa" />
            </g>
          </g>
          {/* upper lashes */}
          <path d="M51 74 C56 70 65 70 69 74" fill="none" stroke="#2a1710" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M81 74 C85 70 94 70 99 74" fill="none" stroke="#2a1710" strokeWidth="2.2" strokeLinecap="round" />

          {/* blush + nose + mouth */}
          <ellipse className={styles.blush} cx="49" cy="94" rx="6" ry="3.4" fill="#F6A0A0" />
          <ellipse className={styles.blush} cx="101" cy="94" rx="6" ry="3.4" fill="#F6A0A0" />
          <path d="M74 90 l2 3 -3.5 0 Z" fill="#E7B49A" />
          <g className={styles.mouth}>
            <path d="M69 99 C73 104 79 104 82 99" fill="none" stroke="#B5564A" strokeWidth="2.2" strokeLinecap="round" />
          </g>
          {/* teardrop beauty mark (from ref) */}
          <path d="M84 96 c1.6 0 2.4 2 1.2 3.2 -.8 .8 -1.6 .4 -2 -.2 -.6 -1 -.4 -3 .8 -3 Z" fill="#3a2b6b" opacity="0.65" />

          {/* front bangs with signature center part */}
          <path d="M36 66 C34 44 50 30 75 30 C100 30 116 44 114 66 C110 54 100 48 92 50 C86 40 78 60 75 70 C72 60 64 40 58 50 C50 48 40 54 36 66 Z" fill="url(#aeHairF)" />
          <path d="M75 34 L69 58 L75 66 L81 58 Z" fill="#8E1212" opacity="0.35" />

          {/* white star hair-clip */}
          <path d="M108 58 l3 6.4 7 .9 -5 5 1.2 7 -6.2 -3.4 -6.2 3.4 1.2 -7 -5 -5 7 -.9 Z" fill="#fff" stroke="#D4AF37" strokeWidth="1.2" strokeLinejoin="round" />
          {/* hairpin clips (from ref) */}
          <g stroke="#D4AF37" strokeWidth="1.6" opacity="0.85">
            <line x1="94" y1="46" x2="104" y2="42" />
            <line x1="95" y1="50" x2="105" y2="46" />
          </g>
        </g>

        {/* ---- fx: sparkles (celebrate) & thought (think) ---- */}
        <g className={styles.fx} aria-hidden>
          <path d="M30 40 l1.4 3 3 1.4 -3 1.4 -1.4 3 -1.4 -3 -3 -1.4 3 -1.4 Z" fill="#FFD76B" />
          <path d="M122 46 l1.4 3 3 1.4 -3 1.4 -1.4 3 -1.4 -3 -3 -1.4 3 -1.4 Z" fill="#FFD76B" />
          <path d="M118 96 l1.2 2.6 2.6 1.2 -2.6 1.2 -1.2 2.6 -1.2 -2.6 -2.6 -1.2 2.6 -1.2 Z" fill="#B6FF3A" />
          <path d="M28 92 l1.2 2.6 2.6 1.2 -2.6 1.2 -1.2 2.6 -1.2 -2.6 -2.6 -1.2 2.6 -1.2 Z" fill="#7BE0FF" />
        </g>
        <g className={styles.thought} aria-hidden>
          <circle cx="112" cy="34" r="3" fill="#fff" opacity="0.9" />
          <circle cx="120" cy="26" r="4.5" fill="#fff" opacity="0.9" />
          <circle cx="130" cy="18" r="6.5" fill="#fff" opacity="0.95" />
          <text x="130" y="21" textAnchor="middle" fontSize="7" fill="#2158d8" fontWeight="700">?</text>
        </g>
      </g>
    </svg>
  );
}
