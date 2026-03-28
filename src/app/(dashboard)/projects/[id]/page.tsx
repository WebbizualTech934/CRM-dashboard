"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LeadsTable } from "@/components/tables/LeadsTable"
import { ManufacturersTable } from "@/components/tables/ManufacturersTable"
import { CreativeTable } from "@/components/tables/CreativeTable"
import { NewLeadModal } from "@/components/leads/NewLeadModal"
import { EditProjectModal } from "@/components/projects/EditProjectModal"
import { ManageTeamModal } from "@/components/projects/ManageTeamModal"
import { TasksTable } from "@/components/tables/TasksTable"
import { NewTaskModal } from "@/components/projects/NewTaskModal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCRMData } from "@/hooks/use-crm-data"
import { Settings, Share2, Download, LayoutDashboard, Palette, CheckSquare, Activity, BarChart3, Plus, Mail, Calendar, Users, Briefcase, ArrowRight, ExternalLink, MoreHorizontal, Search, Trash2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { TeamTable } from "@/components/tables/TeamTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState } from "react"

export default function ProjectDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    const { projects, leads, teamMembers, creativeAssets, isLoaded, addLead, addCreativeAsset, deleteProject } = useCRMData()
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

    if (!isLoaded) return null

    // Find the current project
    const project = projects.find(p => p.id === id)

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <Briefcase className="h-16 w-16 text-muted-foreground opacity-20" />
                <h1 className="text-2xl font-bold">Project Not Found</h1>
                <p className="text-muted-foreground">This project may have been deleted or moved.</p>
            </div>
        )
    }

    // Calculate real stats for this project
    const projectLeads = leads.filter(l => l.projectId === project.id)
    const totalLeads = projectLeads.length
    const contactedLeads = projectLeads.filter(l => l.status !== "New").length
    const interestedLeads = projectLeads.filter(l => l.status === "Interested").length

    // Mock "Leads added this week" for now (or calculate if we had dates)
    const leadsThisWeek = Math.floor(totalLeads * 0.3)

    // Assigned team members
    const assignedTeam = teamMembers.filter(m => project.teamMemberIds?.includes(m.id))

    // Recent activity (simulated from leads)

    // Recent activity (simulated from leads)
    const recentActivity = projectLeads.slice(0, 5).map(lead => ({
        user: lead.assignedTo || "Admin",
        action: "updated lead",
        target: lead.company,
        time: "Recently"
    }))

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/projects" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors">Projects</Link>
                        <ArrowRight className="h-3 w-3 text-muted-foreground/30" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Details</span>
                    </div>
                    <div className="flex items-center gap-3 mb-1">
                        <Badge className={cn(
                            "border-none rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest",
                            project.status === "Active" ? "bg-green-500/10 text-green-600" : "bg-primary/10 text-primary"
                        )}>
                            {project.status}
                        </Badge>
                        <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-500/5 border border-blue-500/10">
                            <Activity className="h-3 w-3 text-blue-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Health: Excellent</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <h1 className="text-5xl font-black tracking-tighter text-foreground">{project.name}</h1>
                        <Badge variant="outline" className="h-7 px-3 rounded-xl border-border/50 bg-background/50 font-bold text-[10px] text-muted-foreground">
                            #{project.id.slice(0, 8).toUpperCase()}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground font-medium mt-1 max-w-2xl">{project.description}</p>
                </div>
                <div className="flex items-center gap-3 pt-4">
                    <Button
                        variant="outline"
                        className="rounded-2xl h-12 px-6 font-bold border-border/50 hover:bg-primary/5 hover:text-primary transition-all gap-2"
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href)
                            alert("Project link copied to clipboard!")
                        }}
                    >
                        <Share2 className="h-4 w-4" /> Share
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="rounded-2xl h-12 px-6 font-bold border-border/50 hover:bg-primary/5 hover:text-primary transition-all gap-2"
                            onClick={() => setIsEditModalOpen(true)}
                        >
                            <Settings className="h-4 w-4" /> Settings
                        </Button>
                        <Button
                            variant="outline"
                            className="rounded-2xl h-12 w-12 p-0 font-bold border-border/50 hover:bg-destructive/5 hover:text-destructive transition-all"
                            onClick={() => {
                                if (confirm("Are you sure you want to delete this project?")) {
                                    deleteProject(project.id)
                                    router.push("/projects")
                                }
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-10">
                <TabsList className="bg-card/50 backdrop-blur-sm border border-border/50 p-2 rounded-2xl h-auto min-h-16 gap-2 flex-wrap justify-start w-full">
                    {[
                        { value: "overview", label: "Overview", icon: LayoutDashboard },
                        { value: "leads", label: "Leads", icon: Users },
                        { value: "manufacturers", label: "Manufacturers", icon: Briefcase },
                        { value: "creative", label: "Creative", icon: Palette },
                        { value: "tasks", label: "Tasks", icon: CheckSquare },
                        { value: "team", label: "Team", icon: Users },
                        { value: "activity", label: "Activity", icon: Activity },
                        { value: "reports", label: "Reports", icon: BarChart3 },
                    ].map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="rounded-xl px-6 h-12 font-bold text-xs gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all"
                        >
                            <tab.icon className="h-4 w-4" /> {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="overview" className="mt-6 space-y-8">
                    {/* KPI Cards */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {[
                            { label: "Total Leads", value: totalLeads.toString(), sub: `${leadsThisWeek} this week`, icon: Users, color: "text-primary", bg: "bg-primary/5" },
                            { label: "Conversions", value: interestedLeads.toString(), sub: `${((interestedLeads / totalLeads || 0) * 100).toFixed(0)}% conversion`, icon: Activity, color: "text-green-600", bg: "bg-green-500/5" },
                            { label: "Follow-ups Due", value: "0", sub: "Next 24h", icon: Calendar, color: "text-orange-600", bg: "bg-orange-500/5" },
                        ].map((stat) => (
                            <Card key={stat.label} className="border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-card/50 backdrop-blur-sm overflow-hidden group">
                                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</CardTitle>
                                    <div className={cn("p-2 rounded-xl transition-colors", stat.bg)}>
                                        <stat.icon className={cn("h-4 w-4", stat.color)} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className={cn("text-4xl font-bold tracking-tighter mb-1", stat.color)}>{stat.value}</div>
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.sub}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid gap-8 lg:grid-cols-7">
                        {/* Leads Growth Chart (SVG) */}
                        <Card className="col-span-4 border-none shadow-xl shadow-primary/5 rounded-[2.5rem] bg-card/50 backdrop-blur-sm overflow-hidden">
                            <CardHeader className="border-b border-border/50 p-8 pb-6 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-bold tracking-tight">Leads Growth</CardTitle>
                                    <p className="text-xs text-muted-foreground font-medium mt-1">Lead acquisition over the last 7 days</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Leads</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="h-[200px] w-full relative mt-4">
                                    <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                                        <defs>
                                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                                                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        <path
                                            d="M0,80 Q50,70 100,75 T200,60 T300,40 T400,20 L400,100 L0,100 Z"
                                            fill="url(#chartGradient)"
                                        />
                                        <path
                                            d="M0,80 Q50,70 100,75 T200,60 T300,40 T400,20"
                                            fill="none"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />
                                        {/* Data Points */}
                                        {[0, 100, 200, 300, 400].map((x, i) => (
                                            <circle key={i} cx={x} cy={i === 0 ? 80 : i === 1 ? 75 : i === 2 ? 60 : i === 3 ? 40 : 20} r="4" fill="white" stroke="hsl(var(--primary))" strokeWidth="2" />
                                        ))}
                                    </svg>
                                    <div className="flex justify-between mt-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 px-1">
                                        <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="col-span-3 border-none shadow-xl shadow-primary/5 rounded-[2.5rem] bg-card/50 backdrop-blur-sm overflow-hidden">
                            <CardHeader className="border-b border-border/50 p-8 pb-6">
                                <CardTitle className="text-xl font-bold tracking-tight">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-4">
                                <Button
                                    onClick={() => setIsLeadModalOpen(true)}
                                    className="w-full h-14 rounded-2xl font-bold justify-start gap-4 bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground transition-all group/btn"
                                >
                                    <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center group-hover/btn:bg-white/20 transition-colors">
                                        <Plus className="h-5 w-5" />
                                    </div>
                                    Add New Lead
                                </Button>
                                <Button className="w-full h-14 rounded-2xl font-bold justify-start gap-4 bg-muted/30 text-foreground hover:bg-muted/50 transition-all group/btn">
                                    <div className="h-8 w-8 rounded-xl bg-muted/50 flex items-center justify-center group-hover/btn:bg-white/20 transition-colors">
                                        <Download className="h-5 w-5" />
                                    </div>
                                    Export Project Data
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-7">
                        {/* Recent Activity */}
                        <Card className="col-span-4 border-none shadow-xl shadow-primary/5 rounded-[2.5rem] bg-card/50 backdrop-blur-sm overflow-hidden">
                            <CardHeader className="border-b border-border/50 p-8 pb-6">
                                <CardTitle className="text-xl font-bold tracking-tight">Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="space-y-8">
                                    {recentActivity.length > 0 ? recentActivity.map((item, i) => (
                                        <div key={i} className="flex items-start gap-4 group">
                                            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs group-hover:scale-110 transition-transform">
                                                {item.user[0]}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    <span className="font-bold">{item.user}</span> {item.action} <span className="text-primary font-bold">{item.target}</span>
                                                </p>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{item.time}</p>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-10 text-muted-foreground font-medium">No recent activity found.</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Team Workload */}
                        <Card className="col-span-3 border-none shadow-xl shadow-primary/5 rounded-[2.5rem] bg-card/50 backdrop-blur-sm overflow-hidden">
                            <CardHeader className="border-b border-border/50 p-8 pb-6">
                                <CardTitle className="text-xl font-bold tracking-tight">Team Workload</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                {assignedTeam.map((member) => (
                                    <div key={member.id} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={member.avatar} />
                                                    <AvatarFallback className="text-[8px] font-bold">{member.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-xs font-bold">{member.name}</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{member.leadsAdded} Leads</span>
                                        </div>
                                        <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full transition-all duration-1000"
                                                style={{ width: `${Math.min((member.leadsAdded / 20) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                                {assignedTeam.length === 0 && (
                                    <div className="text-center py-10 text-muted-foreground font-medium">No team members assigned.</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="leads" className="mt-6">
                    <LeadsTable projectId={project.id} />
                </TabsContent>
                <TabsContent value="manufacturers" className="mt-6">
                    <ManufacturersTable />
                </TabsContent>

                <TabsContent value="creative" className="mt-6 space-y-8">
                    <CreativeTable projectId={project.id} />
                </TabsContent>

                <TabsContent value="tasks" className="mt-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold tracking-tight">Project Tasks</h3>
                            <p className="text-sm text-muted-foreground font-medium">Manage and track all deliverables for this project.</p>
                        </div>
                        <Button onClick={() => setIsTaskModalOpen(true)} className="rounded-2xl font-bold gap-2 h-12 px-6 shadow-lg shadow-primary/20">
                            <Plus className="h-4 w-4" /> Add Task
                        </Button>
                    </div>
                    <TasksTable projectId={project.id} />
                </TabsContent>
                <TabsContent value="team" className="mt-6">
                    <Card className="border-none shadow-xl shadow-primary/5 rounded-[2.5rem] bg-card/50 backdrop-blur-sm overflow-hidden">
                        <CardHeader className="border-b border-border/50 p-8 pb-6">
                            <CardTitle className="text-xl font-bold tracking-tight">Project Team</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <TeamTable memberIds={project.teamMemberIds} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="activity" className="mt-6 space-y-6">
                    <Card className="border-none shadow-xl shadow-primary/5 rounded-[2.5rem] bg-card/50 backdrop-blur-sm overflow-hidden">
                        <CardHeader className="border-b border-border/50 p-8 pb-6">
                            <CardTitle className="text-xl font-bold tracking-tight">Full Activity Log</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                                {[
                                    { user: "Admin", action: "imported 50 new leads", time: "2 hours ago", icon: Download, color: "bg-blue-500" },
                                    { user: "Ravi Kumar", action: "sent 15 outreach emails", time: "4 hours ago", icon: Mail, color: "bg-primary" },
                                    { user: "Sarah Chen", action: "updated project status to Active", time: "Yesterday", icon: Activity, color: "bg-green-500" },
                                    { user: "Admin", action: "assigned 3 new team members", time: "2 days ago", icon: Users, color: "bg-orange-500" },
                                    { user: "System", action: "project workspace created", time: "3 days ago", icon: Briefcase, color: "bg-muted-foreground" },
                                ].map((item, i) => (
                                    <div key={i} className="relative flex items-center justify-between group">
                                        <div className="flex items-center gap-6">
                                            <div className={cn("h-10 w-10 rounded-full flex items-center justify-center text-white shadow-lg z-10 transition-transform group-hover:scale-110", item.color)}>
                                                <item.icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-foreground">
                                                    <span className="text-primary">{item.user}</span> {item.action}
                                                </div>
                                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.time}</div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="rounded-xl font-bold text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">View Details</Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="reports" className="mt-6 space-y-8">
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-card/50 backdrop-blur-sm p-8">
                            <CardTitle className="text-sm font-bold mb-6">Leads by Status</CardTitle>
                            <div className="flex items-center justify-center h-[150px] relative">
                                <svg className="h-full w-full" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="hsl(var(--primary))" strokeWidth="15" strokeDasharray="180 251" strokeDashoffset="0" />
                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="hsl(var(--muted))" strokeWidth="15" strokeDasharray="71 251" strokeDashoffset="-180" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className="text-2xl font-bold">{totalLeads}</div>
                                    <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">Total</div>
                                </div>
                            </div>
                            <div className="mt-6 space-y-2">
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                                        <span>Interested</span>
                                    </div>
                                    <span>{interestedLeads}</span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-muted"></div>
                                        <span>Other</span>
                                    </div>
                                    <span>{totalLeads - interestedLeads}</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="col-span-2 border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-card/50 backdrop-blur-sm p-8">
                            <CardTitle className="text-sm font-bold mb-6">Outreach Performance</CardTitle>
                            <div className="h-[200px] w-full flex items-end justify-between gap-4 px-4">
                                {[65, 45, 85, 35, 95, 55, 75].map((h, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                                        <div className="w-full bg-primary/10 rounded-t-xl relative overflow-hidden h-full flex items-end">
                                            <div
                                                className="w-full bg-primary rounded-t-xl transition-all duration-1000 group-hover:bg-primary/80"
                                                style={{ height: `${h}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Day {i + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    <Card className="border-none shadow-xl shadow-primary/5 rounded-[2.5rem] bg-card/50 backdrop-blur-sm overflow-hidden">
                        <CardHeader className="border-b border-border/50 p-8 pb-6 flex flex-row items-center justify-between">
                            <CardTitle className="text-xl font-bold tracking-tight">Detailed Analytics</CardTitle>
                            <Button variant="outline" className="rounded-xl font-bold gap-2">
                                <Download className="h-4 w-4" /> Export PDF
                            </Button>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid gap-8 md:grid-cols-2">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Top Performing Members</h4>
                                    {assignedTeam.slice(0, 3).map((m, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/20">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={m.avatar} />
                                                    <AvatarFallback className="text-[10px] font-bold">{m.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm font-bold">{m.name}</span>
                                            </div>
                                            <Badge className="bg-green-500/10 text-green-600 border-none rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest">
                                                +{Math.floor(Math.random() * 20) + 10}%
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Conversion Funnel</h4>
                                    <div className="space-y-3">
                                        {[
                                            { label: "Leads", value: totalLeads, color: "bg-primary" },
                                            { label: "Contacted", value: contactedLeads, color: "bg-blue-500" },
                                            { label: "Interested", value: interestedLeads, color: "bg-green-500" },
                                        ].map((step, i) => (
                                            <div key={i} className="space-y-1">
                                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                                    <span>{step.label}</span>
                                                    <span>{step.value}</span>
                                                </div>
                                                <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                                                    <div
                                                        className={cn("h-full rounded-full", step.color)}
                                                        style={{ width: `${(step.value / totalLeads) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>


            <NewLeadModal
                open={isLeadModalOpen}
                onOpenChange={setIsLeadModalOpen}
                projectId={project.id}
            />

            <EditProjectModal
                project={project}
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
            />

            <ManageTeamModal
                project={project}
                open={isTeamModalOpen}
                onOpenChange={setIsTeamModalOpen}
            />

            <NewTaskModal
                open={isTaskModalOpen}
                onOpenChange={setIsTaskModalOpen}
                projectId={project.id}
            />
        </div>
    )
}
