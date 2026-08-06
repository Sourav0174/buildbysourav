import * as React from "react"
import { cn } from "@/core/utils/cn"

interface BrowserMockupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function BrowserMockup({ children, className, ...props }: BrowserMockupProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-black/50 shadow-2xl backdrop-blur-xl",
        className
      )}
      {...props}
    >
      {/* macOS Traffic Lights Header */}
      <div className="flex h-10 w-full items-center gap-2 border-b border-white/5 bg-white/5 px-4">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-white/20" />
          <div className="h-3 w-3 rounded-full bg-white/20" />
          <div className="h-3 w-3 rounded-full bg-white/20" />
        </div>
      </div>
      
      {/* Mockup Content */}
      <div className="relative flex-1 bg-[#0a0a0a]">
        {children}
      </div>
    </div>
  )
}
