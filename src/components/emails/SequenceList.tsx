"use client"

import { Button } from "@/components/ui/button"
import { ListTree, Play, Plus, Clock, Mail } from "lucide-react"
import { useCRMData } from "@/hooks/use-crm-data"
import { DataTable } from "@/components/shared/DataTable"
import { useState } from "react"
import { NewSequenceModal } from "./NewSequenceModal"
import { Badge } from "@/components/ui/badge"

export function SequenceList({ projectId }: { projectId?: string }) {
    const { sequences, deleteSequence, isLoaded } = useCRMData()
    const [isModalOpen, setIsModalOpen] = useState(false)

    if (!isLoaded) return null

    const projSequences = projectId ? sequences.filter(s => s.projectId === projectId) : sequences

    const columns = [
        {
            header: "Sequence Name",
            accessorKey: "name",
            sortable: true,
            cell: (s: any) => (
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0 border border-purple-100">
                        <ListTree className="h-4 w-4" />
                    </div>
                    <div>
                        <div className="font-semibold text-slate-800">{s.name}</div>
                        <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                            {s.steps?.length || 0} Steps
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: "Status",
            accessorKey: "status",
            sortable: true,
            cell: (s: any) => (
                <Badge className="rounded-sm px-2 py-0.5 text-[11px] font-semibold bg-green-100 text-green-700 border-none shadow-none">
                    Active
                </Badge>
            )
        },
        {
            header: "Active Leads",
            accessorKey: "activeLeads",
            sortable: false,
            className: "text-center",
            cell: (s: any) => <span className="font-semibold text-slate-800">128</span>
        },
        {
            header: "Completed",
            accessorKey: "completed",
            sortable: false,
            className: "text-center",
            cell: (s: any) => <span className="font-semibold text-slate-600">452</span>
        },
        {
            header: "Actions",
            accessorKey: "id",
            cell: (s: any) => (
                <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" className="h-7 border-slate-200 text-xs font-medium text-slate-600 shadow-none hover:bg-slate-50">
                        Edit Flow
                    </Button>
                    <Button size="icon" className="h-7 w-7 bg-[#ff7a59] hover:bg-[#ff7a59]/90 shadow-none">
                        <Play className="h-3 w-3 text-white" />
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
                <Button className="rounded-sm font-semibold gap-2 shadow-none bg-[#ff7a59] hover:bg-[#ff7a59]/90 text-white h-9 px-4" onClick={() => setIsModalOpen(true)}>
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
