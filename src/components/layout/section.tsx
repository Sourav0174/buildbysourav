import * as React from "react"
import { cn } from "@/core/utils/cn"

const Section = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn("py-24 sm:py-32 relative", className)}
        {...props}
      />
    )
  }
)
Section.displayName = "Section"

export { Section }
