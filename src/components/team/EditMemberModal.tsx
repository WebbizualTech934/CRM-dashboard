"use client"

import { useState, useEffect } from "react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, UserCog, LayoutDashboard, Briefcase, Mail, Users, Table2, Settings as SettingsIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { useCRMData, TeamMember, DEFAULT_PERMISSIONS } from "@/hooks/use-crm-data"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

interface EditMemberModalProps {
    member: TeamMember | null
    onClose: () => void
}

export function EditMemberModal({ member, onClose }: EditMemberModalProps) {
    const { updateTeamMember, currentUser } = useCRMData()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState<{
        name: string;
        email: string;
        role: string;
        userRole: "Admin" | "Manager" | "Lead Gen" | "Designer" | "Content Writer" | "CRM";
        status: string;
        menuPermissions: string[];
    }>({
        name: "",
        email: "",
        role: "",
        userRole: "Lead Gen",
        status: "Active",
        menuPermissions: []
    })

    const menus = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'projects', label: 'Projects', icon: Briefcase },
        { id: 'emails', label: 'Emails', icon: Mail },
        { id: 'leads', label: 'Leads', icon: Users },
        { id: 'team', label: 'Team', icon: Users },
        { id: 'custom-tables', label: 'My Tables', icon: Table2 },
        { id: 'settings', label: 'Settings', icon: SettingsIcon },
    ]

    const togglePermission = (menuId: string) => {
        setFormData(prev => ({
            ...prev,
            menuPermissions: prev.menuPermissions.includes(menuId)
                ? prev.menuPermissions.filter(id => id !== menuId)
                : [...prev.menuPermissions, menuId]
        }))
    }

    useEffect(() => {
        if (member) {
            setFormData({
                name: member.name || "",
                email: member.email || "",
                role: member.role || "",
                userRole: (member.userRole as any) || "Lead Gen",
                status: member.status || "Active",
                menuPermissions: member.menuPermissions || ['dashboard', 'projects', 'emails', 'leads', 'team', 'custom-tables', 'settings']
            })
        }
    }, [member])

    if (!member) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            await updateTeamMember(member.id, formData)
            onClose()
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const permissions = DEFAULT_PERMISSIONS[formData.userRole]

    const isAdmin = currentUser?.userRole === "Admin"

    return (
        <Sheet open={!!member} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="right">
                <form id="edit-member-form" onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
                    <SheetHeader>
                        <SheetTitle className="text-3xl font-black tracking-tighter text-primary flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <UserCog className="h-6 w-6" />
                            </div>
                            Manage Team Member
                        </SheetTitle>
                        <SheetDescription className="text-muted-foreground font-medium mt-1">
                            Update profile details and configure role-based system access.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="h-12 rounded-2xl bg-muted/20 border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all"
                                        disabled={!isAdmin}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</Label>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="h-12 rounded-2xl bg-muted/20 border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all"
                                        disabled={!isAdmin}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Job Title</Label>
                                    <Input
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="h-12 rounded-2xl bg-muted/20 border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all"
                                        disabled={!isAdmin}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Account Status</Label>
                                    <Select 
                                        value={formData.status} 
                                        onValueChange={(val: string | null) => val && setFormData({ ...formData, status: val })}
                                        disabled={!isAdmin || member.id === (currentUser?.id || "")}
                                    >
                                        <SelectTrigger className="h-12 rounded-2xl bg-muted/20 border-border/50 focus:ring-2 focus:ring-primary/20 font-bold transition-all">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-none shadow-xl">
                                            <SelectItem value="Active" className="rounded-xl font-bold">Active</SelectItem>
                                            <SelectItem value="Inactive" className="rounded-xl font-bold">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-border/50">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="h-4 w-4 text-primary" />
                                <h4 className="text-sm font-bold text-slate-800">System Capability Role</h4>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Permission Profile</Label>
                                    <Select 
                                        value={formData.userRole} 
                                        onValueChange={(val: any) => val && setFormData({ ...formData, userRole: val })}
                                        disabled={!isAdmin || member.id === (currentUser?.id || "")}
                                    >
                                        <SelectTrigger className="h-14 rounded-2xl bg-muted/20 border-border/50 focus:ring-2 focus:ring-primary/20 font-black transition-all">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-none shadow-xl">
                                            <SelectItem value="Admin" className="rounded-xl font-bold">Administrator (Full Access)</SelectItem>
                                            <SelectItem value="Manager" className="rounded-xl font-bold">Manager (Edit without Deletion)</SelectItem>
                                            <SelectItem value="CRM" className="rounded-xl font-bold">CRM (Full Leads & Reports)</SelectItem>
                                            <SelectItem value="Lead Gen" className="rounded-xl font-bold">Lead Gen (Leads & Campaigns)</SelectItem>
                                            <SelectItem value="Designer" className="rounded-xl font-bold">Designer (Project Assets)</SelectItem>
                                            <SelectItem value="Content Writer" className="rounded-xl font-bold">Content Writer (Read & Copy)</SelectItem>
                                            <SelectItem value="Linkedin" className="rounded-xl font-bold">Linkedin (General Leads)</SelectItem>
                                            <SelectItem value="Linkedin + Content Writer" className="rounded-xl font-bold">Linkedin + Content Writer (Leads & Content)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 shadow-sm">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">{formData.userRole} Permitted Actions</p>
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                        {[
                                            { label: "View Leads", checked: permissions.canViewLeads },
                                            { label: "Edit Leads", checked: permissions.canEditLeads },
                                            { label: "Delete Leads", checked: permissions.canDeleteLeads },
                                            { label: "Manage Projects", checked: permissions.canEditProjects },
                                            { label: "Delete Projects", checked: permissions.canDeleteProjects },
                                            { label: "Send Emails", checked: permissions.canSendEmails },
                                            { label: "Manage Team", checked: permissions.canManageTeam },
                                            { label: "Export Data", checked: permissions.canExportData },
                                        ].map((perm, idx) => (
                                            <div key={idx} className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-muted-foreground">{perm.label}</span>
                                                <Switch checked={perm.checked} disabled className="data-[state=checked]:bg-primary" />
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] font-semibold text-slate-400 mt-6 leading-tight italic">
                                        Note: Permission profiles are locked to exact roles currently.
                                    </p>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-slate-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <LayoutDashboard className="h-4 w-4 text-primary" />
                                        <h4 className="text-sm font-bold text-slate-800">Sidebar Menu Access</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {menus.map((menu) => (
                                            <div 
                                                key={menu.id} 
                                                className={cn(
                                                    "flex items-center space-x-3 p-4 rounded-2xl border transition-all cursor-pointer",
                                                    formData.menuPermissions.includes(menu.id) 
                                                        ? "bg-white border-primary/20 shadow-sm" 
                                                        : "bg-muted/30 border-transparent opacity-60"
                                                )}
                                                onClick={() => isAdmin && togglePermission(menu.id)}
                                            >
                                                <Checkbox 
                                                    id={`edit-menu-${menu.id}`} 
                                                    checked={formData.menuPermissions.includes(menu.id)}
                                                    onCheckedChange={() => isAdmin && togglePermission(menu.id)}
                                                    disabled={!isAdmin}
                                                    className="rounded-md h-5 w-5 border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <menu.icon className={cn("h-4 w-4", formData.menuPermissions.includes(menu.id) ? "text-primary" : "text-slate-400")} />
                                                    <span className={cn("text-xs font-bold", formData.menuPermissions.includes(menu.id) ? "text-slate-800" : "text-slate-500")}>
                                                        {menu.label}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                <SheetFooter className="flex-row gap-4 sm:justify-between items-center">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        className="rounded-2xl h-14 px-8 font-bold hover:bg-muted/50"
                    >
                        Cancel
                    </Button>
                    <Button
                        form="edit-member-form"
                        type="submit"
                        disabled={isSubmitting || !isAdmin}
                        className="rounded-2xl h-14 px-12 font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] bg-primary hover:bg-primary/90 text-white border-none"
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
