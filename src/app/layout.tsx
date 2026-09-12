import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { ScrollToTop } from "@/components/layout/scroll-to-top"
import { getAdProviderConfig } from "@/core/ads/config"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://buildbysourav.in"),
  title: {
    default: "The Workspace",
    template: "%s | The Workspace",
  },
  description: "Engineering Software at the Highest Level",
  alternates: {
    canonical: "https://buildbysourav.in",
  },
  openGraph: {
    title: "The Workspace",
    description: "Engineering Software at the Highest Level",
    url: "https://buildbysourav.in",
    siteName: "The Workspace",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const adConfig = getAdProviderConfig()

  return (
    <html lang="en" className="dark">
      <head>
        {adConfig.isConfigured && adConfig.provider === "adsense" && adConfig.adsense?.clientId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adConfig.adsense.clientId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white selection:bg-white/20`}>
        <Navbar />
        {children}
        <ScrollToTop />
      </body>
    </html>
  )
}
