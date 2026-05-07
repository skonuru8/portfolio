"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";

const LABELS = ["Bottleneck", "Cause", "Constraint", "Decision", "Measured result"];

export function ThinkingTrace() {
  const reduce = useReducedMotion();
  const pathRef = useRef<SVGPathElement>(null);

  if (reduce) {
    return (
      <div className="mb-12 hidden max-w-xl md:block" aria-hidden>
        <ol className="space-y-2 border-l border-signal/40 pl-4">
          {LABELS.map((l) => (
            <li key={l} className="font-mono-label text-xs text-ink-muted">
              {l}
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div className="mb-12 hidden max-w-xl md:block">
      <p className="sr-only">Decision trace: bottleneck through measured result.</p>
      <svg
        viewBox="0 0 120 220"
        className="h-52 w-24 text-signal"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        aria-hidden
      >
        <motion.path
          ref={pathRef}
          d="M 60 8 L 60 200"
          initial={{ pathLength: 0, opacity: 0.4 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ pathLength: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.4 } }}
        />
        {LABELS.map((_, i) => {
          const y = 12 + i * 42;
          return (
            <circle key={i} cx="60" cy={y} r="3" className="fill-bg stroke-signal" strokeWidth="1" />
          );
        })}
      </svg>
      <ol className="mt-2 space-y-1 pl-1">
        {LABELS.map((l, i) => (
          <li key={l} className="font-mono-label text-[10px] uppercase tracking-wider text-ink-muted">
            {String(i + 1).padStart(2, "0")} · {l}
          </li>
        ))}
      </ol>
    </div>
  );
}
