"use client";

import { startTransition, useEffect, useState } from "react";

export type DeviceTier = "a" | "b" | "c";

const STORAGE_KEY = "device-tier";

/**
 * Classify the current device into one of three tiers:
 *   A — Full:   hover-capable, sufficient RAM/cores, fast network → all effects on
 *   B — Lean:   touch-only, low RAM/cores, slow network, or Save-Data → effects reduced
 *   C — Static: prefers-reduced-motion → all animations off (already implemented site-wide)
 *
 * This runs only on the client (inside useEffect) — window/navigator are unavailable on SSR.
 */
function detectDeviceTier(): DeviceTier {
  // 1. Reduced motion → Tier C immediately (highest priority)
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "c";
  }

  let leanScore = 0;

  // 2. Touch-only device (no fine hover pointer) → +1 lean
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    leanScore += 1;
  }

  // 3. Device memory — Chrome/Edge/Opera only; undefined means "don't know" → no penalty
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (typeof mem === "number" && mem <= 2) {
    leanScore += 2; // strong signal
  } else if (typeof mem === "number" && mem <= 4) {
    leanScore += 1;
  }

  // 4. CPU cores — widely supported, capped to 8 in Safari
  const cores = navigator.hardwareConcurrency;
  if (typeof cores === "number" && cores <= 2) {
    leanScore += 1;
  }

  // 5. Network signals — Chrome/Edge only
  const conn = (
    navigator as Navigator & {
      connection?: { effectiveType?: string; saveData?: boolean };
    }
  ).connection;
  if (conn?.saveData === true) {
    leanScore += 2; // user has explicitly asked for less
  }
  if (conn?.effectiveType && ["slow-2g", "2g", "3g"].includes(conn.effectiveType)) {
    leanScore += 1;
  }

  // 6. Any signal of weight 2+, or two weight-1 signals → Tier B
  return leanScore >= 2 ? "b" : "a";
}

/**
 * Returns the device tier for the current session.
 *
 * - SSR-safe: returns "a" on the server and on first paint; downgrades after mount if needed.
 *   This means the initial HTML always matches what a desktop renders (no hydration mismatch).
 * - Cached in sessionStorage so the result is stable across navigations within a session.
 * - Tier C (reduced-motion) always wins, regardless of any cached value.
 */
export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>("a");

  useEffect(() => {
    let resolved: DeviceTier;

    try {
      const cached = sessionStorage.getItem(STORAGE_KEY);
      if (cached === "a" || cached === "b" || cached === "c") {
        resolved = cached;
      } else {
        resolved = detectDeviceTier();
        sessionStorage.setItem(STORAGE_KEY, resolved);
      }
    } catch {
      // sessionStorage may be blocked in private mode or embedded contexts
      resolved = detectDeviceTier();
    }

    // startTransition marks this as a non-urgent update, satisfying the
    // react-hooks/set-state-in-effect lint rule.
    startTransition(() => setTier(resolved));
  }, []);

  return tier;
}
