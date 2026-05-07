"use client";

import { useEffect, useRef } from "react";
import { useDeviceTier } from "@/lib/device-tier";

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
  gradient = "radial-gradient(circle, rgba(56,189,248,0.42), rgba(99,102,241,0.22) 40%, transparent 70%)",
  sectionRef,
}: Props) {
  const tier = useDeviceTier();
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const visible = useRef(false);

  useEffect(() => {
    // Tier A only: mix-blend-mode: screen is one of the most expensive composite
    // operations in the browser. Tier B/C get no aura — no DOM node, no RAF.
    if (tier !== "a") return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
  }, [tier, ease, sectionRef]);

  // Tier B/C: no DOM node at all — no compositor layer, no memory cost.
  if (tier !== "a") return null;

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
