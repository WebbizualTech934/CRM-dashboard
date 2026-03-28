"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Shield, Mail, Lock, User, LayoutDashboard, Briefcase, Users, Table2, Settings as SettingsIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

import { useCRMData } from "@/hooks/use-crm-data"

export function AddMemberModal() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { addTeamMember } = useCRMData()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "Designer",
        accessLevel: "Team Member",
        password: "",
        menuPermissions: ['dashboard', 'projects', 'emails', 'leads', 'team', 'custom-tables', 'settings']
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Add the member
        await addTeamMember({
            name: formData.name,
            email: formData.email,
            role: formData.role,
            userRole: (formData.accessLevel === "Admin" ? "Admin" : formData.accessLevel === "Manager" ? "Manager" : formData.role) as any,
            status: "Active",
            menuPermissions: formData.menuPermissions
        })

        setIsLoading(false)
        setOpen(false)
        setFormData({ 
            name: "", 
            email: "", 
            role: "Designer", 
            accessLevel: "Team Member",
            password: "",
            menuPermissions: ['dashboard', 'projects', 'emails', 'leads', 'team', 'custom-tables', 'settings']
        })
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={(props) => (
                <Button {...props} className="flex items-center gap-2 rounded-2xl font-bold px-6 h-12 shadow-lg shadow-primary/20 bg-primary hover:scale-[1.02] transition-all">
                    <Plus className="h-5 w-5" /> Add Member
                </Button>
            )} />
            <SheetContent side="right">
                <form id="add-member-form" onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
                    <SheetHeader>
                        <SheetTitle className="text-3xl font-black tracking-tighter text-primary flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Users className="h-6 w-6" />
                            </div>
                            Add Team Member
                        </SheetTitle>
                        <SheetDescription className="text-muted-foreground font-medium mt-1">
                            Create a new account for your team member and set their core access roles.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Full Name</Label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    id="name"
                                    placeholder="e.g. John Doe"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="pl-12 h-14 rounded-2xl bg-muted/20 border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Email Address</Label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="e.g. john@company.com"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="pl-12 h-14 rounded-2xl bg-muted/20 border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all"
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="role" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Role</Label>
                            <Select
                                value={formData.role}
                                onValueChange={(v: string | null) => v && setFormData({ ...formData, role: v })}
                            >
                                <SelectTrigger className="h-14 rounded-2xl bg-muted/20 border-border/50 focus:ring-2 focus:ring-primary/20 font-bold transition-all">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-xl">
                                    <SelectItem value="Designer" className="rounded-xl font-bold">Designer</SelectItem>
                                    <SelectItem value="Lead Gen" className="rounded-xl font-bold">Lead Gen</SelectItem>
                                    <SelectItem value="Linkedin" className="rounded-xl font-bold">Linkedin</SelectItem>
                                    <SelectItem value="Linkedin + Content Writer" className="rounded-xl font-bold">Linkedin + Content Writer</SelectItem>
                                    <SelectItem value="CRM" className="rounded-xl font-bold">CRM</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="access" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Access Level</Label>
                                <Select
                                    value={formData.accessLevel}
                                    onValueChange={(v: string | null) => v && setFormData({ ...formData, accessLevel: v })}
                                >
                                    <SelectTrigger className="h-14 rounded-2xl bg-muted/20 border-border/50 focus:ring-2 focus:ring-primary/20 font-bold transition-all">
                                        <SelectValue placeholder="Select access" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-xl">
                                        <SelectItem value="Admin" className="rounded-xl font-bold">Admin</SelectItem>
                                        <SelectItem value="Manager" className="rounded-xl font-bold">Manager</SelectItem>
                                        <SelectItem value="Team Member" className="rounded-xl font-bold">Team Member</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Initial Password</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="pl-12 h-14 rounded-2xl bg-muted/20 border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Menu Access Permissions</Label>
                            <div className="grid grid-cols-2 gap-3">
                                {menus.map((menu) => (
                                    <div 
                                        key={menu.id} 
                                        className={cn(
                                            "flex items-center space-x-3 p-3 rounded-2xl border transition-all cursor-pointer group",
                                            formData.menuPermissions.includes(menu.id) 
                                                ? "bg-primary/5 border-primary/20" 
                                                : "bg-muted/10 border-transparent hover:bg-muted/20"
                                        )}
                                        onClick={() => togglePermission(menu.id)}
                                    >
                                        <Checkbox 
                                            id={`menu-${menu.id}`} 
                                            checked={formData.menuPermissions.includes(menu.id)}
                                            onCheckedChange={() => togglePermission(menu.id)}
                                            className="rounded-md h-5 w-5 border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                        />
                                        <div className="flex items-center gap-2">
                                            <menu.icon className={cn("h-4 w-4", formData.menuPermissions.includes(menu.id) ? "text-primary" : "text-muted-foreground")} />
                                            <span className={cn("text-xs font-bold", formData.menuPermissions.includes(menu.id) ? "text-primary" : "text-slate-600")}>
                                                {menu.label}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                <SheetFooter className="flex-row gap-4 sm:justify-between items-center">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setOpen(false)}
                        className="rounded-2xl h-14 px-8 font-bold hover:bg-muted/50"
                    >
                        Cancel
                    </Button>
                    <Button
                        form="add-member-form"
                        type="submit"
                        className="rounded-2xl h-14 px-12 font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] bg-primary text-white border-none"
                        disabled={isLoading}
                    >
                        {isLoading ? "Adding..." : "Add Member"}
                    </Button>
                </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
