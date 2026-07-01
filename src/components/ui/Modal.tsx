'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { useFocusTrap } from '@/lib/hooks/useFocusTrap';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(isOpen, panelRef);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title || 'Dialog'}
            tabIndex={-1}
            className={cn(
              'relative bg-mag-dark border border-mag-border rounded-xl p-6 max-w-lg w-full mx-4 focus:outline-none',
              className
            )}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-bold text-white">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="text-mag-muted hover:text-white transition-colors p-1 -mr-1"
                  aria-label="Close modal"
                >
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Close button when no title */}
            {!title && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-mag-muted hover:text-white transition-colors p-1"
                aria-label="Close modal"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}

            {/* Content */}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export { Modal, type ModalProps };
