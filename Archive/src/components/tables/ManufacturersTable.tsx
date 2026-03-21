"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, ExternalLink, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCRMData } from "@/hooks/use-crm-data"
import { DataTable } from "@/components/shared/DataTable"
import { ImportExportDialog } from "@/components/shared/ImportExportDialog"
import { NewLeadModal } from "@/components/leads/NewLeadModal"
import { RowDetailDrawer } from "./RowDetailDrawer"

export function ManufacturersTable({ projectId }: { projectId?: string }) {
    const { manufacturers, deleteManufacturer, deleteManyManufacturers, isLoaded } = useCRMData()
    const [selectedManufacturer, setSelectedManufacturer] = useState<any>(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isNewModalOpen, setIsNewModalOpen] = useState(false)

    if (!isLoaded) return null

    const projectManufacturers = projectId ? manufacturers.filter((m: any) => m.projectId === projectId) : manufacturers

    const columns = [
        {
            header: "Parent Company",
            accessorKey: "parentCompany",
            sortable: true,
            cell: (m: any) => (
                <div className="font-bold text-foreground truncate max-w-[200px]" title={m.parentCompany}>
                    {m.parentCompany}
                </div>
            )
        },
        {
            header: "Peer Brand",
            accessorKey: "peerBrand",
            sortable: true,
            cell: (m: any) => <span className="text-muted-foreground">{m.peerBrand || "-"}</span>
        },
        {
            header: "Match Rate",
            accessorKey: "productMatchRate",
            sortable: true,
            className: "text-center",
            cell: (m: any) => (
                <Badge className="bg-primary/10 text-primary border-none rounded-full px-3 py-1 font-bold shadow-sm">
                    {m.productMatchRate || "-"}
                </Badge>
            )
        },
        {
            header: "Fit Level",
            accessorKey: "fitLevel",
            sortable: true,
            className: "text-center",
            cell: (m: any) => (
                <Badge className={cn("rounded-full border-none px-3 py-1 font-bold shadow-sm text-white",
                    m.fitLevel === "High" ? "bg-green-500" :
                        m.fitLevel === "Low" ? "bg-red-500" :
                            "bg-yellow-500"
                )}>
                    {m.fitLevel || "Medium"}
                </Badge>
            )
        },
        {
            header: "Website",
            accessorKey: "website",
            cell: (m: any) => (
                <div className="flex items-center gap-2 group/link min-w-[120px]">
                    <span className="text-muted-foreground truncate max-w-[150px]">{m.website || "-"}</span>
                    {m.website && (
                        <a
                            href={m.website.startsWith('http') ? m.website : `https://${m.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-7 w-7 rounded-lg bg-blue-500/5 flex items-center justify-center text-blue-600 opacity-0 group-hover/link:opacity-100 transition-all hover:bg-blue-500/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ExternalLink className="h-3 w-3" />
                        </a>
                    )}
                </div>
            )
        },
        {
            header: "Country",
            accessorKey: "country",
            sortable: true,
            cell: (m: any) => <span className="text-muted-foreground">{m.country || "-"}</span>
        },
        {
            header: "Visual Presence",
            accessorKey: "visualPresence",
            className: "text-center",
            cell: (m: any) => (
                <Badge variant="outline" className={cn("rounded-full px-3 py-1 font-bold shadow-sm border-2 whitespace-nowrap",
                    m.visualPresence === "Excellent" ? "border-green-500 text-green-600" :
                        m.visualPresence === "Good" ? "border-blue-500 text-blue-600" :
                            m.visualPresence === "Poor" ? "border-red-500 text-red-600" :
                                "border-yellow-500 text-yellow-600"
                )}>
                    {m.visualPresence || "Average"}
                </Badge>
            )
        }
    ]

    const handleRowClick = (m: any) => {
        setSelectedManufacturer(m)
        setIsDrawerOpen(true)
    }

    return (
        <>
            <DataTable
                data={projectManufacturers}
                columns={columns}
                searchKey="parentCompany"
                searchPlaceholder="Search manufacturers..."
                entityType="Manufacturer"
                onDelete={(m) => deleteManufacturer(m.id)}
                onBulkDelete={deleteManyManufacturers}
                rowClickable
                onRowClick={handleRowClick}
                toolbarActions={
                    <>
                        <Button
                            onClick={() => setIsNewModalOpen(true)}
                            className="rounded-xl font-bold h-11 px-6 shadow-lg shadow-primary/20 gap-2 text-white"
                        >
                            <Plus className="h-4 w-4" /> Add Row
                        </Button>
                        <ImportExportDialog mode="import" type="manufacturers" projectId={projectId} />
                        <ImportExportDialog mode="export" type="manufacturers" projectId={projectId} />
                    </>
                }
            />

            <RowDetailDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                data={selectedManufacturer}
            />

            <NewLeadModal
                type="manufacturers"
                projectId={projectId}
                open={isNewModalOpen}
                onOpenChange={setIsNewModalOpen}
            />
        </>
    )
}
