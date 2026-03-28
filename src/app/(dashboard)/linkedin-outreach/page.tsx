"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
    LayoutDashboard, 
    Users, 
    MessageSquare, 
    CheckSquare, 
    BarChart3, 
    Mail,
    Plus,
    Activity,
    Calendar,
    Search,
    Filter,
    MoreHorizontal,
    ExternalLink,
    Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCRMData } from "@/hooks/use-crm-data"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { LinkedinLeadTable } from "@/components/linkedin/LinkedinLeadTable"
import { LeadDetailPanel } from "@/components/linkedin/LeadDetailPanel"
import { NewLinkedinLeadModal } from "@/components/linkedin/NewLinkedinLeadModal"
import { LinkedinAnalytics } from "@/components/linkedin/LinkedinAnalytics"
import { LinkedinTasks } from "@/components/linkedin/LinkedinTasks"
import { LinkedinInMail } from "@/components/linkedin/LinkedinInMail"
import { LinkedinSequenceBuilder } from "@/components/linkedin/LinkedinSequenceBuilder"
import { LinkedinLead } from "@/providers/crm-provider"

export default function LinkedinOutreachPage() {
    const { 
        linkedinLeads, 
        linkedinInteractions, 
        addLinkedinLead, 
        updateLinkedinLead, 
        deleteLinkedinLead,
        addLinkedinInteraction,
        isLoaded 
    } = useCRMData()
    
    const [activeTab, setActiveTab] = useState("overview")
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)

    const selectedLead = linkedinLeads.find(l => l.id === selectedLeadId)
    const selectedInteractions = linkedinInteractions.filter(i => i.leadId === selectedLeadId)

    if (!isLoaded) {
        return <div className="p-8">Loading LinkedIn Deal Engine...</div>
    }

    return (
        <div className="flex flex-col min-h-[calc(100vh-80px)] p-10 space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold tracking-tighter text-foreground">
                        LinkedIn <span className="text-primary">Deal Engine</span>
                    </h1>
                    <p className="text-muted-foreground font-medium mt-1">Handcrafted outreach, engineered for high-precision results.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl h-12 px-8 gap-2 shadow-lg shadow-primary/20 transition-all border-none"
                    >
                        <Plus className="h-5 w-5" /> Add Prospect
                    </Button>
                </div>
            </div>

            {/* Main Navigation */}
            <Tabs value={activeTab} className="space-y-10" onValueChange={setActiveTab}>
                <div className="flex items-center gap-6">
                    <TabsList className="bg-card/50 backdrop-blur-sm border border-border/50 p-1.5 rounded-3xl h-auto flex-wrap justify-start gap-1">
                        {[
                            { value: "overview", label: "Overview", icon: LayoutDashboard },
                            { value: "leads", label: "Leads", icon: Users },
                            { value: "sequences", label: "Sequences", icon: MessageSquare },
                            { value: "tasks", label: "Tasks", icon: CheckSquare },
                            { value: "inmail", label: "InMail Tracking", icon: Mail },
                        ].map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all border-none",
                                    activeTab === tab.value 
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                                        : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                                )}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {/* Tabs Content */}
                <TabsContent value="overview" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {[
                            { label: "Total Leads", value: linkedinLeads.length.toString(), icon: Users, color: "text-foreground" },
                            { label: "Connections", value: linkedinInteractions.filter(i => i.type === 'Connection').length.toString(), icon: Activity, color: "text-primary" },
                            { label: "Accepted", value: linkedinLeads.filter(l => l.status === 'Accepted').length.toString(), icon: CheckSquare, color: "text-primary" },
                            { label: "Replies", value: linkedinLeads.filter(l => l.status === 'Replied').length.toString(), icon: MessageSquare, color: "text-primary" },
                            { label: "Converted", value: linkedinLeads.filter(l => l.status === 'Converted').length.toString(), icon: LayoutDashboard, color: "text-primary" },
                            { 
                                label: "Follow-ups", 
                                value: linkedinLeads.filter(l => {
                                    const lastUpdate = new Date(l.updatedAt).getTime()
                                    return (Date.now() - lastUpdate) > 2 * 24 * 60 * 60 * 1000 && l.status !== 'Converted'
                                }).length.toString(), 
                                icon: Clock, 
                                color: "text-primary" 
                            },
                        ].map((stat) => (
                            <Card key={stat.label} className="bg-card/50 backdrop-blur-sm border-none shadow-xl shadow-primary/5 rounded-[2rem] overflow-hidden group hover:shadow-primary/10 transition-all">
                                <CardContent className="p-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={cn("p-2 rounded-xl bg-primary/5", stat.color)}>
                                            <stat.icon className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-3xl font-bold tracking-tighter">{stat.value}</div>
                                        <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">{stat.label}</div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Daily Actions Panel */}
                        <Card className="lg:col-span-2 bg-card/50 backdrop-blur-sm border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
                            <CardHeader className="p-10 border-b border-border/50 flex flex-row items-center justify-between bg-muted/5">
                                <div>
                                    <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-3">
                                        <Calendar className="h-6 w-6 text-primary" /> Daily Actions
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground font-medium mt-1">High-priority outreach focuses for today</p>
                                </div>
                                <Badge className="bg-primary shadow-lg shadow-primary/20 text-primary-foreground border-none font-black text-[10px] uppercase tracking-widest px-4 py-1">
                                    {linkedinLeads.filter(l => l.status === 'Not Contacted').length} Pending
                                </Badge>
                            </CardHeader>
                            <CardContent className="p-10">
                                <div className="space-y-6">
                                    {linkedinLeads.filter(l => l.status === 'Not Contacted').slice(0, 3).map(lead => (
                                        <div 
                                            key={lead.id} 
                                            className="p-6 rounded-3xl bg-muted/20 border border-transparent flex items-center justify-between group hover:border-primary/20 hover:bg-primary/5 transition-all cursor-pointer shadow-sm"
                                            onClick={() => setSelectedLeadId(lead.id)}
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center font-bold text-primary group-hover:scale-110 transition-transform">
                                                    {lead.contactName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-lg">{lead.contactName}</div>
                                                    <div className="text-sm text-muted-foreground font-medium">{lead.companyName} • Strategic Entry</div>
                                                </div>
                                            </div>
                                            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground text-[10px] font-black tracking-widest h-10 px-6 rounded-xl border-none shadow-lg shadow-primary/10">SEND NOW</Button>
                                        </div>
                                    ))}
                                    {linkedinLeads.filter(l => l.status === 'Not Contacted').length === 0 && (
                                        <div className="text-center py-20 bg-muted/10 rounded-[2rem] border-2 border-dashed border-border/50">
                                            <div className="h-16 w-16 bg-muted/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                <CheckSquare className="h-8 w-8 text-muted-foreground/40" />
                                            </div>
                                            <h3 className="text-xl font-bold text-muted-foreground">Inbox Zero Attained</h3>
                                            <p className="text-sm text-muted-foreground/60 font-medium mt-1">All prioritized daily actions are up to date.</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity Feed */}
                        <Card className="bg-card/50 backdrop-blur-sm border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
                            <CardHeader className="p-10 border-b border-border/50 bg-muted/5">
                                <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-3">
                                    <Activity className="h-6 w-6 text-primary" /> Activity Feed
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-10">
                                <div className="relative space-y-10 before:absolute before:left-[17px] before:top-4 before:bottom-4 before:w-[2px] before:bg-border/50">
                                    {linkedinInteractions.slice(0, 5).map((interaction, idx) => (
                                        <div key={interaction.id} className="relative pl-12 group">
                                            <div className="absolute left-0 top-1 w-[36px] h-[36px] rounded-xl bg-card border-2 border-primary/20 shadow-sm flex items-center justify-center z-10 group-hover:border-primary transition-colors">
                                                <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]"></div>
                                            </div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-2">{new Date(interaction.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            <div className="text-sm font-bold text-foreground">{interaction.type}</div>
                                            <div className="text-xs text-muted-foreground font-medium line-clamp-2 mt-1">{interaction.content}</div>
                                        </div>
                                    ))}
                                    {linkedinInteractions.length === 0 && (
                                        <div className="text-center py-10 text-muted-foreground/40 text-sm font-medium">
                                            No recent activity tracked.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Integrated Analytics Section */}
                    <div className="mt-10 pt-10 border-t border-border/50">
                        <div className="flex items-center gap-3 mb-10">
                            <BarChart3 className="h-8 w-8 text-primary" />
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight">Performance Intelligence</h2>
                                <p className="text-muted-foreground font-medium mt-1">Real-time conversion funnels and outreach velocity tracking.</p>
                            </div>
                        </div>
                        <LinkedinAnalytics 
                            leads={linkedinLeads} 
                            interactions={linkedinInteractions} 
                        />
                    </div>
                </TabsContent>

                <TabsContent value="leads">
                    <LinkedinLeadTable 
                        leads={linkedinLeads}
                        onViewDetail={(lead) => setSelectedLeadId(lead.id)}
                        onDelete={deleteLinkedinLead}
                        onTabSwitch={setActiveTab}
                    />
                </TabsContent>

                <TabsContent value="sequences">
                    <LinkedinSequenceBuilder />
                </TabsContent>

                <TabsContent value="tasks">
                    <LinkedinTasks 
                        leads={linkedinLeads} 
                        onSelectLead={(id) => setSelectedLeadId(id)} 
                    />
                </TabsContent>

                <TabsContent value="inmail">
                    <LinkedinInMail 
                        leads={linkedinLeads} 
                        interactions={linkedinInteractions} 
                        onSelectLead={(id) => setSelectedLeadId(id)} 
                    />
                </TabsContent>
            </Tabs>

            {/* Modals & Panels */}
            <NewLinkedinLeadModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={addLinkedinLead}
            />

            {selectedLead && (
                <LeadDetailPanel 
                    lead={selectedLead}
                    interactions={selectedInteractions}
                    onClose={() => setSelectedLeadId(null)}
                    onAddInteraction={(type, content) => addLinkedinInteraction({ leadId: selectedLead.id, type, content })}
                    onUpdateLead={(updates) => updateLinkedinLead(selectedLead.id, updates)}
                />
            )}
        </div>
    )
}
