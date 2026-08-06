'use server'

import { createSession, deleteSession } from '@/core/auth/session'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const username = formData.get('username')
  const password = formData.get('password')

  const validUsername = process.env.ADMIN_USERNAME || 'admin'
  const validPassword = process.env.ADMIN_PASSWORD || 'password'

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
