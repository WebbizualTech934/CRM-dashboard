"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette, Plus } from "lucide-react"
import { useCRMData } from "@/hooks/use-crm-data"
import { cn } from "@/lib/utils"
import { DataTable } from "@/components/shared/DataTable"
import { ImportExportDialog } from "@/components/shared/ImportExportDialog"

export function CreativeTable({ projectId }: { projectId?: string }) {
    const { creativeAssets, updateCreativeAsset, deleteCreativeAsset, deleteManyCreativeAssets, addCreativeAsset, isLoaded } = useCRMData()

    if (!isLoaded) return null

    const projectAssets = projectId ? creativeAssets.filter(a => a.projectId === projectId) : creativeAssets

    // Calculate KPIs
    const total = projectAssets.length
    const completedDesign = projectAssets.filter(a => a.designStatus === "Completed Designs").length
    const completedWebsite = projectAssets.filter(a => a.websiteStatus === "Live Website").length
    const completedAnimation = projectAssets.filter(a => a.animationStatus === "Completed Animation").length
    const pending = total * 3 - (completedDesign + completedWebsite + completedAnimation)

    const columns = [
        {
            header: "Company Name",
            accessorKey: "companyName",
            sortable: true,
            cell: (asset: any) => <div className="font-bold text-foreground">{asset.companyName}</div>
        },
        {
            header: "Contact Person",
            accessorKey: "contactPerson",
            sortable: true,
            cell: (asset: any) => <span className="font-medium text-muted-foreground">{asset.contactPerson || "—"}</span>
        },
        {
            header: "Email",
            accessorKey: "email",
            sortable: true,
            cell: (asset: any) => <span className="font-medium text-muted-foreground">{asset.email || "—"}</span>
        },
        {
            header: "Status",
            accessorKey: "status",
            sortable: true,
            cell: (asset: any) => (
                <Badge className="bg-muted/50 text-muted-foreground border-none rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest">
                    {asset.status}
                </Badge>
            )
        },
        {
            header: "Priority",
            accessorKey: "priority",
            sortable: true,
            cell: (asset: any) => (
                <Badge className={cn(
                    "rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest text-white border-none",
                    asset.priority === "HIGH" ? "bg-red-500" : asset.priority === "MEDIUM" ? "bg-primary" : "bg-blue-500"
                )}>
                    {asset.priority}
                </Badge>
            )
        },
        {
            header: "Last Contact",
            accessorKey: "lastContact",
            sortable: true,
            cell: (asset: any) => <span className="font-medium text-muted-foreground/60">{asset.lastContact}</span>
        }
    ]

    return (
        <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-4">
                {[
                    { label: "Design Accuracy", value: total > 0 ? `${((completedDesign / total) * 100).toFixed(0)}%` : "0%", sub: `${completedDesign}/${total} Completed`, color: "text-primary" },
                    { label: "Website Accuracy", value: total > 0 ? `${((completedWebsite / total) * 100).toFixed(0)}%` : "0%", sub: `${completedWebsite}/${total} Live`, color: "text-blue-600" },
                    { label: "Animation Accuracy", value: total > 0 ? `${((completedAnimation / total) * 100).toFixed(0)}%` : "0%", sub: `${completedAnimation}/${total} Completed`, color: "text-green-600" },
                    { label: "Pending Tasks", value: pending.toString(), sub: "Total across assets", color: "text-orange-600" },
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
                onDelete={(asset) => deleteCreativeAsset(asset.id)}
                onBulkDelete={deleteManyCreativeAssets}
                toolbarActions={
                    <>
                        <Button
                            onClick={() => addCreativeAsset({
                                projectId: projectId || "1",
                                companyName: "New Company",
                                contactPerson: "New Lead",
                                email: "email@example.com",
                                status: "NEW",
                                priority: "MEDIUM",
                                lastContact: new Date().toISOString().split('T')[0],
                                designStatus: "Pending",
                                websiteStatus: "Pending",
                                animationStatus: "Pending",
                                storyboardStatus: "Pending",
                                scriptStatus: "Pending"
                            })}
                            className="rounded-full bg-primary hover:bg-primary/90 text-white px-6 h-11 font-bold gap-2 shadow-lg shadow-primary/20"
                        >
                            <Plus className="h-4 w-4" /> Add Row
                        </Button>
                        <ImportExportDialog mode="import" type="creative" projectId={projectId} />
                        <ImportExportDialog mode="export" type="creative" projectId={projectId} />
                    </>
                }
            />
        </div>
    )
}
