"use client";

import { useCallback, useState } from "react";
import { Share2, Link2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ShareButtonsProps {
  url: string;
  title: string;
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareToX = useCallback(() => {
    const tweetText = encodeURIComponent(title);
    const tweetUrl = encodeURIComponent(url);
    window.open(
      `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`,
      "_blank",
      "noopener,noreferrer,width=550,height=420"
    );
  }, [url, title]);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [url]);

  const buttonBase =
    "inline-flex items-center justify-center w-11 h-11 rounded-lg text-mag-muted hover:text-gold-400 hover:bg-gold-400/10 transition-colors";

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={shareToX}
        className={buttonBase}
        aria-label="Share on X"
        title="Share on X"
      >
        <XIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={copyLink}
        className={cn(buttonBase, copied && "text-gold-400")}
        aria-label="Copy link"
        title={copied ? "Copied!" : "Copy link"}
      >
        {copied ? (
          <Share2 className="w-4 h-4" />
        ) : (
          <Link2 className="w-4 h-4" />
        )}
      </button>
      {copied && (
        <span className="text-xs text-gold-400 ml-1 animate-in fade-in duration-200">
          Copied!
        </span>
      )}
    </div>
  );
}
