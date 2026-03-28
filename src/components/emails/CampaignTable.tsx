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
            width: "300px",
            cell: (c: any) => (
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 shadow-sm border border-primary/5">
                        <Mail className="h-4.5 w-4.5" />
                    </div>
                    <div>
                        <div className="font-bold text-sm text-foreground">{c.name}</div>
                        <div className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none mt-1">Sequence V1</div>
                    </div>
                </div>
            )
        },
        ...(projectId ? [] : [{
            header: "Project",
            accessorKey: "projectId",
            sortable: true,
            width: "180px",
            cell: (c: any) => {
                const project = projects.find(p => p.id === c.projectId)
                return (
                    <Link 
                        href={`/projects/${c.projectId}`} 
                        className="text-xs font-bold text-primary hover:underline hover:text-primary/80 transition-colors"
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
            width: "150px",
            cell: (c: any) => (
                <Badge className={cn(
                    "rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest border-none shadow-none",
                    c.status === "Active" ? "bg-green-500 text-white" :
                        c.status === "Paused" ? "bg-orange-500 text-white" :
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
            width: "100px",
            className: "text-center",
            cell: (c: any) => <span className="font-bold text-sm text-foreground">{c.leadsCount}</span>
        },
        {
            header: "Sent",
            accessorKey: "emailsSent",
            sortable: true,
            width: "100px",
            className: "text-center",
            cell: (c: any) => <span className="font-bold text-sm text-blue-600">{c.emailsSent}</span>
        },
        {
            header: "Open %",
            accessorKey: "opens",
            sortable: true,
            width: "110px",
            className: "text-center",
            cell: (c: any) => {
                const rate = c.emailsSent > 0 ? (c.opens / c.emailsSent) * 100 : 0
                return <span className="font-black text-sm text-indigo-600 font-mono">{rate.toFixed(1)}%</span>
            }
        },
        {
            header: "Reply %",
            accessorKey: "replies",
            sortable: true,
            width: "110px",
            className: "text-center",
            cell: (c: any) => {
                const rate = c.emailsSent > 0 ? (c.replies / c.emailsSent) * 100 : 0
                return <span className="font-black text-sm text-orange-600 font-mono">{rate.toFixed(1)}%</span>
            }
        },
        {
            header: "Positive %",
            accessorKey: "positives",
            sortable: true,
            width: "110px",
            className: "text-center",
            cell: (c: any) => {
                const rate = c.replies > 0 ? (c.positives / c.replies) * 100 : 0
                return <span className="font-black text-sm text-green-600 font-mono">{rate.toFixed(1)}%</span>
            }
        },
        {
            header: "Owner",
            accessorKey: "owner",
            sortable: true,
            width: "180px",
            cell: (c: any) => (
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10 shadow-sm">
                        <User className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-bold text-foreground">{c.owner || "Unassigned"}</span>
                </div>
            )
        },
        {
            header: "Last Activity",
            accessorKey: "updatedAt",
            sortable: true,
            width: "150px",
            cell: (c: any) => (
                <span className="text-[11px] font-black text-muted-foreground/40 uppercase tracking-widest">
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
