import { prisma } from "@/core/db/prisma"
import { AboutClient } from "./about-client"

export default async function AboutPage() {
  const settings = await prisma.settings.findFirst()
  const milestones = await prisma.milestone.findMany({
    orderBy: { order: 'asc' }
  })

  const safeSettings = settings ? {
    resumeUrl: settings.resumeUrl,
    githubUrl: settings.githubUrl,
    twitterUrl: settings.twitterUrl,
    linkedinUrl: settings.linkedinUrl
  } : {
    resumeUrl: null,
    githubUrl: null,
    twitterUrl: null,
    linkedinUrl: null
  }

  // Map to simple objects for the client
  const timeline = milestones.map(m => ({
    id: m.id,
    year: m.year,
    title: m.title,
    description: m.description,
    order: m.order
  }))

  return <AboutClient settings={safeSettings} timeline={timeline} />
}
