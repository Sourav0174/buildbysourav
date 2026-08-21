"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValue, useSpring } from "framer-motion"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { H1, H2, H3, P } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BrowserMockup } from "@/components/ui/mockup"
import { cn } from "@/core/utils/cn"

export interface FeaturedProduct {
  title: string;
  tagline: string;
  color: string;
  tech: string[];
  status: string;
  description: string;
  slug: string;
  heroImage?: string | null;
}

export function HomeClient({ products }: { products: FeaturedProduct[] }) {
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
      <div className="min-h-0 lg:min-h-screen flex flex-col justify-center relative z-10 pt-16 sm:pt-20 lg:pt-32 pb-10 lg:pb-24">
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
              Turning ideas into <br className="hidden md:block lg:hidden"/> products that work.
            </H1>
            <P className="text-lg md:text-2xl text-white/60 max-w-[320px] md:max-w-md lg:max-w-2xl mb-7 lg:mb-12 font-light leading-[1.6] lg:leading-[1.6] mx-auto lg:mx-0">
              I&apos;m a full-stack engineer and product builder. I work across the layers that make a product real &mdash; from <span className="text-white/90 font-normal">architecture</span> and <span className="text-white/90 font-normal">APIs</span>, to <span className="text-white/90 font-normal">interfaces</span> and <span className="text-white/90 font-normal">infrastructure</span>.
            </P>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 lg:gap-x-6 lg:gap-y-3 text-sm font-medium text-white/50 w-full">
              <span className="flex items-center gap-2 text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-white/70" /> Building Products
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
            {products.length === 0 && (
              <div className="py-24 text-center">
                <P className="text-white/40 text-lg">New products are currently being engineered. Check back soon.</P>
              </div>
            )}
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
                    <Link href={`/products/${product.slug}`}>Explore Architecture</Link>
                  </Button>
                </div>

                {/* Product Mockup */}
                <div className="flex-[1.5] w-full">
                  {product.heroImage ? (
                    <div className="aspect-video w-full relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 group">
                      <Image 
                        src={product.heroImage} 
                        alt={`${product.title} interface`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                      />
                    </div>
                  ) : (
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
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Let's Build CTA */}
      <RefinedTerminalCTA />
    </main>
  )
}

function RefinedTerminalCTA() {
  return (
    <Section className="relative z-20 overflow-hidden bg-transparent pb-32 md:pb-48">
      <Container>
        {/* Top Border exactly matching the width of the main website content */}
        <div className="border-t border-white/5 w-full pt-32 md:pt-48 relative">
          
          {/* Subtle Background Glow behind the terminal - Increased size further */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1040px] h-[680px] bg-blue-500/10 blur-[200px] rounded-[100%] pointer-events-none" />

          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative rounded-2xl shadow-[0_20px_80px_-15px_rgba(0,0,0,0.9)] group overflow-hidden p-[1px]"
            >
              {/* Rotating Gradient Border Animation */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(255,255,255,0.4)_360deg)] opacity-30 group-hover:opacity-70 transition-opacity duration-500"
              />
              {/* Static Border Fallback/Base */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
              
              <div className="rounded-[15px] bg-[#0A0A0A] overflow-hidden relative z-10 h-full w-full">
                {/* Subtle noise texture over the terminal */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />

                {/* macOS Style Window Header */}
                <div className="flex items-center px-4 py-3 border-b border-white/5 bg-white/[0.02] relative z-10">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                  </div>
                  <div className="mx-auto text-xs text-white/40 font-mono tracking-wider flex items-center gap-2">
                    <span className="opacity-50">✦</span> workspace
                  </div>
                </div>
                
                {/* Terminal Body */}
                <div className="p-8 md:p-12 lg:p-16 relative z-10">
                  <div className="font-mono text-sm md:text-base text-white/50 mb-2 flex items-center gap-2">
                    <span className="text-blue-400">System</span> 
                    <span className="text-white/30">{`>`}</span>
                    <span>Analyzing product requirements...</span>
                  </div>
                  <div className="font-mono text-sm md:text-base text-white/80 mb-10 flex items-center gap-2">
                    <span className="text-emerald-400">Ready</span> 
                    <span className="text-white/30">{`>`}</span>
                    <span>Architecture optimized. Ready to build.</span>
                  </div>
                  
                  <H2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6 text-white leading-tight">
                    Bring your vision to life. <br className="hidden md:block" />
                    <span className="text-white/40">Flawlessly.</span>
                  </H2>
                  
                  <P className="text-lg md:text-xl text-white/50 mb-12 leading-relaxed font-light max-w-2xl">
                    Whether you need a robust technical architecture or a beautiful product built from scratch, I partner with visionaries to turn complex problems into elegant software.
                  </P>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="flex items-center gap-4 bg-white/5 p-2 pr-6 rounded-full border border-white/10 ring-1 ring-white/5">
                      <Button size="lg" asChild className="text-base px-8 h-12 rounded-full bg-white text-black hover:bg-gray-200 hover:scale-105 transition-all font-medium">
                        <Link href="/build">Start Project</Link>
                      </Button>
                      <div className="flex items-center gap-2">
                        <span className="text-white/40 font-mono text-sm hidden sm:inline-block">Waiting for input</span>
                        <span className="animate-[pulse_1s_ease-in-out_infinite] w-2 h-5 bg-blue-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* User's Wish: Concluding statement */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="mt-24 text-center"
          >
            <p className="text-xs sm:text-sm font-mono tracking-[0.25em] uppercase text-white/20 hover:text-white/40 transition-colors duration-500 cursor-default">
              Excellent work attracts excellent opportunity.
            </p>
          </motion.div>
        </div>
      </Container>
    </Section>
  )
}

