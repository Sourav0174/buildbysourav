'use server'

import { prisma } from '@/core/db/prisma'
import { revalidatePath } from 'next/cache'
import { verifySession } from '@/core/auth/session'

export async function createService() {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  const count = await prisma.service.count()
  
  const service = await prisma.service.create({
    data: {
      title: "New Service",
      description: "Description of the new service.",
      who: "Who this service is for.",
      color: "#ffffff",
      deliverables: [],
      tech: [],
      products: [],
      order: count
    }
  })

  revalidatePath('/studio/services')
  revalidatePath('/services')
  return { success: true, id: service.id }
}

export async function updateService(id: string, data: any) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  await prisma.service.update({
    where: { id },
    data
  })

  revalidatePath('/studio/services')
  revalidatePath('/services')
  return { success: true }
}

export async function deleteService(id: string) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  await prisma.service.delete({
    where: { id }
  })

  revalidatePath('/studio/services')
  revalidatePath('/services')
  return { success: true }
}

export async function reorderServices(updates: { id: string, order: number }[]) {
  const session = await verifySession()
  if (!session?.isAuth) throw new Error("Unauthorized")

  await prisma.$transaction(
    updates.map((u) => 
      prisma.service.update({
        where: { id: u.id },
        data: { order: u.order }
      })
    )
  )

  revalidatePath('/studio/services')
  revalidatePath('/services')
  return { success: true }
}
