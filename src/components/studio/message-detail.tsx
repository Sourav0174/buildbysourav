'use client'

import * as React from "react"
import { Trash2, Mail, MailOpen, User, Clock, Loader2, AlertCircle } from "lucide-react"
import { H1, H3, P } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { deleteMessage, toggleMessageReadStatus } from "@/core/actions/messages"
import { cn } from "@/core/utils/cn"

export function MessageDetail({ message }: { message: any }) {
  const [isRead, setIsRead] = React.useState(message.isRead)
  const [isToggling, setIsToggling] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState("")

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this message? This cannot be undone.")) {
      setIsDeleting(true)
      try {
        await deleteMessage(message.id)
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to delete message")
        setIsDeleting(false)
      }
    }
  }

  const handleToggleRead = async () => {
    setIsToggling(true)
    setErrorMsg("")
    try {
      await toggleMessageReadStatus(message.id, !isRead)
      setIsRead(!isRead)
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update status")
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-32">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 flex items-center justify-between py-4 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 mb-8">
        <div className="flex items-center gap-3">
          <H1 className="text-2xl">Message</H1>
          {isRead ? (
            <span className="px-2 py-1 text-xs font-medium bg-white/5 text-white/40 rounded border border-white/10 flex items-center gap-1">
              <MailOpen className="h-3 w-3" /> Read
            </span>
          ) : (
            <span className="px-2 py-1 text-xs font-medium bg-blue-500/10 text-blue-400 rounded border border-blue-500/20 flex items-center gap-1">
              <Mail className="h-3 w-3" /> Unread
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            onClick={handleToggleRead} 
            disabled={isToggling}
            className="text-white/60 hover:text-white gap-2"
          >
            {isToggling ? <Loader2 className="h-4 w-4 animate-spin" /> : (isRead ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />)}
            {isRead ? "Mark Unread" : "Mark Read"}
          </Button>

          <Button 
            variant="ghost" 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="text-red-400 hover:text-red-300 hover:bg-red-400/10 gap-2"
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Delete
          </Button>
        </div>
      </div>
      
      {errorMsg && (
        <div className="mb-8 flex items-center gap-2 text-sm text-red-500/80 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Message Metadata */}
      <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 md:p-8 mb-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-white/40" />
            </div>
            <div>
              <div className="text-sm font-medium text-white/40 uppercase tracking-wider mb-1">Sender Name</div>
              <div className="text-lg font-medium">{message.name || "Unknown"}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
              <Mail className="h-5 w-5 text-white/40" />
            </div>
            <div>
              <div className="text-sm font-medium text-white/40 uppercase tracking-wider mb-1">Email Address</div>
              <div className="text-lg font-medium">{message.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
              <Clock className="h-5 w-5 text-white/40" />
            </div>
            <div>
              <div className="text-sm font-medium text-white/40 uppercase tracking-wider mb-1">Received At</div>
              <div className="text-lg font-medium">
                {new Intl.DateTimeFormat("en-US", { 
                  dateStyle: "long", 
                  timeStyle: "short" 
                }).format(new Date(message.createdAt))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Content */}
      <div>
        <H3 className="text-lg font-medium mb-4 flex items-center gap-2">
          Message Content
        </H3>
        <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 md:p-8 min-h-[300px]">
          <P className="whitespace-pre-wrap text-white/80 leading-relaxed font-mono text-sm">
            {message.content}
          </P>
        </div>
      </div>
    </div>
  )
}
