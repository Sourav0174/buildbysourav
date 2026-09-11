import { prisma } from '@/core/db/prisma'

export type BlogPostListItem = {
  id: string
  slug: string
  title: string
  excerpt: string
  coverImage: string | null
  authorName: string
  authorRole: string
  authorAvatar: string
  publishedAt: Date | null
  readingTime: string
  order: number
  isFeatured: boolean
  tags: string[]
  allowAds: boolean
  relatedProduct: string | null
  relatedService: string | null
  updatedAt?: Date
  category: {
    id: string
    name: string
    slug: string
  } | null
}

/**
 * Normalizes JSON tags field into a string array.
 */
export function normalizeTags(tags: unknown): string[] {
  if (Array.isArray(tags)) {
    return tags.map(t => String(t))
  }
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags)
      return Array.isArray(parsed) ? parsed.map(t => String(t)) : []
    } catch {
      return []
    }
  }
  return []
}

/**
 * Fetches all published blog posts for public viewing.
 * Strictly enforces `isPublished = true` and `publishedAt <= now`.
 * Never exposes drafts.
 */
export async function getPublishedPosts(options?: {
  categorySlug?: string
  limit?: number
  offset?: number
}) {
  const { categorySlug, limit, offset } = options || {}
  const now = new Date()

  const posts = await prisma.post.findMany({
    where: {
      isPublished: true,
      publishedAt: {
        not: null,
        lte: now,
      },
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      coverImage: true,
      authorName: true,
      authorRole: true,
      authorAvatar: true,
      publishedAt: true,
      readingTime: true,
      order: true,
      isFeatured: true,
      tags: true,
      allowAds: true,
      relatedProduct: true,
      relatedService: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: [
      { order: 'asc' },
      { publishedAt: 'desc' },
    ],
    take: limit,
    skip: offset,
  })

  return posts.map(p => ({
    ...p,
    tags: normalizeTags(p.tags),
  }))
}

/**
 * Fetches featured, published posts for the homepage or highlights.
 * Enforces `isPublished = true` and `isFeatured = true`.
 */
export async function getFeaturedPosts(limit = 3) {
  const now = new Date()

  const posts = await prisma.post.findMany({
    where: {
      isPublished: true,
      isFeatured: true,
      publishedAt: {
        not: null,
        lte: now,
      },
    },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      coverImage: true,
      authorName: true,
      authorRole: true,
      authorAvatar: true,
      publishedAt: true,
      readingTime: true,
      order: true,
      isFeatured: true,
      tags: true,
      allowAds: true,
      relatedProduct: true,
      relatedService: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: [
      { order: 'asc' },
      { publishedAt: 'desc' },
    ],
    take: limit,
  })

  return posts.map(p => ({
    ...p,
    tags: normalizeTags(p.tags),
  }))
}

/**
 * Fetches curated blog posts for the homepage.
 * Strictly enforces `isPublished = true` and `publishedAt <= now`.
 * Prioritizes `isFeatured = true` posts, filling with recent published posts up to `limit`.
 * Excludes drafts and never duplicates.
 */
export async function getHomepageBlogPosts(limit = 3) {
  const featured = await getFeaturedPosts(limit)
  if (featured.length >= limit) {
    return featured
  }

  const remaining = limit - featured.length
  const featuredIds = featured.map(p => p.id)
  const now = new Date()

  const recent = await prisma.post.findMany({
    where: {
      isPublished: true,
      publishedAt: {
        not: null,
        lte: now,
      },
      id: { notIn: featuredIds },
    },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      coverImage: true,
      authorName: true,
      authorRole: true,
      authorAvatar: true,
      publishedAt: true,
      readingTime: true,
      order: true,
      isFeatured: true,
      tags: true,
      allowAds: true,
      relatedProduct: true,
      relatedService: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: [
      { order: 'asc' },
      { publishedAt: 'desc' },
    ],
    take: remaining,
  })

  return [...featured, ...recent.map(p => ({ ...p, tags: normalizeTags(p.tags) }))]
}

/**
 * Fetches a single published post by slug for public article pages.
 * Strictly guarantees drafts cannot be accessed publicly.
 */
export async function getPostBySlug(slug: string) {
  const now = new Date()

  const post = await prisma.post.findFirst({
    where: {
      slug,
      isPublished: true,
      publishedAt: {
        not: null,
        lte: now,
      },
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
        },
      },
    },
  })

  if (!post) return null

  return {
    ...post,
    tags: normalizeTags(post.tags),
  }
}

/**
 * Fetches any post by ID for authenticated Studio CMS editing.
 * Returns drafts as well as published posts.
 */
export async function getPostByIdForStudio(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  })

  if (!post) return null

  return {
    ...post,
    tags: normalizeTags(post.tags),
  }
}

/**
 * Fetches all posts (drafts and published) for the Studio CMS table.
 */
export async function getAllPostsForStudio() {
  const posts = await prisma.post.findMany({
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: [
      { order: 'asc' },
      { createdAt: 'desc' },
    ],
  })

  return posts.map(p => ({
    ...p,
    tags: normalizeTags(p.tags),
  }))
}

/**
 * Fetches related published posts for an article.
 * Prioritizes:
 * 1. Same category
 * 2. Shared tags
 * 3. Recent published posts fallback
 * Strictly isolates drafts (isPublished = true, publishedAt <= now) and excludes current post.
 */
export async function getRelatedPosts(options: {
  currentPostId: string
  categoryId?: string | null
  tags?: string[]
  limit?: number
}) {
  const { currentPostId, categoryId, tags = [], limit = 3 } = options
  const now = new Date()

  // Base visibility filter: strictly published posts excluding current post
  const baseWhere = {
    id: { not: currentPostId },
    isPublished: true,
    publishedAt: {
      not: null,
      lte: now,
    },
  }

  const selectFields = {
    id: true,
    slug: true,
    title: true,
    excerpt: true,
    coverImage: true,
    authorName: true,
    authorRole: true,
    authorAvatar: true,
    publishedAt: true,
    readingTime: true,
    order: true,
    isFeatured: true,
    tags: true,
    allowAds: true,
    relatedProduct: true,
    relatedService: true,
    category: {
      select: {
        id: true,
        name: true,
        slug: true,
      },
    },
  }

  // 1. Fetch candidates from same category if categoryId is available
  const sameCategoryPosts = categoryId
    ? await prisma.post.findMany({
        where: {
          ...baseWhere,
          categoryId,
        },
        select: selectFields,
        orderBy: [
          { order: 'asc' },
          { publishedAt: 'desc' },
        ],
        take: limit,
      })
    : []

  const collected = new Map<string, typeof sameCategoryPosts[0]>()
  for (const post of sameCategoryPosts) {
    collected.set(post.id, post)
  }

  // 2. If we still need more posts and have tags, search other posts
  if (collected.size < limit && tags.length > 0) {
    const candidates = await prisma.post.findMany({
      where: {
        ...baseWhere,
        id: { notIn: [currentPostId, ...Array.from(collected.keys())] },
      },
      select: selectFields,
      orderBy: [
        { publishedAt: 'desc' },
      ],
      take: 10,
    })

    // Score candidates by number of shared tags
    const normalizedTargetTags = new Set(tags.map(t => t.toLowerCase().trim()))
    const scored = candidates.map(post => {
      const postTags = normalizeTags(post.tags).map(t => t.toLowerCase().trim())
      const overlap = postTags.filter(t => normalizedTargetTags.has(t)).length
      return { post, overlap }
    })

    // Sort by tag overlap descending
    scored.sort((a, b) => b.overlap - a.overlap)

    for (const { post, overlap } of scored) {
      if (overlap > 0 && collected.size < limit) {
        collected.set(post.id, post)
      }
    }
  }

  // 3. If we still need more posts, fill with recent published posts
  if (collected.size < limit) {
    const needed = limit - collected.size
    const recentPosts = await prisma.post.findMany({
      where: {
        ...baseWhere,
        id: { notIn: [currentPostId, ...Array.from(collected.keys())] },
      },
      select: selectFields,
      orderBy: [
        { publishedAt: 'desc' },
      ],
      take: needed,
    })

    for (const post of recentPosts) {
      collected.set(post.id, post)
    }
  }

  return Array.from(collected.values()).map(p => ({
    ...p,
    tags: normalizeTags(p.tags),
  }))
}

/**
 * Fetches all categories with published post counts.
 */
export async function getCategories() {
  const now = new Date()

  return prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: {
          posts: {
            where: {
              isPublished: true,
              publishedAt: {
                not: null,
                lte: now,
              },
            },
          },
        },
      },
    },
  })
}

