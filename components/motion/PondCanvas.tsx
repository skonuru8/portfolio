"use client";

import { useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// Light-mode scene: a calm, dark, reflective body of water seen from above. Leaves
// float on the surface and bob with a slow, gentle swell. The dark water mirrors a
// drifting sky; only in a few clear "windows" do you see down into green depths.
//
// Realism notes:
//  · Motion is time-based (a fixed-step ripple sim + real-time swell), so it runs at
//    the same speed on 60Hz and 120Hz — never "fast".
//  · Leaves always drift, bob and rock, even on still water (their own idle motion),
//    and additionally ride the swell + react to ripples.
//  · Heavy work is baked once; the per-frame loop only samples textures + a sine LUT.
// ═══════════════════════════════════════════════════════════════════════════════

const SCALE      = 8;       // px per cell
const STEP_MS    = 1000 / 60; // fixed sim timestep (frame-rate independent)
const RIPPLE_DAMP = 0.985;
const REFRACT    = 6;       // px the surface bends light by, per unit of slope

// Gentle swell — three slow, long crossing waves. Tunable for calmer/livelier.
const SWELL = [
  { kx: 0.030, ky: 0.012, w: 0.00024, a: 11 },
  { kx: -0.018, ky: 0.034, w: 0.00018, a: 8 },
  { kx: 0.024, ky: -0.028, w: 0.00031, a: 6 },
];

// Tone: deep teal-green ocean with emerald bloom swirls and glowing god-rays.
const WATER_TOP:  [number, number, number] = [86, 198, 190]; // sunlit teal-cyan (top)
const WATER_BOT:  [number, number, number] = [7, 52, 76];    // deep teal-blue (depth)
const BLOOM:      [number, number, number] = [40, 172, 120]; // emerald swirl
const BLOOM_LIME: [number, number, number] = [156, 216, 96]; // bright lime swirl cores

// ── Math + noise (noise used only while baking) ─────────────────────────────────
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (x: number, a: number, b: number) => (x < a ? a : x > b ? b : x);
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const rndI = (a: number, b: number) => Math.floor(rnd(a, b + 1));
function smoothstep(e0: number, e1: number, x: number) {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}
function vhash(ix: number, iy: number): number {
  let n = ix * 374761393 + iy * 668265263;
  n = (n ^ (n >> 13)) * 1274126177;
  n = n ^ (n >> 16);
  return (n >>> 0) / 4294967295;
}
function vnoise(x: number, y: number): number {
  const x0 = Math.floor(x), y0 = Math.floor(y);
  const fx = x - x0, fy = y - y0;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  const n00 = vhash(x0, y0), n10 = vhash(x0 + 1, y0);
  const n01 = vhash(x0, y0 + 1), n11 = vhash(x0 + 1, y0 + 1);
  return lerp(lerp(n00, n10, sx), lerp(n01, n11, sx), sy);
}
function fbm(x: number, y: number): number {
  return vnoise(x, y) * 0.6 + vnoise(x * 2.3 + 11, y * 2.3 + 7) * 0.3 + vnoise(x * 4.7 + 3, y * 4.7 + 19) * 0.1;
}

// Sine lookup table — swell sampled per pixel per frame, so avoid Math.sin there.
const LUTN = 2048;
const SINLUT = new Float32Array(LUTN);
for (let i = 0; i < LUTN; i++) SINLUT[i] = Math.sin((i / LUTN) * Math.PI * 2);
const KSIN = LUTN / (Math.PI * 2);
function swellAt(x: number, y: number, t: number): number {
  let s = 0;
  for (let k = 0; k < SWELL.length; k++) {
    const w = SWELL[k];
    s += w.a * SINLUT[((((x * w.kx + y * w.ky + t * w.w) * KSIN) | 0) & (LUTN - 1))];
  }
  return s;
}

// ── Baked water: deep teal with flowing emerald bloom swirls + caustics ──────────
// Built with domain-warped noise so the green forms organic ribbons/swirls (like the
// phytoplankton-bloom satellite tone). Sampled per frame with a slow flow offset, so
// the swirls drift and refract — alive, not a frozen photo.
function bakeWater(gw: number, gh: number): Uint8ClampedArray {
  const d = new Uint8ClampedArray(gw * gh * 3);
  let p = 0;
  for (let y = 0; y < gh; y++) {
    const tv = y / gh;
    const baseR = lerp(WATER_TOP[0], WATER_BOT[0], tv);
    const baseG = lerp(WATER_TOP[1], WATER_BOT[1], tv);
    const baseB = lerp(WATER_TOP[2], WATER_BOT[2], tv);
    for (let x = 0; x < gw; x++) {
      // Domain warp → swirling ribbons.
      const q = fbm(x * 0.011 + 1.7, y * 0.011 + 9.2);
      const w = fbm(x * 0.011 + 3.6 * q + 3.1, y * 0.011 + 3.6 * q + 1.7);

      let r = baseR, g = baseG, b = baseB;
      const green = smoothstep(0.4, 0.72, w);
      r = lerp(r, BLOOM[0], green * 0.72); g = lerp(g, BLOOM[1], green * 0.72); b = lerp(b, BLOOM[2], green * 0.72);
      const core = smoothstep(0.66, 0.84, w) * green;
      r = lerp(r, BLOOM_LIME[0], core * 0.55); g = lerp(g, BLOOM_LIME[1], core * 0.55); b = lerp(b, BLOOM_LIME[2], core * 0.55);

      // Caustic light net, strongest in the upper water.
      let ca = fbm(x * 0.05 + 7, y * 0.05 + 3);
      ca = 1 - Math.abs(ca * 2 - 1); ca = ca * ca * ca;
      const caAmt = ca * (1 - tv * 0.5) * 0.3;
      r = Math.min(255, r + caAmt * 120); g = Math.min(255, g + caAmt * 130); b = Math.min(255, b + caAmt * 110);

      d[p] = r; d[p + 1] = g; d[p + 2] = b; p += 3;
    }
  }
  return d;
}

// Sparse "clear windows" — where the water thins and the deep forest shows through.
function bakeWindows(gw: number, gh: number): Float32Array {
  const m = new Float32Array(gw * gh);
  for (let y = 0; y < gh; y++)
    for (let x = 0; x < gw; x++)
      m[y * gw + x] = smoothstep(0.62, 0.84, fbm(x * 0.012 + 3, y * 0.014 + 9)) * 0.82;
  return m;
}

// A deep, dim, teal-tinted, blurred version of a forest photo for the underwater backdrop.
// Cover-fit a forest photo into an oversized (W+2M wide) canvas so it can be sheared
// sideways without exposing edges. Kept lush — only a light teal underwater tint.
const FOREST_MARGIN = 18;
const FOREST_HOLD = 13000; // ms each forest holds before it starts crossfading
const FOREST_FADE = 4200;  // ms crossfade duration
function buildForestBg(img: HTMLImageElement, W: number, H: number): HTMLCanvasElement {
  const cw = W + FOREST_MARGIN * 2;
  const c = document.createElement("canvas");
  c.width = cw; c.height = H;
  const cx = c.getContext("2d")!;
  const scale = Math.max(cw / img.width, H / img.height) * 1.04;
  const dw = img.width * scale, dh = img.height * scale;
  cx.filter = "blur(1.5px)";
  cx.drawImage(img, (cw - dw) / 2, (H - dh) / 2, dw, dh);
  cx.filter = "none";
  // Light teal wash + soft depth gradient (lighter near the surface, deeper below).
  cx.fillStyle = "rgba(12,74,90,0.2)";
  cx.fillRect(0, 0, cw, H);
  const g = cx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "rgba(176,232,222,0.12)");
  g.addColorStop(0.5, "rgba(20,80,92,0.04)");
  g.addColorStop(1, "rgba(4,28,40,0.34)");
  cx.fillStyle = g; cx.fillRect(0, 0, cw, H);
  return c;
}

// ── Kelp forest: wide undulating blades in depth layers (back = dark/distant,
// front = bright/golden). Each blade sways with a slow current and bends with the
// local wave field, so the whole forest reacts to the water and to taps. ──────────
type Frond = { rootX: number; height: number; width: number; phase: number; freq: number; amp: number; segs: number; layer: number; edgePhase: number };

const FROND_COLORS = [
  { a: 0.5,  c0: "14,50,34",  c1: "28,82,46",   c2: "46,104,54" },  // back / deep
  { a: 0.78, c0: "20,66,40",  c1: "46,116,56",  c2: "98,158,70" },  // mid
  { a: 0.92, c0: "26,80,46",  c1: "78,150,66",  c2: "182,204,96" }, // front / golden tips
];

function drawFrond(ctx: CanvasRenderingContext2D, f: Frond, H: number, t: number, dhx: number) {
  const col = FROND_COLORS[f.layer], segs = f.segs, halfBase = f.width * 0.5;
  // Sideways offset: planted base, sway growing toward the tip, plus wave lean.
  const off = (u: number) =>
    f.amp * Math.pow(u, 1.4) * Math.sin(t * f.freq - u * 2.3 + f.phase) + (16 + f.layer * 7) * u * dhx;
  // Undulating blade width so the edge ripples like a real kelp leaf.
  const hwAt = (u: number) =>
    halfBase * (1 - u * 0.6) * (0.82 + 0.18 * Math.sin(u * 6 + f.edgePhase + t * f.freq * 0.6));

  const g = ctx.createLinearGradient(0, H, 0, H - f.height);
  g.addColorStop(0, `rgba(${col.c0},${col.a})`);
  g.addColorStop(0.55, `rgba(${col.c1},${col.a})`);
  g.addColorStop(1, `rgba(${col.c2},${col.a * 0.8})`);
  ctx.fillStyle = g;

  ctx.beginPath();
  for (let i = 0; i <= segs; i++) {
    const u = i / segs, x = f.rootX + off(u), y = H - u * f.height, hw = hwAt(u);
    if (i === 0) ctx.moveTo(x - hw, y); else ctx.lineTo(x - hw, y);
  }
  for (let i = segs; i >= 0; i--) {
    const u = i / segs, x = f.rootX + off(u), y = H - u * f.height, hw = hwAt(u);
    ctx.lineTo(x + hw, y);
  }
  ctx.closePath();
  ctx.fill();
}

// ── Leaves ──────────────────────────────────────────────────────────────────────
type LeafKind = "maple" | "aspen" | "lily";
type Leaf = {
  kind: LeafKind;
  x: number; y: number; vx: number; vy: number;   // vx/vy in px per ms
  rot: number;
  bobA: number; bobW: number; bobP: number;        // idle vertical bob
  swayA: number; swayW: number; swayP: number;     // idle rotation sway
  size: number; sprite: HTMLCanvasElement; sw: number; seed: number;
};

const MAPLE_COLORS: [number, number, number][] = [
  [206, 78, 44], [222, 110, 40], [196, 54, 48], [228, 156, 52], [176, 64, 70],
];
const ASPEN_COLORS: [number, number, number][] = [
  [214, 178, 70], [200, 196, 96], [168, 186, 92], [224, 196, 96], [188, 158, 64],
];
const LILY_COLORS: [number, number, number][] = [
  [86, 138, 74], [104, 152, 80], [72, 120, 64],
];

function veinStroke(ctx: CanvasRenderingContext2D, dr: number, dg: number, db: number, w: number) {
  ctx.strokeStyle = `rgba(${dr},${dg},${db},0.55)`;
  ctx.lineWidth = w; ctx.lineCap = "round";
}
function paintMaple(ctx: CanvasRenderingContext2D, s: number, r: number, g: number, b: number) {
  const dr = (r * 0.6) | 0, dg = (g * 0.6) | 0, db = (b * 0.6) | 0;
  const tips = [-200, -145, -90, -35, 20].map((d) => (d * Math.PI) / 180);
  const grad = ctx.createRadialGradient(0, 0, s * 0.1, 0, 0, s);
  grad.addColorStop(0, `rgb(${Math.min(255, r + 18)},${Math.min(255, g + 18)},${Math.min(255, b + 12)})`);
  grad.addColorStop(1, `rgb(${r},${g},${b})`);
  ctx.fillStyle = grad;
  for (const a of tips) {
    const tx = Math.cos(a) * s, ty = Math.sin(a) * s;
    const lx = Math.cos(a - 0.3) * s * 0.42, ly = Math.sin(a - 0.3) * s * 0.42;
    const rx = Math.cos(a + 0.3) * s * 0.42, ry = Math.sin(a + 0.3) * s * 0.42;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(lx, ly, tx, ty); ctx.quadraticCurveTo(rx, ry, 0, 0); ctx.closePath(); ctx.fill();
  }
  ctx.beginPath(); ctx.arc(0, 0, s * 0.34, 0, Math.PI * 2); ctx.fill();
  veinStroke(ctx, dr, dg, db, Math.max(0.5, s * 0.035));
  for (const a of tips) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * s * 0.9, Math.sin(a) * s * 0.9); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(0, s * 0.2); ctx.lineTo(0, s * 0.7); ctx.stroke();
}
function paintAspen(ctx: CanvasRenderingContext2D, s: number, r: number, g: number, b: number) {
  const dr = (r * 0.6) | 0, dg = (g * 0.6) | 0, db = (b * 0.6) | 0;
  const grad = ctx.createLinearGradient(0, -s, 0, s);
  grad.addColorStop(0, `rgb(${Math.min(255, r + 16)},${Math.min(255, g + 16)},${Math.min(255, b + 10)})`);
  grad.addColorStop(1, `rgb(${dr + 20},${dg + 20},${db + 14})`);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.quadraticCurveTo(s * 0.92, -s * 0.18, s * 0.5, s * 0.5);
  ctx.quadraticCurveTo(s * 0.16, s * 0.82, 0, s * 0.9);
  ctx.quadraticCurveTo(-s * 0.16, s * 0.82, -s * 0.5, s * 0.5);
  ctx.quadraticCurveTo(-s * 0.92, -s * 0.18, 0, -s);
  ctx.closePath(); ctx.fill();
  veinStroke(ctx, dr, dg, db, Math.max(0.5, s * 0.04));
  ctx.beginPath(); ctx.moveTo(0, -s * 0.9); ctx.lineTo(0, s * 0.86); ctx.stroke();
  ctx.lineWidth = Math.max(0.4, s * 0.028);
  for (let i = 0; i < 3; i++) {
    const yy = -s * 0.5 + i * s * 0.45;
    ctx.beginPath(); ctx.moveTo(0, yy); ctx.quadraticCurveTo(s * 0.3, yy + s * 0.1, s * 0.55, yy + s * 0.28); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, yy); ctx.quadraticCurveTo(-s * 0.3, yy + s * 0.1, -s * 0.55, yy + s * 0.28); ctx.stroke();
  }
}
function paintLily(ctx: CanvasRenderingContext2D, s: number, r: number, g: number, b: number) {
  const dr = (r * 0.62) | 0, dg = (g * 0.62) | 0, db = (b * 0.62) | 0;
  const notch = 0.34;
  const grad = ctx.createRadialGradient(0, 0, s * 0.1, 0, 0, s);
  grad.addColorStop(0, `rgb(${Math.min(255, r)},${Math.min(255, g + 30)},${b})`);
  grad.addColorStop(1, `rgb(${r},${g},${b})`);
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.arc(0, 0, s, Math.PI / 2 + notch, Math.PI / 2 - notch + Math.PI * 2); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = `rgba(${Math.min(255, r + 60)},${Math.min(255, g + 50)},${b},0.18)`;
  for (let i = 0; i < 5; i++) {
    const a = rnd(0, Math.PI * 2), rr = rnd(s * 0.2, s * 0.8);
    ctx.beginPath(); ctx.ellipse(Math.cos(a) * rr, Math.sin(a) * rr, s * 0.18, s * 0.12, a, 0, Math.PI * 2); ctx.fill();
  }
  veinStroke(ctx, dr, dg, db, Math.max(0.4, s * 0.025));
  for (let i = 0; i < 9; i++) {
    const a = Math.PI / 2 + notch + (i / 9) * (Math.PI * 2 - notch * 2);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * s * 0.94, Math.sin(a) * s * 0.94); ctx.stroke();
  }
}
function makeLeafSprite(kind: LeafKind, size: number, dpr: number): HTMLCanvasElement {
  const pad = size * 0.7;
  const dim = (size + pad) * 2;
  const cv = document.createElement("canvas");
  cv.width = Math.ceil(dim * dpr); cv.height = Math.ceil(dim * dpr);
  const ctx = cv.getContext("2d")!;
  ctx.scale(dpr, dpr); ctx.translate(dim / 2, dim / 2);
  const pick = (arr: [number, number, number][]) => arr[rndI(0, arr.length - 1)];
  const [r, g, b] = kind === "maple" ? pick(MAPLE_COLORS) : kind === "aspen" ? pick(ASPEN_COLORS) : pick(LILY_COLORS);
  const paint = kind === "maple" ? paintMaple : kind === "aspen" ? paintAspen : paintLily;

  // Soft, leaf-SHAPED shadow pressed into the water (no circle around the leaf).
  ctx.save();
  ctx.translate(size * 0.06, size * 0.12);
  ctx.filter = `blur(${Math.max(1, size * 0.16)}px)`;
  ctx.globalAlpha = 0.3;
  paint(ctx, size, 8, 16, 18);
  ctx.restore();
  ctx.filter = "none";
  ctx.globalAlpha = 1;

  paint(ctx, size, r, g, b);
  return cv;
}

// Blurred dark silhouette of a real leaf photo, for a soft shadow on the water.
function makeImageShadow(img: HTMLImageElement): HTMLCanvasElement {
  const pad = 10;
  const c = document.createElement("canvas");
  c.width = img.width + pad * 2; c.height = img.height + pad * 2;
  const cx = c.getContext("2d")!;
  cx.filter = "blur(5px)";
  cx.drawImage(img, pad, pad);
  cx.filter = "none";
  cx.globalCompositeOperation = "source-in";
  cx.fillStyle = "rgba(6,16,20,0.55)";
  cx.fillRect(0, 0, c.width, c.height);
  return c;
}

export function PondCanvas() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const rafRef      = useRef(0);
  const leavesRef   = useRef<Leaf[]>([]);
  const assetsRef   = useRef<{ img: HTMLImageElement; shadow: HTMLCanvasElement }[]>([]);
  const forestsRef  = useRef<HTMLImageElement[]>([]);
  const forestTxRef = useRef<{ w: number; h: number; aIdx: number; bIdx: number; a: HTMLCanvasElement; b: HTMLCanvasElement | null; mode: "hold" | "fade"; phase: number; tMark: number } | null>(null);
  const frondsRef   = useRef<Frond[]>([]);
  const lastPtrRef  = useRef({ x: -9999, y: -9999 });
  const t0Ref       = useRef(0);
  const lastTRef    = useRef(0);
  const accRef      = useRef(0);
  const nextAmbient = useRef(0);

  const simRef = useRef<{
    gw: number; gh: number;
    cur: Float32Array; old: Float32Array; surf: Float32Array;
    water: Uint8ClampedArray; win: Float32Array;
    field: HTMLCanvasElement; fctx: CanvasRenderingContext2D; img: ImageData;
    rays: { x: number; w: number; skew: number; phase: number }[];
  } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    // Real leaf photos, if present at /public/leaves/leaf-01.png … leaf-20.png.
    // Whichever load are used as sprites; otherwise the drawn leaves are the fallback.
    const assets: { img: HTMLImageElement; shadow: HTMLCanvasElement }[] = [];
    assetsRef.current = assets;
    for (let n = 1; n <= 40; n++) {
      const im = new Image();
      im.decoding = "async";
      im.onload = () => { if (im.width > 0) assets.push({ img: im, shadow: makeImageShadow(im) }); };
      im.onerror = () => {};
      im.src = `/leaves/leaf-${String(n).padStart(2, "0")}.png`;
    }
    // Underwater forest photos for the deep backdrop (/public/images/forest-NN.jpg).
    const forests: HTMLImageElement[] = [];
    forestsRef.current = forests;
    for (let n = 1; n <= 20; n++) {
      const im = new Image();
      im.decoding = "async";
      im.onload = () => { if (im.width > 0) forests.push(im); };
      im.onerror = () => {};
      im.src = `/images/forest-${String(n).padStart(2, "0")}.jpg`;
    }

    function build() {
      if (!canvas) return;
      const W = window.innerWidth, H = window.innerHeight;
      canvas.width = W; canvas.height = H;
      const gw = Math.max(8, Math.ceil(W / SCALE));
      const gh = Math.max(8, Math.ceil(H / SCALE));
      const field = document.createElement("canvas");
      field.width = gw; field.height = gh;
      const fctx = field.getContext("2d")!;
      const rays = Array.from({ length: 6 }, () => ({ x: rnd(W * 0.15, W * 0.85), w: rnd(W * 0.04, W * 0.12), skew: rnd(-W * 0.12, W * 0.18), phase: rnd(0, Math.PI * 2) }));
      simRef.current = {
        gw, gh,
        cur: new Float32Array(gw * gh), old: new Float32Array(gw * gh), surf: new Float32Array(gw * gh),
        water: bakeWater(gw, gh), win: bakeWindows(gw, gh),
        field, fctx, img: fctx.createImageData(gw, gh), rays,
      };

      // Just a little grass here and there — a few short tufts along the bottom.
      const clusters = Math.round(clamp(W / 360, 3, 7));
      const fronds: Frond[] = [];
      for (let c = 0; c < clusters; c++) {
        const cx = rnd(W * 0.04, W * 0.96);
        const blades = rndI(2, 4);
        for (let j = 0; j < blades; j++) {
          fronds.push({
            rootX: cx + rnd(-22, 22),
            height: rnd(H * 0.08, H * 0.2),
            width: rnd(4, 8),
            phase: rnd(0, Math.PI * 2),
            freq: rnd(0.0006, 0.0011),
            amp: rnd(7, 14),
            segs: 12,
            layer: Math.random() < 0.5 ? 1 : 2,
            edgePhase: rnd(0, Math.PI * 2),
          });
        }
      }
      frondsRef.current = fronds.sort((a, b) => a.layer - b.layer);

      // Density scales with screen area so big screens stay full of leaves.
      const LEAF_COUNT = Math.round(clamp((W * H) / 26000, 48, 110));
      const kindsPool: LeafKind[] = ["aspen", "aspen", "maple", "maple", "lily"];
      leavesRef.current = Array.from({ length: LEAF_COUNT }, () => {
        const kind = kindsPool[rndI(0, kindsPool.length - 1)];
        const size = kind === "lily" ? rnd(20, 32) : rnd(12, 28);
        const sprite = makeLeafSprite(kind, size, dpr);
        const ang = rnd(Math.PI * 0.1, Math.PI * 0.4);
        const drift = rnd(0.004, 0.012); // px per ms — slow current
        return {
          kind, x: rnd(0, W), y: rnd(0, H),
          vx: Math.cos(ang) * drift, vy: Math.sin(ang) * drift,
          rot: rnd(0, Math.PI * 2),
          bobA: rnd(2.5, 5.5), bobW: rnd(0.0008, 0.0016), bobP: rnd(0, Math.PI * 2),
          swayA: rnd(0.05, 0.13), swayW: rnd(0.0005, 0.0012), swayP: rnd(0, Math.PI * 2),
          size, sprite, sw: sprite.width / dpr, seed: rndI(0, 9999),
        };
      });
    }
    build();
    // On mobile the address bar shows/hides while scrolling, firing `resize` with
    // only a small height change. Ignore those so we don't rebuild every scroll
    // frame (jank) or reset the forest crossfade. Only real size changes rebuild.
    let lastW = window.innerWidth, lastH = window.innerHeight;
    const onResize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      if (w === lastW && Math.abs(h - lastH) < 140) return;
      lastW = w; lastH = h;
      build();
    };
    window.addEventListener("resize", onResize, { passive: true });


    function disturb(sx: number, sy: number, strength: number) {
      const sim = simRef.current;
      if (!sim) return;
      const gx = Math.round(sx / SCALE), gy = Math.round(sy / SCALE), rad = 2;
      for (let dy = -rad; dy <= rad; dy++)
        for (let dx = -rad; dx <= rad; dx++) {
          const xx = gx + dx, yy = gy + dy;
          if (xx < 1 || yy < 1 || xx >= sim.gw - 1 || yy >= sim.gh - 1) continue;
          const fall = 1 - (dx * dx + dy * dy) / (rad * rad + 1.2);
          if (fall > 0) sim.cur[yy * sim.gw + xx] -= strength * fall;
        }
    }
    const onMove = (e: PointerEvent) => {
      const last = lastPtrRef.current;
      if (last.x > -9000) {
        const dx = e.clientX - last.x, dy = e.clientY - last.y, dist = Math.hypot(dx, dy);
        const strength = clamp(dist * 0.12, 0, 2);
        if (strength > 0.3) { const steps = Math.min(5, Math.ceil(dist / SCALE)); for (let i = 1; i <= steps; i++) disturb(last.x + (dx * i) / steps, last.y + (dy * i) / steps, strength); }
      }
      lastPtrRef.current = { x: e.clientX, y: e.clientY };
    };
    const onDown = (e: PointerEvent) => { lastPtrRef.current = { x: e.clientX, y: e.clientY }; disturb(e.clientX, e.clientY, 5); };
    const onLeave = () => { lastPtrRef.current = { x: -9999, y: -9999 }; };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointercancel", onLeave);
    window.addEventListener("mouseleave", onLeave);

    t0Ref.current = performance.now();
    lastTRef.current = t0Ref.current;
    nextAmbient.current = t0Ref.current + rnd(1400, 2600);

    function stepWaves() {
      const sim = simRef.current!;
      const { gw, gh } = sim, cur = sim.cur, old = sim.old;
      for (let y = 1; y < gh - 1; y++) {
        const rowi = y * gw;
        for (let x = 1; x < gw - 1; x++) {
          const i = rowi + x;
          let v = (cur[i - 1] + cur[i + 1] + cur[i - gw] + cur[i + gw]) * 0.5 - old[i];
          v *= RIPPLE_DAMP; old[i] = v;
        }
      }
      sim.cur = old; sim.old = cur;
    }

    function loop() {
      if (!canvas || !ctx) return;
      if (document.visibilityState === "hidden") { lastTRef.current = performance.now(); rafRef.current = requestAnimationFrame(loop); return; }
      const sim = simRef.current;
      if (!sim) { rafRef.current = requestAnimationFrame(loop); return; }

      const W = canvas.width, H = canvas.height;
      const now = performance.now();
      const t = now - t0Ref.current;
      let dt = now - lastTRef.current; lastTRef.current = now;
      if (dt > 64) dt = 64; // clamp after tab was hidden

      if (now >= nextAmbient.current) { disturb(rnd(0, W), rnd(0, H), rnd(0.8, 1.8)); nextAmbient.current = now + rnd(1400, 2800); }

      // Fixed-timestep ripple sim → identical speed regardless of display refresh.
      accRef.current += dt;
      let guard = 0;
      while (accRef.current >= STEP_MS && guard < 4) { stepWaves(); accRef.current -= STEP_MS; guard++; }
      const h = sim.cur;
      const { gw, gh } = sim;

      // Surface height = interactive ripples + slow swell (LUT, cheap).
      const surf = sim.surf;
      for (let y = 0; y < gh; y++) { const rowi = y * gw; for (let x = 0; x < gw; x++) { const i = rowi + x; surf[i] = h[i] + swellAt(x, y, t); } }

      const flowOX = (t * 0.004) | 0, flowOY = (t * 0.003) | 0; // swirls drift slowly

      // ── Render: deep teal water with drifting emerald swirls ─────────────────
      const px = sim.img.data, water = sim.water, win = sim.win;
      let p = 0;
      for (let y = 0; y < gh; y++) {
        for (let x = 0; x < gw; x++) {
          const i = y * gw + x;
          const iL = x > 0 ? i - 1 : i, iR = x < gw - 1 ? i + 1 : i;
          const iU = y > 0 ? i - gw : i, iD = y < gh - 1 ? i + gw : i;
          const dhx = surf[iR] - surf[iL], dhy = surf[iD] - surf[iU];
          const ox = (dhx * REFRACT) | 0, oy = (dhy * REFRACT) | 0;

          // Sample the swirly teal water, drifting + bending with the surface.
          let sx = (x + ox + flowOX) % gw; if (sx < 0) sx += gw;
          let syy = (y + oy + flowOY) % gh; if (syy < 0) syy += gh;
          const wi = (syy * gw + sx) * 3;
          let r = water[wi], g = water[wi + 1], b = water[wi + 2];

          // Crest highlight where the surface catches the light.
          const sl = dhx * 0.6 - dhy * 0.45;
          if (sl > 0) { const spec = Math.min(0.5, sl * 2.4); r = lerp(r, 220, spec); g = lerp(g, 246, spec); b = lerp(b, 236, spec); }

          px[p] = r; px[p + 1] = g; px[p + 2] = b; px[p + 3] = 116 - win[i] * 78; p += 4;
        }
      }
      sim.fctx.putImageData(sim.img, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.clearRect(0, 0, W, H);
      // Lush underwater forest background — slowly crossfading through ALL the
      // provided photos. Both layers are sheared by the same wave motion, so the
      // crossfade reads as the current shifting the scene, not a hard cut.
      const forests = forestsRef.current;
      if (forests.length) {
        const M = FOREST_MARGIN, STRIP = 6, cgx = (gw / 2) | 0;
        const shearForest = (bg: HTMLCanvasElement, alpha: number) => {
          ctx.globalAlpha = alpha;
          for (let ry = 0; ry < H; ry += STRIP) {
            const gy = clamp(Math.round(ry / SCALE), 1, gh - 2);
            const dhxRow = surf[gy * gw + cgx + 1] - surf[gy * gw + cgx - 1];
            let off = Math.sin(ry * 0.012 + t * 0.00018) * 8 + dhxRow * 4;
            if (off > M - 1) off = M - 1; else if (off < -(M - 1)) off = -(M - 1);
            ctx.drawImage(bg, M - off, ry, W, STRIP + 1, 0, ry, W, STRIP + 1);
          }
          ctx.globalAlpha = 1;
        };

        let tx = forestTxRef.current;
        if (!tx) {
          const aIdx = (Math.random() * forests.length) | 0;
          tx = { w: W, h: H, aIdx, bIdx: -1, a: buildForestBg(forests[aIdx], W, H), b: null, mode: "hold", phase: 0, tMark: t + FOREST_HOLD };
          forestTxRef.current = tx;
        } else if (tx.w !== W || tx.h !== H) {
          // Size changed — rebuild the canvases but keep the crossfade going.
          tx.w = W; tx.h = H;
          tx.a = buildForestBg(forests[tx.aIdx], W, H);
          if (tx.b && tx.bIdx >= 0) tx.b = buildForestBg(forests[tx.bIdx], W, H);
        }
        if (tx.mode === "hold" && forests.length > 1 && t >= tx.tMark) {
          let bIdx = (Math.random() * forests.length) | 0;
          if (bIdx === tx.aIdx) bIdx = (bIdx + 1) % forests.length;
          tx.bIdx = bIdx; tx.b = buildForestBg(forests[bIdx], W, H); tx.mode = "fade"; tx.tMark = t;
        }
        if (tx.mode === "fade") {
          tx.phase = (t - tx.tMark) / FOREST_FADE;
          if (tx.phase >= 1 && tx.b) { tx.aIdx = tx.bIdx; tx.a = tx.b; tx.b = null; tx.mode = "hold"; tx.phase = 0; tx.tMark = t + FOREST_HOLD; }
        }
        shearForest(tx.a, 1);
        if (tx.mode === "fade" && tx.b) {
          const p = tx.phase * tx.phase * (3 - 2 * tx.phase); // smoothstep ease
          shearForest(tx.b, p);
        }
      } else {
        ctx.fillStyle = "rgb(7,40,56)"; ctx.fillRect(0, 0, W, H);
      }
      // Light teal water veil over the forest (kept low so the forest stays lush).
      ctx.drawImage(sim.field, 0, 0, gw, gh, 0, 0, W, H);

      // ── Interactive kelp forest, swaying with the current + bending with waves ──
      for (const f of frondsRef.current) {
        const sgx = clamp(Math.round(f.rootX / SCALE), 1, gw - 2);
        const sgy = clamp(Math.round((H - f.height * 0.4) / SCALE), 1, gh - 2);
        const dhx = surf[sgy * gw + sgx + 1] - surf[sgy * gw + sgx - 1];
        drawFrond(ctx, f, H, t, dhx);
      }

      // ── Soft sun bloom + gentle god-ray light (heavily blurred so the shafts
      // read as soft light, not hard triangles) ────────────────────────────────
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const sunX = W * 0.5 + Math.sin(t * 0.0001) * W * 0.1;
      const bloom = ctx.createRadialGradient(sunX, -H * 0.12, 0, sunX, -H * 0.12, H * 0.85);
      bloom.addColorStop(0, "rgba(224,255,236,0.2)");
      bloom.addColorStop(0.45, "rgba(150,228,204,0.06)");
      bloom.addColorStop(1, "rgba(150,228,204,0)");
      ctx.fillStyle = bloom; ctx.fillRect(0, 0, W, H);
      ctx.filter = `blur(${Math.round(W * 0.035)}px)`;
      for (const ry of sim.rays) {
        const a = 0.022 + 0.018 * (0.5 + 0.5 * Math.sin(t * 0.0004 + ry.phase));
        const x0 = ry.x + Math.sin(t * 0.00012 + ry.phase) * 40;
        const grad = ctx.createLinearGradient(x0, 0, x0 + ry.skew, H);
        grad.addColorStop(0, `rgba(228,255,238,${a})`);
        grad.addColorStop(0.7, `rgba(172,236,206,${a * 0.35})`);
        grad.addColorStop(1, "rgba(172,236,206,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(x0 - ry.w * 0.6, 0); ctx.lineTo(x0 + ry.w * 0.6, 0);
        ctx.lineTo(x0 + ry.skew + ry.w * 1.8, H); ctx.lineTo(x0 + ry.skew - ry.w * 1.8, H);
        ctx.closePath(); ctx.fill();
      }
      ctx.filter = "none";
      ctx.restore();

      // ── Leaves: drift + idle bob/sway + ride the swell + react to ripples ────
      for (const lf of leavesRef.current) {
        lf.x += lf.vx * dt; lf.y += lf.vy * dt;
        const m = lf.sw;
        if (lf.x < -m) lf.x = W + m; else if (lf.x > W + m) lf.x = -m;
        if (lf.y < -m) lf.y = H + m; else if (lf.y > H + m) lf.y = -m;

        const gx = clamp(Math.round(lf.x / SCALE), 1, gw - 2);
        const gy = clamp(Math.round(lf.y / SCALE), 1, gh - 2);
        const gi = gy * gw + gx;
        const dhx = surf[gi + 1] - surf[gi - 1];

        const idleBob = lf.bobA * Math.sin(t * lf.bobW + lf.bobP);
        const idleSway = lf.swayA * Math.sin(t * lf.swayW + lf.swayP);
        const bob = surf[gi] * 0.5 + idleBob;     // ride the swell + own bob
        const tilt = idleSway + dhx * 0.04;        // rock gently + react to ripples

        ctx.save();
        ctx.translate(lf.x, lf.y + bob);
        ctx.rotate(lf.rot + tilt);
        const assets = assetsRef.current;
        if (assets.length) {
          const a = assets[lf.seed % assets.length];
          const k = (lf.size * 2.1) / Math.max(a.img.width, a.img.height);
          const dw = a.img.width * k, dh = a.img.height * k;
          ctx.globalAlpha = 0.5;
          ctx.drawImage(a.shadow, -dw / 2 + dw * 0.05, -dh / 2 + dh * 0.1, dw * 1.06, dh * 1.06);
          ctx.globalAlpha = 1;
          ctx.drawImage(a.img, -dw / 2, -dh / 2, dw, dh);
        } else {
          ctx.drawImage(lf.sprite, -lf.sw / 2, -lf.sw / 2, lf.sw, lf.sw);
        }
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointercancel", onLeave);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.95 }}
    />
  );
}
