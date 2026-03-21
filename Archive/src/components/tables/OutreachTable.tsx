"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Mail } from "lucide-react"
import { useCRMData } from "@/hooks/use-crm-data"
import { cn } from "@/lib/utils"
import { DataTable } from "@/components/shared/DataTable"
import { ImportExportDialog } from "@/components/shared/ImportExportDialog"

export function OutreachTable({ projectId }: { projectId?: string }) {
    const { campaigns, deleteCampaign, deleteManyCampaigns, isLoaded } = useCRMData()

    if (!isLoaded) return null

    const projectCampaigns = projectId ? campaigns.filter(c => c.projectId === projectId) : campaigns

    const columns = [
        {
            header: "Campaign Name",
            accessorKey: "name",
            sortable: true,
            cell: (campaign: any) => (
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <Mail className="h-4.5 w-4.5" />
                    </div>
                    <div className="font-bold text-foreground">{campaign.name}</div>
                </div>
            )
        },
        {
            header: "Subject",
            accessorKey: "subject",
            sortable: true,
            cell: (campaign: any) => <span className="text-muted-foreground truncate max-w-[300px]" title={campaign.subject}>{campaign.subject}</span>
        },
        {
            header: "Status",
            accessorKey: "status",
            sortable: true,
            cell: (campaign: any) => (
                <Badge className={cn(
                    "rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-widest border-none",
                    campaign.status === "Sent" ? "bg-primary text-white shadow-lg shadow-primary/20" :
                        campaign.status === "Completed" ? "bg-green-500 text-white" :
                            "bg-muted text-muted-foreground"
                )}>
                    {campaign.status}
                </Badge>
            )
        },
        {
            header: "Recipients",
            accessorKey: "recipients",
            sortable: true,
            className: "text-center",
            cell: (campaign: any) => <span className="font-bold">{campaign.recipients}</span>
        },
        {
            header: "Opens",
            accessorKey: "opens",
            sortable: true,
            className: "text-center",
            cell: (campaign: any) => <span className="font-bold text-blue-600">{campaign.opens}</span>
        },
        {
            header: "Replies",
            accessorKey: "replies",
            sortable: true,
            className: "text-center",
            cell: (campaign: any) => <span className="font-bold text-green-600">{campaign.replies}</span>
        }
    ]

    return (
        <DataTable
            data={projectCampaigns}
            columns={columns}
            searchKey="name"
            searchPlaceholder="Search campaigns..."
            entityType="Campaign"
            onDelete={(campaign) => deleteCampaign(campaign.id)}
            onBulkDelete={deleteManyCampaigns}
            toolbarActions={
                <>
                    <ImportExportDialog mode="import" type="campaigns" projectId={projectId} />
                    <ImportExportDialog mode="export" type="campaigns" projectId={projectId} />
                </>
            }
        />
    )
}
