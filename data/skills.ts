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

export function getVisibleSkills() {
  return skills.filter((s) => s.visible).sort((a, b) => a.order - b.order);
}
