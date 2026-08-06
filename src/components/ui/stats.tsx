import * as React from "react"
import { cn } from "@/core/utils/cn"

export function Stats({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-1 border-l-2 border-white/10 pl-4", className)}>
      <div className="text-3xl font-bold tracking-tight text-white">{value}</div>
      <div className="text-sm font-medium text-white/40">{label}</div>
    </div>
  )
}
