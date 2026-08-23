"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { H2, P } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"

export function RefinedTerminalCTA() {
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
