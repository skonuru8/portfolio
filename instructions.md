# Portfolio Build Instructions

## Project Goal

Build a premium, modular, content-driven portfolio for **Sri Sai Sarath Chandra Konuru**, a Senior Software Engineer, using **Next.js**, not static HTML.

The portfolio must not feel like a generic resume website. It must act as a proof system: it should show how Sarath thinks, how he handles messy systems, and how his work turns ambiguity, bottlenecks, risk, and manual effort into measurable outcomes.

The core design concept is:

> **From Noise to Signal**

The portfolio should communicate that Sarath turns messy, slow, risky, or manual workflows into fast, secure, measurable systems.

The portfolio must be modular so future changes are easy:

- Add or remove projects
- Add or remove job experience
- Add award images
- Add resume PDF
- Add project screenshots
- Add GitHub/demo links
- Add new learnings or notes
- Hide older content without deleting it
- Reorder sections or cards through data fields

The user will provide later:

1. Resume PDF
2. Award images
3. Project screenshots
4. GitHub/demo links

The first version must still work without those assets by using placeholders and optional fields.

---

# Core Positioning

## Main Thesis

Use this as the guiding message:

> I turn messy, slow, risky workflows into fast, secure, measurable systems.

Alternative longer thesis:

> I build systems that make bottlenecks measurable, architecture visible, and production workflows faster.

The portfolio should avoid generic phrases like:

- Passionate developer
- I love building applications
- Full-stack developer with experience in many technologies
- Let’s build together as the main CTA
- Welcome to my portfolio

The portfolio should emphasize:

- Thought process
- Decision-making
- Ownership under ambiguity
- Production pressure
- Measurable impact
- Systems thinking
- Automation mindset
- Security and reliability awareness

---

# Audience Priorities

Design for these audiences in this order:

## 1. Recruiters and hiring managers from LinkedIn

They need fast answers:

- Who is this?
- What roles does he fit?
- What impact has he had?
- Can I download the resume?
- Can I contact him?

## 2. Engineering managers

They need deeper proof:

- How does he think?
- What tradeoffs did he make?
- What constraints did he handle?
- What systems did he own?
- Can he reason beyond code?

## 3. GitHub / inbound visitors

They need project credibility:

- What has he built independently?
- Are the projects interesting?
- Are there demos, code links, screenshots?
- Does the portfolio itself show quality?

---

# Design Concept

## Name / Theme

**From Noise to Signal**

The site should visually represent disorder becoming clarity.

Examples of “noise”:

- Slow workflows
- Manual review
- Risky commits
- Unclear ownership
- Latency
- Rework
- Unstructured data
- Handoffs
- Queues
- Bugs
- Deployment friction
- Messy job boards
- Sensitive data exposure

Examples of “signal”:

- Measurable reduction
- Ranked queues
- Clean decision paths
- Secure output
- Faster workflows
- Automated pipelines
- Better ownership boundaries
- Stable delivery

The portfolio should feel like a sophisticated engineering case-study site, not a design agency website and not a static resume page.

---

# Visual Direction

## Overall Look

Use a dark, premium, editorial/technical visual style inspired by the user’s existing portfolio, but reorganized around proof and thought process.

Keep the spirit of the current design:

- Dark background
- Large display typography
- Monospace labels
- Orange accent
- Green/cyan secondary accent
- Grain texture
- Grid lines
- Big section headers
- Metric cards
- Clean technical feel

Avoid turning the page into a gimmicky animation showcase.

## Color Palette

Use this palette or a close equivalent:

```css
--bg: #080808;
--bg-soft: #0f0f0f;
--panel: #111111;
--ink: #f0ebe2;
--ink-muted: #9a9087;
--line: rgba(240, 235, 226, 0.08);
--accent: #ff4500;
--accent-soft: rgba(255, 69, 0, 0.12);
--signal: #3dffc0;
--signal-soft: rgba(61, 255, 192, 0.12);
```

Optional alternate accent if the design needs a cooler technical feel:

```css
--cyan: #22d3ee;
--green: #10b981;
```

## Typography

Use fonts similar to the current portfolio:

- Display: `Bebas Neue`, `Space Grotesk`, or `Satoshi`
- Body: `Syne`, `Inter`, or `Manrope`
- Mono: `Space Mono` or `JetBrains Mono`

Preferred combination:

- Headings: `Bebas Neue` or `Space Grotesk`
- Body: `Syne` or `Inter`
- Labels/code-like elements: `Space Mono`

Typography rules:

- Hero should use large, confident display type.
- Body text must remain readable.
- Labels should be uppercase monospace.
- Do not overuse tiny text.
- Avoid huge blocks of text on the homepage.

---

# Technology Stack

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- GSAP with ScrollTrigger only where needed
- MDX for long-form case studies and notes
- React Flow only if architecture diagrams need node-based interactivity
- shadcn/ui only for reusable UI primitives where useful
- Lucide icons
- Vercel deployment

Optional:

- Lenis for smooth scrolling, only if performance remains strong
- next-mdx-remote or Contentlayer-style setup if desired

Do not use:

- Static HTML as the final implementation
- Excessive Three.js/WebGL in the first version
- Animation libraries that add complexity without value
- Decorative effects that reduce usability

---

# Required Project Structure

Use a modular file structure similar to this:

```txt
portfolio/
  app/
    layout.tsx
    page.tsx
    globals.css
    systems/
      [slug]/
        page.tsx
    projects/
      [slug]/
        page.tsx
    notes/
      [slug]/
        page.tsx
    resume/
      page.tsx

  components/
    layout/
      Navbar.tsx
      Footer.tsx
      Section.tsx
      SectionHeader.tsx
      CommandMenu.tsx

    home/
      Hero.tsx
      ImpactMetrics.tsx
      Transformations.tsx
      HowIThink.tsx
      WorkIndex.tsx
      RecognitionPreview.tsx
      ContactPanel.tsx

    cards/
      MetricCard.tsx
      TransformationCard.tsx
      SystemCard.tsx
      ProjectCard.tsx
      ExperienceCard.tsx
      AwardCard.tsx
      SkillGroupCard.tsx
      NoteCard.tsx

    motion/
      NoiseToSignalHero.tsx
      PressureDollyZoom.tsx
      ParallaxLayer.tsx
      Reveal.tsx
      MagneticLink.tsx

    diagrams/
      SimpleFlowDiagram.tsx
      BeforeAfterDiagram.tsx
      DecisionPath.tsx

    mdx/
      MDXComponents.tsx

  data/
    profile.ts
    metrics.ts
    transformations.ts
    systems.ts
    projects.ts
    experience.ts
    awards.ts
    skills.ts
    notes.ts
    navigation.ts

  content/
    systems/
      nokia-cpq.mdx
      phia-healthcare.mdx
      nissan-telemetry.mdx
    projects/
      job-hunter.mdx
      privacy-guard.mdx
    notes/
      sample-note.mdx

  public/
    resume/
      sarath-konuru-resume.pdf
    awards/
      placeholder-award.jpg
    projects/
      placeholder-project.jpg
    images/
      og-image.png
```

The exact structure may vary, but the principles must remain:

- Content lives in data files or MDX.
- Layout lives in reusable components.
- Routes are generated from slugs.
- Assets live in `public`.
- Adding/removing content should not require layout rewrites.

---

# Data Model Rules

Every content object should support these control fields:

```ts
visible: boolean;
featured?: boolean;
order: number;
slug?: string;
```

Use these to hide, feature, or reorder content without deleting it.

Sorting rule:

```ts
items
  .filter((item) => item.visible)
  .sort((a, b) => a.order - b.order)
```

Do not hardcode content directly into page components except static section labels.

---

# Profile Data

Create `data/profile.ts`:

```ts
export const profile = {
  name: "Sri Sai Sarath Chandra Konuru",
  shortName: "Sarath Konuru",
  title: "Senior Software Engineer",
  location: "Jersey City, NJ",
  availability: "Open to onsite and hybrid roles",
  email: "konurusarath@gmail.com",
  linkedin: "https://linkedin.com/in/konurusarath",
  github: "https://github.com/skonuru8",
  resumeUrl: "/resume/sarath-konuru-resume.pdf",
  resumeLastUpdated: "May 2026",
  headline:
    "I turn messy, slow, risky workflows into fast, secure, measurable systems.",
  subheadline:
    "Senior Software Engineer with 6+ years across telecom, healthcare, automotive, and AI tooling, owning Java, Node.js, Python, cloud-native microservices, workflow automation, and full-stack delivery.",
};
```

The resume file may not exist initially. If absent, the UI should still render and show a disabled or placeholder state, or use a configurable fallback.

---

# Homepage Structure

The homepage must use this order:

```txt
01. Hero
02. Impact
03. Transformations
04. How I Think
05. Work Index
06. Recognition
07. Contact
```

Do not lead with a traditional Experience section.

Do not make Skills a dominant homepage section. Skills should support proof, not replace proof.

---

# Section 01: Hero

## Purpose

The hero must communicate the portfolio thesis immediately.

It should not be a generic “Hi, I’m Sarath” hero.

## Required Content

Use:

```txt
From Noise to Signal
```

And one of these headline options:

```txt
I turn messy, slow, risky workflows into fast, secure, measurable systems.
```

or:

```txt
I build systems that make bottlenecks measurable, architecture visible, and production workflows faster.
```

Subheadline:

```txt
Senior Software Engineer with 6+ years across telecom, healthcare, automotive, and AI tooling, owning Java, Node.js, Python, cloud-native microservices, workflow automation, and full-stack delivery.
```

## CTAs

Hero must include these CTAs:

- View Transformations
- Download Resume
- GitHub
- LinkedIn

If resume PDF is not provided yet, keep the button but mark it as “Resume coming soon” or disable gracefully using data config.

## Motion

Hero should have subtle parallax representing “noise becoming signal.”

Use abstract fragments such as:

```txt
latency
manual review
risk
handoff
queue
rework
unclear ownership
deployment friction
slow workflow
sensitive data
```

These fragments should drift or appear scattered, then visually align as the user scrolls or as the hero loads.

Do not show technical architecture boxes in the hero.

Do not overload the hero with too many effects.

---

# Section 02: Impact

## Purpose

Show proof by numbers.

Metrics should act as evidence and navigation into deeper proof.

## Required Metrics

Create `data/metrics.ts`:

```ts
export const metrics = [
  {
    value: "85%",
    label: "Processing reduction",
    description:
      "Reduced Nokia CPQ contract processing from 7 minutes to under 1 minute.",
    linkedTo: "/systems/nokia-cpq",
    visible: true,
    featured: true,
    order: 1,
  },
  {
    value: "55%",
    label: "API latency reduction",
    description:
      "Improved response time from 11s to under 5s through Redis caching and Cosmos DB optimization.",
    linkedTo: "/systems/nokia-cpq",
    visible: true,
    featured: true,
    order: 2,
  },
  {
    value: "95%",
    label: "Deployment success",
    description:
      "Owned Jenkins and GitLab CI/CD pipelines across healthcare and cloud applications.",
    linkedTo: "/systems/phia-healthcare",
    visible: true,
    featured: true,
    order: 3,
  },
  {
    value: "100+ GB",
    label: "Telemetry processed",
    description:
      "Supported high-volume vehicle telemetry ingestion through AWS Kinesis, S3, and DynamoDB.",
    linkedTo: "/systems/nissan-telemetry",
    visible: true,
    featured: true,
    order: 4,
  },
  {
    value: "70%",
    label: "Apply-queue noise reduction",
    description:
      "Reduced low-fit application noise through a multi-signal semantic scoring engine.",
    linkedTo: "/projects/job-hunter",
    visible: true,
    featured: true,
    order: 5,
  },
  {
    value: "60%",
    label: "Fewer unnecessary LLM calls",
    description:
      "Reduced unnecessary external model calls through local-first privacy analysis.",
    linkedTo: "/projects/privacy-guard",
    visible: true,
    featured: true,
    order: 6,
  },
];
```

## UI Rules

- Use 4 to 6 visible metric cards.
- Numbers should be large.
- Description should be concise.
- Cards may link to case studies.
- Use count-up animation only if it does not hurt readability.
- Use subtle motion, not heavy effects.

---

# Section 03: Transformations

## Purpose

This is the main portfolio section.

It should show before/decision/after stories, not resume bullets.

Required homepage transformations:

1. Nokia CPQ Contract Engine
2. Job Hunter
3. Privacy Guard

PHIA and Nissan can appear in Work Index and have detail pages, but the homepage should prioritize the three strongest narrative transformations first.

## Data Model

Create `data/transformations.ts`:

```ts
export const transformations = [
  {
    slug: "nokia-cpq",
    title: "Nokia CPQ Contract Engine",
    category: "Enterprise System",
    domain: "Telecom",
    before: "Contract processing was slow, tightly coupled, and deployment-heavy.",
    decision:
      "Split the overloaded Contract Case service at ownership boundaries and optimized high-latency API paths.",
    after: "Contract processing dropped from 7 minutes to under 1 minute.",
    impact: ["85% processing reduction", "55% API latency reduction", "10+ microservices touched"],
    link: "/systems/nokia-cpq",
    motionType: "pressure-dolly",
    visible: true,
    featured: true,
    order: 1,
  },
  {
    slug: "job-hunter",
    title: "Autonomous Job Intelligence Pipeline",
    category: "Independent System",
    domain: "AI Automation",
    before:
      "Manual job review across multiple boards consumed 3+ hours daily with inconsistent triage quality.",
    decision:
      "Turn role-fit judgment into a scoring pipeline that ranks opportunities and generates tailored application artifacts.",
    after:
      "Daily review dropped to under 30 minutes while low-fit apply-queue noise fell by over 70%.",
    impact: ["3+ hours to under 30 minutes", "70% less apply-queue noise", "20 min to under 2 min artifact generation"],
    link: "/projects/job-hunter",
    motionType: "noise-collapse",
    visible: true,
    featured: true,
    order: 2,
  },
  {
    slug: "privacy-guard",
    title: "AI Privacy Enforcement Extension",
    category: "Independent System",
    domain: "Developer Tooling / Security",
    before:
      "The tool designed to prevent leaks risked leaking raw diffs to external AI providers.",
    decision:
      "Sanitize before intelligence: run local checks first, scrub outbound payloads, then use LLM reasoning only when needed.",
    after:
      "Unnecessary LLM calls dropped by 60%, and outbound payloads were sanitized before transmission.",
    impact: ["60% fewer unnecessary LLM calls", "100% outbound payload sanitization", "3 regulatory frameworks covered"],
    link: "/projects/privacy-guard",
    motionType: "risk-to-control",
    visible: true,
    featured: true,
    order: 3,
  },
];
```

## UI Rules

Each transformation card/section must show:

- Before
- Decision
- After
- Impact numbers
- Link to full case study

Avoid long bullet lists on homepage.

Motion should support the story:

- Before state may look noisy/compressed.
- Decision should appear clear and centered.
- After state should look calm, aligned, measurable.

---

# Motion Strategy

## Overall Rule

Every effect must do at least one of these:

1. Reveal thought process
2. Show chaos becoming clarity
3. Emphasize a pressure moment
4. Make impact feel measurable
5. Improve navigation or orientation

If an effect does none of these, do not use it.

## Do Not Use Motion For

- Random decorative parallax
- Technical jargon overload
- Constant section movement
- Skills animation beyond simple reveal
- Awards beyond light hover/modal
- Contact form/button gimmicks
- Heavy page transitions that slow navigation

## Motion Allocation

Use motion in only these places:

```txt
Hero: subtle noise-to-signal parallax
Impact: subtle metric reveal/count-up
Transformations: before/decision/after storytelling
Dolly Zoom: only for selected pressure moments
Awards: optional light hover only
Skills/Work Index: minimal reveal
Contact: calm and direct
```

## Dolly Zoom Usage

Dolly zoom must be used sparingly.

Use only for:

1. Nokia: 7-minute contract bottleneck
2. Job Hunter: 3+ hours manual job review overload
3. Privacy Guard: raw diff leakage risk

Dolly zoom should represent mental/system pressure, not technical architecture.

Implementation can be a DOM-based fake dolly zoom:

- Background layer scales up
- Foreground text remains steady or slightly scales down
- Noise fragments compress inward
- Result state relaxes/spreads out

Do not use actual Three.js/WebGL for dolly zoom in V1.

## Parallax Usage

Use parallax to represent:

- Noise becoming signal
- Pressure becoming decision
- Manual work becoming leverage
- Risk becoming control

Do not use parallax to animate technology boxes like Java, Redis, Cosmos DB, etc. Technical details belong in case study detail pages or Work Index.

---

# Section 04: How I Think

## Purpose

This section should reveal Sarath’s engineering mindset.

It should be personality-driven but professional.

## Required Content

Use a sequence like:

```txt
I look for the bottleneck.
I separate symptoms from causes.
I identify the constraints that actually matter.
I choose the smallest architecture that removes the constraint.
I measure whether it worked.
I leave the system easier to operate.
```

Alternative card structure:

```ts
export const thinking = [
  {
    title: "Bottlenecks are more honest than opinions.",
    body: "I look for where time, money, reliability, or trust is being lost, then design around that constraint.",
  },
  {
    title: "Ownership means closing the loop.",
    body: "Backend, frontend, CI/CD, infrastructure, debugging, and stakeholder translation all matter when the system has to work.",
  },
  {
    title: "Automation is leverage.",
    body: "If a workflow repeats and still requires judgment, I try to encode that judgment into a reviewable system.",
  },
];
```

## UI Rules

- Use scroll-stack or cards.
- Keep it readable.
- This section should feel personal but not cute.
- Do not overuse sarcasm or overly casual copy in the actual portfolio.

---

# Section 05: Work Index

## Purpose

The Work Index is the modular browseable section containing systems, projects, experience, skills, and notes.

It should be clean, filterable, and not too animated.

## Filters

Recommended filters:

```txt
All
Enterprise Systems
Independent Systems
Healthcare
Telecom
Automotive
AI Tooling
Backend
Cloud
Security
```

## Required Items

Show these systems/projects:

### Enterprise Systems

1. Nokia CPQ Contract Engine
2. PHIA Healthcare Appeals Automation
3. Nissan Telemetry Ingestion Platform
4. DaxP Healthcare Platform
5. IRS Form OCR Pipeline

### Independent Systems

1. Job Hunter
2. Privacy Guard

## Card Fields

Each Work Index card should show:

- Title
- Type
- Domain
- One-line summary
- 2 to 3 impact chips
- Stack preview
- Link to detail page if available

---

# Systems Data

Create `data/systems.ts`:

```ts
export const systems = [
  {
    slug: "nokia-cpq",
    title: "Nokia CPQ Contract Engine",
    type: "Enterprise System",
    domain: "Telecom",
    company: "Hitachi Vantara / Nokia",
    timeframe: "2019 - 2024",
    role: "Senior Software Engineer",
    summary:
      "Built and decomposed the business-critical Contract Case platform powering Nokia CPQ quote-to-cash workflows.",
    problem:
      "Contract processing was slow, tightly coupled, and difficult to deploy safely.",
    decision:
      "Split the overloaded Contract Case service into three focused microservices and optimized high-latency API paths through Redis caching and Cosmos DB tuning.",
    impact: [
      "Reduced contract processing from 7 minutes to under 1 minute",
      "Cut API latency by 55%",
      "Contributed across 10+ Spring Boot microservices",
      "Mentored 5+ engineers across CPQ architecture",
    ],
    stack: [
      "Java",
      "Spring Boot",
      "Azure Service Bus",
      "Cosmos DB",
      "Redis",
      "REST APIs",
      "JUnit",
      "Mockito",
      "Azure Pipelines",
    ],
    tags: ["Backend", "Cloud", "Microservices", "Telecom"],
    visible: true,
    featured: true,
    order: 1,
  },
  {
    slug: "phia-healthcare",
    title: "PHIA Healthcare Appeals Automation",
    type: "Enterprise System",
    domain: "Healthcare",
    company: "Hitachi Vantara / The PHIA Group",
    timeframe: "2019 - 2024",
    role: "Full-Stack Developer",
    summary:
      "Owned full-stack delivery for a healthcare appeals automation platform processing ICE, PACE, and DICE workflows.",
    problem:
      "Healthcare appeals workflows were monolithic, SLA-sensitive, and difficult to operate efficiently.",
    decision:
      "Refactored Camunda BPMN workflows into modular subprocesses, secured access through Keycloak RBAC, and managed full-stack delivery across Spring Boot, Angular, SQL Server, and Jenkins.",
    impact: [
      "Owned delivery for 15+ months as sole full-stack developer",
      "Reduced workflow execution time by 10%",
      "Improved report generation by 15%",
      "Achieved 95% deployment success through Jenkins CI/CD ownership",
    ],
    stack: ["Java", "Spring Boot", "Angular", "Camunda BPMN", "Keycloak", "SQL Server", "Jenkins"],
    tags: ["Healthcare", "Workflow Automation", "Security", "Full-Stack"],
    visible: true,
    featured: false,
    order: 2,
  },
  {
    slug: "nissan-telemetry",
    title: "Nissan Telemetry Ingestion Platform",
    type: "Enterprise System",
    domain: "Automotive",
    company: "Hitachi Vantara / Nissan",
    timeframe: "2019 - 2024",
    role: "Software Engineer",
    summary:
      "Built services to normalize high-volume vehicle telemetry from binary, XML, and non-standard JSON into a canonical schema.",
    problem:
      "Vehicle telemetry arrived in inconsistent formats from heterogeneous fleets and needed reliable ingestion into AWS infrastructure.",
    decision:
      "Built format-specific Spring Boot and Drools transformation services and supported streaming through AWS Kinesis, S3, and DynamoDB.",
    impact: [
      "Processed 100+ GB of vehicle telemetry",
      "Reduced transformation processing time by 30%",
      "Supported real-time and on-demand data flows",
    ],
    stack: ["Java", "Spring Boot", "Drools", "AWS Kinesis", "S3", "DynamoDB", "Lambda", "Angular"],
    tags: ["Automotive", "Streaming", "AWS", "Backend"],
    visible: true,
    featured: false,
    order: 3,
  },
  {
    slug: "daxp-healthcare",
    title: "DaxP Healthcare Platform",
    type: "Enterprise System",
    domain: "Healthcare",
    company: "AquilaEdge LLC",
    timeframe: "Jan 2025 - Jun 2025",
    role: "Full-Stack Engineer",
    summary:
      "Served as the sole engineer on a multi-platform healthcare app supporting patient, doctor, pharmacy, and admin roles.",
    problem:
      "The platform needed end-to-end delivery across frontend, backend, authentication, infrastructure, and CI/CD with limited engineering support.",
    decision:
      "Built Flutter screens, Node.js REST APIs, JWT-based role access, GCP infrastructure, and self-hosted GitLab Runner pipelines.",
    impact: [
      "Sole engineer across architecture and delivery",
      "Supported four user role types",
      "Built zero-touch CI/CD deployment to GCP VMs",
    ],
    stack: ["Flutter", "Node.js", "GCP", "Cloud SQL", "JWT", "GitLab CI/CD"],
    tags: ["Healthcare", "Full-Stack", "GCP", "Mobile"],
    visible: true,
    featured: false,
    order: 4,
  },
  {
    slug: "irs-ocr-pipeline",
    title: "IRS Form OCR Pipeline",
    type: "Enterprise System",
    domain: "Document Automation",
    company: "Persistent Systems",
    timeframe: "Jan 2019 - Jul 2019",
    role: "Apprentice",
    summary:
      "Supported OCR preprocessing and validation workflows for thousands of daily IRS form scans.",
    problem:
      "Manual cleanup and sorting of scanned IRS forms consumed significant operational effort.",
    decision:
      "Built Python and OpenCV preprocessing scripts, ran Tesseract OCR batches, and contributed validation and form-recognition rules.",
    impact: ["Cut manual cleanup workload by about 30%", "Contributed to data accuracy above 95%"],
    stack: ["Python", "OpenCV", "Tesseract OCR", "Regex"],
    tags: ["Automation", "OCR", "Python"],
    visible: true,
    featured: false,
    order: 5,
  },
];
```

---

# Projects Data

Create `data/projects.ts`:

```ts
export const projects = [
  {
    slug: "job-hunter",
    title: "Autonomous Job Intelligence Pipeline",
    type: "Independent System",
    domain: "AI Automation",
    status: "Active",
    summary:
      "Built a pipeline that discovers jobs, scores role fit, generates tailored resumes and cover letters, and routes applications through a React review UI.",
    problem:
      "Manual job discovery and resume tailoring consumed hours every day with inconsistent triage quality.",
    decision:
      "Designed a multi-signal semantic scoring pipeline and dual-artifact generation engine calibrated against extracted job requirements.",
    impact: [
      "Reduced daily review time from 3+ hours to under 30 minutes",
      "Reduced apply-queue noise by over 70%",
      "Cut resume and cover-letter generation from 20 minutes to under 2 minutes",
    ],
    stack: ["TypeScript", "Node.js", "Python", "PostgreSQL", "Redis", "React"],
    githubUrl: "",
    demoUrl: "",
    screenshots: [],
    tags: ["AI Automation", "Full-Stack", "Productivity", "React"],
    visible: true,
    featured: true,
    order: 1,
  },
  {
    slug: "privacy-guard",
    title: "AI Privacy Enforcement Extension",
    type: "Independent System",
    domain: "Developer Tooling / Security",
    status: "Active",
    summary:
      "Built a VS Code extension that scans staged diffs before commits to catch credentials, PII, and privacy violations.",
    problem:
      "Credential leaks and PII exposure could slip through code review, while sending raw diffs to external AI providers created a separate privacy risk.",
    decision:
      "Combined local static analysis, outbound sanitization, and selective LLM reasoning through hot-swappable AI providers.",
    impact: [
      "Reduced unnecessary LLM API calls by 60%",
      "Sanitized 100% of outbound payloads before transmission",
      "Extended enforcement across source code and npm dependency risk profiles",
    ],
    stack: ["TypeScript", "Node.js", "VS Code Extension API", "Anthropic", "OpenAI"],
    githubUrl: "",
    demoUrl: "",
    screenshots: [],
    tags: ["Security", "AI Tooling", "Developer Tools", "VS Code"],
    visible: true,
    featured: true,
    order: 2,
  },
];
```

---

# Experience Data

Create `data/experience.ts`:

```ts
export const experience = [
  {
    company: "AquilaEdge LLC",
    role: "Full-Stack Engineer",
    location: "Remote",
    start: "Jan 2025",
    end: "Jun 2025",
    summary:
      "Served as the sole engineer on DaxP, a multi-platform healthcare application supporting patient, doctor, pharmacy, and admin roles.",
    linkedSystems: ["daxp-healthcare"],
    stack: ["Flutter", "Node.js", "GCP", "Cloud SQL", "JWT", "GitLab CI/CD"],
    visible: true,
    order: 1,
  },
  {
    company: "Hitachi Vantara",
    role: "Senior Software Engineer / Consultant",
    location: "Hyderabad, India",
    start: "Jul 2019",
    end: "Aug 2024",
    summary:
      "Delivered full-stack and backend systems across Nokia CPQ, PHIA healthcare workflows, and Nissan telemetry platforms.",
    linkedSystems: ["nokia-cpq", "phia-healthcare", "nissan-telemetry"],
    stack: ["Java", "Spring Boot", "Angular", "Azure", "AWS", "Cosmos DB", "Redis", "DynamoDB"],
    visible: true,
    order: 2,
  },
  {
    company: "Persistent Systems",
    role: "Apprentice",
    location: "Hyderabad, India",
    start: "Jan 2019",
    end: "Jul 2019",
    summary:
      "Supported OCR preprocessing, validation, and form-recognition workflows for high-volume IRS document processing.",
    linkedSystems: ["irs-ocr-pipeline"],
    stack: ["Python", "OpenCV", "Tesseract OCR"],
    visible: true,
    order: 3,
  },
];
```

Experience should appear lower on the homepage as a timeline, not as the main proof section.

---

# Skills Data

Create `data/skills.ts`:

```ts
export const skills = [
  {
    group: "Languages",
    items: ["Java", "JavaScript", "TypeScript", "Python", "C", "Golang"],
    visible: true,
    order: 1,
  },
  {
    group: "Backend",
    items: [
      "Node.js",
      "Spring Boot",
      "Spring Cloud",
      "Spring MVC",
      "Microservices",
      "REST APIs",
      "GraphQL",
      "FastAPI",
      "Camunda BPMN",
      "Hibernate/JPA",
      "Drools",
    ],
    visible: true,
    order: 2,
  },
  {
    group: "Frontend",
    items: ["Angular", "RxJS", "React", "Redux", "Flutter", "HTML", "CSS", "Bootstrap"],
    visible: true,
    order: 3,
  },
  {
    group: "Messaging & Streaming",
    items: ["Apache Kafka", "RabbitMQ", "Azure Service Bus", "JMS", "AWS SQS", "AWS Kinesis"],
    visible: true,
    order: 4,
  },
  {
    group: "Cloud & DevOps",
    items: [
      "Microsoft Azure",
      "Azure Pipelines",
      "Azure Artifacts",
      "Microsoft Entra ID",
      "AWS S3",
      "AWS EC2",
      "AWS Lambda",
      "GCP Compute Engine",
      "GCP Cloud Storage",
      "GCP Cloud SQL",
      "GCP VPC",
      "Docker",
      "Kubernetes",
      "Jenkins",
      "GitLab CI/CD",
    ],
    visible: true,
    order: 5,
  },
  {
    group: "Databases",
    items: ["SQL Server", "Azure Cosmos DB", "Oracle", "PostgreSQL", "Redis", "DynamoDB", "pgvector"],
    visible: true,
    order: 6,
  },
  {
    group: "Security",
    items: ["OAuth2", "JWT", "SSO", "LDAP", "MFA", "Spring Security", "Keycloak"],
    visible: true,
    order: 7,
  },
  {
    group: "Testing & Quality",
    items: ["JUnit", "Mockito", "SonarQube", "Mocha", "Jasmine", "Karma", "Vitest", "TDD"],
    visible: true,
    order: 8,
  },
];
```

Do not delete existing skills unless the user explicitly asks.

---

# Awards Data and Image Handling

Create `data/awards.ts`:

```ts
export const awards = [
  {
    title: "Business Appreciation Award",
    organization: "Nokia",
    year: "2024",
    description:
      "Recognized alongside the lead architect as one of only two recipients for outstanding contributions to the telecommunications sales system.",
    image: "/awards/nokia-business-appreciation.jpg",
    visible: true,
    featured: true,
    order: 1,
  },
  {
    title: "Annual SPOT Award + Quarterly/Monthly Awards",
    organization: "Nokia",
    year: "2023",
    description:
      "Multiple recognition awards for exceptional technical contributions and project impact.",
    image: "/awards/spot-award.jpg",
    visible: true,
    featured: true,
    order: 2,
  },
  {
    title: "Special Recognition Awards",
    organization: "Nokia",
    year: "2023",
    description:
      "Recognized for UAT excellence, leadership, mentoring, technical reliability, and cross-system expertise.",
    image: "/awards/special-recognition.jpg",
    visible: true,
    featured: true,
    order: 3,
  },
];
```

## UI Rules

Awards should appear as a **Recognition** or **Awards Wall** section.

Do:

- Show award title, organization, year, short description.
- Support optional image.
- If image is missing, use a graceful placeholder.
- Clicking an award image should open a modal/lightbox.
- Keep this section credible and calm.

Do not:

- Make awards look like a certificate dump.
- Add heavy motion.
- Make the awards section dominate the homepage.

---

# Notes / Learnings

The portfolio should support adding future learning notes, but this can be optional in V1.

Create `data/notes.ts`:

```ts
export const notes = [
  {
    slug: "cache-first-api-patterns",
    title: "Cache-first API patterns",
    category: "Backend Architecture",
    date: "2026-05",
    summary:
      "Notes on when caching reduces latency and when it creates invalidation problems.",
    tags: ["Redis", "API Design", "Performance"],
    visible: false,
    featured: false,
    order: 1,
  },
];
```

Name the section one of:

- System Notes
- Engineering Notes
- Field Notes

Preferred: **System Notes**

Do not call it “Blog” unless the user specifically asks.

---

# Detail Page Template

Every system/project detail page must follow this structure:

```txt
1. Case study hero
2. Context
3. Pressure / Problem
4. Constraints
5. Decision
6. Tradeoffs
7. Architecture / Flow
8. Impact
9. What I would improve now
10. Related systems/projects
11. Contact CTA
```

## Required Case Study Sections

### Context

Explain what the system was and why it mattered.

### Pressure / Problem

Explain what was slow, risky, manual, unclear, or broken.

### Constraints

List real constraints. Examples:

- Production system
- Multiple downstream services
- Stakeholder deadlines
- Compliance-sensitive workflow
- Limited engineering support
- Existing architecture boundaries
- Deployment risk
- Data consistency requirements

### Decision

Explain what Sarath chose to do.

### Tradeoffs

Explain what became better and what became harder.

This is important because it shows senior thinking.

### Architecture / Flow

Use simple diagrams or visual flows.

Do not overuse jargon. Diagrams should clarify, not decorate.

### Impact

Use numbers and direct results.

### What I Would Improve Now

Add a section showing maturity.

Example:

```txt
What I would improve today:
- Add distributed tracing across service boundaries
- Formalize contract testing between decomposed services
- Add dashboards for queue lag, cache hit rates, and latency trends
```

Do not pretend every past system was perfect.

---

# Required Detail Pages

Implement pages for at least:

```txt
/systems/nokia-cpq
/projects/job-hunter
/projects/privacy-guard
```

Also prepare routes/data for:

```txt
/systems/phia-healthcare
/systems/nissan-telemetry
/systems/daxp-healthcare
/systems/irs-ocr-pipeline
```

If full content is not ready, these pages can use a compact case-study template.

---

# Navigation

## Navbar

Use a minimal navbar:

```txt
Impact
Transformations
Thinking
Work
Recognition
Contact
Resume
```

Or shorter:

```txt
Impact
Work
Thinking
Recognition
Contact
Resume
```

## Resume Link

Resume must be visible in:

- Navbar
- Hero CTA
- Footer/contact

## Command Palette

Optional but recommended for premium UX.

Trigger:

```txt
⌘K
```

Items:

```txt
View Impact
View Transformations
Nokia CPQ
Job Hunter
Privacy Guard
Work Index
Recognition
Download Resume
Email Sarath
GitHub
LinkedIn
```

Do not make command palette required for navigation. It is enhancement only.

---

# Contact Section

Contact should be direct, calm, and usable.

Required contact actions:

- Email
- LinkedIn
- GitHub
- Resume download

Suggested copy:

```txt
Ready for backend, full-stack, and cloud engineering roles where production ownership matters.
```

Avoid:

```txt
Let’s build together
```

unless used as secondary text.

No heavy animation in contact section.

---

# SEO and Metadata

Use Next.js metadata.

Required metadata:

```ts
export const metadata = {
  title: "Sarath Konuru | Senior Software Engineer",
  description:
    "Senior Software Engineer building cloud-native systems across Java, Node.js, Python, Azure, AWS, GCP, workflow automation, and AI tooling.",
  openGraph: {
    title: "Sarath Konuru | From Noise to Signal",
    description:
      "Portfolio of Sarath Konuru, Senior Software Engineer turning messy workflows into fast, secure, measurable systems.",
    type: "website",
    images: ["/images/og-image.png"],
  },
};
```

Use semantic HTML:

- `main`
- `section`
- `article`
- `nav`
- `footer`
- proper heading hierarchy

---

# Accessibility Requirements

The site must remain accessible despite motion.

Required:

- Respect `prefers-reduced-motion`
- All interactive elements keyboard accessible
- Focus states visible
- Sufficient color contrast
- Buttons and links clearly labeled
- No essential information conveyed only through animation
- Images must have alt text
- Award image modal must be keyboard closable
- Avoid cursor-only interactions

If custom cursor is included:

- Do not hide the default cursor on touch devices.
- Disable custom cursor for reduced-motion users.
- Do not make cursor necessary for interaction.

---

# Performance Requirements

The portfolio must feel premium and fast.

Requirements:

- Avoid unnecessary heavy libraries.
- Use Next Image for images.
- Lazy-load award and project images.
- Keep homepage JavaScript reasonable.
- Avoid using Three.js/WebGL in V1.
- Use dynamic imports for heavy components if needed.
- Do not block page load with animations.
- Keep Lighthouse performance strong.

Target:

- Fast first load
- Smooth scroll
- No jank on common laptop screens
- Good mobile performance

---

# Responsive Design

Must work well on:

- Desktop
- Laptop
- Tablet
- Mobile

Mobile rules:

- Reduce or disable parallax.
- Dolly zoom should be simplified or disabled.
- Cards should stack cleanly.
- Text must remain readable.
- Contact buttons should be easy to tap.
- Navbar should collapse into menu if needed.

---

# Visual Components

## MetricCard

Props:

```ts
type MetricCardProps = {
  value: string;
  label: string;
  description: string;
  linkedTo?: string;
};
```

## TransformationCard

Props:

```ts
type TransformationCardProps = {
  title: string;
  category: string;
  before: string;
  decision: string;
  after: string;
  impact: string[];
  link: string;
  motionType?: "pressure-dolly" | "noise-collapse" | "risk-to-control" | "none";
};
```

## WorkIndexCard

Props:

```ts
type WorkIndexCardProps = {
  title: string;
  type: string;
  domain: string;
  summary: string;
  impact: string[];
  stack: string[];
  link?: string;
  tags: string[];
};
```

## AwardCard

Props:

```ts
type AwardCardProps = {
  title: string;
  organization: string;
  year: string;
  description: string;
  image?: string;
};
```

---

# Content Tone

The portfolio copy should be:

- Confident
- Specific
- Measurable
- Senior
- Clear
- Direct

Avoid:

- Overly casual jokes
- Generic passion language
- Buzzword stuffing
- Long resume bullet dumps
- Fake humility
- Inflated claims without proof

The portfolio should not use the assistant’s sarcastic tone. It should sound professional and polished.

---

# Current Portfolio Migration Notes

The existing portfolio is a single HTML page with:

- Dark theme
- Large name hero
- Grain texture
- Custom cursor
- Marquee
- Stats cards
- Experience section
- Project cards
- Skills grid
- Awards section
- Contact/footer

Preserve the good parts:

- Dark editorial design
- Strong typography
- Metric-driven proof
- Orange/green accent system
- Monospace labels
- Awards recognition
- Skills grouped by category

Change the weak parts:

- Do not keep the homepage as resume-first.
- Do not lead with Experience bullets.
- Do not make projects walls of text.
- Do not bury case studies inside job history.
- Do not make the page only a prettier resume.

The redesign should turn the portfolio into:

```txt
Hero thesis
Impact proof
Transformation stories
Thought process
Modular work index
Recognition proof
Direct contact
```

---

# Implementation Phases

## Phase 1: Foundation

- Create Next.js project with TypeScript and Tailwind.
- Add app router structure.
- Create data files.
- Create reusable section/card components.
- Configure fonts.
- Configure global theme tokens.
- Add basic SEO metadata.

## Phase 2: Homepage

Build:

- Navbar
- Hero
- Impact metrics
- Transformations
- How I Think
- Work Index
- Recognition preview
- Contact/footer

## Phase 3: Detail Pages

Build:

- `/systems/[slug]`
- `/projects/[slug]`
- MDX support or data-driven detail pages
- Case study template
- Related work links

## Phase 4: Motion

Add:

- Hero noise-to-signal parallax
- Metric reveal
- Transformation before/decision/after motion
- Dolly zoom only for selected pressure moments
- Reduced-motion fallback

## Phase 5: Assets

When user provides assets:

- Add resume PDF to `/public/resume/`
- Add award images to `/public/awards/`
- Add project screenshots to `/public/projects/`
- Add GitHub/demo URLs to project data

## Phase 6: Polish

- Accessibility pass
- Mobile pass
- Performance pass
- SEO pass
- OpenGraph image
- Deployment to Vercel

---

# Definition of Done

The portfolio is complete when:

- It is built in Next.js, not static HTML.
- Content is modular and driven from data files/MDX.
- The homepage follows the agreed structure.
- The concept “From Noise to Signal” is clear.
- It shows thought process, not just technical skills.
- It includes impact metrics.
- It includes at least three featured transformations.
- It includes a Work Index.
- It supports awards with images.
- It supports resume download.
- It supports future projects/jobs/notes through data changes.
- Motion is tasteful and purposeful.
- Reduced-motion users are supported.
- Mobile experience is clean.
- Contact and resume are easy to find.
- The design feels premium, not generic.

---

# Final Creative Rule

The portfolio must not be an animated resume.

It must prove this:

> Sarath turns noise into signal: messy workflows into measurable systems, pressure into decisions, and technical complexity into usable outcomes.

