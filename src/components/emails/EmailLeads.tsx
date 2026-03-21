"use client"

import { Badge } from "@/components/ui/badge"
import { Users, Mail, Target, ArrowRight } from "lucide-react"
import { useCRMData } from "@/hooks/use-crm-data"
import { cn } from "@/lib/utils"
import { DataTable } from "@/components/shared/DataTable"

export function EmailLeads({ projectId }: { projectId?: string }) {
    const { leads, campaigns, isLoaded } = useCRMData()

    if (!isLoaded) return null

    // Filter leads that have emails and belong to the project
    const emailLeads = leads.filter(l => l.email && (projectId ? l.projectId === projectId : true))

    const columns = [
        {
            header: "Lead",
            accessorKey: "firstName",
            sortable: true,
            cell: (l: any) => (
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <Users className="h-4.5 w-4.5" />
                    </div>
                    <div>
                        <div className="font-bold text-foreground">{l.firstName} {l.lastName}</div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{l.email}</div>
                    </div>
                </div>
            )
        },
        {
            header: "Company",
            accessorKey: "company",
            sortable: true,
            cell: (l: any) => <span className="font-bold">{l.company}</span>
        },
        {
            header: "Active Campaign",
            accessorKey: "projectId", // We can map this to campaign name
            cell: (l: any) => {
                // In a real system, we'd have a lead_campaigns join table
                // For this mock, we'll just show the first campaign for the project
                const campaign = campaigns.find(c => c.projectId === l.projectId)
                return (
                    <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-bold">{campaign?.name || "No Active Campaign"}</span>
                    </div>
                )
            }
        },
        {
            header: "Interest Level",
            accessorKey: "priority",
            sortable: true,
            cell: (l: any) => (
                <Badge className={cn(
                    "rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest border-none",
                    l.priority === "High" ? "bg-green-500 text-white" : 
                    l.priority === "Medium" ? "bg-blue-500 text-white" :
                    "bg-muted text-muted-foreground text-[8px]"
                )}>
                    {l.priority === "High" ? "Interested" : l.priority === "Medium" ? "Engaged" : "Cold"}
                </Badge>
            )
        },
        {
            header: "Status",
            accessorKey: "status",
            sortable: true,
            cell: (l: any) => (
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {l.status}
                </span>
            )
        },
        {
            header: "Action",
            accessorKey: "id", // Added to fix lint
            cell: (l: any) => (
                <div className="flex justify-end">
                    <button className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary hover:gap-2 transition-all">
                        View Thread <ArrowRight className="h-3 w-3" />
                    </button>
                </div>
            )
        }
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold tracking-tight">Outreach Leads</h3>
                    <p className="text-sm text-muted-foreground font-medium">Tracking engagement and sentiment for every contact.</p>
                </div>
                <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-2xl border">
                    <div className="px-3 py-1.5 rounded-xl bg-white shadow-sm flex items-center gap-2">
                        <Target className="h-3.5 w-3.5 text-green-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">24 Interested</span>
                    </div>
                </div>
            </div>

            <DataTable
                data={emailLeads}
                columns={columns}
                searchKeys={["firstName", "lastName", "company", "email"]}
                searchPlaceholder="Search leads..."
                entityType="Lead"
                onDelete={() => {}} // Handle deletion if needed
            />
        </div>
    )
}
