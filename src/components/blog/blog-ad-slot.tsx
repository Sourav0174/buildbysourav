"use client"

import * as React from "react"
import { getAdProviderConfig } from "@/core/ads/config"
import { cn } from "@/core/utils/cn"

export interface BlogAdSlotProps {
  allowAds?: boolean
  slot?: "top" | "bottom"
  className?: string
}

export function BlogAdSlot({
  allowAds = false,
  slot = "top",
  className,
}: BlogAdSlotProps) {
  const config = getAdProviderConfig()

  // 1. Strict Eligibility Gate
  // If ads are disabled on this article OR AdSense is not configured, render NOTHING.
  // Never show placeholder boxes, borders, or layout shifts in production when ads are disabled or credentials missing.
  if (!allowAds || !config.isConfigured || config.provider !== "adsense" || !config.adsense) {
    return null
  }

  const slotId = slot === "bottom" ? config.adsense.slotBottom : config.adsense.slotTop

  return (
    <div
      className={cn(
        "my-8 py-4 px-4 rounded-xl border border-white/5 bg-white/[0.01] text-center overflow-hidden transition-all",
        className
      )}
      aria-label="Advertisement"
    >
      {/* Policy-compliant Editorial Disclaimer */}
      <span className="block text-[10px] font-mono uppercase tracking-widest text-white/30 mb-3 select-none">
        Advertisement
      </span>

      {/* Google AdSense Manual Unit Container */}
      <GoogleAdSenseContainer
        clientId={config.adsense.clientId}
        slotId={slotId}
      />
    </div>
  )
}

function GoogleAdSenseContainer({
  clientId,
  slotId,
}: {
  clientId: string
  slotId?: string
}) {
  const adPushedRef = React.useRef(false)

  React.useEffect(() => {
    if (adPushedRef.current) return
    try {
      if (typeof window !== "undefined") {
        const win = window as unknown as { adsbygoogle?: unknown[] }
        win.adsbygoogle = win.adsbygoogle || []
        win.adsbygoogle.push({})
        adPushedRef.current = true
      }
    } catch (e) {
      // In local dev, ad-blocked browsers, or pre-approval states, log warning safely
      console.warn("Google AdSense push warning:", e)
    }
  }, [])

  return (
    <div className="min-h-[100px] flex items-center justify-center overflow-hidden">
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", textAlign: "center" }}
        data-ad-client={clientId}
        {...(slotId ? { "data-ad-slot": slotId } : {})}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}

