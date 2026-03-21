import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

import { useCRMData, Project } from "@/hooks/use-crm-data"

interface ManageTeamModalProps {
    project: Project | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ManageTeamModal({ project, open, onOpenChange }: ManageTeamModalProps) {
    const { teamMembers, updateProject } = useCRMData()
    const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([])

    useEffect(() => {
        if (project && open) {
            setSelectedMemberIds(project.teamMemberIds || [])
        }
    }, [project, open])

    if (!project) return null

    const toggleMember = (memberId: string) => {
        setSelectedMemberIds(prev =>
            prev.includes(memberId)
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId]
        )
    }

    const handleSave = () => {
        updateProject(project.id, { teamMemberIds: selectedMemberIds })
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] border-none shadow-2xl rounded-[2.5rem] p-0 overflow-hidden bg-white/95 backdrop-blur-xl">
                <DialogHeader className="p-8 pb-0">
                    <DialogTitle className="text-3xl font-bold tracking-tighter">Manage Team</DialogTitle>
                    <DialogDescription className="text-base font-medium text-muted-foreground">
                        Assign team members to "{project.name}".
                    </DialogDescription>
                </DialogHeader>

                <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto">
                    {teamMembers.map((member) => {
                        const isAssigned = selectedMemberIds.includes(member.id)
                        return (
                            <div
                                key={member.id}
                                className={cn(
                                    "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group",
                                    isAssigned
                                        ? "bg-primary/5 border-primary/20 shadow-sm"
                                        : "bg-muted/30 border-transparent hover:bg-muted/50"
                                )}
                                onClick={() => toggleMember(member.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                        <AvatarImage src={member.avatar} />
                                        <AvatarFallback className="bg-primary/10 text-primary font-bold">{member.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-bold text-sm text-foreground">{member.name}</div>
                                        <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{member.role}</div>
                                    </div>
                                </div>
                                <div className={cn(
                                    "h-8 w-8 rounded-xl flex items-center justify-center transition-all",
                                    isAssigned
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                        : "bg-background text-muted-foreground/30 group-hover:text-muted-foreground"
                                )}>
                                    {isAssigned ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="p-8 pt-0">
                    <Button
                        onClick={handleSave}
                        className="w-full rounded-2xl h-14 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.01]"
                    >
                        Done
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
