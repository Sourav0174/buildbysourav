"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useMotionValue, useMotionTemplate } from "framer-motion"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { H1, H2, H3, P } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BrowserMockup } from "@/components/ui/mockup"
import { cn } from "@/core/utils/cn"

const products = [
  {
    title: "PaperTrade",
    tagline: "High-frequency algorithmic execution engine for equities.",
    color: "#16a34a",
    tech: ["FastAPI", "React", "PostgreSQL", "WebSockets"],
    status: "Live",
    description: "Architected a low-latency trading simulation engine capable of processing thousands of ticks per second. Integrates directly with Polygon.io and Alpaca APIs for real-time market data."
  },
  {
    title: "APISense",
    tagline: "Real-time telemetry and anomaly detection.",
    color: "#6366f1",
    tech: ["Next.js", "ClickHouse", "Redis", "Kafka"],
    status: "Building",
    description: "A distributed monitoring system that ingests high-throughput API logs, runs statistical anomaly detection models, and provides sub-second aggregations via ClickHouse."
  },
  {
    title: "MotionX",
    tagline: "AI-driven animation orchestrator.",
    color: "#f59e0b",
    tech: ["Flutter", "Python", "LLMs", "R3F"],
    status: "Open Source",
    description: "An experimental agentic framework that generates fluid, physics-based UI animations from natural language prompts, leveraging LLM reasoning and Framer Motion."
  }
]

export default function Home() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <main 
      className="min-h-screen relative overflow-x-hidden bg-[#050505]"
      onMouseMove={handleMouseMove}
    >
      
      {/* Cinematic Portrait Background (Desktop Only) */}
      <div className="hidden lg:block absolute top-0 left-0 w-full h-[100vh] z-0 pointer-events-none overflow-hidden">
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="absolute top-[5vh] right-[2vw] w-full h-[85vh] md:h-[90vh] lg:h-[95vh] lg:w-[60vw] 2xl:w-[55vw]"
        >
          {/* Extremely soft radial spotlight behind the head for subtle depth */}
          <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[70%] aspect-square bg-[#ffffff] rounded-full blur-[120px] opacity-[0.05]" />

          {/* Base Layer: Sharp, monochrome structural portrait */}
          <div 
            className="absolute inset-0"
            style={{
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to top, transparent 0%, black 30%, black 100%)',
              maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to top, transparent 0%, black 30%, black 100%)',
              WebkitMaskComposite: 'source-in',
              maskComposite: 'intersect'
            }}
          >
            <Image
              src="/profile2.png"
              alt=""
              fill
              priority
              className="object-contain object-[center_85%] opacity-30 md:opacity-40 lg:opacity-40 grayscale contrast-[1.1] brightness-[1]"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>
        </motion.div>

        {/* Interactive Layer: Illuminated dark red spotlight portrait */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-[100vh]"
          style={{
            WebkitMaskImage: useMotionTemplate`radial-gradient(250px circle at ${mouseX}px ${mouseY}px, black 0%, transparent 100%)`,
            maskImage: useMotionTemplate`radial-gradient(250px circle at ${mouseX}px ${mouseY}px, black 0%, transparent 100%)`
          }}
        >
          <div className="absolute top-[5vh] right-[2vw] w-full h-[85vh] md:h-[90vh] lg:h-[95vh] lg:w-[60vw] 2xl:w-[55vw]">
            <div 
              className="absolute inset-0"
              style={{
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to top, transparent 0%, black 30%, black 100%)',
                maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to top, transparent 0%, black 30%, black 100%)',
                WebkitMaskComposite: 'source-in',
                maskComposite: 'intersect'
              }}
            >
              <Image
                src="/profile2.png"
                alt=""
                fill
                priority
                className="object-contain object-[center_85%] opacity-75 lg:opacity-85 grayscale contrast-[1.2] brightness-[0.9]"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              
              {/* Dark Red Color Gel: Tints the illuminated portrait area */}
              <div className="absolute inset-0 mix-blend-color pointer-events-none bg-[rgba(153,27,27,0.9)]" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hero & Credibility */}
      <div className="min-h-0 lg:min-h-screen flex flex-col justify-center relative z-10 pt-24 lg:pt-32 pb-10 lg:pb-24">
        <Container className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-3xl lg:w-[65%] relative z-20 mt-0 lg:mt-0 flex flex-col items-center lg:items-start text-center lg:text-left mx-auto lg:mx-0"
          >
            {/* Mobile Portrait (Hidden on Desktop) */}
            <div className="block lg:hidden w-[300px] sm:w-[330px] mx-auto mb-4 relative aspect-[3/4]">
              <div
                className="absolute inset-0"
                style={{
                  WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 75%)',
                  maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 75%)'
                }}
              >
                <Image
                  src="/profile2.png"
                  alt="Portrait"
                  fill
                  priority
                  className="object-contain object-bottom opacity-80 grayscale contrast-[1.1] brightness-[1]"
                  sizes="330px"
                />
              </div>
              {/* Subtle black gradient to fade bottom seamlessly into background */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#050505] to-transparent opacity-90 pointer-events-none" />
            </div>

            <H1 className="text-3xl md:text-4xl lg:text-[4.5rem] tracking-tight text-white/90 mb-5 lg:mb-8 leading-[1.05] lg:leading-[1.1] font-medium">
              I architect systems <br className="hidden md:block lg:hidden"/> and build products.
            </H1>
            <P className="text-lg md:text-2xl text-white/70 lg:text-white/60 max-w-[320px] md:max-w-md lg:max-w-2xl mb-7 lg:mb-12 font-light leading-[1.6] lg:leading-normal mx-auto lg:mx-0">
              Staff Product Engineer specializing in full-stack development, distributed systems, and premium user experiences. No noise. Just pure engineering.
            </P>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 lg:gap-x-6 lg:gap-y-3 text-sm font-medium text-white/50 w-full">
              <span className="flex items-center gap-2 text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-white/70" /> 10+ Products Built
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-white/30 lg:hidden" /> Next.js / Python / Flutter
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-white/30 lg:hidden" /> AI Integration
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-white/30 lg:hidden" /> Database Architecture
              </span>
            </div>
          </motion.div>
        </Container>
      </div>

      {/* Featured Products Showcase */}
      <Section className="relative z-20 py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505] to-[#050505] pointer-events-none -z-10" />
        
        <Container>
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 relative z-10">
            <div>
              <H2 className="text-4xl mb-4 text-white/90">Featured Products</H2>
              <P className="text-lg text-white/50 max-w-xl">Deep dives into systems I&apos;ve engineered from database schema to user interface.</P>
            </div>
            <Button variant="outline" asChild className="mt-6 md:mt-0 border-white/10 text-white/70 hover:text-white hover:bg-white/5">
              <Link href="/products">View All Products &rarr;</Link>
            </Button>
          </div>
          
          <div className="flex flex-col gap-24 relative z-10">
            {products.map((product, i) => (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "flex flex-col gap-12 lg:gap-20 items-center",
                  i % 2 !== 0 ? "lg:flex-row-reverse" : "lg:flex-row"
                )}
              >
                {/* Product Meta */}
                <div className="flex-1 w-full space-y-8 relative">
                  <div 
                    className="absolute -inset-20 blur-3xl opacity-[0.15] -z-10 rounded-full pointer-events-none"
                    style={{ backgroundColor: product.color }}
                  />
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-black/50 backdrop-blur-md border-white/10 text-white/70">
                      {product.status}
                    </Badge>
                  </div>
                  <div>
                    <H3 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white/90">{product.title}</H3>
                    <P className="text-xl text-white/70 font-medium mb-4">{product.tagline}</P>
                    <P className="text-white/50 text-lg leading-relaxed">{product.description}</P>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {product.tech.map(t => (
                      <Badge key={t} variant="secondary" className="bg-white/5 text-white/60 border-transparent">
                        {t}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="default" asChild className="mt-4 bg-white/10 text-white hover:bg-white/20">
                    <Link href={`/products/${product.title.toLowerCase()}`}>Explore Architecture</Link>
                  </Button>
                </div>

                {/* Product Mockup */}
                <div className="flex-[1.5] w-full">
                  <BrowserMockup className="aspect-video w-full group relative overflow-hidden bg-black/40 border-white/10">
                    <div className="absolute inset-0 flex flex-col p-4 gap-4 opacity-30 group-hover:opacity-50 transition-opacity duration-500">
                      <div className="h-8 w-full flex items-center justify-between border-b border-white/10 pb-4">
                        <div className="h-3 w-24 bg-white/20 rounded-full" />
                        <div className="flex gap-2">
                          <div className="h-6 w-6 rounded-full bg-white/10" />
                          <div className="h-6 w-6 rounded-full bg-white/10" />
                        </div>
                      </div>
                      <div className="flex flex-1 gap-4">
                        <div className="w-1/4 h-full rounded-lg bg-white/5 border border-white/10 p-3 space-y-3 hidden sm:block">
                          <div className="h-2 w-full bg-white/10 rounded-full" />
                          <div className="h-2 w-3/4 bg-white/10 rounded-full" />
                          <div className="h-2 w-5/6 bg-white/10 rounded-full" />
                        </div>
                        <div className="flex-1 h-full rounded-lg border border-white/10 bg-white/[0.02] p-4 flex flex-col gap-4">
                           <div className="h-20 w-full rounded-md bg-gradient-to-r from-white/5 to-transparent border border-white/5" />
                           <div className="flex-1 w-full rounded-md bg-white/5" />
                        </div>
                      </div>
                    </div>
                  </BrowserMockup>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Let's Build CTA */}
      <Section className="relative z-20 border-t border-white/5 bg-[#050505]">
        <Container className="text-center py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full border border-white/10 bg-white/5 mb-8">
              <span className="text-2xl">🤝</span>
            </div>
            <H2 className="text-4xl md:text-5xl mb-6 tracking-tight text-white/90">Let&apos;s Build</H2>
            <P className="text-xl text-white/50 mb-10 leading-relaxed font-light">
              If you need a system architected with precision, or a product built to scale from day one, my workspace is open.
            </P>
            <Button size="lg" asChild className="text-lg px-8 h-14 rounded-full bg-white text-black hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] transition-all">
              <Link href="/build">Initiate Contact</Link>
            </Button>
          </motion.div>
        </Container>
      </Section>
    </main>
  )
}
