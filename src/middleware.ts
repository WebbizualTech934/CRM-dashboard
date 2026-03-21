import { NextResponse, type NextRequest } from "next/server"

// Public routes — no auth required
const PUBLIC_PATHS = ["/login", "/signup", "/forgot-password", "/reset-password", "/auth/callback"]

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Always allow public assets and Next.js internals
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/auth/callback") ||
        pathname === "/favicon.ico" ||
        pathname.startsWith("/logo")
    ) {
        return NextResponse.next()
    }

    const isPublicPath = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))

    // Read Supabase session from the storage cookie (supabase uses 'crm-auth' storageKey)
    // The session token is stored in localStorage by supabase-js on the client side.
    // For server-side middleware, we check for the Supabase auth cookie.
    // The cookie name pattern is: sb-<project-ref>-auth-token
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
    const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] ?? ""
    const authCookieName = `sb-${projectRef}-auth-token`

    // Check multiple cookie variants Supabase may use
    const authCookie =
        request.cookies.get(authCookieName)?.value ||
        request.cookies.get("sb-access-token")?.value ||
        request.cookies.get("supabase-auth-token")?.value ||
        // Legacy mock token for backward compat during transition
        request.cookies.get("auth_token")?.value

    const isAuthenticated = Boolean(authCookie)

    // Not authenticated → redirect to login (unless already on a public path)
    if (!isAuthenticated && !isPublicPath) {
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(loginUrl)
    }

    // Authenticated + trying to access auth pages → redirect to dashboard
    if (isAuthenticated && isPublicPath && pathname !== "/reset-password") {
        return NextResponse.redirect(new URL("/", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - _next/static
         * - _next/image
         * - favicon.ico
         * - public files
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
}
