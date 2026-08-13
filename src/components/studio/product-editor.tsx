/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import * as React from "react"
import { ChevronRight, ChevronDown, Trash2, Save, Loader2, Plus, GripVertical, Eye, AlertCircle } from "lucide-react"
import { H1, H3 } from "@/components/ui/typography"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { updateProduct, deleteProduct } from "@/core/actions/products"
import { upload } from '@vercel/blob/client'
import { cn } from "@/core/utils/cn"

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

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

// Sortable Item for String Arrays
function SortableStringItem({ id, item, i, onUpdate, onRemove }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div ref={setNodeRef} style={style} className="flex gap-2 items-center">
      <div {...attributes} {...listeners} className="cursor-grab hover:text-white text-white/20 p-2 -ml-2 rounded-md">
        <GripVertical className="h-4 w-4" />
      </div>
      <Input 
        value={item}
        onChange={(e) => onUpdate(i, e.target.value)}
        className="bg-transparent border-white/10 flex-1"
      />
      <Button variant="ghost" size="icon" onClick={() => onRemove(i)}>
        <Trash2 className="h-4 w-4 text-white/40 hover:text-red-400" />
      </Button>
    </div>
  )
}

function StringArrayEditor({ list, onUpdate }: { list: string[], onUpdate: (newList: string[]) => void }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // Map to objects with unique IDs for dnd-kit
  const items = React.useMemo(() => (Array.isArray(list) ? list : []).map((val, i) => ({ id: `${i}-${val}`, val })), [list])

  if (!Array.isArray(list)) {
    return (
      <div className="p-4 border border-yellow-500/20 bg-yellow-500/10 rounded-lg text-yellow-500/80 text-sm flex flex-col gap-3 items-start">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>Legacy or malformed data detected. Expected an array of strings.</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => onUpdate([])} className="border-yellow-500/20 text-yellow-500/80 hover:bg-yellow-500/20">
          Reset to Empty Array
        </Button>
      </div>
    )
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(x => x.id === active.id)
      const newIndex = items.findIndex(x => x.id === over.id)
      const moved = arrayMove(items, oldIndex, newIndex)
      onUpdate(moved.map(x => x.val))
    }
  }

  return (
    <div className="space-y-2">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(x => x.id)} strategy={verticalListSortingStrategy}>
          {items.map((obj, i) => (
            <SortableStringItem 
              key={obj.id} 
              id={obj.id} 
              item={obj.val} 
              i={i} 
              onUpdate={(index: number, val: string) => {
                const newList = [...list]
                newList[index] = val
                onUpdate(newList)
              }}
              onRemove={(index: number) => {
                const newList = list.filter((_, idx) => idx !== index)
                onUpdate(newList)
              }} 
            />
          ))}
        </SortableContext>
      </DndContext>
      <Button variant="outline" size="sm" onClick={() => onUpdate([...list, ""])} className="mt-2 text-xs h-8">
        <Plus className="h-3 w-3 mr-1" /> Add Item
      </Button>
    </div>
  )
}

// Sortable Item for Object Arrays
function SortableObjectItem({ id, item, i, keys, onUpdate, onRemove }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div ref={setNodeRef} style={style} className="relative p-4 border border-white/10 rounded-lg bg-[#0a0a0a] flex gap-2">
      <div {...attributes} {...listeners} className="cursor-grab hover:text-white text-white/20 p-2 -ml-2 rounded-md h-fit mt-1">
        <GripVertical className="h-4 w-4" />
      </div>
      <div className="flex-1 space-y-4 pr-8">
        {keys.map((k: any) => (
          <div key={k.key}>
            {k.type === 'input' ? (
              <Input 
                placeholder={k.placeholder}
                value={item[k.key] || ""}
                onChange={(e) => onUpdate(i, k.key, e.target.value)}
                className="bg-transparent border-none text-lg font-medium px-0 h-auto focus-visible:ring-0 placeholder:text-white/20"
              />
            ) : (
              <Textarea 
                placeholder={k.placeholder}
                value={item[k.key] || ""}
                onChange={(e) => onUpdate(i, k.key, e.target.value)}
                className="bg-transparent border-white/10 mt-2 min-h-[100px] placeholder:text-white/20"
              />
            )}
          </div>
        ))}
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 h-8 w-8"
        onClick={() => onRemove(i)}
      >
        <Trash2 className="h-4 w-4 text-white/40 hover:text-red-400" />
      </Button>
    </div>
  )
}

function ObjectArrayEditor({ list, keys, onUpdate }: { list: any[], keys: any[], onUpdate: (newList: any[]) => void }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // Needs a stable ID. Fallback to index if no unique ID property exists.
  const items = React.useMemo(() => (Array.isArray(list) ? list : []).map((val, i) => ({ id: val._id || `${i}-${JSON.stringify(val).slice(0, 10)}`, val })), [list])

  if (!Array.isArray(list)) {
    return (
      <div className="p-4 border border-yellow-500/20 bg-yellow-500/10 rounded-lg text-yellow-500/80 text-sm flex flex-col gap-3 items-start">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>Legacy or malformed data detected. Expected an array of objects.</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => onUpdate([])} className="border-yellow-500/20 text-yellow-500/80 hover:bg-yellow-500/20">
          Reset to Empty Array
        </Button>
      </div>
    )
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(x => x.id === active.id)
      const newIndex = items.findIndex(x => x.id === over.id)
      const moved = arrayMove(items, oldIndex, newIndex)
      onUpdate(moved.map(x => x.val))
    }
  }

  return (
    <div className="space-y-6">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(x => x.id)} strategy={verticalListSortingStrategy}>
          {items.map((obj, i) => (
            <SortableObjectItem 
              key={obj.id} 
              id={obj.id} 
              item={obj.val} 
              i={i} 
              keys={keys}
              onUpdate={(index: number, key: string, val: string) => {
                const newList = [...list]
                newList[index] = { ...newList[index], [key]: val }
                onUpdate(newList)
              }}
              onRemove={(index: number) => {
                const newList = list.filter((_, idx) => idx !== index)
                onUpdate(newList)
              }} 
            />
          ))}
        </SortableContext>
      </DndContext>
      <Button variant="outline" size="sm" onClick={() => {
        const newItem = keys.reduce((acc: any, curr: any) => ({ ...acc, [curr.key]: "" }), { _id: Date.now().toString() })
        onUpdate([...list, newItem])
      }}>
        <Plus className="h-4 w-4 mr-2" /> Add Entry
      </Button>
    </div>
  )
}

// --- Hero Image Upload Component ---
function HeroImageUpload({ currentUrl, onUpdate, onRemove }: { currentUrl: string | null, onUpdate: (url: string) => void, onRemove: () => void }) {
  const [isUploading, setIsUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError("File must be less than 5MB")
      return
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Only JPEG, PNG, WebP, AVIF, and GIF are allowed.")
      return
    }

    setIsUploading(true)
    setError(null)
    
    try {
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      })
      onUpdate(newBlob.url)
    } catch (err: any) {
      setError(err.message || "Upload failed")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="space-y-4">
      {error && <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</div>}
      
      {currentUrl ? (
        <div className="space-y-4">
          <div className="relative aspect-video w-full max-w-xl rounded-lg overflow-hidden border border-white/10 bg-black/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={currentUrl} alt="Hero" className="object-cover w-full h-full" />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="bg-transparent border-white/20">
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Replace Image
            </Button>
            <Button variant="ghost" size="sm" onClick={onRemove} disabled={isUploading} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-4">
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="bg-white/5 border-white/10 hover:bg-white/10">
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            Upload Hero Image
          </Button>
          <p className="text-xs text-white/40">JPEG, PNG, WebP, or AVIF up to 5MB.</p>
        </div>
      )}
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        className="hidden" 
      />
    </div>
  )
}

// --- Gallery Editor Component ---
function GalleryEditor({ list, onUpdate }: { list: any[], onUpdate: (newList: any[]) => void }) {
  const [isUploading, setIsUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Ensure list is an array
  const safeList = Array.isArray(list) ? list : []

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError("File must be less than 5MB")
      return
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Only JPEG, PNG, WebP, AVIF, and GIF are allowed.")
      return
    }

    setIsUploading(true)
    setError(null)
    
    try {
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      })
      onUpdate([...safeList, { url: newBlob.url, caption: "" }])
    } catch (err: any) {
      setError(err.message || "Upload failed")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = (index: number) => {
    if (confirm("Are you sure you want to remove this screenshot?")) {
      const newList = [...safeList]
      newList.splice(index, 1)
      onUpdate(newList)
    }
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newList = [...safeList]
    const temp = newList[index - 1]
    newList[index - 1] = newList[index]
    newList[index] = temp
    onUpdate(newList)
  }

  const handleMoveDown = (index: number) => {
    if (index === safeList.length - 1) return
    const newList = [...safeList]
    const temp = newList[index + 1]
    newList[index + 1] = newList[index]
    newList[index] = temp
    onUpdate(newList)
  }

  const handleCaptionChange = (index: number, caption: string) => {
    const newList = [...safeList]
    newList[index] = { ...newList[index], caption }
    onUpdate(newList)
  }

  if (!Array.isArray(list)) {
    return (
      <div className="p-4 border border-yellow-500/20 bg-yellow-500/10 rounded-lg text-yellow-500/80 text-sm flex flex-col gap-3 items-start">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>Legacy or malformed data detected. Expected an array of objects.</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => onUpdate([])} className="border-yellow-500/20 text-yellow-500/80 hover:bg-yellow-500/20">
          Reset to Empty Array
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</div>}
      
      <div className="grid gap-6">
        {safeList.map((item, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-6 p-4 rounded-xl border border-white/10 bg-[#0a0a0a]">
            {/* Image Preview */}
            <div className="relative aspect-video w-full md:w-64 rounded-lg overflow-hidden bg-black/40 border border-white/10 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={`Screenshot ${index + 1}`} className="object-cover w-full h-full" />
            </div>
            
            {/* Details and Controls */}
            <div className="flex flex-col flex-1 gap-4 justify-between">
              <div>
                <label className="text-xs font-medium text-white/40 uppercase mb-2 block">Caption (Optional)</label>
                <Input 
                  value={item.caption || ""} 
                  onChange={(e) => handleCaptionChange(index, e.target.value)} 
                  placeholder="Describe this screenshot..."
                  className="bg-transparent border-white/10"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleMoveUp(index)} 
                    disabled={index === 0}
                    className="bg-transparent border-white/10 h-8 px-2"
                  >
                    Move Up
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleMoveDown(index)} 
                    disabled={index === safeList.length - 1}
                    className="bg-transparent border-white/10 h-8 px-2"
                  >
                    Move Down
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemove(index)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10 h-8 px-3"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <Button 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()} 
          disabled={isUploading} 
          className="bg-white/5 border-white/10 hover:bg-white/10"
        >
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          Add Screenshot
        </Button>
        <p className="text-xs text-white/40 mt-3">JPEG, PNG, WebP, or AVIF up to 5MB.</p>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          className="hidden" 
        />
      </div>
    </div>
  )
}

// --- Editor Component ---
export function ProductEditor({ initialData }: { initialData: any }) {
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

  const [hasManuallyEditedSlug, setHasManuallyEditedSlug] = React.useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateProduct(data.id, {
        title: data.title,
        slug: data.slug,
        tagline: data.tagline,
        overview: data.overview,
        whyItExists: data.whyItExists,
        color: data.color,
        status: data.status,
        timeline: data.timeline,
        isFeatured: data.isFeatured,
        tech: data.tech,
        features: data.features,
        roadmap: data.roadmap,
        engineeringChallenges: data.engineeringChallenges,
        engineeringDecisions: data.engineeringDecisions,
        metrics: data.metrics,
        links: data.links,
        heroImage: data.heroImage,
        screenshots: data.screenshots,
        seo: data.seo,
      })
      // Note: revalidation happens on the server so the page will likely reload or refresh router
      // But we can update initialData if we wanted to prevent isDirty jumping, but relying on server refresh is fine.
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(data.id)
    }
  }

  const updateField = (field: string, value: any) => {
    setData((prev: any) => {
      const newData = { ...prev, [field]: value }
      if (field === 'title' && !hasManuallyEditedSlug) {
        newData.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      }
      return newData
    })
  }

  return (
    <div className="max-w-4xl mx-auto pb-32">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 flex items-center justify-between py-4 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 mb-8">
        <H1 className="text-2xl">{data.title || "Untitled"}</H1>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => window.open(`/products/${data.slug}?preview=true`, '_blank')} className="text-white/60 hover:text-white gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
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
              <label className="text-xs font-medium text-white/40 uppercase mb-2 block">Product Title</label>
              <Input 
                value={data.title} 
                onChange={e => updateField("title", e.target.value)} 
                className="bg-transparent border-white/10 text-xl font-bold h-12"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-medium text-white/40 uppercase mb-2 block">Slug</label>
                <Input 
                  value={data.slug} 
                  onChange={e => {
                    setHasManuallyEditedSlug(true)
                    updateField("slug", e.target.value)
                  }} 
                  className="bg-transparent border-white/10" 
                />
              </div>
              <div>
                <label className="text-xs font-medium text-white/40 uppercase mb-2 block">Status</label>
                <select 
                  value={data.status} 
                  onChange={e => updateField("status", e.target.value)}
                  className="w-full h-10 rounded-md border border-white/10 bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 text-white"
                >
                  <option value="LIVE" className="bg-[#050505]">LIVE</option>
                  <option value="BUILDING" className="bg-[#050505]">BUILDING</option>
                  <option value="OPEN_SOURCE" className="bg-[#050505]">OPEN SOURCE</option>
                  <option value="ARCHIVED" className="bg-[#050505]">ARCHIVED</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-medium text-white/40 uppercase mb-2 block">Timeline</label>
                <Input value={data.timeline} onChange={e => updateField("timeline", e.target.value)} placeholder="e.g. Q3 2025 - Present" className="bg-transparent border-white/10" />
              </div>
              <div>
                <label className="text-xs font-medium text-white/40 uppercase mb-2 block">Brand Color</label>
                <Input type="color" value={data.color} onChange={e => updateField("color", e.target.value)} className="bg-transparent border-white/10 h-10 p-1 w-full cursor-pointer" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-white/40 uppercase mb-2 block">Tagline</label>
              <Input value={data.tagline} onChange={e => updateField("tagline", e.target.value)} className="bg-transparent border-white/10" />
            </div>
            <div>
              <label className="text-xs font-medium text-white/40 uppercase mb-2 block">Overview</label>
              <Textarea value={data.overview} onChange={e => updateField("overview", e.target.value)} className="bg-transparent border-white/10 min-h-[120px]" />
            </div>
            <div>
              <label className="text-xs font-medium text-white/40 uppercase mb-2 block">Why It Exists</label>
              <Textarea value={data.whyItExists} onChange={e => updateField("whyItExists", e.target.value)} className="bg-transparent border-white/10 min-h-[120px]" />
            </div>
          </div>
        </Section>

        <Section title="Hero Image" defaultOpen>
          <HeroImageUpload 
            currentUrl={data.heroImage}
            onUpdate={(url) => {
              updateField("heroImage", url)
            }}
            onRemove={() => {
              if (confirm("Are you sure you want to remove the hero image?")) {
                updateField("heroImage", null)
              }
            }}
          />
        </Section>

        <Section title="Technology Stack">
          <StringArrayEditor list={data.tech || []} onUpdate={newList => updateField("tech", newList)} />
        </Section>

        <Section title="Features">
          <StringArrayEditor list={data.features || []} onUpdate={newList => updateField("features", newList)} />
        </Section>

        <Section title="Engineering Challenges">
          <ObjectArrayEditor 
            list={data.engineeringChallenges || []}
            onUpdate={newList => updateField("engineeringChallenges", newList)}
            keys={[
              { key: 'title', placeholder: 'Challenge Title', type: 'input' },
              { key: 'description', placeholder: 'Detailed description of how the challenge was resolved...', type: 'textarea' }
            ]} 
          />
        </Section>

        <Section title="Engineering Decisions">
          <ObjectArrayEditor 
            list={data.engineeringDecisions || []}
            onUpdate={newList => updateField("engineeringDecisions", newList)}
            keys={[
              { key: 'title', placeholder: 'Decision Title (e.g. PostgreSQL over NoSQL)', type: 'input' },
              { key: 'description', placeholder: 'Why this decision was made...', type: 'textarea' },
              { key: 'tradeoff', placeholder: 'Tradeoffs accepted...', type: 'textarea' }
            ]} 
          />
        </Section>

        <Section title="Performance Metrics">
          <ObjectArrayEditor 
            list={data.metrics || []}
            onUpdate={newList => updateField("metrics", newList)}
            keys={[
              { key: 'label', placeholder: 'Metric Label (e.g. Uptime)', type: 'input' },
              { key: 'value', placeholder: 'Metric Value (e.g. 99.99%)', type: 'input' }
            ]} 
          />
        </Section>

        <Section title="Roadmap">
          <StringArrayEditor list={data.roadmap || []} onUpdate={newList => updateField("roadmap", newList)} />
        </Section>

        <Section title="Screenshots">
          <GalleryEditor 
            list={data.screenshots || []}
            onUpdate={newList => updateField("screenshots", newList)}
          />
        </Section>

        <Section title="External Links">
          <ObjectArrayEditor 
            list={data.links || []}
            onUpdate={newList => updateField("links", newList)}
            keys={[
              { key: 'label', placeholder: 'Link Label (e.g. GitHub Repository)', type: 'input' },
              { key: 'url', placeholder: 'URL (https://...)', type: 'input' }
            ]} 
          />
        </Section>

        <Section title="SEO">
          <div className="space-y-6">
            <div>
              <label className="text-xs font-medium text-white/40 uppercase mb-2 block">Meta Title</label>
              <Input 
                value={data.seo?.title || ""} 
                onChange={e => updateField("seo", { ...data.seo, title: e.target.value })} 
                className="bg-transparent border-white/10"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-white/40 uppercase mb-2 block">Meta Description</label>
              <Textarea 
                value={data.seo?.description || ""} 
                onChange={e => updateField("seo", { ...data.seo, description: e.target.value })} 
                className="bg-transparent border-white/10 min-h-[100px]"
              />
            </div>
          </div>
        </Section>
      </div>
    </div>
  )
}
