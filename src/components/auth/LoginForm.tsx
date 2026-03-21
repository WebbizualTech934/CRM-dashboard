"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { GoogleAuthButton } from "./GoogleAuthButton"
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react"

export function LoginForm() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            })

            if (authError) {
                if (authError.message.includes("Invalid login credentials")) {
                    setError("Incorrect email or password. Please try again.")
                } else if (authError.message.includes("Email not confirmed")) {
                    setError("Please verify your email before logging in. Check your inbox.")
                } else {
                    setError(authError.message)
                }
                return
            }

            if (data.session) {
                router.push("/")
                router.refresh()
            }
        } catch (err: any) {
            setError("An unexpected error occurred. Please try again.")
            console.error("[Auth] Login error:", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tight text-foreground">
                    Welcome back
                </h2>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    Sign in to manage your leads, campaigns, and client follow-ups.
                </p>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-2xl p-4">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
            )}

            {/* Google */}
            <GoogleAuthButton mode="signin" />

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white/80 px-3 text-muted-foreground/60 font-bold tracking-widest">
                        or continue with email
                    </span>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">
                        Email Address
                    </label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground/50 group-focus-within:text-primary transition-colors h-[18px] w-[18px]" />
                        <input
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com"
                            className="w-full h-14 pl-11 pr-4 rounded-2xl border border-border/50 bg-muted/20 text-sm font-medium placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">
                            Password
                        </label>
                        <Link
                            href="/forgot-password"
                            className="text-xs font-bold text-primary hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors h-[18px] w-[18px]" />
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full h-14 pl-11 pr-12 rounded-2xl border border-border/50 bg-muted/20 text-sm font-medium placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary transition-colors"
                        >
                            {showPassword ? <EyeOff className="h-4.5 w-4.5 h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                        </button>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading || !email || !password}
                    className="w-full h-14 rounded-2xl bg-[#ff7a59] text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-400/20 hover:bg-[#ff6a45] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
                >
                    {loading ? (
                        <div className="h-5 w-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            Sign In <ArrowRight className="h-4 w-4" />
                        </>
                    )}
                </button>
            </form>

            {/* Footer link */}
            <p className="text-center text-sm text-muted-foreground font-medium">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-bold text-primary hover:underline">
                    Create account
                </Link>
            </p>
        </div>
    )
}
