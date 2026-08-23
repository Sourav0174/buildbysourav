'use server'

import { prisma } from '@/core/db/prisma'
import { revalidatePath } from 'next/cache'
import { verifySession } from '@/core/auth/session'
import { z } from 'zod'

const MilestoneSchema = z.object({
  year: z.string().trim().min(1, "Year is required"),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
})

export type MilestoneFormData = z.infer<typeof MilestoneSchema>

export async function createMilestone(data: MilestoneFormData) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  const parsed = MilestoneSchema.parse(data)

  const lastMilestone = await prisma.milestone.findFirst({
    orderBy: { order: 'desc' }
  })
  
  const nextOrder = lastMilestone ? lastMilestone.order + 1 : 0

  await prisma.milestone.create({
    data: {
      year: parsed.year,
      title: parsed.title,
      description: parsed.description,
      order: nextOrder
    }
  })

  revalidatePath('/studio', 'layout')
  revalidatePath('/about')
}

export async function updateMilestone(id: string, data: MilestoneFormData) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  const parsed = MilestoneSchema.parse(data)

  await prisma.milestone.update({
    where: { id },
    data: {
      year: parsed.year,
      title: parsed.title,
      description: parsed.description,
    }
  })

  revalidatePath('/studio', 'layout')
  revalidatePath('/about')
}

export async function deleteMilestone(id: string) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  await prisma.milestone.delete({
    where: { id }
  })

  revalidatePath('/studio', 'layout')
  revalidatePath('/about')
}

export async function reorderMilestones(orderedIds: string[]) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  const updates = orderedIds.map((id, index) => 
    prisma.milestone.update({
      where: { id },
      data: { order: index }
    })
  )

  await prisma.$transaction(updates)
  
  revalidatePath('/studio', 'layout')
  revalidatePath('/about')
}
