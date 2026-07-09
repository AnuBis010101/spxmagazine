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
      <div className={styles.stage} onClick={onCharClick} role="img" aria-label="Aeon, your SPX6900 guide">
        <span className={styles.shadow} aria-hidden />
        <div className={styles.charWrap} data-state={visible ? "in" : undefined}>
          <div className={styles.char} data-anim={anim ?? undefined}>
            <span className={styles.ripple} aria-hidden />
            <AeonSvg />
          </div>
        </div>
      </div>

      {visible && tip && (
        <div className={styles.bubble} role="status">
          <div className={styles.titlebar}>
            <span className={styles.dot} aria-hidden />
            <span>Aeon</span>
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
            <button className={styles.xpbtn} onClick={nextTip}>Next</button>
            <button className={`${styles.xpbtn} ${styles.primary}`} onClick={() => setTip(null)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * The character. Elegant anime "Aeon" model: silver hair in a high bun,
 * gold lightning-star ornament, sleek black high-neck top. SFW & premium.
 * Rig groups keep their module classes so the CSS animations still drive
 * head / arms / eyes / hair etc.
 * ------------------------------------------------------------------ */
function AeonSvg() {
  return (
    <svg viewBox="0 0 150 190" width="150" height="190" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="aeHair" x1="0.1" y1="0" x2="0.5" y2="1">
          <stop offset="0" stopColor="#FCFDFF" />
          <stop offset="0.5" stopColor="#D6DAE2" />
          <stop offset="1" stopColor="#A7ADBA" />
        </linearGradient>
        <linearGradient id="aeRim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="aeSkin" cx="0.5" cy="0.38" r="0.72">
          <stop offset="0" stopColor="#FDEFE4" />
          <stop offset="1" stopColor="#F0CEB6" />
        </radialGradient>
        <linearGradient id="aeTop" x1="0.15" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#282C34" />
          <stop offset="1" stopColor="#090B0F" />
        </linearGradient>
        <linearGradient id="aeBolt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE24E" />
          <stop offset="1" stopColor="#E8A400" />
        </linearGradient>
        <radialGradient id="aeGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#D4AF37" stopOpacity="0.16" />
          <stop offset="1" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="aeIris" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5A616E" />
          <stop offset="1" stopColor="#15181D" />
        </linearGradient>
      </defs>

      <g className={styles.floaty}>
        {/* premium soft glow */}
        <ellipse cx="75" cy="100" rx="58" ry="74" fill="url(#aeGlow)" />

        {/* ---- side hair locks (behind, sway) ---- */}
        <g className={styles.tailL}>
          <path d="M53 58 C40 78 40 104 47 124 C51 117 53 96 60 76 Z" fill="url(#aeHair)" />
          <path d="M54 62 C47 80 47 102 50 118" fill="none" stroke="#ffffff55" strokeWidth="1.8" strokeLinecap="round" />
        </g>
        <g className={styles.tailR}>
          <path d="M97 58 C110 78 110 104 103 124 C99 117 97 96 90 76 Z" fill="url(#aeHair)" />
          <path d="M96 62 C103 80 103 102 100 118" fill="none" stroke="#ffffff55" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* ---- torso / black high-neck top ---- */}
        <g>
          {/* bare shoulders + upper chest */}
          <path d="M40 122 C40 108 55 100 75 100 C95 100 110 108 110 122 L114 190 L36 190 Z" fill="url(#aeSkin)" />
          {/* the top */}
          <path d="M56 108 C56 100 63 96 75 96 C87 96 94 100 94 108 C101 113 106 124 108 138 L112 190 L38 190 L42 138 C44 124 49 113 56 108 Z" fill="url(#aeTop)" />
          {/* vertical sheen */}
          <path d="M63 118 C64 148 65 176 65 190" fill="none" stroke="#ffffff12" strokeWidth="6" strokeLinecap="round" />
          {/* keyhole cutout (skin) + subtle maroon lining */}
          <path d="M75 116 C80 121 80 130 75 137 C70 130 70 121 75 116 Z" fill="url(#aeSkin)" />
          <path d="M75 116 C80 121 80 130 75 137 C70 130 70 121 75 116 Z" fill="none" stroke="#5a1f22" strokeWidth="1.2" opacity="0.6" />
          {/* gold collar trim */}
          <path d="M56 108 C56 100 63 96 75 96 C87 96 94 100 94 108" fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.75" />
        </g>

        {/* ---- arms (slender) ---- */}
        <g className={styles.armL}>
          <path d="M44 116 C36 132 33 154 34 172 C40 174 45 172 46 168 C46 150 50 130 56 118 Z" fill="url(#aeSkin)" />
          <ellipse cx="38" cy="173" rx="6.4" ry="6" fill="url(#aeSkin)" />
        </g>
        <g className={styles.armR}>
          <path d="M106 116 C114 132 117 154 116 172 C110 174 105 172 104 168 C104 150 100 130 94 118 Z" fill="url(#aeSkin)" />
          <ellipse cx="112" cy="173" rx="6.4" ry="6" fill="url(#aeSkin)" />
        </g>

        {/* ---- head ---- */}
        <g className={styles.head}>
          {/* neck + high collar */}
          <path d="M67 88 L67 100 C67 104 83 104 83 100 L83 88 Z" fill="url(#aeSkin)" />
          <path d="M67 96 C70 100 80 100 83 96" fill="none" stroke="#e6b199" strokeWidth="1.6" opacity="0.5" />
          <path d="M61 91 C61 85 67 83 75 83 C83 83 89 85 89 91 L89 98 C82 102 68 102 61 98 Z" fill="url(#aeTop)" />

          {/* ears */}
          <ellipse cx="49" cy="70" rx="4" ry="6" fill="url(#aeSkin)" />
          <ellipse cx="101" cy="70" rx="4" ry="6" fill="url(#aeSkin)" />

          {/* face */}
          <ellipse cx="75" cy="66" rx="27" ry="31" fill="url(#aeSkin)" />
          <path d="M53 74 C59 90 91 90 97 74" fill="none" stroke="#eec2a8" strokeWidth="2.6" opacity="0.35" />

          {/* brows */}
          <path d="M60 58 C64 55.5 69 55.5 72 57.5" fill="none" stroke="#c3c6cd" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M78 57.5 C81 55.5 86 55.5 90 58" fill="none" stroke="#c3c6cd" strokeWidth="1.7" strokeLinecap="round" />

          {/* eyes */}
          <g className={styles.eyes}>
            <path d="M58 66 C60.5 62 68 62 71 65.5 C68.5 70 60 70.5 58 66 Z" fill="#fff" />
            <path d="M79 65.5 C82 62 89.5 62 92 66 C90 70.5 81.5 70 79 65.5 Z" fill="#fff" />
            <g className={styles.pupils}>
              <ellipse cx="65" cy="66" rx="4.3" ry="5.6" fill="url(#aeIris)" />
              <ellipse cx="85" cy="66" rx="4.3" ry="5.6" fill="url(#aeIris)" />
              <circle cx="65" cy="67" r="2.1" fill="#0c0e12" />
              <circle cx="85" cy="67" r="2.1" fill="#0c0e12" />
              <circle cx="66.6" cy="63.6" r="1.7" fill="#fff" />
              <circle cx="86.6" cy="63.6" r="1.7" fill="#fff" />
              <circle cx="63.4" cy="68.6" r="0.9" fill="#ffffffaa" />
              <circle cx="83.4" cy="68.6" r="0.9" fill="#ffffffaa" />
            </g>
            {/* eyeliner + outer flick */}
            <path d="M57 65 C60 61 69 61 72 64.5" fill="none" stroke="#26282e" strokeWidth="1.9" strokeLinecap="round" />
            <path d="M78 64.5 C81 61 90 61 93 65" fill="none" stroke="#26282e" strokeWidth="1.9" strokeLinecap="round" />
            <path d="M57 65 l-2.4 -1" stroke="#26282e" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M93 65 l2.4 -1" stroke="#26282e" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* nose + mouth + blush */}
          <path d="M74 74 l1.4 3 -2.6 0 Z" fill="#e6b39a" opacity="0.75" />
          <ellipse cx="60" cy="77" rx="4.4" ry="2.5" fill="#f3a89f" opacity="0.4" />
          <ellipse cx="90" cy="77" rx="4.4" ry="2.5" fill="#f3a89f" opacity="0.4" />
          <g className={styles.mouth}>
            <path d="M70 82 C73 85 78 85 81 82" fill="none" stroke="#c07a72" strokeWidth="1.7" strokeLinecap="round" />
            <path d="M71.5 82.6 C74 84 77 84 79.5 82.6" fill="none" stroke="#e79a90" strokeWidth="0.9" opacity="0.6" />
          </g>

          {/* ---- front bangs (silver, swept) ---- */}
          <path d="M48 62 C46 44 58 34 75 34 C92 34 104 44 102 62 C99 52 90 48 84 50 C80 44 76 52 75 60 C74 52 70 44 66 50 C60 48 51 52 48 62 Z" fill="url(#aeHair)" />
          <path d="M75 38 C73.5 47 74 55 75 60" fill="none" stroke="#ffffff66" strokeWidth="1.3" />
          <path d="M64 45 C60 52 58 58 58 62" fill="none" stroke="#0000001a" strokeWidth="1.5" />
          <path d="M86 45 C90 52 92 58 92 62" fill="none" stroke="#0000001a" strokeWidth="1.5" />

          {/* ---- high bun (updo) ---- */}
          <ellipse cx="75" cy="31" rx="22" ry="15.5" fill="url(#aeHair)" />
          <path d="M56 31 C64 23 86 23 94 31" fill="none" stroke="#ffffff55" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M59 35 C67 29 83 29 91 35" fill="none" stroke="#0000001a" strokeWidth="1.8" />
          {/* hair band */}
          <path d="M66 40 C70 44 80 44 84 40 L82 46 C79 48 71 48 68 46 Z" fill="#191b21" />
          {/* rim light on bun */}
          <path d="M55 29 C61 21 74 18 83 19" fill="none" stroke="url(#aeRim)" strokeWidth="2.4" strokeLinecap="round" />

          {/* ---- lightning-star ornament ---- */}
          <g transform="translate(75 12)">
            <rect x="-5" y="-5" width="10" height="10" rx="2" fill="#17181c" />
            <path d="M-13 2 L-4.5 -3 L-4.5 5 Z" fill="#141414" />
            <path d="M13 2 L4.5 -3 L4.5 5 Z" fill="#141414" />
            <path d="M0 -11 C1.4 -4 4 -1.4 11 0 C4 1.4 1.4 4 0 11 C-1.4 4 -4 1.4 -11 0 C-4 -1.4 -1.4 -4 0 -11 Z" fill="url(#aeBolt)" />
            <path d="M0 -6 C0.8 -2.2 2.2 -0.8 6 0 C2.2 0.8 0.8 2.2 0 6 C-0.8 2.2 -2.2 0.8 -6 0 C-2.2 -0.8 -0.8 -2.2 0 -6 Z" fill="#FFF0A8" />
          </g>
        </g>

        {/* ---- fx: sparkles (celebrate) & thought (think) ---- */}
        <g className={styles.fx} aria-hidden>
          <path d="M32 44 l1.4 3 3 1.4 -3 1.4 -1.4 3 -1.4 -3 -3 -1.4 3 -1.4 Z" fill="#FFD76B" />
          <path d="M120 48 l1.4 3 3 1.4 -3 1.4 -1.4 3 -1.4 -3 -3 -1.4 3 -1.4 Z" fill="#FFD76B" />
          <path d="M116 96 l1.2 2.6 2.6 1.2 -2.6 1.2 -1.2 2.6 -1.2 -2.6 -2.6 -1.2 2.6 -1.2 Z" fill="#FFE24E" />
          <path d="M30 92 l1.2 2.6 2.6 1.2 -2.6 1.2 -1.2 2.6 -1.2 -2.6 -2.6 -1.2 2.6 -1.2 Z" fill="#7BE0FF" />
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
