import { useState, useEffect } from "react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, Plus, Users } from "lucide-react"
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
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col bg-white border-l border-border/50 shadow-2xl">
                <div className="bg-primary/[0.03] p-8 border-b border-border/50 shrink-0">
                    <SheetHeader>
                        <SheetTitle className="text-3xl font-black tracking-tighter text-primary flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Users className="h-6 w-6" />
                            </div>
                            Manage Team
                        </SheetTitle>
                        <SheetDescription className="text-muted-foreground font-medium mt-1">
                            Assign team members to "{project.name}".
                        </SheetDescription>
                    </SheetHeader>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
                    {teamMembers.map((member) => {
                        const isAssigned = selectedMemberIds.includes(member.id)
                        return (
                            <div
                                key={member.id}
                                className={cn(
                                    "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group",
                                    isAssigned
                                        ? "bg-primary/5 border-primary/20 shadow-sm"
                                        : "bg-muted/20 border-transparent hover:bg-muted/30"
                                )}
                                onClick={() => toggleMember(member.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm ring-2 ring-primary/5">
                                        <AvatarImage src={member.avatar} />
                                        <AvatarFallback className="bg-primary/10 text-primary font-black">{member.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-black text-slate-900">{member.name}</div>
                                        <div className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">{member.role}</div>
                                    </div>
                                </div>
                                <div className={cn(
                                    "h-10 w-10 rounded-2xl flex items-center justify-center transition-all",
                                    isAssigned
                                        ? "bg-[#ff7a59] text-white shadow-lg shadow-primary/20 scale-110"
                                        : "bg-muted/30 text-muted-foreground/30 group-hover:text-muted-foreground"
                                )}>
                                    {isAssigned ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="shrink-0 p-8 pt-4 border-t border-border/50 bg-white/80 backdrop-blur-md">
                    <SheetFooter>
                        <Button
                            onClick={handleSave}
                            className="w-full rounded-2xl h-14 font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] bg-[#ff7a59] text-white border-none"
                        >
                            Save Changes
                        </Button>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    )
}
