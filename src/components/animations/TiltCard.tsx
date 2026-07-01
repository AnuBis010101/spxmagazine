"use client";

import { useRef, useState, useEffect, useCallback, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltMax?: number;
}

export default function TiltCard({ children, className, tiltMax = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  // Glare driven by motion values (no per-frame React re-render).
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useMotionValue(0);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(212,175,55,0.3) 0%, transparent 60%)`;

  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    rotateX.set((y - 0.5) * -tiltMax * 2);
    rotateY.set((x - 0.5) * tiltMax * 2);
    glareX.set(x * 100);
    glareY.set(y * 100);
    glareOpacity.set(0.15);
  }, [rotateX, rotateY, tiltMax, glareX, glareY, glareOpacity]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    glareOpacity.set(0);
  }, [rotateX, rotateY, glareOpacity]);

  if (isTouch) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 800,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className ?? ""}`}
    >
      {children}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none z-10"
        style={{
          opacity: glareOpacity,
          background: glareBackground,
        }}
      />
    </motion.div>
  );
}
