"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useIsMobile } from "@/lib/motion";
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
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  if (reduce || mobile) {
    return <div className={cn("relative", className)}>{children}</div>;
  }

  /* `relative` fixes Framer warning: scroll offset needs a positioned target. */
  return (
    <motion.div ref={ref} style={{ y }} className={cn("relative will-change-transform", className)}>
      {children}
    </motion.div>
  );
}
