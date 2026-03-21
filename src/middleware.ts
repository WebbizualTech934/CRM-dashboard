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

    // Read Supabase session from the storage cookie
    // We manually set 'sb-auth-token' in use-auth.tsx because we don't have @supabase/ssr
    const authCookie =
        request.cookies.get("sb-auth-token")?.value ||
        request.cookies.get("sb-access-token")?.value ||
        request.cookies.get("supabase-auth-token")?.value ||
        request.cookies.get("auth_token")?.value ||
        request.cookies.get("demo-auth-token")?.value

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
