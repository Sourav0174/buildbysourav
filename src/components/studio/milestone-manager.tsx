'use client'

import * as React from "react"
import { Loader2, Plus, Pencil, Trash2, GripVertical, Check, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { createMilestone, updateMilestone, deleteMilestone, reorderMilestones } from "@/core/actions/milestones"
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

type Milestone = {
  id: string
  year: string
  title: string
  description: string
  order: number
}

function SortableMilestoneRow({ 
  milestone, 
  onEdit, 
  onDelete 
}: { 
  milestone: Milestone, 
  onEdit: (m: Milestone) => void, 
  onDelete: (id: string) => void 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: milestone.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    position: 'relative' as const,
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`flex items-start gap-4 p-4 rounded-xl border border-white/10 hover:bg-white/[0.02] transition-colors ${isDragging ? 'bg-white/5 opacity-80 shadow-xl' : 'bg-transparent'}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab hover:text-white text-white/40 pt-1"
      >
        <GripVertical className="h-5 w-5" />
      </div>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-white/40">{milestone.year}</span>
          <span className="font-semibold text-white/90">{milestone.title}</span>
        </div>
        <p className="text-sm text-white/60 line-clamp-2">{milestone.description}</p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => onEdit(milestone)} className="h-8 w-8 p-0">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(milestone.id)} className="h-8 w-8 p-0 text-red-500/70 hover:text-red-500 hover:bg-red-500/10">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function MilestoneManager({ initialMilestones }: { initialMilestones: Milestone[] }) {
  const [items, setItems] = React.useState(initialMilestones)
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [formData, setFormData] = React.useState({ year: "", title: "", description: "" })

  React.useEffect(() => {
    setItems(initialMilestones)
  }, [initialMilestones])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id)
        const newIndex = items.findIndex(i => i.id === over.id)
        const newItems = arrayMove(items, oldIndex, newIndex)
        
        setIsUpdating(true)
        reorderMilestones(newItems.map(i => i.id))
          .finally(() => setIsUpdating(false))
          
        return newItems
      })
    }
  }

  const handleSave = async () => {
    if (!formData.year || !formData.title || !formData.description) return
    setIsUpdating(true)
    try {
      if (editingId) {
        await updateMilestone(editingId, formData)
      } else {
        await createMilestone(formData)
      }
      setEditingId(null)
      setFormData({ year: "", title: "", description: "" })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this milestone?")) {
      setIsUpdating(true)
      await deleteMilestone(id)
      setIsUpdating(false)
    }
  }

  const startEdit = (m: Milestone) => {
    setEditingId(m.id)
    setFormData({ year: m.year, title: m.title, description: m.description })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData({ year: "", title: "", description: "" })
  }

  return (
    <div className="bg-[#050505] border border-white/10 rounded-xl overflow-hidden">
      <div className="p-4 md:p-6 bg-[#050505]/90 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-white">Milestones</h2>
          <p className="text-sm text-white/40">Manage your timeline on the About page.</p>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-8">
        {/* Form */}
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 md:p-6 space-y-4">
          <h3 className="text-sm font-medium text-white/80 border-b border-white/10 pb-2 mb-4">
            {editingId ? "Edit Milestone" : "Add New Milestone"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <label className="text-xs text-white/60 mb-1 block">Year</label>
              <Input 
                value={formData.year} 
                onChange={e => setFormData({ ...formData, year: e.target.value })} 
                placeholder="2024"
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="md:col-span-3">
              <label className="text-xs text-white/60 mb-1 block">Title</label>
              <Input 
                value={formData.title} 
                onChange={e => setFormData({ ...formData, title: e.target.value })} 
                placeholder="Senior Engineer at..."
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>
          
          <div>
            <label className="text-xs text-white/60 mb-1 block">Description</label>
            <Textarea 
              value={formData.description} 
              onChange={e => setFormData({ ...formData, description: e.target.value })} 
              placeholder="Led the development of..."
              className="bg-white/5 border-white/10 resize-none h-20"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button onClick={handleSave} disabled={isUpdating || !formData.year || !formData.title || !formData.description}>
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : (editingId ? <Check className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />)}
              {editingId ? "Save Changes" : "Add Milestone"}
            </Button>
            {editingId && (
              <Button variant="ghost" onClick={cancelEdit}>
                <X className="h-4 w-4 mr-2" /> Cancel
              </Button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="space-y-3 relative">
          {isUpdating && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-[1px] rounded-xl">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          )}
          
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
              {items.map((milestone) => (
                <SortableMilestoneRow 
                  key={milestone.id} 
                  milestone={milestone} 
                  onEdit={startEdit}
                  onDelete={handleDelete}
                />
              ))}
            </SortableContext>
          </DndContext>

          {items.length === 0 && (
            <div className="text-center p-8 text-white/40 text-sm border border-white/5 rounded-xl border-dashed">
              No milestones found. Add one above.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
