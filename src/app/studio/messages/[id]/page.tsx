import * as React from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/core/db/prisma"
import { MessageDetail } from "@/components/studio/message-detail"

export default async function StudioMessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const message = await prisma.message.findUnique({
    where: { id }
  })

  if (!message) {
    notFound()
  }

  // Auto-mark as read if we open it and it is currently unread
  if (!message.isRead) {
    await prisma.message.update({
      where: { id },
      data: { isRead: true }
    })
    message.isRead = true
  }

  return (
    <div className="space-y-6">
      <Link 
        href="/studio/messages"
        className="inline-flex items-center gap-2 text-sm font-medium text-white/40 hover:text-white transition-colors mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Inbox
      </Link>
      
      <MessageDetail message={message} />
    </div>
  )
}
