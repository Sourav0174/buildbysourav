import * as React from "react"
import { notFound } from "next/navigation"
import { prisma } from "@/core/db/prisma"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { H1, H3, P } from "@/components/ui/typography"
import { MDXRemote } from "next-mdx-remote/rsc"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Ensure params are available before fetching
export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  })

  if (!post || !post.isPublished) {
    return { title: "Not Found" }
  }

  return {
    title: `${post.title} | The Workspace`,
    description: post.excerpt,
  }
}

export default async function PostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  })

  // Return 404 if missing or unpublished
  if (!post || !post.isPublished) {
    notFound()
  }

  // Custom components for Markdown rendering to match our typography system
  const mdxComponents = {
    h1: (props: React.ComponentProps<"h1">) => <H1 className="text-4xl md:text-5xl mt-12 mb-6 tracking-tight text-white/90" {...props} />,
    h2: (props: React.ComponentProps<"h2">) => <H3 className="text-2xl md:text-3xl font-bold mt-12 mb-6 tracking-tight text-white/90" {...props} />,
    h3: (props: React.ComponentProps<"h3">) => <h3 className="text-xl md:text-2xl font-bold mt-8 mb-4 tracking-tight text-white/80" {...props} />,
    p: (props: React.ComponentProps<"p">) => <P className="text-lg md:text-xl leading-relaxed text-white/70 mb-6 font-light" {...props} />,
    a: (props: React.ComponentProps<"a">) => <a className="text-white hover:text-white/80 underline underline-offset-4 decoration-white/20 transition-colors" {...props} />,
    ul: (props: React.ComponentProps<"ul">) => <ul className="list-disc list-outside ml-6 space-y-3 mb-6 text-lg md:text-xl text-white/70 font-light" {...props} />,
    ol: (props: React.ComponentProps<"ol">) => <ol className="list-decimal list-outside ml-6 space-y-3 mb-6 text-lg md:text-xl text-white/70 font-light" {...props} />,
    li: (props: React.ComponentProps<"li">) => <li className="pl-2 leading-relaxed" {...props} />,
    blockquote: (props: React.ComponentProps<"blockquote">) => <blockquote className="border-l-4 border-white/20 pl-6 italic text-white/50 my-8" {...props} />,
    pre: (props: React.ComponentProps<"pre">) => <pre className="bg-white/[0.02] border border-white/10 rounded-xl p-6 overflow-x-auto my-8 text-sm md:text-base font-mono text-white/80" {...props} />,
    code: (props: React.ComponentProps<"code">) => <code className="bg-white/10 rounded px-1.5 py-0.5 text-sm font-mono text-white/80" {...props} />,
    hr: () => <hr className="border-white/10 my-12" />
  }

  return (
    <main className="min-h-screen relative pt-32 pb-24 overflow-hidden bg-[#050505]">
      <Section className="relative z-10 mb-12">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Link 
              href="/writing"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/40 hover:text-white transition-colors mb-12"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Writing
            </Link>

            <header className="mb-16">
              {post.publishedAt && (
                <time className="text-sm font-medium tracking-wider text-white/40 uppercase block mb-4">
                  {new Intl.DateTimeFormat("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  }).format(new Date(post.publishedAt))}
                </time>
              )}
              <H1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight text-white/90">
                {post.title}
              </H1>
              <P className="text-xl md:text-2xl text-white/50 leading-relaxed font-light">
                {post.excerpt}
              </P>
            </header>
            
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-16" />
            
            <article className="prose prose-invert max-w-none">
              <MDXRemote source={post.content} components={mdxComponents} />
            </article>
          </div>
        </Container>
      </Section>
    </main>
  )
}
