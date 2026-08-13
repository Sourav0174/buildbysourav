"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { H1, H3, P } from "@/components/ui/typography"
import { Spotlight } from "@/components/ui/spotlight"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ArrowUpRight } from "lucide-react"

export type LabData = {
  id: string
  title: string
  description: string
  url: string
  category: string
}

export function LabsClient({ labs }: { labs: LabData[] }) {
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
            <H1 className="text-5xl md:text-6xl tracking-tight mb-6">Labs</H1>
            <P className="text-xl md:text-2xl text-white/70">
              A collection of experiments, open-source tools, and small side projects built in the pursuit of exploring new technologies.
            </P>
          </motion.div>
        </Container>
      </Section>

      <Section className="relative z-10">
        <Container>
          {labs.length === 0 ? (
             <div className="py-24 text-center">
               <P className="text-white/40 text-lg">New experiments are currently being brewed in the lab. Check back soon.</P>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {labs.map((lab, index) => (
                <motion.div
                  key={lab.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-full"
                >
                  <a href={lab.url} target="_blank" rel="noopener noreferrer" className="block h-full group">
                    <Card className="p-8 h-full border-white/10 bg-white/[0.02] flex flex-col hover:bg-white/[0.04] transition-colors relative overflow-hidden">
                      <div className="flex justify-between items-start mb-6">
                        <Badge variant="outline" className="bg-white/5 border-white/10 text-white/70">
                          {lab.category}
                        </Badge>
                        <div className="text-white/40 group-hover:text-white transition-colors duration-300">
                          <ArrowUpRight className="w-5 h-5" />
                        </div>
                      </div>
                      
                      <H3 className="text-2xl font-bold mb-3 group-hover:text-white/90 transition-colors">
                        {lab.title}
                      </H3>
                      
                      <P className="text-white/60 leading-relaxed group-hover:text-white/70 transition-colors">
                        {lab.description}
                      </P>
                    </Card>
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </main>
  )
}
