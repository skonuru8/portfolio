"use client";

import { useRef, useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion, useIsMobile } from "@/lib/motion";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type PressureDollyZoomProps = {
  children: ReactNode;
  className?: string;
  /** Label for screen readers; pressure moment */
  label: string;
};

/**
 * DOM “dolly” read: background gradient scales up while the card body scales down slightly
 * as you scroll through the transformation block (desktop only; simplified on mobile).
 */
export function PressureDollyZoom({ children, className, label }: PressureDollyZoomProps) {
  const root = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const fg = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();

  useEffect(() => {
    if (!root.current || !bg.current || !fg.current || reduced || mobile) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bg.current,
        { scale: 1, opacity: 0.35 },
        {
          scale: 1.45,
          opacity: 0.95,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 85%",
            end: "bottom 40%",
            scrub: 0.6,
          },
        },
      );
      gsap.fromTo(
        fg.current,
        { scale: 1 },
        {
          scale: 0.94,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 85%",
            end: "bottom 40%",
            scrub: 0.6,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [reduced, mobile]);

  return (
    <div ref={root} className={cn("relative overflow-visible", className)}>
      <span className="sr-only">{label}</span>
      <div
        ref={bg}
        className="pointer-events-none absolute -inset-10 z-0 rounded-3xl bg-gradient-to-br from-accent-soft via-accent/10 to-signal-soft opacity-70 blur-3xl"
        aria-hidden
      />
      <div ref={fg} className="relative z-10">
        {children}
      </div>
    </div>
  );
}
