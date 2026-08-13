'use server'

import { prisma } from '@/core/db/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { verifySession } from '@/core/auth/session'
import { z } from 'zod'

const CreateMessageSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().trim().email("Invalid email address").max(150, "Email is too long"),
  details: z.string().trim().min(10, "Message is too short").max(5000, "Message is too long")
})

export async function createMessage(prevState: unknown, formData: FormData) {
  try {
    const rawData = {
      name: formData.get('name'),
      email: formData.get('email'),
      details: formData.get('details'),
    }

    const parsed = CreateMessageSchema.safeParse(rawData)
    
    if (!parsed.success) {
      return { 
        success: false, 
        error: parsed.error.issues[0].message 
      }
    }

    await prisma.message.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        content: parsed.data.details
      }
    })

    return { success: true, error: null }
  } catch (error) {
    console.error("Failed to create message:", error)
    return { success: false, error: "An unexpected error occurred. Please try again later." }
  }
}

export async function deleteMessage(id: string) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  await prisma.message.delete({
    where: { id }
  })
  revalidatePath(`/studio/messages`)
  redirect('/studio/messages')
}

export async function toggleMessageReadStatus(id: string, isRead: boolean) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  await prisma.message.update({
    where: { id },
    data: { isRead }
  })
  
  revalidatePath(`/studio/messages`)
  revalidatePath(`/studio/messages/${id}`)
}
