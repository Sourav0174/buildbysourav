import * as React from "react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { verifySession } from "@/core/auth/session"
import { getPostByIdForStudio } from "@/core/data/blog"
import { prisma } from "@/core/db/prisma"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { H1, P } from "@/components/ui/typography"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MdxRenderer } from "@/components/blog/mdx-content"
import {
  ArrowLeft,
  Pencil,
  Eye,
  Clock,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Sparkles,
  Layers,
} from "lucide-react"

export const dynamic = "force-dynamic"

export default async function StudioPostPreviewPage(props: {
  params: Promise<{ id: string }>
}) {
  // Enforce session check: Drafts must remain 100% private to authenticated admins!
  const session = await verifySession()
  if (!session?.isAuth) {
    redirect("/studio/login")
  }

  const params = await props.params
  const post = await getPostByIdForStudio(params.id)

  if (!post) {
    notFound()
  }

  // Fetch related product or service for full fidelity preview
  const [relatedProduct, relatedService] = await Promise.all([
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
  ])

  const formattedDate = post.publishedAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date(post.publishedAt))
    : "Unpublished Draft"

  return (
    <div className="-m-8 md:-m-12 min-h-screen bg-[#050505] text-white">
      {/* Studio Preview Top Bar */}
      <div className="sticky top-0 z-50 bg-[#0c0c0c]/90 backdrop-blur-md border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/50 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
            <Eye className="h-3.5 w-3.5 text-amber-400" />
            Studio Preview Mode
          </div>

          {post.isPublished ? (
            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Published Article
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-amber-500/10 text-amber-300 border-amber-500/20 text-xs gap-1">
              <Clock className="h-3 w-3" />
              Private Draft (Hidden from Public)
            </Badge>
          )}

          {post.isFeatured && (
            <Badge className="bg-white text-black text-xs font-medium">Featured</Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/studio/blog/${post.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 border-white/10 text-white/80 hover:text-white gap-1.5"
            >
              <Pencil className="h-3 w-3" />
              Edit Article
            </Button>
          </Link>
          <Link href="/studio/blog">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 text-white/50 hover:text-white"
            >
              Close Preview
            </Button>
          </Link>
        </div>
      </div>

      {/* Article Presentation */}
      <main className="pt-12 pb-24">
        <Section className="relative z-10 mb-12">
          <Container>
            <div className="max-w-3xl mx-auto">
              <Link
                href={`/studio/blog/${post.id}`}
                className="inline-flex items-center gap-2 text-xs font-medium text-white/40 hover:text-white transition-colors mb-10"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Return to Editor
              </Link>

              {/* Cover Image */}
              {post.coverImage && (
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 mb-12 bg-black/40 shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}

              {/* Header & Meta */}
              <header className="mb-12 space-y-6">
                <div className="flex flex-wrap items-center gap-3 text-xs text-white/50">
                  {post.category && (
                    <Badge variant="outline" className="bg-white/5 border-white/10 text-white/80">
                      {post.category.name}
                    </Badge>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formattedDate}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readingTime}
                  </span>
                </div>

                <H1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight text-white/95 font-bold">
                  {post.title}
                </H1>

                {post.excerpt && (
                  <P className="text-xl md:text-2xl text-white/50 leading-relaxed font-light">
                    {post.excerpt}
                  </P>
                )}

                {/* Author Bar */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.authorAvatar || "/profile2.png"}
                    alt={post.authorName}
                    className="h-10 w-10 rounded-full border border-white/10 object-cover bg-white/5"
                  />
                  <div>
                    <div className="text-sm font-medium text-white">{post.authorName}</div>
                    <div className="text-xs text-white/40">{post.authorRole}</div>
                  </div>
                </div>
              </header>

              {/* Divider */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12" />

              {/* Rendered MDX Article Content */}
              <article className="prose prose-invert max-w-none">
                <MdxRenderer content={post.content} />
              </article>

              {/* Tags Section */}
              {post.tags.length > 0 && (
                <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-white/40 mr-2 uppercase tracking-wider">
                    Topics:
                  </span>
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono text-white/70 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Related Product Conversion Card */}
              {relatedProduct && (
                <div className="mt-12 p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.03] transition-colors space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      Featured Ecosystem Product
                    </span>
                    <Link
                      href={`/products/${relatedProduct.slug}`}
                      className="text-xs text-white/60 hover:text-white flex items-center gap-1"
                    >
                      View Architecture <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                  <h3 className="text-xl font-bold text-white">{relatedProduct.title}</h3>
                  <p className="text-sm text-white/60">{relatedProduct.tagline}</p>
                </div>
              )}

              {/* Related Service Conversion Card */}
              {relatedService && (
                <div className="mt-8 p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5" />
                    Consulting & Development Service
                  </span>
                  <h3 className="text-xl font-bold text-white">{relatedService.title}</h3>
                  <p className="text-sm text-white/60">{relatedService.description}</p>
                </div>
              )}
            </div>
          </Container>
        </Section>
      </main>
    </div>
  )
}
