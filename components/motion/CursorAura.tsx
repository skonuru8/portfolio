"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** Lerp coefficient. Lower = slushier. Default 0.08. */
  ease?: number;
  /** Aura diameter in px. Default 600. */
  size?: number;
  /** Override gradient. Default cyan→indigo. */
  gradient?: string;
  /** Restrict to a section by passing a ref; otherwise tracks the whole window. */
  sectionRef?: React.RefObject<HTMLElement>;
};

export function CursorAura({
  ease = 0.08,
  size = 600,
  gradient = "radial-gradient(circle, rgba(56,189,248,0.28), rgba(99,102,241,0.14) 40%, transparent 70%)",
  sectionRef,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const visible = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Skip on touch-only devices (no fine hover pointer)
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (!visible.current && ref.current) {
        ref.current.style.opacity = "1";
        visible.current = true;
      }
    };

    const onLeave = () => {
      if (ref.current) ref.current.style.opacity = "0";
      visible.current = false;
    };

    let raf = 0;
    const tick = () => {
      // Pause animation when tab is hidden
      if (document.visibilityState === "hidden") {
        raf = requestAnimationFrame(tick);
        return;
      }
      current.current.x += (target.current.x - current.current.x) * ease;
      current.current.y += (target.current.y - current.current.y) * ease;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    const el = sectionRef?.current ?? window;
    el.addEventListener("mousemove", onMove as EventListener);
    el.addEventListener("mouseleave", onLeave as EventListener);
    raf = requestAnimationFrame(tick);

    return () => {
      el.removeEventListener("mousemove", onMove as EventListener);
      el.removeEventListener("mouseleave", onLeave as EventListener);
      cancelAnimationFrame(raf);
    };
  }, [ease, sectionRef]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 rounded-full"
      style={{
        width: size,
        height: size,
        background: gradient,
        filter: "blur(60px)",
        mixBlendMode: "screen",
        zIndex: 1,
        opacity: 0,
        transition: "opacity 400ms ease",
        willChange: "transform",
      }}
    />
  );
}
