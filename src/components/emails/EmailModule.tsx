"use client"
 
import { useState, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutDashboard, Mail, ListTree, FileText, Inbox, BarChart3, Plus, Users, TrendingUp, Filter, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCRMData } from "@/hooks/use-crm-data"
import { cn } from "@/lib/utils"
import { CampaignTable } from "./CampaignTable"
import { EmailDashboard } from "./EmailDashboard"
import { SequenceList } from "./SequenceList"
import { TemplateList } from "./TemplateList"
import { EmailInbox } from "./EmailInbox"
import { EmailLeads } from "./EmailLeads"
import { NewCampaignModal } from "@/components/projects/NewCampaignModal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
 
export function EmailModule({ projectId: initialProjectId }: { projectId?: string }) {
    const { campaigns, projects, isLoaded } = useCRMData()
    const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false)
    const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjectId || "all")
    const [campaignStatus, setCampaignStatus] = useState<string>("all")
 
    if (!isLoaded) return null
 
    const effectiveProjectId = initialProjectId || (selectedProjectId === "all" ? undefined : selectedProjectId)
    
    const projectCampaigns = useMemo(() => {
        let filtered = campaigns
        if (effectiveProjectId) {
            filtered = filtered.filter(c => c.projectId === effectiveProjectId)
        }
        if (campaignStatus !== "all") {
            filtered = filtered.filter(c => c.status === campaignStatus)
        }
        return filtered
    }, [campaigns, effectiveProjectId, campaignStatus])
 
    const totalEmails = projectCampaigns.reduce((acc: number, c: any) => acc + (c.emailsSent || 0), 0)
    const totalOpens = projectCampaigns.reduce((acc: number, c: any) => acc + (c.opens || 0), 0)
    const totalReplies = projectCampaigns.reduce((acc: number, c: any) => acc + (c.replies || 0), 0)
    const totalPositives = projectCampaigns.reduce((acc: number, c: any) => acc + (c.positives || 0), 0)
    
    const openRate = totalEmails > 0 ? (totalOpens / totalEmails) * 100 : 0
    const replyRate = totalEmails > 0 ? (totalReplies / totalEmails) * 100 : 0
    const positiveRate = totalReplies > 0 ? (totalPositives / totalReplies) * 100 : 0
 
    return (
        <div className="space-y-6">
            {!initialProjectId && (
                <div className="bg-white border border-border border border-border p-6 rounded-[2rem] flex flex-wrap items-center gap-4 shadow-xl shadow-primary/5">
                    <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                        <Filter className="h-4 w-4" /> Filters
                    </div>
                    
                    <div className="w-px h-8 bg-border/50 mx-2 hidden md:block"></div>
 
                    <Select value={selectedProjectId} onValueChange={(val) => setSelectedProjectId(val || "all")}>
                        <SelectTrigger className="w-[200px] h-11 rounded-xl bg-background/50 border-border font-bold text-xs ring-0 focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder="All Projects" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-none shadow-2xl">
                            <SelectItem value="all" className="font-bold rounded-lg focus:bg-primary/5 focus:text-primary">All Projects</SelectItem>
                            {projects.map(p => (
                                <SelectItem key={p.id} value={p.id} className="font-bold rounded-lg focus:bg-primary/5 focus:text-primary">{p.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
 
                    <Select value={campaignStatus} onValueChange={(val) => setCampaignStatus(val || "all")}>
                        <SelectTrigger className="w-[160px] h-11 rounded-xl bg-background/50 border-border font-bold text-xs ring-0 focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-none shadow-2xl">
                            <SelectItem value="all" className="font-bold rounded-lg focus:bg-primary/5 focus:text-primary">All Statuses</SelectItem>
                            <SelectItem value="Active" className="font-bold rounded-lg focus:bg-primary/5 focus:text-primary text-green-600">Active Only</SelectItem>
                            <SelectItem value="Draft" className="font-bold rounded-lg focus:bg-primary/5 focus:text-primary text-slate-500">Drafts</SelectItem>
                            <SelectItem value="Completed" className="font-bold rounded-lg focus:bg-primary/5 focus:text-primary text-blue-600">Completed</SelectItem>
                        </SelectContent>
                    </Select>
 
                    <Button variant="outline" className="h-11 rounded-xl bg-background/50 border-border font-bold text-xs gap-2 px-4 ml-auto">
                        <Calendar className="h-4 w-4" /> Last 30 Days
                    </Button>
                </div>
            )}
 
            <Tabs defaultValue="overview" className="space-y-8">
                <div className="flex items-center justify-between">
                    <TabsList className="bg-muted/50 p-1 rounded-xl h-11">
                        {[
                            { value: "overview", label: "Overview", icon: LayoutDashboard },
                            { value: "campaigns", label: "Campaigns", icon: Mail },
                            { value: "leads", label: "Leads", icon: Users },
                            { value: "sequences", label: "Sequences", icon: ListTree },
                            { value: "templates", label: "Templates", icon: FileText },
                            { value: "inbox", label: "Inbox", icon: Inbox },
                            { value: "analytics", label: "Analytics", icon: BarChart3 },
                        ].map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="rounded-lg px-4 h-9 font-bold text-[11px] uppercase tracking-wider gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
                            >
                                <tab.icon className="h-3.5 w-3.5" /> {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
 
                    <div className="flex items-center gap-3">
                        <Button
                            size="sm"
                            className="rounded-2xl font-black uppercase tracking-widest text-[11px] h-12 px-8 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white border-none transition-all hover:scale-[1.02] active:scale-[0.98]"
                            onClick={() => setIsCampaignModalOpen(true)}
                        >
                            <Plus className="h-4 w-4" /> New Campaign
                        </Button>
                    </div>
                </div>
 
                <TabsContent value="overview" className="mt-0">
                    <EmailDashboard projectId={effectiveProjectId} status={campaignStatus === "all" ? undefined : campaignStatus} />
                </TabsContent>
 
                <TabsContent value="campaigns" className="mt-0">
                    <CampaignTable projectId={effectiveProjectId} status={campaignStatus === "all" ? undefined : campaignStatus} />
                </TabsContent>
 
                <TabsContent value="leads" className="mt-0">
                    <EmailLeads projectId={effectiveProjectId} />
                </TabsContent>
 
                <TabsContent value="sequences" className="mt-0">
                    <SequenceList projectId={effectiveProjectId} />
                </TabsContent>
 
                <TabsContent value="templates" className="mt-0">
                    <TemplateList projectId={effectiveProjectId} />
                </TabsContent>
 
                <TabsContent value="inbox" className="mt-0">
                    <EmailInbox projectId={effectiveProjectId} />
                </TabsContent>
 
                <TabsContent value="analytics" className="mt-0 space-y-10">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {[
                            { label: "Total Emails", value: totalEmails.toLocaleString(), sub: "Outreach volume", icon: Mail, color: "text-primary", bg: "bg-primary/5" },
                            { label: "Open Rate", value: `${openRate.toFixed(1)}%`, sub: `${totalOpens} unique opens`, icon: Inbox, color: "text-blue-600", bg: "bg-blue-500/5" },
                            { label: "Reply Rate", value: `${replyRate.toFixed(1)}%`, sub: `${totalReplies} total replies`, icon: ListTree, color: "text-green-600", bg: "bg-green-500/5" },
                            { label: "High Interest", value: `${positiveRate.toFixed(1)}%`, sub: "High engagement", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-500/5" }
                        ].map((stat, i) => (
                            <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-border shadow-xl shadow-primary/5 space-y-4 group">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</p>
                                    <div className={cn("p-2 rounded-xl transition-colors", stat.bg)}>
                                        <stat.icon className={cn("h-4 w-4", stat.color)} />
                                    </div>
                                </div>
                                <div>
                                    <h4 className={cn("text-4xl font-bold tracking-tighter", stat.color)}>{stat.value}</h4>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{stat.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
 
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="p-8 rounded-[2.5rem] bg-card border shadow-sm h-80 flex flex-col items-center justify-center border-dashed">
                             <TrendingUp className="h-10 w-10 text-muted-foreground/20 mb-4" />
                             <p className="text-sm font-bold text-muted-foreground">Performance Trends Coming Soon</p>
                             <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1 italic">Real-time data synchronization in progress</p>
                        </div>
                        <div className="p-8 rounded-[2.5rem] bg-card border shadow-sm h-80 flex flex-col items-center justify-center border-dashed">
                             <BarChart3 className="h-10 w-10 text-muted-foreground/20 mb-4" />
                             <p className="text-sm font-bold text-muted-foreground">Campaign Comparison Overlays</p>
                             <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1 italic">Aggregating project-level metrics</p>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
 
            <NewCampaignModal
                open={isCampaignModalOpen}
                onOpenChange={setIsCampaignModalOpen}
                projectId={effectiveProjectId || ""}
            />
        </div>
    )
}
