import * as React from "react"
import { prisma } from "@/core/db/prisma"
import { H1, P } from "@/components/ui/typography"
import { SettingsEditor } from "@/components/studio/settings-editor"
import { MilestoneManager } from "@/components/studio/milestone-manager"
import { FaqManager } from "@/components/studio/faq-manager"
import { ServiceManager } from "@/components/studio/service-manager"

const defaultServices = [
  { title: "Full Stack SaaS Platforms", description: "End-to-end development of scalable SaaS applications, from database architecture to premium frontend experiences.", who: "Founders needing a robust MVP or scaling companies modernizing their stack.", deliverables: ["Database Schema", "API Layer", "Web Application", "Authentication", "Payment Integration"], tech: ["Next.js", "React", "PostgreSQL", "Prisma", "Tailwind CSS"], products: ["PaperTrade"], color: "#ffffff", order: 0 },
  { title: "Mobile Applications", description: "High-performance, cross-platform mobile applications that feel native on iOS and Android.", who: "Companies extending their web product to mobile or mobile-first startups.", deliverables: ["iOS App", "Android App", "Offline Sync", "Push Notifications"], tech: ["Flutter", "Dart", "SQLite", "Firebase"], products: ["MotionX"], color: "#ffffff", order: 1 },
  { title: "Backend Systems", description: "High-throughput, distributed backend architectures designed for speed and reliability.", who: "Companies with data-heavy applications, high concurrency requirements, or complex business logic.", deliverables: ["REST/GraphQL APIs", "Microservices", "Database Optimization", "Message Queues"], tech: ["FastAPI", "Python", "Node.js", "PostgreSQL", "Redis"], products: ["PaperTrade", "APISense"], color: "#ffffff", order: 2 },
  { title: "AI Features & LLM Integration", description: "Integrating intelligent capabilities into existing products securely and reliably.", who: "Startups adding AI features or enterprises automating internal workflows.", deliverables: ["RAG Pipelines", "Agentic Workflows", "Vector Databases", "Prompt Engineering"], tech: ["OpenAI", "LangChain", "Pinecone", "Python"], products: ["MotionX"], color: "#ffffff", order: 3 },
  { title: "Admin Dashboards & Internal Tools", description: "Custom internal tooling to manage operations, visualize data, and streamline company processes.", who: "Operations teams outgrowing spreadsheets or needing custom workflows.", deliverables: ["Admin Dashboard", "Data Visualization", "Role-based Access Control", "CRUD Interfaces"], tech: ["Next.js", "React", "Recharts", "Tailwind CSS"], products: ["Workspace Studio"], color: "#ffffff", order: 4 },
  { title: "API Design & Integrations", description: "Designing clean, intuitive APIs and integrating complex third-party systems seamlessly.", who: "B2B SaaS companies or platforms needing robust public APIs.", deliverables: ["API Documentation", "SDKs", "Webhooks", "Third-party Integrations"], tech: ["OpenAPI", "FastAPI", "TypeScript"], products: ["APISense"], color: "#ffffff", order: 5 },
  { title: "Performance & Architecture Consulting", description: "Deep dive reviews of existing codebases to identify bottlenecks, security flaws, and architectural debt.", who: "Teams facing scaling issues, slow load times, or frequent outages.", deliverables: ["Architecture Audit", "Performance Report", "Optimization Roadmap", "Pair Programming"], tech: ["System Design", "AWS", "Vercel", "Datadog"], products: ["PaperTrade"], color: "#ffffff", order: 6 }
]

export default async function StudioSettingsPage() {
  const settings = await prisma.settings.findFirst()
  const milestones = await prisma.milestone.findMany({
    orderBy: { order: 'asc' }
  })
  const faqs = await prisma.faq.findMany({
    orderBy: { order: 'asc' }
  })
  
  let services = await prisma.service.findMany({
    orderBy: { order: 'asc' }
  })

  // Auto-seed if empty
  if (services.length === 0) {
    for (const s of defaultServices) {
      await prisma.service.create({ data: s })
    }
    services = await prisma.service.findMany({ orderBy: { order: 'asc' } })
  }

  const defaultSettings = {
    siteName: "The Workspace",
    siteDesc: "A premium software engineering portfolio.",
    resumeUrl: "",
    githubUrl: "",
    twitterUrl: "",
    linkedinUrl: "",
    email: "",
    phone: "",
    techStack: JSON.stringify([
      { category: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"] },
      { category: "Backend", items: ["Python", "FastAPI", "Node.js", "REST APIs"] },
      { category: "Mobile", items: ["Flutter", "Dart"] },
      { category: "Data", items: ["PostgreSQL", "SQLAlchemy", "Redis"] },
      { category: "Infrastructure", items: ["AWS", "Docker", "Vercel", "GitHub Actions"] },
    ], null, 2),
  }

  const initialData = settings ? {
    siteName: settings.siteName,
    siteDesc: settings.siteDesc,
    resumeUrl: settings.resumeUrl || "",
    githubUrl: settings.githubUrl || "",
    twitterUrl: settings.twitterUrl || "",
    linkedinUrl: settings.linkedinUrl || "",
    email: settings.email || "",
    phone: settings.phone || "",
    techStack: Array.isArray(settings.techStack) && settings.techStack.length > 0 
      ? JSON.stringify(settings.techStack, null, 2) 
      : defaultSettings.techStack,
  } : defaultSettings

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <H1 className="text-4xl tracking-tight mb-2">Settings</H1>
        <P className="text-white/60">Manage public configuration and links for your workspace.</P>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 md:p-6">
        <h3 className="text-blue-400 font-medium mb-1">Security Notice</h3>
        <p className="text-sm text-white/60 leading-relaxed">
          Authentication credentials (Username, Password, and Session Secret) are strictly managed via environment variables for maximum security. They are not stored in the database and cannot be edited here.
        </p>
      </div>

      <SettingsEditor initialData={initialData} />
      <MilestoneManager initialMilestones={milestones} />
      <div className="pt-8 border-t border-white/10">
        <FaqManager initialFaqs={faqs} />
      </div>

      <div className="pt-8 border-t border-white/10">
        <ServiceManager initialServices={services} />
      </div>
    </div>
  )
}
