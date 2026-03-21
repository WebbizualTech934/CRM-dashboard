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
    const [user, setUser] = useState<any | null>(null)
    const [session, setSession] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const syncSessionToCookie = (session: Session | null) => {
            if (session) {
                // Set cookie that middleware can read
                // Expires in 7 days (matching Supabase default)
                const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()
                document.cookie = `sb-auth-token=${session.access_token}; path=/; expires=${expires}; SameSite=Lax`
            } else {
                // Remove cookie
                document.cookie = `sb-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
            }
        }

        // Check for demo user if no Supabase session
        const demoUser = localStorage.getItem("demo-user")
        if (demoUser) {
            try {
                const parsedUser = JSON.parse(demoUser)
                setUser(parsedUser)
                // Set a fake session or just keep it null but user exists
                setSession({ user: parsedUser, access_token: "demo-token" } as any)
                setLoading(false)
            } catch (e) {
                console.error("Failed to parse demo user", e)
            }
        }

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setSession(session)
                setUser(session.user)
                syncSessionToCookie(session)
            }
            if (!demoUser) setLoading(false)
        })

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (session) {
                    setSession(session)
                    setUser(session.user)
                    syncSessionToCookie(session)
                } else if (!localStorage.getItem("demo-user")) {
                    setSession(null)
                    setUser(null)
                    syncSessionToCookie(null)
                }
                setLoading(false)

                if (event === "SIGNED_IN") router.refresh()
                if (event === "SIGNED_OUT") router.refresh()
            }
        )

        return () => subscription.unsubscribe()
    }, [router])

    const signOut = async () => {
        try {
            // Clear demo user and cookie first (optimistic)
            localStorage.removeItem("demo-user")
            document.cookie = `demo-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`
            
            // Clear standard auth cookie
            document.cookie = `sb-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`

            // Update local state immediately
            setUser(null)
            setSession(null)

            // Attempt Supabase sign out but don't let it block us
            await supabase.auth.signOut().catch(err => console.error("Supabase signOut error:", err))
        } catch (error) {
            console.error("Logout error:", error)
        } finally {
            // Always redirect and refresh
            router.push("/login")
            router.refresh()
            // Optional: Hard reload to ensure all states are cleared
            // window.location.href = "/login" 
        }
    }

    return (
        <AuthContext.Provider value={{ user, session, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
