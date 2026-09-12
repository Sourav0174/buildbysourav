export type AdProviderType = "adsense" | "none"

export interface GoogleAdSenseConfig {
  clientId: string
  slotTop?: string
  slotBottom?: string
}

export interface AdProviderConfig {
  provider: AdProviderType
  isConfigured: boolean
  adsense?: GoogleAdSenseConfig
}

/**
 * Strips surrounding whitespace, quotes (single, double, or escaped), and HTML entities
 * from environment variable values. This prevents literal quotes entered in hosting provider
 * dashboards or env files from leaking into script URLs and HTML attributes.
 */
function sanitizeAdValue(value?: string): string | undefined {
  if (!value) return undefined
  let cleaned = value.trim()
  cleaned = cleaned.replace(/^&quot;|&quot;$/g, "")
  cleaned = cleaned.replace(/^["'\\]+|["'\\]+$/g, "").trim()
  return cleaned.length > 0 ? cleaned : undefined
}

/**
 * Resolves the active Google AdSense provider configuration based on environment variables.
 * If NEXT_PUBLIC_ADSENSE_CLIENT_ID is not provided or empty, returns `{ provider: 'none', isConfigured: false }`
 * ensuring a safe no-op with zero layout shift, zero script injection, and zero network calls.
 * Never invents or hardcodes fake publisher or slot IDs.
 */
export function getAdProviderConfig(): AdProviderConfig {
  const clientId = sanitizeAdValue(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID)

  if (clientId) {
    return {
      provider: "adsense",
      isConfigured: true,
      adsense: {
        clientId,
        slotTop: sanitizeAdValue(process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP),
        slotBottom: sanitizeAdValue(process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM),
      },
    }
  }

  return {
    provider: "none",
    isConfigured: false,
  }
}

