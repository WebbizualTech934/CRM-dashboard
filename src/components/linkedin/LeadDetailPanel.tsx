"use client"

import { 
    X, 
    Linkedin, 
    ExternalLink, 
    Star, 
    Calendar, 
    MessageSquare, 
    CheckSquare, 
    Clock,
    Plus,
    ChevronRight,
    Zap,
    History,
    FileText,
    MoreVertical,
    Send,
    ArrowUpRight,
    Briefcase
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LinkedinLead, LinkedinInteraction } from "@/providers/crm-provider"
import { cn } from "@/lib/utils"
import { useState, useRef } from "react"

interface LeadDetailPanelProps {
    lead: LinkedinLead
    interactions: LinkedinInteraction[]
    onClose: () => void
    onAddInteraction: (type: string, content?: string) => void
    onUpdateLead: (updates: Partial<LinkedinLead>) => void
}

export function LeadDetailPanel({ lead, interactions, onClose, onAddInteraction, onUpdateLead }: LeadDetailPanelProps) {
    const [noteContent, setNoteContent] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const statusProgress: Record<string, number> = {
        'Not Contacted': 10,
        'Connection Sent': 30,
        'Accepted': 50,
        'Message Sent': 70,
        'Replied': 85,
        'Converted': 100
    }

    const handleAddNote = async () => {
        if (!noteContent.trim()) return
        setIsSubmitting(true)
        try {
            await onAddInteraction('Note', noteContent)
            setNoteContent("")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-background/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-4xl bg-background/95 backdrop-blur-3xl border-l border-border/50 h-full flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.2)] animate-in slide-in-from-right duration-500 overflow-hidden">
                {/* Header */}
                <div className="p-10 border-b border-border/50 flex items-center justify-between bg-muted/5">
                    <div className="flex items-center gap-8">
                        <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center font-black text-3xl text-primary shadow-inner">
                            {lead.contactName.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center gap-4 mb-2">
                                <h2 className="text-3xl font-black tracking-tighter text-foreground">{lead.contactName}</h2>
                                <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] px-3 tracking-widest">PROSPECT</Badge>
                                {error && (
                                    <Badge variant="destructive" className="font-bold text-[8px] animate-in fade-in slide-in-from-left-2">{error}</Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-6 text-sm text-muted-foreground font-medium">
                                <span className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-primary/60" /> {lead.companyName}</span>
                                <span className="flex items-center gap-2"><ArrowUpRight className="h-4 w-4 text-primary/60" /> {lead.leadSource}</span>
                                <span className="flex items-center gap-2"><Star className={cn("h-4 w-4", lead.priority === 'High' ? "fill-primary text-primary" : "text-primary/40")} /> {lead.priority} Priority</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-12 w-12 rounded-2xl border-border/50 hover:bg-primary/5 hover:text-primary transition-all shadow-sm"
                            onClick={() => window.open(lead.profileUrl, '_blank')}
                        >
                            <ExternalLink className="h-5 w-5" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-12 w-12 rounded-2xl hover:bg-muted font-bold transition-all"
                            onClick={onClose}
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                    {/* Status Progress */}
                    <div className="space-y-4 bg-muted/20 p-8 rounded-[2rem] border border-border/30">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Outreach Lifecycle</span>
                            <Badge className="bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest px-4 py-1 rounded-full border-none shadow-lg shadow-primary/20">
                                {lead.status}
                            </Badge>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                            <div 
                                className="h-full bg-primary transition-all duration-1000 shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                                style={{ width: `${statusProgress[lead.status] || 0}%` }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Main Interaction Hub */}
                        <div className="lg:col-span-2 space-y-10">
                            {/* Personalized Strategy / Hook Angle */}
                            <Card className="bg-card/30 backdrop-blur-sm border-none shadow-xl rounded-[2.5rem] overflow-hidden group hover:shadow-primary/5 transition-all">
                                <CardHeader className="p-8 border-b border-border/50 bg-muted/5">
                                    <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-3">
                                        <Zap className="h-5 w-5 text-primary" /> The Hook Angle
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Strategic Entry Point</label>
                                        <div className="p-6 rounded-3xl bg-muted/40 border border-border/50 font-medium text-base leading-relaxed italic text-foreground shadow-sm">
                                            "{lead.hookAngle || "Initial research pending. Identify high-leverage entry points from recent activity."}"
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Internal Intelligence</label>
                                        <textarea 
                                            className="w-full bg-muted/20 border-none rounded-3xl p-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none resize-none h-32 placeholder:text-muted-foreground/30 transition-all shadow-inner"
                                            placeholder="Document key insights about this lead..."
                                            defaultValue={lead.notes}
                                            onBlur={(e) => onUpdateLead({ notes: e.target.value })}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Interaction Timeline */}
                            <div className="space-y-8">
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                                        <History className="h-6 w-6 text-primary" /> Activity Feed
                                    </h3>
                                    <Badge variant="outline" className="border-border/50 text-muted-foreground font-black text-[10px] tracking-widest px-3 py-1 uppercase rounded-full">
                                        {interactions.length} Events
                                    </Badge>
                                </div>

                                <div className="relative space-y-10 before:absolute before:left-[17px] before:top-4 before:bottom-4 before:w-[2px] before:bg-border/50 px-2">
                                    {interactions.length === 0 ? (
                                        <div className="text-center p-20 text-muted-foreground font-medium border-2 border-dashed border-border/50 rounded-[2.5rem] bg-muted/10">
                                            <Clock className="h-10 w-10 text-muted-foreground/20 mx-auto mb-4" />
                                            No interactions logged yet.
                                        </div>
                                    ) : (
                                        interactions.map((interaction, idx) => (
                                            <div key={interaction.id} className="relative pl-12 group animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                                                <div className="absolute left-0 top-1 w-[36px] h-[36px] rounded-xl bg-card border-2 border-primary/20 shadow-sm flex items-center justify-center z-10 group-hover:border-primary transition-colors">
                                                    <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]"></div>
                                                </div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">{new Date(interaction.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</div>
                                                    <Badge className="bg-primary/5 text-primary border-none font-black text-[8px] px-2 py-0.5 uppercase tracking-tighter">LOGGED</Badge>
                                                </div>
                                                <div className="bg-card/50 border border-border/50 rounded-2xl p-5 group-hover:border-primary/20 transition-all shadow-sm">
                                                    <div className="text-sm font-bold text-foreground mb-1">{interaction.type}</div>
                                                    <div className="text-xs text-muted-foreground font-medium leading-relaxed italic">"{interaction.content}"</div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar: Quick Actions & Details */}
                        <div className="space-y-8">
                            {/* Action Engine */}
                            <Card className="bg-primary border-none rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/20">
                                <CardHeader className="p-8 border-b border-white/10">
                                    <CardTitle className="text-primary-foreground text-xl font-bold tracking-tight flex items-center gap-3">
                                        <Zap className="h-6 w-6" /> Action Engine
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 space-y-4">
                                    <Button 
                                        className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-black tracking-widest h-14 rounded-2xl border-none shadow-lg gap-3 transition-transform active:scale-95"
                                        onClick={() => onAddInteraction('Connection', 'Personalized connection request initiated.')}
                                    >
                                        <Linkedin className="h-5 w-5" /> SEND CONNECTION
                                    </Button>
                                    <div className="space-y-2">
                                        <Button variant="ghost" className="w-full justify-between text-primary-foreground hover:bg-white/10 font-bold h-12 px-6 rounded-2xl border border-white/20 transition-all">
                                            First Follow-Up <ChevronRight className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" className="w-full justify-between text-primary-foreground hover:bg-white/10 font-bold h-12 px-6 rounded-2xl border border-white/20 transition-all">
                                            Value Pitch <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Details Grid */}
                            <Card className="bg-card/30 backdrop-blur-sm border-none shadow-xl rounded-[2.5rem] overflow-hidden">
                                <CardHeader className="p-8 border-b border-border/50 bg-muted/5">
                                    <CardTitle className="text-sm font-black tracking-widest uppercase flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-primary" /> Intelligence
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <div className="space-y-1 group">
                                        <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest flex items-center justify-between">
                                            Email Access
                                            <Badge variant="ghost" className="text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">EDITABLE</Badge>
                                        </div>
                                        <input 
                                            className="w-full bg-transparent border-none p-0 text-sm font-bold text-foreground focus:ring-0 outline-none truncate"
                                            defaultValue={lead.workEmail || ''}
                                            placeholder="No email recorded"
                                            onBlur={async (e) => {
                                                try {
                                                    setError(null)
                                                    await onUpdateLead({ workEmail: e.target.value })
                                                } catch (err: any) {
                                                    setError("Update failed")
                                                }
                                            }}
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1 group">
                                            <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest flex items-center justify-between">
                                                Sent Time (IST)
                                                <Badge variant="ghost" className="text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">EDITABLE</Badge>
                                            </div>
                                            <input 
                                                className="w-full bg-transparent border-none p-0 text-sm font-bold text-foreground focus:ring-0 outline-none"
                                                defaultValue={lead.sentTimeIST || ''}
                                                placeholder="e.g. 10:30 AM"
                                                onBlur={(e) => onUpdateLead({ sentTimeIST: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1 group">
                                            <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest flex items-center justify-between">
                                                Drafted
                                                <Badge variant="ghost" className="text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">EDITABLE</Badge>
                                            </div>
                                            <input 
                                                className="w-full bg-transparent border-none p-0 text-sm font-bold text-foreground focus:ring-0 outline-none"
                                                defaultValue={lead.draftedContent || ''}
                                                placeholder="Template Name"
                                                onBlur={(e) => onUpdateLead({ draftedContent: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1 group">
                                            <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest flex items-center justify-between">
                                                In Mail
                                                <Badge variant="ghost" className="text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">EDITABLE</Badge>
                                            </div>
                                            <input 
                                                className="w-full bg-transparent border-none p-0 text-sm font-bold text-foreground focus:ring-0 outline-none"
                                                defaultValue={lead.inMail || ''}
                                                placeholder="Sent / Pending"
                                                onBlur={(e) => onUpdateLead({ inMail: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1 group">
                                            <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest flex items-center justify-between">
                                                Follow Up
                                                <Badge variant="ghost" className="text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">EDITABLE</Badge>
                                            </div>
                                            <input 
                                                className="w-full bg-transparent border-none p-0 text-sm font-bold text-foreground focus:ring-0 outline-none"
                                                defaultValue={lead.followUp || ''}
                                                placeholder="Next: Day 3"
                                                onBlur={(e) => onUpdateLead({ followUp: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">System Acquisition</div>
                                        <div className="text-sm font-bold text-foreground">{new Date(lead.dateAdded).toLocaleDateString()}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Automation Ready</div>
                                        <div className="text-sm font-bold text-primary">Qualified Prospect</div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Button 
                                variant="ghost" 
                                className="w-full gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/5 font-bold rounded-2xl h-14 transition-all"
                            >
                                <X className="h-5 w-5" /> ARCHIVE PROSPECT
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Footer Action Bar */}
                <div className="p-8 bg-card/50 backdrop-blur-xl border-t border-border/50 flex items-center gap-4">
                    <div className="relative flex-1 group">
                        <MessageSquare className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input 
                            className="w-full bg-muted/30 border-none rounded-2xl pl-14 pr-6 h-14 font-medium text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                            placeholder="Add a timeline note or log custom activity..."
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                        />
                    </div>
                    <Button 
                        disabled={isSubmitting || !noteContent.trim()}
                        onClick={handleAddNote}
                        className="h-14 w-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center p-0 border-none shadow-lg shadow-primary/20 transition-all active:scale-95"
                    >
                        <Send className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
