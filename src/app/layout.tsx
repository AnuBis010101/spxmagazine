import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import { buildOgImageUrl } from "@/lib/utils/og-url";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Preloader from "@/components/layout/Preloader";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    images: [{ url: buildOgImageUrl({ title: "SPX Magazine", subtitle: "The Voice of SPX6900" }), width: 1200, height: 630, alt: "SPX Magazine — The Voice of SPX6900" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    site: "@Spx6900Magazine",
    creator: "@Spx6900Magazine",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Runs at HTML parse time — independent of React hydration or even the app
// bundle loading — so the preloader overlay can be force-dismissed no matter
// what goes wrong client-side. This is the outermost guarantee that it can
// never block the page (see Preloader.tsx for the full four-layer story).
const PRELOADER_FAILSAFE = `(function(){var I="spx-preloader";function h(){var e=document.getElementById(I);if(!e||e.__spxHidden)return;e.__spxHidden=1;e.style.pointerEvents="none";e.style.transition="opacity .45s ease";e.style.opacity="0";setTimeout(function(){var x=document.getElementById(I);if(x)x.style.display="none";},480);}try{var seen=false;try{seen=!!sessionStorage.getItem("spx-loaded");}catch(_){}if(seen){var e=document.getElementById(I);if(e)e.style.display="none";return;}setTimeout(h,3800);window.addEventListener("load",function(){setTimeout(h,1200);});document.addEventListener("visibilitychange",function(){if(document.visibilityState==="visible")setTimeout(h,1200);});window.addEventListener("pageshow",function(ev){if(ev&&ev.persisted)h();});}catch(_){setTimeout(h,3800);}})();`;

// Runs before first paint so a saved gold theme is already on <html> by the
// time anything renders. Without this the page paints dark and only flips
// once ThemeToggle hydrates, which reads as a flash of the wrong theme.
const THEME_INIT = `(function(){try{var t=localStorage.getItem("spx-theme");if(t==="gold"||t==="dark")document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable}`}
      /* THEME_INIT stamps data-theme here before React hydrates, so the
         server HTML (which can't know the visitor's saved theme) will always
         differ by that one attribute. Scoped to <html> only — it does not
         suppress warnings for any descendant. */
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        <link rel="preload" href="/spxlogo.png" as="image" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Preloader />
        <script dangerouslySetInnerHTML={{ __html: PRELOADER_FAILSAFE }} />
        <SmoothScroll />
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#141414",
              color: "#fff",
              border: "1px solid #2A2A2A",
            },
          }}
        />
      </body>
    </html>
  );
}
