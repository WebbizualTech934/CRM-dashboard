"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
    Mail, 
    MessageSquare, 
    Reply, 
    Clock,
    User,
    ArrowUpRight,
    ExternalLink
} from "lucide-react"
import { LinkedinLead, LinkedinInteraction } from "@/providers/crm-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface LinkedinInMailProps {
    leads: LinkedinLead[]
    interactions: LinkedinInteraction[]
    onSelectLead: (id: string) => void
}

export function LinkedinInMail({ leads, interactions, onSelectLead }: LinkedinInMailProps) {
    const messagedLeads = leads.filter(l => l.status === 'Accepted' || l.status === 'Replied' || l.status === 'Converted')
    
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="bg-card/50 backdrop-blur-sm border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-10 border-b border-border/50 bg-muted/5 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-3">
                            <Mail className="h-6 w-6 text-primary" /> InMail Tracker
                        </CardTitle>
                        <p className="text-sm text-muted-foreground font-medium mt-1">Status of direct message exchanges and conversational depth</p>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase tracking-widest px-4 py-1">
                        {messagedLeads.length} ACTIVE THREADS
                    </Badge>
                </CardHeader>
                <CardContent className="p-10">
                    <div className="space-y-6">
                        {messagedLeads.map(lead => {
                            const leadInteractions = interactions.filter(i => i.leadId === lead.id && i.type === 'Message')
                            const lastInteraction = leadInteractions[0]

                            return (
                                <div 
                                    key={lead.id} 
                                    className="p-8 rounded-[2rem] bg-muted/20 border border-transparent flex flex-col gap-6 group hover:border-primary/20 hover:bg-primary/5 transition-all cursor-pointer shadow-sm"
                                    onClick={() => onSelectLead(lead.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-5">
                                            <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center font-bold text-primary text-xl border border-border/50">
                                                {lead.contactName.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-xl tracking-tight">{lead.contactName}</div>
                                                <div className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                                                    {lead.companyName} • 
                                                    <span className={cn(
                                                        "font-black uppercase text-[10px] tracking-widest px-2 py-0.5 rounded-lg",
                                                        lead.status === 'Replied' ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                                                    )}>
                                                        {lead.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-white shadow-sm hover:bg-primary hover:text-white transition-all">
                                            <ExternalLink className="h-5 w-5" />
                                        </Button>
                                    </div>

                                    {lastInteraction ? (
                                        <div className="bg-white/60 p-6 rounded-2xl border border-border/40 relative">
                                            <div className="flex items-center gap-2 mb-3">
                                                <MessageSquare className="h-3.5 w-3.5 text-primary" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Last Engagement</span>
                                                <span className="text-[10px] font-bold text-muted-foreground/40 ml-auto">{new Date(lastInteraction.timestamp).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-slate-700 font-medium italic line-clamp-2 leading-relaxed">
                                                "{lastInteraction.content}"
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="bg-primary/5 p-6 rounded-2xl border border-dashed border-primary/20 text-center">
                                            <span className="text-xs font-bold text-primary/60 italic">No message content logged yet.</span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-6">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1">Total Exchanges</span>
                                                <span className="text-lg font-black">{leadInteractions.length}</span>
                                            </div>
                                            <div className="h-8 w-[1px] bg-border/50" />
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1">Lead Potential</span>
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map(i => (
                                                        <div key={i} className={cn("h-1.5 w-4 rounded-full", i <= (lead.priority === 'High' ? 5 : 3) ? "bg-primary" : "bg-muted-foreground/10")} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <Button className="rounded-xl h-10 px-6 font-black uppercase text-[10px] tracking-widest bg-primary shadow-lg shadow-primary/20 hover:scale-[1.05] transition-all">
                                            OPEN THREAD <ArrowUpRight className="h-3 w-3 ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                        {messagedLeads.length === 0 && (
                            <div className="text-center py-20 text-muted-foreground/40 font-medium">
                                No active InMail sequences detected. Start by accepting connection requests.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
