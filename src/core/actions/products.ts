'use server'

import { prisma } from '@/core/db/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { verifySession } from '@/core/auth/session'

export async function createProduct() {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  const product = await prisma.product.create({
    data: {
      title: 'Untitled Product',
      slug: `untitled-${Date.now()}`,
      tagline: '',
      overview: '',
      whyItExists: '',
    }
  })
  
  redirect(`/studio/products/${product.id}`)
}

const updateProductSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  tagline: z.string().optional(),
  overview: z.string().optional(),
  whyItExists: z.string().optional(),
  heroImage: z.string().nullable().optional(),
  color: z.string().optional(),
  status: z.string().optional(),
  timeline: z.string().optional(),
  isFeatured: z.boolean().optional(),
  tech: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  roadmap: z.array(z.string()).optional(),
  engineeringChallenges: z.array(z.object({
    title: z.string(),
    description: z.string()
  })).optional(),
  engineeringDecisions: z.array(z.object({
    title: z.string(),
    description: z.string(),
    tradeoff: z.string()
  })).optional(),
  metrics: z.array(z.object({
    label: z.string(),
    value: z.string()
  })).optional(),
  links: z.array(z.object({
    label: z.string(),
    url: z.string()
  })).optional(),
  screenshots: z.array(z.object({
    url: z.string(),
    caption: z.string().optional()
  })).optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional()
  }).optional(),
})

export async function updateProduct(id: string, data: unknown) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  const parsed = updateProductSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error("Invalid product data")
  }

  // Fetch the existing product to check if the heroImage changed
  const existingProduct = await prisma.product.findUnique({
    where: { id },
    select: { heroImage: true, screenshots: true }
  })

  // Update the database
  await prisma.product.update({
    where: { id },
    data: parsed.data
  })

  // Cleanup old images if they were replaced or removed
  try {
    const { del } = await import('@vercel/blob')
    const blobsToDelete: string[] = []

    if (
      existingProduct?.heroImage && 
      existingProduct.heroImage !== parsed.data.heroImage &&
      existingProduct.heroImage.includes('.public.blob.vercel-storage.com')
    ) {
      blobsToDelete.push(existingProduct.heroImage)
    }

    if (existingProduct?.screenshots && Array.isArray(existingProduct.screenshots)) {
      const oldScreenshotUrls = (existingProduct.screenshots as { url?: string; caption?: string }[])
        .map((s: { url?: string; caption?: string }) => s.url)
        .filter((url): url is string => typeof url === 'string' && url.includes('.public.blob.vercel-storage.com'))
      
      const newScreenshotUrls = new Set(
        (parsed.data.screenshots || []).map((s) => s.url)
      )

      for (const oldUrl of oldScreenshotUrls) {
        if (!newScreenshotUrls.has(oldUrl)) {
          blobsToDelete.push(oldUrl)
        }
      }
    }

    if (blobsToDelete.length > 0) {
      await del(blobsToDelete)
    }
  } catch (e) {
    console.error("Failed to delete orphaned blobs:", e)
  }

  revalidatePath(`/studio/products`)
  revalidatePath(`/studio/products/${id}`)
  revalidatePath(`/products`)
}

export async function deleteProduct(id: string) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  // Fetch product to get heroImage and screenshots before deletion
  const product = await prisma.product.findUnique({
    where: { id },
    select: { heroImage: true, screenshots: true }
  })

  await prisma.product.delete({
    where: { id }
  })

  // Cleanup old images if the product is deleted
  try {
    const { del } = await import('@vercel/blob')
    const blobsToDelete: string[] = []

    if (product?.heroImage && product.heroImage.includes('.public.blob.vercel-storage.com')) {
      blobsToDelete.push(product.heroImage)
    }

    if (product?.screenshots && Array.isArray(product.screenshots)) {
      const screenshotUrls = (product.screenshots as { url?: string; caption?: string }[])
        .map((s: { url?: string; caption?: string }) => s.url)
        .filter((url): url is string => typeof url === 'string' && url.includes('.public.blob.vercel-storage.com'))
      
      blobsToDelete.push(...screenshotUrls)
    }

    if (blobsToDelete.length > 0) {
      await del(blobsToDelete)
    }
  } catch (e) {
    console.error("Failed to delete orphaned blobs on product delete:", e)
  }

  revalidatePath(`/studio/products`)
  redirect('/studio/products')
}

import { del } from '@vercel/blob'

export async function deleteProductImage(url: string) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  // Only delete if it belongs to our vercel blob storage
  if (url.includes('.public.blob.vercel-storage.com')) {
    try {
      await del(url)
    } catch (e) {
      console.error("Failed to delete blob:", e)
      // We don't want to throw and break the UI just because cleanup failed,
      // but we log it.
    }
  }
}

export async function reorderProducts(orderedIds: string[]) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  if (!Array.isArray(orderedIds)) {
    throw new Error("Invalid input")
  }

  // Use a transaction to perform all updates atomically
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.product.update({
        where: { id },
        data: { order: index },
      })
    )
  )

  revalidatePath(`/studio/products`)
  revalidatePath(`/products`)
  revalidatePath(`/`)
}
