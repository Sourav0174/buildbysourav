"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/core/utils/cn"

const navItems = [
  { name: "Products", path: "/products" },
  { name: "Services", path: "/services" },
  { name: "About", path: "/about" },
]

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 flex items-center justify-center pt-6 transition-all duration-300",
        scrolled ? "pt-4" : "pt-8"
      )}
    >
      <nav
        className={cn(
          "flex items-center gap-3 sm:gap-6 rounded-full border border-white/10 bg-black/50 px-4 sm:px-6 py-2.5 backdrop-blur-md shadow-2xl transition-all duration-300 max-w-[95vw] overflow-x-auto no-scrollbar",
          scrolled ? "bg-black/80 border-white/20" : ""
        )}
      >
        <Link href="/" className="mr-2 sm:mr-4 flex flex-shrink-0 items-center gap-2 relative">
          <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-white animate-pulse" />
          <span className="font-semibold tracking-tight text-white hidden md:block">Workspace</span>
        </Link>
        
        <div className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`)
            return (
              <Link
                key={item.name}
                href={item.path}
                className={cn(
                  "relative px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors hover:text-white whitespace-nowrap",
                  isActive ? "text-white" : "text-muted-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 rounded-full bg-white/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{item.name}</span>
              </Link>
            )
          })}
        </div>

        <div className="ml-2 sm:ml-4 pl-2 sm:pl-4 border-l border-white/10 flex-shrink-0">
          <Link
            href="/build"
            className="text-xs sm:text-sm font-medium text-white transition-colors hover:text-accent whitespace-nowrap"
          >
            Let&apos;s Build <span className="hidden sm:inline">&rarr;</span>
          </Link>
        </div>
      </nav>
    </header>
  )
}
