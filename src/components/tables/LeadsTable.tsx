"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Plus, Mail, ExternalLink, Trash2, Edit2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCRMData } from "@/hooks/use-crm-data"
import { EditLeadModal } from "@/components/leads/EditLeadModal"
import { NewLeadModal } from "@/components/leads/NewLeadModal"
import { DataTable } from "@/components/shared/DataTable"
import { ImportExportDialog } from "@/components/shared/ImportExportDialog"
import { RowDetailDrawer } from "./RowDetailDrawer"

export function LeadsTable({ projectId }: { projectId?: string }) {
    const { leads, updateLead, deleteLead, deleteManyLeads, isLoaded } = useCRMData()
    const [selectedLead, setSelectedLead] = useState<any>(null)
    const [viewingLead, setViewingLead] = useState<any>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false)

    if (!isLoaded) return null

    const projectLeads = projectId ? leads.filter(l => l.projectId === projectId) : leads

    const columns = [
        {
            header: "Company",
            accessorKey: "company",
            sortable: true,
            width: "250px",
            cell: (lead: any) => (
                <div className="font-bold text-foreground" title={lead.company}>
                    {lead.company}
                </div>
            )
        },
        {
            header: "Contact Person",
            accessorKey: "firstName",
            sortable: true,
            width: "200px",
            cell: (lead: any) => (
                <div className="flex items-center gap-2">
                    <span className="font-bold">{lead.firstName} {lead.lastName}</span>
                </div>
            )
        },
        {
            header: "Work Email",
            accessorKey: "email",
            sortable: true,
            width: "250px",
            cell: (lead: any) => (
                <div className="flex items-center gap-2 group/link">
                    <span className="text-muted-foreground">{lead.email}</span>
                    <a
                        href={`mailto:${lead.email}`}
                        className="h-7 w-7 rounded-lg bg-primary/5 flex items-center justify-center text-primary opacity-0 group-hover/link:opacity-100 transition-all hover:bg-primary/10"
                        title="Send Email"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Mail className="h-3 w-3" />
                    </a>
                </div>
            )
        },
        {
            header: "Website",
            accessorKey: "websiteLink",
            width: "220px",
            cell: (lead: any) => (
                <div className="flex items-center gap-2 group/link min-w-[120px]">
                    <span className="text-muted-foreground">{lead.websiteLink || "-"}</span>
                    {lead.websiteLink && (
                        <a
                            href={lead.websiteLink.startsWith('http') ? lead.websiteLink : `https://${lead.websiteLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-7 w-7 rounded-lg bg-blue-500/5 flex items-center justify-center text-blue-600 opacity-0 group-hover/link:opacity-100 transition-all hover:bg-blue-500/10"
                            title="Open Website"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ExternalLink className="h-3 w-3" />
                        </a>
                    )}
                </div>
            )
        },
        {
            header: "Stage",
            accessorKey: "serviceInterest",
            sortable: true,
            cell: (lead: any) => (
                <Badge className={cn("rounded-full border-none px-3 py-1 font-bold shadow-sm whitespace-nowrap",
                    lead.serviceInterest === "Cold" ? "bg-blue-300 text-blue-900" :
                        lead.serviceInterest === "Warm" ? "bg-orange-400 text-orange-950" :
                            lead.serviceInterest === "Hot" ? "bg-red-500 text-white" :
                                "bg-slate-400 text-slate-900"
                )}>
                    {lead.serviceInterest || "Cold"}
                </Badge>
            )
        },
        {
            header: "Country",
            accessorKey: "country",
            sortable: true,
            cell: (lead: any) => <span className="text-muted-foreground">{lead.country || "-"}</span>
        },
        {
            header: "Speciality",
            accessorKey: "speciality",
            width: "200px",
            cell: (lead: any) => <span className="text-muted-foreground">{lead.speciality || "-"}</span>
        }
    ]

    const handleRowClick = (lead: any) => {
        setSelectedLead(lead)
        setIsEditModalOpen(true)
    }

    return (
        <>
            <DataTable
                data={projectLeads}
                columns={columns}
                searchPlaceholder="Search by company, name, or email..."
                searchKeys={["company", "firstName", "lastName", "email", "websiteLink"]}
                entityType="Lead"
                onView={(lead) => setViewingLead(lead)}
                onEdit={(lead) => {
                    setSelectedLead(lead)
                    setIsEditModalOpen(true)
                }}
                onDelete={(lead) => deleteLead(lead.id)}
                onBulkDelete={deleteManyLeads}
                onRowClick={(lead) => setViewingLead(lead)}
                filters={[
                    {
                        key: "serviceInterest",
                        label: "Stage",
                        options: [
                            { label: "Cold", value: "Cold" },
                            { label: "Warm", value: "Warm" },
                            { label: "Hot", value: "Hot" }
                        ]
                    }
                ]}
                toolbarActions={
                    <>
                        <Button
                            onClick={() => setIsNewLeadModalOpen(true)}
                            className="rounded-xl font-bold h-11 px-6 shadow-lg shadow-primary/20 gap-2 text-white"
                        >
                            <Plus className="h-4 w-4" /> Add Lead
                        </Button>
                        <ImportExportDialog mode="import" projectId={projectId} />
                        <ImportExportDialog mode="export" projectId={projectId} />
                    </>
                }
            />

            <EditLeadModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                lead={selectedLead}
            />

            <RowDetailDrawer
                open={!!viewingLead}
                onOpenChange={(open) => !open && setViewingLead(null)}
                data={viewingLead}
                onEdit={(lead) => {
                    setSelectedLead(lead)
                    setIsEditModalOpen(true)
                }}
            />

            <NewLeadModal
                open={isNewLeadModalOpen}
                onOpenChange={setIsNewLeadModalOpen}
                projectId={projectId}
            />
        </>
    )
}
