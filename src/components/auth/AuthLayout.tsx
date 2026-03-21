"use client"

import { Logo } from "@/components/shared/Logo"
import { Sparkles, Target, BarChart3, Users } from "lucide-react"

interface AuthLayoutProps {
    children: React.ReactNode
}

const stats = [
    { icon: Target, value: "500+", label: "Active Leads" },
    { icon: BarChart3, value: "92%", label: "Conversion Rate" },
    { icon: Users, value: "25+", label: "Team Members" },
    { icon: Sparkles, value: "3D", label: "Animation Studio" },
]

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen w-full flex bg-[#f8fafc] relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-primary/6 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-violet-500/8 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute top-[40%] left-[35%] w-[30%] h-[30%] bg-orange-400/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Left branding panel — hidden on mobile */}
            <div className="hidden lg:flex lg:w-[52%] flex-col justify-between p-12 xl:p-16 relative z-10">
                <Logo size="lg" showTagline />

                <div className="space-y-8 max-w-md">
                    {/* Headline */}
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-primary bg-primary/10 rounded-xl px-4 py-2">
                            <Sparkles className="h-3.5 w-3.5" />
                            3D Animation Company
                        </div>
                        <h1 className="text-5xl xl:text-6xl font-black tracking-tighter text-foreground leading-[1.05]">
                            Your sales
                            <br />
                            pipeline,{" "}
                            <span className="text-primary">
                                animated.
                            </span>
                        </h1>
                        <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                            The internal CRM workspace for managing 3D animation leads,
                            campaigns, client follow-ups, and sales performance.
                        </p>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="bg-white/70 backdrop-blur-sm border border-white/80 rounded-2xl p-5 shadow-sm"
                            >
                                <stat.icon className="h-5 w-5 text-primary mb-3" />
                                <div className="text-2xl font-black tracking-tighter text-foreground">
                                    {stat.value}
                                </div>
                                <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-xs text-muted-foreground/50 font-medium">
                    © 2024 Digital Marketing CRM · Internal Tool
                </p>
            </div>

            {/* Right form panel */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
                <div className="w-full max-w-[480px]">
                    {/* Mobile logo */}
                    <div className="lg:hidden mb-10 flex justify-center">
                        <Logo size="md" showTagline />
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl border border-white/90 rounded-3xl shadow-2xl shadow-primary/8 p-8 xl:p-10">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
