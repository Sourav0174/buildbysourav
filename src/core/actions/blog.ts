'use server'

import { prisma } from '@/core/db/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { verifySession } from '@/core/auth/session'
import { slugify, calculateReadingTime } from '@/core/utils/blog'

/**
 * Derives a guaranteed unique slug for a post.
 * If base slug exists, appends incremental numeric suffix (e.g. `my-post-1`).
 * Respects the current post ID if updating to prevent self-collision.
 */
export async function generateUniqueSlug(titleOrSlug: string, currentPostId?: string): Promise<string> {
  const base = slugify(titleOrSlug) || 'post'
  let candidate = base
  let counter = 1

  while (true) {
    const existing = await prisma.post.findUnique({
      where: { slug: candidate },
      select: { id: true }
    })

    if (!existing || (currentPostId && existing.id === currentPostId)) {
      return candidate
    }

    candidate = `${base}-${counter}`
    counter++
  }
}

const createPostSchema = z.object({
  title: z.string().trim().min(1, "Title is required").optional(),
  slug: z.string().trim().regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens").optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  coverImage: z.string().nullable().optional(),
  categoryId: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  authorName: z.string().optional(),
  authorRole: z.string().optional(),
  authorAvatar: z.string().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  publishedAt: z.coerce.date().nullable().optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  ogImage: z.string().nullable().optional(),
  canonicalUrl: z.string().nullable().optional(),
  allowAds: z.boolean().optional(),
  relatedProduct: z.string().nullable().optional(),
  relatedService: z.string().nullable().optional(),
})

const updatePostSchema = z.object({
  title: z.string().trim().min(1, "Title is required").optional(),
  slug: z.string().trim().regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens").optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  coverImage: z.string().nullable().optional(),
  categoryId: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  authorName: z.string().optional(),
  authorRole: z.string().optional(),
  authorAvatar: z.string().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  publishedAt: z.coerce.date().nullable().optional(),
  order: z.number().int().optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  ogImage: z.string().nullable().optional(),
  canonicalUrl: z.string().nullable().optional(),
  allowAds: z.boolean().optional(),
  relatedProduct: z.string().nullable().optional(),
  relatedService: z.string().nullable().optional(),
})

export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>

/**
 * Creates a new blog post.
 * If input is omitted, initializes an untitled draft.
 * Automatically derives unique slug and computes reading time.
 */
export async function createPost(input?: unknown) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  let data: CreatePostInput = {}
  if (input !== undefined && input !== null) {
    const parsed = createPostSchema.safeParse(input)
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message || "Invalid post data")
    }
    data = parsed.data
  }

  const title = data.title || 'Untitled Post'
  let slug: string

  if (data.slug) {
    slug = slugify(data.slug)
    const existing = await prisma.post.findUnique({
      where: { slug },
      select: { id: true }
    })
    if (existing) {
      throw new Error(`The slug "${slug}" is already in use by another post.`)
    }
  } else {
    slug = await generateUniqueSlug(title)
  }

  const content = data.content || ''
  const readingTime = calculateReadingTime(content)

  const isPublished = Boolean(data.isPublished)
  let publishedAt: Date | null = null
  if (isPublished) {
    publishedAt = data.publishedAt ?? new Date()
  }

  // Set order as highest + 1
  const lastPost = await prisma.post.findFirst({
    orderBy: { order: 'desc' },
    select: { order: true }
  })
  const nextOrder = lastPost ? lastPost.order + 1 : 0

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      excerpt: data.excerpt ?? '',
      content,
      coverImage: data.coverImage ?? null,
      categoryId: data.categoryId ?? null,
      tags: data.tags ?? [],
      authorName: data.authorName ?? 'Sourav',
      authorRole: data.authorRole ?? 'Full-Stack Engineer & Product Builder',
      authorAvatar: data.authorAvatar ?? '/profile2.png',
      isPublished,
      isFeatured: Boolean(data.isFeatured),
      publishedAt,
      readingTime,
      order: nextOrder,
      seoTitle: data.seoTitle ?? null,
      seoDescription: data.seoDescription ?? null,
      ogImage: data.ogImage ?? null,
      canonicalUrl: data.canonicalUrl ?? null,
      allowAds: data.allowAds ?? true,
      relatedProduct: data.relatedProduct ?? null,
      relatedService: data.relatedService ?? null,
    }
  })

  revalidatePath('/studio', 'layout')
  revalidatePath('/studio/blog')
  revalidatePath('/blog')
  revalidatePath('/')

  return { success: true, post }
}

/**
 * Updates an existing blog post.
 * Does NOT silently alter existing slugs. Explicit slug changes are strictly validated.
 * Automatically recalculates reading time if content changes.
 * Enforces publication rules.
 */
export async function updatePost(id: string, input: unknown) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  const parsed = updatePostSchema.safeParse(input)
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid post data")
  }

  const existing = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      coverImage: true,
      ogImage: true,
      isPublished: true,
      publishedAt: true,
    }
  })

  if (!existing) {
    throw new Error("Post not found")
  }

  const dataToUpdate: Record<string, unknown> = {}

  if (parsed.data.title !== undefined) {
    dataToUpdate.title = parsed.data.title
  }

  // Strict slug handling: only modify if explicitly passed and changed
  if (parsed.data.slug !== undefined) {
    const cleanSlug = slugify(parsed.data.slug)
    if (!cleanSlug) {
      throw new Error("Slug cannot be empty")
    }
    if (cleanSlug !== existing.slug) {
      const slugOwner = await prisma.post.findUnique({
        where: { slug: cleanSlug },
        select: { id: true }
      })
      if (slugOwner && slugOwner.id !== id) {
        throw new Error(`The slug "${cleanSlug}" is already in use by another post.`)
      }
      dataToUpdate.slug = cleanSlug
    }
  }

  // Automatic reading time recalculation if content is supplied
  if (parsed.data.content !== undefined) {
    dataToUpdate.content = parsed.data.content
    dataToUpdate.readingTime = calculateReadingTime(parsed.data.content)
  }

  if (parsed.data.excerpt !== undefined) dataToUpdate.excerpt = parsed.data.excerpt
  if (parsed.data.coverImage !== undefined) dataToUpdate.coverImage = parsed.data.coverImage
  if (parsed.data.categoryId !== undefined) dataToUpdate.categoryId = parsed.data.categoryId
  if (parsed.data.tags !== undefined) dataToUpdate.tags = parsed.data.tags
  if (parsed.data.authorName !== undefined) dataToUpdate.authorName = parsed.data.authorName
  if (parsed.data.authorRole !== undefined) dataToUpdate.authorRole = parsed.data.authorRole
  if (parsed.data.authorAvatar !== undefined) dataToUpdate.authorAvatar = parsed.data.authorAvatar
  if (parsed.data.isFeatured !== undefined) dataToUpdate.isFeatured = parsed.data.isFeatured
  if (parsed.data.order !== undefined) dataToUpdate.order = parsed.data.order
  if (parsed.data.seoTitle !== undefined) dataToUpdate.seoTitle = parsed.data.seoTitle
  if (parsed.data.seoDescription !== undefined) dataToUpdate.seoDescription = parsed.data.seoDescription
  if (parsed.data.ogImage !== undefined) dataToUpdate.ogImage = parsed.data.ogImage
  if (parsed.data.canonicalUrl !== undefined) dataToUpdate.canonicalUrl = parsed.data.canonicalUrl
  if (parsed.data.allowAds !== undefined) dataToUpdate.allowAds = parsed.data.allowAds
  if (parsed.data.relatedProduct !== undefined) dataToUpdate.relatedProduct = parsed.data.relatedProduct
  if (parsed.data.relatedService !== undefined) dataToUpdate.relatedService = parsed.data.relatedService

  // Publication state enforcement
  if (parsed.data.isPublished !== undefined) {
    dataToUpdate.isPublished = parsed.data.isPublished
    if (parsed.data.isPublished) {
      dataToUpdate.publishedAt = parsed.data.publishedAt ?? existing.publishedAt ?? new Date()
    } else if (parsed.data.publishedAt !== undefined) {
      dataToUpdate.publishedAt = parsed.data.publishedAt
    }
  } else if (parsed.data.publishedAt !== undefined) {
    dataToUpdate.publishedAt = parsed.data.publishedAt
  }

  const updatedPost = await prisma.post.update({
    where: { id },
    data: dataToUpdate,
  })

  // Cleanup orphaned Vercel Blobs if images were updated
  try {
    const { del } = await import('@vercel/blob')
    const blobsToDelete: string[] = []

    if (
      existing.coverImage &&
      parsed.data.coverImage !== undefined &&
      existing.coverImage !== parsed.data.coverImage &&
      existing.coverImage.includes('.public.blob.vercel-storage.com')
    ) {
      blobsToDelete.push(existing.coverImage)
    }

    if (
      existing.ogImage &&
      parsed.data.ogImage !== undefined &&
      existing.ogImage !== parsed.data.ogImage &&
      existing.ogImage.includes('.public.blob.vercel-storage.com')
    ) {
      blobsToDelete.push(existing.ogImage)
    }

    if (blobsToDelete.length > 0) {
      await del(blobsToDelete)
    }
  } catch (e) {
    console.error("Failed to delete orphaned blobs during post update:", e)
  }

  revalidatePath('/studio', 'layout')
  revalidatePath('/studio/blog')
  revalidatePath('/blog')
  if (existing.slug) revalidatePath(`/blog/${existing.slug}`)
  if (updatedPost.slug && updatedPost.slug !== existing.slug) {
    revalidatePath(`/blog/${updatedPost.slug}`)
  }
  revalidatePath('/')

  return { success: true, post: updatedPost }
}

/**
 * Deletes a post and cleans up associated blob assets.
 */
export async function deletePost(id: string) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  const post = await prisma.post.findUnique({
    where: { id },
    select: { id: true, slug: true, coverImage: true, ogImage: true }
  })

  if (!post) {
    throw new Error("Post not found")
  }

  await prisma.post.delete({
    where: { id }
  })

  // Cleanup Vercel blobs
  try {
    const { del } = await import('@vercel/blob')
    const blobsToDelete: string[] = []

    if (post.coverImage && post.coverImage.includes('.public.blob.vercel-storage.com')) {
      blobsToDelete.push(post.coverImage)
    }
    if (post.ogImage && post.ogImage.includes('.public.blob.vercel-storage.com')) {
      blobsToDelete.push(post.ogImage)
    }

    if (blobsToDelete.length > 0) {
      await del(blobsToDelete)
    }
  } catch (e) {
    console.error("Failed to delete orphaned blobs during post deletion:", e)
  }

  revalidatePath('/studio', 'layout')
  revalidatePath('/studio/blog')
  revalidatePath('/blog')
  if (post.slug) revalidatePath(`/blog/${post.slug}`)
  revalidatePath('/')

  return { success: true }
}

/**
 * Toggles a post between Draft and Published states.
 * Automatically populates publishedAt when publishing.
 */
export async function togglePublishPost(id: string) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  const post = await prisma.post.findUnique({
    where: { id },
    select: { id: true, slug: true, isPublished: true, publishedAt: true }
  })

  if (!post) {
    throw new Error("Post not found")
  }

  const nextState = !post.isPublished
  const publishedAt = nextState ? (post.publishedAt ?? new Date()) : post.publishedAt

  const updated = await prisma.post.update({
    where: { id },
    data: {
      isPublished: nextState,
      publishedAt,
    }
  })

  revalidatePath('/studio', 'layout')
  revalidatePath('/studio/blog')
  revalidatePath('/blog')
  if (post.slug) revalidatePath(`/blog/${post.slug}`)
  revalidatePath('/')

  return { success: true, isPublished: updated.isPublished, publishedAt: updated.publishedAt }
}

/**
 * Atomically updates ordering across multiple posts.
 */
export async function reorderPosts(orderedIds: string[]) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  if (!Array.isArray(orderedIds)) {
    throw new Error("Invalid input: orderedIds must be an array")
  }

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.post.update({
        where: { id },
        data: { order: index }
      })
    )
  )

  revalidatePath('/studio', 'layout')
  revalidatePath('/studio/blog')
  revalidatePath('/blog')
  revalidatePath('/')

  return { success: true }
}

const categorySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: z.string().trim().regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens").optional(),
  description: z.string().optional(),
})

/**
 * Creates a blog category with unique slug derivation.
 */
export async function createCategory(input: unknown) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  const parsed = categorySchema.parse(input)
  const slug = parsed.slug ? slugify(parsed.slug) : slugify(parsed.name)

  const existing = await prisma.category.findUnique({
    where: { slug },
    select: { id: true }
  })

  if (existing) {
    throw new Error(`Category with slug "${slug}" already exists.`)
  }

  const category = await prisma.category.create({
    data: {
      name: parsed.name,
      slug,
      description: parsed.description ?? null,
    }
  })

  revalidatePath('/studio', 'layout')
  revalidatePath('/blog')

  return { success: true, category }
}

/**
 * Deletes a category (foreign keys on Post set to null automatically).
 */
export async function deleteCategory(id: string) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  await prisma.category.delete({
    where: { id }
  })

  revalidatePath('/studio', 'layout')
  revalidatePath('/blog')

  return { success: true }
}
