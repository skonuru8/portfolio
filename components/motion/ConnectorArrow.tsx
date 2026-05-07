"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/**
 * Thin cyan SVG arrow that draws itself left-to-right when in viewport
 * and retracts when leaving. Hidden on mobile (md:block).
 *
 * - Reduced motion: rendered fully drawn, no animation.
 * - Bidirectional: line + arrowhead reverse on scroll-up.
 * - Symmetric timing (no delay on reverse) so the retract feels snappy, not laggy.
 */
export function ConnectorArrow() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: false, margin: "-5% 0px" });
  const reduce = useReducedMotion();

  // Reduced motion: render fully drawn immediately, ignore viewport
  const drawn = reduce || inView;

  // Asymmetric easing: arrowhead delays only on enter, not on exit
  const lineTransition = reduce
    ? { duration: 0 }
    : { duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

  const arrowTransition = reduce
    ? { duration: 0 }
    : {
        duration: 0.25,
        ease: "easeOut" as const,
        // delay only when entering (drawn becoming true); no delay on exit
        delay: drawn ? 0.7 : 0,
      };

  return (
    <svg
      ref={ref}
      viewBox="0 0 100 8"
      preserveAspectRatio="none"
      className="mt-3 mb-1 hidden h-2 w-full md:block"
      fill="none"
      aria-hidden
    >
      {/* Main line */}
      <motion.path
        d="M 0 4 L 92 4"
        stroke="var(--signal)"
        strokeWidth={1.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0.45 }}
        animate={{ pathLength: drawn ? 1 : 0, opacity: 0.45 }}
        transition={lineTransition}
      />
      {/* Filled arrowhead */}
      <motion.path
        d="M 92 1 L 100 4 L 92 7 Z"
        fill="var(--signal)"
        initial={{ opacity: 0 }}
        animate={{ opacity: drawn ? 0.45 : 0 }}
        transition={arrowTransition}
      />
    </svg>
  );
}
