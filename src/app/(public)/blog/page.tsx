import * as React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { H1, P } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { BlogCard } from "@/components/blog/blog-card"
import { RefinedTerminalCTA } from "@/components/layout/refined-terminal-cta"
import { getPublishedPosts, getCategories } from "@/core/data/blog"
import { SITE_URL } from "@/core/utils/blog"
import { BookOpen, Sparkles } from "lucide-react"

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

export default async function BlogIndexPage(props: {
  searchParams?: Promise<{ category?: string }>
}) {
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
    <main className="min-h-screen pt-32 selection:bg-white/20">
      {/* Blog Hero Header */}
      <header className="relative mb-12 sm:mb-16">
        <Container>
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-white/50" />
              <span>Engineering Notes & Systems Thinking</span>
            </div>

            <H1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-white/95 font-extrabold leading-tight">
              Writing on software, scale & design.
            </H1>

            <P className="text-lg md:text-xl text-white/60 leading-relaxed font-light">
              Deep dives into full-stack architecture, distributed systems, resilient product design,
              and hard lessons learned from building software in production.
            </P>
          </div>

          {/* Category Navigation Pills */}
          <nav aria-label="Blog categories" className="mt-10 sm:mt-12">
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
        </Container>
      </header>

      {/* Main Articles Listing */}
      <Section className="py-8 sm:py-12 relative z-10">
        <Container>
          {posts.length === 0 ? (
            /* Empty State */
            <div className="py-20 text-center rounded-3xl border border-white/10 bg-white/[0.01] p-8 max-w-xl mx-auto space-y-4">
              <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 mx-auto flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white/40" />
              </div>
              <h2 className="text-xl font-semibold text-white/90">
                {activeCategory ? `No articles in ${activeCategory.name}` : "No articles published yet"}
              </h2>
              <p className="text-sm text-white/50 leading-relaxed">
                {activeCategory
                  ? "We haven't published an article under this category yet. Check out other topics or view all articles."
                  : "We are actively drafting high-signal engineering notes. Check back soon."}
              </p>
              {activeCategory && (
                <div className="pt-2">
                  <Link href="/blog">
                    <Button variant="outline" size="sm" className="border-white/10 text-white/80 hover:text-white">
                      View All Articles
                    </Button>
                  </Link>
                </div>
              )}
            </div>
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
