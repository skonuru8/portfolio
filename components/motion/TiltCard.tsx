"use client";

import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { useDeviceTier } from "@/lib/device-tier";

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/**
 * 3D card tilt with a glare spot tracking the cursor across the card face.
 * The card springs flat on mouse-leave. Updates the DOM directly via refs to
 * avoid re-renders on every mouse move.
 *
 * Guards: tier b/c → plain wrapper, reduced-motion → plain wrapper.
 */
export function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const tier = useDeviceTier();
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  if (tier !== "a" || reduce) {
    return <div className={className}>{children}</div>;
  }

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 → 1
    const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1 → 1

    const rotateX = clamp(normY * -12, -12, 12);
    const rotateY = clamp(normX * 12, -12, 12);
    const glareX = normX * 50 + 50;
    const glareY = normY * 50 + 50;

    card.style.transition = "transform 0.1s ease-out";
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    const glare = glareRef.current;
    if (glare) {
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.18) 0%, transparent 60%)`;
    }
  };

  const onMouseLeave = () => {
    const card = cardRef.current;
    if (card) {
      card.style.transition = "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)";
      card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
    }
    const glare = glareRef.current;
    if (glare) {
      glare.style.background =
        "radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 0%, transparent 60%)";
    }
  };

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ transformStyle: "preserve-3d", position: "relative" }}
    >
      {children}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
          borderRadius: "inherit",
          zIndex: 2,
        }}
      >
        <div ref={glareRef} style={{ position: "absolute", inset: 0 }} />
      </div>
    </div>
  );
}
