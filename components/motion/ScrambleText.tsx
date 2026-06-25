"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%";
const RESOLVE_WINDOW = 700; // ms for the full word to resolve
const TICK = 40; // ms between scramble frames

/**
 * Letters rapidly cycle through random characters before resolving to the final
 * word. Each character resolves at time = (charIndex / text.length) * 700ms.
 * Triggers when `trigger` flips to true. Resets to the original text when
 * `trigger` goes false (no re-scramble on quick re-entry).
 */
export function ScrambleText({
  text,
  trigger,
  delay = 0,
  className,
}: {
  text: string;
  trigger: boolean;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (reduce) {
      setDisplay(text);
      return;
    }

    const clear = () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    if (!trigger) {
      // Scroll out: reset to original text immediately, no re-scramble.
      clear();
      setDisplay(text);
      return;
    }

    clear();
    timeoutRef.current = setTimeout(() => {
      const start = performance.now();
      intervalRef.current = setInterval(() => {
        const elapsed = performance.now() - start;
        let out = "";
        let allResolved = true;
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (ch === " ") {
            out += " ";
            continue;
          }
          const resolveAt = (i / text.length) * RESOLVE_WINDOW;
          if (elapsed >= resolveAt) {
            out += ch;
          } else {
            out += POOL[Math.floor(Math.random() * POOL.length)];
            allResolved = false;
          }
        }
        setDisplay(out);
        if (allResolved) {
          setDisplay(text);
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }, TICK);
    }, delay);

    return clear;
  }, [trigger, text, delay, reduce]);

  return <span className={className}>{display}</span>;
}
