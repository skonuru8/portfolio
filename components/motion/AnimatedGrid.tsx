"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useDeviceTier } from "@/lib/device-tier";
import { useTheme } from "@/lib/theme";

const CELL = 64;

type IntersectionDot = {
  col: number;
  row: number;
  phase: number;
};

// ─── Remix metaball blobs ────────────────────────────────────────────────────
type Blob = {
  x: number; // current position, normalized 0–1
  y: number;
  vx: number; // velocity (normalized units / ms-ish)
  vy: number;
  r: number; // influence radius, fraction of screen width
  hue: number; // base hue
  hueSpeed: number; // hue drift rate
  phase: number; // individual oscillation phase
};

// ─── Remix flowing rivers ──────────────────────────────────────────────────────
type RiverAnchor = {
  bx: number; // baseline x (px)
  by: number; // baseline y (px)
  freqX: number;
  freqY: number;
  ampX: number;
  ampY: number;
  phaseX: number;
  phaseY: number;
};

type River = {
  anchors: RiverAnchor[];
  hueOffset: number;
  width: number; // line width 0.5–2.0
  opacity: number; // 0.3–0.7
};

// Build the 18 organic river lines once, sized to the current viewport. Anchors
// are spread evenly across the screen width and oscillate with slow sine waves.
function buildRivers(w: number, h: number): River[] {
  const RIVERS = 18;
  const rivers: River[] = [];
  for (let i = 0; i < RIVERS; i++) {
    const anchorCount = 5 + Math.floor(Math.random() * 3); // 5–7
    const anchors: RiverAnchor[] = [];
    for (let a = 0; a < anchorCount; a++) {
      anchors.push({
        bx: (a / (anchorCount - 1)) * w,
        by: Math.random() * h,
        freqX: 0.0001 + Math.random() * 0.0003, // 0.0001–0.0004 rad/ms
        freqY: 0.0001 + Math.random() * 0.0003,
        ampX: 20 + Math.random() * 60, // 20–80px
        ampY: 40 + Math.random() * 120, // 40–160px
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
      });
    }
    rivers.push({
      anchors,
      hueOffset: Math.random() * 360,
      width: 0.5 + Math.random() * 1.5, // 0.5–2.0
      opacity: 0.3 + Math.random() * 0.4, // 0.3–0.7
    });
  }
  return rivers;
}

// Fast value noise with bilinear interpolation. Deterministic per integer cell
// via a cheap hash, smoothed with smoothstep. Returns ~[-1, 1].
function valueHash(ix: number, iy: number): number {
  let n = ix * 374761393 + iy * 668265263;
  n = (n ^ (n >> 13)) * 1274126177;
  n = n ^ (n >> 16);
  // Map to [-1, 1].
  return ((n >>> 0) / 4294967295) * 2 - 1;
}

function valueNoise(x: number, y: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const sx = fx * fx * (3 - 2 * fx); // smoothstep
  const sy = fy * fy * (3 - 2 * fy);
  const n00 = valueHash(x0, y0);
  const n10 = valueHash(x0 + 1, y0);
  const n01 = valueHash(x0, y0 + 1);
  const n11 = valueHash(x0 + 1, y0 + 1);
  const ix0 = n00 + (n10 - n00) * sx;
  const ix1 = n01 + (n11 - n01) * sx;
  return ix0 + (ix1 - ix0) * sy;
}

// HSL (h:0–360, s/l:0–100) → [r,g,b] 0–255, for fast per-pixel metaball fill.
function hsl(h: number, s: number, l: number): [number, number, number] {
  const hh = (((h % 360) + 360) % 360) / 360;
  const ss = s / 100;
  const ll = l / 100;
  if (ss === 0) {
    const v = Math.round(ll * 255);
    return [v, v, v];
  }
  const q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss;
  const p = 2 * ll - q;
  const conv = (t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  return [
    Math.round(conv(hh + 1 / 3) * 255),
    Math.round(conv(hh) * 255),
    Math.round(conv(hh - 1 / 3) * 255),
  ];
}

function buildBlobs(): Blob[] {
  const count = 7;
  const blobs: Blob[] = [];
  for (let i = 0; i < count; i++) {
    const ang = Math.random() * Math.PI * 2;
    const speed = 0.00004 + Math.random() * 0.00006;
    blobs.push({
      x: Math.random(),
      y: Math.random(),
      vx: Math.cos(ang) * speed,
      vy: Math.sin(ang) * speed,
      r: 0.15 + Math.random() * 0.2,
      hue: Math.random() * 360,
      hueSpeed: 0.006 + Math.random() * 0.01,
      phase: Math.random() * Math.PI * 2,
    });
  }
  return blobs;
}

export function AnimatedGrid() {
  const tier = useDeviceTier();
  const reduce = useReducedMotion();
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const dotsRef = useRef<IntersectionDot[]>([]);
  const blobsRef = useRef<Blob[]>([]);
  const riversRef = useRef<River[]>([]);
  const scrollRef = useRef(0);
  const metaImageRef = useRef<ImageData | null>(null);
  const metaCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Tier B: render nothing
  if (tier === "b") return null;

  // Reduced motion: static CSS grid
  if (reduce) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 grid-lines opacity-[0.35]"
      />
    );
  }

  return (
    <AnimatedGridCanvas
      canvasRef={canvasRef}
      rafRef={rafRef}
      mouseRef={mouseRef}
      dotsRef={dotsRef}
      blobsRef={blobsRef}
      riversRef={riversRef}
      scrollRef={scrollRef}
      metaImageRef={metaImageRef}
      metaCanvasRef={metaCanvasRef}
      theme={theme}
    />
  );
}

type CanvasProps = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  rafRef: React.MutableRefObject<number>;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  dotsRef: React.MutableRefObject<IntersectionDot[]>;
  blobsRef: React.MutableRefObject<Blob[]>;
  riversRef: React.MutableRefObject<River[]>;
  scrollRef: React.MutableRefObject<number>;
  metaImageRef: React.MutableRefObject<ImageData | null>;
  metaCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  theme: string;
};

function AnimatedGridCanvas({
  canvasRef,
  rafRef,
  mouseRef,
  dotsRef,
  blobsRef,
  riversRef,
  scrollRef,
  metaImageRef,
  metaCanvasRef,
  theme,
}: CanvasProps) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Sync size
    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(document.documentElement);

    // Mouse tracking (light mode cursor glow + remix metaball attraction)
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Scroll tracking (remix metaball Y-shift). Always attached; cheap.
    scrollRef.current = window.scrollY;
    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Build the metaball blobs + offscreen low-res buffer for remix mode.
    blobsRef.current = buildBlobs();
    let metaCanvas = metaCanvasRef.current;
    if (!metaCanvas) {
      metaCanvas = document.createElement("canvas");
      metaCanvasRef.current = metaCanvas;
    }

    // Build the flowing river lines for remix mode (rebuilt on resize so anchors
    // stay spread across the viewport).
    riversRef.current = buildRivers(window.innerWidth, window.innerHeight);
    const rebuildRivers = () => {
      riversRef.current = buildRivers(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", rebuildRivers);

    // Pre-generate intersection dots for dark mode (~15% of intersections)
    function buildDots() {
      if (!canvas) return;
      const cols = Math.ceil(canvas.width / CELL) + 1;
      const rows = Math.ceil(canvas.height / CELL) + 1;
      const dots: IntersectionDot[] = [];
      for (let c = 0; c <= cols; c++) {
        for (let r = 0; r <= rows; r++) {
          if (Math.random() < 0.15) {
            dots.push({ col: c, row: r, phase: Math.random() * Math.PI * 2 });
          }
        }
      }
      dotsRef.current = dots;
    }
    buildDots();

    const startTime = performance.now();

    function draw(now: number) {
      if (!canvas || !ctx) return;
      if (document.visibilityState === "hidden") {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const time = now - startTime;
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      const cols = Math.ceil(W / CELL) + 1;
      const rows = Math.ceil(H / CELL) + 1;

      if (theme === "dark") {
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = "rgba(148, 163, 184, 0.09)";
        ctx.lineWidth = 1;

        // Vertical lines with sine wave breathing
        for (let c = 0; c <= cols; c++) {
          const baseX = c * CELL;
          const offsetY = Math.sin(time * 0.0004 + c * 0.3) * 2.5;
          ctx.beginPath();
          ctx.moveTo(baseX, offsetY);
          ctx.lineTo(baseX, H + offsetY);
          ctx.stroke();
        }

        // Horizontal lines with sine wave breathing
        for (let r = 0; r <= rows; r++) {
          const baseY = r * CELL;
          const offsetX = Math.sin(time * 0.0003 + r * 0.25) * 2.5;
          ctx.beginPath();
          ctx.moveTo(offsetX, baseY);
          ctx.lineTo(W + offsetX, baseY);
          ctx.stroke();
        }

        // Intersection dots
        for (const dot of dotsRef.current) {
          const opacity = Math.max(0, Math.sin(time * 0.001 + dot.phase)) * 0.5;
          if (opacity > 0.01) {
            const x = dot.col * CELL;
            const y = dot.row * CELL;
            ctx.globalAlpha = opacity * 0.35;
            ctx.fillStyle = "rgba(34, 211, 238, 0.4)";
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.globalAlpha = 1;
      } else if (theme === "light") {
        ctx.globalAlpha = 0.6;
        ctx.strokeStyle = "rgba(120, 100, 80, 0.07)";
        ctx.lineWidth = 1;

        // Static vertical lines
        for (let c = 0; c <= cols; c++) {
          const x = c * CELL;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, H);
          ctx.stroke();
        }

        // Static horizontal lines
        for (let r = 0; r <= rows; r++) {
          const y = r * CELL;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(W, y);
          ctx.stroke();
        }

        // Cursor glow
        const { x: mx, y: my } = mouseRef.current;
        if (mx >= 0) {
          const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 180);
          grad.addColorStop(0, "rgba(180, 120, 40, 0.08)");
          grad.addColorStop(1, "rgba(180, 120, 40, 0)");
          ctx.globalAlpha = 1;
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, W, H);
        }

        ctx.globalAlpha = 1;
      } else if (theme === "remix") {
        // ── Dual-layer living-rivers system ───────────────────────────────────
        // Layer 1: a Perlin-style value-noise colour field (aurora wash) rendered
        // at 1/8 resolution and upscaled. Layer 2: 18 flowing bezier river lines
        // that curve and breathe, glow like circuit traces, and react to cursor
        // and scroll.

        // ── Layer 1: noise colour field (1/8 res) ─────────────────────────────
        const NRES = 8;
        const nw = Math.max(1, Math.floor(W / NRES));
        const nh = Math.max(1, Math.floor(H / NRES));
        const mc = metaCanvas!;
        if (mc.width !== nw || mc.height !== nh) {
          mc.width = nw;
          mc.height = nh;
          metaImageRef.current = null;
        }
        const mctx = mc.getContext("2d");
        if (mctx) {
          let img = metaImageRef.current;
          if (!img || img.width !== nw || img.height !== nh) {
            img = mctx.createImageData(nw, nh);
            metaImageRef.current = img;
          }
          const px = img.data;

          // Noise grid spacing 128px in screen space; convert to low-res cell
          // units. Time-varying offsets create the slow drift.
          const cell = 128 / NRES;
          const ox = time * 0.00002;
          const oy = time * 0.000015;

          let pi = 0;
          for (let py = 0; py < nh; py++) {
            for (let pxn = 0; pxn < nw; pxn++) {
              const n = valueNoise(pxn / cell + ox, py / cell + oy);
              const hue = ((n * 60 + time * 0.006 + 240) % 360 + 360) % 360;
              const light = 12 + Math.abs(n) * 10;
              const [rr, gg, bb] = hsl(hue, 80, light);
              px[pi] = rr;
              px[pi + 1] = gg;
              px[pi + 2] = bb;
              px[pi + 3] = 255;
              pi += 4;
            }
          }
          mctx.putImageData(img, 0, 0);

          ctx.globalAlpha = 1;
          ctx.imageSmoothingEnabled = true;
          ctx.drawImage(mc, 0, 0, nw, nh, 0, 0, W, H);
        }

        // ── Layer 2: flowing bezier rivers ────────────────────────────────────
        const rivers = riversRef.current;
        const { x: rawMx, y: rawMy } = mouseRef.current;
        const hasMouse = rawMx >= 0 && rawMy >= 0;
        const scrollShift = scrollRef.current * 0.1;

        for (const river of rivers) {
          // Compute current anchor positions.
          const pts: { x: number; y: number }[] = [];
          for (const a of river.anchors) {
            const baseY = ((a.by + scrollShift) % H + H) % H;
            let x = a.bx + a.ampX * Math.sin(time * a.freqX + a.phaseX);
            let y = baseY + a.ampY * Math.sin(time * a.freqY + a.phaseY);

            // Mouse attraction: gentle pull toward the cursor when within 200px,
            // capped at 30px.
            if (hasMouse) {
              const ddx = rawMx - x;
              const ddy = rawMy - y;
              const dist = Math.sqrt(ddx * ddx + ddy * ddy);
              if (dist < 200 && dist > 0.001) {
                const pull = (1 - dist / 200) * 30;
                x += (ddx / dist) * pull;
                y += (ddy / dist) * pull;
              }
            }
            pts.push({ x, y });
          }

          if (pts.length < 2) continue;

          // Smooth bezier path through anchors using midpoints (Chaikin-style)
          // as the curve targets with anchors as control points.
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let p = 1; p < pts.length - 1; p++) {
            const mx = (pts[p].x + pts[p + 1].x) / 2;
            const my = (pts[p].y + pts[p + 1].y) / 2;
            ctx.quadraticCurveTo(pts[p].x, pts[p].y, mx, my);
          }
          const last = pts[pts.length - 1];
          ctx.lineTo(last.x, last.y);

          const hue = ((time * 0.008 + river.hueOffset) % 360 + 360) % 360;
          const [hr, hg, hb] = hsl(hue, 90, 65);
          ctx.globalAlpha = river.opacity;
          ctx.lineWidth = river.width;
          ctx.strokeStyle = `rgb(${hr}, ${hg}, ${hb})`;
          ctx.shadowColor = `rgba(${hr}, ${hg}, ${hb}, 0.8)`;
          ctx.shadowBlur = 8;
          ctx.stroke();
        }

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", rebuildRivers);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: -10,
        opacity: theme === "remix" ? 0.92 : 1,
      }}
    />
  );
}
