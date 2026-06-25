"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useDeviceTier } from "@/lib/device-tier";
import { TiltCard } from "@/components/motion/TiltCard";

export type MetricCardProps = {
  value: string;
  label: string;
  description: string;
  linkedTo?: string;
};

/** Parse "85%", "$200K", "100+ GB" into prefix / number / suffix. */
function parseValue(val: string): { prefix: string; num: number; suffix: string } | null {
  const match = val.match(/^([^0-9]*)(\d+(?:\.\d+)?)([^0-9]*)$/);
  if (!match) return null;
  return { prefix: match[1], num: parseFloat(match[2]), suffix: match[3] };
}

/** Approximate cubic-bezier(0.22, 1, 0.36, 1). */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function MetricCard({ value, label, description, linkedTo }: MetricCardProps) {
  const reduce = useReducedMotion();
  const tier = useDeviceTier();
  const valueRef = useRef<HTMLParagraphElement>(null);
  const inViewRef = useRef<HTMLDivElement>(null);
  const inView = useInView(inViewRef, { amount: 0.7 });
  const currentNum = useRef(0);
  const rafRef = useRef(0);
  const parsed = parseValue(value);

  useEffect(() => {
    if (reduce || !parsed) return;
    const el = valueRef.current;
    if (!el) return;

    const { prefix, num, suffix } = parsed;

    // Tier B: one-shot count-up only. No count-down on leave; no lime flash.
    // Tier A: bidirectional count-up/down with lime flash on completion.
    const isLean = tier === "b";
    const target = inView ? num : isLean ? undefined : 0;

    // Tier B: skip the count-down leg entirely
    if (target === undefined) return;

    const start = currentNum.current;
    const distance = target - start;
    if (distance === 0) return;

    const duration = 800;
    const t0 = performance.now();
    cancelAnimationFrame(rafRef.current);

    const tick = (now: number) => {
      if (document.visibilityState === "hidden") {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min((now - t0) / duration, 1);
      const cur = start + distance * easeOut(t);
      currentNum.current = cur;
      el.textContent = `${prefix}${Math.round(cur)}${suffix}`;

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        currentNum.current = target;
        if (target === num) {
          el.textContent = value;
          // Tier A only: lime glow flash on count-up completion
          if (!isLean) {
            el.style.textShadow = "0 0 12px var(--lock-glow)";
            setTimeout(() => { el.style.textShadow = ""; }, 300);
          }
        } else {
          el.textContent = `${prefix}0${suffix}`;
        }
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, tier]);

  const cardClass = cn(
    "metric-card-edge group card-hover relative block h-full overflow-hidden rounded-xl border border-line bg-panel/80 p-6",
    "hover:bg-panel",
    linkedTo && "focus-within:ring-2 focus-within:ring-signal",
  );

  // Reduced motion: final value statically. Lean/animated: start at 0 — effect counts up.
  const initialDisplay = reduce ? value : parsed ? `${parsed.prefix}0${parsed.suffix}` : value;

  const inner = (
    <>
      <p ref={valueRef} className="font-display text-4xl text-accent md:text-5xl">
        {initialDisplay}
      </p>
      <p className="mt-2 font-mono-label text-[10px] uppercase tracking-[0.18em] text-signal">
        {label}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{description}</p>
      {linkedTo ? (
        <p className="mt-4 font-mono-label text-[10px] uppercase tracking-wider text-ink-muted">
          Open case study →
        </p>
      ) : null}
    </>
  );

  if (linkedTo) {
    return (
      <div ref={inViewRef}>
        <TiltCard>
          <Link
            href={linkedTo}
            className={cn(cardClass, "focus-ring outline-none")}
          >
            {inner}
          </Link>
        </TiltCard>
      </div>
    );
  }

  return (
    <div ref={inViewRef}>
      <TiltCard className={cardClass}>{inner}</TiltCard>
    </div>
  );
}
