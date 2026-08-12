'use client'

import * as React from "react"
import { ChevronRight, ChevronDown, Trash2, Save, Loader2, ExternalLink, AlertCircle } from "lucide-react"
import { H1, H3 } from "@/components/ui/typography"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { updateLab, deleteLab } from "@/core/actions/labs"
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
export function LabEditor({ initialData }: { initialData: any }) {
  const [isSaving, setIsSaving] = React.useState(false)
  const [data, setData] = React.useState(initialData)
  
  // Track if there are unsaved changes
  const isDirty = JSON.stringify(data) !== JSON.stringify(initialData)

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
    try {
      await updateLab(data.id, {
        title: data.title,
        description: data.description,
        url: data.url,
        category: data.category,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this lab experiment?")) {
      await deleteLab(data.id)
    }
  }

  const updateField = (field: string, value: any) => {
    setData((prev: any) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-4xl mx-auto pb-32">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 flex items-center justify-between py-4 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 mb-8">
        <H1 className="text-2xl">{data.title || "Untitled Lab"}</H1>
        <div className="flex items-center gap-3">
          {data.url && (
            <Button variant="ghost" onClick={() => window.open(data.url, '_blank')} className="text-white/60 hover:text-white gap-2">
              <ExternalLink className="h-4 w-4" />
              Visit URL
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
      
      {isDirty && (
        <div className="mb-8 flex items-center gap-2 text-sm text-yellow-500/80 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
          <AlertCircle className="h-4 w-4" />
          You have unsaved changes.
        </div>
      )}

      <div className="space-y-2">
        <Section title="Basic Information" defaultOpen>
          <div className="space-y-6">
            <div>
              <label className="text-xs font-medium text-white/40 uppercase mb-2 block">Lab Title</label>
              <Input 
                value={data.title} 
                onChange={e => updateField("title", e.target.value)} 
                className="bg-transparent border-white/10 text-xl font-bold h-12"
                placeholder="e.g. Generative UI Agents"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-medium text-white/40 uppercase mb-2 block">Category</label>
                <Input 
                  value={data.category} 
                  onChange={e => updateField("category", e.target.value)} 
                  className="bg-transparent border-white/10" 
                  placeholder="e.g. AI, Open Source, Experiment"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-white/40 uppercase mb-2 block">External URL</label>
                <Input 
                  value={data.url} 
                  onChange={e => updateField("url", e.target.value)} 
                  className="bg-transparent border-white/10" 
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-white/40 uppercase mb-2 block">Description</label>
              <Textarea 
                value={data.description} 
                onChange={e => updateField("description", e.target.value)} 
                className="bg-transparent border-white/10 min-h-[120px]" 
                placeholder="What is this experiment about?"
              />
            </div>
          </div>
        </Section>
      </div>
    </div>
  )
}
