# Portfolio Responsive + Low-End Device Hardening

**For:** Sri Sai Sarath Chandra Konuru
**Project:** Portfolio V2.x — hardening pass
**Hand-off target:** Claude agent in Cursor
**Constraint:** the site must remain usable and smooth on slow devices **even when `prefers-reduced-motion` is off**

---

## 0. Why this pass exists

Your V2 + V2.1 already handle two cases well: full-power desktop, and any user who has explicitly enabled reduced motion. The hard case is the silent middle: a recruiter on an older Android phone, a Chromebook with 2GB of RAM, an iPhone 8, a corporate laptop with hardware acceleration disabled — none of whom have set the reduced-motion preference, but all of whom will see your site stutter on scroll because:

- The cursor aura is a 600×600 px blurred radial gradient at `mix-blend-mode: screen` — one of the most expensive composite operations in the browser
- Five infinite CSS animations are running simultaneously (`motion-gradient`, `liquid-bg`, `metric-card-edge`, `liquid-blob-before`, `ambient-shift` if active)
- GSAP ScrollTrigger with `scrub: 0.6` does work on every scroll event for `DecisionTrace` and three `PressureDollyZoom` instances
- Framer Motion is now bidirectional — every Reveal animates both directions, so the motion budget is roughly **2x** what it was in V1
- The grain texture is a fixed-position SVG noise overlay over the entire viewport

On a strong device this all coexists fine. On a weak one it shows up as scroll jank, dropped frames, hot battery, and visible stutter when cards appear.

This document specifies a **3-tier device model**, a detection hook, per-tier effect rules, responsive breakpoint policy, image/asset discipline, and a phased implementation plan. Hand it to your Cursor agent.

---

## 1. The device tier model

Three tiers. Every component checks its tier before deciding what to render.

| Tier | Name | Trigger conditions | Motion policy |
|---|---|---|---|
| **A** | **Full** | Hover-capable pointer, ≥ 4GB RAM, ≥ 4 CPU cores, fast network, no Save-Data | Everything on, including bidirectional reveals, cursor aura, all gradients |
| **B** | **Lean** | Touch-only OR (≤ 2GB RAM) OR (≤ 2 cores) OR slow connection OR Save-Data | One-shot reveals (no bidirectional reverse), cursor aura OFF, ambient gradients reduced, blob-drift OFF, GSAP scrub OFF (snap to end states) |
| **C** | **Static** | `prefers-reduced-motion: reduce` (already implemented) | All resolved states rendered statically; no animation runs |

Tier C is what your codebase already handles. This pass adds Tier B as a new middle path, and explicitly defines Tier A as "everything else."

**Important:** Tier B is the new default for any device that *fails* one of the Tier A checks. We do not need 100% accuracy — we need to be conservative. False positives (a fast device gets Tier B) are mildly disappointing. False negatives (a slow device gets Tier A) cause visible jank, which is much worse.

---

## 2. The detection hook

Create `lib/device-tier.ts` (a new file). It exposes one hook: `useDeviceTier()`.

### Behavior

- Read all signals once on first client render (no SSR access — these APIs aren't available server-side).
- Returns one of `"a" | "b" | "c"`.
- The result must be stable across the session (do not re-evaluate on every render).
- Cache the result in `sessionStorage` so it doesn't oscillate during a session if the user switches networks or the device throttles.

### Signals to check, in order

```ts
function detectDeviceTier(): "a" | "b" | "c" {
  // 1. Reduced motion → tier C immediately
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "c";
  }

  // Collect "lean" signals
  let leanScore = 0;

  // 2. Touch-only device (no fine pointer) → +1 lean
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    leanScore += 1;
  }

  // 3. Device memory — Chrome/Edge/Opera only; older Safari and Firefox do not expose this
  // navigator.deviceMemory returns approximate RAM in GB, capped at 8.
  // Treat undefined as "don't know" → no penalty
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (typeof mem === "number" && mem <= 2) {
    leanScore += 2;          // strong signal — heavy weight
  } else if (typeof mem === "number" && mem <= 4) {
    leanScore += 1;          // moderate signal
  }

  // 4. CPU cores — widely supported, capped to 8 in Safari for fingerprinting
  const cores = navigator.hardwareConcurrency;
  if (typeof cores === "number" && cores <= 2) {
    leanScore += 1;
  }

  // 5. Network signals — Chrome/Edge only. Two flags:
  //    - effectiveType: "slow-2g" | "2g" | "3g" | "4g"
  //    - saveData: explicit user request to save data
  const conn = (navigator as Navigator & { connection?: {
    effectiveType?: string; saveData?: boolean
  } }).connection;
  if (conn?.saveData === true) {
    leanScore += 2;          // user has explicitly asked for less
  }
  if (conn?.effectiveType && ["slow-2g", "2g", "3g"].includes(conn.effectiveType)) {
    leanScore += 1;
  }

  // 6. Threshold: any signal of weight 2+, OR multiple weight-1 signals → Tier B
  return leanScore >= 2 ? "b" : "a";
}
```

### Hook implementation pattern

```ts
"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "device-tier";

export function useDeviceTier(): "a" | "b" | "c" {
  // SSR-safe default: assume tier A so the markup matches what desktop will render.
  // We re-evaluate immediately after mount.
  const [tier, setTier] = useState<"a" | "b" | "c">("a");

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(STORAGE_KEY);
      if (cached === "a" || cached === "b" || cached === "c") {
        setTier(cached);
        return;
      }
    } catch {
      // sessionStorage may be blocked (private mode, embedded contexts) — fall through
    }

    const detected = detectDeviceTier();
    setTier(detected);
    try {
      sessionStorage.setItem(STORAGE_KEY, detected);
    } catch {
      // ignore storage failure
    }
  }, []);

  return tier;
}
```

### Acceptance criteria

- Hook never throws on SSR (no `window` access during render — only in `useEffect`).
- Returns Tier A on the server and on first client paint, then upgrades/downgrades after mount. This avoids hydration mismatch.
- Result is cached in sessionStorage and reused on subsequent navigations within the session.
- Reduced-motion preference still wins — Tier C is final.

---

## 3. Per-tier effect matrix

Every animated component must consult `useDeviceTier()` and select behavior accordingly.

### `components/motion/CursorAura.tsx`

| Tier | Behavior |
|---|---|
| A | Full aura — 600×600, blur 60px, screen blend, RAF lerp |
| B | **Not mounted at all.** Component returns `null`. No DOM, no listeners, no RAF. |
| C | Already returns `null` via reduced-motion check. |

Implementation: at the top of the component, after the existing reduced-motion + touch checks, add `if (tier !== "a") return;` inside the effect, AND wrap the JSX return in a tier check so the div isn't rendered to the DOM at all.

### `components/motion/Reveal.tsx`

| Tier | Behavior |
|---|---|
| A | Bidirectional (`once: false`) — current V2.1 behavior |
| B | One-shot (`once: true`) — fade up on enter only, no reverse |
| C | No animation, render children statically (current behavior) |

This is the single biggest win. Cutting bidirectional reveals on Tier B halves the active animation count when scrolling back through the page.

### `components/motion/NoiseToSignalHero.tsx`

| Tier | Behavior |
|---|---|
| A | Full morph — 13 words converge, signal line draws, lime underscore appears |
| B | **Skip the morph entirely.** Render the resolved state (gradient line + lime underscore drawn) immediately, like Tier C does. The hero copy still appears with `<Reveal>`-driven fades. |
| C | Resolved state, current behavior |

Tier B users see the same final image, just without the dramatic entry. Saves ~13 simultaneous Framer Motion animations on first paint.

### `components/motion/DecisionTrace.tsx` and `components/motion/PressureDollyZoom.tsx`

Both use GSAP ScrollTrigger with `scrub`. ScrollTrigger does meaningful work on every scroll event.

| Tier | Behavior |
|---|---|
| A | Full scrub-based animation, current behavior |
| B | **Snap-based, no scrub.** Replace `scrub: 0.6` with `toggleActions: "play none none reverse"`. The path draws once when the trigger enters, reverses once when it leaves — no per-scroll-pixel work. Visually similar, dramatically cheaper. |
| C | Render the resolved/static state, no ScrollTrigger created |

### `components/cards/MetricCard.tsx`

| Tier | Behavior |
|---|---|
| A | Bidirectional count up/down, lime flash, cursor mini-aura on hover |
| B | One-shot count up only (no count down on leave), no lime flash, **no cursor mini-aura** (the `metric-card-aura::after` radial gradient is moderately expensive on weak GPUs) |
| C | Render final value statically, no animation |

For Tier B, conditionally omit the `metric-card-aura` class from `cardClass` and skip the `onMouseMove` handler.

### `components/cards/TransformationCard.tsx`

The `liquid-blob-before` infinite alternate animation runs forever. On Tier B it should be frozen (rendered as a static gradient with no `animation`) to free up the compositor.

| Tier | Behavior |
|---|---|
| A | Drifting blob + drawn connector arrow + 3px lock left border |
| B | **Static blob** (no animation), connector arrow draws once, lock border unchanged |
| C | Static blob, connector arrow drawn statically, lock border unchanged |

Implementation: pass tier as a prop to the card, and conditionally apply a `liquid-blob-static` class instead of `liquid-blob-before` for Tier B/C. Add the static class to globals.css with the same gradient but no animation.

### Global CSS animations in `app/globals.css`

These are infinite alternate, always running, scroll-independent. They burn cycles even when nothing is interacting.

| Class | Tier A | Tier B |
|---|---|---|
| `motion-gradient` (hero/contact mesh) | 22s drift | Frozen — `animation: none`, single static gradient position |
| `liquid-bg` (hero soft blob) | 20s drift | Frozen |
| `liquid-blob-before` (transformation Before panels) | 16s drift | Frozen |
| `metric-card-edge::before` (animated border) | 24s drift | Frozen — keep the gradient but remove animation |
| `ambient-shift` (grid pan) | 48s linear | Frozen |
| `.grain::before` (noise texture) | static | **Hidden** — set `display: none` for Tier B because compositing a fixed full-viewport pseudo-element costs more than it adds |

Implementation: add a `data-tier="b"` attribute on the `<html>` element when tier resolves to B (set in a small client component mounted in layout.tsx). Then write Tier B overrides as:

```css
html[data-tier="b"] .motion-gradient,
html[data-tier="b"] .liquid-bg,
html[data-tier="b"] .liquid-blob-before,
html[data-tier="b"] .ambient-shift {
  animation: none !important;
}
html[data-tier="b"] .metric-card-edge::before {
  animation: none;
  opacity: 0.3;
}
html[data-tier="b"] .grain::before {
  display: none;
}
```

This keeps all the per-component logic in one CSS block instead of forking every component. Cleaner.

### `components/motion/ScrollProgress.tsx`

Already cheap (one RAF loop, one `transform: scaleX`). Keep on all tiers.

### `components/motion/ParallaxLayer.tsx`

| Tier | Behavior |
|---|---|
| A | Full parallax offset |
| B | Render with no offset — wrap children in a static div, skip the `useScroll` hook |
| C | Same as B |

---

## 4. Responsive breakpoint policy

The site must work at every viewport width from 280px to 4K. Audit and fix per breakpoint.

### Target breakpoints

| Width | Device class | Notes |
|---|---|---|
| 280–320px | Galaxy Fold inner, foldables | Smallest realistic case. Test explicitly. |
| 321–375px | iPhone SE, small Android | Common floor. |
| 376–428px | Most modern phones | Default mobile. |
| 429–640px | Large phones, small phablets | |
| 641–768px | Small tablets portrait | |
| 769–1024px | iPad portrait, small laptop | |
| 1025–1280px | Standard laptop | |
| 1281–1440px | Common desktop | |
| 1441–1920px | Large desktop, FHD | |
| 1921–2560px | QHD | Hero typography needs upper clamp. |
| 2561px+ | 4K, ultrawide | Set `max-w-7xl` or similar on every section. |

### Container width policy

- Every section already uses `max-w-6xl` (72rem ≈ 1152px). Confirm this is on **every** section component including detail pages (`/systems/[slug]`, `/projects/[slug]`, `/resume`, `/notes/[slug]`).
- Pages without a max-width will balloon to ridiculous widths on 4K. Audit detail page wrappers.

### Hero typography clamping

The hero `h1` currently uses `text-5xl md:text-7xl lg:text-8xl`. On a 2560px screen, `text-8xl` (8rem ≈ 128px) is fine. On a 4K ultrawide, the heading line-length becomes uncomfortable — too many words per line. Add `max-w-4xl` (already present, good) or tighten further to `max-w-[26ch]` to bound line length.

Also: at 280px width, `text-5xl` (3rem ≈ 48px) plus the long headline copy will wrap to many lines and may overflow. Replace with a `clamp()` or step down the small breakpoint:

```tsx
className="font-display mt-4 max-w-4xl text-4xl uppercase leading-[0.95] tracking-wide text-ink xs:text-5xl md:text-7xl lg:text-8xl"
```

Where `xs` is a custom Tailwind breakpoint at 360px.

### Touch target sizing

Every interactive element must be at least 44×44px on touch devices (WCAG 2.5.5). Audit:

- Hero CTA buttons: `px-4 py-2.5` ≈ 32–36px tall — **too small for mobile**. Bump to `py-3` minimum on touch (`md:py-2.5` to keep desktop tight).
- Contact link cards: `px-4 py-3` ≈ 40–44px — borderline, should be `py-3.5` or wider.
- Filter chips in Work Index: confirm size.
- Award gallery thumbnails: confirm tap target.
- The lock-up underscore on "Signal" — purely visual, no interaction, no concern.
- Navbar links — confirm minimum 44px tall on mobile.

### Foldables and ultra-narrow

At 280px width:
- The button row in Hero (5 buttons in a flex-wrap) will wrap to 5 separate rows. Acceptable. Confirm none of them overflow their container.
- Metric cards already use `sm:grid-cols-2 lg:grid-cols-3` — at 280px they are single-column, full-width. Confirm.
- Hero heading: at 280px, even `text-4xl` may push beyond container. Consider `text-3xl` floor and re-test.

### Per-section responsive audit

Hand the agent this checklist:

```
For each section component, verify at these widths: 280, 360, 480, 768, 1024, 1440, 2560, 3840.

Audit checklist per width:
[ ] No horizontal overflow (no scrollbar at the section level)
[ ] All text legible (≥ 14px body, ≥ 24px headlines)
[ ] All interactive elements have ≥ 44×44px hit area on touch
[ ] Cards do not collapse to unreadable widths (< 240px)
[ ] Images do not overflow containers
[ ] Connector arrows hidden on mobile (already done — verify)
[ ] Decision Trace hidden on mobile (already done — verify)
[ ] Cursor aura disabled on touch (already done — verify)
[ ] Hero headline wraps to no more than 4 lines at any width
[ ] Footer links remain reachable without horizontal scroll
```

---

## 5. Image and asset discipline

The site's image surface today is small (favicon + a few placeholders). When the user adds award images, project screenshots, and an OG image, weak devices will feel them.

### Rules

- **Always use `next/image`** for all bitmaps. Never raw `<img>`. `next/image` handles automatic format negotiation (WebP/AVIF), responsive `srcset`, and lazy-loading.
- Set explicit `width` and `height` props (or `fill` + a sized container) so layout doesn't shift while the image loads.
- Add `sizes` to every responsive image. Without `sizes`, Next.js downloads the largest variant. Example for award thumbs in a 3-column grid:

  ```tsx
  <Image src={award.image} alt={award.title}
    width={400} height={300}
    sizes="(max-width: 768px) 90vw, (max-width: 1280px) 33vw, 320px" />
  ```

- Set `loading="lazy"` (default) on everything below the fold. The hero is the only above-the-fold image candidate; if you ever add one, mark it `priority`.
- Set `placeholder="blur"` only when you have a static blur data URL — otherwise it adds JS without value.
- Compress source images aggressively: PNGs run through pngquant, JPEGs through MozJPEG at quality 78–85, exports for awards/screenshots target ≤ 200KB each.
- For award images that are scans of certificates, consider converting to AVIF or WebP at the source — typically 40–60% smaller than equivalent-quality JPEG.

### OG image

`public/images/og-image.png` is referenced by metadata. Recommended specs:

- 1200×630 px (the canonical social card size)
- Under 300KB
- PNG or JPG (some platforms still don't render WebP for OG)
- Include the `From Noise to Signal` thesis prominently

### Favicon

Already present. Verify it's reasonable size (≤ 30KB).

---

## 6. Bundle size and code splitting

Every kilobyte ships to the slow phone too. Today your portfolio's likely shipping ~200KB of JS to first paint. Tighten where free.

### Audit steps

- Run `npm run build` and read the route summary table. The `Page` size and `First Load JS` columns are what matters.
- The homepage `First Load JS` should ideally be under 200KB compressed. If it's bigger, the next steps narrow it down.

### Specific things to check

1. **GSAP is imported globally.** If the homepage uses `DecisionTrace` and `PressureDollyZoom`, GSAP + ScrollTrigger ship with the homepage bundle (~70KB). That's fine if those components actually appear on the page — verify with `next build` analysis.

2. **Framer Motion** — already a dep, used widely, no avoiding.

3. **Lucide icons** — confirm imports are tree-shaken. Use named imports only (`import { Mail } from "lucide-react"`), never default-import the whole library.

4. **`cmdk`** — the command menu. ~15KB. Verify it's loaded via `next/dynamic` if it's not always visible:

   ```tsx
   const CommandMenu = dynamic(() => import("@/components/layout/CommandMenu"), {
     ssr: false,
     loading: () => null,
   });
   ```

5. **`next-mdx-remote`** — only needed on case study and notes detail pages. It should not ship with the homepage. Verify.

6. **Dead code:** delete `components/motion/ThinkingTrace.tsx` (no longer imported, replaced by `DecisionTrace`). Saves bundle size and reduces confusion.

### Code-split heavy components

For Tier B users, the biggest wins come from not loading what they won't use:

- **`CursorAura`** — already only mounts on Contact section. Wrap import in `next/dynamic` with `ssr: false` and `loading: () => null` so its ~1KB only ships when contact scrolls into view. Marginal but free.
- **`PressureDollyZoom`** and **`DecisionTrace`** — both bring GSAP. If you ever feel ambitious, wrap them in `next/dynamic` and load only after first scroll. Don't do this in the same pass — measure first.

### Font loading

You're already using `next/font/google` with `Bebas_Neue`, `Syne`, `Space_Mono`. This is the right approach: fonts are self-hosted at build time, no FOIT, no layout shift.

Confirm:
- Each font has `display: "swap"` (the default in `next/font`, but worth a glance)
- Subsets are limited to `["latin"]` (you have this — good)
- No additional font weights are loaded beyond what you actually use

---

## 7. CSS and rendering hygiene

Small but real wins for low-end devices.

### `contain` rule on sections

Add `contain: layout paint` to each `<Section>`. This tells the browser that nothing inside the section can affect layout or paint outside it, allowing the rendering engine to skip work for offscreen sections.

```css
.section-contain {
  contain: layout paint;
}
```

Apply to the root element in `components/layout/Section.tsx`.

### `will-change` discipline

`will-change` is currently used on the cursor aura — correct, it's actively transforming. Audit other components: do not add `will-change` to elements that aren't currently animating. It tells the browser to allocate a separate compositor layer, which costs memory.

### `transform` over `top/left`

Already followed in the cursor aura. Verify no other animated elements use `top`/`left` for movement. The `metric-card-aura::after` uses `background: radial-gradient(... at var(--mx) var(--my), ...)` — that's CSS custom properties on a gradient, which is GPU-friendly. Good.

### Reduce paint complexity

- The `mix-blend-mode: screen` on the cursor aura is the single most expensive operation on the page. It's correctly gated to Tier A.
- The grain texture is a fixed-position pseudo-element. It costs a layer for the entire viewport. Tier B disables it.
- Stacked semi-transparent gradients in the hero (`motion-gradient`, `liquid-bg`, `grid-lines` overlay) compose four layers. Tier B can collapse these — disable `liquid-bg` and `motion-gradient`, leave the static `grid-lines`.

---

## 8. Optional advanced — runtime FPS adaptation

Skip this for V1 of the hardening pass. Mention only.

The detection model in §2 is heuristic. If you ever want runtime adaptation, the pattern is:

- A small RAF loop in `lib/device-tier.ts` measures rolling frame times for the first ~3 seconds.
- If the median frame time exceeds 24ms (under ~41fps), downgrade Tier A → Tier B at runtime.
- If it exceeds 40ms (under 25fps), downgrade Tier A/B → Tier C-ish (still respect user's reduced-motion preference, but kill the most expensive effects).
- Persist the result in sessionStorage so subsequent navigations skip re-measurement.

This is a meaningful feature but introduces its own risks — the measurement itself uses cycles, the adaptation transition can flash, and some legitimately fast devices have a slow first 3 seconds (other tabs warming up). Build the heuristic-based system first, ship it, see if the field reports come in. Then add runtime adaptation if needed.

---

## 9. Real-device testing matrix

Lighthouse scores are not enough. Some devices consistently misrepresent themselves.

### Minimum manual test set

Before shipping, test on:

| Device | OS | Browser | Tier expected |
|---|---|---|---|
| iPhone 8 or SE (2nd gen) | iOS 15+ | Safari | B |
| Galaxy A14 or similar mid-range Android | Android 13+ | Chrome | B |
| Galaxy Fold inner screen, folded | Android 13+ | Chrome | B (also stress-tests narrow viewport) |
| iPad mini | iPadOS | Safari | A on Wi-Fi |
| 2018 MacBook Air | macOS | Safari + Chrome | A |
| Windows desktop with hardware accel disabled | Windows 11 | Edge | should detect as B (slow connection or no — confirm) |
| 4K monitor on any modern desktop | any | any | A, but check typography clamping |

### What to look for

For each device:
1. Scroll smoothly from top to Contact and back. No visible stutter, no obvious frame drops.
2. Inspect Chrome DevTools "Rendering > Frame Rendering Stats" if testable. Sustained > 50fps is fine, sustained < 30fps is a problem.
3. Hover all CTAs. They should respond visibly under 100ms.
4. Resume page: PDF embed loads, controls usable.
5. Tab between elements with keyboard. Focus rings visible everywhere.
6. Battery temperature on phones — not warm to the touch after 60 seconds of scrolling.

### Lighthouse targets

For the homepage:

| Metric | Target | Notes |
|---|---|---|
| Performance | ≥ 90 desktop, ≥ 75 mobile | Lighthouse Mobile is throttled — Tier A on desktop should hit 90+, Tier B simulation should still cross 75 |
| Accessibility | 100 | No excuses |
| Best Practices | ≥ 95 | Should be free given Next.js defaults |
| SEO | 100 | You already have metadata, robots, sitemap |
| LCP | ≤ 2.5s | Hero is text + gradient — should be well under |
| CLS | ≤ 0.05 | The `next/font` setup avoids font swap shift; verify no images cause shift |
| TBT | ≤ 200ms desktop, ≤ 600ms mobile | Bidirectional reveals + GSAP can push this — Tier B disabling them helps |

---

## 10. Implementation phases

Hand-shake friendly, each phase independently shippable.

### Phase A — detection foundation (no visible change)
1. Create `lib/device-tier.ts` with `detectDeviceTier()` and `useDeviceTier()` per §2.
2. Create a small client component `components/layout/DeviceTierAttribute.tsx` that calls `useDeviceTier()` and writes the result to `document.documentElement.dataset.tier`. Mount it in `app/layout.tsx` once, near the `ScrollProgress`.
3. Verify in DevTools: on a desktop with hover, `<html data-tier="a">`. On reduced-motion, `<html data-tier="c">`.

### Phase B — CSS-level Tier B overrides (biggest single win)
4. Add the `html[data-tier="b"] ...` rules from §3 to `app/globals.css`.
5. Add `.liquid-blob-static` static variant.
6. Verify by setting `data-tier="b"` manually in DevTools Elements panel — all the infinite animations should freeze, grain should disappear.

### Phase C — component-level Tier B branches
7. `CursorAura`: early-return `null` for tier !== "a".
8. `Reveal`: branch `viewport.once` on tier (false for A, true for B/C).
9. `NoiseToSignalHero`: render the resolved-state JSX for tier !== "a".
10. `MetricCard`: skip count-up + `metric-card-aura` class on tier B.
11. `TransformationCard`: pass tier context (or read directly), swap to static blob class.
12. `DecisionTrace`: build the snap-based variant (`toggleActions: "play none none reverse"` instead of `scrub: 0.6`) for tier B.
13. `PressureDollyZoom`: same — snap variant for tier B.
14. `ParallaxLayer`: skip the parallax math for tier B.

### Phase D — responsive audit
15. Add the `xs` Tailwind breakpoint at 360px.
16. Apply hero typography step-down at `xs:`.
17. Bump every CTA button on touch to `py-3` minimum.
18. Add `max-w-[26ch]` (or similar) to the hero `h1` to bound line length on ultrawide.
19. Verify every detail page has a `max-w-*` wrapper.
20. Test at 280, 360, 480, 768, 1024, 1440, 2560 — eyeball every section.

### Phase E — assets and bundle
21. Delete `components/motion/ThinkingTrace.tsx` (dead code).
22. Verify `cmdk` and any heavy-conditional components are dynamically imported.
23. Add `contain: layout paint` to the Section component.
24. Run `npm run build`, capture the route table sizes, ensure homepage `First Load JS` is under 200KB compressed.

### Phase F — testing
25. Lighthouse desktop and mobile from `npx lighthouse http://localhost:3000 --view` or PageSpeed Insights once deployed.
26. Manual device matrix per §9 — minimum the iPhone 8 / Galaxy A14 / disabled-hwaccel Windows browser triple.
27. Confirm reduced-motion still wins (Tier C) and that toggling it in OS settings re-evaluates within a session refresh.

### Phase G — sign-off
28. Update README with a brief "Performance and accessibility" section noting the tier model.
29. Commit, push, deploy.

---

## 11. Acceptance checklist

- [ ] `useDeviceTier()` exists, is SSR-safe, caches in sessionStorage
- [ ] `<html>` has `data-tier="a|b|c"` attribute set after first paint
- [ ] Tier C (reduced motion) behavior unchanged from V2 — every signature moment renders resolved
- [ ] On a Tier B device, no infinite CSS animations are running (verify via DevTools Animations panel — should show 0 active)
- [ ] On a Tier B device, no cursor aura is mounted (verify via Elements panel — no `<div>` with the aura inline styles)
- [ ] On a Tier B device, scroll is smooth on a Galaxy A14 or equivalent — no visible jank
- [ ] On a Tier A desktop, all V2 + V2.1 behavior is preserved
- [ ] Hero readable and not overflowing at 280px width
- [ ] All buttons hit ≥ 44×44px on touch devices
- [ ] Hero copy line length stays comfortable on 4K (≤ 26ch enforced)
- [ ] Every detail page (`/systems/[slug]`, `/projects/[slug]`, `/resume`, `/notes/[slug]`) has a max-width container
- [ ] `next/image` used for every bitmap; explicit `sizes` set
- [ ] `npm run build` First Load JS for `/` is under 200KB compressed
- [ ] Dead code (`ThinkingTrace.tsx`) deleted
- [ ] Lighthouse mobile performance ≥ 75, desktop ≥ 90
- [ ] Manual scroll test on iPhone 8 / Galaxy A14: no visible jank
- [ ] Manual test with Chrome DevTools "CPU: 4x slowdown" and "Network: Fast 3G": page is usable, gradients freeze, scroll remains smooth

---

## 12. Drop-in prompt for your Cursor agent

Paste this verbatim:

```
Read /portfolio_responsive_and_low_end_hardening.md end to end before
making any changes.

Constraints:
- Do not change any visual identity, copy, or data files.
- Do not break the V2 reduced-motion behavior — Tier C must keep working.
- Do not break the V2.1 bidirectional scroll behavior on Tier A — only
  Tier B should fall back to one-shot reveals.
- Every change must keep `npm run lint` and `npm run build` passing.
- Every new conditional path (Tier A vs B vs C) must have a verified
  fallback that renders a complete, polished state — never a broken
  half-render.

Execute the implementation plan in Section 10 phase by phase: A → B →
C → D → E → F → G.

After each phase:
1. Briefly summarize what you changed.
2. List the files touched.
3. Confirm `npm run build` still passes.
4. Wait for me to approve before starting the next phase.

Begin with Phase A.
```

---

## 13. Final note

The biggest single win is Phase B — the CSS overrides under `html[data-tier="b"]`. Even before the per-component branches in Phase C, just freezing the five infinite animations and hiding the grain will visibly help on a slow Android. Ship Phase A + B alone if time is short; the rest is incremental refinement. The acceptance checklist defines done.
