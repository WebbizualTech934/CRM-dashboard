"use client"

import { Badge } from "@/components/ui/badge"
import { Mail, User } from "lucide-react"
import { useCRMData } from "@/hooks/use-crm-data"
import { cn } from "@/lib/utils"
import { DataTable } from "@/components/shared/DataTable"
import { ImportExportDialog } from "@/components/shared/ImportExportDialog"
import { RowDetailDrawer } from "../tables/RowDetailDrawer"
import { useState } from "react"

import Link from "next/link"

export function CampaignTable({ projectId, status }: { projectId?: string, status?: string }) {
    const { campaigns, projects, deleteCampaign, deleteManyCampaigns, isLoaded } = useCRMData()
    const [viewingCampaign, setViewingCampaign] = useState<any>(null)

    if (!isLoaded) return null

    const projCampaigns = campaigns.filter(c => {
        if (projectId && c.projectId !== projectId) return false
        if (status && c.status !== status) return false
        return true
    })

    const columns = [
        {
            header: "Campaign Name",
            accessorKey: "name",
            sortable: true,
            cell: (c: any) => (
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <Mail className="h-4.5 w-4.5" />
                    </div>
                    <div>
                        <div className="font-bold text-foreground">{c.name}</div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Sequence V1</div>
                    </div>
                </div>
            )
        },
        ...(projectId ? [] : [{
            header: "Project",
            accessorKey: "projectId",
            sortable: true,
            cell: (c: any) => {
                const project = projects.find(p => p.id === c.projectId)
                return (
                    <Link 
                        href={`/projects/${c.projectId}`} 
                        className="text-xs font-bold text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {project?.name || "Global"}
                    </Link>
                )
            }
        }]),
        {
            header: "Status",
            accessorKey: "status",
            sortable: true,
            cell: (c: any) => (
                <Badge className={cn(
                    "rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest border-none",
                    c.status === "Active" ? "bg-green-500 text-white shadow-lg shadow-green-500/20" :
                        c.status === "Paused" ? "bg-orange-500 text-white" :
                            c.status === "Draft" ? "bg-muted text-muted-foreground" :
                                "bg-muted text-muted-foreground"
                )}>
                    {c.status}
                </Badge>
            )
        },
        {
            header: "Leads",
            accessorKey: "leadsCount",
            sortable: true,
            className: "text-center",
            cell: (c: any) => <span className="font-bold">{c.leadsCount}</span>
        },
        {
            header: "Sent",
            accessorKey: "emailsSent",
            sortable: true,
            className: "text-center",
            cell: (c: any) => <span className="font-bold text-blue-600">{c.emailsSent}</span>
        },
        {
            header: "Open %",
            accessorKey: "opens",
            sortable: true,
            className: "text-center",
            cell: (c: any) => {
                const rate = c.emailsSent > 0 ? (c.opens / c.emailsSent) * 100 : 0
                return <span className="font-bold text-indigo-600">{rate.toFixed(1)}%</span>
            }
        },
        {
            header: "Reply %",
            accessorKey: "replies",
            sortable: true,
            className: "text-center",
            cell: (c: any) => {
                const rate = c.emailsSent > 0 ? (c.replies / c.emailsSent) * 100 : 0
                return <span className="font-bold text-orange-600">{rate.toFixed(1)}%</span>
            }
        },
        {
            header: "Positive %",
            accessorKey: "positives",
            sortable: true,
            className: "text-center",
            cell: (c: any) => {
                const rate = c.replies > 0 ? (c.positives / c.replies) * 100 : 0
                return <span className="font-bold text-green-600">{rate.toFixed(1)}%</span>
            }
        },
        {
            header: "Owner",
            accessorKey: "owner",
            sortable: true,
            cell: (c: any) => (
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <span className="text-xs font-bold">{c.owner || "Unassigned"}</span>
                </div>
            )
        },
        {
            header: "Last Activity",
            accessorKey: "updatedAt",
            sortable: true,
            cell: (c: any) => (
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {new Date(c.updatedAt).toLocaleDateString()}
                </span>
            )
        }
    ]

    return (
        <>
        <DataTable
            data={projCampaigns}
            columns={columns}
            searchPlaceholder="Search campaigns and subjects..."
            searchKeys={["name", "subject"]}
            entityType="Campaign"
            onView={(c) => setViewingCampaign(c)}
            onDelete={(c) => deleteCampaign(c.id)}
            onBulkDelete={deleteManyCampaigns}
            onRowClick={(c) => setViewingCampaign(c)}
            filters={[
                {
                    key: "status",
                    label: "Status",
                    options: [
                        { label: "Active", value: "Active" },
                        { label: "Paused", value: "Paused" },
                        { label: "Draft", value: "Draft" },
                        { label: "Completed", value: "Completed" },
                        { label: "Sent", value: "Sent" }
                    ]
                }
            ]}
            toolbarActions={
                <>
                    <ImportExportDialog mode="import" type="campaigns" projectId={projectId} />
                    <ImportExportDialog mode="export" type="campaigns" projectId={projectId} />
                </>
            }
        />
        
        <RowDetailDrawer
            open={!!viewingCampaign}
            onOpenChange={(open) => !open && setViewingCampaign(null)}
            data={viewingCampaign}
        />
        </>
    )
}
