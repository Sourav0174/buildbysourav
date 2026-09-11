import { redirect } from "next/navigation"
import { verifySession } from "@/core/auth/session"
import { createPost } from "@/core/actions/blog"

export default async function NewPostPage() {
  const session = await verifySession()
  if (!session?.isAuth) {
    redirect("/studio/login")
  }

  const res = await createPost({
    title: "Untitled Post",
    isPublished: false,
  })

  redirect(`/studio/blog/${res.post.id}`)
}
