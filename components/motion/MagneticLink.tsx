"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type MagneticLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
};

export function MagneticLink({ href, children, className, external }: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * 0.08;
    const dy = (e.clientY - (r.top + r.height / 2)) * 0.08;
    setPos({ x: dx, y: dy });
  };

  const onLeave = () => setPos({ x: 0, y: 0 });

  const style = reduce ? undefined : { transform: `translate(${pos.x}px, ${pos.y}px)` };

  if (external) {
    return (
      <a
        ref={ref}
        href={href}
        className={cn("inline-block transition-transform duration-150", className)}
        style={style}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      ref={ref}
      href={href}
      className={cn("inline-block transition-transform duration-150", className)}
      style={style}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </Link>
  );
}
