"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { LayoutDashboard, Lock, Mail, ArrowRight, Github, Chrome } from "lucide-react"
import { cn } from "@/lib/utils"

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setIsLoading(true)

        // Mock authentication delay
        setTimeout(() => {
            // Set mock auth cookie
            document.cookie = "auth_token=mock_token; path=/; max-age=3600"
            setIsLoading(false)
            router.push("/")
        }, 1500)
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>

            <div className="w-full max-w-[1200px] grid lg:grid-cols-2 gap-8 p-6 relative z-10">
                {/* Left Side: Branding/Marketing */}
                <div className="hidden lg:flex flex-col justify-center p-12 space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary p-3 rounded-2xl shadow-xl shadow-primary/20">
                            <LayoutDashboard className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <span className="text-3xl font-bold tracking-tighter text-foreground">CRM<span className="text-primary">PRO</span></span>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-6xl font-bold tracking-tighter leading-[1.1] text-foreground">
                            Manage your <span className="text-primary">leads</span> with precision.
                        </h1>
                        <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-md">
                            The all-in-one workspace for your team to track, manage, and convert leads into customers.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-8">
                        <div className="space-y-2">
                            <div className="text-3xl font-bold tracking-tighter text-primary">99.9%</div>
                            <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">Uptime</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl font-bold tracking-tighter text-primary">24/7</div>
                            <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">Support</div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="flex items-center justify-center">
                    <Card className="w-full max-w-[480px] border-none shadow-2xl shadow-primary/10 rounded-[2.5rem] bg-white/80 backdrop-blur-xl p-4">
                        <CardHeader className="space-y-2 p-8">
                            <div className="lg:hidden flex items-center gap-2 mb-6">
                                <LayoutDashboard className="h-6 w-6 text-primary" />
                                <span className="text-xl font-bold tracking-tighter">CRM<span className="text-primary">PRO</span></span>
                            </div>
                            <CardTitle className="text-3xl font-bold tracking-tighter">Admin Login</CardTitle>
                            <CardDescription className="text-base font-medium text-muted-foreground">
                                Enter your admin credentials to manage your workspace
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                            <form onSubmit={onSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Email Address</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@company.com"
                                            required
                                            className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-medium transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between ml-1">
                                        <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Password</Label>
                                        <Button variant="link" className="px-0 h-auto text-xs font-bold text-primary hover:no-underline">Forgot password?</Button>
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-medium transition-all"
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full h-14 rounded-2xl font-bold text-base shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Signing in..." : "Sign In"}
                                    {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                                </Button>
                            </form>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-border/50" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-transparent px-4 text-muted-foreground font-bold tracking-widest">Or continue with</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" className="h-14 rounded-2xl border-border/50 font-bold hover:bg-primary/5 hover:text-primary transition-all">
                                    <Chrome className="mr-2 h-5 w-5" /> Google
                                </Button>
                                <Button variant="outline" className="h-14 rounded-2xl border-border/50 font-bold hover:bg-primary/5 hover:text-primary transition-all">
                                    <Github className="mr-2 h-5 w-5" /> GitHub
                                </Button>
                            </div>
                        </CardContent>
                        <CardFooter className="p-8 pt-0 justify-center">
                            <p className="text-sm text-muted-foreground font-medium">
                                Don't have an account?{" "}
                                <Button variant="link" className="px-0 h-auto font-bold text-primary hover:no-underline">Create an account</Button>
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
