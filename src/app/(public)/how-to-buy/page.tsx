import type { Metadata } from "next";
import Link from "next/link";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { SPX6900_CONTRACTS } from "@/lib/constants";

const PAGE_DESCRIPTION =
  "A step-by-step guide to buying SPX6900 on Ethereum. Learn how to set up a wallet, get ETH, and swap for SPX6900 on Uniswap or CoW Swap.";

export const metadata: Metadata = {
  title: `How to Buy SPX6900`,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/how-to-buy" },
};

const steps = [
  {
    number: 1,
    title: "Get a Wallet",
    description:
      "Download MetaMask or another self-custody wallet on your phone or browser. Create a new wallet and securely back up your seed phrase. Never share your seed phrase with anyone.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 6v3" />
      </svg>
    ),
  },
  {
    number: 2,
    title: "Get ETH",
    description:
      "Buy ETH from a centralized exchange like Kraken or Binance, then send it to your wallet address. Alternatively, buy ETH directly inside your wallet using a debit card or bank transfer.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: 3,
    title: "Connect to a DEX",
    description:
      "Go to a trusted Ethereum DEX like Uniswap or CoW Swap. Click \"Connect Wallet\" and select your wallet. Approve the connection when prompted.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.54a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.374" />
      </svg>
    ),
  },
  {
    number: 4,
    title: "Swap for SPX6900",
    description:
      "Paste the SPX6900 contract address into the token search. Set your slippage tolerance (1-3% recommended), enter the amount of ETH you want to swap, and confirm the transaction in your wallet.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
  {
    number: 5,
    title: "Hold & Believe",
    description:
      "There is no chart. There is no price. SPX6900 is a movement. Join the community on X and be part of something bigger.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
      </svg>
    ),
  },
];

const contracts = [
  { chain: "Ethereum", address: SPX6900_CONTRACTS.ethereum },
];

const quickLinks = [
  {
    label: "Uniswap",
    href: `https://app.uniswap.org/swap?outputCurrency=${SPX6900_CONTRACTS.ethereum}`,
    description: "Swap on Ethereum",
  },
  {
    label: "CoW Swap",
    href: `https://swap.cow.fi/#/1/swap/ETH/${SPX6900_CONTRACTS.ethereum}`,
    description: "MEV-protected swap",
  },
  {
    label: "CoinGecko",
    href: "https://www.coingecko.com/en/coins/spx6900",
    description: "View market data",
  },
];

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Buy SPX6900",
  description: PAGE_DESCRIPTION,
  step: steps.map((step) => ({
    "@type": "HowToStep",
    position: step.number,
    name: step.title,
    text: step.description,
  })),
};

export default function HowToBuyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      {/* Header */}
      <ScrollReveal direction="up" blur duration={0.6}>
        <div className="mb-16 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            How to Buy{" "}
            <span className="text-gold-400">SPX6900</span>
          </h1>
          <p className="mt-4 text-lg text-mag-muted">
            A step-by-step guide to joining the movement
          </p>
        </div>
      </ScrollReveal>

      {/* Steps */}
      <div className="space-y-6">
        {steps.map((step, index) => (
          <ScrollReveal key={step.number} direction="up" scale blur duration={0.6} delay={index * 0.08}>
          <div
            key={step.number}
            className="group relative overflow-hidden rounded-xl border border-mag-border bg-white/[0.02] p-6 backdrop-blur-sm transition-colors hover:border-gold-400/30 sm:p-8"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex gap-5">
              {/* Step number */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-400 font-display text-lg font-bold text-mag-black">
                {step.number}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-gold-400">{step.icon}</span>
                  <h2 className="font-display text-xl font-semibold text-white">
                    {step.title}
                  </h2>
                </div>
                <p className="mt-3 leading-relaxed text-mag-muted">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Contract Addresses */}
      <ScrollReveal direction="up" scale blur duration={0.7}>
      <div className="mt-16">
        <h2 className="mb-6 font-display text-2xl font-bold text-white">
          Contract Address
        </h2>
        <div className="space-y-3">
          {contracts.map((contract) => (
            <div
              key={contract.chain}
              className="flex flex-col gap-2 rounded-xl border border-mag-border bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="font-display font-semibold text-gold-400">
                {contract.chain}
              </span>
              <code className="break-all rounded bg-mag-black px-3 py-1.5 text-sm text-mag-muted">
                {contract.address}
              </code>
            </div>
          ))}
        </div>
      </div>
      </ScrollReveal>

      {/* Quick Links */}
      <ScrollReveal direction="up" scale blur duration={0.7}>
      <div className="mt-16">
        <h2 className="mb-6 font-display text-2xl font-bold text-white">
          Quick Links
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {quickLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-xl border border-mag-border bg-white/[0.02] p-5 transition-colors hover:border-gold-400/30"
            >
              <span className="font-display font-semibold text-white group-hover:text-gold-400">
                {link.label}
              </span>
              <span className="mt-1 text-sm text-mag-muted">
                {link.description}
              </span>
              <span className="mt-3 inline-flex items-center gap-1 text-sm text-gold-400">
                Visit
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </div>
      </ScrollReveal>

      {/* Warning */}
      <ScrollReveal direction="up" blur duration={0.6}>
      <div className="mt-16 rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-6">
        <div className="flex gap-3">
          <svg
            className="h-6 w-6 shrink-0 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <div>
            <h3 className="font-display font-semibold text-yellow-500">
              Disclaimer
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-yellow-500/80">
              Always do your own research (DYOR). Never invest more than you can
              afford to lose. This is not financial advice. Cryptocurrency
              investments carry significant risk.
            </p>
          </div>
        </div>
      </div>
      </ScrollReveal>
    </div>
  );
}
