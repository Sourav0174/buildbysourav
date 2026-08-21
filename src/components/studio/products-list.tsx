'use client'

import * as React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, ExternalLink, GripVertical } from "lucide-react"
import { reorderProducts } from "@/core/actions/products"
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

type Product = {
  id: string
  title: string | null
  slug: string
  status: string
  isFeatured: boolean
  order: number
}

function SortableTableRow({ product }: { product: Product }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    position: 'relative' as const,
  }

  return (
    <tr 
      ref={setNodeRef} 
      style={style} 
      className={`hover:bg-white/[0.02] transition-colors ${isDragging ? 'bg-white/5 opacity-80 shadow-xl' : 'bg-transparent'}`}
    >
      <td className="px-4 py-4 w-12">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab hover:text-white text-white/40 flex items-center justify-center p-1"
        >
          <GripVertical className="h-5 w-5" />
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="font-medium text-white">{product.title || "Untitled Product"}</div>
        <div className="text-white/40">{product.slug}</div>
      </td>
      <td className="px-6 py-4">
        <Badge variant="outline" className="bg-white/5">{product.status}</Badge>
      </td>
      <td className="px-6 py-4">
        {product.isFeatured ? (
          <Badge variant="default" className="bg-white text-black">Featured</Badge>
        ) : null}
      </td>
      <td className="px-6 py-4 text-right space-x-2">
        <Link href={`/studio/products/${product.id}`}>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Pencil className="h-4 w-4" />
          </Button>
        </Link>
        <Link href={`/products/${product.slug}`} target="_blank">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </Link>
      </td>
    </tr>
  )
}

export function ProductsListClient({ initialProducts }: { initialProducts: Product[] }) {
  const [items, setItems] = React.useState(initialProducts)
  const [isUpdating, setIsUpdating] = React.useState(false)

  // Sync state if props change (e.g. from server action revalidation)
  React.useEffect(() => {
    setItems(initialProducts)
  }, [initialProducts])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id)
      const newIndex = items.findIndex(item => item.id === over.id)
      
      const newItems = arrayMove(items, oldIndex, newIndex)
      setItems(newItems)
      
      // Update backend
      setIsUpdating(true)
      try {
        await reorderProducts(newItems.map(item => item.id))
      } catch (error) {
        console.error("Failed to reorder products:", error)
        // Revert on failure
        setItems(items)
      } finally {
        setIsUpdating(false)
      }
    }
  }

  return (
    <div className={`bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden transition-opacity ${isUpdating ? 'opacity-70 pointer-events-none' : ''}`}>
      <table className="w-full text-left text-sm">
        <thead className="border-b border-white/10 bg-white/[0.02]">
          <tr>
            <th className="px-4 py-4 w-12"></th>
            <th className="px-6 py-4 font-medium text-white/60">Name</th>
            <th className="px-6 py-4 font-medium text-white/60">Status</th>
            <th className="px-6 py-4 font-medium text-white/60">Featured</th>
            <th className="px-6 py-4 font-medium text-white/60 text-right">Actions</th>
          </tr>
        </thead>
        
        {items.length === 0 ? (
          <tbody className="divide-y divide-white/5">
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-white/40">
                No products found. Create one to get started.
              </td>
            </tr>
          </tbody>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <tbody className="divide-y divide-white/5 relative">
              <SortableContext
                items={items.map(i => i.id)}
                strategy={verticalListSortingStrategy}
              >
                {items.map((product) => (
                  <SortableTableRow key={product.id} product={product} />
                ))}
              </SortableContext>
            </tbody>
          </DndContext>
        )}
      </table>
    </div>
  )
}
