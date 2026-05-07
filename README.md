# Sarath Konuru Portfolio

A modular Next.js portfolio built around the concept **From Noise to Signal**: turning messy, slow, risky workflows into fast, secure, measurable systems.

> **V2 — "The Signal Cathedral"** — see [`portfolio_v2_design_and_cursor_instructions.md`](./portfolio_v2_design_and_cursor_instructions.md) for the full design spec.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion
- GSAP + ScrollTrigger
- MDX via `next-mdx-remote` (`/content`)
- Lucide icons, cmdk command palette, Radix Dialog

## Local development

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (for example `http://localhost:3000`).

## Build

```bash
npm run build
npm start
```

## Lint

```bash
npm run lint
```

## V2 design system

### Color tokens (CSS custom properties)

| Token | Value | Usage |
|---|---|---|
| `--accent` | `#38bdf8` sky-400 | Primary cyan — links, borders, highlights |
| `--signal` | `#22d3ee` cyan-400 | Secondary signal color — labels, paths |
| `--deep` | `#6366f1` indigo-500 | Depth layer — gradients, blobs |
| `--lock` | `#a3e635` lime-400 | **Signal-lock only** — resolved states |

`--lock` (lime) appears **exactly four places**: hero "signal" underline, metric value flash, transformation Decision left border, How I Think final node. Nowhere else.

### Three signature moments

| # | Name | Section | Effect |
|---|---|---|---|
| 1 | **The Resolve** | Hero | Noise words scatter → converge → morph into a cyan→indigo gradient line; lime underline draws on "signal" at t=2s |
| 2 | **The Decision Trace** | How I Think | GSAP ScrollTrigger drives a 2px cyan SVG path down 5 nodes (Bottleneck→Result); Decision and Result nodes lock to lime |
| 3 | **The Aura** | Contact | Lerp cursor-tracking blob (`ease=0.08`), `mix-blend-mode: screen`, disabled on touch + reduced motion |

### Reduced motion contract

Every animated effect has a static fallback rendering the **resolved state** (not an empty container):

- Hero morph → gradient line + lime underline shown immediately
- Decision Trace → fully-drawn path with all nodes filled
- ConnectorArrow → fully-drawn arrow
- MetricCard count-up → final value shown immediately, no lock flash
- Liquid blob → frozen at center position
- CursorAura → component does not mount

### New components (V2)

| Component | Path | Purpose |
|---|---|---|
| `CursorAura` | `components/motion/CursorAura.tsx` | Lerp cursor blob — Contact section |
| `DecisionTrace` | `components/motion/DecisionTrace.tsx` | Scroll-driven SVG path — How I Think |
| `ConnectorArrow` | `components/motion/ConnectorArrow.tsx` | Self-drawing SVG arrow — Transformations |
| `ScrollProgress` | `components/motion/ScrollProgress.tsx` | 2px cyan scroll indicator |
| `SectionDivider` | `components/layout/SectionDivider.tsx` | 64px gradient fade between sections |

## Content model

Structured content lives in **`/data`**. Long-form case-study copy can extend **`/content`** (`.mdx` per system, project, or note).

Control visibility and ordering with:

- `visible`
- `featured`
- `order`

Filter and sort in data helpers (for example `getVisibleSystems()`) instead of deleting entries.

## Adding a system

1. Open `data/systems.ts`.
2. Add an entry with `slug`, summary fields, `tags`, and a `detail` object (including optional `architectureFlow` steps).
3. Optionally add `content/systems/<slug>.mdx`.

Routes are generated from visible systems.

## Adding a project

1. Open `data/projects.ts`.
2. Add an entry with `slug`, `detail`, and optional `architectureFlow`.
3. Optionally add `content/projects/<slug>.mdx`.

## Awards and images

1. Place images under `public/awards/` (see paths in `data/awards.ts`).
2. Update `data/awards.ts` with titles, copy, and `image` paths.

## Project screenshots

Add files under `public/projects/` and reference them in `data/projects.ts` (`screenshots` array) when you wire gallery UI.

## Resume PDF

Place the file at:

`public/resume/sarath-konuru-resume.pdf`

The app **detects this file on disk**. When it exists, **Download resume** appears (hero, contact, navbar, case-study CTA). The **`/resume`** route is always labeled **View resume**; the PDF link is labeled **Download resume**.

Set `NEXT_PUBLIC_SITE_URL` for correct canonical URLs in production.

## System notes

Notes are **hidden from the Work Index** until you set `visible: true` on entries in `data/notes.ts`. When visible, add `content/notes/<slug>.mdx` and the note page renders full MDX.

## Motion and reduced motion

- Parallax, gradients, and GSAP effects scale down or disable on **small viewports** and when **`prefers-reduced-motion: reduce`** is set.
- Prefer testing with your OS “Reduce motion” setting in both states.

## Deploying to Netlify

1. Connect the repo and use the Netlify Next.js runtime (this repo includes `netlify.toml` with `@netlify/plugin-nextjs`).
2. **Build command:** `npm run build` (default from `netlify.toml`).
3. **Environment variables:** set `NEXT_PUBLIC_SITE_URL` to your live site origin (no trailing slash), for example `https://sarathkonuru.dev`.

Do not use `output: "export"` unless you intentionally move to a fully static host; Netlify’s Next plugin expects the standard Next build.

## Environment variables

Copy `.env.example` to `.env.local` and adjust:

| Variable                 | Purpose                                      |
| ------------------------ | -------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`   | Canonical site URL for OG, sitemap, robots |
