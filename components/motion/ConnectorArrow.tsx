"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/**
 * A thin cyan SVG arrow that draws itself left-to-right when it enters the viewport.
 * Rendered only on md+ (hidden on mobile where panels stack vertically).
 * `once: true` — draws once per page load, not per scroll-back.
 */
export function ConnectorArrow() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });
  const reduce = useReducedMotion();

  // Reduced motion: render fully drawn immediately
  const drawn = reduce || inView;
  const lineTransition = reduce
    ? { duration: 0 }
    : { duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };
  const arrowTransition = reduce
    ? { duration: 0 }
    : { delay: 0.7, duration: 0.25, ease: "easeOut" as const };

  return (
    <svg
      ref={ref}
      // viewBox spans 0-100 x-axis; y centered at 4 with total height 8
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
        // vector-effect keeps stroke-width consistent when SVG is scaled
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0.45 }}
        animate={drawn ? { pathLength: 1, opacity: 0.45 } : {}}
        transition={lineTransition}
      />
      {/* Filled arrowhead — fades in after line completes */}
      <motion.path
        d="M 92 1 L 100 4 L 92 7 Z"
        fill="var(--signal)"
        initial={{ opacity: 0 }}
        animate={drawn ? { opacity: 0.45 } : {}}
        transition={arrowTransition}
      />
    </svg>
  );
}
