import * as React from "react"
import { cn } from "@/core/utils/cn"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-white/20",
        {
          "border-transparent bg-white text-black hover:bg-white/80": variant === "default",
          "border-transparent bg-white/10 text-white hover:bg-white/20": variant === "secondary",
          "border-transparent bg-red-500/20 text-red-500 hover:bg-red-500/30": variant === "destructive",
          "border-white/20 text-white": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
