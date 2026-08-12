import * as React from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/core/db/prisma"
import { ProductEditor } from "@/components/studio/product-editor"

function safeParseJSON(val: unknown, fallback: any) {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val)
    } catch {
      return fallback
    }
  }
  return val ?? fallback
}

export default async function StudioProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id }
  })

  if (!product) {
    notFound()
  }

  // Safely parse JSON fields and guarantee fallback shapes
  const initialData = {
    ...product,
    tech: safeParseJSON(product.tech, []),
    features: safeParseJSON(product.features, []),
    roadmap: safeParseJSON(product.roadmap, []),
    engineeringChallenges: safeParseJSON(product.engineeringChallenges, []),
    engineeringDecisions: safeParseJSON(product.engineeringDecisions, []),
    metrics: safeParseJSON(product.metrics, []),
    links: safeParseJSON(product.links, []),
    screenshots: safeParseJSON(product.screenshots, []),
    seo: safeParseJSON(product.seo, {}),
  }

  return (
    <div className="space-y-6">
      <Link 
        href="/studio/products"
        className="inline-flex items-center gap-2 text-sm font-medium text-white/40 hover:text-white transition-colors mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>
      
      <ProductEditor initialData={initialData} />
    </div>
  )
}
