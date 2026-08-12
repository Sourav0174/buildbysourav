'use server'

import { prisma } from '@/core/db/prisma'
import { revalidatePath } from 'next/cache'
import { verifySession } from '@/core/auth/session'
import { z } from 'zod'

const settingsSchema = z.object({
  siteName: z.string().min(1, "Site Name is required").max(100),
  siteDesc: z.string().min(1, "Site Description is required").max(300),
  resumeUrl: z.string().url("Must be a valid URL").or(z.literal("")).nullable().optional(),
  githubUrl: z.string().url("Must be a valid URL").or(z.literal("")).nullable().optional(),
  twitterUrl: z.string().url("Must be a valid URL").or(z.literal("")).nullable().optional(),
  linkedinUrl: z.string().url("Must be a valid URL").or(z.literal("")).nullable().optional(),
})

export type SettingsFormData = z.infer<typeof settingsSchema>

export async function saveSettings(data: SettingsFormData) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  const parsed = settingsSchema.parse(data)
  
  // Transform empty strings to null for the database
  const normalized = {
    siteName: parsed.siteName,
    siteDesc: parsed.siteDesc,
    resumeUrl: parsed.resumeUrl || null,
    githubUrl: parsed.githubUrl || null,
    twitterUrl: parsed.twitterUrl || null,
    linkedinUrl: parsed.linkedinUrl || null,
  }

  // Find existing settings row, if any
  const existing = await prisma.settings.findFirst()

  if (existing) {
    await prisma.settings.update({
      where: { id: existing.id },
      data: normalized
    })
  } else {
    await prisma.settings.create({
      data: normalized
    })
  }

  revalidatePath('/', 'layout') // Revalidate everything since settings are global
  return { success: true }
}
