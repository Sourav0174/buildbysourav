"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { H1, H3, P } from "@/components/ui/typography"
import { Spotlight } from "@/components/ui/spotlight"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

export function ServicesClient({ services }: { services: any[] }) {
  return (
    <main className="min-h-screen relative pt-16 pb-24 overflow-hidden">
      <Spotlight />
      {/* Background Ambient Glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] pointer-events-none opacity-50"
        style={{ background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.15) 0%, transparent 70%)' }}
      />
      
      <Section className="relative z-10">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mb-20"
          >
            <H1 className="text-5xl md:text-6xl tracking-tight mb-6">Services</H1>
            <P className="text-lg text-white/70">
              I partner with founders and technical teams to architect systems, build scalable products, and solve complex engineering challenges.
            </P>
          </motion.div>
          <div className="flex flex-col gap-12">
            {services.map((service, index) => {
              const products = Array.isArray(service.products) ? service.products : []
              const deliverables = Array.isArray(service.deliverables) ? service.deliverables : []
              const tech = Array.isArray(service.tech) ? service.tech : []
              
              return (
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
                  </div>

                  <div className="flex-1 space-y-8 bg-[#050505] p-6 rounded-xl border border-white/5">
                    <div>
                      <h4 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-3">Typical Deliverables</h4>
                      <ul className="space-y-3">
                        {deliverables.map((item: any) => (
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
                        {tech.map((t: any) => (
                          <Badge key={t} variant="secondary" className="bg-white/10 text-white/70">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
              )
            })}
          </div>
        </Container>
      </Section>
    </main>
  )
}
