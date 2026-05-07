"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useDeviceTier } from "@/lib/device-tier";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

/**
 * Tier A: bidirectional — fades up on enter, fades back down on leave (once: false).
 * Tier B: one-shot — fades up on enter only (once: true). Halves animation count on scroll-back.
 * Tier C: no animation — renders children in a plain div.
 *
 * To revert ALL tiers to one-shot, flip `once: false` → `once: true` on the Tier A branch.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduce = useReducedMotion();
  const tier = useDeviceTier();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        // Tier A: bidirectional (reverse on scroll-up)
        // Tier B: one-shot (fire once, no reverse — halves active animations when scrolling back)
        once: tier !== "a",
        margin: "-40px",
      }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
