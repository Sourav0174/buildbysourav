import { prisma } from './src/core/db/prisma'

async function main() {
  // Clear existing if any
  await prisma.post.deleteMany();

  await prisma.post.create({
    data: {
      slug: 'hello-world-post',
      title: 'Hello World',
      excerpt: 'This is a test published post.',
      content: '# Hello World\n\nThis is a *test* post with **Markdown**.\n\n- Item 1\n- Item 2\n\n```ts\nconsole.log("hello");\n```',
      isPublished: true,
      publishedAt: new Date()
    }
  })

  await prisma.post.create({
    data: {
      slug: 'draft-post',
      title: 'Draft Post',
      excerpt: 'This is a draft post.',
      content: 'This should not be visible.',
      isPublished: false
    }
  })
}

main()
  .then(async () => {
    console.log("Successfully seeded posts")
    process.exit(0)
  })
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
