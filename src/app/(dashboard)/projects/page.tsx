"use client"

import { useState } from "react"
import { CreateProjectModal } from "@/components/projects/CreateProjectModal"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MoreVertical, Users, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const projects = [
    {
        id: "1",
        name: "Automotive Manufacturers USA",
        description: "Lead generation for US-based automotive parts manufacturers.",
        leads: 450,
        status: "Active",
        team: 3,
        updatedAt: "2 hours ago"
    },
    {
        id: "2",
        name: "Transmission Parts Outreach",
        description: "Outreach campaign for transmission specialists in Europe.",
        leads: 280,
        status: "Paused",
        team: 2,
        updatedAt: "4 hours ago"
    },
    {
        id: "3",
        name: "Animation Prospecting",
        description: "Finding leads for custom 3D animation services.",
        leads: 120,
        status: "Active",
        team: 1,
        updatedAt: "Yesterday"
    },
    {
        id: "4",
        name: "Europe Leads Campaign",
        description: "Broad manufacturing leads across Western Europe.",
        leads: 340,
        status: "Active",
        team: 4,
        updatedAt: "2 days ago"
    },
    {
        id: "5",
        name: "Shopify Manufacturers List",
        description: "Manufacturers selling through Shopify stores.",
        leads: 890,
        status: "Active",
        team: 2,
        updatedAt: "3 days ago"
    }
]

import { useCRMData, Project } from "@/hooks/use-crm-data"
import { EditProjectModal } from "@/components/projects/EditProjectModal"
import { ManageTeamModal } from "@/components/projects/ManageTeamModal"

export default function ProjectsPage() {
    const { projects, deleteProject, duplicateProject, isLoaded } = useCRMData()
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("All Projects")
    const [sortBy, setSortBy] = useState("updated")

    // Modal state
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)

    if (!isLoaded) return null

    const filteredProjects = projects
        .filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesStatus = statusFilter === "All Projects" || p.status === statusFilter
            return matchesSearch && matchesStatus
        })
        .sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name)
            if (sortBy === "leads") return b.leads - a.leads
            return 0 // Default to original order (latest first)
        })

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold tracking-tighter text-foreground">Projects</h1>
                    <p className="text-muted-foreground font-medium mt-1">
                        Manage your lead generation and outreach workspaces.
                    </p>
                </div>
                <CreateProjectModal />
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4 bg-white border border-border p-4 rounded-3xl border border-border shadow-sm">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            type="search"
                            placeholder="Search projects by name, tags, or members..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 pr-4 h-11 bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-2xl transition-all"
                        />
                    </div>
                    <div className="h-8 w-px bg-border/50 mx-2"></div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-2">Sort by:</span>
                        <Select value={sortBy} onValueChange={(v: string | null) => v && setSortBy(v)}>
                            <SelectTrigger className="h-11 w-[160px] rounded-2xl bg-muted/30 border-none focus:ring-2 focus:ring-primary/20 font-bold text-xs transition-all">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-none shadow-xl">
                                <SelectItem value="updated" className="rounded-xl font-bold">Latest Updated</SelectItem>
                                <SelectItem value="leads" className="rounded-xl font-bold">Lead Count</SelectItem>
                                <SelectItem value="name" className="rounded-xl font-bold">Project Name</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {["All Projects", "Active", "Paused", "Draft", "Archived"].map((filter) => (
                        <Button
                            key={filter}
                            variant={statusFilter === filter ? "default" : "outline"}
                            onClick={() => setStatusFilter(filter)}
                            className={cn(
                                "rounded-full px-6 h-10 font-bold text-xs transition-all",
                                statusFilter === filter ? "shadow-lg shadow-primary/20" : "border-border hover:bg-primary/5 hover:text-primary"
                            )}
                        >
                            {filter}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                    <Card key={project.id} className="flex flex-col border-none shadow-xl shadow-primary/5 hover:shadow-primary/10 transition-all duration-300 group rounded-[2.5rem] bg-white border border-border overflow-hidden">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 p-8 pb-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Badge variant={project.status === "Active" ? "default" : "secondary"} className={cn(
                                        "rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-widest",
                                        project.status === "Active" ? "bg-primary shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"
                                    )}>
                                        {project.status}
                                    </Badge>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">ID: #{project.id.slice(0, 3).toUpperCase()}</span>
                                </div>
                                <CardTitle className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">{project.name}</CardTitle>
                                <CardDescription className="line-clamp-2 font-medium leading-relaxed">{project.description}</CardDescription>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger render={(props: any) => (
                                    <Button {...props} variant="ghost" size="icon" className="rounded-xl hover:bg-primary/5 hover:text-primary transition-colors">
                                        <MoreVertical className="h-5 w-5" />
                                    </Button>
                                )} />
                                <DropdownMenuContent align="end" className="w-48 rounded-2xl border-none shadow-2xl">
                                    <DropdownMenuItem className="rounded-xl font-bold" onClick={() => {
                                        setSelectedProject(project)
                                        setIsEditModalOpen(true)
                                    }}>
                                        Edit Project
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="rounded-xl font-bold" onClick={() => duplicateProject(project.id)}>
                                        Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="rounded-xl font-bold" onClick={() => {
                                        setSelectedProject(project)
                                        setIsTeamModalOpen(true)
                                    }}>
                                        Manage Team
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="rounded-xl font-bold text-destructive focus:text-destructive"
                                        onClick={() => deleteProject(project.id)}
                                    >
                                        Delete Project
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent className="flex-1 px-8">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-1">Total Leads</div>
                                    <div className="text-2xl font-bold tracking-tighter text-primary">{project.leads}</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-muted/30 border border-transparent">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Team Size</div>
                                    <div className="text-2xl font-bold tracking-tighter text-foreground">{project.teamMemberIds?.length || 0}</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-3.5 w-3.5" /> Updated {project.updatedAt}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="h-3.5 w-3.5" /> Shared
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="p-8 pt-4">
                            <Button variant="ghost" className="w-full justify-between h-14 rounded-2xl px-6 bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-bold group/btn" nativeButton={false} render={<Link href={`/projects/${project.id}`} />}>
                                Open Workspace <ArrowRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <EditProjectModal
                project={selectedProject}
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
            />
            <ManageTeamModal
                project={selectedProject}
                open={isTeamModalOpen}
                onOpenChange={setIsTeamModalOpen}
            />
        </div>
    )
}
