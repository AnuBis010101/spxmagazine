"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center px-4 py-16 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Icon with subtle gold background circle */}
      <div className="relative mb-6 flex items-center justify-center">
        <div className="absolute h-24 w-24 rounded-full bg-gold-400/10" />
        <div className="relative text-gold-400 [&>svg]:h-12 [&>svg]:w-12">
          {icon}
        </div>
      </div>

      <h3 className="font-display text-xl font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-mag-muted">{description}</p>

      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex items-center rounded-lg bg-gold-400 px-5 py-2.5 text-sm font-semibold text-mag-black transition-colors hover:bg-gold-400/90"
        >
          {actionLabel}
        </Link>
      )}
    </motion.div>
  );
}
