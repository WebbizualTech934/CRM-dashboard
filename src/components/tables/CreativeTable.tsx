"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette, Plus } from "lucide-react"
import { useCRMData } from "@/hooks/use-crm-data"
import { cn } from "@/lib/utils"
import { DataTable, Column } from "@/components/shared/DataTable"
import { ImportExportDialog } from "@/components/shared/ImportExportDialog"
import { CreativeAsset } from "@/providers/crm-provider"
import { RowDetailDrawer } from "./RowDetailDrawer"
import { NewCreativeModal } from "@/components/projects/NewCreativeModal"

export function CreativeTable({ projectId }: { projectId?: string }) {
    const { creativeAssets, updateCreativeAsset, deleteCreativeAsset, deleteManyCreativeAssets, addCreativeAsset, isLoaded } = useCRMData()
    const [isNewModalOpen, setIsNewModalOpen] = useState(false)
    const [editingAsset, setEditingAsset] = useState<CreativeAsset | null>(null)
    const [viewingAsset, setViewingAsset] = useState<CreativeAsset | null>(null)

    if (!isLoaded) return null

    const projectAssets = projectId ? creativeAssets.filter(a => a.projectId === projectId) : creativeAssets

    // Calculate KPIs
    const total = projectAssets.length
    const completedScript = projectAssets.filter(a => a.scriptStatus === "Completed").length
    const completedAnimation = projectAssets.filter(a => a.animationStatus === "Completed Animation").length
    const liveWebsites = projectAssets.filter(a => a.websiteStatus === "Live Website").length
    
    const columns: Column<CreativeAsset>[] = [
        {
            header: "S.No",
            accessorKey: "id",
            cell: (_: any, index: number) => <span className="text-muted-foreground font-medium">{index + 1}</span>
        },
        {
            header: "Company Name",
            accessorKey: "companyName",
            sortable: true,
            cell: (asset: any) => <div className="font-bold text-foreground truncate max-w-[120px]">{asset.companyName}</div>
        },
        {
            header: "Website",
            accessorKey: "website",
            cell: (asset: any) => asset.website ? <a href={asset.website.startsWith('http') ? asset.website : `https://${asset.website}`} target="_blank" className="text-blue-500 hover:underline truncate max-w-[100px] block text-xs">{asset.website}</a> : "—"
        },
        {
            header: "Product Link",
            accessorKey: "productLink",
            cell: (asset: any) => asset.productLink ? <a href={asset.productLink} target="_blank" className="text-blue-500 hover:underline truncate max-w-[100px] block text-xs">Link</a> : "—"
        },
        {
            header: "Product",
            accessorKey: "product",
            cell: (asset: any) => <span className="text-xs font-medium truncate max-w-[80px] block">{asset.product || "—"}</span>
        },
        {
            header: "Script Status",
            accessorKey: "scriptStatus",
            cell: (asset: any) => (
                <Badge className={cn("rounded-full px-2 py-0.5 text-[8px] font-bold uppercase", asset.scriptStatus === "Completed" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600")}>
                    {asset.scriptStatus}
                </Badge>
            )
        },
        {
            header: "Story board",
            accessorKey: "storyboardStatus",
            cell: (asset: any) => (
                <Badge className={cn("rounded-full px-2 py-0.5 text-[8px] font-bold uppercase", asset.storyboardStatus === "Completed" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600")}>
                    {asset.storyboardStatus}
                </Badge>
            )
        },
        {
            header: "Animation Plan",
            accessorKey: "animationPlan",
            cell: (asset: any) => <span className="text-[10px] truncate max-w-[80px] block">{asset.animationPlan}</span>
        },
        {
            header: "Wireframe/Design",
            accessorKey: "wireframeDesignStatus",
            cell: (asset: any) => <span className="text-[10px] truncate max-w-[80px] block">{asset.wireframeDesignStatus}</span>
        },
        {
            header: "Website Status",
            accessorKey: "websiteStatus",
            cell: (asset: any) => <span className="text-[10px] truncate max-w-[80px] block">{asset.websiteStatus}</span>
        },
        {
            header: "Animation Status",
            accessorKey: "animationStatus",
            cell: (asset: any) => <span className="text-[10px] truncate max-w-[80px] block">{asset.animationStatus}</span>
        },
        {
            header: "Deadline",
            accessorKey: "deadlineForDelivery",
            cell: (asset: any) => <span className="text-[10px] font-bold text-red-600">{asset.deadlineForDelivery || "—"}</span>
        },
        {
            header: "Duration",
            accessorKey: "timeDuration",
            cell: (asset: any) => <span className="text-[10px]">{asset.timeDuration || "—"}</span>
        },
        {
            header: "Script Drive",
            accessorKey: "scriptAnimationPlanDriveLink",
            cell: (asset: any) => asset.scriptAnimationPlanDriveLink ? <a href={asset.scriptAnimationPlanDriveLink} target="_blank" className="text-blue-500 hover:underline truncate max-w-[80px] block text-xs">Drive</a> : "—"
        },
        {
            header: "Animation Drive",
            accessorKey: "animationDriveLink",
            cell: (asset: any) => asset.animationDriveLink ? <a href={asset.animationDriveLink} target="_blank" className="text-blue-500 hover:underline truncate max-w-[80px] block text-xs">Drive</a> : "—"
        },
        {
            header: "Figma",
            accessorKey: "figmaLink",
            cell: (asset: any) => asset.figmaLink ? <a href={asset.figmaLink} target="_blank" className="text-purple-500 hover:underline truncate max-w-[80px] block text-xs">Figma</a> : "—"
        },
        {
            header: "Animation Hosted",
            accessorKey: "animationHostedLink",
            cell: (asset: any) => asset.animationHostedLink ? <a href={asset.animationHostedLink} target="_blank" className="text-blue-500 hover:underline truncate max-w-[80px] block text-xs">View</a> : "—"
        },
        {
            header: "Mock Web",
            accessorKey: "mockWebsiteLink",
            cell: (asset: any) => asset.mockWebsiteLink ? <a href={asset.mockWebsiteLink} target="_blank" className="text-blue-500 hover:underline truncate max-w-[80px] block text-xs">Mock</a> : "—"
        },
        {
            header: "Proposal",
            accessorKey: "projectProposalLink",
            cell: (asset: any) => asset.projectProposalLink ? <a href={asset.projectProposalLink} target="_blank" className="text-blue-500 hover:underline truncate max-w-[80px] block text-xs">Proposal</a> : "—"
        }
    ]

    return (
        <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-4">
                {[
                    { label: "Script Progress", value: total > 0 ? `${((completedScript / total) * 100).toFixed(0)}%` : "0%", sub: `${completedScript}/${total} Completed`, color: "text-primary" },
                    { label: "Website Status", value: total > 0 ? `${((liveWebsites / total) * 100).toFixed(0)}%` : "0%", sub: `${liveWebsites}/${total} Live`, color: "text-blue-600" },
                    { label: "Animation Progress", value: total > 0 ? `${((completedAnimation / total) * 100).toFixed(0)}%` : "0%", sub: `${completedAnimation}/${total} Completed`, color: "text-purple-600" },
                    { label: "Total Projects", value: total.toString(), sub: "In Creative Pipeline", color: "text-[#33475b]" },
                ].map((stat) => (
                    <Card key={stat.label} className="border-none shadow-xl shadow-primary/5 rounded-3xl bg-card/50 backdrop-blur-sm overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={cn("text-3xl font-bold tracking-tighter mb-1", stat.color)}>{stat.value}</div>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.sub}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <DataTable
                data={projectAssets}
                columns={columns}
                searchKey="companyName"
                searchPlaceholder="Search creative assets..."
                entityType="Asset"
                onView={(asset) => setViewingAsset(asset)}
                onEdit={(asset) => setEditingAsset(asset)}
                onDelete={(asset) => deleteCreativeAsset(asset.id)}
                onBulkDelete={deleteManyCreativeAssets}
                onRowClick={(asset) => setViewingAsset(asset)}
                toolbarActions={
                    <>
                        <Button
                            onClick={() => setIsNewModalOpen(true)}
                            className="rounded-full bg-[#ff7a59] hover:bg-[#ff7a59]/90 text-white px-6 h-10 font-bold gap-2 shadow-none"
                        >
                            <Plus className="h-4 w-4" /> Add Asset
                        </Button>
                        <ImportExportDialog mode="import" type="creative" projectId={projectId} />
                        <ImportExportDialog mode="export" type="creative" projectId={projectId} />
                    </>
                }
            />

            <NewCreativeModal
                open={isNewModalOpen || !!editingAsset}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsNewModalOpen(false)
                        setEditingAsset(null)
                    }
                }}
                projectId={projectId}
                asset={editingAsset}
            />

            <RowDetailDrawer
                open={!!viewingAsset}
                onOpenChange={(open) => !open && setViewingAsset(null)}
                data={viewingAsset}
            />
        </div>
    )
}
