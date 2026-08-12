'use server'

import { prisma } from '@/core/db/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { verifySession } from '@/core/auth/session'

export async function createPost() {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  const fallbackSlug = `untitled-post-${Date.now()}`

  const post = await prisma.post.create({
    data: {
      title: 'Untitled Post',
      slug: fallbackSlug,
      excerpt: '',
      content: '',
      isPublished: false,
    }
  })
  
  redirect(`/studio/writing/${post.id}`)
}

const updatePostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  excerpt: z.string().optional().default(""),
  content: z.string().optional().default(""),
})

export async function updatePost(id: string, data: unknown) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  const parsed = updatePostSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error("Invalid post data")
  }

  // Check for duplicate slug
  const existingWithSlug = await prisma.post.findUnique({
    where: { slug: parsed.data.slug }
  })

  if (existingWithSlug && existingWithSlug.id !== id) {
    throw new Error("Slug is already in use by another post")
  }

  await prisma.post.update({
    where: { id },
    data: parsed.data
  })
  revalidatePath(`/studio/writing`)
  revalidatePath(`/studio/writing/${id}`)
  revalidatePath(`/writing`) // For future public site
  revalidatePath(`/writing/${parsed.data.slug}`) // For future public site
}

export async function deletePost(id: string) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  await prisma.post.delete({
    where: { id }
  })
  revalidatePath(`/studio/writing`)
  redirect('/studio/writing')
}

export async function togglePublishPost(id: string, isPublished: boolean) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  const post = await prisma.post.findUnique({ where: { id } })
  if (!post) throw new Error("Post not found")

  await prisma.post.update({
    where: { id },
    data: {
      isPublished,
      // If publishing for the first time, set publishedAt
      publishedAt: (isPublished && !post.publishedAt) ? new Date() : post.publishedAt
    }
  })
  
  revalidatePath(`/studio/writing`)
  revalidatePath(`/studio/writing/${id}`)
  revalidatePath(`/writing`) 
  revalidatePath(`/writing/${post.slug}`) 
}
