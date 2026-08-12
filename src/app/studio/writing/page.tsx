import * as React from "react"
import Link from "next/link"
import { prisma } from "@/core/db/prisma"
import { H1, P } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, ExternalLink } from "lucide-react"
import { createPost } from "@/core/actions/posts"

export default async function StudioWritingPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <H1 className="text-4xl tracking-tight mb-2">Writing</H1>
          <P className="text-white/60">Manage your posts and articles.</P>
        </div>
        <form action={createPost}>
          <Button type="submit" className="gap-2 bg-white text-black hover:bg-white/90">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </form>
      </div>

      <div className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/[0.02]">
            <tr>
              <th className="px-6 py-4 font-medium text-white/60">Title</th>
              <th className="px-6 py-4 font-medium text-white/60">Status</th>
              <th className="px-6 py-4 font-medium text-white/60 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {posts.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-white/40">
                  No posts found. Create one to get started.
                </td>
              </tr>
            )}
            {posts.map(post => (
              <tr key={post.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{post.title || "Untitled Post"}</div>
                  <div className="text-white/40">{post.slug}</div>
                </td>
                <td className="px-6 py-4">
                  {post.isPublished ? (
                    <Badge variant="default" className="bg-white text-black">Published</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-white/5 text-white/60 border-white/10">Draft</Badge>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link href={`/studio/writing/${post.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  {post.isPublished && (
                    <Link href={`/writing/${post.slug}`} target="_blank">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
