"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { useCRMData } from "@/hooks/use-crm-data"

export function RecentActivity() {
    const { projects, leads, isLoaded } = useCRMData()

    if (!isLoaded) return null

    // Simulate recent activity from real data
    const activities = [
        ...projects.slice(0, 3).map(p => ({
            user: { name: "Admin", initials: "AD", avatar: "" },
            action: "updated project",
            target: p.name,
            time: p.updatedAt
        })),
        ...leads.slice(0, 3).map(l => ({
            user: { name: "Admin", initials: "AD", avatar: "" },
            action: "added lead",
            target: `${l.firstName} ${l.lastName}`,
            time: "Just now"
        }))
    ].sort((a, b) => new Date(b.time || 0).getTime() - new Date(a.time || 0).getTime())

    return (
        <Card className="col-span-3 border border-border shadow-2xl shadow-primary/5 rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="border-b border-border p-8 pb-6 bg-slate-50">
                <CardTitle className="text-2xl font-bold tracking-tight">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
                <div className="space-y-10">
                    {activities.map((activity, index) => (
                        <div key={index} className="flex items-start group">
                            <div className="relative">
                                <Avatar className="h-12 w-12 border-2 border-background shadow-md">
                                    <AvatarImage src={activity.user.avatar} alt="Avatar" />
                                    <AvatarFallback className="bg-primary/10 text-primary font-bold">{activity.user.initials}</AvatarFallback>
                                </Avatar>
                                {index !== activities.length - 1 && (
                                    <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-border/30 group-hover:bg-primary/20 transition-colors"></div>
                                )}
                            </div>
                            <div className="ml-6 space-y-2 flex-1">
                                <p className="text-[0.925rem] leading-relaxed">
                                    <span className="font-bold text-foreground">{activity.user.name}</span>{" "}
                                    <span className="text-muted-foreground">{activity.action}</span>{" "}
                                    <span className="text-primary font-bold">{activity.target}</span>
                                </p>
                                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60">
                                    {activity.time}
                                </p>
                            </div>
                        </div>
                    ))}
                    {activities.length === 0 && (
                        <div className="text-center text-muted-foreground font-medium py-8">
                            No recent activity.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
