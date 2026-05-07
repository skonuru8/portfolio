"use client";

import { useRef, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { useIsMobile } from "@/lib/motion";
import { useDeviceTier } from "@/lib/device-tier";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const NODES = [
  { label: "Bottleneck", step: 0 },
  { label: "Cause",       step: 1 },
  { label: "Constraint",  step: 2 },
  { label: "Decision",    step: 3 }, // pulses --lock when reached
  { label: "Result",      step: 4 }, // settles --lock permanently
] as const;

const N = NODES.length;
// SVG coordinate system
const CX = 8;
const Y_START = 12;
const Y_END = 252;
const Y_SPACING = (Y_END - Y_START) / (N - 1); // 60 units per node
const NODE_YS = NODES.map((_, i) => Y_START + i * Y_SPACING);

function nodeColor(i: number, filled: boolean): { fill: string; stroke: string } {
  if (!filled) return { fill: "var(--bg)", stroke: "var(--signal)" };
  if (i >= N - 2) return { fill: "var(--lock)", stroke: "var(--lock)" };
  return { fill: "var(--signal)", stroke: "var(--signal)" };
}

/** Static fully-drawn path — used for reduced-motion and as the component's resolved state. */
function StaticTrace() {
  return (
    <svg
      viewBox="0 0 130 272"
      className="h-64 w-[130px] overflow-visible"
      fill="none"
      aria-hidden
    >
      <line
        x1={CX} y1={Y_START} x2={CX} y2={Y_END}
        stroke="var(--signal)" strokeWidth="2" strokeLinecap="round"
      />
      {NODE_YS.map((y, i) => {
        const { fill, stroke } = nodeColor(i, true);
        return (
          <g key={i}>
            <circle cx={CX} cy={y} r="4" fill={fill} stroke={stroke} strokeWidth="1.5" />
            <text
              x={CX + 12} y={y + 3}
              fontSize="9"
              fill="rgba(148,163,184,0.65)"
              fontFamily="ui-monospace, monospace"
              letterSpacing="0.4"
            >
              {`${String(i + 1).padStart(2, "0")} · ${NODES[i].label.toUpperCase()}`}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function DecisionTrace() {
  const reduce = useReducedMotion();
  const tier = useDeviceTier();
  const mobile = useIsMobile();

  const pathRef = useRef<SVGPathElement>(null);
  const circleRefs = useRef<(SVGCircleElement | null)[]>([]);
  const nodeFilled = useRef<boolean[]>(Array.from({ length: N }, () => false));

  useEffect(() => {
    if (reduce || mobile) return;
    const path = pathRef.current;
    if (!path) return;

    const totalLength = path.getTotalLength();
    gsap.set(path, { strokeDasharray: totalLength, strokeDashoffset: totalLength });

    circleRefs.current.forEach((el) => {
      if (!el) return;
      el.setAttribute("fill", "var(--bg)");
      el.setAttribute("stroke", "var(--signal)");
    });
    nodeFilled.current.fill(false);

    if (tier === "b") {
      // Tier B: snap-based — play once on enter, reverse on leave-back.
      // No per-scroll-pixel work; GSAP only fires on intersection change.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#thinking",
          start: "top 65%",
          end: "bottom 40%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        path,
        { strokeDashoffset: totalLength },
        { strokeDashoffset: 0, duration: 1.2, ease: "power2.out" },
      );

      // Fill nodes in sequence (no thinking-flash on lean devices)
      NODE_YS.forEach((_, i) => {
        const el = circleRefs.current[i];
        if (!el) return;
        const { fill, stroke } = nodeColor(i, true);
        tl.to(el, { attr: { fill, stroke }, duration: 0.15 }, 0.2 + i * 0.22);
      });

      return () => { tl.scrollTrigger?.kill(); tl.kill(); };
    }

    // Tier A: full scrub — progress drives every scroll pixel
    const st = ScrollTrigger.create({
      trigger: "#thinking",
      start: "top 65%",
      end: "bottom 40%",
      scrub: 0.6,
      onUpdate(self) {
        const progress = self.progress;
        gsap.set(path, { strokeDashoffset: totalLength * (1 - progress) });

        NODES.forEach((node, i) => {
          const nodeProgress = i / (N - 1);
          const shouldFill = progress >= nodeProgress;
          const wasFilled = nodeFilled.current[i];
          const el = circleRefs.current[i];
          if (!el) return;

          if (shouldFill !== wasFilled) {
            nodeFilled.current[i] = shouldFill;
            const { fill, stroke } = nodeColor(i, shouldFill);
            el.setAttribute("fill", fill);
            el.setAttribute("stroke", stroke);

            if (shouldFill) {
              const listItem = document.querySelector(
                `[data-thinking-step="${node.step}"]`,
              ) as HTMLElement | null;
              if (listItem) {
                listItem.classList.remove("thinking-flash");
                void listItem.offsetWidth;
                listItem.classList.add("thinking-flash");
              }
            }
          }
        });
      },
    });

    return () => st.kill();
  }, [reduce, mobile, tier]);

  // Reduced motion: fully-drawn path, resolved state
  if (reduce) {
    return (
      <div aria-hidden className="self-start">
        <p className="sr-only">Decision trace: from bottleneck to measured result.</p>
        <StaticTrace />
      </div>
    );
  }

  // Mobile: return null — HowIThink renders a simplified list for mobile
  if (mobile) return null;

  return (
    <div className="self-start" aria-hidden>
      <p className="sr-only">Decision trace: from bottleneck to measured result.</p>
      <svg
        viewBox="0 0 130 272"
        className="h-64 w-[130px] overflow-visible"
        fill="none"
        aria-hidden
      >
        <path
          ref={pathRef}
          d={`M ${CX} ${Y_START} L ${CX} ${Y_END}`}
          stroke="var(--signal)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {NODE_YS.map((y, i) => (
          <g key={i}>
            <circle
              ref={(el) => { circleRefs.current[i] = el; }}
              cx={CX}
              cy={y}
              r="4"
              fill="var(--bg)"
              stroke="var(--signal)"
              strokeWidth="1.5"
            />
            <text
              x={CX + 12}
              y={y + 3}
              fontSize="9"
              fill="rgba(148,163,184,0.65)"
              fontFamily="ui-monospace, monospace"
              letterSpacing="0.4"
            >
              {`${String(i + 1).padStart(2, "0")} · ${NODES[i].label.toUpperCase()}`}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
