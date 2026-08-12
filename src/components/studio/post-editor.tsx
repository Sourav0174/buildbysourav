'use client'

import * as React from "react"
import { ChevronRight, ChevronDown, Trash2, Save, Loader2, ExternalLink, AlertCircle, Globe, Lock } from "lucide-react"
import { H1, H3 } from "@/components/ui/typography"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { updatePost, deletePost, togglePublishPost } from "@/core/actions/posts"
import { cn } from "@/core/utils/cn"

// --- Helper Components ---
function Section({ title, defaultOpen = false, children }: { title: string, defaultOpen?: boolean, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  
  return (
    <div className="border border-white/5 rounded-xl bg-white/[0.01] overflow-hidden mb-6 transition-all">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-6 py-4 hover:bg-white/[0.02] transition-colors text-left"
      >
        {isOpen ? <ChevronDown className="h-4 w-4 text-white/40" /> : <ChevronRight className="h-4 w-4 text-white/40" />}
        <H3 className="text-lg font-medium">{title}</H3>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pt-2 border-t border-white/5">
          {children}
        </div>
      )}
    </div>
  )
}

// --- Editor Component ---
export function PostEditor({ initialData }: { initialData: any }) {
  const [isSaving, setIsSaving] = React.useState(false)
  const [isPublishing, setIsPublishing] = React.useState(false)
  const [data, setData] = React.useState(initialData)
  const [errorMsg, setErrorMsg] = React.useState("")
  
  // Track if there are unsaved changes
  const isDirty = JSON.stringify({
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content
  }) !== JSON.stringify({
    title: initialData.title,
    slug: initialData.slug,
    excerpt: initialData.excerpt,
    content: initialData.content
  })

  // Unsaved changes browser warning
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  const handleSave = async () => {
    setIsSaving(true)
    setErrorMsg("")
    try {
      await updatePost(data.id, {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
      })
      // Update our local initialData representation so isDirty resets
      initialData.title = data.title
      initialData.slug = data.slug
      initialData.excerpt = data.excerpt
      initialData.content = data.content
      setData({ ...data }) // Force re-render to clear isDirty
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save post")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post? This cannot be undone.")) {
      await deletePost(data.id)
    }
  }

  const handleTogglePublish = async () => {
    if (isDirty) {
      alert("Please save your changes before changing publish status.")
      return
    }
    const action = data.isPublished ? "unpublish" : "publish"
    if (confirm(`Are you sure you want to ${action} this post?`)) {
      setIsPublishing(true)
      try {
        await togglePublishPost(data.id, !data.isPublished)
        setData((prev: any) => ({ ...prev, isPublished: !prev.isPublished }))
        initialData.isPublished = !initialData.isPublished
      } catch (err: any) {
        setErrorMsg(err.message || `Failed to ${action} post`)
      } finally {
        setIsPublishing(false)
      }
    }
  }

  const updateField = (field: string, value: any) => {
    setData((prev: any) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-4xl mx-auto pb-32">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 flex items-center justify-between py-4 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 mb-8">
        <div className="flex items-center gap-3">
          <H1 className="text-2xl">{data.title || "Untitled Post"}</H1>
          {data.isPublished ? (
            <span className="px-2 py-1 text-xs font-medium bg-green-500/10 text-green-400 rounded border border-green-500/20">Published</span>
          ) : (
            <span className="px-2 py-1 text-xs font-medium bg-white/5 text-white/40 rounded border border-white/10">Draft</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            onClick={handleTogglePublish} 
            disabled={isPublishing || isDirty}
            className={cn(
              "gap-2",
              data.isPublished ? "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10" : "text-green-400 hover:text-green-300 hover:bg-green-400/10"
            )}
          >
            {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : (data.isPublished ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />)}
            {data.isPublished ? "Unpublish" : "Publish"}
          </Button>

          {data.isPublished && (
            <Button variant="ghost" onClick={() => window.open(`/writing/${data.slug}`, '_blank')} className="text-white/60 hover:text-white gap-2">
              <ExternalLink className="h-4 w-4" />
              View Live
            </Button>
          )}
          
          <Button variant="ghost" onClick={handleDelete} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
            Delete
          </Button>
          
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !isDirty} 
            className={cn(
              "gap-2 transition-all",
              isDirty ? "bg-white text-black hover:bg-white/90" : "bg-white/10 text-white/50"
            )}
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isDirty ? "Save Changes" : "Saved"}
          </Button>
        </div>
      </div>
      
      {errorMsg && (
        <div className="mb-8 flex items-center gap-2 text-sm text-red-500/80 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      {isDirty && (
        <div className="mb-8 flex items-center gap-2 text-sm text-yellow-500/80 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          You have unsaved changes.
        </div>
      )}

      <div className="space-y-2">
        <Section title="Post Metadata" defaultOpen>
          <div className="space-y-6">
            <div>
              <label className="text-xs font-medium text-white/40 uppercase mb-2 block">Title</label>
              <Input 
                value={data.title} 
                onChange={e => updateField("title", e.target.value)} 
                className="bg-transparent border-white/10 text-xl font-bold h-12"
                placeholder="Post title"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-white/40 uppercase mb-2 block">Slug</label>
              <Input 
                value={data.slug} 
                onChange={e => updateField("slug", e.target.value)} 
                className="bg-transparent border-white/10 font-mono text-sm" 
                placeholder="my-awesome-post"
              />
              <p className="text-xs text-white/40 mt-2">Must be unique, lowercase letters, numbers, and hyphens only.</p>
            </div>

            <div>
              <label className="text-xs font-medium text-white/40 uppercase mb-2 block">Excerpt</label>
              <Textarea 
                value={data.excerpt} 
                onChange={e => updateField("excerpt", e.target.value)} 
                className="bg-transparent border-white/10 min-h-[80px]" 
                placeholder="A brief summary for the listing page..."
              />
            </div>
          </div>
        </Section>

        <Section title="Content" defaultOpen>
          <div>
            <label className="text-xs font-medium text-white/40 uppercase mb-2 block">Markdown / Plain Text</label>
            <Textarea 
              value={data.content} 
              onChange={e => updateField("content", e.target.value)} 
              className="bg-transparent border-white/10 min-h-[400px] font-mono text-sm leading-relaxed" 
              placeholder="Start writing..."
            />
          </div>
        </Section>
      </div>
    </div>
  )
}
