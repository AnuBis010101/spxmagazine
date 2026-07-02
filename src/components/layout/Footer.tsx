import Link from "next/link";
import Image from "next/image";
import { NAV_ITEMS } from "@/lib/constants";
import { ExternalLink } from "lucide-react";

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function DexScreenerIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  );
}

const navigateLinks = [
  ...NAV_ITEMS.map((item) => ({ label: item.label, href: item.href })),
  { label: "Bookmarks", href: "/bookmarks" },
];

const resourceLinks = [
  { label: "How to Buy", href: "/how-to-buy", external: false },
  { label: "Glossary", href: "/learn/glossary", external: false },
  {
    label: "SPX6900.com",
    href: "https://spx6900.com",
    external: true,
  },
  {
    label: "CoinGecko",
    href: "https://www.coingecko.com/en/coins/spx6900",
    external: true,
  },
];

const connectLinks = [
  {
    label: "X / Twitter",
    href: "https://x.com/SPX6900",
    icon: XIcon,
  },
  {
    label: "Telegram",
    href: "https://t.me/portal_spx6900",
    icon: TelegramIcon,
  },
  {
    label: "DexScreener",
    href: "https://dexscreener.com/ethereum/0xe0f63a424a4439cbe457d80e4f4b51ad25b2c56c",
    icon: DexScreenerIcon,
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-mag-border" style={{ backgroundColor: "rgba(10, 10, 10, 0.65)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Top section */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/spx6900-coin.png"
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
              <Image
                src="/spxlogo.png"
                alt="SPX Magazine"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-mag-muted">
              The premier source for SPX6900 news, insights, and community.
            </p>
          </div>

          {/* Col 2: Navigate */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-gold-400">
              Navigate
            </h3>
            <ul className="mt-4 space-y-3">
              {navigateLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-mag-muted transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-gold-400">
              Resources
            </h3>
            <ul className="mt-4 space-y-3">
              {resourceLinks.map((item) =>
                item.external ? (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-mag-muted transition-colors hover:text-white"
                    >
                      {item.label}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-mag-muted transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Col 4: Connect */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-gold-400">
              Connect
            </h3>
            <ul className="mt-4 space-y-3">
              {connectLinks.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-mag-muted transition-colors hover:text-white"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 border-t border-mag-border pt-6 text-center">
          <p className="text-sm text-mag-muted">
            &copy; {new Date().getFullYear()} SPX Magazine. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
