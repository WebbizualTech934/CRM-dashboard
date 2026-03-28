"use client"

import { 
    ExternalLink, 
    Link as LinkIcon,
    Plus,
    FileText,
    Mail,
    MessageSquare,
    Clock,
    Target
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LinkedinLead } from "@/providers/crm-provider"
import { cn } from "@/lib/utils"
import { DataTable } from "@/components/shared/DataTable"
import { ImportExportDialog } from "@/components/shared/ImportExportDialog"

interface LinkedinLeadTableProps {
    leads: LinkedinLead[]
    onViewDetail: (lead: LinkedinLead) => void
    onDelete: (id: string) => void
    onTabSwitch: (tab: string) => void
}

export function LinkedinLeadTable({ leads, onViewDetail, onDelete, onTabSwitch }: LinkedinLeadTableProps) {
    if (leads.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-32 bg-card/50 backdrop-blur-sm border-none shadow-2xl rounded-[3rem]">
                <div className="h-24 w-24 bg-primary/5 rounded-[2rem] flex items-center justify-center mb-8">
                    <Target className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-3xl font-bold tracking-tight text-foreground">Lead Database Empty</h3>
                <p className="text-muted-foreground font-medium mt-2 max-w-md mx-auto leading-relaxed">
                    Start by engineering your first deal. Add prospects from LinkedIn to begin high-precision outreach.
                </p>
                <Button className="mt-8 rounded-2xl h-12 px-8 font-black uppercase tracking-widest bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all">
                    Initiate First Deal
                </Button>
            </div>
        )
    }

    const columns = [
        {
            header: "S No.",
            accessorKey: "index",
            width: "60px",
            cell: (_: any, index: number) => (
                <span className="text-[10px] font-black text-muted-foreground/40">{index + 1}</span>
            )
        },
        {
            header: "Date",
            accessorKey: "dateAdded",
            sortable: true,
            width: "120px",
            cell: (lead: LinkedinLead) => (
                <span className="text-xs font-bold text-foreground/80">
                    {new Date(lead.dateAdded).toLocaleDateString()}
                </span>
            )
        },
        {
            header: "Company Name",
            accessorKey: "companyName",
            sortable: true,
            width: "250px",
            cell: (lead: LinkedinLead) => (
                <div className="font-bold text-sm text-foreground" title={lead.companyName}>
                    {lead.companyName}
                </div>
            )
        },
        {
            header: "Contact Name",
            accessorKey: "contactName",
            sortable: true,
            width: "200px",
            cell: (lead: LinkedinLead) => (
                <div className="font-bold text-sm text-foreground">
                    {lead.contactName}
                </div>
            )
        },
        {
            header: "LinkedIn",
            accessorKey: "profileUrl",
            width: "100px",
            cell: (lead: LinkedinLead) => (
                <a 
                    href={lead.profileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="h-8 w-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    onClick={(e) => e.stopPropagation()}
                >
                    <LinkIcon className="h-3.5 w-3.5" />
                </a>
            )
        },
        {
            header: "Work Email ID",
            accessorKey: "workEmail",
            sortable: true,
            width: "280px",
            cell: (lead: LinkedinLead) => (
                <div className="flex items-center gap-2 group/email">
                    <span className="text-sm font-bold text-muted-foreground">{lead.workEmail}</span>
                    <a 
                        href={`mailto:${lead.workEmail}`}
                        className="h-7 w-7 rounded-lg bg-primary/5 flex items-center justify-center text-primary opacity-0 group-hover/email:opacity-100 transition-all hover:bg-primary/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Mail className="h-3 w-3" />
                    </a>
                </div>
            )
        },
        {
            header: "Connect Status",
            accessorKey: "status",
            sortable: true,
            width: "150px",
            cell: (lead: LinkedinLead) => (
                <Badge variant="outline" className={cn(
                    "rounded-full px-4 py-1 text-[9px] font-black uppercase tracking-widest transition-all",
                    lead.status === 'Accepted' || lead.status === 'Replied' || lead.status === 'Converted'
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-muted text-muted-foreground border-transparent"
                )}>
                    {lead.status}
                </Badge>
            )
        },
        {
            header: "Sent Time (IST)",
            accessorKey: "sentTimeIST",
            sortable: true,
            width: "140px",
            cell: (lead: LinkedinLead) => (
                <span className="text-[10px] font-black text-muted-foreground/60">
                    {lead.sentTimeIST || "-"}
                </span>
            )
        },
        {
            header: "Drafted Content",
            accessorKey: "draftedContent",
            width: "250px",
            cell: (lead: LinkedinLead) => (
                <div 
                    className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors group/link"
                    onClick={(e) => {
                        e.stopPropagation()
                        onTabSwitch('sequences')
                    }}
                >
                    <FileText className="h-4 w-4 text-muted-foreground group-hover/link:text-primary transition-colors" />
                    <span className="text-sm font-bold">
                        {lead.draftedContent || "Draft Sequence"}
                    </span>
                </div>
            )
        },
        {
            header: "Lead Source",
            accessorKey: "leadSource",
            sortable: true,
            width: "120px",
            cell: (lead: LinkedinLead) => (
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                    {lead.leadSource}
                </span>
            )
        },
        {
            header: "Recent Update",
            accessorKey: "updatedAt",
            sortable: true,
            width: "140px",
            cell: (lead: LinkedinLead) => (
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">
                        {new Date(lead.updatedAt).toLocaleDateString()}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
                        {new Date(lead.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            )
        },
        {
            header: "In Mail",
            accessorKey: "inMail",
            width: "100px",
            cell: (lead: LinkedinLead) => (
                <div 
                    className="flex justify-center items-center h-full group"
                    onClick={(e) => {
                        e.stopPropagation()
                        onTabSwitch('sequences')
                    }}
                >
                    <div className={cn(
                        "h-8 w-8 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm border border-transparent",
                        lead.inMail ? "bg-purple-500/10 text-purple-600 border-purple-500/20" : "bg-muted/30 text-muted-foreground hover:bg-primary/5 hover:text-primary"
                    )}>
                        <MessageSquare className="h-3.5 w-3.5" />
                    </div>
                </div>
            )
        },
        {
            header: "Follow Up",
            accessorKey: "followUp",
            width: "100px",
            cell: (lead: LinkedinLead) => (
                <div 
                    className="flex justify-center items-center h-full group"
                    onClick={(e) => {
                        e.stopPropagation()
                        onTabSwitch('sequences')
                    }}
                >
                    <div className={cn(
                        "h-8 w-8 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm border border-transparent",
                        lead.followUp ? "bg-orange-500/10 text-orange-600 border-orange-500/20" : "bg-muted/30 text-muted-foreground hover:bg-primary/5 hover:text-primary"
                    )}>
                        <Clock className="h-3.5 w-3.5" />
                    </div>
                </div>
            )
        }
    ]

    return (
        <DataTable
            data={leads}
            columns={columns}
            searchPlaceholder="Search LinkedIn leads..."
            searchKeys={["companyName", "contactName", "workEmail"]}
            entityType="LinkedIn Lead"
            onView={(lead) => onViewDetail(lead)}
            onDelete={(lead) => onDelete(lead.id)}
            onRowClick={(lead) => onViewDetail(lead)}
            toolbarActions={
                <>
                    <ImportExportDialog mode="import" />
                    <ImportExportDialog mode="export" />
                </>
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
