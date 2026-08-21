import * as React from "react"
import { prisma } from "@/core/db/prisma"
import { H1, P } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { createProduct } from "@/core/actions/products"
import { ProductsListClient } from "@/components/studio/products-list"

export default async function StudioProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: [
      { order: 'asc' },
      { createdAt: 'desc' }
    ]
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <H1 className="text-4xl tracking-tight mb-2">Products</H1>
          <P className="text-white/60">Manage your software ecosystem.</P>
        </div>
        <form action={createProduct}>
          <Button type="submit" className="gap-2 bg-white text-black hover:bg-white/90">
            <Plus className="h-4 w-4" />
            New Product
          </Button>
        </form>
      </div>

      <ProductsListClient initialProducts={products} />
    </div>
  )
}

