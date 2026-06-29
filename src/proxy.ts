import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { auth: session, nextUrl } = req
  const isLoggedIn  = !!session
  const isAdmin     = session?.user?.role === 'ADMIN'
  const isAuthPage  = nextUrl.pathname.startsWith('/login')
  const isAdminPage = nextUrl.pathname.startsWith('/admin')

  // Not logged in → login
  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  // Logged in → skip login page
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL(isAdmin ? '/admin' : '/', nextUrl))
  }

  // Admin visiting shop root → redirect to admin panel
  if (isLoggedIn && isAdmin && nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/admin', nextUrl))
  }

  // Admin page but not admin → home
  if (isAdminPage && !isAdmin) {
    return NextResponse.redirect(new URL('/', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/|favicon.ico|icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)'],
}
