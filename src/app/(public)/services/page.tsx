import { prisma } from "@/core/db/prisma"
import { ServicesClient } from "./services-client"

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { order: 'asc' }
  })

  return <ServicesClient services={services} />
}

// testing