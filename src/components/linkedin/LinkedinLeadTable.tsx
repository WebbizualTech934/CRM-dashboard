"use client"

import { 
    Linkedin,
    Mail,
    MessageSquare,
    Clock,
    Target,
    FileText,
    ExternalLink
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LinkedinLead } from "@/providers/crm-provider"
import { cn } from "@/lib/utils"
import { DataTable } from "@/components/shared/DataTable"
import { ImportExportDialog } from "@/components/shared/ImportExportDialog"
import { ColumnDef } from "@tanstack/react-table"

interface LinkedinLeadTableProps {
    leads: LinkedinLead[]
    onViewDetail: (lead: any) => void
    onDelete: (id: string) => void
    onTabSwitch: (tab: string) => void
}

export function LinkedinLeadTable({ leads, onViewDetail, onDelete, onTabSwitch }: LinkedinLeadTableProps) {
    if (leads.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-32 bg-white border border-border mt-10 shadow-2xl shadow-primary/5 rounded-[3rem]">
                <div className="h-24 w-24 bg-primary/5 rounded-[2rem] flex items-center justify-center mb-8">
                    <Target className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-3xl font-bold tracking-tight text-foreground">Lead Database Empty</h3>
                <p className="text-muted-foreground font-medium mt-2 max-w-md mx-auto leading-relaxed">
                    Start by engineering your first deal. Add prospects from LinkedIn to begin high-precision outreach.
                </p>
                <Button className="mt-8 rounded-2xl h-12 px-8 font-black uppercase tracking-widest bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all border-none">
                    Initiate First Deal
                </Button>
            </div>
        )
    }

    const columns: ColumnDef<LinkedinLead>[] = [
        {
            id: "index",
            header: "S No.",
            cell: ({ row }) => <span className="text-[10px] font-black text-muted-foreground/40">{row.index + 1}</span>,
            size: 60
        },
        {
            accessorKey: "dateAdded",
            header: "Date",
            cell: ({ row }) => <span className="text-slate-500 font-medium whitespace-nowrap">{new Date(row.original.dateAdded || Date.now()).toLocaleDateString()}</span>,
            size: 140
        },
        {
            accessorKey: "companyName",
            header: "Company Name",
            cell: ({ row }) => <span className="font-black text-foreground tracking-tight whitespace-nowrap">{row.original.companyName}</span>,
            size: 220
        },
        {
            accessorKey: "contactName",
            header: "Contact Name",
            cell: ({ row }) => (
                <div className="flex items-center gap-3 whitespace-nowrap">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                        {row.original.contactName.charAt(0)}
                    </div>
                    <span className="font-bold">{row.original.contactName}</span>
                </div>
            ),
            size: 200
        },
        {
            accessorKey: "profileUrl",
            header: "LinkedIn",
            cell: ({ row }) => (
                <a
                    href={row.original.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100"
                >
                    <Linkedin className="h-4 w-4" />
                </a>
            ),
            size: 100
        },
        {
            accessorKey: "workEmail",
            header: "Work Email ID",
            cell: ({ row }) => (
                <div className="flex items-center gap-2 group/email whitespace-nowrap text-sm font-bold text-slate-600">
                    {row.original.workEmail || "—"}
                </div>
            ),
            size: 240
        },
        {
            accessorKey: "status",
            header: "Connect Status",
            cell: ({ row }) => (
                <Badge className={cn(
                    "font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border-none shadow-sm whitespace-nowrap",
                    row.original.status === 'Accepted' ? "bg-green-100 text-green-700" :
                    row.original.status === 'Replied' ? "bg-blue-100 text-blue-700" :
                    row.original.status === 'Converted' ? "bg-primary/10 text-primary" :
                    "bg-slate-100 text-slate-600"
                )}>
                    {row.original.status}
                </Badge>
            ),
            size: 160
        },
        {
            accessorKey: "sentTimeIST",
            header: "Sent Time (IST)",
            cell: ({ row }) => <span className="text-slate-500 font-medium whitespace-nowrap">{row.original.sentTimeIST || "—"}</span>,
            size: 180
        },
        {
            accessorKey: "draftedContent",
            header: "Drafted Content",
            cell: ({ row }) => (
                <button 
                    onClick={(e) => { e.stopPropagation(); onTabSwitch('sequences'); }}
                    className="text-primary hover:underline font-bold text-xs flex items-center gap-2 group/seq"
                >
                    <MessageSquare className="h-3 w-3 opacity-50 group-hover/seq:opacity-100" />
                    <span className="truncate max-w-[150px]">{row.original.draftedContent || "Add Sequence"}</span>
                </button>
            ),
            size: 200
        },
        {
            accessorKey: "leadSource",
            header: "Lead Source",
            cell: ({ row }) => <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest whitespace-nowrap">{row.original.leadSource || "Manual"}</span>,
            size: 160
        },
        {
            accessorKey: "updatedAt",
            header: "Recent Update",
            cell: ({ row }) => <span className="text-slate-500 font-medium whitespace-nowrap">{new Date(row.original.updatedAt).toLocaleDateString()} • {new Date(row.original.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>,
            size: 220
        },
        {
            accessorKey: "inMail",
            header: "In Mail",
            cell: ({ row }) => (
                <button 
                    onClick={(e) => { e.stopPropagation(); onTabSwitch('sequences'); }}
                    className="h-8 px-4 rounded-xl bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-widest border border-purple-100 hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                >
                    {row.original.inMail || "Pending"}
                </button>
            ),
            size: 140
        },
        {
            accessorKey: "followUp",
            header: "Follow Up",
            cell: ({ row }) => (
                <button 
                    onClick={(e) => { e.stopPropagation(); onTabSwitch('sequences'); }}
                    className="h-8 px-4 rounded-xl bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest border border-orange-100 hover:bg-orange-600 hover:text-white transition-all shadow-sm"
                >
                    {row.original.followUp || "Step 1"}
                </button>
            ),
            size: 140
        }
    ]

    return (
        <DataTable
            data={leads}
            columns={columns.map(c => ({
                ...c,
                width: c.size ? `${c.size}px` : undefined,
                sortable: true
            }))}
            searchPlaceholder="Search LinkedIn leads..."
            searchKeys={["companyName", "contactName", "workEmail"]}
            entityType="LinkedIn Lead"
            onView={(lead) => onViewDetail(lead)}
            onDelete={(lead) => onDelete(lead.id)}
            onRowClick={(lead) => onViewDetail(lead)}
            toolbarActions={
                <div className="flex items-center gap-3">
                    <ImportExportDialog mode="import" />
                    <ImportExportDialog mode="export" />
                </div>
            }
            filters={[
                {
                    key: "status",
                    label: "Status",
                    options: [
                        { label: "Not Contacted", value: "Not Contacted" },
                        { label: "Connection Sent", value: "Connection Sent" },
                        { label: "Accepted", value: "Accepted" },
                        { label: "Replied", value: "Replied" },
                        { label: "Converted", value: "Converted" }
                    ]
                },
                {
                    key: "priority",
                    label: "Priority",
                    options: [
                        { label: "High", value: "High" },
                        { label: "Medium", value: "Medium" },
                        { label: "Low", value: "Low" }
                    ]
                }
            ]}
        />
    )
}
