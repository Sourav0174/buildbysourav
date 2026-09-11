import * as React from "react"
import { MDXRemote } from "next-mdx-remote/rsc"
import { H1, H2, H3, P } from "@/components/ui/typography"
import { cn } from "@/core/utils/cn"
import { Info, AlertTriangle, CheckCircle2 } from "lucide-react"

function Callout({
  type = "default",
  title,
  children
}: {
  type?: "default" | "warning" | "success"
  title?: string
  children: React.ReactNode
}) {
  const styles = {
    default: "border-blue-500/30 bg-blue-500/5 text-blue-200/90",
    warning: "border-amber-500/30 bg-amber-500/5 text-amber-200/90",
    success: "border-emerald-500/30 bg-emerald-500/5 text-emerald-200/90",
  }

  const icons = {
    default: <Info className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />,
    warning: <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />,
    success: <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />,
  }

  return (
    <div className={cn("my-6 p-4 rounded-xl border flex gap-3 text-sm leading-relaxed", styles[type])}>
      {icons[type]}
      <div className="space-y-1">
        {title && <div className="font-semibold text-white/90">{title}</div>}
        <div className="text-white/70">{children}</div>
      </div>
    </div>
  )
}

export const defaultMdxComponents = {
  h1: (props: React.ComponentProps<"h1">) => (
    <H1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mt-12 mb-6 text-white/95" {...props} />
  ),
  h2: (props: React.ComponentProps<"h2">) => (
    <H2 className="text-2xl md:text-3xl font-bold mt-10 mb-4 tracking-tight text-white/90 border-b border-white/5 pb-2" {...props} />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <H3 className="text-xl md:text-2xl font-semibold mt-8 mb-3 tracking-tight text-white/85" {...props} />
  ),
  h4: (props: React.ComponentProps<"h4">) => (
    <h4 className="text-lg font-semibold mt-6 mb-2 text-white/80" {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <P className="text-base md:text-lg leading-relaxed text-white/70 mb-6 font-light" {...props} />
  ),
  a: ({ href, children, ...props }: React.ComponentProps<"a">) => {
    const isExternal = href?.startsWith("http")
    return (
      <a
        href={href}
        className="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors"
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
    )
  },
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="list-disc list-outside ml-6 space-y-2 mb-6 text-base md:text-lg text-white/70 font-light" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="list-decimal list-outside ml-6 space-y-2 mb-6 text-base md:text-lg text-white/70 font-light" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => (
    <li className="pl-1 leading-relaxed" {...props} />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote className="border-l-2 border-white/30 pl-6 italic text-white/60 my-6 bg-white/[0.01] py-2 rounded-r-lg" {...props} />
  ),
  pre: (props: React.ComponentProps<"pre">) => (
    <pre className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5 overflow-x-auto my-6 text-sm font-mono text-white/90 leading-relaxed shadow-lg" {...props} />
  ),
  code: ({ className, ...props }: React.ComponentProps<"code">) => {
    // If it is inside pre, avoid double styling
    if (className?.includes("language-")) {
      return <code className={className} {...props} />
    }
    return <code className="bg-white/10 text-white/90 rounded px-1.5 py-0.5 text-sm font-mono border border-white/5" {...props} />
  },
  table: (props: React.ComponentProps<"table">) => (
    <div className="overflow-x-auto my-8 border border-white/10 rounded-xl">
      <table className="w-full text-left text-sm text-white/80 divide-y divide-white/10" {...props} />
    </div>
  ),
  th: (props: React.ComponentProps<"th">) => (
    <th className="bg-white/5 px-4 py-3 font-semibold text-white/90" {...props} />
  ),
  td: (props: React.ComponentProps<"td">) => (
    <td className="px-4 py-3 border-t border-white/5" {...props} />
  ),
  hr: () => <hr className="border-white/10 my-10" />,
  // eslint-disable-next-line @next/next/no-img-element
  img: (props: React.ComponentProps<"img">) => <img className="rounded-xl border border-white/10 my-8 max-w-full h-auto" alt={props.alt || ""} {...props} />,
  Callout,
}

export function MdxRenderer({ content }: { content: string }) {
  if (!content || !content.trim()) {
    return <p className="text-white/40 italic">No content written yet.</p>
  }

  return <MDXRemote source={content} components={defaultMdxComponents} />
}
