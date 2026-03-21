import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get("code")
    const next = searchParams.get("next") ?? "/"

    if (code) {
        // Exchange the code for a session
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        const supabase = createClient(supabaseUrl, supabaseAnonKey)

        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // The session cookie is now set — redirect to dashboard
            return NextResponse.redirect(`${origin}${next}`)
        }
        console.error("[Auth] OAuth callback error:", error)
    }

    // Fallback to login with a clear error
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
