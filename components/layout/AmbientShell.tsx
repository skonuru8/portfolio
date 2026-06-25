import type { ReactNode } from "react";
import { FluidCursor } from "@/components/motion/FluidCursor";
import { AnimatedGrid } from "@/components/motion/AnimatedGrid";

/**
 * Faint global depth: animated canvas grid + slow pan. Content sits above via z-index on main.
 * FluidCursor is mounted here so it's a single global instance, visible across
 * every section (position: fixed, tracks window mousemove).
 */
export function AmbientShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-full">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(56,189,248,0.08),transparent_50%),radial-gradient(ellipse_80%_60%_at_100%_50%,rgba(99,102,241,0.06),transparent_45%)]"
        aria-hidden
      />
      <AnimatedGrid />
      <FluidCursor />
      {children}
    </div>
  );
}
