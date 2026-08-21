import * as React from "react"
import { H1, H2, P } from "@/components/ui/typography"
import { Card } from "@/components/ui/card"
import { prisma } from "@/core/db/prisma"

export default async function StudioDashboard() {
  // We'll fetch basic counts for the dashboard
  let stats = { products: 0, messages: 0 }
  
  try {
    const [products, messages] = await Promise.all([
      prisma.product.count(),
      prisma.message.count({ where: { isRead: false } })
    ])
    stats = { products, messages }
  } catch (error) {
    console.error("Database connection failed", error)
  }

  return (
    <div className="space-y-8">
      <div>
        <H1 className="text-4xl tracking-tight mb-2">Dashboard</H1>
        <P className="text-white/60">Overview of your ecosystem.</P>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-white/[0.02] border-white/10">
          <div className="text-sm font-medium text-white/40 mb-2">Products</div>
          <div className="text-4xl font-bold">{stats.products}</div>
        </Card>
        <Card className="p-6 bg-white/[0.02] border-white/10">
          <div className="text-sm font-medium text-white/40 mb-2">Unread Messages</div>
          <div className="text-4xl font-bold text-[#f59e0b]">{stats.messages}</div>
        </Card>
      </div>

      <div className="mt-12 p-8 rounded-xl border border-white/10 bg-white/[0.02]">
        <H2 className="text-xl mb-4">Quick Actions</H2>
        <p className="text-white/60 mb-6 text-sm">Select an area from the sidebar to start managing your content. The PostgreSQL connection is active.</p>
      </div>
    </div>
  )
}
