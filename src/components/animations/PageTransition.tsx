"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [nativeVT, setNativeVT] = useState(false);

  useEffect(() => {
    setNativeVT(typeof document !== "undefined" && "startViewTransition" in document);
  }, []);

  // When the browser supports View Transitions, ViewTransitions.tsx drives every
  // navigation natively (gold wipe + shared cover morph). Running the Framer
  // fade too would double-animate and, worse, let the VT snapshot a mid-fade
  // (transparent) page — so we render children plainly and let the native
  // transition own it. Browsers without the API keep the Framer fallback.
  if (nativeVT) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}
