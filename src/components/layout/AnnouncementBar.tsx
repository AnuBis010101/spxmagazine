'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

interface AnnouncementBarProps {
  message: string;
  link?: string;
  linkText?: string;
}

export function AnnouncementBar({ message, link, linkText }: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(true); // hidden by default until hydration

  useEffect(() => {
    const key = `announcement-dismissed-${btoa(message).slice(0, 16)}`;
    setDismissed(localStorage.getItem(key) === 'true');
  }, [message]);

  const dismiss = () => {
    const key = `announcement-dismissed-${btoa(message).slice(0, 16)}`;
    localStorage.setItem(key, 'true');
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="relative bg-gradient-to-r from-gold-600/20 via-gold-400/15 to-gold-600/20 border-b border-gold-400/30 px-4 py-2.5 text-center">
      <p className="text-sm text-gold-300 font-medium">
        {message}
        {link && linkText && (
          <Link
            href={link}
            className="ml-2 underline underline-offset-2 text-gold-400 hover:text-gold-300 transition-colors font-semibold"
          >
            {linkText} →
          </Link>
        )}
      </p>
      <button
        onClick={dismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-400/60 hover:text-gold-400 transition-colors p-1"
        aria-label="Dismiss announcement"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
