"use client";

import { useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// Light-mode scene: leaves & flowers drifting on water with slow ripples.
// Replaces the starfield in light mode. A click / tap disturbs the surface and
// sends a ripple outward that gently bobs everything floating nearby.
// ═══════════════════════════════════════════════════════════════════════════════

const LEAF_COUNT   = 22;
const FLOWER_COUNT = 7;

// Ambient ripples appear on their own every so often, like a calm pond surface.
const AMBIENT_MIN  = 1400; // ms
const AMBIENT_MAX  = 3200; // ms

// Ripple physics (shared by ambient + click ripples).
const RIPPLE_SIGMA = 42;             // ring width for the bob falloff
const RIPPLE_K     = (Math.PI * 2) / 110; // ripple wavelength

// Leaf palette — fresh greens, olives, dried browns, and autumn colors.
const LEAF_COLORS: [number, number, number][] = [
  [96, 150, 70],   // fresh green
  [122, 168, 82],  // light green
  [68, 120, 56],   // deep green
  [150, 158, 84],  // olive
  [158, 108, 56],  // dried brown
  [124, 84, 46],   // dark brown
  [176, 124, 64],  // tan
  [204, 96, 52],   // autumn red-orange
  [216, 142, 56],  // orange
  [220, 184, 74],  // golden yellow
  [182, 74, 62],   // crimson
];

// Flower petal palette + matching centers.
const FLOWER_PETALS: [number, number, number][] = [
  [236, 152, 178], // pink
  [246, 240, 238], // white
  [196, 174, 228], // lavender
  [242, 152, 132], // coral
  [244, 212, 126], // pale yellow
];
const FLOWER_CENTERS: [number, number, number][] = [
  [236, 198, 92],
  [214, 162, 72],
  [240, 178, 96],
];

const rnd  = (a: number, b: number) => a + Math.random() * (b - a);
const rndI = (a: number, b: number) => Math.floor(rnd(a, b + 1));
const easeOut = (x: number) => 1 - (1 - x) * (1 - x);

type Floater = {
  kind: "leaf" | "flower";
  x: number; y: number;
  vx: number; vy: number;       // slow drift (a gentle current)
  rot: number; vrot: number;    // slow spin
  size: number;
  sway: number; swaySpeed: number; swayPhase: number; // gentle floating bob
  petals: number;               // flowers only
  r: number; g: number; b: number;     // base color
  cr: number; cg: number; cb: number;  // flower center color
  bobX: number; bobY: number;   // transient offset (sway + ripples + cursor)
};

type Ripple = {
  x: number; y: number; t0: number;
  maxR: number; duration: number; strength: number;
};

type Caustic = { x: number; y: number; vx: number; vy: number; r: number };

function makeFloater(kind: "leaf" | "flower", w: number, h: number): Floater {
  const size = kind === "leaf" ? rnd(13, 26) : rnd(11, 18);
  const [r, g, b] = kind === "leaf"
    ? LEAF_COLORS[rndI(0, LEAF_COLORS.length - 1)]
    : FLOWER_PETALS[rndI(0, FLOWER_PETALS.length - 1)];
  const [cr, cg, cb] = FLOWER_CENTERS[rndI(0, FLOWER_CENTERS.length - 1)];
  // A gentle prevailing current drifting down-right, plus per-floater variation.
  const drift = rnd(0.04, 0.14);
  const ang = rnd(Math.PI * 0.12, Math.PI * 0.38);
  return {
    kind,
    x: rnd(0, w), y: rnd(0, h),
    vx: Math.cos(ang) * drift, vy: Math.sin(ang) * drift,
    rot: rnd(0, Math.PI * 2), vrot: rnd(-0.004, 0.004),
    size,
    sway: rnd(2, 6), swaySpeed: rnd(0.0006, 0.0014), swayPhase: rnd(0, Math.PI * 2),
    petals: [5, 6, 8][rndI(0, 2)],
    r, g, b, cr, cg, cb,
    bobX: 0, bobY: 0,
  };
}

function buildFloaters(w: number, h: number): Floater[] {
  const out: Floater[] = [];
  for (let i = 0; i < LEAF_COUNT; i++) out.push(makeFloater("leaf", w, h));
  for (let i = 0; i < FLOWER_COUNT; i++) out.push(makeFloater("flower", w, h));
  return out;
}

function buildCaustics(w: number, h: number): Caustic[] {
  return Array.from({ length: 5 }, () => ({
    x: rnd(0, w), y: rnd(0, h),
    vx: rnd(-0.06, 0.06), vy: rnd(-0.05, 0.05),
    r: rnd(160, 320),
  }));
}

// ── Drawing ────────────────────────────────────────────────────────────────────

function drawLeaf(ctx: CanvasRenderingContext2D, f: Floater) {
  const L = f.size, Wd = f.size * 0.52;
  const dr = Math.round(f.r * 0.68), dg = Math.round(f.g * 0.68), db = Math.round(f.b * 0.68);

  ctx.save();
  ctx.translate(f.x + f.bobX, f.y + f.bobY);

  // Soft shadow cast on the water (offset, no rotation).
  ctx.save();
  ctx.rotate(f.rot);
  ctx.fillStyle = "rgba(40,70,72,0.10)";
  ctx.beginPath();
  ctx.moveTo(-L + 2, 3);
  ctx.quadraticCurveTo(2, -Wd + 3, L + 2, 3);
  ctx.quadraticCurveTo(2, Wd + 3, -L + 2, 3);
  ctx.fill();
  ctx.restore();

  ctx.rotate(f.rot);

  // Leaf body — gradient from a darker tip to the base color.
  const grad = ctx.createLinearGradient(-L, 0, L, 0);
  grad.addColorStop(0, `rgb(${dr},${dg},${db})`);
  grad.addColorStop(0.5, `rgb(${f.r},${f.g},${f.b})`);
  grad.addColorStop(1, `rgb(${dr},${dg},${db})`);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(-L, 0);
  ctx.quadraticCurveTo(0, -Wd, L, 0);
  ctx.quadraticCurveTo(0, Wd, -L, 0);
  ctx.closePath();
  ctx.fill();

  // Midrib + a couple of side veins.
  ctx.strokeStyle = `rgba(${dr},${dg},${db},0.7)`;
  ctx.lineWidth = Math.max(0.6, f.size * 0.045);
  ctx.beginPath();
  ctx.moveTo(-L * 0.82, 0);
  ctx.lineTo(L * 0.86, 0);
  ctx.stroke();
  ctx.lineWidth = Math.max(0.4, f.size * 0.03);
  for (const sgn of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(-L * 0.1, 0);
    ctx.quadraticCurveTo(L * 0.25, sgn * Wd * 0.3, L * 0.5, sgn * Wd * 0.5);
    ctx.stroke();
  }
  ctx.restore();
}

function drawFlower(ctx: CanvasRenderingContext2D, f: Floater) {
  ctx.save();
  ctx.translate(f.x + f.bobX, f.y + f.bobY);
  ctx.rotate(f.rot);

  const pl = f.size * 0.95, pw = f.size * 0.5, pd = f.size * 0.6;
  const dr = Math.round(f.r * 0.86), dg = Math.round(f.g * 0.86), db = Math.round(f.b * 0.86);

  for (let i = 0; i < f.petals; i++) {
    ctx.save();
    ctx.rotate((i / f.petals) * Math.PI * 2);
    const pg = ctx.createRadialGradient(pd, 0, 0, pd + pl, 0, pl);
    pg.addColorStop(0, `rgba(${f.r},${f.g},${f.b},0.96)`);
    pg.addColorStop(1, `rgba(${dr},${dg},${db},0.9)`);
    ctx.fillStyle = pg;
    ctx.beginPath();
    ctx.ellipse(pd, 0, pl, pw, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.fillStyle = `rgb(${f.cr},${f.cg},${f.cb})`;
  ctx.beginPath();
  ctx.arc(0, 0, f.size * 0.34, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawRipple(ctx: CanvasRenderingContext2D, rp: Ripple, now: number) {
  const age = now - rp.t0;
  const life = age / rp.duration;
  if (life >= 1) return;
  const env = 1 - life;
  const baseR = rp.maxR * easeOut(life);
  for (let k = 0; k < 3; k++) {
    const r = baseR - k * (rp.maxR * 0.07);
    if (r <= 1) continue;
    ctx.beginPath();
    ctx.arc(rp.x, rp.y, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255,255,255,${0.22 * env * (1 - k * 0.28)})`;
    ctx.lineWidth = 1.5 - k * 0.4;
    ctx.stroke();
  }
  // Faint aqua trailing shadow just inside the leading ring — adds depth.
  if (baseR > 2) {
    ctx.beginPath();
    ctx.arc(rp.x, rp.y, baseR * 0.92, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(70,120,130,${0.10 * env})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

// Sum the gentle radial displacement at (x,y) from all live ripples.
function rippleDisplace(x: number, y: number, ripples: Ripple[], now: number): [number, number] {
  let dx = 0, dy = 0;
  for (const rp of ripples) {
    const age = now - rp.t0;
    const life = age / rp.duration;
    if (life >= 1) continue;
    const front = rp.maxR * easeOut(life);
    const ex = x - rp.x, ey = y - rp.y;
    const d = Math.sqrt(ex * ex + ey * ey) || 0.0001;
    const rd = d - front;
    const wave = Math.exp(-(rd * rd) / (2 * RIPPLE_SIGMA * RIPPLE_SIGMA)) * Math.cos(rd * RIPPLE_K);
    const mag = rp.strength * wave * (1 - life);
    dx += (ex / d) * mag;
    dy += (ey / d) * mag;
  }
  return [dx, dy];
}

export function PondCanvas() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const rafRef       = useRef(0);
  const floatersRef  = useRef<Floater[]>([]);
  const ripplesRef   = useRef<Ripple[]>([]);
  const causticsRef  = useRef<Caustic[]>([]);
  const mouseRef     = useRef({ x: -9999, y: -9999, active: false });
  const t0Ref        = useRef(0);
  const nextAmbient  = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      floatersRef.current = buildFloaters(canvas.width, canvas.height);
      causticsRef.current = buildCaustics(canvas.width, canvas.height);
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const onMove = (e: PointerEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY, active: true }; };
    const onLeave = ()              => { mouseRef.current.active = false; };
    const onDown = (e: PointerEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
      const ripples = ripplesRef.current;
      ripples.push({ x: e.clientX, y: e.clientY, t0: performance.now(), maxR: 320, duration: 1900, strength: 18 });
      if (ripples.length > 8) ripples.splice(0, ripples.length - 8);
    };
    window.addEventListener("pointermove",   onMove, { passive: true });
    window.addEventListener("pointerdown",   onDown, { passive: true });
    window.addEventListener("pointercancel", onLeave);
    window.addEventListener("mouseleave",    onLeave);

    t0Ref.current = performance.now();
    nextAmbient.current = t0Ref.current + rnd(AMBIENT_MIN, AMBIENT_MAX);

    function loop() {
      if (!canvas || !ctx) return;
      if (document.visibilityState === "hidden") { rafRef.current = requestAnimationFrame(loop); return; }

      const W = canvas.width, H = canvas.height;
      const now = performance.now();
      const t = now - t0Ref.current;

      ctx.clearRect(0, 0, W, H);

      // ── Water wash ─────────────────────────────────────────────────────────
      const wash = ctx.createLinearGradient(0, 0, 0, H);
      wash.addColorStop(0, "rgba(214,232,229,0.28)");
      wash.addColorStop(1, "rgba(184,214,213,0.40)");
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, W, H);

      // ── Caustic shimmer (slow drifting light) ────────────────────────────────
      for (const c of causticsRef.current) {
        c.x += c.vx; c.y += c.vy;
        if (c.x < -c.r) c.x = W + c.r; else if (c.x > W + c.r) c.x = -c.r;
        if (c.y < -c.r) c.y = H + c.r; else if (c.y > H + c.r) c.y = -c.r;
        const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
        g.addColorStop(0, "rgba(255,255,255,0.07)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Spawn an ambient ripple now and then ─────────────────────────────────
      if (now >= nextAmbient.current) {
        ripplesRef.current.push({
          x: rnd(0, W), y: rnd(0, H), t0: now,
          maxR: rnd(120, 240), duration: rnd(2400, 3600), strength: rnd(5, 9),
        });
        nextAmbient.current = now + rnd(AMBIENT_MIN, AMBIENT_MAX);
      }

      // Drop expired ripples.
      const ripples = ripplesRef.current;
      for (let i = ripples.length - 1; i >= 0; i--) {
        if (now - ripples[i].t0 >= ripples[i].duration) ripples.splice(i, 1);
      }

      const { x: mx, y: my, active } = mouseRef.current;

      // ── Update + draw floaters ───────────────────────────────────────────────
      const floaters = floatersRef.current;
      for (const f of floaters) {
        // Slow drift + spin, wrapping around the edges so the current never ends.
        f.x += f.vx; f.y += f.vy; f.rot += f.vrot;
        const m = f.size * 2.4;
        if (f.x < -m) f.x = W + m; else if (f.x > W + m) f.x = -m;
        if (f.y < -m) f.y = H + m; else if (f.y > H + m) f.y = -m;

        // Transient offset = gentle floating bob + ripple push + cursor wake.
        let bx = Math.sin(t * f.swaySpeed + f.swayPhase) * f.sway;
        let by = Math.cos(t * f.swaySpeed * 0.9 + f.swayPhase) * f.sway * 0.8;
        const [rdx, rdy] = rippleDisplace(f.x, f.y, ripples, now);
        bx += rdx; by += rdy;
        if (active) {
          const ex = f.x - mx, ey = f.y - my;
          const d = Math.sqrt(ex * ex + ey * ey);
          if (d < 150 && d > 0.1) {
            const push = (1 - d / 150) * 11;
            bx += (ex / d) * push; by += (ey / d) * push;
          }
        }
        f.bobX = bx; f.bobY = by;

        if (f.kind === "leaf") drawLeaf(ctx, f); else drawFlower(ctx, f);
      }

      // ── Ripple rings on the surface ──────────────────────────────────────────
      for (const rp of ripples) drawRipple(ctx, rp, now);

      // ── Cursor wake — a soft highlight where a finger / cursor rests ──────────
      if (active) {
        const g = ctx.createRadialGradient(mx, my, 0, mx, my, 120);
        g.addColorStop(0, "rgba(255,255,255,0.10)");
        g.addColorStop(0.5, "rgba(120,170,170,0.04)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize",        resize);
      window.removeEventListener("pointermove",   onMove);
      window.removeEventListener("pointerdown",   onDown);
      window.removeEventListener("pointercancel", onLeave);
      window.removeEventListener("mouseleave",    onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position:      "fixed",
        inset:         0,
        pointerEvents: "none",
        zIndex:        1,
        opacity:       0.9,
      }}
    />
  );
}
