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
