import * as React from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/core/db/prisma"
import { PostEditor } from "@/components/studio/post-editor"

export default async function StudioPostEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await prisma.post.findUnique({
    where: { id }
  })

  if (!post) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <Link 
        href="/studio/writing"
        className="inline-flex items-center gap-2 text-sm font-medium text-white/40 hover:text-white transition-colors mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Writing
      </Link>
      
      <PostEditor initialData={post} />
    </div>
  )
}
