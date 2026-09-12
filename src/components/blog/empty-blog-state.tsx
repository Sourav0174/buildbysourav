"use client"

import React from "react"
import { motion } from "framer-motion"
import { PenTool, BookOpen } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function EmptyBlogState({ activeCategoryName }: { activeCategoryName?: string }) {
  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 blur-3xl opacity-50 rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative border border-white/10 bg-black/40 backdrop-blur-xl rounded-3xl p-8 md:p-14 overflow-hidden"
      >
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center backdrop-blur-sm relative shadow-2xl">
              {activeCategoryName ? (
                <BookOpen className="h-8 w-8 text-blue-400" />
              ) : (
                <PenTool className="h-8 w-8 text-blue-400" />
              )}
            </div>
          </motion.div>

          <div className="space-y-3 max-w-xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white/95">
              {activeCategoryName ? `No articles in ${activeCategoryName}` : "No Articles Published Yet"}
            </h2>
            <p className="text-white/60 leading-relaxed text-sm md:text-base">
              {activeCategoryName 
                ? `We haven't published any engineering notes for the ${activeCategoryName} category yet. They are currently compiling in the background.`
                : "The engineering notes and architectural breakdowns are currently being drafted. We're translating caffeine into high-signal content. Check back shortly."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            {activeCategoryName ? (
              <Link href="/blog">
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/10 gap-2 h-10 px-6 rounded-full">
                  <BookOpen className="h-4 w-4" />
                  Read Other Articles
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2 mt-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-medium text-emerald-400/90 tracking-wide uppercase">Drafts in progress...</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
