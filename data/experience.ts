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

export function getVisibleExperience() {
  return experience.filter((e) => e.visible).sort((a, b) => a.order - b.order);
}
