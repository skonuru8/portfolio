"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useDeviceTier } from "@/lib/device-tier";
import { useTheme } from "@/lib/theme";

// ═══════════════════════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════════════════════

const STAR_COUNT      = 7500;
const BRIGHT_COUNT    = 22;
const NEBULA_COUNT    = 5;
const GALAXY_COUNT    = 5;
const BLACKHOLE_COUNT = 1;

// Planetary rotation — the whole sky wheels around screen center.
const ROTATION_SPEED = 0.010 * (Math.PI / 180); // ~0.010 deg/frame in radians
// Flattened sky-dome: vertical extent compressed so it reads like looking up.
const PERSPECTIVE_Y = 0.55;
// Stars populate a sphere reaching well past the viewport corners.
const SKY_RADIUS_FACTOR = 1.4;

// Cursor gravity well
const GRAVITY_R = 240;
const GRAVITY_F = 0.045;
const ORBIT_F   = 0.018;
const REPEL_R   = 50;
const MAX_SPEED = 2.2;
const DRAG      = 0.985;

// ═══════════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════════

type Star = {
  // Polar anchor relative to screen center — rotation advances baseAngle.
  baseAngle: number;
  orbitRadius: number;
  // Local drift offsets (proper motion + cursor gravity), in screen pixels.
  ox: number; oy: number;
  vx: number; vy: number;
  // Proper motion: each star's own slow velocity (depth parallax).
  pmx: number; pmy: number;
  size: number;
  alpha: number;
  twinklePhase: number; twinkleSpeed: number;
  r: number; g: number; b: number;
  hueOffset: number;
};

type BrightStar = {
  baseAngle: number;
  orbitRadius: number;
  size: number;
  spikeLen: number;
  r: number; g: number; b: number;
  twinklePhase: number; twinkleSpeed: number;
  alpha: number;
};

type Nebula = {
  baseAngle: number;
  orbitRadius: number;
  rx: number; ry: number;
  rotation: number;
  r: number; g: number; b: number;
  alpha: number;
};

type GalaxySprite = {
  baseAngle: number;
  orbitRadius: number;
  rx: number; ry: number;
  rotation: number;
  r: number; g: number; b: number;
};

type BlackHole = {
  baseAngle: number;
  orbitRadius: number;
  radius: number;
  diskRx: number; diskRy: number;
  rotation: number;
  spinAngle: number;
};

type Scene = {
  stars: Star[];
  brightStars: BrightStar[];
  nebulae: Nebula[];
  galaxies: GalaxySprite[];
  blackHoles: BlackHole[];
};

// ═══════════════════════════════════════════════════════════════════════════════
// Utilities
// ═══════════════════════════════════════════════════════════════════════════════

function hslRgb(h: number, s: number, l: number): [number, number, number] {
  const hh = ((h % 360) + 360) % 360 / 360;
  const q  = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p  = 2 * l - q;
  const ch = (t: number) => {
    const tt = ((t % 1) + 1) % 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 0.5)   return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  return [
    Math.round(ch(hh + 1 / 3) * 255),
    Math.round(ch(hh) * 255),
    Math.round(ch(hh - 1 / 3) * 255),
  ];
}

const rnd  = (a: number, b: number) => a + Math.random() * (b - a);
const rndI = (a: number, b: number) => Math.floor(rnd(a, b + 1));

function skyRadius(w: number, h: number): number {
  return Math.sqrt((w / 2) ** 2 + (h / 2) ** 2) * SKY_RADIUS_FACTOR;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Scene builders
// ═══════════════════════════════════════════════════════════════════════════════

// Realistic stellar color palette — spectral types O B A F G K M.
const SPECTRAL: [number, number, number][] = [
  [170, 191, 255], // O — hot blue       #aabfff
  [202, 215, 255], // B — blue-white     #cad7ff
  [248, 247, 255], // A — white          #f8f7ff
  [255, 244, 232], // F — yellow-white   #fff4e8
  [255, 237, 207], // G — yellow         #ffedcf
  [255, 218, 168], // K — orange         #ffdaa8
  [255, 190, 130], // M — red-orange     #ffbe82
];
const SPECTRAL_WEIGHTS = [0.03, 0.10, 0.30, 0.22, 0.18, 0.10, 0.07];

function pickSpectral(): [number, number, number] {
  let roll = Math.random();
  for (let i = 0; i < SPECTRAL_WEIGHTS.length; i++) {
    roll -= SPECTRAL_WEIGHTS[i];
    if (roll <= 0) return SPECTRAL[i];
  }
  return SPECTRAL[2];
}

function makeStars(w: number, h: number): Star[] {
  const R = skyRadius(w, h);
  return Array.from({ length: STAR_COUNT }, () => {
    const roll = Math.random();
    const size =
      roll < 0.006 ? rnd(2.0, 2.5)   // a tiny handful of brightest
      : roll < 0.04 ? rnd(1.0, 1.5)  // small-medium
      : rnd(0.12, 0.8);              // the vast majority — pinpoints

    const [r, g, b] = pickSpectral();
    // Uniform area distribution across the sky disc: r = R * sqrt(u).
    const orbitRadius = R * Math.sqrt(Math.random());
    return {
      baseAngle: rnd(0, Math.PI * 2),
      orbitRadius,
      ox: 0, oy: 0,
      vx: 0, vy: 0,
      pmx: rnd(-0.020, 0.020), pmy: rnd(-0.020, 0.020),
      size,
      alpha: rnd(0.20, 0.92),
      twinklePhase: rnd(0, Math.PI * 2),
      twinkleSpeed: size < 0.6 ? rnd(0.0016, 0.0042) : rnd(0.0006, 0.0018),
      r, g, b,
      hueOffset: rnd(0, 360),
    };
  });
}

const BRIGHT_SPECTRAL: [number, number, number][] = [
  [170, 191, 255], // blue supergiant (Rigel)
  [202, 215, 255], // blue-white (Vega, Spica)
  [248, 247, 255], // white (Sirius)
  [255, 244, 232], // yellow-white
  [255, 180, 100], // orange giant (Arcturus, Aldebaran)
  [255, 120, 80],  // red supergiant (Betelgeuse)
];

function makeBrightStars(w: number, h: number): BrightStar[] {
  const R = skyRadius(w, h);
  return Array.from({ length: BRIGHT_COUNT }, () => {
    const [r, g, b] = BRIGHT_SPECTRAL[rndI(0, BRIGHT_SPECTRAL.length - 1)];
    return {
      baseAngle: rnd(0, Math.PI * 2),
      orbitRadius: R * Math.sqrt(Math.random()) * 0.85,
      size: rnd(1.6, 3.0),
      spikeLen: rnd(14, 40),
      r, g, b,
      twinklePhase: rnd(0, Math.PI * 2),
      twinkleSpeed: rnd(0.0004, 0.0014),
      alpha: rnd(0.75, 1.0),
    };
  });
}

const NEBULA_DEFS = [
  { r: 210, g: 50,  b: 50  }, // emission — red hydrogen alpha
  { r: 50,  g: 90,  b: 210 }, // reflection — blue scattered light
  { r: 50,  g: 175, b: 120 }, // planetary — green-teal OIII
  { r: 170, g: 50,  b: 200 }, // mixed — magenta/purple
  { r: 200, g: 120, b: 50  }, // warm orange-brown
];

function makeNebulae(w: number, h: number): Nebula[] {
  const R = skyRadius(w, h);
  return Array.from({ length: NEBULA_COUNT }, (_, i) => {
    const d = NEBULA_DEFS[i % NEBULA_DEFS.length];
    return {
      baseAngle: rnd(0, Math.PI * 2),
      orbitRadius: R * Math.sqrt(Math.random()) * 0.7,
      rx: rnd(w * 0.10, w * 0.25), ry: rnd(h * 0.07, h * 0.16),
      rotation: rnd(0, Math.PI),
      r: d.r, g: d.g, b: d.b,
      alpha: rnd(0.025, 0.050),
    };
  });
}

function makeGalaxies(w: number, h: number): GalaxySprite[] {
  const R = skyRadius(w, h);
  return Array.from({ length: GALAXY_COUNT }, () => ({
    baseAngle: rnd(0, Math.PI * 2),
    orbitRadius: R * Math.sqrt(Math.random()) * 0.8,
    rx: rnd(18, 50), ry: rnd(6, 18),
    rotation: rnd(0, Math.PI),
    r: rndI(185, 255), g: rndI(185, 240), b: rndI(205, 255),
  }));
}

function makeBlackHoles(w: number, h: number): BlackHole[] {
  const R = skyRadius(w, h);
  return Array.from({ length: BLACKHOLE_COUNT }, () => ({
    baseAngle: rnd(0, Math.PI * 2),
    orbitRadius: R * 0.45 * Math.sqrt(Math.random()),
    radius: rnd(16, 26),
    diskRx: rnd(50, 85), diskRy: rnd(10, 20),
    rotation: rnd(0, Math.PI), spinAngle: 0,
  }));
}

function buildScene(w: number, h: number): Scene {
  return {
    stars:       makeStars(w, h),
    brightStars: makeBrightStars(w, h),
    nebulae:     makeNebulae(w, h),
    galaxies:    makeGalaxies(w, h),
    blackHoles:  makeBlackHoles(w, h),
  };
}

// Project a polar anchor (baseAngle, orbitRadius) through the current rotation
// onto a flattened sky-dome around (cx, cy).
function project(
  baseAngle: number, orbitRadius: number,
  rotation: number, cx: number, cy: number,
): [number, number] {
  const a = baseAngle + rotation;
  return [
    cx + Math.cos(a) * orbitRadius,
    cy + Math.sin(a) * orbitRadius * PERSPECTIVE_Y,
  ];
}

// ═══════════════════════════════════════════════════════════════════════════════
// Draw helpers
// ═══════════════════════════════════════════════════════════════════════════════

function drawNebula(ctx: CanvasRenderingContext2D, n: Nebula, x: number, y: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(n.rotation);
  ctx.scale(1, n.ry / n.rx);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, n.rx);
  g.addColorStop(0,    `rgba(${n.r},${n.g},${n.b},${n.alpha * 2.5})`);
  g.addColorStop(0.45, `rgba(${n.r},${n.g},${n.b},${n.alpha * 1.4})`);
  g.addColorStop(1,    `rgba(${n.r},${n.g},${n.b},0)`);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, n.rx, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawGalaxy(ctx: CanvasRenderingContext2D, gx: GalaxySprite, x: number, y: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(gx.rotation);

  ctx.save();
  ctx.scale(1, gx.ry / gx.rx);
  const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, gx.rx * 1.6);
  halo.addColorStop(0,   `rgba(${gx.r},${gx.g},${gx.b},0.18)`);
  halo.addColorStop(0.5, `rgba(${gx.r},${gx.g},${gx.b},0.06)`);
  halo.addColorStop(1,   `rgba(${gx.r},${gx.g},${gx.b},0)`);
  ctx.fillStyle = halo;
  ctx.beginPath(); ctx.arc(0, 0, gx.rx * 1.6, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.scale(1, gx.ry / gx.rx);
  const disk = ctx.createRadialGradient(0, 0, 0, 0, 0, gx.rx);
  disk.addColorStop(0,   `rgba(${gx.r},${gx.g},${gx.b},0.85)`);
  disk.addColorStop(0.35,`rgba(${gx.r},${gx.g},${gx.b},0.45)`);
  disk.addColorStop(0.7, `rgba(${gx.r},${gx.g},${gx.b},0.12)`);
  disk.addColorStop(1,   `rgba(${gx.r},${gx.g},${gx.b},0)`);
  ctx.fillStyle = disk;
  ctx.beginPath(); ctx.arc(0, 0, gx.rx, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  ctx.shadowBlur  = 5;
  ctx.shadowColor = `rgb(${gx.r},${gx.g},${gx.b})`;
  ctx.fillStyle   = `rgb(${gx.r},${gx.g},${gx.b})`;
  ctx.beginPath(); ctx.arc(0, 0, 2, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur  = 0;

  ctx.restore();
}

function drawBlackHole(ctx: CanvasRenderingContext2D, bh: BlackHole, t: number, x: number, y: number) {
  bh.spinAngle += 0.0035;

  ctx.save();
  ctx.translate(x, y);

  const lens = ctx.createRadialGradient(0, 0, bh.radius * 0.9, 0, 0, bh.radius * 4);
  lens.addColorStop(0,   "rgba(255,200,80,0.22)");
  lens.addColorStop(0.25,"rgba(180,100,30,0.09)");
  lens.addColorStop(0.6, "rgba(80,30,10,0.03)");
  lens.addColorStop(1,   "rgba(0,0,0,0)");
  ctx.fillStyle = lens;
  ctx.beginPath(); ctx.arc(0, 0, bh.radius * 4, 0, Math.PI * 2); ctx.fill();

  ctx.save();
  ctx.rotate(bh.rotation + bh.spinAngle * 0.08);
  ctx.beginPath();
  ctx.ellipse(0, 0, bh.diskRx, bh.diskRy, 0, Math.PI, Math.PI * 2);
  const dbk = ctx.createLinearGradient(-bh.diskRx, 0, bh.diskRx, 0);
  dbk.addColorStop(0,   "rgba(255,155,35,0.45)");
  dbk.addColorStop(0.5, "rgba(255,215,110,0.20)");
  dbk.addColorStop(1,   "rgba(195,75,18,0.38)");
  ctx.strokeStyle = dbk;
  ctx.lineWidth   = bh.diskRy * 0.65;
  ctx.stroke();
  ctx.restore();

  ctx.beginPath();
  ctx.arc(0, 0, bh.radius, 0, Math.PI * 2);
  ctx.fillStyle = "rgb(0,0,0)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 0, bh.radius * 1.07, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,205,95,0.52)";
  ctx.lineWidth   = 1.2;
  ctx.stroke();

  // Front half — doppler: left approaching (bright), right receding (dim).
  ctx.save();
  ctx.rotate(bh.rotation + bh.spinAngle * 0.08);
  ctx.beginPath();
  ctx.ellipse(0, 0, bh.diskRx, bh.diskRy, 0, 0, Math.PI);
  const dfr = ctx.createLinearGradient(-bh.diskRx, 0, bh.diskRx, 0);
  dfr.addColorStop(0,    "rgba(255,175,55,0.88)");
  dfr.addColorStop(0.3,  "rgba(255,238,175,0.70)");
  dfr.addColorStop(0.65, "rgba(255,198,75,0.55)");
  dfr.addColorStop(1,    "rgba(195,65,10,0.80)");
  ctx.strokeStyle = dfr;
  ctx.lineWidth   = bh.diskRy * 0.80;
  ctx.stroke();
  ctx.restore();

  const pulse = 0.09 + 0.04 * Math.sin(t * 0.0007);
  const corona = ctx.createRadialGradient(0, 0, 0, 0, 0, bh.radius * 1.7);
  corona.addColorStop(0, `rgba(255,175,50,${pulse})`);
  corona.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = corona;
  ctx.beginPath(); ctx.arc(0, 0, bh.radius * 1.7, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
}

function drawBrightStar(
  ctx: CanvasRenderingContext2D,
  s: BrightStar, t: number,
  x: number, y: number,
  cr: number, cg: number, cb: number,
) {
  const tw  = 0.65 + 0.35 * Math.sin(t * s.twinkleSpeed + s.twinklePhase);
  const len = s.spikeLen * (0.88 + 0.12 * tw);

  ctx.save();
  ctx.globalAlpha = s.alpha * tw;

  for (let k = 0; k < 4; k++) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((k / 4) * Math.PI);
    const sp = ctx.createLinearGradient(0, -len, 0, len);
    sp.addColorStop(0,    "rgba(255,255,255,0)");
    sp.addColorStop(0.42, `rgba(${cr},${cg},${cb},0.45)`);
    sp.addColorStop(0.5,  `rgba(${cr},${cg},${cb},0.85)`);
    sp.addColorStop(0.58, `rgba(${cr},${cg},${cb},0.45)`);
    sp.addColorStop(1,    "rgba(255,255,255,0)");
    ctx.strokeStyle = sp;
    ctx.lineWidth   = 0.9;
    ctx.beginPath(); ctx.moveTo(0, -len); ctx.lineTo(0, len); ctx.stroke();
    ctx.restore();
  }

  const halo = ctx.createRadialGradient(x, y, 0, x, y, s.size * 6);
  halo.addColorStop(0,   `rgba(${cr},${cg},${cb},0.70)`);
  halo.addColorStop(0.35,`rgba(${cr},${cg},${cb},0.16)`);
  halo.addColorStop(1,   "rgba(0,0,0,0)");
  ctx.fillStyle = halo;
  ctx.beginPath(); ctx.arc(x, y, s.size * 6, 0, Math.PI * 2); ctx.fill();

  ctx.shadowBlur  = s.size * 5;
  ctx.shadowColor = `rgb(${cr},${cg},${cb})`;
  ctx.fillStyle   = `rgb(${cr},${cg},${cb})`;
  ctx.beginPath(); ctx.arc(x, y, s.size, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();
}

// ═══════════════════════════════════════════════════════════════════════════════
// Canvas component
// ═══════════════════════════════════════════════════════════════════════════════

function GalaxyCanvas({ theme }: { theme: string }) {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const rafRef      = useRef(0);
  const sceneRef    = useRef<Scene | null>(null);
  const mouseRef    = useRef({ x: -9999, y: -9999, active: false });
  const rotationRef = useRef(0);
  const t0Ref       = useRef(0);

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
      sceneRef.current = buildScene(canvas.width, canvas.height);
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const onMove  = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY, active: true }; };
    const onLeave = ()              => { mouseRef.current.active = false; };
    window.addEventListener("mousemove",  onMove,  { passive: true });
    window.addEventListener("mouseleave", onLeave);

    function loop() {
      if (!canvas || !ctx) return;
      if (document.visibilityState === "hidden") { rafRef.current = requestAnimationFrame(loop); return; }

      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;
      const t = performance.now() - t0Ref.current;
      const scene = sceneRef.current;
      if (!scene) { rafRef.current = requestAnimationFrame(loop); return; }

      rotationRef.current += ROTATION_SPEED;
      const rot = rotationRef.current;

      const { x: mx, y: my, active } = mouseRef.current;
      const isRemix = theme === "remix";
      const isLight = theme === "light";

      ctx.clearRect(0, 0, W, H);

      // ── 1. Nebulae ───────────────────────────────────────────────────────────
      for (const n of scene.nebulae) {
        const [x, y] = project(n.baseAngle, n.orbitRadius, rot, cx, cy);
        drawNebula(ctx, n, x, y);
      }

      // ── 2. Distant galaxies ────────────────────────────────────────────────────
      ctx.globalAlpha = 1;
      for (const gx of scene.galaxies) {
        const [x, y] = project(gx.baseAngle, gx.orbitRadius, rot, cx, cy);
        drawGalaxy(ctx, gx, x, y);
      }

      // ── 3. Stars ───────────────────────────────────────────────────────────────
      for (const s of scene.stars) {
        const [bx, by] = project(s.baseAngle, s.orbitRadius, rot, cx, cy);

        // Proper motion accumulates as a slow local drift.
        s.ox += s.pmx;
        s.oy += s.pmy;

        let x = bx + s.ox;
        let y = by + s.oy;

        // Cursor gravity well — acts on the projected screen position.
        if (active) {
          const dx = mx - x, dy = my - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < GRAVITY_R && dist > 0.1) {
            const f = 1 - dist / GRAVITY_R, nx = dx / dist, ny = dy / dist;
            if (dist > REPEL_R) {
              s.vx += nx * GRAVITY_F * f;  s.vy += ny * GRAVITY_F * f;
              s.vx -= ny * ORBIT_F * f;    s.vy += nx * ORBIT_F * f;
            } else {
              s.vx -= nx * GRAVITY_F * 2.2; s.vy -= ny * GRAVITY_F * 2.2;
            }
          }
        }
        s.vx *= DRAG; s.vy *= DRAG;
        const spd = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
        if (spd > MAX_SPEED) { s.vx = (s.vx / spd) * MAX_SPEED; s.vy = (s.vy / spd) * MAX_SPEED; }
        s.ox += s.vx; s.oy += s.vy;
        x += s.vx; y += s.vy;

        if (x < -4 || x > W + 4 || y < -4 || y > H + 4) continue;

        const twAmp = s.size < 0.6 ? 0.50 : 0.30;
        const tw = (1 - twAmp) + twAmp * Math.sin(t * s.twinkleSpeed + s.twinklePhase);
        ctx.globalAlpha = s.alpha * tw;

        let sr = s.r, sg = s.g, sb = s.b;
        if (isRemix)      { [sr, sg, sb] = hslRgb((t * 0.009 + s.hueOffset) % 360, 0.80, 0.72); }
        else if (isLight) { sr = Math.round(sr * 0.22); sg = Math.round(sg * 0.28); sb = Math.round(sb * 0.50 + 55); }

        if (s.size >= 1.0) { ctx.shadowBlur = s.size * 3.5; ctx.shadowColor = `rgb(${sr},${sg},${sb})`; }
        ctx.fillStyle = `rgb(${sr},${sg},${sb})`;
        ctx.beginPath(); ctx.arc(x, y, s.size, 0, Math.PI * 2); ctx.fill();
        if (s.size >= 1.0) ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;

      // ── 4. Bright stars (diffraction spikes) ─────────────────────────────────
      for (const s of scene.brightStars) {
        const [x, y] = project(s.baseAngle, s.orbitRadius, rot, cx, cy);
        if (x < -60 || x > W + 60 || y < -60 || y > H + 60) continue;
        let br = s.r, bg = s.g, bb = s.b;
        if (isRemix) { [br, bg, bb] = hslRgb((t * 0.007 + s.twinklePhase * 50) % 360, 0.88, 0.74); }
        drawBrightStar(ctx, s, t, x, y, br, bg, bb);
      }
      ctx.globalAlpha = 1;

      // ── 5. Black hole ───────────────────────────────────────────────────────────
      for (const bh of scene.blackHoles) {
        const [x, y] = project(bh.baseAngle, bh.orbitRadius, rot, cx, cy);
        drawBlackHole(ctx, bh, t, x, y);
      }
      ctx.globalAlpha = 1;

      // ── 6. Cursor nebula glow ────────────────────────────────────────────────
      if (active) {
        const ng = ctx.createRadialGradient(mx, my, 0, mx, my, 280);
        if (isRemix) {
          const h = (t * 0.012) % 360;
          ng.addColorStop(0,   `hsla(${h},78%,34%,0.10)`);
          ng.addColorStop(0.4, `hsla(${(h + 50) % 360},58%,24%,0.04)`);
        } else if (isLight) {
          ng.addColorStop(0,   "rgba(38,78,158,0.06)");
          ng.addColorStop(0.4, "rgba(18,48,118,0.02)");
        } else {
          ng.addColorStop(0,   "rgba(88,48,158,0.08)");
          ng.addColorStop(0.4, "rgba(38,18,98,0.03)");
        }
        ng.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = ng;
        ctx.fillRect(0, 0, W, H);
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    t0Ref.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize",     resize);
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [theme]);

  const isLight = theme === "light";

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position:      "fixed",
        inset:         0,
        pointerEvents: "none",
        zIndex:        1,
        mixBlendMode:  (isLight ? "multiply" : "screen") as React.CSSProperties["mixBlendMode"],
        opacity:       isLight ? 0.72 : 1,
      }}
    />
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function FluidCursor() {
  const tier   = useDeviceTier();
  const reduce = useReducedMotion();
  const { theme } = useTheme();

  if (tier !== "a") return null;
  if (reduce) return null;

  return <GalaxyCanvas theme={theme} />;
}
