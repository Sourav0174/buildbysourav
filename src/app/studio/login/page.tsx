'use client'

import * as React from 'react'
import { login } from '@/core/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { H1, P } from '@/components/ui/typography'

export default function LoginPage() {
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#050505] selection:bg-white/20 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto h-8 w-8 bg-white mb-6" />
          <H1 className="text-3xl tracking-tight mb-2">Studio</H1>
          <P className="text-white/40">Secure access required.</P>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <Input 
              type="text" 
              name="username" 
              placeholder="Username" 
              required 
              autoComplete="off"
              className="bg-white/[0.02] border-white/10"
            />
          </div>
          <div>
            <Input 
              type="password" 
              name="password" 
              placeholder="Password" 
              required
              className="bg-white/[0.02] border-white/10"
            />
          </div>
          
          {error && (
            <div className="text-red-500 text-sm font-medium text-center">{error}</div>
          )}

          <Button type="submit" disabled={loading} className="w-full h-11 bg-white text-black hover:bg-white/90">
            {loading ? 'Authenticating...' : 'Enter'}
          </Button>
        </form>
      </div>
    </main>
  )
}
