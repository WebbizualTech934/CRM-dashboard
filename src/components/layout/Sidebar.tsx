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
    Table2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState, useMemo } from "react"
import { useCRMData } from "@/hooks/use-crm-data"

const navItems = [
    { id: 'dashboard', name: "Dashboard", href: "/", icon: LayoutDashboard },
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
    const [isCollapsed, setIsCollapsed] = useState(false)

    const visibleNavItems = useMemo(() => {
        if (!currentUser) return navItems
        if (currentUser.userRole === "Admin") return navItems
        
        const perms = currentUser.menuPermissions || []
        return navItems.filter(item => perms.includes(item.id))
    }, [currentUser])

    return (
        <div className={cn(
            "flex flex-col h-screen border-r bg-card/50 backdrop-blur-xl transition-all duration-300 ease-in-out shadow-sm",
            isCollapsed ? "w-20" : "w-72"
        )}>
            <div className="flex items-center justify-between px-6 h-20 border-b border-border/50">
                {!isCollapsed && (
                    <div className="flex items-center gap-3 font-bold text-2xl text-primary tracking-tight">
                        <div className="bg-primary/10 p-2 rounded-xl">
                            <Layers className="w-6 h-6 text-primary" />
                        </div>
                        <span>CRM Dash</span>
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={cn("hover:bg-primary/5", isCollapsed && "mx-auto")}
                >
                    {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </Button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {visibleNavItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link key={item.name} href={item.href}>
                            <div className={cn(
                                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary",
                                isCollapsed && "justify-center px-0"
                            )}>
                                <item.icon className={cn(
                                    "w-5 h-5 shrink-0 transition-transform group-hover:scale-110",
                                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                                )} />
                                {!isCollapsed && <span className="font-bold tracking-tight">{item.name}</span>}
                            </div>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-border/50">
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full flex items-center gap-4 justify-start px-4 py-6 rounded-xl text-muted-foreground hover:bg-destructive/5 hover:text-destructive transition-colors",
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
