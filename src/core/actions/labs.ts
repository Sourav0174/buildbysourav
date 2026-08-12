'use server'

import { prisma } from '@/core/db/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { verifySession } from '@/core/auth/session'

export async function createLab() {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  const lab = await prisma.lab.create({
    data: {
      title: 'Untitled Lab',
      description: '',
      url: '',
      category: 'Experiment',
    }
  })
  
  redirect(`/studio/labs/${lab.id}`)
}

const updateLabSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().default(""),
  url: z.string().optional().default(""),
  category: z.string().min(1, "Category is required"),
})

export async function updateLab(id: string, data: unknown) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  const parsed = updateLabSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error("Invalid lab data")
  }

  await prisma.lab.update({
    where: { id },
    data: parsed.data
  })
  revalidatePath(`/studio/labs`)
  revalidatePath(`/studio/labs/${id}`)
  revalidatePath(`/labs`) // Assuming a public labs page might exist
}

export async function deleteLab(id: string) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  await prisma.lab.delete({
    where: { id }
  })
  revalidatePath(`/studio/labs`)
  redirect('/studio/labs')
}
