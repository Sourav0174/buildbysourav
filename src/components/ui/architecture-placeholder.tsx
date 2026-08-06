import * as React from "react"
import { cn } from "@/core/utils/cn"

export function ArchitecturePlaceholder({ className }: { className?: string }) {
  return (
    <div 
      className={cn(
        "w-full rounded-xl border border-white/10 bg-[#050505] relative overflow-hidden flex flex-col items-center justify-center p-8",
        className
      )}
      style={{
        backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
        backgroundSize: "20px 20px"
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] pointer-events-none" />
      
      {/* Mock Architecture Blocks */}
      <div className="relative z-10 flex flex-col gap-8 w-full max-w-2xl mx-auto">
        <div className="flex justify-center">
          <div className="border border-white/20 bg-black/80 backdrop-blur px-6 py-3 rounded-md text-sm text-white/80">
            Client Application
          </div>
        </div>
        
        <div className="flex justify-center gap-4">
          <div className="w-px h-8 bg-white/20" />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="border border-white/20 bg-black/80 backdrop-blur px-4 py-3 rounded-md text-sm text-center text-white/80">
            Load Balancer
          </div>
          <div className="border border-[#16a34a]/40 bg-[#16a34a]/10 backdrop-blur px-4 py-3 rounded-md text-sm text-center text-[#16a34a]">
            API Gateway
          </div>
          <div className="border border-white/20 bg-black/80 backdrop-blur px-4 py-3 rounded-md text-sm text-center text-white/80">
            Auth Service
          </div>
        </div>
        
        <div className="flex justify-center gap-4">
          <div className="w-px h-8 bg-white/20" />
        </div>

        <div className="flex justify-center">
          <div className="border border-[#6366f1]/40 bg-[#6366f1]/10 backdrop-blur px-8 py-4 rounded-md text-sm text-center text-[#6366f1] w-2/3">
            Primary Database / Ledger
          </div>
        </div>
      </div>
    </div>
  )
}
