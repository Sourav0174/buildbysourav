import * as React from "react"
import { notFound } from "next/navigation"
import { prisma } from "@/core/db/prisma"
import { getPostByIdForStudio, getCategories } from "@/core/data/blog"
import { BlogPostEditor, PostEditorData } from "@/components/studio/post-editor"

export const dynamic = "force-dynamic"

export default async function EditPostPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const [rawPost, categories, products, services] = await Promise.all([
    getPostByIdForStudio(params.id),
    getCategories(),
    prisma.product.findMany({
      select: { slug: true, title: true },
      orderBy: { order: "asc" },
    }),
    prisma.service.findMany({
      select: { id: true, title: true },
      orderBy: { order: "asc" },
    }),
  ])

  if (!rawPost) {
    notFound()
  }

  const post: PostEditorData = {
    id: rawPost.id,
    title: rawPost.title,
    slug: rawPost.slug,
    excerpt: rawPost.excerpt,
    content: rawPost.content,
    coverImage: rawPost.coverImage,
    categoryId: rawPost.categoryId,
    tags: rawPost.tags,
    authorName: rawPost.authorName,
    authorRole: rawPost.authorRole,
    authorAvatar: rawPost.authorAvatar,
    isPublished: rawPost.isPublished,
    isFeatured: rawPost.isFeatured,
    publishedAt: rawPost.publishedAt ? rawPost.publishedAt.toISOString() : null,
    readingTime: rawPost.readingTime,
    order: rawPost.order,
    seoTitle: rawPost.seoTitle,
    seoDescription: rawPost.seoDescription,
    ogImage: rawPost.ogImage,
    canonicalUrl: rawPost.canonicalUrl,
    allowAds: rawPost.allowAds,
    relatedProduct: rawPost.relatedProduct,
    relatedService: rawPost.relatedService,
  }

  return (
    <div>
      <BlogPostEditor
        initialPost={post}
        categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
        products={products}
        services={services}
      />
    </div>
  )
}
