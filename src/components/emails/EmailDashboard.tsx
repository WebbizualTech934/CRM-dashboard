"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Mail, MessageSquare, CheckCircle2, XCircle, Target, TrendingUp, BarChart3 } from "lucide-react"
import { useCRMData } from "@/hooks/use-crm-data"
import { cn } from "@/lib/utils"

export function EmailDashboard({ projectId, status }: { projectId?: string, status?: string }) {
    const { campaigns, isLoaded } = useCRMData()

    if (!isLoaded) return null

    const projCampaigns = campaigns.filter(c => {
        if (projectId && c.projectId !== projectId) return false
        if (status && c.status !== status) return false
        return true
    })

    // Aggregated Stats
    const totalLeads = projCampaigns.reduce((acc, c) => acc + c.leadsCount, 0)
    const totalSent = projCampaigns.reduce((acc, c) => acc + c.emailsSent, 0)
    const totalReplies = projCampaigns.reduce((acc, c) => acc + c.replies, 0)
    const totalPositives = projCampaigns.reduce((acc, c) => acc + c.positives, 0)
    const totalBounces = projCampaigns.reduce((acc, c) => acc + c.bounces, 0)
    const totalMeetings = projCampaigns.reduce((acc, c) => acc + c.meetings, 0)

    const replyRate = totalSent > 0 ? (totalReplies / totalSent) * 100 : 0
    const positiveRate = totalReplies > 0 ? (totalPositives / totalReplies) * 100 : 0

    const stats = [
        { label: "Total Leads", value: totalLeads, sub: "In campaigns", icon: Users, color: "text-primary", bg: "bg-primary/5" },
        { label: "Emails Sent", value: totalSent, sub: "Unique outreach", icon: Mail, color: "text-blue-600", bg: "bg-blue-500/5" },
        { label: "Replies", value: totalReplies, sub: `${replyRate.toFixed(1)}% rate`, icon: MessageSquare, color: "text-orange-600", bg: "bg-orange-500/5" },
        { label: "Positive", value: totalPositives, sub: `${positiveRate.toFixed(1)}% of replies`, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-500/5" },
        { label: "Bounces", value: totalBounces, sub: "Delivery errors", icon: XCircle, color: "text-destructive", bg: "bg-destructive/5" },
        { label: "Meetings", value: totalMeetings, sub: "Goal achieved", icon: Target, color: "text-purple-600", bg: "bg-purple-500/5" },
    ]

    return (
        <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
                {stats.map((stat) => (
                    <Card key={stat.label} className="border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-card/50 backdrop-blur-sm overflow-hidden group">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</CardTitle>
                            <div className={cn("p-2 rounded-xl transition-colors", stat.bg)}>
                                <stat.icon className={cn("h-4 w-4", stat.color)} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className={cn("text-3xl font-bold tracking-tighter mb-1", stat.color)}>{stat.value}</div>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.sub}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-7">
                <Card className="col-span-4 border-none shadow-xl shadow-primary/5 rounded-[2.5rem] bg-card/50 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="border-b border-border/50 p-8 pb-6">
                        <CardTitle className="text-xl font-bold tracking-tight">Campaign Funnel</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="flex items-end justify-between h-56 gap-6 px-4">
                            {[
                                { label: "Sent", value: totalSent, max: totalSent, color: "bg-blue-500" },
                                { label: "Opened", value: Math.floor(totalSent * 0.45), max: totalSent, color: "bg-indigo-500" },
                                { label: "Replied", value: totalReplies, max: totalSent, color: "bg-orange-500" },
                                { label: "Interested", value: totalPositives, max: totalSent, color: "bg-green-500" },
                                { label: "Meeting", value: totalMeetings, max: totalSent, color: "bg-purple-500" },
                            ].map((step, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-4 group h-full">
                                    <div className="w-full bg-muted/20 rounded-t-2xl relative overflow-hidden h-full flex items-end shadow-inner">
                                        <div
                                            className={cn("w-full rounded-t-2xl transition-all duration-1000 group-hover:opacity-80 shadow-lg", step.color)}
                                            style={{ height: `${(step.value / (step.max || 1)) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-sm font-bold tracking-tight">{step.value}</div>
                                        <div className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">{step.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 border-none shadow-xl shadow-primary/5 rounded-[2.5rem] bg-card/50 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="border-b border-border/50 p-8 pb-6 flex flex-row items-center justify-between">
                        <CardTitle className="text-xl font-bold tracking-tight">Top Campaigns</CardTitle>
                        <TrendingUp className="h-5 w-5 text-green-500" />
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        {projCampaigns.slice(0, 4).map((c) => (
                            <div key={c.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 hover:bg-white/50 transition-all group cursor-pointer border border-transparent hover:border-border/50">
                                <div className="space-y-1">
                                    <div className="text-sm font-bold group-hover:text-primary transition-colors">{c.name}</div>
                                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{c.status}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-black text-green-600">
                                        {((c.replies / (c.emailsSent || 1)) * 100).toFixed(1)}%
                                    </div>
                                    <div className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Rate</div>
                                </div>
                            </div>
                        ))}
                        {projCampaigns.length === 0 && (
                            <div className="text-center py-10 text-muted-foreground text-sm font-bold italic opacity-40">No lead campaigns yet.</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-none shadow-xl shadow-primary/5 rounded-[2.5rem] bg-card/50 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="border-b border-border/50 p-8 pb-6">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Engagement Heatmap</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="h-44 flex items-center justify-center bg-muted/20 rounded-[2rem] border border-dashed border-border/50">
                            <div className="text-center space-y-2">
                                <BarChart3 className="h-10 w-10 text-muted-foreground/10 mx-auto" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 px-6">Engagement by Timezone Comparison</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-xl shadow-primary/5 rounded-[2.5rem] bg-card/50 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="border-b border-border/50 p-8 pb-6">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Lead Sentiment</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="space-y-6">
                            {[
                                { label: "Positive Reply", value: totalPositives, color: "bg-green-500" },
                                { label: "Interested", value: Math.floor(totalPositives * 0.7), color: "bg-blue-500" },
                                { label: "Objected", value: Math.floor(totalReplies * 0.2), color: "bg-orange-400" },
                            ].map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-muted-foreground">{item.label}</span>
                                        <span className="text-foreground">{item.value}</span>
                                    </div>
                                    <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                                        <div className={cn("h-full transition-all duration-1000 shadow-sm", item.color)} style={{ width: `${(item.value / (totalReplies || 1)) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
