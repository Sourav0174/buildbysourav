'use client'

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { H3 } from "@/components/ui/typography"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal"
import {
  ChevronDown,
  ChevronRight,
  Save,
  Loader2,
  Trash2,
  Eye,
  ArrowLeft,
  Upload,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
  Copy,
  Globe,
} from "lucide-react"
import { updatePost, deletePost, togglePublishPost, createCategory } from "@/core/actions/blog"
import { calculateReadingTime, slugify, SITE_URL } from "@/core/utils/blog"
import { upload } from "@vercel/blob/client"
import { cn } from "@/core/utils/cn"

export type PostEditorData = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string | null
  categoryId: string | null
  tags: string[]
  authorName: string
  authorRole: string
  authorAvatar: string
  isPublished: boolean
  isFeatured: boolean
  publishedAt: Date | string | null
  readingTime: string
  order: number
  seoTitle: string | null
  seoDescription: string | null
  ogImage: string | null
  canonicalUrl: string | null
  allowAds: boolean
  relatedProduct: string | null
  relatedService: string | null
}

export type CategoryOption = {
  id: string
  name: string
  slug: string
}

export type ProductOption = {
  slug: string
  title: string
}

export type ServiceOption = {
  id: string
  title: string
}

function Section({
  title,
  defaultOpen = true,
  badge,
  children,
}: {
  title: string
  defaultOpen?: boolean
  badge?: React.ReactNode
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <div className="border border-white/5 rounded-xl bg-white/[0.01] overflow-hidden mb-6 transition-all">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-white/40" />
          ) : (
            <ChevronRight className="h-4 w-4 text-white/40" />
          )}
          <H3 className="text-lg font-medium text-white/90">{title}</H3>
        </div>
        {badge && <div>{badge}</div>}
      </button>
      {isOpen && <div className="px-6 pb-6 pt-2 border-t border-white/5 space-y-6">{children}</div>}
    </div>
  )
}

function ImageUploader({
  label,
  currentUrl,
  onUpdate,
  onRemove,
  aspect = "video",
}: {
  label: string
  currentUrl: string | null
  onUpdate: (url: string) => void
  onRemove: () => void
  aspect?: "video" | "square" | "wide"
}) {
  const [isUploading, setIsUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError("File must be less than 5MB")
      return
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]
    if (!allowed.includes(file.type)) {
      setError("Unsupported file format (JPEG, PNG, WebP, AVIF, GIF only)")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const newBlob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      })
      onUpdate(newBlob.url)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed"
      setError(msg)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const aspectClass =
    aspect === "square" ? "aspect-square max-w-[200px]" : "aspect-video max-w-xl"

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-white/40 block">
          {label}
        </label>
        {currentUrl && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Remove Image
          </button>
        )}
      </div>

      {error && (
        <div className="p-2.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-300 text-xs">
          {error}
        </div>
      )}

      {currentUrl ? (
        <div className="space-y-3">
          <div
            className={cn(
              "relative w-full rounded-xl overflow-hidden border border-white/10 bg-black/40 group",
              aspectClass
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={currentUrl} alt={label} className="object-cover w-full h-full" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-black/60 border-white/20 text-xs"
              >
                Change
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="text-red-400 hover:text-red-300 text-xs"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="max-w-xl border-2 border-dashed border-white/10 hover:border-white/25 rounded-xl p-8 text-center cursor-pointer transition-colors bg-white/[0.01] hover:bg-white/[0.03]"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-white/60" />
              <span className="text-xs text-white/50">Uploading asset to Vercel Blob...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-6 w-6 text-white/30" />
              <div className="text-sm font-medium text-white/80">Click to upload {label.toLowerCase()}</div>
              <div className="text-xs text-white/40">PNG, JPG, WebP, AVIF up to 5MB</div>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}

export function BlogPostEditor({
  initialPost,
  categories,
  products,
  services,
}: {
  initialPost: PostEditorData
  categories: CategoryOption[]
  products: ProductOption[]
  services: ServiceOption[]
}) {
  const router = useRouter()
  const [data, setData] = React.useState<PostEditorData>(initialPost)
  const [savedData, setSavedData] = React.useState<PostEditorData>(initialPost)
  const [categoryList, setCategoryList] = React.useState<CategoryOption[]>(categories)

  // Status flags
  const [isSaving, setIsSaving] = React.useState(false)
  const [isPublishing, setIsPublishing] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)
  const [feedback, setFeedback] = React.useState<{ type: "success" | "error"; message: string } | null>(null)

  // In-editor view state: Write vs Markdown Reference / Quick Preview
  const [editorTab, setEditorTab] = React.useState<"write" | "preview">("write")

  // Category quick creation state
  const [showCatModal, setShowCatModal] = React.useState(false)
  const [newCatName, setNewCatName] = React.useState("")
  const [isCreatingCat, setIsCreatingCat] = React.useState(false)

  // Tag input state
  const [tagInput, setTagInput] = React.useState("")

  const updateField = <K extends keyof PostEditorData>(field: K, value: PostEditorData[K]) => {
    setData((prev) => {
      const updated = { ...prev, [field]: value }
      // Auto-recalculate reading time on content modification
      if (field === "content") {
        updated.readingTime = calculateReadingTime(String(value || ""))
      }
      return updated
    })
  }

  // Dirty state checking
  const isDirty = React.useMemo(() => {
    return JSON.stringify(data) !== JSON.stringify(savedData)
  }, [data, savedData])

  // Prevent accidental navigation
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [isDirty])

  const showNotification = (type: "success" | "error", message: string) => {
    setFeedback({ type, message })
    setTimeout(() => {
      setFeedback(null)
    }, 4000)
  }

  // Save handler
  const handleSave = async () => {
    setIsSaving(true)
    setFeedback(null)
    try {
      const res = await updatePost(data.id, {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        categoryId: data.categoryId,
        tags: data.tags,
        authorName: data.authorName,
        authorRole: data.authorRole,
        authorAvatar: data.authorAvatar,
        isPublished: data.isPublished,
        isFeatured: data.isFeatured,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
        order: data.order,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        ogImage: data.ogImage,
        canonicalUrl: data.canonicalUrl,
        allowAds: data.allowAds,
        relatedProduct: data.relatedProduct,
        relatedService: data.relatedService,
      })

      if (res.post) {
        const normalized = {
          ...data,
          ...res.post,
          tags: Array.isArray(res.post.tags) ? (res.post.tags as string[]) : data.tags,
        }
        setData(normalized)
        setSavedData(normalized)
      }
      showNotification("success", "All changes saved successfully")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save post"
      showNotification("error", msg)
    } finally {
      setIsSaving(false)
    }
  }

  // Toggle publish handler
  const handleTogglePublish = async () => {
    setIsPublishing(true)
    try {
      const res = await togglePublishPost(data.id)
      setData((prev) => ({
        ...prev,
        isPublished: res.isPublished,
        publishedAt: res.publishedAt,
      }))
      setSavedData((prev) => ({
        ...prev,
        isPublished: res.isPublished,
        publishedAt: res.publishedAt,
      }))
      showNotification(
        "success",
        res.isPublished ? "Article published to live website" : "Article reverted to draft"
      )
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to change publication status"
      showNotification("error", msg)
    } finally {
      setIsPublishing(false)
    }
  }

  // Delete handler
  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deletePost(data.id)
      router.push("/studio/blog")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete post"
      showNotification("error", msg)
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  // Quick category creation
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatName.trim()) return

    setIsCreatingCat(true)
    try {
      const res = await createCategory({ name: newCatName.trim() })
      setCategoryList((prev) => [...prev, res.category])
      updateField("categoryId", res.category.id)
      setNewCatName("")
      setShowCatModal(false)
      showNotification("success", `Category "${res.category.name}" created and assigned`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create category"
      showNotification("error", msg)
    } finally {
      setIsCreatingCat(false)
    }
  }

  // Tags management
  const addTag = (tag: string) => {
    const trimmed = tag.trim().replace(/^#/, "")
    if (!trimmed || data.tags.includes(trimmed)) return
    updateField("tags", [...data.tags, trimmed])
    setTagInput("")
  }

  const removeTag = (tagToRemove: string) => {
    updateField(
      "tags",
      data.tags.filter((t) => t !== tagToRemove)
    )
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(tagInput)
    }
  }

  // Markdown helper toolbar insertion
  const insertMarkdown = (syntax: string, placeholder = "text") => {
    const textarea = document.getElementById("mdx-editor-textarea") as HTMLTextAreaElement | null
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = textarea.value.substring(start, end) || placeholder

    let insertion = ""
    if (syntax === "h1") insertion = `\n# ${selected}\n`
    else if (syntax === "h2") insertion = `\n## ${selected}\n`
    else if (syntax === "h3") insertion = `\n### ${selected}\n`
    else if (syntax === "bold") insertion = `**${selected}**`
    else if (syntax === "italic") insertion = `*${selected}*`
    else if (syntax === "quote") insertion = `\n> ${selected}\n`
    else if (syntax === "code") insertion = `\`${selected}\``
    else if (syntax === "codeblock")
      insertion = `\n\`\`\`typescript\n// ${selected}\n\`\`\`\n`
    else if (syntax === "link") insertion = `[${selected}](https://)`
    else if (syntax === "list") insertion = `\n- ${selected}\n- item 2\n`
    else if (syntax === "callout")
      insertion = `\n<Callout type="default" title="Note">\n${selected}\n</Callout>\n`

    const newContent =
      textarea.value.substring(0, start) + insertion + textarea.value.substring(end)
    updateField("content", newContent)

    // Restore focus
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + insertion.length, start + insertion.length)
    }, 50)
  }

  // Google Search snippet preview calculation
  const searchTitlePreview = data.seoTitle || data.title || "Article Title"
  const searchDescPreview =
    data.seoDescription || data.excerpt || "A comprehensive technical deep dive on software systems."
  const searchUrlPreview = `${SITE_URL}/blog/${data.slug || "untitled"}`

  return (
    <div className="space-y-6 pb-24">
      {/* Sticky Header Bar */}
      <div className="sticky top-0 z-30 -mx-8 -mt-8 px-8 py-4 bg-[#050505]/90 backdrop-blur-md border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/studio/blog"
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Articles
          </Link>

          <div className="h-4 w-px bg-white/10" />

          <div className="flex items-center gap-2.5">
            <span className="font-semibold text-white truncate max-w-[200px] sm:max-w-xs md:max-w-md">
              {data.title || "Untitled Post"}
            </span>

            {data.isPublished ? (
              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Live
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-300 border-amber-500/20 text-[11px] gap-1">
                <Clock className="h-3 w-3" />
                Draft
              </Badge>
            )}

            {isDirty && (
              <span className="text-[11px] font-medium text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                Unsaved changes
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Studio Preview */}
          <Link href={`/studio/blog/${data.id}/preview`} target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-9 border-white/10 gap-1.5 text-white/80 hover:text-white"
              title="Open full Studio Preview in new tab"
            >
              <Eye className="h-3.5 w-3.5" />
              Preview Article
            </Button>
          </Link>

          {/* Toggle Publish / Draft */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleTogglePublish}
            disabled={isPublishing}
            className={cn(
              "text-xs h-9 border-white/10 transition-colors",
              data.isPublished
                ? "hover:border-amber-500/40 hover:text-amber-300"
                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
            )}
          >
            {isPublishing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
            ) : data.isPublished ? (
              "Revert to Draft"
            ) : (
              "Publish Post"
            )}
          </Button>

          {/* Delete */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
            className="text-xs h-9 text-white/40 hover:text-red-400 hover:bg-red-400/10 px-2.5"
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          {/* Save Changes */}
          <Button
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            className={cn(
              "text-xs h-9 gap-1.5 transition-all font-semibold",
              isDirty
                ? "bg-white text-black hover:bg-white/90 shadow-lg"
                : "bg-white/10 text-white/40 hover:bg-white/10"
            )}
          >
            {isSaving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {isDirty ? "Save Changes" : "Saved"}
          </Button>
        </div>
      </div>

      {/* Notification Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-sm flex items-center justify-between transition-all ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
              : "bg-red-500/10 border-red-500/20 text-red-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Form Sections */}
      <div className="space-y-6">
        {/* 1. Article Metadata & Content Core */}
        <Section title="1. Content & Structure" defaultOpen={true}>
          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2 block">
                Article Title
              </label>
              <Input
                value={data.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g., Designing Sub-5ms Execution Engines with Redis & FastAPI"
                className="bg-black/30 border-white/10 text-xl font-bold h-12 text-white"
              />
            </div>

            {/* Slug & Reading Time Indicator */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2 block">
                  Slug (URL identifier)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-white/30 select-none">
                    /blog/
                  </span>
                  <Input
                    value={data.slug}
                    onChange={(e) => updateField("slug", slugify(e.target.value))}
                    placeholder="my-post-slug"
                    className="pl-16 bg-black/30 border-white/10 font-mono text-xs text-white/90 h-9"
                  />
                </div>
                <p className="text-[11px] text-white/30 mt-1">
                  Editing title will never automatically break this slug. You can modify it explicitly.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2 block">
                  Reading Time
                </label>
                <div className="h-9 px-3 rounded-lg border border-white/10 bg-black/30 flex items-center justify-between text-xs text-white/70">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="h-3.5 w-3.5 text-white/40" />
                    {data.readingTime}
                  </span>
                  <span className="text-[11px] text-white/30">~200 wpm auto-computed</span>
                </div>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2 block">
                Excerpt (Meta Summary)
              </label>
              <Textarea
                value={data.excerpt}
                onChange={(e) => updateField("excerpt", e.target.value)}
                placeholder="A concise, high-converting summary of the engineering challenges and outcomes discussed..."
                className="bg-black/30 border-white/10 min-h-[85px] text-sm text-white/90 leading-relaxed"
              />
            </div>

            {/* Category & Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Category */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/40 block">
                    Category
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCatModal(true)}
                    className="text-xs text-white/60 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <Plus className="h-3 w-3" /> New
                  </button>
                </div>
                <select
                  value={data.categoryId || ""}
                  onChange={(e) => updateField("categoryId", e.target.value || null)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg text-sm text-white/90 px-3 py-2.5 outline-none hover:border-white/20 focus:border-white/30 transition-colors"
                >
                  <option value="">(None / Uncategorized)</option>
                  {categoryList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2 block">
                  Tags
                </label>
                <div className="p-2 border border-white/10 bg-black/30 rounded-lg min-h-[44px] flex flex-wrap items-center gap-1.5">
                  {data.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 bg-white/10 text-white text-xs px-2.5 py-0.5 rounded-full"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-400 transition-colors ml-0.5"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder={data.tags.length === 0 ? "Type a tag & press Enter..." : "Add tag..."}
                    className="bg-transparent border-none text-xs text-white outline-none flex-1 min-w-[120px] px-1 placeholder:text-white/30"
                  />
                </div>
              </div>
            </div>

            {/* Author Information */}
            <div className="pt-2 border-t border-white/5">
              <div className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                Author Attribution
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] text-white/50 block mb-1">Name</label>
                  <Input
                    value={data.authorName}
                    onChange={(e) => updateField("authorName", e.target.value)}
                    placeholder="Sourav"
                    className="bg-black/30 border-white/10 text-xs h-9"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-white/50 block mb-1">Role</label>
                  <Input
                    value={data.authorRole}
                    onChange={(e) => updateField("authorRole", e.target.value)}
                    placeholder="Full-Stack Engineer & Product Builder"
                    className="bg-black/30 border-white/10 text-xs h-9"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-white/50 block mb-1">Avatar Path</label>
                  <Input
                    value={data.authorAvatar}
                    onChange={(e) => updateField("authorAvatar", e.target.value)}
                    placeholder="/profile2.png"
                    className="bg-black/30 border-white/10 text-xs h-9 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* 2. MDX Writing Environment */}
        <Section
          title="2. MDX Writing Environment"
          defaultOpen={true}
          badge={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setEditorTab("write")
                }}
                className={cn(
                  "px-2.5 py-1 text-xs rounded-md transition-colors",
                  editorTab === "write"
                    ? "bg-white text-black font-semibold"
                    : "text-white/60 hover:text-white"
                )}
              >
                Write
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setEditorTab("preview")
                }}
                className={cn(
                  "px-2.5 py-1 text-xs rounded-md transition-colors",
                  editorTab === "preview"
                    ? "bg-white text-black font-semibold"
                    : "text-white/60 hover:text-white"
                )}
              >
                Quick Reference
              </button>
            </div>
          }
        >
          <div className="space-y-3">
            {/* Formatting Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-lg bg-black/40 border border-white/10">
              <button
                type="button"
                onClick={() => insertMarkdown("h2", "Heading 2")}
                className="px-2 py-1 text-xs font-semibold rounded hover:bg-white/10 text-white/70 hover:text-white"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown("h3", "Heading 3")}
                className="px-2 py-1 text-xs font-semibold rounded hover:bg-white/10 text-white/70 hover:text-white"
              >
                H3
              </button>
              <div className="h-4 w-px bg-white/10 mx-1" />
              <button
                type="button"
                onClick={() => insertMarkdown("bold", "bold text")}
                className="px-2 py-1 text-xs font-bold rounded hover:bg-white/10 text-white/70 hover:text-white"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown("italic", "italic text")}
                className="px-2 py-1 text-xs italic rounded hover:bg-white/10 text-white/70 hover:text-white"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown("quote", "quote line")}
                className="px-2 py-1 text-xs rounded hover:bg-white/10 text-white/70 hover:text-white"
              >
                &ldquo;Quote&rdquo;
              </button>
              <div className="h-4 w-px bg-white/10 mx-1" />
              <button
                type="button"
                onClick={() => insertMarkdown("code", "code")}
                className="px-2 py-1 text-xs font-mono rounded hover:bg-white/10 text-white/70 hover:text-white"
              >
                `code`
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown("codeblock", "const engine = true;")}
                className="px-2 py-1 text-xs font-mono rounded hover:bg-white/10 text-white/70 hover:text-white"
              >
                ```codeblock```
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown("callout", "Important note text")}
                className="px-2 py-1 text-xs rounded hover:bg-white/10 text-white/70 hover:text-white"
              >
                Callout
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown("link", "Link label")}
                className="px-2 py-1 text-xs rounded hover:bg-white/10 text-white/70 hover:text-white"
              >
                Link
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown("list", "Item 1")}
                className="px-2 py-1 text-xs rounded hover:bg-white/10 text-white/70 hover:text-white"
              >
                • List
              </button>

              <div className="ml-auto flex items-center gap-2">
                <Link
                  href={`/studio/blog/${data.id}/preview`}
                  target="_blank"
                  className="text-xs text-white/50 hover:text-white flex items-center gap-1"
                >
                  <Eye className="h-3 w-3" /> Full Article Preview ↗
                </Link>
              </div>
            </div>

            {/* Editor Area */}
            {editorTab === "write" ? (
              <div className="relative">
                <Textarea
                  id="mdx-editor-textarea"
                  value={data.content}
                  onChange={(e) => updateField("content", e.target.value)}
                  placeholder="Write your article in Markdown / MDX syntax..."
                  className="min-h-[500px] bg-black/40 border-white/10 font-mono text-sm leading-relaxed p-4 text-white/90 selection:bg-white/20 resize-y"
                />
                <div className="absolute right-3 bottom-3 text-[11px] font-mono text-white/30 select-none pointer-events-none">
                  {data.content.length} chars | {data.content.trim().split(/\s+/).filter(Boolean).length} words
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-white/10 bg-black/30 space-y-4 text-xs text-white/70">
                <div className="font-semibold text-white text-sm">MDX Component Quick Reference</div>
                <p>
                  This editor supports standard Markdown as well as enhanced interactive components for
                  technical writing:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="font-mono text-white font-semibold">Code Blocks</div>
                    <p className="text-white/50">Fenced code blocks with language syntax:</p>
                    <pre className="p-2 rounded bg-black/50 font-mono text-[11px]">
                      {"```typescript\nconst tps = 50000;\n```"}
                    </pre>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="font-mono text-white font-semibold">&lt;Callout&gt; Component</div>
                    <p className="text-white/50">Highlight critical insights, warnings, or notes:</p>
                    <pre className="p-2 rounded bg-black/50 font-mono text-[11px]">
                      {'<Callout type="warning" title="Warning">\nWatch memory consumption.\n</Callout>'}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* 3. Media & Visual Assets */}
        <Section title="3. Media & Visual Assets" defaultOpen={true}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ImageUploader
              label="Article Cover Image"
              currentUrl={data.coverImage}
              onUpdate={(url) => updateField("coverImage", url)}
              onRemove={() => updateField("coverImage", null)}
              aspect="video"
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  OpenGraph (Social Share Image)
                </div>
                {data.coverImage && data.ogImage !== data.coverImage && (
                  <button
                    type="button"
                    onClick={() => updateField("ogImage", data.coverImage)}
                    className="text-xs text-white/50 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <Copy className="h-3 w-3" /> Use Cover Image
                  </button>
                )}
              </div>

              <ImageUploader
                label="Social Graph Image"
                currentUrl={data.ogImage}
                onUpdate={(url) => updateField("ogImage", url)}
                onRemove={() => updateField("ogImage", null)}
                aspect="video"
              />
            </div>
          </div>
        </Section>

        {/* 4. Publishing Rules & Distribution */}
        <Section title="4. Publication & Distribution" defaultOpen={true}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Status */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2 block">
                Publication Status
              </label>
              <select
                value={data.isPublished ? "published" : "draft"}
                onChange={(e) => {
                  const isPub = e.target.value === "published"
                  updateField("isPublished", isPub)
                  if (isPub && !data.publishedAt) {
                    updateField("publishedAt", new Date().toISOString())
                  }
                }}
                className="w-full bg-black/40 border border-white/10 rounded-lg text-xs text-white px-3 py-2.5 outline-none hover:border-white/20"
              >
                <option value="draft">Draft (Private to Studio)</option>
                <option value="published">Published (Public on Website)</option>
              </select>
            </div>

            {/* Published Date */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2 block">
                Published Date
              </label>
              <Input
                type="date"
                value={
                  data.publishedAt
                    ? new Date(data.publishedAt).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  updateField(
                    "publishedAt",
                    e.target.value ? new Date(e.target.value).toISOString() : null
                  )
                }
                className="bg-black/40 border-white/10 text-xs h-9 text-white"
              />
            </div>

            {/* Featured Switch */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2 block">
                Featured Highlight
              </label>
              <label className="flex items-center gap-3 p-2 rounded-lg border border-white/10 bg-black/40 cursor-pointer h-9">
                <input
                  type="checkbox"
                  checked={data.isFeatured}
                  onChange={(e) => updateField("isFeatured", e.target.checked)}
                  className="rounded border-white/20 bg-transparent h-4 w-4 text-white"
                />
                <span className="text-xs text-white/80">Feature on Homepage</span>
              </label>
            </div>

            {/* Allow Ads */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2 block">
                Monetization
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-black/40 cursor-pointer hover:border-white/20 transition-colors">
                <input
                  type="checkbox"
                  checked={data.allowAds}
                  onChange={(e) => updateField("allowAds", e.target.checked)}
                  className="rounded border-white/20 bg-transparent h-4 w-4 text-white focus:ring-0 focus:ring-offset-0"
                />
                <div className="space-y-0.5">
                  <div className="text-xs font-medium text-white/90">Enable advertisements</div>
                  <div className="text-[11px] text-white/40 leading-normal">
                    Allow advertising slots to appear inside this article.
                  </div>
                </div>
              </label>
            </div>
          </div>
        </Section>

        {/* 5. Technical SEO & Search Preview */}
        <Section title="5. Technical SEO & Search Snippet" defaultOpen={false}>
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SEO Title */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/40 block">
                    SEO Meta Title
                  </label>
                  <span
                    className={cn(
                      "text-[11px] font-mono",
                      (data.seoTitle || "").length > 60 ? "text-amber-400" : "text-white/40"
                    )}
                  >
                    {(data.seoTitle || "").length}/60 chars
                  </span>
                </div>
                <Input
                  value={data.seoTitle || ""}
                  onChange={(e) => updateField("seoTitle", e.target.value || null)}
                  placeholder={data.title || "Custom search title..."}
                  className="bg-black/30 border-white/10 text-xs h-9"
                />
              </div>

              {/* Canonical URL */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2 block">
                  Canonical URL (Optional override)
                </label>
                <Input
                  value={data.canonicalUrl || ""}
                  onChange={(e) => updateField("canonicalUrl", e.target.value || null)}
                  placeholder={`${SITE_URL}/blog/${data.slug}`}
                  className="bg-black/30 border-white/10 text-xs h-9 font-mono"
                />
              </div>
            </div>

            {/* SEO Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/40 block">
                  SEO Meta Description
                </label>
                <span
                  className={cn(
                    "text-[11px] font-mono",
                    (data.seoDescription || "").length > 160 ? "text-amber-400" : "text-white/40"
                  )}
                >
                  {(data.seoDescription || "").length}/160 chars
                </span>
              </div>
              <Textarea
                value={data.seoDescription || ""}
                onChange={(e) => updateField("seoDescription", e.target.value || null)}
                placeholder={data.excerpt || "Description for Google search indexing..."}
                className="bg-black/30 border-white/10 min-h-[75px] text-xs text-white/90"
              />
            </div>

            {/* Search Result Mockup Card */}
            <div className="pt-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                Google Search Result Preview
              </div>
              <div className="p-4 rounded-xl border border-white/10 bg-[#161616] max-w-2xl font-sans space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#bdc1c6]">
                  <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center text-[9px] font-bold text-black">
                    S
                  </div>
                  <span className="font-medium text-[#dadce0]">BuildBySourav</span>
                  <span className="text-[#9aa0a6] text-[11px] font-mono">
                    {searchUrlPreview}
                  </span>
                </div>
                <div className="text-base text-[#8ab4f8] hover:underline cursor-pointer font-medium line-clamp-1 pt-0.5">
                  {searchTitlePreview} | BuildBySourav
                </div>
                <div className="text-xs text-[#bdc1c6] line-clamp-2 leading-relaxed">
                  {searchDescPreview}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* 6. Product & Service Conversions */}
        <Section title="6. Client & Commercial Funnels" defaultOpen={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Related Product */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2 block">
                Linked Portfolio Product
              </label>
              <select
                value={data.relatedProduct || ""}
                onChange={(e) => updateField("relatedProduct", e.target.value || null)}
                className="w-full bg-black/40 border border-white/10 rounded-lg text-sm text-white/90 px-3 py-2.5 outline-none hover:border-white/20"
              >
                <option value="">(None)</option>
                {products.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.title} ({p.slug})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-white/40 mt-1.5">
                Renders a conversion card linking readers to your product deep-dive.
              </p>
            </div>

            {/* Related Service */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2 block">
                Linked Commercial Service
              </label>
              <select
                value={data.relatedService || ""}
                onChange={(e) => updateField("relatedService", e.target.value || null)}
                className="w-full bg-black/40 border border-white/10 rounded-lg text-sm text-white/90 px-3 py-2.5 outline-none hover:border-white/20"
              >
                <option value="">(None)</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-white/40 mt-1.5">
                Connects technical readers with consulting or bespoke engineering services.
              </p>
            </div>
          </div>
        </Section>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <ModalContent className="max-w-md">
          <ModalHeader>
            <ModalTitle className="text-white text-lg">Delete Article</ModalTitle>
            <ModalDescription className="text-white/60 text-sm">
              Are you sure you want to permanently delete{" "}
              <span className="text-white font-medium">&ldquo;{data.title}&rdquo;</span>? This will purge the
              post from the database and remove associated Vercel Blob assets.
            </ModalDescription>
          </ModalHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
              className="border-white/10 text-white/80 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white gap-2"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Confirm Delete
            </Button>
          </div>
        </ModalContent>
      </Modal>

      {/* Quick Add Category Modal */}
      <Modal open={showCatModal} onOpenChange={setShowCatModal}>
        <ModalContent className="max-w-md">
          <ModalHeader>
            <ModalTitle className="text-white text-lg">Add New Category</ModalTitle>
            <ModalDescription className="text-white/60 text-sm">
              Define a new topic category for this article.
            </ModalDescription>
          </ModalHeader>
          <form onSubmit={handleCreateCategory} className="space-y-4 mt-2">
            <div>
              <label className="text-xs text-white/60 block mb-1">Category Name</label>
              <Input
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Distributed Systems"
                className="bg-black/40 border-white/10 text-sm"
                required
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCatModal(false)}
                className="border-white/10 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreatingCat || !newCatName.trim()}
                className="bg-white text-black hover:bg-white/90 text-xs"
              >
                {isCreatingCat ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
                Create & Assign
              </Button>
            </div>
          </form>
        </ModalContent>
      </Modal>
    </div>
  )
}
