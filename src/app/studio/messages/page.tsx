import * as React from "react"
import Link from "next/link"
import { prisma } from "@/core/db/prisma"
import { H1, P } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, MailOpen } from "lucide-react"
import { cn } from "@/core/utils/cn"

export default async function StudioMessagesPage() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <H1 className="text-4xl tracking-tight mb-2">Messages</H1>
          <P className="text-white/60">Manage your contact submissions.</P>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/[0.02]">
            <tr>
              <th className="px-6 py-4 font-medium text-white/60 w-12"></th>
              <th className="px-6 py-4 font-medium text-white/60">Sender</th>
              <th className="px-6 py-4 font-medium text-white/60">Message</th>
              <th className="px-6 py-4 font-medium text-white/60 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {messages.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-white/40">
                  <div className="flex flex-col items-center justify-center">
                    <MailOpen className="h-8 w-8 mb-3 opacity-20" />
                    <p>Your inbox is empty.</p>
                  </div>
                </td>
              </tr>
            )}
            {messages.map(msg => (
              <tr 
                key={msg.id} 
                className={cn(
                  "hover:bg-white/[0.04] transition-colors group relative cursor-pointer",
                  msg.isRead ? "bg-transparent opacity-70" : "bg-white/[0.02]"
                )}
              >
                <td className="px-6 py-4">
                  <Link href={`/studio/messages/${msg.id}`} className="absolute inset-0 z-10">
                    <span className="sr-only">View message</span>
                  </Link>
                  {msg.isRead ? (
                    <MailOpen className="h-4 w-4 text-white/30" />
                  ) : (
                    <div className="relative">
                      <Mail className="h-4 w-4 text-white" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500" />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className={cn("text-white", !msg.isRead && "font-bold")}>{msg.name || "Unknown"}</div>
                  <div className="text-white/40">{msg.email}</div>
                </td>
                <td className="px-6 py-4 max-w-md">
                  <div className={cn("truncate text-white/70", !msg.isRead && "text-white font-medium")}>
                    {msg.content}
                  </div>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-4">
                    <span className="text-white/40">
                      {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(msg.createdAt)}
                    </span>
                    <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-white/60 transition-colors" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
