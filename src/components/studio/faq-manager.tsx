'use client'

import * as React from "react"
import { Loader2, Plus, Pencil, Trash2, GripVertical, Check, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { createFaq, updateFaq, deleteFaq, reorderFaqs } from "@/core/actions/faqs"
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

type Faq = {
  id: string
  question: string
  answer: string
  order: number
}

function SortableFaqRow({ 
  faq, 
  onEdit, 
  onDelete 
}: { 
  faq: Faq, 
  onEdit: (f: Faq) => void, 
  onDelete: (id: string) => void 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: faq.id })

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
        <div className="font-semibold text-white/90">{faq.question}</div>
        <p className="text-sm text-white/60 line-clamp-3">{faq.answer}</p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => onEdit(faq)} className="h-8 w-8 p-0">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(faq.id)} className="h-8 w-8 p-0 text-red-500/70 hover:text-red-500 hover:bg-red-500/10">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function FaqManager({ initialFaqs }: { initialFaqs: Faq[] }) {
  const [items, setItems] = React.useState(initialFaqs)
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [formData, setFormData] = React.useState({ question: "", answer: "" })

  React.useEffect(() => {
    setItems(initialFaqs)
  }, [initialFaqs])

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
        reorderFaqs(newItems.map(i => i.id))
          .finally(() => setIsUpdating(false))
          
        return newItems
      })
    }
  }

  const handleSave = async () => {
    if (!formData.question || !formData.answer) return
    setIsUpdating(true)
    try {
      if (editingId) {
        await updateFaq(editingId, formData)
      } else {
        await createFaq(formData)
      }
      setEditingId(null)
      setFormData({ question: "", answer: "" })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      setIsUpdating(true)
      await deleteFaq(id)
      setIsUpdating(false)
    }
  }

  const startEdit = (f: Faq) => {
    setEditingId(f.id)
    setFormData({ question: f.question, answer: f.answer })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData({ question: "", answer: "" })
  }

  return (
    <div className="bg-[#050505] border border-white/10 rounded-xl overflow-hidden mt-8">
      <div className="p-4 md:p-6 bg-[#050505]/90 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-white">Frequently Asked Questions</h2>
          <p className="text-sm text-white/40">Manage the FAQs displayed on the Build page.</p>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-8">
        {/* Form */}
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 md:p-6 space-y-4">
          <h3 className="text-sm font-medium text-white/80 border-b border-white/10 pb-2 mb-4">
            {editingId ? "Edit FAQ" : "Add New FAQ"}
          </h3>
          
          <div>
            <label className="text-xs text-white/60 mb-1 block">Question</label>
            <Input 
              value={formData.question} 
              onChange={e => setFormData({ ...formData, question: e.target.value })} 
              placeholder="What is your typical engagement size?"
              className="bg-white/5 border-white/10"
            />
          </div>
          
          <div>
            <label className="text-xs text-white/60 mb-1 block">Answer</label>
            <Textarea 
              value={formData.answer} 
              onChange={e => setFormData({ ...formData, answer: e.target.value })} 
              placeholder="I typically take on projects starting at..."
              className="bg-white/5 border-white/10 resize-none min-h-[100px]"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button onClick={handleSave} disabled={isUpdating || !formData.question || !formData.answer}>
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : (editingId ? <Check className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />)}
              {editingId ? "Save Changes" : "Add FAQ"}
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
              {items.map((faq) => (
                <SortableFaqRow 
                  key={faq.id} 
                  faq={faq} 
                  onEdit={startEdit}
                  onDelete={handleDelete}
                />
              ))}
            </SortableContext>
          </DndContext>

          {items.length === 0 && (
            <div className="text-center p-8 text-white/40 text-sm border border-white/5 rounded-xl border-dashed">
              No FAQs found. Add one above.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
