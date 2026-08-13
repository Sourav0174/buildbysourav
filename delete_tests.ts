import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const result = await prisma.post.deleteMany({
    where: {
      slug: {
        in: ['hello-world-post', 'draft-post']
      }
    }
  })
  console.log('Deleted test posts:', result)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
