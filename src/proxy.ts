import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/core/auth/session'

const protectedRoutes = ['/studio']
const publicRoutes = ['/studio/login']

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route)) && !publicRoutes.includes(path)
  
  if (isProtectedRoute) {
    const cookie = req.cookies.get('session')?.value
    const session = await decrypt(cookie)

    if (!session?.admin) {
      return NextResponse.redirect(new URL('/studio/login', req.nextUrl))
    }
  }

  if (publicRoutes.includes(path)) {
    const cookie = req.cookies.get('session')?.value
    const session = await decrypt(cookie)
    if (session?.admin) {
      return NextResponse.redirect(new URL('/studio', req.nextUrl))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
