"use client"

import { useState } from "react"
import { useCRMData } from "@/hooks/use-crm-data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
    User, 
    Lock, 
    Settings as SettingsIcon, 
    Shield, 
    Bell, 
    Eye, 
    Database, 
    Users, 
    TrendingUp, 
    CheckCircle2,
    Mail,
    Globe,
    Zap
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
    const { currentUser, isLoaded, teamMembers, leads, campaigns } = useCRMData()
    const [activeTab, setActiveTab] = useState("general")

    if (!isLoaded || !currentUser) return null

    const isAdmin = currentUser.userRole === "Admin"
    const isManager = currentUser.userRole === "Manager" || isAdmin

    return (
        <div className="space-y-8 p-8 max-w-6xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tighter text-foreground">Settings</h1>
                <p className="text-muted-foreground font-medium">Manage your profile, account preferences, and system configurations.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <aside className="w-full md:w-64 shrink-0">
                    <nav className="flex flex-row md:flex-col gap-2 bg-card/50 backdrop-blur-sm p-2 rounded-[2rem] border border-border/50 sticky top-8">
                        <button
                            onClick={() => setActiveTab("general")}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all w-full",
                                activeTab === "general" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                            )}
                        >
                            <User className="h-4 w-4" /> General
                        </button>
                        <button
                            onClick={() => setActiveTab("security")}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all w-full",
                                activeTab === "security" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                            )}
                        >
                            <Lock className="h-4 w-4" /> Security
                        </button>
                        <button
                            onClick={() => setActiveTab("preferences")}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all w-full",
                                activeTab === "preferences" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                            )}
                        >
                            <SettingsIcon className="h-4 w-4" /> Preferences
                        </button>
                        {isAdmin && (
                            <button
                                onClick={() => setActiveTab("system")}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all w-full",
                                    activeTab === "system" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                                )}
                            >
                                <Database className="h-4 w-4" /> System
                            </button>
                        )}
                    </nav>
                </aside>

                {/* Content Area */}
                <main className="flex-1 space-y-8">
                    {activeTab === "general" && (
                        <div className="space-y-8">
                            {/* Profile Card */}
                            <Card className="border-none shadow-2xl shadow-primary/5 rounded-[2.5rem] bg-card/50 backdrop-blur-xl overflow-hidden">
                                <CardHeader className="p-8 pb-4">
                                    <CardTitle className="text-2xl font-bold tracking-tight">Profile Information</CardTitle>
                                    <CardDescription className="text-base font-medium">Update your personal details and how others see you.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 pt-0 space-y-8">
                                    <div className="flex flex-col sm:flex-row items-center gap-8 py-4 border-b border-border/50">
                                        <div className="relative group">
                                            <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                                                <AvatarImage src={currentUser.avatar} />
                                                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-black">
                                                    {currentUser.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                                <span className="text-[10px] text-white font-bold uppercase tracking-widest">Edit</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1 text-center sm:text-left">
                                            <h3 className="text-xl font-bold tracking-tight">{currentUser.name}</h3>
                                            <div className="flex items-center gap-2 justify-center sm:justify-start">
                                                <Badge className="bg-primary shadow-lg shadow-primary/20 rounded-full px-3">{currentUser.userRole}</Badge>
                                                <span className="text-xs font-medium text-muted-foreground">Global CRM Workspace</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Full Name</Label>
                                            <Input defaultValue={currentUser.name} className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-medium" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Email Address</Label>
                                            <Input defaultValue={currentUser.email} disabled className="h-12 rounded-2xl bg-muted/10 border-none font-medium cursor-not-allowed opacity-60" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Department</Label>
                                            <Input defaultValue="Growth & Revenue" className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-medium" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Timezone</Label>
                                            <Input defaultValue="GMT+00:00 (London)" className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-medium" />
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Button className="rounded-2xl h-12 px-8 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                            Save Changes
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Performance/Personal Stats Card */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {[
                                    { label: "Leads Added", value: currentUser.leadsAdded?.toString() || "0", icon: Users, color: "text-blue-600", bg: "bg-blue-500/5" },
                                    { label: "Emails Sent", value: currentUser.emailsSent?.toString() || "0", icon: Mail, color: "text-purple-600", bg: "bg-purple-500/5" },
                                    { label: "Account Status", value: currentUser.status, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-500/5" },
                                ].map((stat) => (
                                    <Card key={stat.label} className="border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-card/50 backdrop-blur-sm overflow-hidden group">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={cn("p-2 rounded-xl", stat.bg)}>
                                                    <stat.icon className={cn("h-5 w-5", stat.color)} />
                                                </div>
                                                <Badge variant="outline" className="text-[9px] uppercase tracking-tighter">Lifetime</Badge>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</div>
                                                <div className={cn("text-2xl font-bold tracking-tighter", stat.color)}>{stat.value}</div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <Card className="border-none shadow-2xl shadow-primary/5 rounded-[2.5rem] bg-card/50 backdrop-blur-xl overflow-hidden">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-2xl font-bold tracking-tight">Security Settings</CardTitle>
                                <CardDescription className="text-base font-medium">Protect your account with modern security standards.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 pt-0 space-y-8">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between py-6 border-b border-border/50">
                                        <div className="space-y-1">
                                            <div className="font-bold flex items-center gap-2">Two-Factor Authentication <Badge className="bg-green-500/10 text-green-600 border-none text-[8px] uppercase">Recommended</Badge></div>
                                            <div className="text-sm text-muted-foreground font-medium">Add an extra layer of security to your account.</div>
                                        </div>
                                        <Switch className="data-[state=checked]:bg-primary" />
                                    </div>
                                    <div className="flex items-center justify-between py-6 border-b border-border/50">
                                        <div className="space-y-1">
                                            <div className="font-bold">Last Security Audit</div>
                                            <div className="text-sm text-muted-foreground font-medium">Your account was last audited 3 days ago.</div>
                                        </div>
                                        <Badge variant="outline" className="font-bold px-3 py-1">Secure</Badge>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-4">
                                    <h3 className="text-lg font-bold tracking-tight">Update Password</h3>
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Current Password</Label>
                                            <Input type="password" placeholder="••••••••" className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">New Password</Label>
                                                <Input type="password" placeholder="••••••••" className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Confirm Password</Label>
                                                <Input type="password" placeholder="••••••••" className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button variant="outline" className="rounded-2xl h-12 px-8 font-bold border-primary text-primary hover:bg-primary/5 transition-all">
                                            Update Password
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "preferences" && (
                        <Card className="border-none shadow-2xl shadow-primary/5 rounded-[2.5rem] bg-card/50 backdrop-blur-xl overflow-hidden">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-2xl font-bold tracking-tight">App Preferences</CardTitle>
                                <CardDescription className="text-base font-medium">Customize your workspace experience.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 pt-0 space-y-8">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between py-6 border-b border-border/50">
                                        <div className="space-y-1">
                                            <div className="font-bold">Email Notifications</div>
                                            <div className="text-sm text-muted-foreground font-medium">Receive weekly productivity reports and team updates.</div>
                                        </div>
                                        <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                                    </div>
                                    <div className="flex items-center justify-between py-6 border-b border-border/50">
                                        <div className="space-y-1">
                                            <div className="font-bold">Compact View</div>
                                            <div className="text-sm text-muted-foreground font-medium">Maximize information density across all CRM tables.</div>
                                        </div>
                                        <Switch className="data-[state=checked]:bg-primary" />
                                    </div>
                                    <div className="flex items-center justify-between py-6 border-b border-border/50">
                                        <div className="space-y-1">
                                            <div className="font-bold">Auto-Collapse Sidebar</div>
                                            <div className="text-sm text-muted-foreground font-medium">Automatically shrink the menu when navigating between modules.</div>
                                        </div>
                                        <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <p className="text-xs text-muted-foreground font-medium italic">
                                        Note: Some preferences may vary based on your system role and assigned permissions.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "system" && isAdmin && (
                        <div className="space-y-8">
                            <Card className="border-none shadow-2xl shadow-primary/5 rounded-[2.5rem] bg-card/50 backdrop-blur-xl overflow-hidden text-primary-foreground relative overflow-hidden bg-primary">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
                                <CardHeader className="p-8 relative z-10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Badge className="bg-white/20 text-white border-none text-[9px] uppercase tracking-widest px-3">System Admin Mode</Badge>
                                    </div>
                                    <CardTitle className="text-3xl font-black tracking-tight">Global CRM Infrastructure</CardTitle>
                                    <CardDescription className="text-white/80 font-medium text-base">Monitor and configure system-wide parameters.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 pt-0 grid sm:grid-cols-3 gap-6 relative z-10">
                                    <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                                        <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Total Leads</div>
                                        <div className="text-2xl font-bold">{leads.length}</div>
                                    </div>
                                    <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                                        <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Active Members</div>
                                        <div className="text-2xl font-bold">{teamMembers.filter(m => m.status === 'Active').length}</div>
                                    </div>
                                    <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                                        <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Live Campaigns</div>
                                        <div className="text-2xl font-bold">{campaigns.filter(c => c.status === 'Active').length}</div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-2xl shadow-primary/5 rounded-[2.5rem] bg-card/50 backdrop-blur-xl overflow-hidden">
                                <CardHeader className="p-8 pb-4">
                                    <CardTitle className="text-2xl font-bold tracking-tight">System Controls</CardTitle>
                                    <CardDescription className="text-base font-medium">Advanced settings for global workspace management.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 pt-0 space-y-4">
                                    <div className="flex items-center justify-between py-5 border-b border-border/50">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600">
                                                <Globe className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold">Public API Access</div>
                                                <div className="text-xs text-muted-foreground font-medium">Enable 3rd party integrations via REST API.</div>
                                            </div>
                                        </div>
                                        <Switch className="data-[state=checked]:bg-primary" />
                                    </div>
                                    <div className="flex items-center justify-between py-5 border-b border-border/50">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-600">
                                                <Zap className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold">Instant Notifications</div>
                                                <div className="text-xs text-muted-foreground font-medium">Push real-time updates to team dashboards.</div>
                                            </div>
                                        </div>
                                        <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                                    </div>
                                    <div className="flex items-center justify-between py-5 border-b border-border/50">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-slate-500/10 rounded-xl flex items-center justify-center text-slate-600">
                                                <Eye className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold">Auditor Visibility</div>
                                                <div className="text-xs text-muted-foreground font-medium">Allow read-only accounts for external auditors.</div>
                                            </div>
                                        </div>
                                        <Switch className="data-[state=checked]:bg-primary" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
