"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { GoogleAuthButton } from "./GoogleAuthButton"
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, AlertCircle, CheckCircle } from "lucide-react"

export function SignupForm() {
    const router = useRouter()
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const passwordStrength = (): { label: string; color: string; width: string } => {
        if (password.length === 0) return { label: "", color: "", width: "0%" }
        if (password.length < 6) return { label: "Too short", color: "bg-red-500", width: "25%" }
        if (password.length < 8) return { label: "Weak", color: "bg-orange-400", width: "50%" }
        if (/(?=.*[0-9])(?=.*[A-Z])/.test(password))
            return { label: "Strong", color: "bg-green-500", width: "100%" }
        return { label: "Good", color: "bg-blue-500", width: "75%" }
    }
    const strength = passwordStrength()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (fullName.trim().length < 2) {
            setError("Please enter your full name (minimum 2 characters).")
            return
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.")
            return
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match. Please re-enter.")
            return
        }

        setLoading(true)
        try {
            const { data, error: authError } = await supabase.auth.signUp({
                email: email.trim(),
                password,
                options: {
                    data: {
                        full_name: fullName.trim(),
                    },
                },
            })

            if (authError) {
                if (authError.message.includes("already registered")) {
                    setError("This email is already registered. Try logging in instead.")
                } else {
                    setError(authError.message)
                }
                return
            }

            if (data.user && !data.session) {
                // Email confirmation required
                setSuccess(true)
            } else if (data.session) {
                // Auto-confirmed (email confirmation disabled in Supabase)
                router.push("/")
                router.refresh()
            }
        } catch (err: any) {
            setError("An unexpected error occurred. Please try again.")
            console.error("[Auth] Signup error:", err)
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
                    <h2 className="text-2xl font-black tracking-tight text-foreground">
                        Check your email!
                    </h2>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        We&apos;ve sent a verification link to{" "}
                        <strong className="text-foreground">{email}</strong>.
                        <br />
                        Click the link to verify your account.
                    </p>
                </div>
                <Link
                    href="/login"
                    className="inline-block text-sm font-bold text-primary hover:underline"
                >
                    Back to Login
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tight text-foreground">
                    Create your account
                </h2>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    Join the workspace for managing 3D animation leads and campaigns.
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
            <GoogleAuthButton mode="signup" />

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-muted-foreground/60 font-bold tracking-widest">
                        or register with email
                    </span>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">
                        Full Name
                    </label>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors h-[18px] w-[18px]" />
                        <input
                            type="text"
                            required
                            autoComplete="name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="John Smith"
                            className="w-full h-14 pl-11 pr-4 rounded-2xl border border-border bg-muted/20 text-sm font-medium placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                        />
                    </div>
                </div>

                {/* Email */}
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

                {/* Password */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">
                        Password
                    </label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors h-[18px] w-[18px]" />
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min. 6 characters"
                            className="w-full h-14 pl-11 pr-12 rounded-2xl border border-border bg-muted/20 text-sm font-medium placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary transition-colors"
                        >
                            {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                        </button>
                    </div>
                    {/* Strength bar */}
                    {password && (
                        <div className="space-y-1">
                            <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                                    style={{ width: strength.width }}
                                />
                            </div>
                            <p className="text-[11px] font-bold text-muted-foreground/60">{strength.label}</p>
                        </div>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">
                        Confirm Password
                    </label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors h-[18px] w-[18px]" />
                        <input
                            type={showConfirm ? "text" : "password"}
                            required
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter password"
                            className={`w-full h-14 pl-11 pr-12 rounded-2xl border bg-muted/20 text-sm font-medium placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 transition-all ${
                                confirmPassword && confirmPassword !== password
                                    ? "border-red-300 focus:ring-red-200"
                                    : confirmPassword && confirmPassword === password
                                    ? "border-green-300 focus:ring-green-200"
                                    : "border-border focus:ring-primary/20 focus:border-primary/30"
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary transition-colors"
                        >
                            {showConfirm ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                        </button>
                    </div>
                    {confirmPassword && confirmPassword !== password && (
                        <p className="text-[11px] font-bold text-red-500">Passwords don&apos;t match</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading || !fullName || !email || !password || !confirmPassword}
                    className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
                >
                    {loading ? (
                        <div className="h-5 w-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            Create Account <ArrowRight className="h-4 w-4" />
                        </>
                    )}
                </button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground font-medium">
                Already have an account?{" "}
                <Link href="/login" className="font-bold text-primary hover:underline">
                    Sign in
                </Link>
            </p>
        </div>
    )
}
