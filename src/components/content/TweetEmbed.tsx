"use client";

import { useEffect, useRef, useState } from "react";

interface TweetEmbedProps {
  tweetUrl: string;
  tweetId: string;
}

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement) => void;
      };
    };
  }
}

export default function TweetEmbed({ tweetUrl, tweetId }: TweetEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTwitterScript = () => {
      if (window.twttr) {
        if (containerRef.current) {
          window.twttr.widgets.load(containerRef.current);
        }
        setIsLoading(false);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      script.onload = () => {
        if (window.twttr && containerRef.current) {
          window.twttr.widgets.load(containerRef.current);
        }
        setIsLoading(false);
      };
      script.onerror = () => {
        setIsLoading(false);
      };
      document.head.appendChild(script);
    };

    loadTwitterScript();
  }, [tweetId]);

  return (
    <div ref={containerRef} className="min-h-[200px] relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="space-y-3 w-full max-w-[550px] animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-mag-border" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-mag-border rounded w-32" />
                <div className="h-3 bg-mag-border rounded w-24" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-mag-border rounded w-full" />
              <div className="h-3 bg-mag-border rounded w-4/5" />
              <div className="h-3 bg-mag-border rounded w-3/5" />
            </div>
          </div>
        </div>
      )}
      <blockquote
        className="twitter-tweet"
        data-theme="dark"
        data-conversation="none"
      >
        <a href={tweetUrl}>Loading tweet...</a>
      </blockquote>
    </div>
  );
}
