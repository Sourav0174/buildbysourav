import * as React from "react"
import Link from "next/link"
import { Calendar, Clock, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { BlogPostListItem } from "@/core/data/blog"

export function BlogCard({
  post,
  featured = false,
}: {
  post: BlogPostListItem
  featured?: boolean
}) {
  const formattedDate = post.publishedAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(post.publishedAt))
    : null

  if (featured) {
    return (
      <article className="group relative flex flex-col lg:flex-row gap-8 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 md:p-8 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300">
        {/* Featured Cover Image */}
        {post.coverImage ? (
          <div className="relative aspect-video lg:aspect-[16/10] lg:w-1/2 overflow-hidden rounded-2xl border border-white/10 bg-black/40 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="relative aspect-video lg:aspect-[16/10] lg:w-1/2 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.01] shrink-0 flex items-center justify-center p-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-white/30">Engineering Deep Dive</span>
              <div className="text-xl font-semibold text-white/50">{post.category?.name || "Article"}</div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs text-white/50">
              <Badge variant="default" className="bg-white text-black text-xs font-semibold px-2.5 py-0.5">
                Featured
              </Badge>
              {post.category && (
                <span className="font-mono text-white/70 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                  {post.category.name}
                </span>
              )}
              {formattedDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  <time dateTime={post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined}>
                    {formattedDate}
                  </time>
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                {post.readingTime}
              </span>
            </div>

            <Link href={`/blog/${post.slug}`} className="block group-hover:text-white transition-colors">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white/95 leading-tight flex items-start justify-between gap-4">
                <span>{post.title}</span>
                <ArrowUpRight className="h-5 w-5 text-white/30 shrink-0 mt-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
              </h2>
            </Link>

            {post.excerpt && (
              <p className="text-base text-white/60 leading-relaxed line-clamp-3 font-light">
                {post.excerpt}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.authorAvatar || "/profile2.png"}
                alt={post.authorName}
                className="h-8 w-8 rounded-full border border-white/10 object-cover bg-white/5"
              />
              <div>
                <div className="text-xs font-medium text-white">{post.authorName}</div>
                <div className="text-[11px] text-white/40">{post.authorRole}</div>
              </div>
            </div>

            {post.tags.length > 0 && (
              <div className="hidden sm:flex items-center gap-1.5">
                {post.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono text-white/50 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-5 md:p-6 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300">
      <div className="space-y-4">
        {/* Card Cover Image */}
        {post.coverImage && (
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-white/50">
          {post.category && (
            <span className="font-mono text-xs text-white/70 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
              {post.category.name}
            </span>
          )}
          {formattedDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <time dateTime={post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined}>
                {formattedDate}
              </time>
            </span>
          )}
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readingTime}
          </span>
        </div>

        {/* Title */}
        <Link href={`/blog/${post.slug}`} className="block group-hover:text-white transition-colors">
          <h3 className="text-xl font-bold tracking-tight text-white/90 leading-snug flex items-start justify-between gap-2">
            <span>{post.title}</span>
            <ArrowUpRight className="h-4 w-4 text-white/30 shrink-0 mt-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
          </h3>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm text-white/60 leading-relaxed line-clamp-2 font-light">
            {post.excerpt}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/10">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.authorAvatar || "/profile2.png"}
            alt={post.authorName}
            className="h-7 w-7 rounded-full border border-white/10 object-cover bg-white/5"
          />
          <span className="text-xs font-medium text-white/80">{post.authorName}</span>
        </div>

        {post.tags.length > 0 && (
          <span className="text-[11px] font-mono text-white/40">
            #{post.tags[0]}
          </span>
        )}
      </div>
    </article>
  )
}
