"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { H1, H3, P } from "@/components/ui/typography"
import { Spotlight } from "@/components/ui/spotlight"

export type PostData = {
  id: string
  slug: string
  title: string
  excerpt: string
  publishedAt: Date | null
}

export function WritingClient({ posts }: { posts: PostData[] }) {
  return (
    <main className="min-h-screen relative pt-32 pb-24 overflow-hidden">
      <Spotlight />
      
      <Section className="relative z-10 mb-16">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <H1 className="text-5xl md:text-6xl tracking-tight mb-6">Writing</H1>
            <P className="text-xl md:text-2xl text-white/70 font-light leading-relaxed">
              Technical notes, architectural decisions, and essays on software engineering.
            </P>
          </motion.div>
        </Container>
      </Section>

      <Section className="relative z-10">
        <Container>
          {posts.length === 0 ? (
             <div className="py-24 text-left">
               <P className="text-white/40 text-lg">No posts have been published yet.</P>
             </div>
          ) : (
            <div className="max-w-3xl flex flex-col gap-12">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/writing/${post.slug}`} className="block group">
                    <article className="space-y-4">
                      {post.publishedAt && (
                        <time className="text-sm font-medium tracking-wider text-white/40 uppercase">
                          {new Intl.DateTimeFormat("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric"
                          }).format(new Date(post.publishedAt))}
                        </time>
                      )}
                      <H3 className="text-3xl font-bold tracking-tight text-white/90 group-hover:text-white transition-colors">
                        {post.title}
                      </H3>
                      <P className="text-lg text-white/60 leading-relaxed font-light line-clamp-3 group-hover:text-white/70 transition-colors">
                        {post.excerpt}
                      </P>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </main>
  )
}
