'use server'

import { prisma } from '@/core/db/prisma'
import { revalidatePath } from 'next/cache'
import { verifySession } from '@/core/auth/session'
import { z } from 'zod'

const FaqSchema = z.object({
  question: z.string().trim().min(1, "Question is required"),
  answer: z.string().trim().min(1, "Answer is required"),
})

export type FaqFormData = z.infer<typeof FaqSchema>

export async function createFaq(data: FaqFormData) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  const parsed = FaqSchema.parse(data)

  const lastFaq = await prisma.faq.findFirst({
    orderBy: { order: 'desc' }
  })
  
  const nextOrder = lastFaq ? lastFaq.order + 1 : 0

  await prisma.faq.create({
    data: {
      question: parsed.question,
      answer: parsed.answer,
      order: nextOrder
    }
  })

  revalidatePath('/studio', 'layout')
  revalidatePath('/build')
}

export async function updateFaq(id: string, data: FaqFormData) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  const parsed = FaqSchema.parse(data)

  await prisma.faq.update({
    where: { id },
    data: {
      question: parsed.question,
      answer: parsed.answer,
    }
  })

  revalidatePath('/studio', 'layout')
  revalidatePath('/build')
}

export async function deleteFaq(id: string) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  await prisma.faq.delete({
    where: { id }
  })

  revalidatePath('/studio', 'layout')
  revalidatePath('/build')
}

export async function reorderFaqs(orderedIds: string[]) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  const updates = orderedIds.map((id, index) => 
    prisma.faq.update({
      where: { id },
      data: { order: index }
    })
  )

  await prisma.$transaction(updates)
  
  revalidatePath('/studio', 'layout')
  revalidatePath('/build')
}
