'use client'

import * as React from "react"
import { motion } from "framer-motion"
import { 
  Plus, Edit2, Trash2, GripVertical, Check, X,
  Save, AlertCircle, Eye, EyeOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import {
  createService,
  updateService,
  deleteService,
  reorderServices
} from "@/core/actions/services"

// Using JSON fields as strings for simplicity in editing
type Service = {
  id: string
  title: string
  description: string
  who: string
  deliverables: any
  tech: any
  products: any
  color: string
  order: number
}

export function ServiceManager({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = React.useState<Service[]>(initialServices)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editForm, setEditForm] = React.useState<Partial<Service>>({})
  const [isSaving, setIsSaving] = React.useState(false)

  React.useEffect(() => {
    setServices(initialServices)
  }, [initialServices])

  const handleCreate = async () => {
    setIsSaving(true)
    try {
      const res = await createService()
      if (res.success) {
        setServices([...services, {
          id: res.id,
          title: "New Service",
          description: "Description of the new service.",
          who: "Who this service is for.",
          color: "#ffffff",
          deliverables: [],
          tech: [],
          products: [],
          order: services.length
        }])
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (service: Service) => {
    setEditingId(service.id)
    setEditForm({
      title: service.title,
      description: service.description,
      who: service.who,
      color: service.color,
      deliverables: Array.isArray(service.deliverables) ? service.deliverables.join(', ') : "",
      tech: Array.isArray(service.tech) ? service.tech.join(', ') : "",
      products: Array.isArray(service.products) ? service.products.join(', ') : ""
    } as any) // Type cast since we are using strings for the UI form for the array fields
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditForm({})
  }

  const handleSave = async (id: string) => {
    setIsSaving(true)
    try {
      const updatedData = {
        title: editForm.title || "",
        description: editForm.description || "",
        who: editForm.who || "",
        color: editForm.color || "#ffffff",
        deliverables: typeof editForm.deliverables === 'string' ? editForm.deliverables.split(',').map((s: string) => s.trim()).filter(Boolean) : editForm.deliverables,
        tech: typeof editForm.tech === 'string' ? editForm.tech.split(',').map((s: string) => s.trim()).filter(Boolean) : editForm.tech,
        products: typeof editForm.products === 'string' ? editForm.products.split(',').map((s: string) => s.trim()).filter(Boolean) : editForm.products,
      }

      await updateService(id, updatedData)
      setServices(services.map(s => s.id === id ? { ...s, ...updatedData } : s))
      setEditingId(null)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return
    setIsSaving(true)
    try {
      await deleteService(id)
      setServices(services.filter(s => s.id !== id))
    } finally {
      setIsSaving(false)
    }
  }

  const moveUp = async (index: number) => {
    if (index === 0) return
    const newServices = [...services]
    const temp = newServices[index]
    newServices[index] = newServices[index - 1]
    newServices[index - 1] = temp
    
    // Update order values
    newServices.forEach((s, i) => s.order = i)
    setServices(newServices)
    await reorderServices(newServices.map(s => ({ id: s.id, order: s.order })))
  }

  const moveDown = async (index: number) => {
    if (index === services.length - 1) return
    const newServices = [...services]
    const temp = newServices[index]
    newServices[index] = newServices[index + 1]
    newServices[index + 1] = temp
    
    // Update order values
    newServices.forEach((s, i) => s.order = i)
    setServices(newServices)
    await reorderServices(newServices.map(s => ({ id: s.id, order: s.order })))
  }

  return (
    <div className="bg-[#050505] border border-white/10 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-4 md:p-6 bg-[#050505]/90 backdrop-blur-md border-b border-white/10">
        <div>
          <h2 className="text-lg font-medium text-white">Services</h2>
          <p className="text-sm text-white/40">Manage the services displayed on the public site.</p>
        </div>
        <Button onClick={handleCreate} disabled={isSaving} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Service
        </Button>
      </div>

      <div className="p-4 md:p-6 space-y-4">
        {services.length === 0 && (
          <div className="text-center py-12 text-white/40 text-sm">
            No services configured yet.
          </div>
        )}

        {services.map((service, index) => (
          <Card key={service.id} className="p-4 bg-white/5 border-white/10 relative group">
            {editingId === service.id ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Title</label>
                  <Input 
                    value={editForm.title} 
                    onChange={e => setEditForm({...editForm, title: e.target.value})}
                    className="bg-black/50 border-white/10"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Description</label>
                  <Textarea 
                    value={editForm.description} 
                    onChange={e => setEditForm({...editForm, description: e.target.value})}
                    className="bg-black/50 border-white/10 min-h-[80px]"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/60 mb-1 block">Who is this for?</label>
                  <Input 
                    value={editForm.who} 
                    onChange={e => setEditForm({...editForm, who: e.target.value})}
                    className="bg-black/50 border-white/10"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/60 mb-1 block">Deliverables (comma separated)</label>
                  <Input 
                    value={editForm.deliverables as any} 
                    onChange={e => setEditForm({...editForm, deliverables: e.target.value as any})}
                    className="bg-black/50 border-white/10"
                    placeholder="Database Schema, API Layer, Web App..."
                  />
                </div>
                
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Technologies (comma separated)</label>
                  <Input 
                    value={editForm.tech as any} 
                    onChange={e => setEditForm({...editForm, tech: e.target.value as any})}
                    className="bg-black/50 border-white/10"
                    placeholder="Next.js, PostgreSQL, Tailwind..."
                  />
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t border-white/10">
                  <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isSaving}>Cancel</Button>
                  <Button size="sm" onClick={() => handleSave(service.id)} disabled={isSaving}>Save</Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                <div className="flex flex-col gap-1 text-white/20">
                  <button onClick={() => moveUp(index)} disabled={index === 0} className="hover:text-white transition-colors disabled:opacity-30">
                    <GripVertical className="h-4 w-4" />
                  </button>
                  <button onClick={() => moveDown(index)} disabled={index === services.length - 1} className="hover:text-white transition-colors disabled:opacity-30">
                    <GripVertical className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-white mb-1">{service.title}</h3>
                  <p className="text-sm text-white/60 line-clamp-2">{service.description}</p>
                </div>

                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white" onClick={() => handleEdit(service)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300" onClick={() => handleDelete(service.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
