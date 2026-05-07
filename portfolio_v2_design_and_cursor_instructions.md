# Portfolio V2 — Design Frame & Cursor Agent Instructions

**For:** Sri Sai Sarath Chandra Konuru
**Project:** Personal portfolio rebuild
**Hand-off target:** Claude agent in Cursor
**Source palette:** keep blue / cyan / indigo (no orange, no red)
**Stack already in place:** Next.js 16 + Tailwind v4 + Framer Motion + GSAP

---

## 0. Why the current site feels forgettable

The current portfolio is *technically correct*: dark theme, clean grid, restrained motion, modular data files. But the feedback "good but not exciting, not eye-catching, not worth remembering" is honest because:

1. **Every effect was throttled.** `liquid-bg` is at `opacity: 0.12`, the noise words barely move, the dolly zoom is conservative. The site preaches "From Noise to Signal" but never lets the user *experience* noise becoming signal — it just describes it.
2. **No signature moment.** Most dev portfolios have one image people remember. This one has a polished hero but nothing that creates a "wait, how did they do that?" reaction.
3. **The hero is a thesis statement, not a demonstration.** The thesis says "I turn noise into signal." The hero should literally do that in front of the user, not just claim it.
4. **The contact page is flat.** It's a list of links on a low-opacity gradient. The user is asking for a cursor aura there — they're right.

V2 keeps the architecture, content, and information design **exactly as is**. What changes is the **visual amplitude** of three signature moments and the **interaction texture** site-wide.

---

## 1. New core concept: "The Signal Cathedral"

Same thesis. Bigger room.

Think mission control, observatory, radar bay, EEG monitor — places where humans turn noisy raw input into clean decisions. The site becomes a literal embodiment of "noise to signal" instead of a metaphorical one.

### The three signature moments

These are the only "wow" moments. Everything else stays restrained.

| # | Moment | Section | Effect family |
|---|---|---|---|
| 1 | **The Resolve** — chaotic noise words get pulled into a single horizontal signal line that becomes the headline | Hero | Morphing + self-drawing + ambient gradient |
| 2 | **The Decision Trace** — a single cyan path draws itself down the page through Bottleneck → Cause → Constraint → Decision → Result | How I Think | Self-drawing SVG |
| 3 | **The Aura** — a soft, lagging, blurred light follows the cursor through the contact page background, like sonar/sentience | Contact | Cursor-tracking blur + screen blend |

Three moments. Not seven. Restraint is what makes the chosen ones land.

### Color system (V2)

Keep the existing blue/cyan/indigo palette. Add **one** strategic punch color: a sharp electric chartreuse used **only** for "signal locked" / final-state moments (the resolved headline, the final decision node, achieved metric numbers). It's the engineering/aerospace tradition — radar locks are green, not red.

```css
:root {
  /* base — keep as-is */
  --bg: #020617;
  --bg-soft: #07111f;
  --panel: #0b172a;
  --panel-strong: #102033;

  --ink: #eaf2ff;
  --ink-soft: #94a3b8;
  --ink-muted: #64748b;

  --border: rgba(148, 163, 184, 0.16);
  --border-strong: rgba(125, 211, 252, 0.28);

  --accent: #38bdf8;             /* sky-400 — primary cyan */
  --accent-soft: rgba(56, 189, 248, 0.16);

  --signal: #22d3ee;             /* cyan-400 — secondary */
  --signal-soft: rgba(34, 211, 238, 0.14);

  --deep: #6366f1;               /* indigo-500 — depth */
  --deep-soft: rgba(99, 102, 241, 0.16);

  /* NEW — the signal-lock color, used sparingly */
  --lock: #a3e635;               /* lime-400 — only on resolved states */
  --lock-soft: rgba(163, 230, 53, 0.14);
  --lock-glow: rgba(163, 230, 53, 0.45);
}
```

**Usage rules for `--lock`:**
- Hero headline gets a tiny `--lock` underline that draws itself once after the morph completes.
- Metric values count up, then briefly flash `--lock` and settle back to `--ink`.
- "Decision" boxes in transformation cards have a `--lock` left border.
- Final node in the How I Think trace pulses `--lock` once.
- **Do not** use `--lock` on body text, buttons, links, or anywhere it competes for attention. It is a finishing touch, not a brand color.

### Typography (unchanged)

- Display: Bebas Neue
- Body: Syne
- Mono labels: Space Mono

Already correct. Don't change.

---

## 2. Section-by-section design spec

For each section: **what changes**, **what stays**, **which SVGator effect family applies**, **acceptance criteria**.

### 2.1 Hero — "The Resolve"

**Stays:** Headline copy, subheadline, CTAs, layout, fonts.

**Changes:**

1. **Morphing entrance.** Replace the current `NoiseToSignalHero` (words that fade in scattered positions) with a real morph. On load:
   - 12–14 noise fragments (`delay`, `risk`, `rework`, `manual review`, `handoff`, `latency`, `ambiguity`, `queue`, `bottleneck`, `unstructured`, `bug`, `friction`, `noise`) appear scattered with random rotations between -8° and 8°, low opacity (0.4), random small sizes.
   - Over 1.6s with eased timing, they all converge to a single horizontal line, lose their rotation, fade their text content, and **morph into a single 2px cyan-to-indigo gradient line** sitting just above the headline.
   - The gradient line then draws a second short tick of `--lock` lime under the word "signal" in the headline ("From Noise to **Signal**") — that's the only lime in the hero.

2. **Ambient background motion.** Behind the morph, a slow-drifting gradient mesh (already exists as `motion-gradient`). Increase its visual weight: change opacity from `0.9` to keep, but layer a second slower-drifting indigo-to-cyan blob at `mix-blend-mode: screen` and `filter: blur(80px)`, drifting on a 35–45s loop. This is the "ambient background motion" effect.

3. **Cursor aura (subtle).** The same cursor-tracking blob from Contact, but at lower intensity in Hero. On the contact page it's the star; here it's a hint that the same hand is on the radar dial.

**SVGator effect families used:** *morphing animation* (primary), *self-drawing animation* (the lime underscore), *ambient background motion* (gradient mesh), *animated gradient effects* (the converged signal line).

**Acceptance criteria:**
- On reduced motion: render the final aligned state immediately, no morph, no draw.
- On mobile: skip the cursor aura, skip the gradient layer at `mix-blend-mode: screen` (perf), keep the morph but cut it to 0.8s.
- Initial paint must show the headline, not a blank gradient — the morph runs as an *enhancement*, not a gate.

---

### 2.2 Impact Metrics — number drama

**Stays:** Layout, data, links to case studies.

**Changes:**

1. **Count-up with a lock flash.** Each metric value (e.g., `85%`) counts up from 0 over 800ms with `cubic-bezier(0.22, 1, 0.36, 1)`. On final value, it briefly glows `--lock` (lime, `text-shadow: 0 0 12px var(--lock-glow)`) for 300ms, then settles back to `--ink`. Triggered when the card enters viewport, **once**.
2. **Animated gradient border.** The existing `metric-card-edge::before` already animates a gradient. Bump its opacity from `0.55` to `0.7` and slow the cycle to 24s so the motion is more present but still calm.
3. **Hover micro-interaction.** On hover: card lifts 2px (already done), border brightens to `--border-strong`, AND a faint cyan radial gradient at the cursor position inside the card (a card-local mini cursor aura, ~150px). Implement with a `mousemove` listener on the card that updates two CSS custom properties (`--mx`, `--my`) and a `::after` overlay using `radial-gradient(circle at var(--mx) var(--my), var(--accent-soft), transparent 60%)`.

**SVGator effect families used:** *microinteractions*, *animated gradient effects*.

**Acceptance criteria:**
- Counter does not re-animate on scroll-back.
- Reduced motion: skip count-up, render final number immediately, no lime flash.
- Hover gradient must be GPU-friendly (CSS variables only, no React state per pixel).

---

### 2.3 Transformations — show the chaos collapsing

**Stays:** Three featured transformations, before/decision/after structure, copy.

**Changes:**

1. **Liquid motion in the "Before" panel.** The current "Before" panel is a static dim card. Add a low-opacity (0.10) blue/indigo blob inside the card boundaries that slowly drifts and squashes — this is the "noise" the decision will collapse. Use a CSS-only animated `radial-gradient` with shifting `background-position` over a 14–18s loop.
2. **Self-drawing arrow between the three panels.** On scroll-into-view, a thin cyan SVG path draws itself horizontally connecting Before → Decision → After, with a small filled arrowhead arriving at "After". Use `stroke-dasharray` / `stroke-dashoffset` animated via Framer Motion or CSS. On mobile (when panels stack vertically), the arrow becomes vertical.
3. **Decision panel as the focal point.** Add `--lock` to the LEFT border (not full border — left only, 3px wide) of the Decision panel. This is the only place inside a transformation card where lime appears. It marks "this is where the decision was made."
4. **Pressure dolly remains** for the three signature transformations as already implemented, but bump the scale delta slightly so the effect is felt, not guessed.

**SVGator effect families used:** *liquid motion effects* (Before panel blob), *self-drawing animation* (connecting arrow), *morphing* (subtle, when the dolly resolves).

**Acceptance criteria:**
- Liquid motion stays inside the card — no overflow.
- Arrow draws once per page load when card enters viewport.
- Reduced motion: render the arrow as a fully-drawn static path; freeze the liquid blob.

---

### 2.4 How I Think — "The Decision Trace" (signature moment #2)

**Stays:** Numbered sequence, the three thinking cards, copy.

**Changes:**

1. **Replace the left-side `ThinkingTrace` with a real self-drawing path.** A single 2px cyan SVG line draws itself down the left column as the user scrolls through this section, connecting nodes labeled:
   - Bottleneck
   - Cause
   - Constraint
   - Decision  ← node briefly pulses `--lock` when the line reaches it
   - Result    ← node settles `--lock` and stays slightly brighter than the others

   Use GSAP ScrollTrigger (already a dependency) to drive the `stroke-dashoffset` from `pathLength` to `0` based on scroll progress through the section. Each node is a small 8px circle that fills in when the line passes it.

2. **Side-channel commentary.** As the line draws past each node, the corresponding numbered list item on the right (`01. I look for the bottleneck.`) briefly highlights with a slight cyan background flash, anchoring the visual trace to the textual sequence.

**SVGator effect family used:** *self-drawing animation* (signature).

**Acceptance criteria:**
- Path draws based on scroll position, not autoplay. Scrolling back must rewind.
- Reduced motion: render the fully-drawn path immediately; numbered list does not flash.
- Mobile: skip the SVG path (it doesn't make sense on a narrow column); render numbered list with subtle staggered reveal only.

---

### 2.5 Work Index — keep restrained

**Stays:** Filters, cards, layout.

**Changes:**
- Filter chip active state: soft cyan fill with a 1px `--accent` border. Inactive: `--panel` with `--border`. Hover: border brightens.
- Card hover: 1px lift, border to `--border-strong`. **No** shimmer, **no** card-local cursor aura here — Work Index is for browsing, not for spectacle.

**SVGator effect family used:** *microinteractions* only.

---

### 2.6 Recognition / Awards

**Stays:** Layout, copy.

**Changes:**
- On hover, award images get a subtle cyan glow ring (`box-shadow: 0 0 0 1px var(--border-strong), 0 12px 40px rgba(56,189,248,0.12)`) and lift 2px.
- Award images open in a lightbox with keyboard escape (Radix Dialog already a dep).
- **No** morphing, **no** liquid motion, **no** self-drawing here. Awards must read as credible.

**SVGator effect family used:** *microinteractions* only.

---

### 2.7 Contact — "The Aura" (signature moment #3)

**Stays:** Email, LinkedIn, GitHub, Resume links. Copy.

**Changes:**

1. **The cursor aura.** A soft, blurred, color-shifting blob follows the cursor with eased motion across the contact section background. This is the "slushy thing in the background" you described from antigravity.google. See **Section 4** for the full implementation spec — it gets its own component.
2. **Background gradient mesh.** A slow animated mesh of indigo → cyan → deep blue, drifting on a 28s loop at `mix-blend-mode: screen`. The aura sits *above* the mesh so it appears to interact with it.
3. **Link cards** stay calm. Subtle hover: border brightens to `--border-strong`, label gains a 1px right-arrow microinteraction (slides 2px on hover).
4. **A single closing line in `--lock`** below the links: `Signal locked.` (2 words, mono, lowercase, very small) — a wink to the radar metaphor.

**SVGator effect families used:** *animated gradient effects* (background mesh), *liquid motion effects* (cursor aura), *microinteractions* (link arrows), the *real-time collaborative* metaphor as inspiration only — the aura is what *would* be a "presence cursor" in a multiplayer doc, here used to add presence to a single-page contact.

**Acceptance criteria:**
- On touch devices and reduced motion: no cursor aura, render only the static gradient mesh at lower amplitude.
- Aura must use `transform: translate3d` (not `top/left`) for performance.
- Aura must NOT capture pointer events (`pointer-events: none`) so links stay clickable.
- Z-index: aura at `z-1`, mesh at `z-0`, content at `z-10`.

---

## 3. Site-wide details

### 3.1 Section transitions

Currently sections just sit next to each other with a 1px `border-line` separator. Add a 60–80px tall **gradient fade** between sections going from the previous section's background to the next. Subtle but it removes the "stacked cards" feel.

### 3.2 Scroll progress indicator

A 2px cyan progress bar at the very top of the viewport that tracks scroll progress through the page. On mobile, optional. Pure CSS using `scroll-timeline` if browser supports, otherwise a small JS hook. This is a microinteraction that gives the site one extra cue of "you are being guided."

### 3.3 Navbar — magnetic links

Each navbar link gets a subtle magnetic pull effect on hover (the link text slightly shifts toward the cursor — max 4px translation). The existing `MagneticLink.tsx` component already handles this; just make sure it's wired to the navbar items.

### 3.4 Reduced motion baseline

Strict rule: anything new in V2 must check `useReducedMotion()` from Framer Motion or `window.matchMedia('(prefers-reduced-motion: reduce)')` and render a static fallback. The fallback should not be empty — render the *resolved* state.

---

## 4. The Cursor Aura — full implementation spec

This is the centerpiece interactive element. Get it right.

### 4.1 Behavior

- Tracks `mousemove` on `window`.
- Position is updated every animation frame using **lerp** (linear interpolation): `current += (target - current) * 0.08`. The `0.08` is what creates the lazy/slushy/lagging feel. Lower = more sluggish.
- Renders as a 600×600 px (desktop) circle filled with a radial gradient, heavy blur (60px), `mix-blend-mode: screen` (so it brightens, not darkens, the underlying gradient).
- Position is `fixed`, `pointer-events: none`, `z-index: 1` (below content, above section background).
- Hides on touch devices (no `pointermove`) and when `prefers-reduced-motion: reduce`.

### 4.2 Color modes

The aura color shifts based on which section it's currently over. Two ways to do this:

**Option A (simpler):** Single color (cyan/indigo blend), used everywhere. This is the V1 implementation.

**Option B (richer):** Each section sets a CSS variable on its container; the aura reads the variable. Hero gets `--aura: rgba(56,189,248,0.25)`, Contact gets `--aura: rgba(99,102,241,0.32)`, etc. The aura then color-shifts as the user scrolls. This is the V2 implementation. Use IntersectionObserver on sections.

Start with Option A. Promote to Option B in a polish pass.

### 4.3 Reference component

```tsx
// components/motion/CursorAura.tsx
"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** Lerp coefficient. Lower = slushier. Default 0.08. */
  ease?: number;
  /** Aura diameter in px. Default 600. */
  size?: number;
  /** Override gradient. Default cyan→indigo. */
  gradient?: string;
  /** Restrict to a section by passing a ref; otherwise tracks the whole window. */
  sectionRef?: React.RefObject<HTMLElement>;
};

export function CursorAura({
  ease = 0.08,
  size = 600,
  gradient = "radial-gradient(circle, rgba(56,189,248,0.28), rgba(99,102,241,0.14) 40%, transparent 70%)",
  sectionRef,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const visible = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if ("ontouchstart" in window && !window.matchMedia("(hover: hover)").matches) return;

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (!visible.current && ref.current) {
        ref.current.style.opacity = "1";
        visible.current = true;
      }
    };

    const onLeave = () => {
      if (ref.current) ref.current.style.opacity = "0";
      visible.current = false;
    };

    let raf = 0;
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * ease;
      current.current.y += (target.current.y - current.current.y) * ease;
      if (ref.current) {
        ref.current.style.transform =
          `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    const el = sectionRef?.current ?? window;
    el.addEventListener("mousemove", onMove as EventListener);
    el.addEventListener("mouseleave", onLeave as EventListener);
    raf = requestAnimationFrame(tick);

    return () => {
      el.removeEventListener("mousemove", onMove as EventListener);
      el.removeEventListener("mouseleave", onLeave as EventListener);
      cancelAnimationFrame(raf);
    };
  }, [ease, sectionRef]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 rounded-full"
      style={{
        width: size,
        height: size,
        background: gradient,
        filter: "blur(60px)",
        mixBlendMode: "screen",
        zIndex: 1,
        opacity: 0,
        transition: "opacity 400ms ease",
        willChange: "transform",
      }}
    />
  );
}
```

### 4.4 Where to mount it

- **Contact section:** Always mount, full intensity (default size 600, default ease 0.08).
- **Hero:** Mount with smaller size (380), faster ease (0.12) — feels like "the radar is warming up." Optional, can be added in the polish pass.
- **Everywhere else:** Do not mount.

---

## 5. Animation budget — the rules

To prevent the "overdesigned WebGL demo" failure mode that the existing instructions warn against:

- **3 signature moments only.** Hero morph, Decision Trace, Contact aura. No fourth.
- **All other motion is restraint motion** — micro-interactions, fades, lifts, gradient drifts. Nothing larger than a 4px shift, 1.05 scale, 200ms duration without a specific reason.
- **Every effect must have a static fallback.** No exceptions.
- **No motion may delay** content paint, navigation, or contact link clickability.
- **No JS animation may run when the tab is hidden** (`document.visibilityState`).

---

## 6. Implementation plan for the Cursor agent

Hand the agent the following plan. Each item is small, testable, and reversible.

### Phase A — Foundation (no visible change yet)
1. Add the `--lock`, `--lock-soft`, `--lock-glow` CSS variables to `app/globals.css`.
2. Add corresponding entries to `@theme inline` in `globals.css` (`--color-lock`, etc.) so Tailwind utility classes like `text-lock` work.
3. Add a `useReducedMotion` and `useIsTouch` hook pair to `lib/motion.ts` if not already there. (You already have `useIsMobile`; add `useIsTouch` separately because the aura needs hover-capable + non-reduced-motion, which is stricter than "not mobile".)

### Phase B — Cursor Aura
4. Create `components/motion/CursorAura.tsx` exactly as specified in Section 4.3.
5. Mount `<CursorAura />` inside `ContactPanel.tsx`. Place it as the **first child** of the section, before any background gradient div, so it stacks correctly. Keep `pointer-events: none` and `z-index: 1`.
6. Verify on mobile it's invisible / not mounted.
7. Verify links still receive clicks.

### Phase C — Hero "Resolve" upgrade
8. Replace the body of `components/motion/NoiseToSignalHero.tsx` with a morphing variant:
   - 12–14 noise words start scattered (random `x`, `y` within 0–100% of container, random rotation -8° to 8°, opacity 0.4).
   - On mount (after `requestAnimationFrame` to avoid SSR jitter), animate all words to a single horizontal line position with `y = 50%`, opacity → 0, rotation → 0, over 1.6s with `ease: [0.22, 1, 0.36, 1]`.
   - At t=1.4s, fade in a 2px gradient line (cyan → indigo) at the same y.
   - At t=2.0s, draw a small `--lock` underline beneath the word "Signal" in the headline — coordinate via a CSS class toggle on the `<h1>`'s `<span>` wrapping "Signal".
9. Update the `<h1>` in `Hero.tsx` to wrap the word "Signal" in a `<span className="hero-signal">` and add the underline reveal CSS in `globals.css`.
10. Reduced motion: render the line and the underline as fully drawn from the start, skip the morph.

### Phase D — How I Think "Decision Trace"
11. Create `components/motion/DecisionTrace.tsx` — an SVG with a vertical path, 5 nodes labeled Bottleneck/Cause/Constraint/Decision/Result.
12. Use GSAP ScrollTrigger to animate `stroke-dashoffset` from `pathLength` to `0` over the section's scroll range.
13. As the line passes each node, fill the node circle. The Decision node briefly pulses `--lock` (300ms), the Result node settles `--lock`.
14. Replace the existing `ThinkingTrace` import in `HowIThink.tsx` with `DecisionTrace`.
15. Reduced motion: render fully drawn path immediately.

### Phase E — Transformations chaos / arrow
16. Add a `<LiquidBlob />` component (small CSS-animated radial gradient) and render inside the "Before" panel of `TransformationCard.tsx`, position absolute, contained, low opacity.
17. Add a horizontal SVG arrow between Before/Decision/After panels in `TransformationCard.tsx`. Animate stroke-dashoffset on viewport entry. Vertical variant on mobile.
18. Add a 3px `border-l` of `--lock` to the Decision panel.
19. Reduced motion: blob frozen, arrow fully drawn, lime border stays.

### Phase F — Impact metric flair
20. Update `MetricCard.tsx`:
    - Add count-up animation for the value (use a simple `useEffect` with `requestAnimationFrame`, no extra library needed).
    - On reaching final value, add a 300ms `--lock` text-shadow glow, then remove.
    - Add `mousemove` listener to set `--mx`, `--my` CSS vars and a `::after` overlay with a radial gradient at those coords.
21. Bump the `metric-card-edge::before` opacity in `globals.css` from 0.55 → 0.7.
22. Reduced motion: skip count-up and lock flash; render final value statically.

### Phase G — Polish
23. Add a `<ScrollProgress />` component (2px cyan bar at top, tracks `window.scrollY / scrollHeight`).
24. Wire navbar links through the existing `MagneticLink` if not already.
25. Add 60px gradient fade between sections (a `<SectionDivider />` component or just CSS on `Section`).
26. Run `npm run build`, fix any type errors, run `npm run lint`.
27. Manual QA on:
    - Desktop Chrome (full effects)
    - Desktop Safari (mix-blend-mode quirks)
    - Mobile Safari (no aura, reduced motion graceful)
    - Reduced motion enabled (all signature moments resolve to static)
    - Keyboard navigation (every CTA reachable, focus rings visible)

### Phase H — Verify deliverables
28. README updated with the new design notes, link to this document.
29. Screenshots in `public/images/og-image.png` updated to reflect new hero (optional).
30. Deploy preview to Netlify, share URL.

---

## 7. Drop-in prompt for your Cursor Claude agent

Paste this directly into your Cursor agent to kick off the work. It's already chunked.

```
You are upgrading my existing Next.js portfolio. The design direction and full
specification is in:

  /portfolio_v2_design_and_cursor_instructions.md

Read that document first, end to end. Do not skim.

Constraints (non-negotiable):
- Do not change the homepage section order, the data files in /data, or the
  copy/content of any section.
- Do not introduce new dependencies beyond what's in package.json.
- Do not use orange or red anywhere in the visual system.
- Every new effect must respect prefers-reduced-motion and degrade gracefully
  on mobile and on touch-only devices.
- Every new effect must have a static fallback that renders the resolved
  state (not an empty container).
- All work must keep `npm run build` and `npm run lint` passing.

Execute the plan in Section 6 phase by phase: A → B → C → D → E → F → G → H.

After each phase:
1. Briefly summarize what you changed.
2. List the files touched.
3. Confirm `npm run build` still passes.
4. Wait for me to approve before starting the next phase.

Start with Phase A.
```

---

## 8. Acceptance checklist for V2

Before you call this done, verify each item:

- [ ] `--lock` lime appears in: hero "Signal" underline, metric value flash, transformation Decision left border, How I Think final node. **Nowhere else.**
- [ ] Hero morph: noise words start scattered, converge to a line, line fades to gradient, headline reveals with lime underscore. Total < 2.2s.
- [ ] Decision Trace draws based on scroll, rewinds on scroll back, never auto-plays.
- [ ] Cursor Aura is present in Contact section only (Phase A); optionally also Hero (later polish).
- [ ] Cursor Aura uses `transform: translate3d` and `mix-blend-mode: screen`.
- [ ] Cursor Aura disabled on touch devices and reduced motion.
- [ ] Every signature effect has a verified static fallback.
- [ ] Liquid blob in Before panel stays inside the panel (no overflow).
- [ ] Self-drawing arrows in Transformations rewind correctly when section leaves viewport.
- [ ] Metric count-up runs once per page view, not per scroll-back.
- [ ] No effect blocks first contentful paint.
- [ ] Lighthouse performance score ≥ 90 on desktop, ≥ 80 on mobile.
- [ ] All four CTAs (View Transformations, View Resume, Download Resume if PDF present, GitHub, LinkedIn) are reachable via keyboard with visible focus rings.
- [ ] `npm run build` passes. `npm run lint` passes.

---

## 9. What we explicitly did NOT do — and why

- **No 3D / WebGL.** Bundle size, complexity, accessibility cost, and the existing v1 instructions already prohibit it.
- **No real-time collaboration features.** Already prohibited. The aura *gestures at* presence without implementing it.
- **No new color outside the blue/cyan/indigo + accent lime system.** Restraint is what makes the lime hit.
- **No re-architecture.** Data model, file structure, and routing stay. This is a visual amplitude pass, not a rewrite.
- **No hero video, no looping product demo, no marquee.** All would compete with the morph.
- **No section count change.** Seven sections, in the existing order.

---

## 10. Final note

The existing portfolio is already *correct*. V2 is about courage: letting the three chosen moments be loud enough to be remembered, while keeping everything else as quiet as it already is. The contrast is the point.

If a reviewer scrolls through this and feels nothing in seven seconds, the redesign failed. If they pause once at the hero, lean in once at the decision trace, and smile when the cursor aura follows them across the contact section — V2 is doing its job.
