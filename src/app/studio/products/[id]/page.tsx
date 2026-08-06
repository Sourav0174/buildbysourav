import * as React from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/core/db/prisma"
import { ProductEditor } from "@/components/studio/product-editor"

export default async function StudioProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id }
  })

  if (!product) {
    notFound()
  }

  // Ensure JSON fields are passed as objects/arrays, not just stringified strings
  const initialData = {
    ...product,
    tech: typeof product.tech === 'string' ? JSON.parse(product.tech) : product.tech,
    features: typeof product.features === 'string' ? JSON.parse(product.features) : product.features,
    roadmap: typeof product.roadmap === 'string' ? JSON.parse(product.roadmap) : product.roadmap,
    engineeringChallenges: typeof product.engineeringChallenges === 'string' ? JSON.parse(product.engineeringChallenges) : product.engineeringChallenges,
    engineeringDecisions: typeof product.engineeringDecisions === 'string' ? JSON.parse(product.engineeringDecisions) : product.engineeringDecisions,
    metrics: typeof product.metrics === 'string' ? JSON.parse(product.metrics) : product.metrics,
    links: typeof product.links === 'string' ? JSON.parse(product.links) : product.links,
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
