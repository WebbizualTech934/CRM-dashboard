import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// --- Environment variable validation ---
export const isSupabaseConfigured =
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    supabaseUrl !== "https://your-project.supabase.co" &&
    supabaseAnonKey !== "your-anon-key"

if (!isSupabaseConfigured) {
    if (typeof window !== "undefined") {
        // Only log on client side to avoid SSR noise
        console.error(
            "[Supabase] ⚠️  Missing or placeholder environment variables!\n" +
            "Add the following to your .env.local (or Netlify/Vercel environment variables):\n" +
            "  NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co\n" +
            "  NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>\n" +
            "Without these, all database operations will fail."
        )
    }
}

// --- Supabase browser client ---
// A single shared client for the entire app.
// For server-side usage (API routes / server components), create a separate
// service-role client — never expose the service role key client-side.
export const supabase = createClient(
    supabaseUrl ?? "https://placeholder.supabase.co",
    supabaseAnonKey ?? "placeholder-anon-key",
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
        },
        realtime: {
            // Only connect realtime websocket when properly configured
            ...(isSupabaseConfigured ? {} : { params: { eventsPerSecond: 0 } }),
        },
        global: {
            headers: {
                "x-client-info": "crm-dashboard/1.0",
            },
        },
    }
)
