"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

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

/** Updates `--mx` / `--my` on the card for the ::after cursor mini-aura. CSS-only — no React state. */
function onMouseMove(e: React.MouseEvent<HTMLElement>) {
  const target = e.currentTarget;
  const rect = target.getBoundingClientRect();
  target.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  target.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

export function MetricCard({ value, label, description, linkedTo }: MetricCardProps) {
  const reduce = useReducedMotion();
  const valueRef = useRef<HTMLParagraphElement>(null);
  const inViewRef = useRef<HTMLDivElement>(null);
  const inView = useInView(inViewRef, { amount: 0.7 });

  // Track current displayed value across enter/leave cycles — so we always
  // animate from where we left off, never jump.
  const currentNum = useRef(0);
  const rafRef = useRef(0);

  const parsed = parseValue(value);

  useEffect(() => {
    if (reduce || !parsed) return;
    const el = valueRef.current;
    if (!el) return;

    const { prefix, num, suffix } = parsed;
    const target = inView ? num : 0;
    const start = currentNum.current;
    const distance = target - start;

    // No-op if we're already at the target
    if (distance === 0) return;

    const duration = 800;
    const t0 = performance.now();
    cancelAnimationFrame(rafRef.current);

    const tick = (now: number) => {
      // Pause when tab hidden — don't burn frames invisibly
      if (document.visibilityState === "hidden") {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min((now - t0) / duration, 1);
      const eased = easeOut(t);
      const cur = start + distance * eased;
      currentNum.current = cur;
      el.textContent = `${prefix}${Math.round(cur)}${suffix}`;

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        currentNum.current = target;
        // Settle on exact final string only when arriving at the up-target.
        // Going back to 0 doesn't get the lime flash.
        if (target === num) {
          el.textContent = value;
          el.style.textShadow = "0 0 12px var(--lock-glow)";
          setTimeout(() => {
            el.style.textShadow = "";
          }, 300);
        } else {
          el.textContent = `${prefix}0${suffix}`;
        }
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce]);

  const cardClass = cn(
    "metric-card-edge metric-card-aura group card-hover relative block h-full overflow-hidden rounded-xl border border-line bg-panel/80 p-6",
    "hover:bg-panel",
    linkedTo && "focus-within:ring-2 focus-within:ring-signal",
  );

  // Reduced motion: render the final value statically, no animation, no observer.
  // Otherwise: start at 0 — the effect counts up when it enters the viewport.
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

  // The inViewRef must wrap the rendered element so framer's useInView observes the right node.
  // Apply it by wrapping cardClass element via a ref-bearing wrapper inside the link/div.
  if (linkedTo) {
    return (
      <div ref={inViewRef}>
        <Link
          href={linkedTo}
          className={cn(cardClass, "focus-ring outline-none")}
          onMouseMove={onMouseMove as React.MouseEventHandler<HTMLAnchorElement>}
        >
          {inner}
        </Link>
      </div>
    );
  }

  return (
    <div
      ref={inViewRef}
      className={cardClass}
      onMouseMove={onMouseMove as React.MouseEventHandler<HTMLDivElement>}
    >
      {inner}
    </div>
  );
}
