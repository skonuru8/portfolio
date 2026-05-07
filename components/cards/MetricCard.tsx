"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type MetricCardProps = {
  value: string;
  label: string;
  description: string;
  linkedTo?: string;
};

/** Parse a metric string like "85%", "$200K", "100+ GB" into prefix / number / suffix. */
function parseValue(val: string): { prefix: string; num: number; suffix: string } | null {
  const match = val.match(/^([^0-9]*)(\d+(?:\.\d+)?)([^0-9]*)$/);
  if (!match) return null;
  return { prefix: match[1], num: parseFloat(match[2]), suffix: match[3] };
}

/** Approximate cubic-bezier(0.22, 1, 0.36, 1) easing for the count-up. */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Updates `--mx` / `--my` on the card element for the ::after cursor mini-aura. GPU-only — no React state. */
function onMouseMove(e: React.MouseEvent<HTMLElement>) {
  const target = e.currentTarget;
  const rect = target.getBoundingClientRect();
  target.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  target.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

export function MetricCard({ value, label, description, linkedTo }: MetricCardProps) {
  const reduce = useReducedMotion();
  const valueRef = useRef<HTMLParagraphElement>(null);
  const hasPlayed = useRef(false);

  const parsed = parseValue(value);

  // Count-up animation — triggers once when the value element enters the viewport.
  // Reduced motion: skip entirely (final value already rendered in JSX).
  useEffect(() => {
    if (reduce || !parsed) return;
    const el = valueRef.current;
    if (!el) return;

    const { prefix, num, suffix } = parsed;
    const duration = 800;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || hasPlayed.current) return;
        hasPlayed.current = true;
        observer.disconnect();

        const start = performance.now();

        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const current = Math.round(easeOut(t) * num);
          el.textContent = `${prefix}${current}${suffix}`;

          if (t < 1) {
            requestAnimationFrame(tick);
          } else {
            // Settle on exact final value, then flash --lock glow once
            el.textContent = value;
            el.style.textShadow = "0 0 12px var(--lock-glow)";
            setTimeout(() => {
              el.style.textShadow = "";
            }, 300);
          }
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.7 },
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  const cardClass = cn(
    "metric-card-edge metric-card-aura group card-hover relative block h-full overflow-hidden rounded-xl border border-line bg-panel/80 p-6",
    "hover:bg-panel",
    linkedTo && "focus-within:ring-2 focus-within:ring-signal",
  );

  const inner = (
    <>
      <p ref={valueRef} className="font-display text-4xl text-accent md:text-5xl">
        {value}
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
      <Link
        href={linkedTo}
        className={cn(cardClass, "focus-ring outline-none")}
        onMouseMove={onMouseMove as React.MouseEventHandler<HTMLAnchorElement>}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div
      className={cardClass}
      onMouseMove={onMouseMove as React.MouseEventHandler<HTMLDivElement>}
    >
      {inner}
    </div>
  );
}
