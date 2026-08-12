import * as React from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/core/db/prisma"
import { LabEditor } from "@/components/studio/lab-editor"

export default async function StudioLabEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lab = await prisma.lab.findUnique({
    where: { id }
  })

  if (!lab) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <Link 
        href="/studio/labs"
        className="inline-flex items-center gap-2 text-sm font-medium text-white/40 hover:text-white transition-colors mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Labs
      </Link>
      
      <LabEditor initialData={lab} />
    </div>
  )
}
