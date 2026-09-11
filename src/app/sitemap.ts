import type { MetadataRoute } from "next"
import { getPublishedPosts } from "@/core/data/blog"
import { prisma } from "@/core/db/prisma"
import { SITE_URL } from "@/core/utils/blog"

export const revalidate = 3600 // Revalidate sitemap at most once an hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [publishedPosts, products] = await Promise.all([
    getPublishedPosts(),
    prisma.product.findMany({
      select: { slug: true, updatedAt: true },
    }),
  ])

  // Static core public routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/build`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ]

  // Dynamic published blog posts (strictly published, never drafts)
  const blogRoutes: MetadataRoute.Sitemap = publishedPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt || post.publishedAt || new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  // Dynamic public product pages
  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  return [...staticRoutes, ...blogRoutes, ...productRoutes]
}
