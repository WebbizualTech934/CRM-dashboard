"use client"

import { useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Mail, ArrowRight, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react"

export function ForgotPasswordForm() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const redirectTo = `${window.location.origin}/reset-password`
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(
                email.trim(),
                { redirectTo }
            )

            if (resetError) {
                setError(resetError.message)
                return
            }

            setSent(true)
        } catch (err: any) {
            setError("An unexpected error occurred. Please try again.")
            console.error("[Auth] Reset password error:", err)
        } finally {
            setLoading(false)
        }
    }

    if (sent) {
        return (
            <div className="space-y-6 text-center py-4">
                <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black tracking-tight text-foreground">
                        Email sent!
                    </h2>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        We&apos;ve sent a password reset link to{" "}
                        <strong className="text-foreground">{email}</strong>.
                        <br />
                        Check your inbox and click the link to reset your password.
                    </p>
                    <p className="text-xs text-muted-foreground/60 pt-1">
                        Didn&apos;t receive it? Check your spam folder or try again.
                    </p>
                </div>
                <div className="flex flex-col gap-3 pt-2">
                    <button
                        onClick={() => { setEmail(""); setSent(false) }}
                        className="text-sm font-bold text-primary hover:underline"
                    >
                        Try a different email
                    </button>
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tight text-foreground">
                    Reset your password
                </h2>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    Enter your registered email to receive a secure password reset link.
                </p>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-2xl p-4">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">
                        Email Address
                    </label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors h-[18px] w-[18px]" />
                        <input
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com"
                            className="w-full h-14 pl-11 pr-4 rounded-2xl border border-border bg-muted/20 text-sm font-medium placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {loading ? (
                        <div className="h-5 w-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            Send Reset Link <ArrowRight className="h-4 w-4" />
                        </>
                    )}
                </button>
            </form>

            <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="h-4 w-4" /> Back to Login
            </Link>
        </div>
    )
}
