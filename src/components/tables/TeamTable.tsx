"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useCRMData, TeamMember } from "@/hooks/use-crm-data"
import { cn } from "@/lib/utils"
import { DataTable } from "@/components/shared/DataTable"
import { EditMemberModal } from "@/components/team/EditMemberModal"
import { MemberDetailsSheet } from "@/components/team/MemberDetailsSheet"

export function TeamTable({ memberIds }: { memberIds?: string[] }) {
    const { teamMembers, deleteTeamMember, deleteManyTeamMembers, isLoaded } = useCRMData()
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
    const [viewingMember, setViewingMember] = useState<TeamMember | null>(null)

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
        <>
            <DataTable
                data={filteredMembers}
                columns={columns}
                searchPlaceholder="Search by name or email..."
                searchKeys={["name", "email"]}
                entityType="Member"
                onView={(member) => setViewingMember(member)}
                onEdit={(member) => setEditingMember(member)}
                onDelete={(member) => deleteTeamMember(member.id)}
                onBulkDelete={deleteManyTeamMembers}
                filters={[
                    {
                        key: "role",
                        label: "Role",
                        options: [
                            { label: "Admin", value: "Admin" },
                            { label: "Manager", value: "Manager" },
                            { label: "Lead Gen", value: "Lead Gen" },
                            { label: "Designer", value: "Designer" },
                            { label: "Linkedin + Content Writer", value: "Linkedin + Content Writer" },
                            { label: "Linkedin", value: "Linkedin" },
                            { label: "CRM", value: "CRM" }
                        ]
                    },
                    {
                        key: "status",
                        label: "Status",
                        options: [
                            { label: "Active", value: "Active" },
                            { label: "Inactive", value: "Inactive" }
                        ]
                    }
                ]}
            />
            <EditMemberModal
                member={editingMember}
                onClose={() => setEditingMember(null)}
            />
            <MemberDetailsSheet
                member={viewingMember}
                onClose={() => setViewingMember(null)}
                onEdit={(member) => setEditingMember(member)}
            />
        </>
    )
}
