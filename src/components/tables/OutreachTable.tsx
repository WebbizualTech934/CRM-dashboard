"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Mail } from "lucide-react"
import { useCRMData } from "@/hooks/use-crm-data"
import { cn } from "@/lib/utils"
import { DataTable } from "@/components/shared/DataTable"
import { ImportExportDialog } from "@/components/shared/ImportExportDialog"
import { RowDetailDrawer } from "./RowDetailDrawer"

export function OutreachTable({ projectId }: { projectId?: string }) {
    const { campaigns, deleteCampaign, deleteManyCampaigns, isLoaded } = useCRMData()
    const [viewingCampaign, setViewingCampaign] = useState<any>(null)

    if (!isLoaded) return null

    const projectCampaigns = projectId ? campaigns.filter(c => c.projectId === projectId) : campaigns

    const columns = [
        {
            header: "Campaign Name",
            accessorKey: "name",
            sortable: true,
            width: "300px",
            cell: (campaign: any) => (
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 shadow-sm border border-primary/5">
                        <Mail className="h-4.5 w-4.5" />
                    </div>
                    <div className="font-bold text-sm text-foreground">{campaign.name}</div>
                </div>
            )
        },
        {
            header: "Subject",
            accessorKey: "subject",
            sortable: true,
            width: "350px",
            cell: (campaign: any) => <span className="text-muted-foreground font-bold text-sm" title={campaign.subject}>{campaign.subject}</span>
        },
        {
            header: "Status",
            accessorKey: "status",
            sortable: true,
            width: "160px",
            cell: (campaign: any) => (
                <Badge className={cn(
                    "rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest border-none shadow-none",
                    campaign.status === "Sent" ? "bg-primary text-white" :
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
            width: "120px",
            className: "text-center",
            cell: (campaign: any) => <span className="font-bold text-sm text-foreground">{campaign.recipients}</span>
        },
        {
            header: "Opens",
            accessorKey: "opens",
            sortable: true,
            width: "120px",
            className: "text-center",
            cell: (campaign: any) => <span className="font-bold text-sm text-blue-600">{campaign.opens}</span>
        },
        {
            header: "Replies",
            accessorKey: "replies",
            sortable: true,
            width: "120px",
            className: "text-center",
            cell: (campaign: any) => <span className="font-bold text-sm text-green-600">{campaign.replies}</span>
        }
    ]

    return (
        <>
        <DataTable
            data={projectCampaigns}
            columns={columns}
            searchKey="name"
            searchPlaceholder="Search campaigns..."
            entityType="Campaign"
            onView={(c) => setViewingCampaign(c)}
            onDelete={(campaign) => deleteCampaign(campaign.id)}
            onBulkDelete={deleteManyCampaigns}
            onRowClick={(c) => setViewingCampaign(c)}
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
            onEdit={(campaign) => {
                // For now, campaigns don't have a dedicated edit modal in the same way
                // but we can provide the hook for future expansion
                console.log("Edit campaign:", campaign.id)
            }}
        />
        </>
    )
}
