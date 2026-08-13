import * as React from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { H1, H2, H3, P } from "@/components/ui/typography"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BrowserMockup } from "@/components/ui/mockup"
import { Stats } from "@/components/ui/stats"
import { ArchitecturePlaceholder } from "@/components/ui/architecture-placeholder"
import { prisma } from "@/core/db/prisma"
import { ArrowLeft, ArrowUpRight } from "lucide-react"

interface ProductLink {
  label: string
  url: string
}

interface EngineeringChallenge {
  title: string
  description: string
}

interface Metric {
  label: string
  value: string
}

interface EngineeringDecision {
  title: string
  description: string
  tradeoff: string
}

function safeParseJSON(val: unknown, fallback: unknown) {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val)
    } catch {
      return fallback
    }
  }
  return val ?? fallback
}

export const revalidate = 60 // Revalidate cache every 60 seconds

// Ensure static generation for known products
export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { slug: true }
  })
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const dbProduct = await prisma.product.findUnique({
    where: { slug }
  })

  if (!dbProduct) {
    notFound()
  }

  // Safely parse JSON fields and guarantee fallback shapes
  const product = {
    ...dbProduct,
    tech: safeParseJSON(dbProduct.tech, []),
    links: safeParseJSON(dbProduct.links, []),
    engineeringChallenges: safeParseJSON(dbProduct.engineeringChallenges, []),
    engineeringDecisions: safeParseJSON(dbProduct.engineeringDecisions, []),
    metrics: safeParseJSON(dbProduct.metrics, []),
    screenshots: safeParseJSON(dbProduct.screenshots, []),
    seo: safeParseJSON(dbProduct.seo, {}),
  }

  return (
    <main className="min-h-screen pt-32 pb-24 selection:bg-white/20">
      <Container>
        {/* Back Navigation */}
        <Link 
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-white/40 hover:text-white transition-colors mb-12"
        >
          <ArrowLeft className="h-4 w-4" />
          Ecosystem
        </Link>

        {/* Hero */}
        <header className="mb-24 md:mb-32">
          <div className="flex items-center gap-4 mb-8">
            <div 
              className="h-3 w-3 rounded-full" 
              style={{ backgroundColor: product.color || '#ffffff', boxShadow: `0 0 20px ${product.color || '#ffffff'}` }}
            />
            <Badge variant="outline" className="bg-white/5">{product.status.replace('_', ' ')}</Badge>
            <span className="text-sm font-medium text-white/40">{product.timeline}</span>
          </div>
          
          <H1 className="text-5xl md:text-6xl tracking-tight mb-6">{product.title}</H1>
          <P className="text-xl md:text-2xl text-white/70 max-w-3xl leading-snug">
            {product.tagline}
          </P>
          
          <div className="flex flex-wrap items-center gap-4 mt-12">
            {Array.isArray(product.links) && product.links.map((link: ProductLink) => (
              <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer">
                <Button variant={link.label.includes("Live") ? "default" : "outline"} className="gap-2 h-12 px-6">
                  {link.label}
                  {link.label.includes("Live") ? <ArrowUpRight className="h-4 w-4" /> : null}
                </Button>
              </a>
            ))}
          </div>
        </header>
        
        {/* Mockup Showcase */}
        <div className="mb-32 relative">
          <div 
            className="absolute -inset-20 blur-3xl opacity-10 -z-10 rounded-[3rem] pointer-events-none"
            style={{ backgroundColor: product.color || '#ffffff' }}
          />
          {product.heroImage ? (
            <div className="aspect-video w-full relative overflow-hidden rounded-2xl border border-white/10 bg-black/40">
              <Image 
                src={product.heroImage} 
                alt={`${product.title} interface`}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <BrowserMockup className="aspect-video w-full relative overflow-hidden bg-black/40 border-white/10">
              {/* Abstract Wireframe */}
              <div className="absolute inset-0 flex flex-col p-4 md:p-8 gap-4 opacity-30">
                {/* Fake Header */}
                <div className="h-10 w-full flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="h-4 w-32 bg-white/20 rounded-full" />
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-white/10" />
                    <div className="h-8 w-8 rounded-full bg-white/10" />
                  </div>
                </div>
                {/* Fake Content Area */}
                <div className="flex flex-1 gap-6">
                  <div className="w-1/4 h-full rounded-xl bg-white/5 border border-white/10 p-4 space-y-4 hidden md:block">
                    <div className="h-3 w-full bg-white/10 rounded-full" />
                    <div className="h-3 w-3/4 bg-white/10 rounded-full" />
                    <div className="h-3 w-5/6 bg-white/10 rounded-full" />
                    <div className="h-3 w-4/5 bg-white/10 rounded-full" />
                    <div className="h-3 w-full bg-white/10 rounded-full" />
                  </div>
                  <div className="flex-1 h-full rounded-xl border border-white/10 bg-white/[0.02] p-6 flex flex-col gap-6">
                     <div className="h-32 w-full rounded-lg bg-gradient-to-r from-white/5 to-transparent border border-white/5" />
                     <div className="flex-1 w-full rounded-lg bg-white/5 border border-white/5" />
                  </div>
                </div>
              </div>
            </BrowserMockup>
          )}
        </div>

        {/* Narrative & Architecture */}
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 mb-32">
          
          {/* Left Column: Story */}
          <div className="lg:col-span-7 space-y-24">
            <section>
              <H2 className="text-3xl mb-6">Overview</H2>
              <P className="text-lg text-white/70 leading-relaxed">{product.overview}</P>
            </section>
            
            <section>
              <H2 className="text-3xl mb-6">Why It Exists</H2>
              <P className="text-lg text-white/70 leading-relaxed">{product.whyItExists}</P>
            </section>

            {Array.isArray(product.engineeringChallenges) && product.engineeringChallenges.length > 0 && (
              <section>
                <H2 className="text-3xl mb-8">Engineering Challenges</H2>
                <div className="space-y-12">
                  {product.engineeringChallenges.map((challenge: EngineeringChallenge) => (
                    <div key={challenge.title} className="relative pl-6 border-l border-white/10">
                      <div className="absolute left-[-5px] top-2 h-2 w-2 rounded-full bg-white/20" />
                      <H3 className="text-xl font-semibold mb-3">{challenge.title}</H3>
                      <P className="text-white/60 leading-relaxed">{challenge.description}</P>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Tech & Stats */}
          <div className="lg:col-span-5 space-y-16">
            <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
              <H3 className="text-lg font-semibold mb-6 text-white/40 uppercase tracking-widest">Core Stack</H3>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(product.tech) && product.tech.map((t: string) => (
                  <Badge key={t} variant="secondary" className="bg-white/5 text-base px-3 py-1.5">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>

            {Array.isArray(product.metrics) && product.metrics.length > 0 && (
              <div>
                <H3 className="text-lg font-semibold mb-6 text-white/40 uppercase tracking-widest">Performance</H3>
                <div className="flex flex-col gap-8">
                  {product.metrics.map((metric: Metric) => (
                    <Stats key={metric.label} label={metric.label} value={metric.value} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Architecture Section */}
        <Section className="py-24 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-16">
            <div>
              <H2 className="text-4xl mb-4">System Architecture</H2>
              <P className="text-white/60 text-lg max-w-xl">High-level overview of the data flow and infrastructure orchestration.</P>
            </div>
          </div>
          
          <ArchitecturePlaceholder className="aspect-video" />
          
          {Array.isArray(product.engineeringDecisions) && product.engineeringDecisions.length > 0 && (
            <div className="grid md:grid-cols-2 gap-12 mt-20">
              {product.engineeringDecisions.map((decision: EngineeringDecision) => (
                <div key={decision.title}>
                  <H3 className="text-2xl mb-4">{decision.title}</H3>
                  <P className="text-white/70 mb-4">{decision.description}</P>
                  <div className="p-4 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/20">
                    <span className="text-xs font-semibold text-[#f59e0b] uppercase tracking-wider mb-1 block">Tradeoff</span>
                    <span className="text-sm text-[#f59e0b]/80">{decision.tradeoff}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Gallery Section */}
        {Array.isArray(product.screenshots) && product.screenshots.length > 0 && (
          <Section className="py-24 border-t border-white/10">
            <div className="mb-16">
              <H2 className="text-4xl mb-4">Gallery</H2>
              <P className="text-white/60 text-lg max-w-xl">Interface and component highlights.</P>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {product.screenshots.map((screenshot: { url?: string; caption?: string }, index: number) => {
                if (!screenshot.url || typeof screenshot.url !== 'string') return null;
                
                return (
                  <div key={index} className="flex flex-col gap-4">
                    <div className="aspect-video relative rounded-xl overflow-hidden border border-white/10 bg-black/40">
                      <Image 
                        src={screenshot.url} 
                        alt={screenshot.caption || `${product.title} screenshot ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {screenshot.caption && (
                      <p className="text-sm text-white/50 text-center">{screenshot.caption}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>
        )}
        
        {/* Next Steps CTA */}
        <Section className="py-24 border-t border-white/5 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full border border-white/10 bg-white/5 mb-8">
            <span className="text-2xl">🤝</span>
          </div>
          <H2 className="text-4xl md:text-5xl mb-6 tracking-tight">Ready to scale your next idea?</H2>
          <P className="text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            These systems were built from scratch with zero compromises. I can do the same for your team.
          </P>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="h-14 px-8 rounded-full bg-white text-black hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] transition-all text-lg w-full sm:w-auto">
              <Link href="/build">Initiate Contact</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-14 px-8 rounded-full text-lg w-full sm:w-auto">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </Section>

      </Container>
    </main>
  )
}
