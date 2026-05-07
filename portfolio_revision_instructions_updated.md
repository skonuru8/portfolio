# Portfolio Revision Instructions

## Goal

Refine the current Next.js portfolio without changing the core concept.

The portfolio concept remains:

**From Noise to Signal**

The site should show how Sarath turns messy, slow, risky, manual workflows into fast, secure, measurable systems.

Do not redesign the whole site. Preserve the current modular structure, restrained motion system, and impact-first narrative. This pass is about improving specificity, polish, discoverability, deployment readiness, accessibility, maintainability, color direction, and motion taste.

---

## 1. Core creative direction

The portfolio should not become a generic developer portfolio, a SaaS landing page, or an overdesigned WebGL demo.

It should feel like:

**A senior engineer’s thinking system.**

The visual and interaction language should support:

- noise becoming signal
- pressure becoming decision
- manual work becoming leverage
- risk becoming control
- measurable bottlenecks becoming measurable outcomes

The site should be polished, cinematic, and thoughtful, but not overloaded with effects.

---

## 2. Required color palette change

### Problem

The current orange/red palette is not the desired direction.

Orange/red reads too much like warning/error/crypto-dashboard intensity. The new direction should feel more like cloud infrastructure, signal clarity, reliability, calm pressure, and mission control.

### Required change

Replace the orange/red palette with a bluish system palette.

Use a deep navy / blue / cyan / indigo palette.

### Recommended color tokens

Use these values or very close equivalents:

```css
:root {
  --bg: #020617;
  --bg-soft: #07111f;
  --panel: #0b172a;
  --panel-strong: #102033;

  --text: #eaf2ff;
  --text-soft: #94a3b8;
  --text-muted: #64748b;

  --border: rgba(148, 163, 184, 0.16);
  --border-strong: rgba(125, 211, 252, 0.28);

  --accent: #38bdf8;
  --accent-soft: rgba(56, 189, 248, 0.16);

  --signal: #22d3ee;
  --signal-soft: rgba(34, 211, 238, 0.14);

  --deep: #6366f1;
  --deep-soft: rgba(99, 102, 241, 0.16);

  --success: #2dd4bf;
}
```

### Tailwind theme colors

If using Tailwind theme extension, use:

```ts
colors: {
  bg: "#020617",
  "bg-soft": "#07111F",
  panel: "#0B172A",
  "panel-strong": "#102033",
  text: "#EAF2FF",
  "text-soft": "#94A3B8",
  "text-muted": "#64748B",
  accent: "#38BDF8",
  signal: "#22D3EE",
  deep: "#6366F1",
  success: "#2DD4BF"
}
```

### Replacement mapping

Replace old color usage as follows:

```text
Old orange/red accent        → cyan/sky blue accent
Old warm danger glow         → deep blue/indigo/cyan glow
Old secondary green accent   → teal/signal cyan
Old harsh warning feel       → calm technical pressure
```

### Avoid

Do not use:

- orange
- red
- hot pink
- aggressive purple
- rainbow gradients
- neon carnival effects

Small red may only be used if semantically required for an error state, and even then it should be restrained. Do not use red as a brand accent.

---

## 3. Animation and effects policy

The portfolio can use animation, but every effect must earn its place.

Approved effect families:

- animated gradient effects
- subtle liquid motion
- microinteractions
- morphing animation
- self-drawing animation
- ambient background motion
- collaborative-animation-inspired metaphor only, not actual real-time collaboration

Effects must explain thought process, clarify interaction, or create atmosphere.

Effects must not compete with content.

Effects must not turn the site into an animation demo.

Effects must respect:

- `prefers-reduced-motion`
- mobile behavior
- performance
- readability
- keyboard accessibility

Every major effect must have a static fallback.

---

## 4. Animated gradient effects

### Verdict

Use animated gradients, but subtly.

### Purpose

Animated gradients should support the mood of:

- signal clarity
- cloud/system depth
- pressure resolving into calm
- transformation from noise to signal

### Best locations

Use animated blue/cyan/indigo gradients in:

- Hero background
- Impact metric cards
- Transformation card glow
- Section dividers
- Contact background

### Rules

Use slow-moving gradients only.

Good direction:

```text
Deep navy → cyan glow → indigo shadow
```

Avoid:

```text
Blue → purple → green → pink rainbow motion
```

Do not make gradients loud enough to reduce readability.

Disable or freeze animated gradients when reduced motion is enabled.

---

## 5. Liquid motion effects

### Verdict

Use sparingly, mostly as a background or transition texture.

### Purpose

Liquid motion may represent:

- ambiguous input becoming structured signal
- job-search chaos becoming ranked clarity
- subtle system flow behind the page

### Best locations

Use liquid motion only in:

- Hero background as abstract signal flow
- Transition between Hero and Impact
- Job Hunter transformation, where chaos collapses into a ranked queue

### Rules

Liquid motion must be subtle:

```text
Opacity: 0.08 to 0.16
Duration: 16s to 28s
Colors: blue / cyan / indigo only
Position: background layer only
```

Do not use liquid motion for:

- buttons
- skills
- awards
- resume CTA
- contact links
- architecture diagrams
- foreground UI

Do not make the site feel like a wellness app or a decorative blob template.

---

## 6. Microinteractions

### Verdict

Strong yes. Microinteractions are the safest and most useful animation category.

### Use microinteractions for

- Navbar links
- Command menu trigger
- CTA buttons
- Work Index filters
- Case study cards
- Transformation cards
- Award gallery thumbnails
- Resume button
- External links
- Project/system cards

### Good microinteractions

Use subtle interactions:

- button hover: soft blue border glow
- card hover: 1-2px lift
- card hover: border brightening
- filter active state: soft cyan fill
- command menu open: quick scale/fade
- award image hover: slight zoom
- external link arrow: slide 2px
- focus states: visible cyan ring

### Avoid

Do not use:

- bouncy cartoon buttons
- large hover scaling
- spinning icons
- contact buttons moving away from the user
- hover effects that shift layout
- motion that makes text harder to click

All interactive elements must remain accessible and predictable.

---

## 7. Morphing animation effects

### Verdict

Use in one or two signature moments only.

### Purpose

Morphing should represent transformation:

- messy fragments → clear thesis
- scattered job cards → ranked queue
- unsafe diff blocks → sanitized review packet

### Best locations

Use morphing only in:

#### Hero

Scattered fragments or noisy shapes can morph into clean signal lines or aligned thesis structure.

Concept:

```text
messy fragments → aligned thesis line
```

#### Job Hunter

Scattered job cards can morph or settle into ranked columns.

Concept:

```text
noise → shortlist
```

#### Privacy Guard

Unsafe raw diff blocks can morph into sanitized blocks.

Concept:

```text
unsafe payload → safe review packet
```

### Avoid

Do not morph:

- logos
- skills
- awards
- every card
- navigation items
- resume buttons

Do not use morphing as a random decoration.

---

## 8. Self-drawing animation effects

### Verdict

Use for architecture and decision lines.

This is one of the strongest effects for the portfolio if handled in a technical, blueprint-like way.

### Purpose

Self-drawing lines should show thought process and system trace.

Use it to show:

- decision paths
- case-study architecture flows
- Problem → Constraint → Tradeoff → Decision → Result
- transformation connector lines

### Best locations

Use self-drawing SVG/path animation in:

- How I Think section
- Case-study architecture flows
- Transformation cards
- Decision Log sections

### Example concept

In “How I Think,” a thin cyan line should draw itself as the user scrolls:

```text
Bottleneck
   ↓
Cause
   ↓
Constraint
   ↓
Decision
   ↓
Measured result
```

### Implementation guidance

Use SVG path animation or CSS stroke animation:

```css
stroke-dasharray
stroke-dashoffset
```

Disable the draw animation under reduced motion and show the final static line.

Use cyan/blue strokes, not orange/red.

Avoid hand-drawn/cute sketch styling. It should feel like a system trace or blueprint.

---

## 9. Ambient background motion

### Verdict

Yes, but with strict restraint.

### Purpose

Ambient background motion should make the site feel alive without distracting from content.

### Use ambient motion in

- Global background
- Hero
- Transformation section
- Contact/footer background

### Good ambient motion

Use:

- faint blue particles
- slow grid movement
- low-opacity gradient mesh
- subtle signal/noise texture
- very soft cyan/indigo glows

### Avoid

Do not use:

- dense particle storms
- fast-moving blobs
- interactive cursor particle trails
- constant aggressive animated noise
- motion that competes with text

If a user immediately says “cool background animation,” it is probably too loud.

---

## 10. Real-time collaborative animations

### Verdict

Do not implement actual real-time collaborative animation.

The portfolio is not a collaborative tool. Do not add live cursors, multi-user presence, shared animated state, or real-time interaction features.

### What may be borrowed

The concept may be used only as a metaphor in content or subtle visual storytelling.

Possible metaphor:

```text
Stakeholder signal
Architect constraint
Engineer implementation
Production feedback
```

or:

```text
Sales pressure
Architecture review
Engineering decision
Production result
```

Do not add actual real-time collaboration features. They are unnecessary, expensive, and distracting.

---

## 11. Homepage structure

Do not remove the existing homepage structure:

- Hero
- Impact Metrics
- Transformations
- How I Think
- Work Index
- Recognition Preview
- Contact Panel

The homepage should remain impact-first and thought-process-first.

Do not revert the portfolio back into a resume-style page.

---

## 12. Recommended effect placement

### Hero

Use:

- animated blue/cyan/indigo gradient
- ambient background motion
- subtle morphing
- light parallax

Concept:

```text
scattered fragments slowly align into “From Noise to Signal”
```

Fragments can include human/system pain words like:

```text
delay
risk
rework
manual review
handoff
latency
ambiguity
queue
bottleneck
noise
```

These should gradually support the thesis:

```text
I turn messy, slow, risky workflows into fast, secure, measurable systems.
```

Do not over-animate the CTA buttons.

### Impact section

Use:

- microinteractions
- subtle animated gradient border
- light card hover glow

Do not use:

- liquid motion
- morphing
- dolly zoom
- distracting number movement after reveal

### Transformations

Use:

- dolly/glow effect
- animated blue gradient
- self-drawing connector lines
- maybe morphing per card, only if meaningful

#### Nokia

Effect direction:

```text
pressure-dolly + self-drawing decision path
```

Mood:

```text
heavy blue/cyan glow
operational pressure
bottleneck resolving
```

#### Job Hunter

Effect direction:

```text
noise-collapse + slight morph from scattered cards to ranked stack
```

Mood:

```text
blue/teal
kinetic but controlled
manual chaos becoming leverage
```

#### Privacy Guard

Effect direction:

```text
risk-to-control + self-drawing shield/scan line
```

Mood:

```text
indigo/cyan
sharp
controlled
security before exposure
```

### How I Think

Use:

- self-drawing line animation
- microinteractions
- subtle reveal

Do not use:

- dolly zoom
- liquid foreground motion
- excessive morphing

This section should feel mature, not flashy.

### Work Index

Use microinteractions only.

No major animation. Users are browsing here.

### Recognition / Awards

Use:

- award lightbox
- subtle image hover
- soft border glow

Do not use:

- liquid motion
- morphing
- certificate animations
- dramatic reveals that reduce credibility

Awards should feel real and credible.

### Contact

Use:

- very subtle animated blue gradient background
- microinteractions on links

Do not add dramatic effects. Contact and resume access must be frictionless.

---

## 13. Keep the current modular structure

The site should remain modular and content-driven through data files.

Do not hardcode major content inside components unless it is purely decorative UI copy.

All major content must remain in:

```text
/data/profile.ts
/data/metrics.ts
/data/transformations.ts
/data/systems.ts
/data/projects.ts
/data/experience.ts
/data/awards.ts
/data/skills.ts
/data/thinking.ts
/data/notes.ts
```

Every major content item should support:

```ts
visible?: boolean;
featured?: boolean;
order?: number;
```

Use these fields for rendering/filtering rather than deleting content.

---

## 14. Replace generic case-study architecture flows

### Problem

The current case-study pages use the same generic architecture diagram:

- Ingress
- Core services
- Data
- Delivery

This is too vague and weak. Each case study needs a specific flow that proves the system.

### Required change

Extend the case-study data model to support a custom architecture flow.

Add an optional field to the shared case-study/detail type:

```ts
architectureFlow?: {
  label: string;
  detail?: string;
}[];
```

Then update the case-study page to render:

```tsx
<SimpleFlowDiagram steps={detail.architectureFlow ?? fallbackSteps} />
```

Do not hardcode flows inside the component. They must come from the relevant data file.

### Required flows

#### Nokia CPQ Contract Engine

Use a specific flow similar to:

```ts
architectureFlow: [
  { label: "CPQ Portal", detail: "Contract request entry point" },
  { label: "Contract Case", detail: "Business-critical contract orchestration" },
  { label: "Azure Service Bus", detail: "Async cross-service integration" },
  { label: "Redis", detail: "High-value cached reads" },
  { label: "Cosmos DB", detail: "Contract and quote state" },
  { label: "Quote / Order Services", detail: "Downstream quote-to-cash flow" }
]
```

#### Autonomous Job Intelligence Pipeline

Use a specific flow similar to:

```ts
architectureFlow: [
  { label: "Job Boards", detail: "Raw listings from multiple sources" },
  { label: "Extraction", detail: "Normalize role content and requirements" },
  { label: "Fit Scoring", detail: "Skill, seniority, and alignment signals" },
  { label: "Artifact Generation", detail: "Tailored resume and cover letter" },
  { label: "Review UI", detail: "Ranked apply queue and triage" },
  { label: "Application Tracking", detail: "One-click status management" }
]
```

#### AI Privacy Enforcement Extension

Use a specific flow similar to:

```ts
architectureFlow: [
  { label: "Git Diff", detail: "Staged changes before commit" },
  { label: "Local Scanner", detail: "Static rules and fast local checks" },
  { label: "Sanitizer", detail: "Strip sensitive content before external review" },
  { label: "LLM Review", detail: "Contextual privacy reasoning" },
  { label: "Risk Report", detail: "Explain violations and safer alternatives" },
  { label: "Allow / Block", detail: "Commit decision before leakage" }
]
```

#### PHIA Healthcare Appeals Automation

Use a specific flow similar to:

```ts
architectureFlow: [
  { label: "Email Trigger", detail: "Appeals intake and workflow start" },
  { label: "Camunda BPMN", detail: "Workflow orchestration and subprocesses" },
  { label: "Spring Boot API", detail: "Business logic and task operations" },
  { label: "Angular Dashboard", detail: "Manual ticketing and queue visibility" },
  { label: "SQL Server Reports", detail: "Client-facing task-listing visibility" },
  { label: "Keycloak", detail: "SSO and role-based access control" }
]
```

#### Nissan Telemetry Platform

Use a specific flow similar to:

```ts
architectureFlow: [
  { label: "Vehicle Fleets", detail: "Binary, XML, and non-standard JSON inputs" },
  { label: "S3 / Kinesis", detail: "Raw ingestion and real-time stream processing" },
  { label: "Spring Boot Transformers", detail: "Format-specific normalization logic" },
  { label: "Drools Rules", detail: "Centralized transformation rules" },
  { label: "Canonical JSON", detail: "Unified telemetry schema" },
  { label: "DynamoDB / Dashboard", detail: "Persistent telemetry and fleet visibility" }
]
```

---

## 15. Make transformation motion variants actually different

### Problem

The data includes different motion types:

- pressure-dolly
- noise-collapse
- risk-to-control

But the visual behavior is mostly identical.

### Required change

Update `PressureDollyZoom` to accept a motion variant prop.

Example:

```tsx
<PressureDollyZoom
  label={label}
  variant={motionType}
/>
```

Define variant presets.

Example:

```ts
const presets = {
  "pressure-dolly": {
    bgScale: 1.5,
    fgScale: 0.94,
    glowIntensity: "strong",
    mood: "heavy"
  },
  "noise-collapse": {
    bgScale: 1.35,
    fgScale: 0.96,
    glowIntensity: "medium",
    mood: "kinetic"
  },
  "risk-to-control": {
    bgScale: 1.42,
    fgScale: 0.95,
    glowIntensity: "sharp",
    mood: "controlled"
  }
};
```

### Intent by transformation

#### Nokia

Should feel heavier and more operational.

Motion meaning:

- pressure
- bottleneck
- system constraint

#### Job Hunter

Should feel more chaotic and kinetic.

Motion meaning:

- overload
- repeated manual work
- noise collapsing into ranking

#### Privacy Guard

Should feel tense and controlled.

Motion meaning:

- risk
- leakage prevention
- control before exposure

Do not overdo the effect. Keep motion subtle and readable.

Respect:

- reduced motion
- mobile behavior
- performance

---

## 16. Add visible command menu trigger

### Problem

The command menu exists but is only discoverable through keyboard shortcut. Most users will not know it exists.

### Required change

Add a visible command menu trigger in the navbar.

Example label:

```text
⌘K
```

or on Windows-friendly layouts:

```text
Ctrl K
```

Preferred button style:

- small
- monospaced
- subtle border
- visible in desktop nav
- accessible label: “Open command menu”

Example:

```tsx
<button
  type="button"
  aria-label="Open command menu"
  className="..."
>
  ⌘K
</button>
```

Implementation options:

Preferred:

- create `CommandMenuProvider`
- store open state globally
- allow navbar button and keyboard shortcut to open the same menu

Acceptable simpler implementation:

- dispatch a custom browser event from navbar
- listen in `CommandMenu`

Do not duplicate command menu state in multiple places.

---

## 17. Replace default README

### Problem

The README is still the default Next.js README. This makes the project look unfinished.

### Required change

Replace it with a real project README.

README must include:

- Project title
- Concept: From Noise to Signal
- Short description
- Tech stack
- Local setup
- Development commands
- Content editing guide
- How to add a new system
- How to add a new project
- How to add awards/images
- How to add/update resume PDF
- Motion and reduced-motion behavior
- Deployment notes for Netlify

Suggested README structure:

```md
# Sarath Konuru Portfolio

A modular Next.js portfolio built around the concept **From Noise to Signal**.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion
- GSAP where needed
- MDX-ready content structure

## Local Development

npm install
npm run dev

## Build

npm run build

## Content Model

Content lives in `/data` and `/content`.

## Adding a System

Edit `/data/systems.ts`.

## Adding a Project

Edit `/data/projects.ts`.

## Adding Awards

Add images to `/public/awards` and update `/data/awards.ts`.

## Resume

Place resume PDF in `/public/resume`.

## Deployment

Target deployment: Netlify.
```

---

## 18. Fix resume handling before launch

### Current issue

Resume availability is currently disabled or incomplete.

### Required behavior

If the resume PDF is not present:

- Do not show misleading “Download Resume” buttons.
- Use “Resume coming soon” only if necessary.

If the resume PDF is present:

- Place it at:

```text
/public/resume/sarath-konuru-resume.pdf
```

- Set resume availability to true in the profile data.
- Hero, navbar, command menu, and contact panel should all use the same resume URL from `profile`.

### Button labeling

If the route is `/resume`, label it:

```text
View Resume
```

If the link goes directly to the PDF, label it:

```text
Download Resume
```

Do not label a page route as a direct download.

---

## 19. Decide notes behavior

### Problem

Notes are partially implemented. There is a notes route and sample MDX content, but full MDX rendering is not wired.

### Required decision

For V1, choose one:

#### Option A: Hide notes completely

If no strong notes are ready, hide notes from public navigation and Work Index.

Keep the code if desired, but do not expose unfinished notes.

#### Option B: Finish notes properly

If notes are exposed, implement proper MDX rendering.

Required:

- Load MDX content by slug
- Render the full note body
- Add metadata per note
- Ensure only `visible: true` notes are shown
- Remove placeholder text like “Full MDX body can be wired when this note is published.”

Do not expose half-built notes.

Recommended for V1: hide notes unless there are polished notes ready.

---

## 20. Add metadata for dynamic pages

### Problem

Dynamic pages need their own metadata for SEO and sharing.

### Required change

Add `generateMetadata` to:

```text
app/systems/[slug]/page.tsx
app/projects/[slug]/page.tsx
app/notes/[slug]/page.tsx
```

Example:

```ts
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getSystemBySlug(slug);

  if (!item) {
    return {
      title: "Case Study Not Found | Sarath Konuru"
    };
  }

  return {
    title: `${item.title} | Sarath Konuru`,
    description: item.summary
  };
}
```

Use the correct data lookup for systems, projects, and notes.

---

## 21. Add sitemap and robots

Add:

```text
app/sitemap.ts
app/robots.ts
```

### Sitemap should include

- homepage
- systems pages
- project pages
- visible notes, if enabled

Use `NEXT_PUBLIC_SITE_URL` as the base URL.

Fallback can be:

```text
https://sarathkonuru.dev
```

or another configured domain.

### Robots

Allow indexing.

Example:

```ts
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
```

---

## 22. Fix accessibility issues

### Section headings

Current `aria-labelledby` usage may point to paragraphs instead of headings.

Update `SectionHeader` to accept an optional `id`.

Example:

```tsx
<SectionHeader id="context-heading" eyebrow="01" title="Context" />
<section aria-labelledby="context-heading">
```

The `id` should be placed on the actual heading element.

If this is too much refactor, remove incorrect `aria-labelledby` attributes rather than pointing them to non-heading content.

### External links

Add:

```tsx
target="_blank"
rel="noopener noreferrer"
```

for:

- GitHub
- LinkedIn
- external project demos
- external repo links

Do not use this for email or internal routes.

### Focus states

All interactive elements must have visible keyboard focus states.

Use cyan/blue focus rings that fit the palette.

### Motion accessibility

Keep:

- `prefers-reduced-motion` support
- mobile motion reduction
- static fallback layout

Do not add motion that cannot be disabled.

---

## 23. Verify build and dependencies

Before returning the updated project, run:

```bash
npm ci
npm run lint
npm run build
```

If `npm ci` fails because lockfile/dependencies are inconsistent, fix the package setup.

### MDX type concern

If the project imports:

```ts
import type { MDXComponents } from "mdx/types";
```

ensure the needed type dependency exists.

Likely fix:

```bash
npm install -D @types/mdx
```

or remove/replace the type import if MDX is not used in V1.

Do not leave the project in a state that only works because of transitive dependency luck.

---

## 24. Netlify deployment readiness

Target deployment platform:

```text
Netlify
```

Do not constrain the app to GitHub Pages static export unless explicitly requested later.

The project should support normal Next.js deployment on Netlify.

### Required deployment notes

Add `.env.example`:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

Add README deployment section:

```md
## Deploying to Netlify

Build command:
npm run build

Environment variables:
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

Do not add unnecessary server features.

Keep the app static-friendly where possible, but do not force `output: "export"`.

---

## 25. Performance rules

The portfolio should feel premium without becoming heavy.

Required:

- avoid unnecessary large animation libraries beyond what is already used
- keep animations GPU-friendly where possible
- avoid layout-shifting animation
- lazy-load heavy visuals/images
- optimize award images and screenshots
- keep background motion low-opacity and lightweight
- ensure Lighthouse performance remains strong
- avoid huge SVGs or particle systems that degrade scroll performance

Motion must not delay access to content, resume, or contact links.

---

## 26. Do not over-add effects

Approved effects:

- Hero parallax
- Transformation dolly/glow
- subtle reveal animations
- animated gradient effects
- subtle liquid background texture
- microinteractions
- selective morphing
- self-drawing decision/architecture lines
- ambient background motion
- award lightbox later

Do not add:

- heavy horizontal scrolling
- 3D scenes
- live collaborative cursors
- animated skill tornadoes
- cursor gimmicks that hurt usability
- excessive section transitions
- effects on contact CTA that reduce usability
- effects that hide or delay resume/contact access
- foreground liquid blobs over text
- rainbow gradients
- constant particle storms

Motion should support thought process:

- noise becoming signal
- pressure becoming decision
- manual work becoming leverage
- risk becoming control

Motion should not be used to animate technical diagrams for its own sake.

---

## 27. Keep the visual concept intact

Preserve the current direction:

- dark editorial system
- bluish/cyan/indigo palette
- restrained cinematic motion
- strong typography
- modular cards
- impact-first structure
- “From Noise to Signal” thesis

Do not switch to a generic SaaS template.

Do not make it look like a generic developer portfolio.

Do not make it look like an overdesigned WebGL demo.

The site should feel like a senior engineer’s thinking system, not a decoration gallery.

---

## 28. Additional User Requested Changes

Add the user's next 3-4 changes here before implementation.

Use this format:

```md
### Change 1: [Short title]

[Clear description]

### Change 2: [Short title]

[Clear description]

### Change 3: [Short title]

[Clear description]

### Change 4: [Short title]

[Clear description]
```

Do not scatter additional requests across chat messages. Keep them in this section so the implementation agent handles everything in one pass.

---

## 29. Final acceptance checklist

Before returning the update, confirm:

- `npm run build` passes
- `npm run lint` passes
- README is no longer default boilerplate
- orange/red palette is removed
- blue/cyan/indigo palette is applied consistently
- animated gradients are subtle and restrained
- ambient background motion is faint and non-distracting
- microinteractions exist for primary interactive elements
- morphing is used only in approved signature moments, if implemented
- self-drawing lines are used for decision/architecture paths, if implemented
- no real-time collaborative animation feature is implemented
- case-study architecture flows are specific
- command menu has visible trigger
- dynamic metadata exists
- sitemap and robots exist
- resume behavior is honest and centralized
- notes are either hidden or fully implemented
- external links are safe
- focus states are visible
- motion respects reduced-motion and mobile
- no major content is hardcoded unnecessarily
