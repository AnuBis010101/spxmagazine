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
  | "celebrate" | "alert" | "write" | "search"
  // funny move set
  | "spin" | "backflip" | "roll" | "vibrate" | "glitch" | "boing" | "moonwalk"
  | "zoomies" | "tornado" | "hopHop" | "wiggle" | "teleport" | "peekaboo"
  | "faint" | "dizzy" | "dance" | "headbang" | "sneeze" | "laugh" | "love"
  | "cry" | "angry" | "shocked" | "sleepy" | "shrug" | "flex";

const ANIM_MS: Record<Anim, number> = {
  wave: 2300, knock: 2300, flip: 1000, think: 2400, pointL: 2200, pointR: 2200,
  pointU: 2200, celebrate: 1700, alert: 700, write: 2100, search: 1900,
  spin: 900, backflip: 1000, roll: 900, vibrate: 600, glitch: 700, boing: 700,
  moonwalk: 1400, zoomies: 1200, tornado: 1200, hopHop: 1760, wiggle: 900,
  teleport: 1100, peekaboo: 1200, faint: 1600, dizzy: 1600, dance: 1800,
  headbang: 1200, sneeze: 1300, laugh: 1600, love: 1800, cry: 1700, angry: 1000,
  shocked: 900, sleepy: 2200, shrug: 1200, flex: 1500,
};

/** The pool she pulls from on her own to keep fidgeting — variety = chaos. */
const ANTICS: Anim[] = [
  "spin", "boing", "wiggle", "vibrate", "glitch", "dance", "headbang", "zoomies",
  "dizzy", "hopHop", "laugh", "love", "shrug", "flex", "peekaboo", "tornado",
  "sneeze", "roll", "moonwalk", "backflip", "teleport", "wave", "celebrate",
  "think", "search", "pointU", "pointL", "pointR", "shocked", "sleepy", "angry",
  "cry", "knock", "write",
];

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

  /* -- ambient antics: she never quite sits still (a bit unhinged) -- */
  useEffect(() => {
    if (!enabled || dismissed || !visible) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let t: ReturnType<typeof setTimeout>;
    const loop = () => {
      const delay = 1400 + Math.random() * 3200; // ~1.4s–4.6s between gags
      t = setTimeout(() => {
        if (document.visibilityState === "visible") {
          play(ANTICS[Math.floor(Math.random() * ANTICS.length)]);
        }
        loop();
      }, delay);
    };
    loop();
    return () => clearTimeout(t);
  }, [enabled, dismissed, visible, play]);

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
    const fun: Anim[] = [
      "flip", "spin", "backflip", "tornado", "dizzy", "boing", "vibrate",
      "glitch", "laugh", "love", "shocked", "celebrate", "roll", "teleport",
      "wiggle", "hopHop", "headbang", "faint",
    ];
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
              <defs>
                <linearGradient id="aeIconGold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ffe79a" />
                  <stop offset="0.5" stopColor="#f4c14e" />
                  <stop offset="1" stopColor="#d3941f" />
                </linearGradient>
              </defs>
              <path d="M16 2 L19 12.5 L30 13 L21.2 19.6 L24.3 30 L16 23.7 L7.7 30 L10.8 19.6 L2 13 L13 12.5 Z" fill="url(#aeIconGold)" stroke="#b9791a" strokeWidth="0.7" strokeLinejoin="round" />
              <path d="M17 8 L11.6 16.8 L15.2 16.8 L13.2 23 L20 13.4 L16.1 13.4 L18.8 8 Z" fill="#17181c" />
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
 * The character. Ultra-premium anime "Aeon": platinum silver hair with
 * strand highlights, huge multi-layer jewel eyes, gold lightning-star
 * ornament, sleek black high-neck top with gold trim. SFW, chibi-premium,
 * legible down to favicon size. Rig groups keep their module classes so
 * the CSS animations still drive head / arms / eyes / hair / mouth.
 *
 * Layer order: back-hair (static) -> torso -> head+face+bangs+ornament ->
 * side locks (sway) -> arms (ON TOP so raised gestures stay visible) -> fx.
 * ------------------------------------------------------------------ */
function AeonSvg() {
  return (
    <svg viewBox="0 0 150 190" width="150" height="190" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="chibi_hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8fbff"/>
          <stop offset="0.5" stopColor="#dbe2ee"/>
          <stop offset="1" stopColor="#bcc7da"/>
        </linearGradient>
        <linearGradient id="chibi_hairBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d3dbe9"/>
          <stop offset="1" stopColor="#a3aec4"/>
        </linearGradient>
        <linearGradient id="chibi_skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffece0"/>
          <stop offset="1" stopColor="#ffd1bb"/>
        </linearGradient>
        <linearGradient id="chibi_iris" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f8bc6"/>
          <stop offset="0.5" stopColor="#6dc0e8"/>
          <stop offset="1" stopColor="#dff5fd"/>
        </linearGradient>
        <linearGradient id="chibi_gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe79a"/>
          <stop offset="0.5" stopColor="#f4c14e"/>
          <stop offset="1" stopColor="#d3941f"/>
        </linearGradient>
        {/* robe of light — luminous white with a cool-blue drape and a warm halo sheen */}
        <linearGradient id="chibi_top" x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor="#ffffff"/>
          <stop offset="0.42" stopColor="#f4f8ff"/>
          <stop offset="0.8" stopColor="#e4eeff"/>
          <stop offset="1" stopColor="#d3e2fb"/>
        </linearGradient>
        <radialGradient id="chibi_robeSheen" cx="0.5" cy="0.28" r="0.75">
          <stop offset="0" stopColor="#fffdf3" stopOpacity="0.9"/>
          <stop offset="0.55" stopColor="#ffffff" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="chibi_robeGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff6de" stopOpacity="0.62"/>
          <stop offset="0.5" stopColor="#e8f2ff" stopOpacity="0.32"/>
          <stop offset="1" stopColor="#ffffff" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="chibi_blush" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ff9c9c" stopOpacity="0.85"/>
          <stop offset="1" stopColor="#ff9c9c" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="chibi_cheek" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#fff4ec"/>
          <stop offset="1" stopColor="#ffd8c6"/>
        </radialGradient>
        <radialGradient id="chibi_eyeGlow" cx="0.5" cy="0.85" r="0.65">
          <stop offset="0" stopColor="#c4f1ff" stopOpacity="0.95"/>
          <stop offset="1" stopColor="#c4f1ff" stopOpacity="0"/>
        </radialGradient>
        {/* ---- angelic wings ---- */}
        <linearGradient id="chibi_wing" x1="0.15" y1="0.05" x2="0.75" y2="1">
          <stop offset="0" stopColor="#ffffff"/>
          <stop offset="0.55" stopColor="#e9f0fb"/>
          <stop offset="1" stopColor="#c6d6ef"/>
        </linearGradient>
        <linearGradient id="chibi_wingLite" x1="0.2" y1="0" x2="0.7" y2="1">
          <stop offset="0" stopColor="#ffffff"/>
          <stop offset="1" stopColor="#eef4fc"/>
        </linearGradient>
        <radialGradient id="chibi_halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff6dc" stopOpacity="0.4"/>
          <stop offset="0.55" stopColor="#eae1ff" stopOpacity="0.13"/>
          <stop offset="1" stopColor="#ffffff" stopOpacity="0"/>
        </radialGradient>
        {/* One wing (character's right); the left is this same shape mirrored. */}
        <g id="chibi_wing_shape">
          <path d="M84,113 C78,94 80,70 96,53 C106,42 119,37 128,43 C122,48 120,53 123,59 C116,58 113,64 115,72 C108,69 104,76 106,85 C98,81 94,89 95,99 C90,94 86,103 84,113 Z" fill="url(#chibi_wing)"/>
          <path d="M88,109 C85,94 89,78 99,68 C106,61 114,58 121,62 C115,65 113,70 115,76 C109,73 105,78 106,85 C100,82 96,87 97,95 C92,91 90,100 88,109 Z" fill="url(#chibi_wingLite)"/>
          <path d="M84,113 C78,94 80,70 96,53 C106,42 119,37 128,43" fill="none" stroke="#f6e6bd" strokeWidth="1.3" strokeOpacity="0.75" strokeLinecap="round"/>
          <path d="M94,60 C98,74 101,88 99,101 M104,54 C109,68 112,82 111,95 M115,50 C119,62 121,74 118,85" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.5" strokeLinecap="round"/>
        </g>
      </defs>
      <g className={styles.floaty}>
        {/* ---- angelic halo + wings (behind everything) ---- */}
        <ellipse className={styles.halo} cx="75" cy="74" rx="66" ry="82" fill="url(#chibi_halo)" aria-hidden />
        <g className={styles.wings} aria-hidden>
          <g transform="translate(75 146) scale(1.40) translate(-75 -78)">
            <use href="#chibi_wing_shape" />
            <use href="#chibi_wing_shape" transform="translate(150 0) scale(-1 1)" />
          </g>
        </g>
        <g className={styles.headSync}>
          <path d="M33,72 C27,37 49,13 75,13 C101,13 123,37 117,72 C121,110 113,150 104,180 L98,180 C100,142 100,110 95,97 L55,97 C50,110 50,142 52,180 L46,180 C37,150 29,110 33,72 Z" fill="url(#chibi_hairBack)"/>
          <path d="M40,120 C42,140 46,160 50,178" fill="none" stroke="#7b879f" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.65"/>
          <path d="M110,120 C108,140 104,160 100,178" fill="none" stroke="#7b879f" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.65"/>
          <path d="M36,100 C36,130 40,158 47,180" fill="none" stroke="#94a0b7" strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.5"/>
          <path d="M114,100 C114,130 110,158 103,180" fill="none" stroke="#94a0b7" strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.5"/>
          <path d="M33,72 C27,37 49,13 75,13 C99,14 118,34 118,64" fill="none" stroke="#f2f8ff" strokeWidth="1.7" strokeLinecap="round" strokeOpacity="0.7"/>
        </g>
        <ellipse className={styles.robeAura} cx="75" cy="152" rx="53" ry="58" fill="url(#chibi_robeGlow)" aria-hidden />
        <g className={styles.robe}>
          {/* flared robe of light */}
          <path d="M52,107 C49,130 42,161 38,191 C56,197 94,197 112,191 C108,161 101,130 98,107 C89,116 61,116 52,107 Z" fill="url(#chibi_top)"/>
          {/* soft cool drape on the shadow side */}
          <path d="M75,116 C84,116 92,113 96,108 C100,140 106,170 110,192 C98,196 84,195 75,194 Z" fill="#c3d6f4" opacity="0.5"/>
          {/* inner luminous sheen */}
          <path d="M52,107 C49,130 42,161 38,191 C56,197 94,197 112,191 C108,161 101,130 98,107 C89,116 61,116 52,107 Z" fill="url(#chibi_robeSheen)"/>
          {/* luminous rim on the lit side */}
          <path d="M50,109 C47,133 41,164 38,190" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5"/>
          {/* drape fold lines (cool blue on white) */}
          <path d="M52,107 C50,132 46,162 42,190" fill="none" stroke="#a9bde3" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.7"/>
          <path d="M98,107 C100,132 104,162 108,190" fill="none" stroke="#9fb4dd" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.6"/>
          <path d="M63,120 C61,150 60,174 60,193" fill="none" stroke="#c4d3ee" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.55"/>
          <path d="M88,120 C90,150 91,174 91,193" fill="none" stroke="#b7c8e8" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.5"/>
          {/* white light streak */}
          <path d="M60,116 C57,145 55,172 56,193" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7"/>
          {/* gold neckline, center seam + curved hem trim */}
          <path d="M53,108 C61,116 89,116 97,108" fill="none" stroke="url(#chibi_gold)" strokeWidth="2.2" strokeLinecap="round"/>
          <path d="M75,116 L75,192" fill="none" stroke="#e9c876" strokeWidth="1.1" strokeOpacity="0.55"/>
          <path d="M39,189 C57,195 93,195 111,189" fill="none" stroke="url(#chibi_gold)" strokeWidth="1.7" strokeLinecap="round" strokeOpacity="0.9"/>
          {/* gold waist sash + kawaii bow */}
          <path d="M45,133 C58,140 92,140 105,133" fill="none" stroke="url(#chibi_gold)" strokeWidth="3.2" strokeLinecap="round"/>
          <path d="M73,137 C72,147 71,154 70,161" fill="none" stroke="url(#chibi_gold)" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M77,137 C78,147 79,154 80,161" fill="none" stroke="url(#chibi_gold)" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M75,137 L66.5,132 C64.5,135 64.5,139 66.5,142 Z" fill="url(#chibi_gold)" stroke="#c8981f" strokeWidth="0.4"/>
          <path d="M75,137 L83.5,132 C85.5,135 85.5,139 83.5,142 Z" fill="url(#chibi_gold)" stroke="#c8981f" strokeWidth="0.4"/>
          <circle cx="75" cy="137" r="2.1" fill="#ffe79a" stroke="#c8981f" strokeWidth="0.5"/>
        </g>
        <g className={styles.head}>
          <path d="M66,92 C66,102 68,110 75,111 C82,110 84,102 84,92 Z" fill="url(#chibi_skin)"/>
          <path d="M66,94 C69,100 81,100 84,94 L84,99 C80,104 70,104 66,99 Z" fill="#eaa98f" fillOpacity="0.6"/>
          <path d="M45,58 C45,39 57,27 75,27 C93,27 105,39 105,58 C105,79 94,97 75,99 C56,97 45,79 45,58 Z" fill="url(#chibi_skin)"/>
          <ellipse cx="75" cy="70" rx="26" ry="24" fill="url(#chibi_cheek)" opacity="0.35"/>
          <path d="M99,56 C103,70 99,86 87,95 C96,86 99,73 98,58 Z" fill="#e8ac92" opacity="0.5"/>
          <path d="M46,56 C50,44 62,36 75,36 C88,36 100,44 104,56 C98,52 90,52 84,58 C80,54 70,54 66,58 C60,52 52,52 46,56 Z" fill="#f2c1a9" opacity="0.75"/>
          <path d="M50,80 C58,92 68,96 75,97 C82,96 92,92 100,80 C94,90 84,94 75,94 C66,94 56,90 50,80 Z" fill="#f2c1a9" opacity="0.45"/>
          <path d="M46,58 C46,72 52,86 61,93" fill="none" stroke="#fff2e8" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.55"/>
          <path d="M44,63 C40,62 39,68 43,72 C45,74 47,73 47,70 Z" fill="url(#chibi_skin)"/>
          <path d="M42,65 C41,67 42,70 44,71" fill="none" stroke="#e8a488" strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.7"/>
          <path d="M106,63 C110,62 111,68 107,72 C105,74 103,73 103,70 Z" fill="url(#chibi_skin)"/>
          <path d="M108,65 C109,67 108,70 106,71" fill="none" stroke="#e8a488" strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.7"/>
          <ellipse cx="57" cy="76" rx="7.5" ry="5" fill="url(#chibi_blush)"/>
          <ellipse cx="93" cy="76" rx="7.5" ry="5" fill="url(#chibi_blush)"/>
          <path d="M52,53 Q60,49 69,52" fill="none" stroke="#b9aac2" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M81,52 Q90,49 98,53" fill="none" stroke="#b9aac2" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M50,61 Q56,50 61,50 Q68,50 71,61 Q66,56 61,56 Q54,56 50,61 Z" fill="#241d2c"/>
          <path d="M79,61 Q86,50 89,50 Q94,50 100,61 Q95,56 89,56 Q84,56 79,61 Z" fill="#241d2c"/>
          <path d="M50,60 L44.5,57.5" stroke="#241d2c" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M100,60 L105.5,57.5" stroke="#241d2c" strokeWidth="1.8" strokeLinecap="round"/>
          <g className={styles.eyes}>
            <ellipse cx="61" cy="64" rx="9" ry="10.6" fill="#fdfeff"/>
            <ellipse cx="89" cy="64" rx="9" ry="10.6" fill="#fdfeff"/>
            <path d="M52.4,60 A9 10.6 0 0 1 69.6,60 C65,63 57,63 52.4,60 Z" fill="#d9c3cf" opacity="0.5"/>
            <path d="M80.4,60 A9 10.6 0 0 1 97.6,60 C93,63 85,63 80.4,60 Z" fill="#d9c3cf" opacity="0.5"/>
          </g>
          <g className={styles.pupils}>
            <ellipse cx="61" cy="65" rx="7.2" ry="9.2" fill="url(#chibi_iris)"/>
            <ellipse cx="61" cy="69" rx="6" ry="5.6" fill="url(#chibi_eyeGlow)"/>
            <path d="M53.8,60 A7.2 9.2 0 0 1 68.2,60 C64,64 58,64 53.8,60 Z" fill="#1c5c8c" opacity="0.75"/>
            <ellipse cx="61" cy="66" rx="3.7" ry="5.2" fill="#142838"/>
            <path d="M57.6,67.6 A3.7 5.2 0 0 0 64.4,67.6" fill="none" stroke="#63cbf2" strokeWidth="0.8" strokeLinecap="round" opacity="0.75"/>
            <ellipse cx="58.2" cy="60.6" rx="2.9" ry="3.8" fill="#ffffff"/>
            <circle cx="63.6" cy="68.4" r="1.7" fill="#ffffff"/>
            <path transform="translate(64.6,62)" d="M0,-2.3 L0.6,-0.6 L2.3,0 L0.6,0.6 L0,2.3 L-0.6,0.6 L-2.3,0 L-0.6,-0.6 Z" fill="#ffffff" opacity="0.92"/>
            <ellipse cx="89" cy="65" rx="7.2" ry="9.2" fill="url(#chibi_iris)"/>
            <ellipse cx="89" cy="69" rx="6" ry="5.6" fill="url(#chibi_eyeGlow)"/>
            <path d="M81.8,60 A7.2 9.2 0 0 1 96.2,60 C92,64 86,64 81.8,60 Z" fill="#1c5c8c" opacity="0.75"/>
            <ellipse cx="89" cy="66" rx="3.7" ry="5.2" fill="#142838"/>
            <path d="M85.6,67.6 A3.7 5.2 0 0 0 92.4,67.6" fill="none" stroke="#63cbf2" strokeWidth="0.8" strokeLinecap="round" opacity="0.75"/>
            <ellipse cx="86.2" cy="60.6" rx="2.9" ry="3.8" fill="#ffffff"/>
            <circle cx="91.6" cy="68.4" r="1.7" fill="#ffffff"/>
            <path transform="translate(92.6,62)" d="M0,-2.3 L0.6,-0.6 L2.3,0 L0.6,0.6 L0,2.3 L-0.6,0.6 L-2.3,0 L-0.6,-0.6 Z" fill="#ffffff" opacity="0.92"/>
          </g>
          <path d="M74.2,78.5 Q75,80.6 76.3,79.4" fill="none" stroke="#e8a488" strokeWidth="1" strokeLinecap="round" opacity="0.65"/>
          <g className={styles.mouth}>
            <path d="M70,83 Q75,89 80,83 Q75,85.4 70,83 Z" fill="#b34f47"/>
            <path d="M71.4,83.6 Q75,86.4 78.6,83.6" fill="none" stroke="#8f3a34" strokeWidth="0.7" strokeLinecap="round"/>
            <path d="M72.6,86.4 Q75,88 77.4,86.4" fill="#d97b6c"/>
            <path d="M71,84 Q75,85.6 79,84" fill="none" stroke="#ffd8cc" strokeWidth="0.7" strokeLinecap="round" opacity="0.7"/>
          </g>
          <path d="M42,60 C39,42 50,26 75,25 C100,26 111,42 108,60 C104,51 99,52 95,61 C95,50 89,48 85,59 C85,49 79,47 75,58 C71,47 65,49 65,59 C61,48 55,50 55,61 C51,52 46,51 42,60 Z" fill="url(#chibi_hair)"/>
          <path d="M45,58 C50,48 60,44 75,43 C90,44 100,48 105,58 C99,54 90,53 85,58 C80,53 70,53 65,58 C60,53 51,54 45,58 Z" fill="#b3bdd0" opacity="0.55"/>
          <path d="M85,59 C85,51 89,48 92,50 C90,54 92,58 95,61 C91,58 87,58 85,59 Z" fill="#a7b2c8" opacity="0.5"/>
          <path d="M65,59 C63,53 60,50 57,52 C60,55 58,59 55,61 C59,58 63,58 65,59 Z" fill="#c6cfe0" opacity="0.4"/>
          <path d="M62,33 C58,42 56,50 57,59" fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.8"/>
          <path d="M88,33 C92,42 94,50 93,59" fill="none" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.65"/>
          <path d="M75,29 L75,55" fill="none" stroke="#f8fbff" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.6"/>
          <path d="M69,31 C67,40 66,49 67,57" fill="none" stroke="#eef3fb" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.55"/>
          <path d="M81,31 C83,40 84,49 83,57" fill="none" stroke="#d7deec" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.5"/>
          <g>
            <path d="M75,9 L77.6,16.4 L85.5,16.6 L79.3,21.4 L81.5,28.9 L75,24.5 L68.5,28.9 L70.7,21.4 L64.5,16.6 L72.4,16.4 Z" fill="url(#chibi_gold)" stroke="#b9791a" strokeWidth="0.6" strokeLinejoin="round"/>
            <path d="M76.5,13 L71.6,20.6 L74.7,20.6 L73,26 L79,17.6 L75.6,17.6 L78,13 Z" fill="#241d2c"/>
            <circle cx="72" cy="14.5" r="1" fill="#fff3c4"/>
          </g>
        </g>
        <g className={styles.headSync}>
        <g className={styles.tailL}>
          <path d="M47,42 C36,60 33,102 39,142 C40,150 45,151 47,146 C44,110 47,72 55,50 C54,43 50,40 47,42 Z" fill="url(#chibi_hair)"/>
          <path d="M52,52 C46,80 46,114 45,142 C47,144 46,120 50,84 C52,68 54,56 55,50 Z" fill="#aab4c8" opacity="0.45"/>
          <path d="M48,48 C41,66 39,102 42,134" fill="none" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.7"/>
          <path d="M52,52 C48,80 48,114 45,142" fill="none" stroke="#98a3ba" strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.7"/>
        </g>
        <g className={styles.tailR}>
          <path d="M103,42 C114,60 117,102 111,142 C110,150 105,151 103,146 C106,110 103,72 95,50 C96,43 100,40 103,42 Z" fill="url(#chibi_hair)"/>
          <path d="M98,52 C104,80 104,114 105,142 C103,144 104,120 100,84 C98,68 96,56 95,50 Z" fill="#98a3ba" opacity="0.5"/>
          <path d="M102,48 C109,66 111,102 108,134" fill="none" stroke="#eef3fb" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.55"/>
          <path d="M98,52 C102,80 102,114 105,142" fill="none" stroke="#8a95ad" strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.7"/>
        </g>
        </g>
        <g className={styles.armL}>
          <path d="M52,110 C43,116 38,140 39,166 C39,174 48,176 52,170 C55,148 57,126 58,114 C57,110 55,108 52,110 Z" fill="url(#chibi_top)"/>
          <path d="M52,111 C46,118 43,138 43,160" fill="none" stroke="#a9bde3" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.75"/>
          <path d="M40,163 C39,170 47,173 51,168" fill="none" stroke="url(#chibi_gold)" strokeWidth="1.8" strokeLinecap="round"/>
          <ellipse cx="45.5" cy="172" rx="5.2" ry="4.6" fill="url(#chibi_skin)"/>
          <path d="M43,170 a5.2 4.6 0 0 0 5,4" fill="#000000" opacity="0.12"/>
          <path d="M42,171 q3.5,3 7,0" fill="none" stroke="#f0b49b" strokeWidth="0.9" strokeLinecap="round"/>
        </g>
        <g className={styles.armR}>
          <path d="M98,110 C107,116 112,140 111,166 C111,174 102,176 98,170 C95,148 93,126 92,114 C93,110 95,108 98,110 Z" fill="url(#chibi_top)"/>
          <path d="M98,111 C104,118 107,138 107,160" fill="none" stroke="#9fb4dd" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.7"/>
          <path d="M110,163 C111,170 103,173 99,168" fill="none" stroke="url(#chibi_gold)" strokeWidth="1.8" strokeLinecap="round"/>
          <ellipse cx="104.5" cy="172" rx="5.2" ry="4.6" fill="url(#chibi_skin)"/>
          <path d="M107,170 a5.2 4.6 0 0 1 -5,4" fill="#000000" opacity="0.14"/>
          <path d="M101,171 q3.5,3 7,0" fill="none" stroke="#f0b49b" strokeWidth="0.9" strokeLinecap="round"/>
        </g>
        <g className={styles.fx}>
          <path transform="translate(27,42)" d="M0,-5 L1.3,-1.3 L5,0 L1.3,1.3 L0,5 L-1.3,1.3 L-5,0 L-1.3,-1.3 Z" fill="#ffe79a"/>
          <path transform="translate(123,48) scale(1.2)" d="M0,-5 L1.3,-1.3 L5,0 L1.3,1.3 L0,5 L-1.3,1.3 L-5,0 L-1.3,-1.3 Z" fill="#fff3c4"/>
          <path transform="translate(120,108)" d="M0,-5 L1.3,-1.3 L5,0 L1.3,1.3 L0,5 L-1.3,1.3 L-5,0 L-1.3,-1.3 Z" fill="#ffe79a"/>
          <path transform="translate(30,116) scale(0.85)" d="M0,-5 L1.3,-1.3 L5,0 L1.3,1.3 L0,5 L-1.3,1.3 L-5,0 L-1.3,-1.3 Z" fill="#fff3c4"/>
          <circle cx="112" cy="30" r="1.3" fill="#ffffff"/>
          <circle cx="38" cy="90" r="1.3" fill="#ffffff"/>
        </g>
        <g className={styles.thought}>
          <circle cx="101" cy="52" r="3" fill="#ffffff" stroke="#c2ccdd" strokeWidth="0.8"/>
          <circle cx="113" cy="41" r="4.2" fill="#ffffff" stroke="#c2ccdd" strokeWidth="0.8"/>
          <circle cx="127" cy="28" r="5.6" fill="#ffffff" stroke="#c2ccdd" strokeWidth="0.8"/>
          <circle cx="139" cy="16" r="7" fill="#ffffff" stroke="#c2ccdd" strokeWidth="0.8"/>
        </g>

        {/* ---- extra reaction FX (hidden until a gag calls them) ---- */}
        <g className={styles.fxHearts} aria-hidden>
          <path transform="translate(96,36)" d="M0,2.6 C-3.4,-0.8 -3.4,-4 -1.5,-4 C-0.5,-4 0,-3.2 0,-2.5 C0,-3.2 0.5,-4 1.5,-4 C3.4,-4 3.4,-0.8 0,2.6 Z" fill="#ff7d9c"/>
          <path transform="translate(110,24) scale(1.35)" d="M0,2.6 C-3.4,-0.8 -3.4,-4 -1.5,-4 C-0.5,-4 0,-3.2 0,-2.5 C0,-3.2 0.5,-4 1.5,-4 C3.4,-4 3.4,-0.8 0,2.6 Z" fill="#ff4f78"/>
          <path transform="translate(124,12) scale(0.9)" d="M0,2.6 C-3.4,-0.8 -3.4,-4 -1.5,-4 C-0.5,-4 0,-3.2 0,-2.5 C0,-3.2 0.5,-4 1.5,-4 C3.4,-4 3.4,-0.8 0,2.6 Z" fill="#ffd76b"/>
        </g>
        <g className={styles.fxNotes} aria-hidden>
          <text x="18" y="44" fontSize="15" fontWeight="700" fill="#f4c14e">♪</text>
          <text x="112" y="30" fontSize="18" fontWeight="700" fill="#f4c14e">♫</text>
          <text x="128" y="54" fontSize="13" fontWeight="700" fill="#ffd76b">♪</text>
        </g>
        <g className={styles.fxDrop} aria-hidden>
          <path transform="translate(101,60)" d="M0,-4.5 C3,-1.2 3,3 0,4.6 C-3,3 -3,-1.2 0,-4.5 Z" fill="#8fd0ff"/>
          <ellipse cx="99.6" cy="57.6" rx="0.9" ry="1.5" fill="#ffffff" opacity="0.85"/>
        </g>
        <g className={styles.fxZzz} aria-hidden>
          <text x="104" y="36" fontSize="10" fontWeight="700" fontStyle="italic" fill="#cfd6e6">z</text>
          <text x="112" y="25" fontSize="13" fontWeight="700" fontStyle="italic" fill="#dfe5f0">z</text>
          <text x="122" y="14" fontSize="17" fontWeight="700" fontStyle="italic" fill="#eef2f8">Z</text>
        </g>
        <g className={styles.fxAnger} aria-hidden>
          <path transform="translate(97,30)" d="M-4,-2 L4,-2 M-4,1.4 L4,1.4 M-1.6,-5 L-2.6,4.2 M2.6,-5 L1.6,4.2" stroke="#ff3b3b" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        </g>
        <g className={styles.fxDizzy} aria-hidden>
          <path transform="translate(58,12)" d="M0,-4 L1,-1 L4,0 L1,1 L0,4 L-1,1 L-4,0 L-1,-1 Z" fill="#ffe79a"/>
          <path transform="translate(75,5) scale(1.25)" d="M0,-4 L1,-1 L4,0 L1,1 L0,4 L-1,1 L-4,0 L-1,-1 Z" fill="#7BE0FF"/>
          <path transform="translate(92,12)" d="M0,-4 L1,-1 L4,0 L1,1 L0,4 L-1,1 L-4,0 L-1,-1 Z" fill="#ffe79a"/>
        </g>
        <g className={styles.fxBang} aria-hidden>
          <text x="75" y="6" fontSize="22" fontWeight="800" fill="#ffd76b" stroke="#7a4b00" strokeWidth="0.6" textAnchor="middle">!</text>
        </g>
      </g>
    </svg>
  );
}
