"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
    CheckSquare, 
    Clock, 
    AlertCircle, 
    MessageSquare, 
    User,
    ArrowRight
} from "lucide-react"
import { LinkedinLead } from "@/providers/crm-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface LinkedinTasksProps {
    leads: LinkedinLead[]
    onSelectLead: (id: string) => void
}

export function LinkedinTasks({ leads, onSelectLead }: LinkedinTasksProps) {
    // Logic to categorize tasks
    const leadsNeedingFollowUp = leads.filter(l => l.status !== 'Converted' && (l.status as string) !== 'Not Interested')
    
    const urgent = leadsNeedingFollowUp.filter(l => {
        const lastUpdate = new Date(l.updatedAt).getTime()
        const diff = Date.now() - lastUpdate
        return diff > 3 * 24 * 60 * 60 * 1000 // 3 days
    })

    const pending = leadsNeedingFollowUp.filter(l => l.status === 'Not Contacted' || l.status === 'Connection Sent')

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Urgent Follow-ups */}
                <Card className="bg-white border border-border shadow-2xl rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-10 border-b border-border bg-red-500/5 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-3 text-red-600">
                                <AlertCircle className="h-6 w-6" /> Urgent Outreach
                            </CardTitle>
                            <p className="text-sm text-muted-foreground font-medium mt-1">Leads with no activity in over 72 hours</p>
                        </div>
                        <Badge className="bg-red-500 text-white border-none font-black text-[10px] uppercase tracking-widest px-4 py-1">
                            {urgent.length} AT RISK
                        </Badge>
                    </CardHeader>
                    <CardContent className="p-10">
                        <div className="space-y-6">
                            {urgent.slice(0, 5).map(lead => (
                                <div 
                                    key={lead.id} 
                                    className="p-6 rounded-3xl bg-muted/20 border border-transparent flex items-center justify-between group hover:border-red-200 hover:bg-red-50/30 transition-all cursor-pointer shadow-sm"
                                    onClick={() => onSelectLead(lead.id)}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="h-12 w-12 rounded-2xl bg-red-100 flex items-center justify-center font-bold text-red-600 group-hover:scale-110 transition-transform">
                                            {lead.contactName.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg">{lead.contactName}</div>
                                            <div className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                                                Last active {new Date(lead.updatedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="ghost" className="text-primary font-black text-[10px] tracking-widest hover:bg-primary/5 px-6">
                                        ENGAGE <ArrowRight className="h-3 w-3 ml-2" />
                                    </Button>
                                </div>
                            ))}
                            {urgent.length === 0 && (
                                <div className="text-center py-20 text-muted-foreground/40 font-medium">
                                    Your pipeline is currently fresh. No urgent follow-ups.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Status-based Actions */}
                <Card className="bg-white border border-border shadow-2xl rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-10 border-b border-border bg-primary/5 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-3">
                                <CheckSquare className="h-6 w-6 text-primary" /> Action Required
                            </CardTitle>
                            <p className="text-sm text-muted-foreground font-medium mt-1">Status-driven outreach tasks</p>
                        </div>
                        <Badge className="bg-primary text-primary-foreground border-none font-black text-[10px] uppercase tracking-widest px-4 py-1">
                            {pending.length} TASKS
                        </Badge>
                    </CardHeader>
                    <CardContent className="p-10">
                        <div className="space-y-6">
                            {pending.slice(0, 5).map(lead => (
                                <div 
                                    key={lead.id} 
                                    className="p-6 rounded-3xl bg-muted/20 border border-transparent flex items-center justify-between group hover:border-primary/20 hover:bg-primary/5 transition-all cursor-pointer shadow-sm"
                                    onClick={() => onSelectLead(lead.id)}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center font-bold text-primary group-hover:scale-110 transition-transform">
                                            {lead.contactName.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg">{lead.contactName}</div>
                                            <Badge variant="outline" className="text-[8px] font-black uppercase tracking-tighter mt-1 bg-white/50">
                                                {lead.status === 'Not Contacted' ? 'NEED CONNECTION' : 'WAITING FOR ACCEPT'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="h-8 w-8 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
