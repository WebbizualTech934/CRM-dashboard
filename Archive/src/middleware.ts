import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const authToken = request.cookies.get('auth_token')?.value
    const { pathname } = request.nextUrl

    // If the user is not logged in and trying to access a protected route
    if (!authToken && pathname !== '/login') {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // If the user is logged in and trying to access the login page
    if (authToken && pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
