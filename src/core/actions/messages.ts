'use server'

import { prisma } from '@/core/db/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { verifySession } from '@/core/auth/session'
import { z } from 'zod'

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
