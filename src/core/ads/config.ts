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
 * Resolves the active Google AdSense provider configuration based on environment variables.
 * If NEXT_PUBLIC_ADSENSE_CLIENT_ID is not provided or empty, returns `{ provider: 'none', isConfigured: false }`
 * ensuring a safe no-op with zero layout shift, zero script injection, and zero network calls.
 * Never invents or hardcodes fake publisher or slot IDs.
 */
export function getAdProviderConfig(): AdProviderConfig {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim()

  if (clientId) {
    return {
      provider: "adsense",
      isConfigured: true,
      adsense: {
        clientId,
        slotTop: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP?.trim() || undefined,
        slotBottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM?.trim() || undefined,
      },
    }
  }

  return {
    provider: "none",
    isConfigured: false,
  }
}

