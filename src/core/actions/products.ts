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

  await prisma.product.update({
    where: { id },
    data: parsed.data
  })
  revalidatePath(`/studio/products`)
  revalidatePath(`/studio/products/${id}`)
  revalidatePath(`/products`)
}

export async function deleteProduct(id: string) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  await prisma.product.delete({
    where: { id }
  })
  revalidatePath(`/studio/products`)
  redirect('/studio/products')
}
