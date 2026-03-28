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
            header: "Template",
            accessorKey: "name",
            sortable: true,
            cell: (t: any) => (
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 flex-shrink-0 border border-blue-500/20 shadow-sm">
                        <FileText className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="font-black text-sm text-foreground tracking-tight truncate max-w-[180px]">{t.name}</div>
                        <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest truncate max-w-[180px] mt-0.5">
                            Subject: {t.subject}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: "Category",
            accessorKey: "category",
            cell: (t: any) => {
                const categories = ["Cold Outreach", "Follow-up", "Founder Reachout", "Meeting Request"]
                const category = categories[Math.floor(Math.random() * categories.length)]
                return (
                    <Badge variant="outline" className="rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border-primary/20 text-primary bg-primary/5">
                        {category}
                    </Badge>
                )
            }
        },
        {
            header: "Variables",
            accessorKey: "variables",
            sortable: false,
            cell: (t: any) => (
                <div className="flex gap-1.5 flex-wrap">
                    {['firstName', 'company'].map(v => (
                        <code key={v} className="bg-muted px-1.5 py-0.5 rounded text-[8px] font-black text-muted-foreground uppercase tracking-widest border border-border">
                            {'{'}{v}{'}'}
                        </code>
                    ))}
                </div>
            )
        },
        {
            header: "Market Usage",
            accessorKey: "usage",
            cell: (t: any) => (
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-green-600">84%</span>
                    <div className="h-1 w-16 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: '84%' }} />
                    </div>
                </div>
            )
        },
        {
            header: "Actions",
            accessorKey: "id",
            cell: (t: any) => (
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all">
                        <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-border text-primary hover:bg-primary/5 font-black text-[10px] uppercase tracking-widest transition-all">
                        <Edit className="h-3.5 w-3.5 mr-2" /> Edit
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
                <Button className="rounded-2xl font-black uppercase tracking-widest text-[10px] gap-2 shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white h-12 px-6" onClick={() => setIsModalOpen(true)}>
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
