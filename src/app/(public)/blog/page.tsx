import * as React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { H1, P } from "@/components/ui/typography"
import { BlogCard } from "@/components/blog/blog-card"
import { EmptyBlogState } from "@/components/blog/empty-blog-state"
import { RefinedTerminalCTA } from "@/components/layout/refined-terminal-cta"
import { getPublishedPosts, getCategories } from "@/core/data/blog"
import { SITE_URL } from "@/core/utils/blog"
import { Terminal } from "lucide-react"
import { Spotlight } from "@/components/ui/spotlight"
import { FadeIn } from "@/components/ui/fade-in"

export const revalidate = 60 // ISR: Revalidate cache every 60 seconds

export const metadata: Metadata = {
  title: "Blog | Engineering Notes & Systems Architecture",
  description:
    "Engineering teardowns, systems architecture, full-stack performance, and product building insights by Sourav.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Blog | Engineering Notes & Systems Architecture",
    description:
      "Engineering teardowns, systems architecture, full-stack performance, and product building insights by Sourav.",
    url: `${SITE_URL}/blog`,
    siteName: "The Workspace",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Engineering Notes & Systems Architecture",
    description:
      "Engineering teardowns, systems architecture, full-stack performance, and product building insights by Sourav.",
  },
}

import { notFound } from "next/navigation"
import { prisma } from "@/core/db/prisma"

export default async function BlogIndexPage(props: {
  searchParams?: Promise<{ category?: string }>
}) {
  const settings = await prisma.settings.findFirst()
  if (settings && settings.blogEnabled === false) {
    notFound()
  }

  const searchParams = props.searchParams ? await props.searchParams : undefined
  const selectedCategorySlug = searchParams?.category

  const [posts, categories] = await Promise.all([
    getPublishedPosts({ categorySlug: selectedCategorySlug }),
    getCategories(),
  ])

  const totalPublishedPosts = categories.reduce((sum, c) => sum + c._count.posts, 0)
  const activeCategory = categories.find((c) => c.slug === selectedCategorySlug)

  // On the root "All" view with multiple posts, feature the first post
  const isAllView = !selectedCategorySlug
  const featuredPost = isAllView && posts.length > 0 ? posts[0] : null
  const regularPosts = featuredPost ? posts.slice(1) : posts

  return (
    <main className="min-h-screen relative pt-16 pb-24 overflow-hidden selection:bg-white/20">
      <Spotlight />
      {/* Background Ambient Glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] pointer-events-none opacity-50"
        style={{ background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.15) 0%, transparent 70%)' }}
      />

      {/* Blog Hero Header */}
      <Section className="relative z-10">
        <Container>
          <FadeIn className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70 backdrop-blur-sm mb-6">
              <Terminal className="h-3.5 w-3.5 text-white/50" />
              <span>Engineering Notes & Systems Thinking</span>
            </div>

            <H1 className="text-5xl md:text-6xl tracking-tight mb-6">
              Writing on software, scale & design.
            </H1>

            <P className="text-lg text-white/70 leading-relaxed font-light">
              Deep dives into full-stack architecture, distributed systems, resilient product design,
              and hard lessons learned from building software in production.
            </P>
          </FadeIn>

          {/* Category Navigation Pills */}
          <nav aria-label="Blog categories" className="mb-16">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              <Link
                href="/blog"
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-all whitespace-nowrap border ${
                  isAllView
                    ? "bg-white text-black border-white shadow-lg"
                    : "bg-white/[0.02] text-white/60 border-white/10 hover:border-white/20 hover:text-white"
                }`}
              >
                <span>All Articles</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isAllView ? "bg-black/10 text-black font-semibold" : "bg-white/10 text-white/50"
                  }`}
                >
                  {totalPublishedPosts}
                </span>
              </Link>

              {categories.map((category) => {
                const isActive = selectedCategorySlug === category.slug
                return (
                  <Link
                    key={category.id}
                    href={`/blog?category=${category.slug}`}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-all whitespace-nowrap border ${
                      isActive
                        ? "bg-white text-black border-white shadow-lg"
                        : "bg-white/[0.02] text-white/60 border-white/10 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <span>{category.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive ? "bg-black/10 text-black font-semibold" : "bg-white/10 text-white/50"
                      }`}
                    >
                      {category._count.posts}
                    </span>
                  </Link>
                )
              })}
            </div>
          </nav>

          {posts.length === 0 ? (
            /* Empty State */
            <EmptyBlogState activeCategoryName={activeCategory?.name} />
          ) : (
            <div className="space-y-10">
              {/* Featured Post Hero Card (Only on root All view) */}
              {featuredPost && (
                <div className="mb-10">
                  <BlogCard post={featuredPost} featured={true} />
                </div>
              )}

              {/* Grid of Articles */}
              {regularPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>
          )}
        </Container>
      </Section>

      {/* CTA */}
      <RefinedTerminalCTA />
    </main>
  )
}
