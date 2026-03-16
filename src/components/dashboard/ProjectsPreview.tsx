"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ArrowUpRight } from "lucide-react"

import { useCRMData } from "@/hooks/use-crm-data"

export function ProjectsPreview() {
    const { projects, isLoaded } = useCRMData()

    if (!isLoaded) return null

    const activeProjects = projects
        .filter(p => p.status === "Active")
        .slice(0, 4)

    return (
        <Card className="col-span-4 border-none shadow-2xl shadow-primary/5 rounded-[2.5rem] bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 p-8 pb-6">
                <CardTitle className="text-2xl font-bold tracking-tight">Active Projects</CardTitle>
                <Button variant="ghost" size="sm" render={<Link href="/projects" className="flex items-center gap-2 font-bold text-primary hover:bg-primary/5 rounded-xl px-4 h-10" />}>
                    View All <ArrowUpRight className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-border/50 bg-muted/20">
                            <TableHead className="pl-10 h-16 text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground/80">Project Name</TableHead>
                            <TableHead className="h-16 text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground/80">Leads</TableHead>
                            <TableHead className="h-16 text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground/80">Status</TableHead>
                            <TableHead className="h-16 text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground/80">Team</TableHead>
                            <TableHead className="pr-10 h-16 text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground/80 text-right">Last Update</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {activeProjects.map((project) => (
                            <TableRow key={project.id} className="group hover:bg-primary/[0.02] transition-colors border-b border-border/50 last:border-0">
                                <TableCell className="pl-10 py-6 font-bold text-[0.925rem] text-foreground group-hover:text-primary transition-colors">
                                    <Link href={`/projects/${project.id}`}>{project.name}</Link>
                                </TableCell>
                                <TableCell className="py-6">
                                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg font-bold text-xs">{project.leads}</span>
                                </TableCell>
                                <TableCell className="py-6">
                                    <Badge variant={project.status === "Active" ? "default" : "secondary"} className={cn(
                                        "rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-widest",
                                        project.status === "Active" ? "bg-primary shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"
                                    )}>
                                        {project.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-6 font-bold text-[0.925rem] text-muted-foreground">{project.teamMemberIds?.length || 0} members</TableCell>
                                <TableCell className="pr-10 py-6 text-right text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60">{project.updatedAt}</TableCell>
                            </TableRow>
                        ))}
                        {activeProjects.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-medium">
                                    No active projects found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
