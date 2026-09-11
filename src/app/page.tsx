import { prisma } from '@/core/db/prisma'
import { getHomepageBlogPosts } from '@/core/data/blog'
import { HomeClient, FeaturedProduct } from './home-client'

export const revalidate = 60 // Revalidate cache every 60 seconds

export default async function HomePage() {
  // Fetch featured products and curated homepage blog posts server-side concurrently
  const [dbProducts, blogPosts] = await Promise.all([
    prisma.product.findMany({
      where: { isFeatured: true },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    }),
    getHomepageBlogPosts(3),
  ])

  // Normalize DB schema to UI expectations without leaking internal fields
  const featuredProducts: FeaturedProduct[] = dbProducts.map(p => ({
    title: p.title,
    tagline: p.tagline,
    color: p.color,
    tech: Array.isArray(p.tech) ? p.tech as string[] : [],
    status: p.status,
    description: p.overview,
    slug: p.slug,
    heroImage: p.heroImage
  }))

  return <HomeClient products={featuredProducts} posts={blogPosts} />
}
