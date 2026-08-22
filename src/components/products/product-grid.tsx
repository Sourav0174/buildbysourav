"use client"

import * as React from "react"
import Link from "next/link"
import { H1, H2, P } from "@/components/ui/typography"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, ServerOff } from "lucide-react"
import { motion, useMotionTemplate, useMotionValue, Variants } from "framer-motion"
import { SpotlightCard } from "@/components/ui/spotlight-card"

type Product = {
  id: string
  slug: string
  title: string
  tagline: string
  status: string
  timeline: string
  color: string | null
  tech: string[]
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export function ProductGrid({ initialProducts }: { initialProducts: Product[] }) {
  const [filter, setFilter] = React.useState<string>("All")
  const [search, setSearch] = React.useState<string>("")

  const filteredProducts = initialProducts.filter(product => {
    const matchesFilter = filter === "All" || product.status.replace("_", " ") === filter
    const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase()) || 
                          product.tagline.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const filters = ["All", "Live", "Building", "Open Source"]

  return (
    <div className="relative z-10">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none opacity-50" />

      {/* Hero Section */}
      <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 pb-12 border-b border-white/10">
        <div>
          <H1 className="text-4xl md:text-[4.5rem] tracking-tight text-white mb-6 leading-[1.05] font-medium">
            Ecosystem
          </H1>
          <P className="text-xl md:text-2xl text-white/60 max-w-2xl font-light leading-[1.6]">
            An index of software systems, applications, and frameworks I have architected and built.
          </P>
        </div>
        
        {/* Search */}
        <div className="flex flex-col gap-6 w-full md:w-auto">
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 group-focus-within:text-white/80 transition-colors" />
            <Input 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 bg-white/[0.03] border-white/10 h-14 rounded-2xl backdrop-blur-md focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:bg-white/[0.05] transition-all text-white/80 placeholder:text-white/30"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-12 relative z-10">
        {filters.map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`text-sm font-medium px-5 py-2.5 rounded-full border transition-all duration-300 ${
              filter === f 
                ? "bg-white text-black border-white shadow-[0_0_20px_-5px_rgba(255,255,255,0.5)]" 
                : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-32 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01] backdrop-blur-sm"
        >
          <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <ServerOff className="h-8 w-8 text-white/40" />
          </div>
          <P className="text-white/60 text-xl font-light">No products found matching your criteria.</P>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10"
        >
          {filteredProducts.map((product) => (
            <motion.div key={product.slug} variants={itemVariants} className="h-full">
              <Link href={`/products/${product.slug}`} className="block h-full">
                <SpotlightCard color={product.color || '#ffffff'}>
                  <div className="flex items-start justify-between mb-10">
                    <Badge variant="outline" className="bg-black/40 text-white/60 border-white/10 backdrop-blur-md uppercase tracking-wider text-[10px] px-3 py-1 font-semibold">
                      {product.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-sm font-medium text-white/40">{product.timeline}</span>
                  </div>
                  
                  <H2 className="text-3xl lg:text-[2rem] font-medium mb-4 tracking-tight text-white group-hover:text-white/90 transition-colors leading-tight">
                    {product.title}
                  </H2>
                  <P className="text-white/60 mb-10 flex-1 text-lg leading-[1.6] font-light group-hover:text-white/70 transition-colors">
                    {product.tagline}
                  </P>
                  
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {(product.tech || []).slice(0, 3).map((t: string) => (
                      <span key={t} className="text-xs font-medium text-white/40 bg-white/[0.03] border border-white/5 px-3 py-1.5 rounded-lg transition-colors group-hover:bg-white/10 group-hover:text-white/70">
                        {t}
                      </span>
                    ))}
                    {(product.tech || []).length > 3 && (
                      <span className="text-xs font-medium text-white/40 bg-white/[0.03] border border-white/5 px-3 py-1.5 rounded-lg">
                        +{(product.tech || []).length - 3}
                      </span>
                    )}
                  </div>
                </SpotlightCard>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
