import * as React from "react"
import { prisma } from "@/core/db/prisma"
import { H1, P } from "@/components/ui/typography"
import { SettingsEditor } from "@/components/studio/settings-editor"

export default async function StudioSettingsPage() {
  const settings = await prisma.settings.findFirst()

  const defaultSettings = {
    siteName: "The Workspace",
    siteDesc: "A premium software engineering portfolio.",
    resumeUrl: "",
    githubUrl: "",
    twitterUrl: "",
    linkedinUrl: "",
  }

  const initialData = settings ? {
    siteName: settings.siteName,
    siteDesc: settings.siteDesc,
    resumeUrl: settings.resumeUrl || "",
    githubUrl: settings.githubUrl || "",
    twitterUrl: settings.twitterUrl || "",
    linkedinUrl: settings.linkedinUrl || "",
  } : defaultSettings

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <H1 className="text-4xl tracking-tight mb-2">Settings</H1>
        <P className="text-white/60">Manage public configuration and links for your workspace.</P>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 md:p-6">
        <h3 className="text-blue-400 font-medium mb-1">Security Notice</h3>
        <p className="text-sm text-white/60 leading-relaxed">
          Authentication credentials (Username, Password, and Session Secret) are strictly managed via environment variables for maximum security. They are not stored in the database and cannot be edited here.
        </p>
      </div>

      <SettingsEditor initialData={initialData} />
    </div>
  )
}
