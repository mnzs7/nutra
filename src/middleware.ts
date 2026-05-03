import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl

  const isAccountRoute = pathname.startsWith('/account')

  if (isAccountRoute) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
    })

    if (!token) {
      const loginUrl = new URL('/auth/login', origin)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/account/:path*'],
}
