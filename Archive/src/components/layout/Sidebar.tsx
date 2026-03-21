"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Briefcase,
    Users,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Layers,
    Mail
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Projects", href: "/projects", icon: Briefcase },
    { name: "Emails", href: "/emails", icon: Mail },
    { name: "Leads", href: "/leads", icon: Users },
    { name: "Team", href: "/team", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)

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
                {navItems.map((item) => {
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
