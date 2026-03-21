"use client"

import { Button } from "@/components/ui/button"
import { FileText, Plus, Copy, Trash2, Edit } from "lucide-react"
import { useCRMData } from "@/hooks/use-crm-data"
import { DataTable } from "@/components/shared/DataTable"
import { useState } from "react"
import { NewTemplateModal } from "./NewTemplateModal"
import { Badge } from "@/components/ui/badge"

export function TemplateList({ projectId }: { projectId?: string }) {
    const { templates, deleteTemplate, isLoaded } = useCRMData()
    const [isModalOpen, setIsModalOpen] = useState(false)

    if (!isLoaded) return null

    const projTemplates = projectId ? templates.filter(t => t.projectId === projectId) : templates

    const columns = [
        {
            header: "Template Name",
            accessorKey: "name",
            sortable: true,
            cell: (t: any) => (
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0 border border-blue-100">
                        <FileText className="h-4 w-4" />
                    </div>
                    <div>
                        <div className="font-semibold text-slate-800 truncate max-w-[200px]">{t.name}</div>
                        <div className="text-[10px] text-slate-500 font-medium truncate max-w-[200px]">
                            Subject: {t.subject}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: "Variables Used",
            accessorKey: "variables",
            sortable: false,
            cell: (t: any) => (
                <div className="flex gap-1.5 flex-wrap">
                    {['firstName', 'company'].map(v => (
                        <Badge key={v} variant="secondary" className="bg-slate-100 text-slate-600 text-[9px] font-bold px-1.5 py-0 uppercase tracking-widest border-none rounded-[3px] shadow-none">
                            {v}
                        </Badge>
                    ))}
                </div>
            )
        },
        {
            header: "Preview",
            accessorKey: "body",
            sortable: false,
            width: "300px",
            cell: (t: any) => (
                <span className="text-[11px] text-slate-500 font-medium italic line-clamp-1 max-w-[250px] truncate block">
                    {t.body}
                </span>
            )
        },
        {
            header: "Actions",
            accessorKey: "id",
            cell: (t: any) => (
                <div className="flex justify-end gap-1.5">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-sm text-slate-400 hover:text-slate-700 hover:bg-slate-100 shadow-none">
                        <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 px-3 rounded-sm border-slate-200 text-[#00a4bd] hover:bg-[#00a4bd]/5 font-semibold text-xs shadow-none gap-1.5">
                        <Edit className="h-3 w-3" /> Edit
                    </Button>
                </div>
            )
        }
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">Email Templates</h3>
                    <p className="text-sm text-slate-500 font-medium">Reusable message templates with variable support.</p>
                </div>
                <Button className="rounded-sm font-semibold gap-2 shadow-none bg-[#00a4bd] hover:bg-[#00a4bd]/90 text-white h-9 px-4" onClick={() => setIsModalOpen(true)}>
                    <Plus className="h-4 w-4" /> New Template
                </Button>
            </div>

            <DataTable
                data={projTemplates}
                columns={columns}
                searchPlaceholder="Search templates..."
                searchKeys={["name", "subject"]}
                entityType="Template"
                onDelete={(t) => deleteTemplate(t.id)}
            />

            <NewTemplateModal 
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                projectId={projectId}
            />
        </div>
    )
}
