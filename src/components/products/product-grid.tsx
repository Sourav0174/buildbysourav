"use client"

import * as React from "react"
import Link from "next/link"
import { H2, P } from "@/components/ui/typography"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, ServerOff } from "lucide-react"

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
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-white/10 pb-12">
        <div>
          <H2 className="text-4xl md:text-5xl tracking-tighter mb-4 text-white">Ecosystem</H2>
          <P className="text-xl text-white/60 max-w-2xl">
            An index of software systems, applications, and frameworks I have architected and built.
          </P>
        </div>
        <div className="w-full md:w-72 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white/[0.02] border-white/10 h-12"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-12">
        {filters.map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
              filter === f 
                ? "bg-white text-black border-white" 
                : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="py-32 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
          <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <ServerOff className="h-6 w-6 text-white/40" />
          </div>
          <P className="text-white/60 text-lg">No products found matching your criteria.</P>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Link key={product.slug} href={`/products/${product.slug}`}>
              <div className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-8 h-full flex flex-col transition-all duration-300 hover:bg-white/[0.04]">
                {/* Subtle Inner Glow on Hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                  style={{ boxShadow: `inset 0 0 40px -20px ${product.color || '#ffffff'}` }}
                />
                
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <Badge variant="outline" className="bg-black/50 backdrop-blur-md">
                    {product.status.replace('_', ' ')}
                  </Badge>
                  <span className="text-sm font-medium text-white/40">{product.timeline}</span>
                </div>
                
                <H2 className="text-3xl mb-3 tracking-tight group-hover:text-white transition-colors relative z-10">{product.title}</H2>
                <P className="text-white/60 mb-8 flex-1 relative z-10">{product.tagline}</P>
                
                <div className="flex flex-wrap gap-2 mt-auto relative z-10">
                  {(product.tech || []).slice(0, 3).map((t: string) => (
                    <span key={t} className="text-xs font-medium text-white/40 bg-white/5 px-2 py-1 rounded-md">
                      {t}
                    </span>
                  ))}
                  {(product.tech || []).length > 3 && (
                    <span className="text-xs font-medium text-white/40 bg-white/5 px-2 py-1 rounded-md">
                      +{(product.tech || []).length - 3}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
