"use client";

import { motion } from "framer-motion";

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

export default function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  );
}
