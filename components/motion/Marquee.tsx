"use client";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "@/lib/theme";

const ITEMS = [
  "Available for work",
  "Backend Engineer",
  "Open to opportunities",
  "Java · Spring Boot",
  "Node.js · TypeScript",
  "React · Next.js",
  "AWS · Azure · GCP",
  "Cloud Native",
  "Production Systems",
  "API Design",
];

export function Marquee() {
  const reduce = useReducedMotion();
  const { theme } = useTheme();

  const text = ITEMS.join("  ·  ");
  const repeated = `${text}  ·  ${text}`;

  if (reduce) {
    return (
      <div className="border-y border-line py-3 overflow-hidden">
        <p className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-ink-muted text-center px-4">
          {ITEMS.slice(0, 5).join(" · ")}
        </p>
      </div>
    );
  }

  return (
    <div
      className="relative border-y border-line py-3 overflow-hidden"
      style={{ maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)" }}
    >
      <div
        className={`flex whitespace-nowrap font-mono-label text-[10px] uppercase tracking-[0.2em] text-ink-muted ${theme === "remix" ? "remix-marquee-text" : ""}`}
        style={{
          animation: "marquee-scroll 28s linear infinite",
          willChange: "transform",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = "paused"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = "running"; }}
      >
        <span>{repeated}&nbsp;&nbsp;·&nbsp;&nbsp;{repeated}</span>
      </div>
    </div>
  );
}
