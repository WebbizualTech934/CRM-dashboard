"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useCRMData } from "@/hooks/use-crm-data"
import { cn } from "@/lib/utils"
import { DataTable } from "@/components/shared/DataTable"

export function TeamTable({ memberIds }: { memberIds?: string[] }) {
    const { teamMembers, deleteTeamMember, deleteManyTeamMembers, isLoaded } = useCRMData()

    if (!isLoaded) return null

    const filteredMembers = memberIds
        ? teamMembers.filter(m => memberIds.includes(m.id))
        : teamMembers

    const columns = [
        {
            header: "Team Member",
            accessorKey: "name",
            sortable: true,
            cell: (member: any) => (
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <div className="font-bold text-sm text-foreground leading-tight">{member.name}</div>
                        <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{member.email}</div>
                    </div>
                </div>
            )
        },
        {
            header: "Role",
            accessorKey: "role",
            sortable: true,
            cell: (member: any) => (
                <Badge variant="outline" className="rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest border-primary/20 bg-primary/5 text-primary">
                    {member.role}
                </Badge>
            )
        },
        {
            header: "Status",
            accessorKey: "status",
            sortable: true,
            cell: (member: any) => (
                <div className="flex items-center gap-2">
                    <div className={cn("h-1.5 w-1.5 rounded-full", member.status === "Active" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-muted")} />
                    <span className="text-[11px] font-bold text-muted-foreground">{member.status}</span>
                </div>
            )
        },
        {
            header: "Leads Added",
            accessorKey: "leadsAdded",
            sortable: true,
            className: "text-center",
            cell: (member: any) => <span className="font-bold text-sm">{member.leadsAdded.toLocaleString()}</span>
        },
        {
            header: "Emails Sent",
            accessorKey: "emailsSent",
            sortable: true,
            className: "text-center",
            cell: (member: any) => <span className="font-bold text-sm">{member.emailsSent.toLocaleString()}</span>
        }
    ]

    return (
        <DataTable
            data={filteredMembers}
            columns={columns}
            searchKey="name"
            searchPlaceholder="Search team members..."
            entityType="Member"
            onDelete={(member) => deleteTeamMember(member.id)}
            onBulkDelete={deleteManyTeamMembers}
        />
    )
}
