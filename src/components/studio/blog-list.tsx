'use client'

import * as React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal"
import {
  Pencil,
  Eye,
  Trash2,
  GripVertical,
  Search,
  CheckCircle2,
  Clock,
  Plus,
  Loader2,
  Tag,
  FolderPlus,
  SlidersHorizontal,
} from "lucide-react"
import {
  reorderPosts,
  deletePost,
  togglePublishPost,
  createCategory,
  deleteCategory,
} from "@/core/actions/blog"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

export type StudioPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  isPublished: boolean
  isFeatured: boolean
  publishedAt: Date | string | null
  updatedAt?: Date | string
  readingTime: string
  order: number
  tags: string[]
  category: {
    id: string
    name: string
    slug: string
  } | null
}

export type StudioCategory = {
  id: string
  name: string
  slug: string
  description: string | null
  _count?: {
    posts: number
  }
}

function SortablePostRow({
  post,
  onTogglePublish,
  onDeleteClick,
  isToggling,
}: {
  post: StudioPost
  onTogglePublish: (id: string) => void
  onDeleteClick: (post: StudioPost) => void
  isToggling: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: post.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    position: "relative" as const,
  }

  const formattedDate = post.publishedAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(post.publishedAt))
    : "—"

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`hover:bg-white/[0.02] transition-colors ${
        isDragging ? "bg-white/5 opacity-80 shadow-xl" : "bg-transparent"
      }`}
    >
      <td className="px-4 py-4 w-12 text-center">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab hover:text-white text-white/30 flex items-center justify-center p-1 rounded hover:bg-white/5"
          title="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      </td>

      <td className="px-6 py-4 max-w-sm">
        <div className="font-medium text-white truncate">{post.title || "Untitled Post"}</div>
        <div className="text-xs text-white/40 font-mono truncate">/blog/{post.slug}</div>
      </td>

      <td className="px-6 py-4">
        {post.category ? (
          <Badge variant="outline" className="bg-white/[0.03] text-white/80 border-white/10 text-xs">
            {post.category.name}
          </Badge>
        ) : (
          <span className="text-white/30 text-xs">—</span>
        )}
      </td>

      <td className="px-6 py-4">
        <button
          type="button"
          onClick={() => onTogglePublish(post.id)}
          disabled={isToggling}
          className="transition-transform active:scale-95 disabled:opacity-50"
          title="Click to toggle publish status"
        >
          {post.isPublished ? (
            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 text-xs cursor-pointer gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Published
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-amber-500/10 text-amber-300 border-amber-500/20 hover:bg-amber-500/20 text-xs cursor-pointer gap-1">
              <Clock className="h-3 w-3" />
              Draft
            </Badge>
          )}
        </button>
      </td>

      <td className="px-6 py-4">
        {post.isFeatured ? (
          <Badge className="bg-white text-black text-xs font-semibold">Featured</Badge>
        ) : (
          <span className="text-white/20 text-xs">—</span>
        )}
      </td>

      <td className="px-6 py-4 text-xs text-white/60 whitespace-nowrap">
        {post.readingTime}
      </td>

      <td className="px-6 py-4 text-xs text-white/50 whitespace-nowrap">
        {formattedDate}
      </td>

      <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
        <Link href={`/studio/blog/${post.id}/preview`}>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white/60 hover:text-white" title="Studio Preview">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
        <Link href={`/studio/blog/${post.id}`}>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white/60 hover:text-white" title="Edit Post">
            <Pencil className="h-4 w-4" />
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDeleteClick(post)}
          className="h-8 w-8 p-0 text-white/40 hover:text-red-400 hover:bg-red-400/10"
          title="Delete Post"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  )
}

export function BlogListClient({
  initialPosts,
  initialCategories,
}: {
  initialPosts: StudioPost[]
  initialCategories: StudioCategory[]
}) {
  const [posts, setPosts] = React.useState<StudioPost[]>(initialPosts)
  const [categories, setCategories] = React.useState<StudioCategory[]>(initialCategories)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<"all" | "published" | "draft">("all")
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all")
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [togglingId, setTogglingId] = React.useState<string | null>(null)

  // Feedback notifications
  const [feedback, setFeedback] = React.useState<{ type: "success" | "error"; message: string } | null>(null)

  // Delete confirmation modal state
  const [postToDelete, setPostToDelete] = React.useState<StudioPost | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  // Category Manager Modal state
  const [showCategoryModal, setShowCategoryModal] = React.useState(false)
  const [newCatName, setNewCatName] = React.useState("")
  const [newCatDesc, setNewCatDesc] = React.useState("")
  const [isCreatingCat, setIsCreatingCat] = React.useState(false)
  const [catToDelete, setCatToDelete] = React.useState<StudioCategory | null>(null)


  const showNotification = (type: "success" | "error", message: string) => {
    setFeedback({ type, message })
    setTimeout(() => {
      setFeedback(null)
    }, 4000)
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Filter posts client-side without extra backend queries
  const filteredPosts = React.useMemo(() => {
    return posts.filter((p) => {
      // Status filter
      if (statusFilter === "published" && !p.isPublished) return false
      if (statusFilter === "draft" && p.isPublished) return false

      // Category filter
      if (selectedCategory !== "all" && p.category?.id !== selectedCategory) return false

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const titleMatch = p.title.toLowerCase().includes(query)
        const slugMatch = p.slug.toLowerCase().includes(query)
        const tagMatch = p.tags.some((t) => t.toLowerCase().includes(query))
        const categoryMatch = p.category?.name.toLowerCase().includes(query)
        return titleMatch || slugMatch || tagMatch || categoryMatch
      }

      return true
    })
  }, [posts, statusFilter, selectedCategory, searchQuery])

  // Drag-and-drop reorder
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = posts.findIndex((p) => p.id === active.id)
    const newIndex = posts.findIndex((p) => p.id === over.id)
    const updated = arrayMove(posts, oldIndex, newIndex)

    setPosts(updated)
    setIsUpdating(true)

    try {
      await reorderPosts(updated.map((p) => p.id))
      showNotification("success", "Article order updated")
    } catch (err: unknown) {
      setPosts(posts) // revert
      const msg = err instanceof Error ? err.message : "Failed to reorder articles"
      showNotification("error", msg)
    } finally {
      setIsUpdating(false)
    }
  }

  // Toggle Publish / Unpublish
  const handleTogglePublish = async (id: string) => {
    setTogglingId(id)
    try {
      const res = await togglePublishPost(id)
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, isPublished: res.isPublished, publishedAt: res.publishedAt }
            : p
        )
      )
      showNotification(
        "success",
        res.isPublished ? "Article published" : "Article reverted to draft"
      )
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to toggle publish status"
      showNotification("error", msg)
    } finally {
      setTogglingId(null)
    }
  }

  // Confirm delete post
  const handleDeletePost = async () => {
    if (!postToDelete) return
    setIsDeleting(true)
    try {
      await deletePost(postToDelete.id)
      setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id))
      showNotification("success", `Deleted "${postToDelete.title}"`)
      setPostToDelete(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete post"
      showNotification("error", msg)
    } finally {
      setIsDeleting(false)
    }
  }

  // Create Category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatName.trim()) return

    setIsCreatingCat(true)
    try {
      const res = await createCategory({
        name: newCatName.trim(),
        description: newCatDesc.trim() || undefined,
      })
      setCategories((prev) => [...prev, { ...res.category, _count: { posts: 0 } }])
      setNewCatName("")
      setNewCatDesc("")
      showNotification("success", `Category "${res.category.name}" created`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create category"
      showNotification("error", msg)
    } finally {
      setIsCreatingCat(false)
    }
  }

  // Delete Category
  const handleDeleteCategory = async () => {
    if (!catToDelete) return
    try {
      await deleteCategory(catToDelete.id)
      setCategories((prev) => prev.filter((c) => c.id !== catToDelete.id))
      // Update local posts if they had this category
      setPosts((prev) =>
        prev.map((p) => (p.category?.id === catToDelete.id ? { ...p, category: null } : p))
      )
      showNotification("success", `Category "${catToDelete.name}" removed`)
      setCatToDelete(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete category"
      showNotification("error", msg)
    }
  }

  return (
    <div className="space-y-6">
      {/* Feedback Notification Banner */}
      {feedback && (
        <div
          className={`p-3 rounded-xl border text-sm flex items-center justify-between transition-all ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
              : "bg-red-500/10 border-red-500/20 text-red-300"
          }`}
        >
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs opacity-60 hover:opacity-100 ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Controls Bar: Search, Filters, Category Modal trigger */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white/[0.02] border border-white/10 rounded-xl p-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by title, slug, or tag..."
            className="pl-9 bg-black/40 border-white/10 text-sm h-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center bg-black/40 border border-white/10 rounded-lg p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === "all"
                  ? "bg-white text-black font-semibold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              All ({posts.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("published")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === "published"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Published ({posts.filter((p) => p.isPublished).length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("draft")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === "draft"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Drafts ({posts.filter((p) => !p.isPublished).length})
            </button>
          </div>

          {/* Category Dropdown Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-lg text-xs text-white/80 px-3 py-2 outline-none cursor-pointer hover:border-white/20"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Manage Categories Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCategoryModal(true)}
            className="text-xs h-9 border-white/10 gap-1.5 text-white/70 hover:text-white"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Categories ({categories.length})
          </Button>
        </div>
      </div>

      {/* Posts Table */}
      <div
        className={`bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden transition-opacity ${
          isUpdating ? "opacity-75 pointer-events-none" : ""
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.02]">
              <tr>
                <th className="px-4 py-4 w-12 text-center text-white/40">#</th>
                <th className="px-6 py-4 font-medium text-white/60">Article</th>
                <th className="px-6 py-4 font-medium text-white/60">Category</th>
                <th className="px-6 py-4 font-medium text-white/60">Status</th>
                <th className="px-6 py-4 font-medium text-white/60">Featured</th>
                <th className="px-6 py-4 font-medium text-white/60">Read Time</th>
                <th className="px-6 py-4 font-medium text-white/60">Published</th>
                <th className="px-6 py-4 font-medium text-white/60 text-right">Actions</th>
              </tr>
            </thead>

            {filteredPosts.length === 0 ? (
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-white/40">
                    <div className="max-w-sm mx-auto space-y-3">
                      <Tag className="h-8 w-8 mx-auto text-white/20" />
                      <div className="text-white/80 font-medium">No blog posts found</div>
                      <p className="text-xs text-white/40">
                        {searchQuery || statusFilter !== "all" || selectedCategory !== "all"
                          ? "Try clearing your filters or search terms."
                          : "Get started by creating your first technical article."}
                      </p>
                      {!(searchQuery || statusFilter !== "all" || selectedCategory !== "all") && (
                        <Link href="/studio/blog/new" className="inline-block mt-2">
                          <Button size="sm" className="gap-2 bg-white text-black hover:bg-white/90">
                            <Plus className="h-3.5 w-3.5" />
                            Create First Post
                          </Button>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <tbody className="divide-y divide-white/5">
                  <SortableContext
                    items={filteredPosts.map((p) => p.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {filteredPosts.map((post) => (
                      <SortablePostRow
                        key={post.id}
                        post={post}
                        onTogglePublish={handleTogglePublish}
                        onDeleteClick={setPostToDelete}
                        isToggling={togglingId === post.id}
                      />
                    ))}
                  </SortableContext>
                </tbody>
              </DndContext>
            )}
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal open={Boolean(postToDelete)} onOpenChange={(open) => !open && setPostToDelete(null)}>
        <ModalContent className="max-w-md">
          <ModalHeader>
            <ModalTitle className="text-white text-lg">Delete Blog Post</ModalTitle>
            <ModalDescription className="text-white/60 text-sm">
              Are you sure you want to delete{" "}
              <span className="text-white font-medium">&ldquo;{postToDelete?.title}&rdquo;</span>? This action
              cannot be undone and will purge any uploaded cover assets.
            </ModalDescription>
          </ModalHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setPostToDelete(null)}
              disabled={isDeleting}
              className="border-white/10 text-white/80 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeletePost}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white gap-2"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete Article
            </Button>
          </div>
        </ModalContent>
      </Modal>

      {/* Category Manager Modal */}
      <Modal open={showCategoryModal} onOpenChange={setShowCategoryModal}>
        <ModalContent className="max-w-xl">
          <ModalHeader>
            <ModalTitle className="text-white text-lg flex items-center gap-2">
              <FolderPlus className="h-5 w-5 text-white/60" />
              Category Management
            </ModalTitle>
            <ModalDescription className="text-white/60 text-sm">
              Create, organize, and inspect blog taxonomy categories.
            </ModalDescription>
          </ModalHeader>

          {/* New Category Form */}
          <form onSubmit={handleCreateCategory} className="space-y-3 p-4 rounded-lg bg-white/[0.02] border border-white/10 mt-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Add New Category
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Category Name (e.g. Distributed Systems)"
                className="bg-black/40 border-white/10 text-xs h-9"
                required
              />
              <Input
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                placeholder="Optional description"
                className="bg-black/40 border-white/10 text-xs h-9"
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                disabled={isCreatingCat || !newCatName.trim()}
                className="bg-white text-black hover:bg-white/90 text-xs h-8 gap-1.5"
              >
                {isCreatingCat ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                Add Category
              </Button>
            </div>
          </form>

          {/* Categories List */}
          <div className="space-y-2 mt-4 max-h-60 overflow-y-auto pr-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">
              Existing Categories
            </div>
            {categories.length === 0 ? (
              <p className="text-xs text-white/40 italic p-3">No categories defined yet.</p>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
                >
                  <div>
                    <div className="text-sm font-medium text-white flex items-center gap-2">
                      {cat.name}
                      <span className="text-[11px] font-mono text-white/40 font-normal">
                        ({cat.slug})
                      </span>
                    </div>
                    {cat.description && (
                      <p className="text-xs text-white/50 line-clamp-1">{cat.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/40">
                      {cat._count?.posts ?? 0} {cat._count?.posts === 1 ? "post" : "posts"}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCatToDelete(cat)}
                      className="h-7 w-7 p-0 text-white/30 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ModalContent>
      </Modal>

      {/* Delete Category Confirmation */}
      <Modal open={Boolean(catToDelete)} onOpenChange={(open) => !open && setCatToDelete(null)}>
        <ModalContent className="max-w-md">
          <ModalHeader>
            <ModalTitle className="text-white text-lg">Remove Category</ModalTitle>
            <ModalDescription className="text-white/60 text-sm">
              Are you sure you want to remove{" "}
              <span className="text-white font-medium">&ldquo;{catToDelete?.name}&rdquo;</span>?
              {catToDelete?._count?.posts && catToDelete._count.posts > 0 ? (
                <span className="block mt-2 text-amber-300">
                  Note: {catToDelete._count.posts} posts currently assigned to this category will have
                  their category unassigned (set to null).
                </span>
              ) : null}
            </ModalDescription>
          </ModalHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setCatToDelete(null)}
              className="border-white/10 text-white/80 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteCategory}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Confirm Remove
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </div>
  )
}
