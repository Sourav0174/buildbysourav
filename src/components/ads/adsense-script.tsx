"use client"

import Script from "next/script"
import { usePathname } from "next/navigation"
import { getAdProviderConfig } from "@/core/ads/config"

export function AdSenseScript() {
  const pathname = usePathname()
  const config = getAdProviderConfig()

  // 1. If AdSense is not configured or no client ID is set, do not render
  if (!config.isConfigured || config.provider !== "adsense" || !config.adsense?.clientId) {
    return null
  }

  // 2. Strict exclusion: Never load AdSense script on Studio or Studio Preview routes
  if (pathname && pathname.startsWith("/studio")) {
    return null
  }

  return (
    <Script
      id="google-adsense-script"
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.adsense.clientId}`}
      crossOrigin="anonymous"
    />
  )
}
