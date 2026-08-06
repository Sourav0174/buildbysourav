"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { H1, H2, H3, P } from "@/components/ui/typography"
import { Spotlight } from "@/components/ui/spotlight"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

const services = [
  {
    title: "Full Stack SaaS Platforms",
    description: "End-to-end development of scalable SaaS applications, from database architecture to premium frontend experiences.",
    who: "Founders needing a robust MVP or scaling companies modernizing their stack.",
    deliverables: ["Database Schema", "API Layer", "Web Application", "Authentication", "Payment Integration"],
    tech: ["Next.js", "React", "PostgreSQL", "Prisma", "Tailwind CSS"],
    products: ["PaperTrade"]
  },
  {
    title: "Mobile Applications",
    description: "High-performance, cross-platform mobile applications that feel native on iOS and Android.",
    who: "Companies extending their web product to mobile or mobile-first startups.",
    deliverables: ["iOS App", "Android App", "Offline Sync", "Push Notifications"],
    tech: ["Flutter", "Dart", "SQLite", "Firebase"],
    products: ["MotionX"]
  },
  {
    title: "Backend Systems",
    description: "High-throughput, distributed backend architectures designed for speed and reliability.",
    who: "Companies with data-heavy applications, high concurrency requirements, or complex business logic.",
    deliverables: ["REST/GraphQL APIs", "Microservices", "Database Optimization", "Message Queues"],
    tech: ["FastAPI", "Python", "Node.js", "PostgreSQL", "Redis"],
    products: ["PaperTrade", "APISense"]
  },
  {
    title: "AI Features & LLM Integration",
    description: "Integrating intelligent capabilities into existing products securely and reliably.",
    who: "Startups adding AI features or enterprises automating internal workflows.",
    deliverables: ["RAG Pipelines", "Agentic Workflows", "Vector Databases", "Prompt Engineering"],
    tech: ["OpenAI", "LangChain", "Pinecone", "Python"],
    products: ["MotionX"]
  },
  {
    title: "Admin Dashboards & Internal Tools",
    description: "Custom internal tooling to manage operations, visualize data, and streamline company processes.",
    who: "Operations teams outgrowing spreadsheets or needing custom workflows.",
    deliverables: ["Admin Dashboard", "Data Visualization", "Role-based Access Control", "CRUD Interfaces"],
    tech: ["Next.js", "React", "Recharts", "Tailwind CSS"],
    products: ["Workspace Studio"]
  },
  {
    title: "API Design & Integrations",
    description: "Designing clean, intuitive APIs and integrating complex third-party systems seamlessly.",
    who: "B2B SaaS companies or platforms needing robust public APIs.",
    deliverables: ["API Documentation", "SDKs", "Webhooks", "Third-party Integrations"],
    tech: ["OpenAPI", "FastAPI", "TypeScript"],
    products: ["APISense"]
  },
  {
    title: "Performance & Architecture Consulting",
    description: "Deep dive reviews of existing codebases to identify bottlenecks, security flaws, and architectural debt.",
    who: "Teams facing scaling issues, slow load times, or frequent outages.",
    deliverables: ["Architecture Audit", "Performance Report", "Optimization Roadmap", "Pair Programming"],
    tech: ["System Design", "AWS", "Vercel", "Datadog"],
    products: ["PaperTrade"]
  }
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen relative pt-32 pb-24 overflow-hidden">
      <Spotlight />
      
      <Section className="relative z-10 mb-16">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <H1 className="text-5xl md:text-6xl tracking-tight mb-6">Services</H1>
            <P className="text-xl md:text-2xl text-white/70">
              I partner with founders and technical teams to architect systems, build scalable products, and solve complex engineering challenges.
            </P>
          </motion.div>
        </Container>
      </Section>

      <Section className="relative z-10">
        <Container>
          <div className="flex flex-col gap-12">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-8 md:p-12 border-white/10 bg-white/[0.02] flex flex-col lg:flex-row gap-12 hover:bg-white/[0.04] transition-colors">
                  <div className="flex-1 space-y-6">
                    <H3 className="text-3xl font-bold">{service.title}</H3>
                    <P className="text-lg text-white/70 leading-relaxed">{service.description}</P>
                    
                    <div className="pt-4 border-t border-white/10">
                      <h4 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-2">Who It&apos;s For</h4>
                      <P className="text-white/80">{service.who}</P>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-2">Related Experience</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {service.products.map(product => (
                          <span key={product} className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer underline underline-offset-4 decoration-white/20">
                            {product}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-8 bg-[#050505] p-6 rounded-xl border border-white/5">
                    <div>
                      <h4 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-3">Typical Deliverables</h4>
                      <ul className="space-y-3">
                        {service.deliverables.map(item => (
                          <li key={item} className="flex items-center gap-3 text-white/80">
                            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-3">Core Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.tech.map(tech => (
                          <Badge key={tech} variant="secondary" className="bg-white/10 text-white/70">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  )
}
