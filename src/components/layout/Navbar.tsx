"use client"

import Link from "next/link"
import { Search, Bell, User, HelpCircle, Briefcase, LogOut, Settings as SettingsIcon, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useCRMData } from "@/hooks/use-crm-data"
import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"

export function Navbar() {
    const { projects, leads, resetData } = useCRMData()
    const { user, signOut } = useAuth()
    const [searchQuery, setSearchQuery] = useState("")

    const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"
    const displayEmail = user?.email || ""
    const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "U"
    const avatarUrl = user?.user_metadata?.avatar_url || ""

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3)

    const filteredLeads = leads.filter(l =>
        (l.firstName + " " + l.lastName).toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.company.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3)

    return (
        <header className="h-20 border-b border-border bg-white flex items-center justify-between px-8 sticky top-0 z-10 transition-all">
            <div className="flex items-center flex-1 max-w-xl relative">
                <div className="relative w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        type="search"
                        placeholder="Search leads, projects, tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 pr-4 h-11 bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-2xl transition-all"
                    />
                </div>

                {/* Search Results Dropdown */}
                {searchQuery && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-2">
                            {filteredProjects.length > 0 && (
                                <>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-3 py-2">Projects</div>
                                    <div className="space-y-1">
                                        {filteredProjects.map(project => (
                                            <button key={project.id} className="w-full text-left px-3 py-2 rounded-xl hover:bg-primary/5 transition-colors flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    <Briefcase className="h-4 w-4 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold">{project.name}</div>
                                                    <div className="text-[10px] text-muted-foreground font-medium">{project.status} • {project.leads} Leads</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}

                            {filteredLeads.length > 0 && (
                                <>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-3 py-2 mt-2">Leads</div>
                                    <div className="space-y-1">
                                        {filteredLeads.map(lead => (
                                            <button key={lead.id} className="w-full text-left px-3 py-2 rounded-xl hover:bg-primary/5 transition-colors flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                                                    <User className="h-4 w-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold">{lead.firstName} {lead.lastName}</div>
                                                    <div className="text-[10px] text-muted-foreground font-medium">{lead.company} • {lead.status}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}

                            {filteredProjects.length === 0 && filteredLeads.length === 0 && (
                                <div className="p-4 text-center text-sm text-muted-foreground font-medium">
                                    No results found for "{searchQuery}"
                                </div>
                            )}

                            <div className="mt-2 p-2 border-t border-border">
                                <button className="w-full text-center py-2 text-xs font-bold text-primary hover:underline">
                                    View all results
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    <DropdownMenu>
                        <DropdownMenuTrigger render={
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-primary/5 hover:text-primary rounded-xl transition-colors">
                                <HelpCircle className="h-5 w-5" />
                            </Button>
                        } />
                        <DropdownMenuContent className="w-80 p-4 rounded-2xl shadow-2xl border-border" align="end">
                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="flex items-center gap-2 px-2 pb-4 pt-1">
                                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        <HelpCircle className="h-4 w-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black tracking-tight">Help & Resources</span>
                                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Get instant support</span>
                                    </div>
                                </DropdownMenuLabel>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator className="opacity-50 mb-2" />
                            <div className="space-y-1">
                                <DropdownMenuItem className="rounded-xl p-3 flex flex-col items-start gap-1 cursor-pointer focus:bg-primary/5 transition-all">
                                    <div className="text-[11px] font-black uppercase tracking-widest text-primary">Documentation</div>
                                    <div className="text-xs text-muted-foreground font-medium">Learn how to manage your leads and projects effectively.</div>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-xl p-3 flex flex-col items-start gap-1 cursor-pointer focus:bg-primary/5 transition-all">
                                    <div className="text-[11px] font-black uppercase tracking-widest text-primary">Video Tutorials</div>
                                    <div className="text-xs text-muted-foreground font-medium">Quick 2-minute guides on every feature.</div>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-xl p-3 flex flex-col items-start gap-1 cursor-pointer focus:bg-primary/5 transition-all">
                                    <div className="text-[11px] font-black uppercase tracking-widest text-primary">Live Training</div>
                                    <div className="text-xs text-muted-foreground font-medium">Join our weekly webinars with experts.</div>
                                </DropdownMenuItem>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger render={
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-primary/5 hover:text-primary rounded-xl relative transition-colors">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-card shadow-sm shadow-primary/50"></span>
                            </Button>
                        } />
                        <DropdownMenuContent className="w-[350px] p-0 rounded-2xl shadow-2xl border-border overflow-hidden" align="end">
                            <div className="p-4 bg-primary/5 border-b border-primary/10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Bell className="h-4 w-4 text-primary" />
                                    <span className="font-black text-sm tracking-tight">Notifications</span>
                                </div>
                                <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">3 New</span>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                                <div className="p-2 space-y-1">
                                    <DropdownMenuItem className="rounded-xl p-3 flex gap-3 cursor-pointer focus:bg-primary/5 transition-all border-b border-border/5 last:border-none">
                                        <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                            <User className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <p className="text-xs font-bold leading-tight line-clamp-2">New lead <span className="text-primary">John Doe</span> has been assigned to you.</p>
                                            <p className="text-[10px] text-muted-foreground font-medium">2 minutes ago</p>
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="rounded-xl p-3 flex gap-3 cursor-pointer focus:bg-primary/5 transition-all border-b border-border/5 last:border-none">
                                        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                            <Briefcase className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <p className="text-xs font-bold leading-tight line-clamp-2">Project <span className="text-primary">Global Expansion</span> status updated to "Active".</p>
                                            <p className="text-[10px] text-muted-foreground font-medium">1 hour ago</p>
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="rounded-xl p-3 flex gap-3 cursor-pointer focus:bg-primary/5 transition-all">
                                        <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                                            <Bell className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <p className="text-xs font-bold leading-tight line-clamp-2">CRM data reset successfully completed.</p>
                                            <p className="text-[10px] text-muted-foreground font-medium">Yesterday</p>
                                        </div>
                                    </DropdownMenuItem>
                                </div>
                            </div>
                            <div className="p-3 bg-muted/20 border-t border-border text-center">
                                <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Mark all as read</button>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="w-px h-8 bg-border mx-2"></div>

                <DropdownMenu>
                    <DropdownMenuTrigger render={
                        <Button variant="ghost" className="relative h-11 px-2 rounded-2xl hover:bg-primary/5 transition-colors flex items-center gap-3">
                            <Avatar className="h-8 w-8 border-2 border-primary/10">
                                <AvatarImage src={avatarUrl} alt={displayName} />
                                <AvatarFallback className="bg-primary/10 text-primary font-bold">{initials}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start text-left hidden sm:flex">
                                <span className="text-sm font-bold leading-none tracking-tight">{displayName}</span>
                                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Team Member</span>
                            </div>
                        </Button>
                    } />
                    <DropdownMenuContent className="w-64 p-2 rounded-2xl shadow-2xl border-border" align="end">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="font-normal p-3">
                                <div className="flex flex-col space-y-2">
                                    <p className="text-sm font-black leading-none tracking-tight">{displayName}</p>
                                    <p className="text-xs leading-none text-muted-foreground font-medium">{displayEmail}</p>
                                </div>
                            </DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="opacity-50" />

                        <div className="p-1 space-y-1">
                            <Link href="/settings">
                                <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5 font-bold gap-3 focus:bg-primary/5 focus:text-primary transition-colors">
                                    <User className="h-4 w-4" /> Edit Profile
                                </DropdownMenuItem>
                            </Link>
                            <Link href="/settings">
                                <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5 font-bold gap-3 focus:bg-primary/5 focus:text-primary transition-colors">
                                    <SettingsIcon className="h-4 w-4" /> Account Settings
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5 font-bold gap-3 focus:bg-primary/5 focus:text-primary transition-colors">
                                <Users className="h-4 w-4" /> Team Management
                            </DropdownMenuItem>
                        </div>

                        <DropdownMenuSeparator className="opacity-50" />

                        <div className="p-1">
                            <DropdownMenuItem
                                className="rounded-xl text-amber-600 focus:text-amber-600 focus:bg-amber-50 cursor-pointer font-bold py-2.5 gap-3 transition-colors"
                                onClick={() => {
                                    if (confirm("Are you sure you want to reset all CRM data? This cannot be undone.")) {
                                        resetData();
                                        window.location.reload();
                                    }
                                }}
                            >
                                <Bell className="h-4 w-4" /> Reset CRM Data
                            </DropdownMenuItem>
                        </div>

                        <DropdownMenuSeparator className="opacity-50" />

                        <div className="p-1">
                            <DropdownMenuItem
                                className="rounded-xl text-destructive focus:text-destructive focus:bg-destructive/5 cursor-pointer font-bold py-2.5 gap-3 transition-colors"
                                onClick={signOut}
                            >
                                <LogOut className="h-4 w-4" /> Log out Account
                            </DropdownMenuItem>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
