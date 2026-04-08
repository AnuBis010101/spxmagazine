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
                hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
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
