import * as React from "react"
import { cn } from "@/core/utils/cn"

export function H1({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground", className)}
      {...props}
    >
      {children}
    </h1>
  )
}

export function H2({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0 text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

export function H3({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("scroll-m-20 text-2xl font-semibold tracking-tight text-foreground", className)}
      {...props}
    >
      {children}
    </h3>
  )
}

export function P({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("leading-7 text-muted-foreground [&:not(:first-child)]:mt-6", className)}
      {...props}
    >
      {children}
    </p>
  )
}

export function Code({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground border border-white/5",
        className
      )}
      {...props}
    >
      {children}
    </code>
  )
}
