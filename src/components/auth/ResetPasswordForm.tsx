"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from "lucide-react"

export function ResetPasswordForm() {
    const router = useRouter()
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [sessionReady, setSessionReady] = useState(false)

    useEffect(() => {
        // Supabase automatically exchanges the hash token from password reset emails
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === "PASSWORD_RECOVERY") {
                setSessionReady(true)
            }
        })
        // Also check if we already have a session
        supabase.auth.getSession().then(({ data }) => {
            if (data.session) setSessionReady(true)
        })
        return () => subscription.unsubscribe()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (password.length < 6) {
            setError("Password must be at least 6 characters.")
            return
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.")
            return
        }

        setLoading(true)
        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password,
            })
            if (updateError) {
                setError(updateError.message)
                return
            }
            setSuccess(true)
            setTimeout(() => router.push("/"), 2000)
        } catch (err: any) {
            setError("An unexpected error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="space-y-6 text-center py-4">
                <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black tracking-tight text-foreground">Password updated!</h2>
                    <p className="text-sm text-muted-foreground font-medium">
                        Your password has been changed. Redirecting you to the dashboard…
                    </p>
                </div>
            </div>
        )
    }

    if (!sessionReady) {
        return (
            <div className="space-y-4 text-center py-8">
                <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground font-medium">Validating reset link…</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tight text-foreground">Set new password</h2>
                <p className="text-sm text-muted-foreground font-medium">Choose a strong password for your account.</p>
            </div>

            {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-2xl p-4">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">New Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors h-[18px] w-[18px]" />
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min. 6 characters"
                            className="w-full h-14 pl-11 pr-12 rounded-2xl border border-border/50 bg-muted/20 text-sm font-medium placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary transition-colors">
                            {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">Confirm Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors h-[18px] w-[18px]" />
                        <input
                            type={showConfirm ? "text" : "password"}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter new password"
                            className={`w-full h-14 pl-11 pr-12 rounded-2xl border bg-muted/20 text-sm font-medium placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 transition-all ${
                                confirmPassword && confirmPassword !== password
                                    ? "border-red-300 focus:ring-red-200"
                                    : "border-border/50 focus:ring-primary/20 focus:border-primary/30"
                            }`}
                        />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary transition-colors">
                            {showConfirm ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !password || !confirmPassword}
                    className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {loading ? (
                        <div className="h-5 w-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                    ) : (
                        <> Update Password <ArrowRight className="h-4 w-4" /> </>
                    )}
                </button>
            </form>
        </div>
    )
}
