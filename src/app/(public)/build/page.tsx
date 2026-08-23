import { prisma } from "@/core/db/prisma"
import { BuildClient } from "./build-client"

export const metadata = {
  title: "Let's Build | The Workspace",
  description: "I partner with ambitious companies to build scalable products and solve complex engineering challenges.",
}

export default async function BuildPage() {
  const faqs = await prisma.faq.findMany({
    orderBy: { order: 'asc' }
  })

  return <BuildClient faqs={faqs} />
}
