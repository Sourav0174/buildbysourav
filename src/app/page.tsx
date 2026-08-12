import { prisma } from '@/core/db/prisma'
import { HomeClient, FeaturedProduct } from './home-client'

export default async function HomePage() {
  // Fetch featured products server-side
  const dbProducts = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: 'desc' }
  })

  // Normalize DB schema to UI expectations without leaking internal fields
  const featuredProducts: FeaturedProduct[] = dbProducts.map(p => ({
    title: p.title,
    tagline: p.tagline,
    color: p.color,
    tech: Array.isArray(p.tech) ? p.tech as string[] : [],
    status: p.status,
    description: p.overview,
    slug: p.slug
  }))

  return <HomeClient products={featuredProducts} />
}
