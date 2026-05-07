"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useIsMobile } from "@/lib/motion";
import { useDeviceTier } from "@/lib/device-tier";
import { cn } from "@/lib/utils";

type ParallaxLayerProps = {
  children: React.ReactNode;
  className?: string;
  /** Vertical shift in px at scroll extremes (larger = easier to notice). */
  offset?: number;
};

export function ParallaxLayer({ children, className, offset = 64 }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mobile = useIsMobile();
  const tier = useDeviceTier();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  // Tier B/C and mobile: skip the useScroll math — render a plain positioned div.
  if (reduce || mobile || tier === "b") {
    return <div className={cn("relative", className)}>{children}</div>;
  }

  /* `relative` fixes Framer warning: scroll offset needs a positioned target. */
  return (
    <motion.div ref={ref} style={{ y }} className={cn("relative will-change-transform", className)}>
      {children}
    </motion.div>
  );
}
