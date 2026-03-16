"use client"

import { useState } from "react"
import { useCRMData } from "@/hooks/use-crm-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    Mail,
    Search,
    Filter,
    MoreHorizontal,
    ExternalLink,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    AlertCircle,
    Tag as TagIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function EmailsPage() {
    const { campaigns, projects, tags, isLoaded } = useCRMData()
    const [searchQuery, setSearchQuery] = useState("")

    if (!isLoaded) return null

    const filteredCampaigns = campaigns.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.to.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getProjectName = (projectId: string) => {
        return projects.find(p => p.id === projectId)?.name || "Unknown Project"
    }

    const getTagDetails = (tagId: string) => {
        return tags.find(t => t.id === tagId)
    }

    return (
        <div className="space-y-8 p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-foreground">Global Outreach</h1>
                    <p className="text-muted-foreground font-medium mt-1">Track and manage all email campaigns across your workspace.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold border-border/50 hover:bg-primary/5 hover:text-primary transition-all gap-2">
                        <Filter className="h-4 w-4" /> Filter
                    </Button>
                    <Button className="rounded-2xl h-12 px-6 font-bold shadow-lg shadow-primary/20 gap-2">
                        <Mail className="h-4 w-4" /> Export Report
                    </Button>
                </div>
            </div>

            {/* KPI Summary */}
            <div className="grid gap-6 md:grid-cols-4">
                {[
                    { label: "Total Sent", value: campaigns.reduce((acc, c) => acc + c.recipients, 0).toString(), icon: Mail, color: "text-primary", bg: "bg-primary/5" },
                    { label: "Avg Open Rate", value: "64.2%", icon: ArrowUpRight, color: "text-blue-600", bg: "bg-blue-500/5" },
                    { label: "Avg Reply Rate", value: "18.5%", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-500/5" },
                    { label: "Active Campaigns", value: campaigns.filter(c => c.status === "Sent").length.toString(), icon: Clock, color: "text-orange-600", bg: "bg-orange-500/5" },
                ].map((stat) => (
                    <Card key={stat.label} className="border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-card/50 backdrop-blur-sm overflow-hidden group">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</CardTitle>
                            <div className={cn("p-2 rounded-xl transition-colors", stat.bg)}>
                                <stat.icon className={cn("h-4 w-4", stat.color)} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className={cn("text-3xl font-bold tracking-tighter mb-1", stat.color)}>{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search & Table */}
            <div className="space-y-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search campaigns, subjects, or recipients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 bg-card/50 border-border/50 rounded-2xl h-12 font-medium focus-visible:ring-primary/20"
                    />
                </div>

                <div className="border border-border/50 rounded-[2.5rem] overflow-hidden bg-card/50 backdrop-blur-sm shadow-2xl shadow-primary/5">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-b border-border/50 bg-muted/20">
                                <TableHead className="pl-10 h-20 text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground/80">Campaign</TableHead>
                                <TableHead className="h-20 text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground/80">Project</TableHead>
                                <TableHead className="h-20 text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground/80">Recipient</TableHead>
                                <TableHead className="h-20 text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground/80">Status</TableHead>
                                <TableHead className="h-20 text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground/80">Tags</TableHead>
                                <TableHead className="pr-10 h-20 text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground/80 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCampaigns.map((campaign) => (
                                <TableRow
                                    key={campaign.id}
                                    className="group hover:bg-primary/[0.02] transition-colors border-b border-border/50 last:border-0"
                                >
                                    <TableCell className="pl-10 py-6">
                                        <div className="space-y-1">
                                            <div className="font-bold text-[0.925rem] group-hover:text-primary transition-colors">{campaign.name}</div>
                                            <div className="text-xs text-muted-foreground font-medium truncate max-w-[200px]">{campaign.subject}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-6">
                                        <Link href={`/projects/${campaign.projectId}`} className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline">
                                            {getProjectName(campaign.projectId)}
                                            <ExternalLink className="h-3 w-3" />
                                        </Link>
                                    </TableCell>
                                    <TableCell className="py-6 font-medium text-muted-foreground">{campaign.to}</TableCell>
                                    <TableCell className="py-6">
                                        <Badge variant={campaign.status === "Sent" ? "default" : campaign.status === "Completed" ? "secondary" : "outline"} className={cn(
                                            "rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-widest",
                                            campaign.status === "Sent" ? "bg-primary shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"
                                        )}>
                                            {campaign.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-6">
                                        <div className="flex flex-wrap gap-1">
                                            {campaign.tags.map(tagId => {
                                                const tag = getTagDetails(tagId)
                                                return tag ? (
                                                    <Badge key={tagId} className={cn("rounded-full px-2 py-0 text-[8px] font-black uppercase tracking-widest text-white", tag.color)}>
                                                        {tag.name}
                                                    </Badge>
                                                ) : null
                                            })}
                                        </div>
                                    </TableCell>
                                    <TableCell className="pr-10 py-6 text-right">
                                        <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 hover:bg-primary/5 hover:text-primary transition-colors">
                                            <MoreHorizontal className="h-5 w-5" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredCampaigns.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-40 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            <Mail className="h-10 w-10 text-muted-foreground/20" />
                                            <p className="text-muted-foreground font-medium">No campaigns found matching your search.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
