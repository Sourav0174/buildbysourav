import { prisma } from "@/core/db/prisma"
import { WritingClient, PostData } from "./writing-client"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Writing | The Workspace",
  description: "Technical notes, architectural decisions, and essays on software engineering.",
}

export default async function WritingPage() {
  // Fetch published posts server-side
  const dbPosts = await prisma.post.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' }
  })

  // Normalize DB schema to UI expectations
  const posts: PostData[] = dbPosts.map(p => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    publishedAt: p.publishedAt
  }))

  return <WritingClient posts={posts} />
}
