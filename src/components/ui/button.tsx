import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/core/utils/cn"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "outline" | "ghost" | "glass"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-white text-black hover:bg-white/90 active:scale-[0.98]": variant === "default",
            "border border-white/10 bg-transparent hover:bg-white/5 active:scale-[0.98]": variant === "outline",
            "hover:bg-white/5 hover:text-white active:scale-[0.98]": variant === "ghost",
            "glass-panel hover:bg-white/10 active:scale-[0.98]": variant === "glass",
            "h-9 px-4 py-2": size === "default",
            "h-8 rounded-md px-3 text-xs": size === "sm",
            "h-10 rounded-md px-8": size === "lg",
            "h-9 w-9": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
