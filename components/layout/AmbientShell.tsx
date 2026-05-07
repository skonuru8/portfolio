import type { ReactNode } from "react";

/**
 * Faint global depth: grid + slow pan. Content sits above via z-index on main.
 */
export function AmbientShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-full">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(56,189,248,0.08),transparent_50%),radial-gradient(ellipse_80%_60%_at_100%_50%,rgba(99,102,241,0.06),transparent_45%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.35] ambient-shift grid-lines"
        aria-hidden
      />
      {children}
    </div>
  );
}
