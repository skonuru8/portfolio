import type { CaseStudyDetail } from "@/types/content";

export type SystemEntry = {
  slug: string;
  title: string;
  type: string;
  domain: string;
  company: string;
  timeframe: string;
  role: string;
  summary: string;
  problem: string;
  decision: string;
  impact: string[];
  stack: string[];
  tags: string[];
  visible: boolean;
  featured?: boolean;
  order: number;
  detail: CaseStudyDetail;
};

export const systems: SystemEntry[] = [
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
    tags: ["Backend", "Cloud", "Microservices", "Telecom", "Enterprise Systems"],
    visible: true,
    featured: true,
    order: 1,
    detail: {
      context:
        "Contract Case sat in the middle of Nokia’s CPQ path: quotes, legal clauses, and fulfillment all depended on timely contract state. Latency and coupling directly slowed revenue-facing teams.",
      pressure:
        "Processing a single contract could take about seven minutes. APIs exceeded ten seconds on hot paths. Deployments were risky because responsibilities were fused in one service.",
      constraints: [
        "Production system with strict change windows",
        "Multiple downstream consumers of contract state",
        "Cosmos DB and cross-service consistency requirements",
        "Organizational pressure to avoid big-bang rewrites",
      ],
      decision:
        "Decomposed Contract Case at domain seams into focused services, then attacked latency with cache-first reads on stable reference data and query patterns tuned for Cosmos DB RU consumption.",
      tradeoffs: [
        {
          better: "Faster, safer deploys and clearer ownership per bounded context.",
          harder: "More network hops and the need for disciplined contract testing between services.",
        },
        {
          better: "Predictable latency on previously spiky endpoints.",
          harder: "Cache invalidation rules had to be explicit and observable.",
        },
      ],
      architectureSummary:
        "Inbound contract events through Azure Service Bus, core Spring Boot services with Redis-backed read models where appropriate, Cosmos DB as system of record, pipelines through Azure DevOps.",
      architectureFlow: [
        { label: "CPQ Portal", detail: "Contract request entry point" },
        { label: "Contract Case", detail: "Business-critical contract orchestration" },
        { label: "Azure Service Bus", detail: "Async cross-service integration" },
        { label: "Redis", detail: "High-value cached reads" },
        { label: "Cosmos DB", detail: "Contract and quote state" },
        { label: "Quote / Order Services", detail: "Downstream quote-to-cash flow" },
      ],
      impact: [
        "Contract processing from ~7 minutes to under 1 minute",
        "~55% API latency reduction on optimized paths",
        "Broader maintainability across 10+ microservices",
      ],
      improveNow: [
        "Distributed tracing across all contract boundaries",
        "Formal consumer-driven contract tests between services",
        "Dashboards for queue lag, cache hit rate, and p95 latency",
      ],
      related: [
        { kind: "system", slug: "phia-healthcare" },
        { kind: "system", slug: "nissan-telemetry" },
      ],
    },
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
    stack: [
      "Java",
      "Spring Boot",
      "Angular",
      "Camunda BPMN",
      "Keycloak",
      "SQL Server",
      "Jenkins",
    ],
    tags: ["Healthcare", "Workflow Automation", "Security", "Full-Stack", "Enterprise Systems"],
    visible: true,
    featured: false,
    order: 2,
    detail: {
      context:
        "PHIA processes high volumes of appeals where timing and auditability matter. The stack mixed long-running BPMN with interactive Angular screens.",
      pressure:
        "Workflow complexity grew faster than operator throughput. Reports were slow. Deployments had to be dependable because SLAs were non-negotiable.",
      constraints: [
        "Compliance-sensitive healthcare data",
        "Existing Camunda investment",
        "Small team; limited parallel workstreams",
      ],
      decision:
        "Modularized BPMN, tightened RBAC with Keycloak, and owned CI so releases were boring and reversible.",
      tradeoffs: [
        {
          better: "Higher deployment success rate and faster iteration on workflow fixes.",
          harder: "More moving parts to monitor in Jenkins and Camunda ops.",
        },
      ],
      architectureSummary:
        "Angular clients against Spring Boot APIs, Camunda orchestration, SQL Server persistence, Keycloak at the edge for authZ.",
      architectureFlow: [
        { label: "Email Trigger", detail: "Appeals intake and workflow start" },
        { label: "Camunda BPMN", detail: "Workflow orchestration and subprocesses" },
        { label: "Spring Boot API", detail: "Business logic and task operations" },
        { label: "Angular Dashboard", detail: "Manual ticketing and queue visibility" },
        { label: "SQL Server Reports", detail: "Client-facing task-listing visibility" },
        { label: "Keycloak", detail: "SSO and role-based access control" },
      ],
      impact: [
        "10% workflow execution improvement",
        "15% faster report generation",
        "95% deployment success",
      ],
      improveNow: [
        "Automated regression packs for BPMN path coverage",
        "Unified observability from UI through workflow engine",
      ],
      related: [{ kind: "system", slug: "nokia-cpq" }],
    },
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
    tags: ["Automotive", "Streaming", "AWS", "Backend", "Enterprise Systems"],
    visible: true,
    featured: false,
    order: 3,
    detail: {
      context:
        "Fleet data landed in many shapes. Downstream analytics needed a canonical model without losing fidelity at the edge.",
      pressure:
        "Volume and variety created transformation bottlenecks and operational fire drills when new OEM formats appeared.",
      constraints: [
        "AWS-native streaming targets",
        "Need for rules-driven normalization without redeploying for every tweak",
      ],
      decision:
        "Isolated format adapters in Spring services, used Drools where rules velocity mattered, and piped through Kinesis to durable stores.",
      tradeoffs: [
        {
          better: "Clear separation between transport, rules, and persistence.",
          harder: "Rules maintenance requires disciplined review to avoid silent drift.",
        },
      ],
      architectureSummary:
        "Ingestion through Kinesis, transformation microservices, Drools for complex normalization, S3/DynamoDB/Lambda supporting batch and stream paths.",
      architectureFlow: [
        { label: "Vehicle Fleets", detail: "Binary, XML, and non-standard JSON inputs" },
        { label: "S3 / Kinesis", detail: "Raw ingestion and real-time stream processing" },
        { label: "Spring Boot Transformers", detail: "Format-specific normalization logic" },
        { label: "Drools Rules", detail: "Centralized transformation rules" },
        { label: "Canonical JSON", detail: "Unified telemetry schema" },
        { label: "DynamoDB / Dashboard", detail: "Persistent telemetry and fleet visibility" },
      ],
      impact: ["100+ GB processed", "~30% faster transformation", "Supported hybrid real-time and batch"],
      improveNow: [
        "Schema registry for canonical models",
        "Replay tooling for poison-message recovery",
      ],
      related: [{ kind: "system", slug: "nokia-cpq" }],
    },
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
    tags: ["Healthcare", "Full-Stack", "GCP", "Mobile", "Enterprise Systems"],
    visible: true,
    featured: false,
    order: 4,
    detail: {
      context:
        "DaxP connects patients, clinicians, pharmacies, and admins. As the only engineer, every layer had to stay shippable.",
      pressure:
        "Feature breadth vs. time; infra couldn’t be an afterthought or releases would stall.",
      constraints: [
        "GCP budget and small VM footprint",
        "Role isolation with JWT claims",
        "Mobile + API parity",
      ],
      decision:
        "Flutter for cross-platform UI, Node APIs with explicit RBAC, GitLab Runners for repeatable deploys to Compute Engine.",
      tradeoffs: [
        {
          better: "End-to-end ownership meant fast decisions and coherent design.",
          harder: "Limited redundancy for deep specialist reviews inside the org.",
        },
      ],
      architectureSummary:
        "Flutter clients, Node REST tier, Cloud SQL, VPC-scoped services, GitLab CI/CD to scripted deploys.",
      architectureFlow: [
        { label: "Flutter Clients", detail: "Patient, doctor, pharmacy, admin surfaces" },
        { label: "Node REST API", detail: "JWT-scoped business operations" },
        { label: "Cloud SQL", detail: "Transactional persistence" },
        { label: "GCP Networking", detail: "VPC-isolated services" },
        { label: "GitLab CI/CD", detail: "Runner-driven deploys to Compute Engine" },
        { label: "Monitoring Hooks", detail: "Operational visibility for solo ownership" },
      ],
      impact: ["Four roles supported", "Repeatable zero-touch deploys", "Coherent security model"],
      improveNow: [
        "Load testing earlier in the release cycle",
        "Feature flags for safer mobile rollouts",
      ],
      related: [{ kind: "project", slug: "job-hunter" }],
    },
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
    tags: ["Automation", "OCR", "Python", "Enterprise Systems"],
    visible: true,
    featured: false,
    order: 5,
    detail: {
      context:
        "High-volume scans required consistent preprocessing before OCR could be trusted downstream.",
      pressure:
        "Operators were the bottleneck when image quality varied or layouts drifted.",
      constraints: [
        "Batch processing windows",
        "Accuracy requirements for downstream compliance",
      ],
      decision:
        "OpenCV pipelines for normalization, Tesseract with tuned parameters, regex and rules for field validation.",
      tradeoffs: [
        {
          better: "Less manual cleanup and more predictable batches.",
          harder: "Brittle layouts still needed human exception paths.",
        },
      ],
      architectureSummary:
        "Python batch workers, image preprocessing stages, OCR, validation rules before handoff.",
      architectureFlow: [
        { label: "Scan Batch", detail: "IRS form images ingested in windows" },
        { label: "OpenCV Preprocess", detail: "Deskew, denoise, binarize" },
        { label: "Tesseract OCR", detail: "Field and line extraction" },
        { label: "Validation Rules", detail: "Regex and form-recognition checks" },
        { label: "Exception Queue", detail: "Operator review for low confidence" },
        { label: "Downstream Systems", detail: "Structured data handoff" },
      ],
      impact: ["~30% less manual cleanup", "Accuracy above 95% in scope"],
      improveNow: [
        "ML-based layout detection for heterogeneous scans",
        "Confidence scoring surfaced earlier to operators",
      ],
      related: [],
    },
  },
];

export function getVisibleSystems() {
  return systems.filter((s) => s.visible).sort((a, b) => a.order - b.order);
}

export function getSystemBySlug(slug: string) {
  return systems.find((s) => s.slug === slug && s.visible);
}
