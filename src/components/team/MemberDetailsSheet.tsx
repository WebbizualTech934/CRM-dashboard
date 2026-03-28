"use client"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
    Mail, 
    Shield, 
    LayoutDashboard, 
    Briefcase, 
    Users, 
    Table2, 
    Settings as SettingsIcon,
    Calendar,
    MousePointer2,
    Send,
    UserCircle
} from "lucide-react"
import { TeamMember } from "@/providers/crm-provider"
import { cn } from "@/lib/utils"

interface MemberDetailsSheetProps {
    member: TeamMember | null
    onClose: () => void
    onEdit?: (member: TeamMember) => void
}

export function MemberDetailsSheet({ member, onClose, onEdit }: MemberDetailsSheetProps) {

    if (!member) return null

    const menus = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'projects', label: 'Projects', icon: Briefcase },
        { id: 'emails', label: 'Emails', icon: Mail },
        { id: 'leads', label: 'Leads', icon: Users },
        { id: 'team', label: 'Team', icon: Users },
        { id: 'custom-tables', label: 'My Tables', icon: Table2 },
        { id: 'settings', label: 'Settings', icon: SettingsIcon },
    ]

    const allowedMenus = menus.filter(m => member.menuPermissions?.includes(m.id))

    return (
        <Sheet open={!!member} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col bg-slate-50 border-l border-slate-200 shadow-2xl">
                <div className="bg-white p-8 border-b border-slate-200 shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16" />
                    <SheetHeader className="relative z-10">
                        <div className="flex items-center gap-6">
                            <Avatar className="h-20 w-20 border-4 border-white shadow-2xl">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback className="bg-primary/10 text-primary font-black text-2xl">
                                    {member.name[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col gap-1">
                                <SheetTitle className="text-3xl font-black text-slate-900 tracking-tighter">
                                    {member.name}
                                </SheetTitle>
                                <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                                    <Mail className="h-4 w-4 text-primary" />
                                    {member.email}
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                    <Badge variant="outline" className="rounded-2xl px-4 py-1 text-[10px] font-black uppercase tracking-widest border-primary/20 bg-primary/5 text-primary">
                                        {member.role}
                                    </Badge>
                                    <div className="flex items-center gap-2 ml-3">
                                        <div className={cn("h-2 w-2 rounded-full", member.status === "Active" ? "bg-green-500 shadow-sm shadow-green-200" : "bg-slate-300")} />
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">{member.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SheetHeader>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                    {/* Performance Stats */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-border/50 flex flex-col gap-1 transition-all hover:shadow-md">
                            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                <MousePointer2 className="h-4 w-4 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Leads Added</span>
                            </div>
                            <div className="text-4xl font-black text-slate-900 tracking-tighter">{member.leadsAdded.toLocaleString()}</div>
                        </div>
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-border/50 flex flex-col gap-1 transition-all hover:shadow-md">
                            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                <Send className="h-4 w-4 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Emails Sent</span>
                            </div>
                            <div className="text-4xl font-black text-slate-900 tracking-tighter">{member.emailsSent.toLocaleString()}</div>
                        </div>
                    </div>

                    {/* Account Details */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4 px-2">
                            <UserCircle className="h-4 w-4 text-primary" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account Details</h4>
                        </div>
                        <div className="bg-white rounded-[2.5rem] border border-border/50 divide-y divide-slate-50 overflow-hidden shadow-sm">
                            <div className="px-8 py-5 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Level</span>
                                <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{member.userRole}</span>
                            </div>
                            <div className="px-8 py-5 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Active</span>
                                <span className="text-xs font-black text-slate-700 flex items-center gap-2 uppercase tracking-tight">
                                    <Calendar className="h-3.5 w-3.5 text-primary" />
                                    {member.lastActive || "Recently"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Menu Access */}
                    <div className="space-y-4 pb-10">
                        <div className="flex items-center gap-2 mb-4 px-2">
                            <Shield className="h-4 w-4 text-primary" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Menu Access Permissions</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {allowedMenus.map((menu) => (
                                <div 
                                    key={menu.id} 
                                    className="flex items-center space-x-3 p-5 rounded-2xl bg-white border border-border/50 shadow-sm group hover:border-primary/20 transition-all hover:shadow-md"
                                >
                                    <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                                        <menu.icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">
                                        {menu.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-border/50 bg-white/80 backdrop-blur-md shrink-0">
                    <div className="flex flex-row gap-4">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-xs border border-border/50 hover:bg-slate-50 transition-all"
                        >
                            Close
                        </Button>
                        <Button
                            onClick={() => {
                                onClose()
                                onEdit?.(member)
                            }}
                            className="flex-[2] h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all border-none gap-3"
                        >
                            <UserCircle className="h-5 w-5" /> Quick Edit
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
