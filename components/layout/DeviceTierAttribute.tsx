"use client";

import { useEffect } from "react";
import { useDeviceTier } from "@/lib/device-tier";

/**
 * Writes the resolved device tier as `data-tier="a|b|c"` on the <html> element.
 * This enables CSS-level Tier B overrides via `html[data-tier="b"] ...` selectors,
 * without needing to thread the tier value into every component.
 *
 * Renders no DOM — purely a side-effect component.
 */
export function DeviceTierAttribute() {
  const tier = useDeviceTier();

  useEffect(() => {
    document.documentElement.dataset.tier = tier;
  }, [tier]);

  return null;
}
