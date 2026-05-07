"use client";

import { useRef, useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion, useIsMobile } from "@/lib/motion";
import { useDeviceTier } from "@/lib/device-tier";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type DollyVariant = "pressure-dolly" | "noise-collapse" | "risk-to-control";

const presets: Record<
  DollyVariant,
  { bgScaleEnd: number; fgScaleEnd: number; opacityEnd: number; glowClass: string }
> = {
  "pressure-dolly": {
    bgScaleEnd: 1.52,
    fgScaleEnd: 0.93,
    opacityEnd: 0.98,
    glowClass:
      "from-accent-soft via-deep/25 to-signal-soft bg-gradient-to-br opacity-80",
  },
  "noise-collapse": {
    bgScaleEnd: 1.38,
    fgScaleEnd: 0.96,
    opacityEnd: 0.88,
    glowClass:
      "from-signal-soft via-accent/20 to-deep-soft bg-gradient-to-tr opacity-75",
  },
  "risk-to-control": {
    bgScaleEnd: 1.45,
    fgScaleEnd: 0.95,
    opacityEnd: 0.95,
    glowClass:
      "from-deep-soft via-signal/15 to-accent-soft bg-gradient-to-bl opacity-[0.85]",
  },
};

type PressureDollyZoomProps = {
  children: ReactNode;
  className?: string;
  label: string;
  variant?: DollyVariant;
};

export function PressureDollyZoom({
  children,
  className,
  label,
  variant = "pressure-dolly",
}: PressureDollyZoomProps) {
  const root = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const fg = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const tier = useDeviceTier();
  const p = presets[variant];

  useEffect(() => {
    if (!root.current || !bg.current || !fg.current || reduced || mobile) return;

    const ctx = gsap.context(() => {
      if (tier === "b") {
        // Tier B: snap-based — animate once on enter, reverse on leave-back.
        // No per-scroll-pixel work (no scrub).
        const snapST = {
          trigger: root.current,
          start: "top 85%",
          end: "bottom 40%",
          toggleActions: "play none none reverse" as const,
        };
        gsap.fromTo(bg.current, { scale: 1, opacity: 0.32 }, {
          scale: p.bgScaleEnd, opacity: p.opacityEnd,
          ease: "power2.out", duration: 0.6, scrollTrigger: snapST,
        });
        gsap.fromTo(fg.current, { scale: 1 }, {
          scale: p.fgScaleEnd,
          ease: "power2.out", duration: 0.6, scrollTrigger: snapST,
        });
      } else {
        // Tier A: full scrub — continuously driven by scroll position
        const scrubST = {
          trigger: root.current,
          start: "top 85%",
          end: "bottom 40%",
          scrub: 0.6,
        };
        gsap.fromTo(bg.current, { scale: 1, opacity: 0.32 }, {
          scale: p.bgScaleEnd, opacity: p.opacityEnd, ease: "none", scrollTrigger: scrubST,
        });
        gsap.fromTo(fg.current, { scale: 1 }, {
          scale: p.fgScaleEnd, ease: "none", scrollTrigger: scrubST,
        });
      }
    }, root);

    return () => ctx.revert();
  }, [reduced, mobile, tier, variant]);

  return (
    <div ref={root} className={cn("relative overflow-visible", className)}>
      <span className="sr-only">{label}</span>
      <div
        ref={bg}
        className={cn(
          "pointer-events-none absolute -inset-10 z-0 rounded-3xl blur-3xl",
          p.glowClass,
        )}
        aria-hidden
      />
      <div ref={fg} className="relative z-10">
        {children}
      </div>
    </div>
  );
}
