/**
 * A 64px gradient band placed between page sections.
 * Uses negative vertical margins (-32px each side) so it overlaps into section padding
 * without adding extra whitespace — net height contribution is zero.
 * The gradient creates a subtle darkening at section boundaries, removing the
 * "stacked cards" feel without changing any section layout or content.
 */
export function SectionDivider() {
  return (
    <div
      aria-hidden
      className="pointer-events-none relative -my-8 h-16 w-full"
      style={{
        background:
          "linear-gradient(to bottom, transparent 0%, rgba(2,6,23,0.45) 50%, transparent 100%)",
        zIndex: 5,
      }}
    />
  );
}
