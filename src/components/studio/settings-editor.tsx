'use client'

import * as React from "react"
import { Save, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { saveSettings, type SettingsFormData } from "@/core/actions/settings"

export function SettingsEditor({ initialData }: { initialData: SettingsFormData }) {
  const [formData, setFormData] = React.useState<SettingsFormData>(initialData)
  const [isSaving, setIsSaving] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState("")
  const [successMsg, setSuccessMsg] = React.useState("")
  
  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialData)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrorMsg("")
    setSuccessMsg("")
  }

  const handleSave = async () => {
    setIsSaving(true)
    setErrorMsg("")
    setSuccessMsg("")
    try {
      await saveSettings(formData)
      setSuccessMsg("Settings saved successfully.")
      // Update initial data logic handled by Next.js revalidatePath causing a refresh
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to save settings. Please check your inputs.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-[#050505] border border-white/10 rounded-xl overflow-hidden relative">
      {/* Sticky Header with Save Button */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 md:p-6 bg-[#050505]/90 backdrop-blur-md border-b border-white/10">
        <div>
          <h2 className="text-lg font-medium text-white">General Settings</h2>
          <p className="text-sm text-white/40">These values are used across the public website.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={!isDirty || isSaving}
          className="gap-2"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <div className="p-4 md:p-6 space-y-8">
        {errorMsg && (
          <div className="flex items-center gap-2 text-sm text-red-500/80 bg-red-500/10 p-4 rounded-lg border border-red-500/20">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {errorMsg}
          </div>
        )}
        
        {successMsg && !isDirty && (
          <div className="flex items-center gap-2 text-sm text-green-500/80 bg-green-500/10 p-4 rounded-lg border border-green-500/20">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-lg font-medium border-b border-white/10 pb-2">Site Identity</h3>
            
            <div className="space-y-2">
              <label htmlFor="siteName" className="text-sm font-medium text-white/80">Site Name</label>
              <Input 
                id="siteName" 
                name="siteName" 
                value={formData.siteName} 
                onChange={handleChange} 
                className="bg-white/5 border-white/10 h-10" 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="siteDesc" className="text-sm font-medium text-white/80">Site Description</label>
              <Textarea 
                id="siteDesc" 
                name="siteDesc" 
                value={formData.siteDesc} 
                onChange={handleChange} 
                className="bg-white/5 border-white/10 min-h-[100px] resize-none" 
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium border-b border-white/10 pb-2">Social Links</h3>
            
            <div className="space-y-2">
              <label htmlFor="resumeUrl" className="text-sm font-medium text-white/80">Resume URL</label>
              <Input 
                id="resumeUrl" 
                name="resumeUrl" 
                value={formData.resumeUrl || ""} 
                onChange={handleChange} 
                placeholder="https://..."
                className="bg-white/5 border-white/10 h-10" 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="githubUrl" className="text-sm font-medium text-white/80">GitHub URL</label>
              <Input 
                id="githubUrl" 
                name="githubUrl" 
                value={formData.githubUrl || ""} 
                onChange={handleChange} 
                placeholder="https://github.com/..."
                className="bg-white/5 border-white/10 h-10" 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="twitterUrl" className="text-sm font-medium text-white/80">Twitter / X URL</label>
              <Input 
                id="twitterUrl" 
                name="twitterUrl" 
                value={formData.twitterUrl || ""} 
                onChange={handleChange} 
                placeholder="https://twitter.com/..."
                className="bg-white/5 border-white/10 h-10" 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="linkedinUrl" className="text-sm font-medium text-white/80">LinkedIn URL</label>
              <Input 
                id="linkedinUrl" 
                name="linkedinUrl" 
                value={formData.linkedinUrl || ""} 
                onChange={handleChange} 
                placeholder="https://linkedin.com/in/..."
                className="bg-white/5 border-white/10 h-10" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
