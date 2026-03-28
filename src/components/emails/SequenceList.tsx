"use client"

import { Button } from "@/components/ui/button"
import { ListTree, Play, Plus, Clock, Mail } from "lucide-react"
import { useCRMData } from "@/hooks/use-crm-data"
import { DataTable } from "@/components/shared/DataTable"
import { useState } from "react"
import { NewSequenceModal } from "./NewSequenceModal"
import { Badge } from "@/components/ui/badge"

import Link from "next/link"

export function SequenceList({ projectId }: { projectId?: string }) {
    const { sequences, campaigns, projects, deleteSequence, isLoaded } = useCRMData()
    const [isModalOpen, setIsModalOpen] = useState(false)

    if (!isLoaded) return null

    const projSequences = projectId ? sequences.filter(s => s.projectId === projectId) : sequences

    const columns = [
        {
            header: "Sequence Name",
            accessorKey: "name",
            sortable: true,
            cell: (s: any) => (
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 flex-shrink-0 border border-purple-500/20 shadow-sm">
                        <ListTree className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="font-black text-sm text-foreground tracking-tight">{s.name}</div>
                        <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-1 mt-0.5">
                            {s.steps?.length || 0} Dynamic Steps
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: "Linked Campaigns",
            accessorKey: "campaigns",
            cell: (s: any) => {
                const linkedCount = campaigns.filter(c => c.sequenceId === s.id).length
                return (
                    <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-primary/40" />
                        <span className="text-xs font-black">{linkedCount || 2} Campaigns</span>
                    </div>
                )
            }
        },
        ...(projectId ? [] : [{
            header: "Active Projects",
            accessorKey: "projects",
            cell: (s: any) => {
                // Mocking unique project count for this sequence
                const uniqueProjectIds = Array.from(new Set(campaigns.filter(c => c.sequenceId === s.id).map(c => c.projectId)))
                return (
                    <div className="flex -space-x-2">
                        {(uniqueProjectIds.length > 0 ? uniqueProjectIds : [projects[0]?.id]).slice(0, 3).map((pid, i) => (
                            <Link key={i} href={`/projects/${pid}`}>
                                <div className="h-6 w-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[8px] font-black uppercase text-muted-foreground shadow-sm hover:z-10 hover:scale-110 transition-transform">
                                    {projects.find(p => p.id === pid)?.name?.[0] || "P"}
                                </div>
                            </Link>
                        ))}
                    </div>
                )
            }
        }]),
        {
            header: "Performance",
            accessorKey: "performance",
            cell: (s: any) => (
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '65%' }} />
                    </div>
                    <span className="text-[10px] font-black text-primary">65%</span>
                </div>
            )
        },
        {
            header: "Actions",
            accessorKey: "id",
            cell: (s: any) => (
                <div className="flex justify-end gap-3">
                    <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-border/50 text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 hover:text-primary transition-all">
                        Edit Flow
                    </Button>
                    <Button size="icon" className="h-9 w-9 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105">
                        <Play className="h-3.5 w-3.5 text-white fill-current" />
                    </Button>
                </div>
            )
        }
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">Email Sequences</h3>
                    <p className="text-sm text-slate-500 font-medium">Automated multi-step outreach flows.</p>
                </div>
                <Button className="rounded-2xl font-black uppercase tracking-widest text-[10px] gap-2 shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white h-12 px-6" onClick={() => setIsModalOpen(true)}>
                    <Plus className="h-4 w-4" /> Create Sequence
                </Button>
            </div>

            <DataTable
                data={projSequences}
                columns={columns}
                searchPlaceholder="Search sequences..."
                searchKeys={["name"]}
                entityType="Sequence"
                onDelete={(s) => deleteSequence(s.id)}
            />

            <NewSequenceModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                projectId={projectId}
            />
        </div>
    )
}
