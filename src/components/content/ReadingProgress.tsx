'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [hasShownComplete, setHasShownComplete] = useState(false);

  // Seed the completion-burst particles once, so scroll-driven re-renders while
  // the burst is visible don't re-randomise (and jitter) their trajectories.
  const burstParticles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        size: 3 + Math.random() * 4,
        color: i % 2 === 0 ? '#D4AF37' : '#E1C872',
        x: -(Math.random() * 200 + 50),
        y: Math.random() * 80 + 10,
        duration: 0.8 + Math.random() * 0.5,
        delay: Math.random() * 0.2,
      })),
    []
  );

  const updateProgress = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const p = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    setProgress(p);

    if (p >= 98 && !hasShownComplete) {
      setCompleted(true);
      setHasShownComplete(true);
      setTimeout(() => setCompleted(false), 3000);
    }
  }, [hasShownComplete]);

  useEffect(() => {
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener('scroll', updateProgress);
  }, [updateProgress]);

  return (
    <>
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent pointer-events-none">
        <div
          className="h-full relative"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #8C6F22, #D4AF37, #E1C872, #D4AF37)',
            backgroundSize: '200% 100%',
            animation: 'reading-shimmer 2s ease-in-out infinite',
            boxShadow: progress > 0 ? '0 0 8px rgba(212,175,55,0.6), 0 0 20px rgba(212,175,55,0.3)' : 'none',
            transition: 'width 0.15s linear',
          }}
        >
          {/* Glow tip */}
          {progress > 0 && progress < 100 && (
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(212,175,55,0.8) 0%, transparent 70%)',
                transform: 'translate(50%, -50%)',
              }}
            />
          )}
        </div>
      </div>

      {/* Completion burst */}
      <AnimatePresence>
        {completed && (
          <motion.div
            className="fixed top-0 left-0 right-0 z-[59] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Gold shimmer wave */}
            <motion.div
              className="h-[2px] w-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: 'linear-gradient(90deg, transparent, #D4AF37, #E1C872, #D4AF37, transparent)',
                transformOrigin: 'left',
                boxShadow: '0 0 20px rgba(212,175,55,0.5)',
              }}
            />

            {/* Particle burst from the right edge */}
            {burstParticles.map((p, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: p.size,
                  height: p.size,
                  background: p.color,
                  right: 0,
                  top: 0,
                }}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{ x: p.x, y: p.y, opacity: 0 }}
                transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes reading-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </>
  );
}
