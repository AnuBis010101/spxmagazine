"use client";

import { useRef, useState, useEffect, useCallback, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

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

  const [isTouch, setIsTouch] = useState(false);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

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
    setGlare({ x: x * 100, y: y * 100, opacity: 0.15 });
  }, [rotateX, rotateY, tiltMax]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  }, [rotateX, rotateY]);

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
      <div
        className="absolute inset-0 rounded-xl pointer-events-none z-10 transition-opacity duration-300"
        style={{
          opacity: glare.opacity,
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(212,175,55,0.3) 0%, transparent 60%)`,
        }}
      />
    </motion.div>
  );
}
