"use client"

import {
    Briefcase,
    Users,
    Send,
    CheckCircle2,
    TrendingUp,
    TrendingDown
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { useCRMData } from "@/hooks/use-crm-data"
import Link from "next/link"

export function StatsCards() {
    const { projects, leads, teamMembers, isLoaded } = useCRMData()

    if (!isLoaded) return null

    const totalProjects = projects.length
    const totalLeads = leads.length
    const interestedLeads = leads.filter(l => l.status === "Interested" || l.status === "Contacted").length
    const totalEmails = teamMembers.reduce((acc, m) => acc + (m.emailsSent || 0), 0)

    // Calculate trends (mock logic based on IDs/Length for demo)
    const newProjectsCount = Math.floor(totalProjects * 0.15) || 2
    const newLeadsCount = Math.floor(totalLeads * 0.2) || 5
    const emailIncrease = 12.5

    const stats = [
        {
            title: "Total Projects",
            value: totalProjects.toLocaleString(),
            icon: Briefcase,
            trend: `+${newProjectsCount} new this month`,
            trendType: "up",
            color: "text-primary",
            bg: "bg-primary/10",
            link: "/projects"
        },
        {
            title: "Total Leads",
            value: totalLeads.toLocaleString(),
            icon: Users,
            trend: `+${newLeadsCount} newly generated`,
            trendType: "up",
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            link: "/leads"
        },
        {
            title: "Emails Sent",
            value: totalEmails.toLocaleString(),
            icon: Send,
            trend: `+${emailIncrease}% from last week`,
            trendType: "up",
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            link: "/emails"
        },
        {
            title: "Active Outreach",
            value: interestedLeads.toLocaleString(),
            icon: CheckCircle2,
            trend: "92% engagement rate",
            trendType: "up",
            color: "text-green-500",
            bg: "bg-green-500/10",
            link: "/emails"
        }
    ]

    return (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Link href={stat.link} key={stat.title}>
                    <Card className="relative overflow-hidden border-none shadow-2xl shadow-primary/5 hover:shadow-primary/10 transition-all duration-300 group rounded-[2.5rem] bg-card/50 backdrop-blur-sm cursor-pointer h-full">
                        <div className={cn("absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 rounded-full opacity-10 transition-transform group-hover:scale-110", stat.bg)}></div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-8 pb-4 relative z-10">
                            <CardTitle className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-[0.2em]">
                                {stat.title}
                            </CardTitle>
                            <div className={cn("p-4 rounded-[1.25rem] transition-transform group-hover:rotate-12", stat.bg)}>
                                <stat.icon className={cn("h-6 w-6", stat.color)} />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10 p-8 pt-0">
                            <div className="text-5xl font-bold tracking-tighter text-foreground">{stat.value}</div>
                            <div className="flex items-center mt-4">
                                <div className={cn(
                                    "flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                    stat.trendType === "up" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                                )}>
                                    {stat.trendType === "up" ? (
                                        <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                                    ) : (
                                        <TrendingDown className="h-3.5 w-3.5 mr-1.5" />
                                    )}
                                    {stat.trend}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
}
