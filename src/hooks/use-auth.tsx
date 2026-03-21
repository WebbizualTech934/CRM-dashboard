"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { Session, User } from "@supabase/supabase-js"

interface AuthContextType {
    user: User | null
    session: Session | null
    loading: boolean
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    loading: true,
    signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const syncSessionToCookie = (session: Session | null) => {
            if (session) {
                // Set cookie that middleware can read
                // Expires in 7 days (matching Supabase default)
                const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()
                document.cookie = `sb-auth-token=${session.access_token}; path=/; expires=${expires}; SameSite=Lax; Secure`
            } else {
                // Remove cookie
                document.cookie = `sb-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
            }
        }

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            syncSessionToCookie(session)
            setLoading(false)
        })

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setSession(session)
                setUser(session?.user ?? null)
                syncSessionToCookie(session)
                setLoading(false)

                if (event === "SIGNED_IN") router.refresh()
                if (event === "SIGNED_OUT") router.refresh()
            }
        )

        return () => subscription.unsubscribe()
    }, [router])

    const signOut = async () => {
        await supabase.auth.signOut()
        router.push("/login")
    }

    return (
        <AuthContext.Provider value={{ user, session, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
