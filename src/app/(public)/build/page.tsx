"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { H1, H3, P } from "@/components/ui/typography"
import { Spotlight } from "@/components/ui/spotlight"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, Send, AlertCircle } from "lucide-react"
import { cn } from "@/core/utils/cn"
import { createMessage } from "@/core/actions/messages"


const projectTypes = [
  "From 0 to 1 SaaS MVPs",
  "Backend Architecture & Scaling",
  "AI Workflow Automations",
  "Mobile App Development",
  "Legacy System Modernization"
]

const processSteps = [
  { step: "01", title: "Discovery", desc: "We discuss your goals, technical constraints, and timelines." },
  { step: "02", title: "Architecture", desc: "I draft a technical specification and database schema for approval." },
  { step: "03", title: "Execution", desc: "Iterative development with weekly check-ins and demo deployments." },
  { step: "04", title: "Handover", desc: "Final delivery with complete documentation and infrastructure setup." }
]

const faqs = [
  { q: "What is your typical engagement size?", a: "I typically take on projects starting at $10k+, usually lasting between 4 to 12 weeks depending on complexity." },
  { q: "Do you work with existing teams?", a: "Yes, I often integrate into existing engineering teams as a Staff-level individual contributor to unblock critical architecture paths." },
  { q: "What is your tech stack?", a: "My core stack is Next.js, React, Python (FastAPI), PostgreSQL, and Flutter. However, I adapt to the right tool for the job." },
  { q: "Do you offer maintenance?", a: "I prefer to build systems that don't require heavy maintenance, but I do offer retainer contracts for ongoing feature development and support." }
]

function FaqItem({ q, a }: { q: string, a: string }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="border-b border-white/10 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex w-full items-center justify-between py-6 text-left focus:outline-none"
      >
        <span className="text-lg font-medium pr-8">{q}</span>
        <ChevronDown className={cn("h-5 w-5 text-white/40 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <P className="pb-6 text-white/60">{a}</P>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function BuildPage() {
  const [state, action, isPending] = React.useActionState(createMessage, { success: false, error: null })
  
  const handleReset = () => {
    window.location.reload()
  }

  return (
    <main className="min-h-screen relative pt-32 pb-24 overflow-hidden">
      <Spotlight />
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-blue-500/10 blur-[130px] rounded-full pointer-events-none opacity-50" />
      
      <Section className="relative z-10 mb-20">
        <Container>
          <div className="max-w-3xl">
            <H1 className="text-5xl md:text-6xl tracking-tight mb-6">Let&apos;s Build</H1>
            <P className="text-xl md:text-2xl text-white/70 mb-10">
              I partner with ambitious companies to build scalable products and solve complex engineering challenges. Tell me what you&apos;re working on.
            </P>
          </div>
        </Container>
      </Section>

      <Section className="relative z-10">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Left: Info */}
            <div className="space-y-16">
              <div>
                <H3 className="text-2xl font-bold mb-6">Types of Projects</H3>
                <ul className="space-y-4">
                  {projectTypes.map(type => (
                    <li key={type} className="flex items-center gap-3 text-white/80">
                      <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
                      {type}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <H3 className="text-2xl font-bold mb-6">Engagement Process</H3>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                  {processSteps.map((step) => (
                    <div key={step.step} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 bg-[#050505] text-xs font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_#050505]">
                        {step.step}
                      </div>
                      <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-6 rounded-xl border border-white/10 bg-white/[0.02]">
                        <h4 className="font-bold mb-2">{step.title}</h4>
                        <p className="text-sm text-white/60">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <H3 className="text-2xl font-bold mb-6">Frequently Asked Questions</H3>
                <div className="border-t border-white/10">
                  {faqs.map((faq, i) => (
                    <FaqItem key={i} q={faq.q} a={faq.a} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div>
              <div className="sticky top-32 p-8 md:p-12 rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl">
                <H3 className="text-2xl font-bold mb-2">Project Inquiry</H3>
                <P className="text-white/60 mb-8">Fill out the form below and I&apos;ll get back to you within 24 hours.</P>
                
                {state.success ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
                      <Send className="w-8 h-8" />
                    </div>
                    <H3 className="text-2xl font-bold mb-2">Message Sent</H3>
                    <P className="text-white/60">Thank you for reaching out. I will review your inquiry and reply shortly.</P>
                    <Button onClick={handleReset} variant="outline" className="mt-8">
                      Send another message
                    </Button>
                  </motion.div>
                ) : (
                  <form action={action} className="space-y-6">
                    {state.error && (
                      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <p className="text-sm">{state.error}</p>
                      </div>
                    )}
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-white/80">Name</label>
                      <Input id="name" name="name" required placeholder="John Doe" className="bg-white/5 border-white/10 h-12" defaultValue="" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-white/80">Email</label>
                      <Input id="email" name="email" type="email" required placeholder="john@example.com" className="bg-white/5 border-white/10 h-12" defaultValue="" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="details" className="text-sm font-medium text-white/80">Project Details</label>
                      <Textarea 
                        id="details" 
                        name="details"
                        required 
                        placeholder="Tell me about the problem you are trying to solve..." 
                        className="bg-white/5 border-white/10 min-h-[150px] resize-none" 
                        defaultValue=""
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-semibold"
                      disabled={isPending}
                    >
                      {isPending ? "Sending..." : "Submit Inquiry"}
                    </Button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </Container>
      </Section>
    </main>
  )
}
