"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { H1, H2, H3, P } from "@/components/ui/typography"
import { Spotlight } from "@/components/ui/spotlight"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Code2, Briefcase, Mail, FileText, ArrowUpRight } from "lucide-react"

const timeline = [
  {
    year: "2026",
    title: "Launched Software Studio",
    description: "Transitioned to independent product engineering and consulting, partnering with early-stage startups and enterprises."
  },
  {
    year: "2024",
    title: "Staff Engineer at FinTech Corp",
    description: "Led the architecture of a distributed trading engine processing $2B+ in daily volume."
  },
  {
    year: "2021",
    title: "Senior Full Stack Engineer",
    description: "Built and scaled multiple B2B SaaS platforms from 0 to 1, focusing on performance and enterprise security."
  },
  {
    year: "2018",
    title: "Software Engineer",
    description: "Started career building full-stack web applications and API integrations."
  }
]

const stack = [
  { category: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"] },
  { category: "Backend", items: ["Node.js", "Python", "FastAPI", "Go", "GraphQL"] },
  { category: "Database", items: ["PostgreSQL", "Redis", "Prisma", "ClickHouse", "MongoDB"] },
  { category: "Mobile", items: ["Flutter", "Dart", "React Native"] },
  { category: "Infrastructure", items: ["AWS", "Vercel", "Docker", "Terraform", "GitHub Actions"] },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen relative pt-32 pb-24 overflow-hidden">
      <Spotlight />
      
      <Section className="relative z-10 mb-16">
        <Container>
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Left Column: Intro & Philosophy */}
            <div className="lg:col-span-7 space-y-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <H1 className="text-5xl md:text-6xl tracking-tight mb-8">About</H1>
                <P className="text-xl text-white/80 leading-relaxed mb-6">
                  I am a Product Engineer and Systems Architect. I build software that feels inevitable—fast, secure, and meticulously crafted.
                </P>
                <P className="text-lg text-white/60 leading-relaxed">
                  Over the past decade, I&apos;ve engineered everything from high-frequency trading platforms to beautiful consumer mobile apps. Today, I run an independent software studio partnering with founders to bring ambitious ideas to production.
                </P>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <H2 className="text-3xl font-bold mb-6">Engineering Philosophy</H2>
                <Card className="p-8 border-white/10 bg-white/[0.02] space-y-6">
                  <P className="text-white/80 leading-relaxed">
                    Software is often cluttered by noise, unnecessary abstractions, and fragile dependencies. I believe in a different approach: <span className="text-white font-medium">The Quiet Laboratory.</span>
                  </P>
                  <ul className="space-y-4 text-white/70">
                    <li className="flex items-start gap-3">
                      <span className="text-white mt-1.5">•</span>
                      <span><strong>Rigid Fundamentals:</strong> Fancy tools cannot fix bad architecture. Databases must be modeled correctly from day one.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-white mt-1.5">•</span>
                      <span><strong>Respect for the User:</strong> Performance is a feature. Interactions should be 60fps. Loading states must be intentional.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-white mt-1.5">•</span>
                      <span><strong>No Noise:</strong> I write code that is easy to delete, easy to read, and difficult to break.</span>
                    </li>
                  </ul>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <H2 className="text-3xl font-bold mb-6">Technology Stack</H2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {stack.map((group) => (
                    <div key={group.category} className="space-y-3">
                      <h4 className="text-sm font-semibold text-white/40 uppercase tracking-wider">{group.category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map(tech => (
                          <Badge key={tech} variant="secondary" className="bg-white/5 text-white/70">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column: Links & Timeline */}
            <div className="lg:col-span-5 space-y-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col gap-4"
              >
                <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors group">
                  <div className="flex items-center gap-3">
                    <Code2 className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                    <span className="font-medium">GitHub</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors group">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                    <span className="font-medium">LinkedIn</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                </a>
                <a href="/resume.pdf" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors group">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                    <span className="font-medium">Resume</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                </a>
                <Link href="/build" className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors group">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                    <span className="font-medium">Contact</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <H3 className="text-xl font-bold mb-8">Milestones</H3>
                <div className="space-y-8 border-l border-white/10 ml-2 pl-6 relative">
                  {timeline.map((item, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-white/20 border-2 border-black" />
                      <div className="text-sm font-bold text-white/40 mb-1">{item.year}</div>
                      <div className="font-semibold text-white/90 mb-2">{item.title}</div>
                      <p className="text-sm text-white/60 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  )
}
