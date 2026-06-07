import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const role = req.auth?.user?.role

  const isAuthRoute = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register')

  if (isAuthRoute) {
    if (isLoggedIn) {
      if (role === 'STUDENT') return Response.redirect(new URL('/dashboard', nextUrl))
      if (role === 'OFFICER') return Response.redirect(new URL('/officer/dashboard', nextUrl))
      if (role === 'REGISTRY') return Response.redirect(new URL('/registry/dashboard', nextUrl))
      return Response.redirect(new URL('/', nextUrl))
    }
    return null
  }

  if (!isLoggedIn && nextUrl.pathname !== '/') {
    return Response.redirect(new URL('/login', nextUrl))
  }

  if (nextUrl.pathname.startsWith('/dashboard')) {
    if (role !== 'STUDENT') return Response.redirect(new URL('/login', nextUrl))
  }

  if (nextUrl.pathname.startsWith('/officer')) {
    if (role !== 'OFFICER') return Response.redirect(new URL('/login', nextUrl))
  }

  if (nextUrl.pathname.startsWith('/registry')) {
    if (role !== 'REGISTRY') return Response.redirect(new URL('/login', nextUrl))
  }

  return null
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
