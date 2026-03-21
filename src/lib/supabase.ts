import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured =
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    supabaseUrl !== "https://your-project.supabase.co" &&
    supabaseAnonKey !== "your-anon-key"

if (!isSupabaseConfigured && typeof window !== "undefined") {
    console.error(
        "[Supabase] ⚠️  Missing or placeholder environment variables!\n" +
        "Add the following to your .env.local:\n" +
        "  NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co\n" +
        "  NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>"
    )
}

export const supabase = createClient(
    supabaseUrl ?? "https://placeholder.supabase.co",
    supabaseAnonKey ?? "placeholder-anon-key",
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            storageKey: "crm-auth",
        },
    }
)
