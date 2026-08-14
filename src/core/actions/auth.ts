'use server'

import { createSession, deleteSession } from '@/core/auth/session'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const username = formData.get('username')
  const password = formData.get('password')

  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    throw new Error("Server Misconfiguration: ADMIN_USERNAME and ADMIN_PASSWORD are required")
  }

  const validUsername = process.env.ADMIN_USERNAME
  const validPassword = process.env.ADMIN_PASSWORD

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
