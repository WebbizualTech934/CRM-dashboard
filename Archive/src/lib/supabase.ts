import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
        "CRITICAL ERROR: Supabase environment variables are missing!\n" +
        "Please create a .env.local file in the root directory and add:\n" +
        "NEXT_PUBLIC_SUPABASE_URL=your-project-url\n" +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key"
    )
}

// Use placeholders if variables are missing to prevent the "supabaseUrl is required" crash
export const supabase = createClient(
    supabaseUrl || "https://your-project.supabase.co",
    supabaseAnonKey || "your-anon-key"
)
