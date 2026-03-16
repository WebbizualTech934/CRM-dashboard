"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { MoreVertical, Mail, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { TeamTable } from "@/components/tables/TeamTable"
import { AddMemberModal } from "@/components/team/AddMemberModal"

import { useCRMData } from "@/hooks/use-crm-data"

export default function TeamPage() {
    const { teamMembers, isLoaded } = useCRMData()

    if (!isLoaded) return null

    const totalMembers = teamMembers.length
    const activeMembers = teamMembers.filter(m => m.status === "Active").length
    const totalLeads = teamMembers.reduce((acc, m) => acc + m.leadsAdded, 0)
    const totalEmails = teamMembers.reduce((acc, m) => acc + m.emailsSent, 0)

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold tracking-tighter text-foreground">Team Management</h1>
                    <p className="text-muted-foreground font-medium mt-1">
                        Manage your team members and track their performance.
                    </p>
                </div>
                <AddMemberModal />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Total Members", value: totalMembers.toString(), color: "text-primary" },
                    { label: "Active Now", value: activeMembers.toString(), color: "text-green-600" },
                    { label: "Total Leads Added", value: totalLeads.toLocaleString(), color: "text-foreground" },
                    { label: "Total Emails Sent", value: totalEmails.toLocaleString(), color: "text-foreground" }
                ].map((stat) => (
                    <Card key={stat.label} className="border-none shadow-xl shadow-primary/5 rounded-3xl bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={cn("text-3xl font-bold tracking-tighter", stat.color)}>{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-none shadow-xl shadow-primary/5 rounded-3xl bg-card/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-border/50 pb-6">
                    <CardTitle className="text-xl font-bold tracking-tight">Team Members</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <TeamTable />
                </CardContent>
            </Card>
        </div>
    )
}
