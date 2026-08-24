"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface TextRevealProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  staggerDelay?: number;
  className?: string;
  wordClassName?: string;
  once?: boolean;
}

export default function TextReveal({
  text,
  as: Tag = "h1",
  staggerDelay = 0.08,
  className,
  wordClassName,
  once = true,
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-50px" });
  const words = text.split(" ");

  return (
    <div ref={ref}>
      <Tag className={className}>
        <motion.span
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: staggerDelay } },
          }}
          style={{ display: "flex", flexWrap: "wrap", gap: "0.25em" }}
        >
          {words.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              className={wordClassName}
              variants={{
                /* No blur. This runs per word, so a headline animated one
                   filtered layer per word simultaneously as it scrolled in —
                   the most expensive version of the defect already removed
                   from the hero and header. Travel plus fade reads the same. */
                hidden: { opacity: 0, y: 22 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
                },
              }}
              style={{ display: "inline-block" }}
            >
              {word}
            </motion.span>
          ))}
        </motion.span>
      </Tag>
    </div>
  );
}
