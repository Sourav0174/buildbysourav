import { prisma } from "@/core/db/prisma"
import { LabsClient, LabData } from "./labs-client"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Labs | The Workspace",
  description: "A collection of experiments, open-source tools, and small side projects.",
}

export default async function LabsPage() {
  // Fetch labs server-side
  const dbLabs = await prisma.lab.findMany({
    orderBy: { createdAt: 'desc' }
  })

  // Normalize DB schema to UI expectations
  const labs: LabData[] = dbLabs.map(l => ({
    id: l.id,
    title: l.title,
    description: l.description,
    url: l.url,
    category: l.category
  }))

  return <LabsClient labs={labs} />
}
