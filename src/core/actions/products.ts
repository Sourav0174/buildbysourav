/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { prisma } from '@/core/db/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export async function createProduct() {
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
  slug: z.string().min(1, "Slug is required"),
  tagline: z.string().optional(),
  overview: z.string().optional(),
  whyItExists: z.string().optional(),
  color: z.string().optional(),
  status: z.string().optional(),
  timeline: z.string().optional(),
  isFeatured: z.boolean().optional(),
  tech: z.any().optional(),
  features: z.any().optional(),
  roadmap: z.any().optional(),
  engineeringChallenges: z.any().optional(),
  engineeringDecisions: z.any().optional(),
  metrics: z.any().optional(),
  links: z.any().optional(),
  screenshots: z.any().optional(),
  seo: z.any().optional(),
})

export async function updateProduct(id: string, data: unknown) {
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
  await prisma.product.delete({
    where: { id }
  })
  revalidatePath(`/studio/products`)
  redirect('/studio/products')
}
