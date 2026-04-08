"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  once?: boolean;
  className?: string;
}

export default function StaggerContainer({
  children,
  staggerDelay = 0.1,
  once = true,
  className,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
