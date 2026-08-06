"use client"

import React, { useState, useEffect } from "react"
import { motion, useSpring } from "framer-motion"
import { cn } from "@/core/utils/cn"

export function Spotlight({ className }: { className?: string }) {
  const [isMounted, setIsMounted] = useState(false)
  
  const mouseX = useSpring(0, { stiffness: 50, damping: 20 })
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 })

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY, isMounted])

  if (!isMounted) return null

  return (
    <motion.div
      className={cn("pointer-events-none fixed inset-0 z-30 transition duration-300", className)}
      style={{
        background: "radial-gradient(600px circle at var(--x) var(--y), rgba(255,255,255,0.03), transparent 40%)",
        // @ts-expect-error - Framer Motion MotionValue to CSS variable conversion
        "--x": mouseX.get() + "px",
        "--y": mouseY.get() + "px",
      }}
    />
  )
}
