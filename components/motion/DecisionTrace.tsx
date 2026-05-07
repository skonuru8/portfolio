"use client";

import { useRef, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { useIsMobile } from "@/lib/motion";
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

    // Reset node appearances
    circleRefs.current.forEach((el) => {
      if (!el) return;
      el.setAttribute("fill", "var(--bg)");
      el.setAttribute("stroke", "var(--signal)");
    });
    nodeFilled.current.fill(false);

    const st = ScrollTrigger.create({
      trigger: "#thinking",
      start: "top 65%",
      end: "bottom 40%",
      scrub: 0.6,
      onUpdate(self) {
        const progress = self.progress;

        // Drive stroke drawing
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

            // Flash the corresponding thinking-sequence list item on fill
            if (shouldFill) {
              const listItem = document.querySelector(
                `[data-thinking-step="${node.step}"]`
              ) as HTMLElement | null;
              if (listItem) {
                // Remove first to restart the animation if already running
                listItem.classList.remove("thinking-flash");
                void listItem.offsetWidth; // force reflow
                listItem.classList.add("thinking-flash");
              }
            }
          }
        });
      },
    });

    return () => st.kill();
  }, [reduce, mobile]);

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
