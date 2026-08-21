import * as React from "react"
import { Container } from "@/components/layout/container"
import { prisma } from "@/core/db/prisma"
import { ProductGrid } from "@/components/products/product-grid"

export const revalidate = 60 // ISR: Revalidate cache every 60 seconds

export default async function ProductsOverview() {
  const dbProducts = await prisma.product.findMany({
    orderBy: [
      { order: 'asc' },
      { createdAt: 'desc' }
    ]
  })

  // Parse JSON fields safely for display
  const products = dbProducts.map(p => ({
    ...p,
    tech: typeof p.tech === 'string' ? JSON.parse(p.tech) : p.tech,
  }))

  return (
    <main className="min-h-screen pt-32 pb-24">
      <Container>
        <ProductGrid initialProducts={products} />
      </Container>
    </main>
  )
}
