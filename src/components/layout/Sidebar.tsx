"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Briefcase,
    Users,
    Settings as SettingsIcon,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Layers,
    Mail,
    Table2,
    Linkedin
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState, useMemo } from "react"
import { useCRMData } from "@/hooks/use-crm-data"
import { useAuth } from "@/hooks/use-auth"

const navItems = [
    { id: 'dashboard', name: "Dashboard", href: "/", icon: LayoutDashboard },
    { id: 'linkedin-outreach', name: "LinkedIn Outreach", href: "/linkedin-outreach", icon: Linkedin },
    { id: 'projects',  name: "Projects",  href: "/projects", icon: Briefcase },
    { id: 'emails',    name: "Emails",    href: "/emails", icon: Mail },
    { id: 'leads',     name: "Leads",     href: "/leads", icon: Users },
    { id: 'team',      name: "Team",      href: "/team", icon: Users },
    { id: 'custom-tables', name: "My Tables", href: "/custom-tables", icon: Table2 },
    { id: 'settings',  name: "Settings",  href: "/settings", icon: SettingsIcon },
]

export function Sidebar() {
    const pathname = usePathname()
    const { currentUser } = useCRMData()
    const { signOut } = useAuth()
    const [isCollapsed, setIsCollapsed] = useState(false)

    const visibleNavItems = useMemo(() => {
        if (!currentUser) return navItems
        if (currentUser.userRole === "Admin") return navItems
        
        const perms = currentUser.menuPermissions || []
        return navItems.filter(item => perms.includes(item.id))
    }, [currentUser])

    return (
        <div className={cn(
            "flex flex-col h-screen border-r border-border bg-white transition-all duration-300 ease-in-out",
            isCollapsed ? "w-20" : "w-72"
        )}>
            <div className="flex items-center justify-between px-6 h-20 border-b border-border bg-white">
                {!isCollapsed && (
                    <div className="flex items-center gap-3 font-bold text-2xl text-primary tracking-tight">
                        <div className="bg-slate-50 p-2 rounded-xl border border-border">
                            <Layers className="w-6 h-6 text-primary" />
                        </div>
                        <span>CRM Dash</span>
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={cn("hover:bg-slate-100", isCollapsed && "mx-auto")}
                >
                    {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </Button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto bg-slate-50">
                {visibleNavItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link key={item.name} href={item.href}>
                            <div className={cn(
                                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group border border-transparent",
                                isActive
                                    ? "bg-white border-border shadow-sm text-primary"
                                    : "text-muted-foreground hover:bg-white hover:border-border hover:text-primary",
                                isCollapsed && "justify-center px-0"
                            )}>
                                <item.icon className={cn(
                                    "w-5 h-5 shrink-0 transition-transform group-hover:scale-110",
                                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                                )} />
                                {!isCollapsed && <span className="font-bold tracking-tight">{item.name}</span>}
                            </div>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-border bg-white">
                <Button
                    variant="ghost"
                    onClick={signOut}
                    className={cn(
                        "w-full flex items-center gap-4 justify-start px-4 py-6 rounded-xl text-muted-foreground hover:bg-slate-50 hover:text-destructive transition-colors",
                        isCollapsed && "justify-center px-0"
                    )}
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span className="font-bold tracking-tight">Logout</span>}
                </Button>
            </div>
        </div>
    )
}
