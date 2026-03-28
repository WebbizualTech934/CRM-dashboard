"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
    Users, 
    Activity, 
    CheckSquare, 
    MessageSquare, 
    LayoutDashboard,
    ArrowUpRight,
    TrendingUp,
    Target
} from "lucide-react"
import { LinkedinLead, LinkedinInteraction } from "@/providers/crm-provider"
import { cn } from "@/lib/utils"

interface LinkedinAnalyticsProps {
    leads: LinkedinLead[]
    interactions: LinkedinInteraction[]
}

export function LinkedinAnalytics({ leads, interactions }: LinkedinAnalyticsProps) {
    const totalLeads = leads.length
    const connectionSent = leads.filter(l => l.status === 'Connection Sent' || l.status === 'Accepted' || l.status === 'Replied' || l.status === 'Converted').length
    const accepted = leads.filter(l => l.status === 'Accepted' || l.status === 'Replied' || l.status === 'Converted').length
    const replied = leads.filter(l => l.status === 'Replied' || l.status === 'Converted').length
    const converted = leads.filter(l => l.status === 'Converted').length

    const getRate = (part: number, total: number) => {
        if (total === 0) return "0%"
        return `${Math.round((part / total) * 100)}%`
    }

    const funnelSteps = [
        { label: "Prospects", value: totalLeads, rate: "100%", icon: Users, color: "bg-blue-500" },
        { label: "Connection Sent", value: connectionSent, rate: getRate(connectionSent, totalLeads), icon: Activity, color: "bg-indigo-500" },
        { label: "Accepted", value: accepted, rate: getRate(accepted, connectionSent), icon: CheckSquare, color: "bg-purple-500" },
        { label: "Replies", value: replied, rate: getRate(replied, accepted), icon: MessageSquare, color: "bg-pink-500" },
        { label: "Conversions", value: converted, rate: getRate(converted, replied), icon: Target, color: "bg-emerald-500" },
    ]

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Conversion Funnel */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {funnelSteps.map((step, idx) => (
                    <div key={step.label} className="relative group">
                        <Card className="bg-white border border-border shadow-xl rounded-[2rem] overflow-hidden transition-all hover:shadow-primary/10">
                            <CardContent className="p-8 flex flex-col items-center text-center">
                                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-black/5", step.color)}>
                                    <step.icon className="h-6 w-6" />
                                </div>
                                <div className="text-3xl font-black tracking-tighter mb-1">{step.value}</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-4">{step.label}</div>
                                <div className="px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10">
                                    {step.rate} Rate
                                </div>
                            </CardContent>
                        </Card>
                        {idx < funnelSteps.length - 1 && (
                            <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background border border-border items-center justify-center text-muted-foreground opacity-50">
                                <ArrowUpRight className="h-4 w-4 rotate-45" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Performance Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <Card className="bg-white border border-border shadow-2xl rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-10 border-b border-border bg-muted/5 flex flex-row items-center justify-between">
                        <CardTitle className="text-xl font-bold tracking-tight">Outreach Velocity</CardTitle>
                        <TrendingUp className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent className="p-10">
                        <div className="h-64 flex items-end justify-between gap-2 px-4">
                            {[40, 60, 45, 90, 65, 80, 55].map((val, i) => (
                                <div key={i} className="flex-1 group relative">
                                    <div 
                                        style={{ height: `${val}%` }} 
                                        className="w-full bg-primary/20 rounded-t-xl group-hover:bg-primary transition-all cursor-pointer relative"
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {val}
                                        </div>
                                    </div>
                                    <div className="text-[10px] font-bold text-muted-foreground/40 mt-4 text-center uppercase tracking-widest">
                                        Day {i + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-border shadow-2xl rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-10 border-b border-border bg-muted/5">
                        <CardTitle className="text-xl font-bold tracking-tight">Conversion Benchmarks</CardTitle>
                    </CardHeader>
                    <CardContent className="p-10 space-y-8">
                        {[
                            { label: "Reply Rate", value: getRate(replied, accepted), target: "15%", color: "bg-blue-500" },
                            { label: "Acceptance Rate", value: getRate(accepted, connectionSent), target: "25%", color: "bg-indigo-500" },
                            { label: "Conversion Rate", value: getRate(converted, leads.length), target: "5%", color: "bg-emerald-500" },
                        ].map((stat) => (
                            <div key={stat.label} className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <div className="text-sm font-bold">{stat.label}</div>
                                    <div className="text-xs text-muted-foreground font-medium">Target: {stat.target}</div>
                                </div>
                                <div className="h-3 w-full bg-muted/20 rounded-full overflow-hidden">
                                    <div 
                                        className={cn("h-full transition-all duration-1000", stat.color)} 
                                        style={{ width: stat.value }}
                                    />
                                </div>
                                <div className="text-2xl font-black tracking-tighter">{stat.value}</div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
