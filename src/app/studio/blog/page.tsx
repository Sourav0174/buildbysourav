import * as React from "react"
import Link from "next/link"
import { H1, P } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { getAllPostsForStudio, getCategories } from "@/core/data/blog"
import { BlogListClient } from "@/components/studio/blog-list"

export const dynamic = "force-dynamic"

export default async function StudioBlogPage() {
  const [posts, categories] = await Promise.all([
    getAllPostsForStudio(),
    getCategories(),
  ])

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <H1 className="text-4xl tracking-tight mb-2">Blog</H1>
          <P className="text-white/60">
            Publish technical deep dives, case studies, and engineering thought leadership.
          </P>
        </div>

        <Link href="/studio/blog/new">
          <Button className="gap-2 bg-white text-black hover:bg-white/90 font-medium">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Main Client CMS Table */}
      <BlogListClient initialPosts={posts} initialCategories={categories} />
    </div>
  )
}
