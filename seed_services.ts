import { prisma } from './src/core/db/prisma'

const services = [
  {
    title: "Full Stack SaaS Platforms",
    description: "End-to-end development of scalable SaaS applications, from database architecture to premium frontend experiences.",
    who: "Founders needing a robust MVP or scaling companies modernizing their stack.",
    deliverables: ["Database Schema", "API Layer", "Web Application", "Authentication", "Payment Integration"],
    tech: ["Next.js", "React", "PostgreSQL", "Prisma", "Tailwind CSS"],
    products: ["PaperTrade"],
    color: "#ffffff"
  },
  {
    title: "Mobile Applications",
    description: "High-performance, cross-platform mobile applications that feel native on iOS and Android.",
    who: "Companies extending their web product to mobile or mobile-first startups.",
    deliverables: ["iOS App", "Android App", "Offline Sync", "Push Notifications"],
    tech: ["Flutter", "Dart", "SQLite", "Firebase"],
    products: ["MotionX"],
    color: "#ffffff"
  },
  {
    title: "Backend Systems",
    description: "High-throughput, distributed backend architectures designed for speed and reliability.",
    who: "Companies with data-heavy applications, high concurrency requirements, or complex business logic.",
    deliverables: ["REST/GraphQL APIs", "Microservices", "Database Optimization", "Message Queues"],
    tech: ["FastAPI", "Python", "Node.js", "PostgreSQL", "Redis"],
    products: ["PaperTrade", "APISense"],
    color: "#ffffff"
  },
  {
    title: "AI Features & LLM Integration",
    description: "Integrating intelligent capabilities into existing products securely and reliably.",
    who: "Startups adding AI features or enterprises automating internal workflows.",
    deliverables: ["RAG Pipelines", "Agentic Workflows", "Vector Databases", "Prompt Engineering"],
    tech: ["OpenAI", "LangChain", "Pinecone", "Python"],
    products: ["MotionX"],
    color: "#ffffff"
  },
  {
    title: "Admin Dashboards & Internal Tools",
    description: "Custom internal tooling to manage operations, visualize data, and streamline company processes.",
    who: "Operations teams outgrowing spreadsheets or needing custom workflows.",
    deliverables: ["Admin Dashboard", "Data Visualization", "Role-based Access Control", "CRUD Interfaces"],
    tech: ["Next.js", "React", "Recharts", "Tailwind CSS"],
    products: ["Workspace Studio"],
    color: "#ffffff"
  },
  {
    title: "API Design & Integrations",
    description: "Designing clean, intuitive APIs and integrating complex third-party systems seamlessly.",
    who: "B2B SaaS companies or platforms needing robust public APIs.",
    deliverables: ["API Documentation", "SDKs", "Webhooks", "Third-party Integrations"],
    tech: ["OpenAPI", "FastAPI", "TypeScript"],
    products: ["APISense"],
    color: "#ffffff"
  },
  {
    title: "Performance & Architecture Consulting",
    description: "Deep dive reviews of existing codebases to identify bottlenecks, security flaws, and architectural debt.",
    who: "Teams facing scaling issues, slow load times, or frequent outages.",
    deliverables: ["Architecture Audit", "Performance Report", "Optimization Roadmap", "Pair Programming"],
    tech: ["System Design", "AWS", "Vercel", "Datadog"],
    products: ["PaperTrade"],
    color: "#ffffff"
  }
]

async function main() {
  await prisma.service.deleteMany({}) // Clear existing
  for (let i = 0; i < services.length; i++) {
    await prisma.service.create({
      data: {
        ...services[i],
        order: i
      }
    })
  }
  console.log("Seeded services!")
}

main()
