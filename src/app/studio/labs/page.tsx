import * as React from "react"
import Link from "next/link"
import { prisma } from "@/core/db/prisma"
import { H1, P } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, ExternalLink } from "lucide-react"
import { createLab } from "@/core/actions/labs"

export default async function StudioLabsPage() {
  const labs = await prisma.lab.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <H1 className="text-4xl tracking-tight mb-2">Labs</H1>
          <P className="text-white/60">Manage your experiments and small projects.</P>
        </div>
        <form action={createLab}>
          <Button type="submit" className="gap-2 bg-white text-black hover:bg-white/90">
            <Plus className="h-4 w-4" />
            New Lab
          </Button>
        </form>
      </div>

      <div className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/[0.02]">
            <tr>
              <th className="px-6 py-4 font-medium text-white/60">Title</th>
              <th className="px-6 py-4 font-medium text-white/60">Category</th>
              <th className="px-6 py-4 font-medium text-white/60 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {labs.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-white/40">
                  No labs found. Create one to get started.
                </td>
              </tr>
            )}
            {labs.map(lab => (
              <tr key={lab.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{lab.title || "Untitled Lab"}</div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="outline" className="bg-white/5">{lab.category}</Badge>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link href={`/studio/labs/${lab.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  {lab.url && (
                    <a href={lab.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
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
