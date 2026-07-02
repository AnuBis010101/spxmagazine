"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface CopyButtonProps {
  /** The text placed on the clipboard when pressed. */
  value: string;
  /** Accessible label for the idle state (e.g. "Copy Ethereum contract address"). */
  label?: string;
  className?: string;
}

/**
 * Small icon+label button that copies `value` to the clipboard and shows a
 * transient "Copied" confirmation (~1.5s). Fully keyboard accessible (it is a
 * real <button>), announces state changes via aria-live, and — because the
 * icon swap is instantaneous — is inherently calm under reduced motion.
 */
export default function CopyButton({ value, label = "Copy", className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        // Legacy fallback for insecure contexts / older browsers.
        const ta = document.createElement("textarea");
        ta.value = value;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard denied — leave the idle state; nothing to announce.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied to clipboard" : label}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-md border border-mag-border bg-mag-black px-2.5 py-1.5 text-xs font-medium text-mag-muted transition-colors hover:border-gold-400/40 hover:text-gold-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-mag-dark",
        className
      )}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-gold-400" aria-hidden />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden />
      )}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
