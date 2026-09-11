import * as React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { H1, P } from "@/components/ui/typography"
import { Badge } from "@/components/ui/badge"
import { BlogCard } from "@/components/blog/blog-card"
import { BlogAdSlot } from "@/components/blog/blog-ad-slot"
import { MdxRenderer } from "@/components/blog/mdx-content"
import { RefinedTerminalCTA } from "@/components/layout/refined-terminal-cta"
import { getPostBySlug, getRelatedPosts } from "@/core/data/blog"
import { prisma } from "@/core/db/prisma"
import { SITE_URL } from "@/core/utils/blog"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Sparkles,
  Layers,
  ExternalLink,
} from "lucide-react"

export const revalidate = 60 // ISR: Revalidate cache every 60 seconds

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: {
      isPublished: true,
      publishedAt: {
        not: null,
        lte: new Date(),
      },
    },
    select: { slug: true },
  })

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const params = await props.params
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Article Not Found | The Workspace",
      description: "The requested article does not exist or has not been published yet.",
    }
  }

  const title = post.seoTitle || `${post.title} | The Workspace`
  const description = post.seoDescription || post.excerpt || "Engineering notes and systems architecture insights."
  const canonicalUrl = post.canonicalUrl || `${SITE_URL}/blog/${post.slug}`
  const ogImageUrl = post.ogImage || post.coverImage || null

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "The Workspace",
      type: "article",
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      modifiedTime: new Date(post.updatedAt).toISOString(),
      authors: [post.authorName],
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  }
}

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const post = await getPostBySlug(params.slug)

  // Strict draft isolation: drafts and missing articles return notFound (404)
  if (!post) {
    notFound()
  }

  // Fetch conversion cards and related articles in parallel
  const [relatedProduct, relatedService, relatedPosts] = await Promise.all([
    post.relatedProduct
      ? prisma.product.findUnique({
          where: { slug: post.relatedProduct },
          select: { title: true, tagline: true, slug: true, color: true },
        })
      : null,
    post.relatedService
      ? prisma.service.findFirst({
          where: {
            OR: [{ id: post.relatedService }, { title: post.relatedService }],
          },
          select: { title: true, description: true, who: true },
        })
      : null,
    getRelatedPosts({
      currentPostId: post.id,
      categoryId: post.categoryId,
      tags: post.tags,
      limit: 3,
    }),
  ])

  const formattedDate = post.publishedAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date(post.publishedAt))
    : null

  const canonicalUrl = post.canonicalUrl || `${SITE_URL}/blog/${post.slug}`

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage || post.ogImage || undefined,
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    dateModified: new Date(post.updatedAt).toISOString(),
    author: {
      "@type": "Person",
      name: post.authorName,
      jobTitle: post.authorRole,
    },
    publisher: {
      "@type": "Organization",
      name: "The Workspace",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  }

  return (
    <main className="min-h-screen pt-32 selection:bg-white/20">
      {/* Safe JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Back Navigation */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-medium text-white/50 hover:text-white transition-colors mb-10 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Back to all articles</span>
            </Link>

            {/* Header & Meta */}
            <header className="space-y-6 mb-12">
              <div className="flex flex-wrap items-center gap-3 text-xs text-white/50">
                {post.category && (
                  <Link href={`/blog?category=${post.category.slug}`}>
                    <Badge
                      variant="outline"
                      className="bg-white/5 border-white/10 text-white/80 hover:bg-white/10 transition-colors"
                    >
                      {post.category.name}
                    </Badge>
                  </Link>
                )}
                {formattedDate && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-white/40" />
                    <time dateTime={post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined}>
                      {formattedDate}
                    </time>
                  </span>
                )}
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-white/40" />
                  <span>{post.readingTime}</span>
                </span>
              </div>

              <H1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight text-white/95 font-extrabold">
                {post.title}
              </H1>

              {post.excerpt && (
                <P className="text-xl md:text-2xl text-white/60 leading-relaxed font-light">
                  {post.excerpt}
                </P>
              )}

              {/* Author Attribution */}
              <div className="flex items-center gap-3.5 pt-6 border-t border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.authorAvatar || "/profile2.png"}
                  alt={post.authorName}
                  className="h-11 w-11 rounded-full border border-white/10 object-cover bg-white/5"
                />
                <div>
                  <div className="text-sm font-medium text-white">{post.authorName}</div>
                  <div className="text-xs text-white/40">{post.authorRole}</div>
                </div>
              </div>
            </header>

            {/* Cover Image */}
            {post.coverImage && (
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 mb-14 bg-black/40 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}

            {/* Top Ad Slot (Placement 1: After Cover / Intro) */}
            <BlogAdSlot allowAds={post.allowAds} slot="top" />

            {/* Article Body via MDX Remote */}
            <div className="prose prose-invert max-w-none">
              <MdxRenderer content={post.content} />
            </div>

            {/* Bottom Ad Slot (Placement 2: Lower article body before tags / conversion cards) */}
            <BlogAdSlot allowAds={post.allowAds} slot="bottom" />

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-white/40 mr-2 uppercase tracking-wider">
                  Topics:
                </span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono text-white/70 bg-white/5 border border-white/10 px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Related Product Conversion Card */}
            {relatedProduct && (
              <section
                aria-label="Related Product"
                className="mt-14 p-6 sm:p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/[0.04] to-transparent hover:border-emerald-500/30 transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    Featured Architecture Product
                  </span>
                  <Link
                    href={`/products/${relatedProduct.slug}`}
                    className="text-xs text-white/70 hover:text-white flex items-center gap-1 group font-medium"
                  >
                    <span>View Product Details</span>
                    <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
                <h3 className="text-xl font-bold text-white">{relatedProduct.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{relatedProduct.tagline}</p>
                <div>
                  <Link href={`/products/${relatedProduct.slug}`}>
                    <span className="inline-flex items-center text-xs font-semibold text-emerald-400 hover:text-emerald-300">
                      Explore Technical Architecture &rarr;
                    </span>
                  </Link>
                </div>
              </section>
            )}

            {/* Related Service Conversion Card */}
            {relatedService && (
              <section
                aria-label="Related Consulting Service"
                className="mt-8 p-6 sm:p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/[0.04] to-transparent hover:border-blue-500/30 transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5" />
                    Consulting & Engineering
                  </span>
                  <Link
                    href="/build"
                    className="text-xs text-white/70 hover:text-white flex items-center gap-1 group font-medium"
                  >
                    <span>Work With Me</span>
                    <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
                <h3 className="text-xl font-bold text-white">{relatedService.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{relatedService.description}</p>
                <div>
                  <Link href="/build">
                    <span className="inline-flex items-center text-xs font-semibold text-blue-400 hover:text-blue-300">
                      Inquire About This Service &rarr;
                    </span>
                  </Link>
                </div>
              </section>
            )}
          </div>
        </Container>
      </article>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <Section className="py-20 sm:py-28 border-t border-white/10 mt-20 relative z-10">
          <Container>
            <div className="max-w-3xl mx-auto mb-10">
              <span className="text-xs font-mono uppercase tracking-widest text-white/40">Keep Reading</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white/95 mt-1">Related Articles</h2>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <BlogCard key={related.id} post={related} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Terminal CTA */}
      <RefinedTerminalCTA />
    </main>
  )
}
