'use server'

import { createSession, deleteSession } from '@/core/auth/session'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const username = formData.get('username')
  const password = formData.get('password')

  const env = process.env
  const validUsername = env['ADMIN_USERNAME']
  const validPassword = env['ADMIN_PASSWORD']

  if (!validUsername || !validPassword) {
    throw new Error("Server Misconfiguration: ADMIN_USERNAME and ADMIN_PASSWORD are required")
  }

  if (username === validUsername && password === validPassword) {
    await createSession()
    redirect('/studio')
  }

  return { error: 'Invalid credentials' }
}

export async function logout() {
  await deleteSession()
  redirect('/studio/login')
}
