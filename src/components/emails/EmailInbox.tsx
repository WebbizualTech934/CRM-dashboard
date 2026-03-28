"use client"

import { useState } from "react"
import { useCRMData } from "@/hooks/use-crm-data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Mail, Filter, Reply, User, MessageCircle, MoreVertical, Inbox } from "lucide-react"
import { cn } from "@/lib/utils"

export function EmailInbox({ projectId }: { projectId?: string }) {
    const { inbox, leads, campaigns, projects, updateInboxMessage, addInboxMessage, isLoaded } = useCRMData()
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
    const [replyText, setReplyText] = useState("")
    const [isSending, setIsSending] = useState(false)
 
    if (!isLoaded) return null
 
    // Filter inbox for project if provided
    const filteredInbox = projectId
        ? inbox.filter(msg => {
            const campaign = campaigns.find(c => c.id === msg.campaignId)
            return campaign?.projectId === projectId
        })
        : inbox
 
    // Group messages by thread_id
    const threadsMap = new Map<string, any[]>()
    filteredInbox.forEach(msg => {
        if (!threadsMap.has(msg.threadId)) {
            threadsMap.set(msg.threadId, [])
        }
        threadsMap.get(msg.threadId)?.push(msg)
    })
 
    const threads = Array.from(threadsMap.entries()).map(([id, msgs]) => {
        const sortedMsgs = [...msgs].sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
        const latest = sortedMsgs[0]
        const lead = leads.find(l => l.id === latest.leadId)
        const campaign = campaigns.find(c => c.id === latest.campaignId)
        const project = projects.find(p => p.id === campaign?.projectId)
 
        return {
            id,
            messages: sortedMsgs,
            latest,
            lead,
            campaign,
            project,
            count: msgs.length
        }
    }).sort((a, b) => new Date(b.latest.sentAt).getTime() - new Date(a.latest.sentAt).getTime())
 
    const selectedThread = threads.find(t => t.id === selectedThreadId)
 
    const handleSendReply = async () => {
        if (!selectedThread || !replyText.trim()) return
        setIsSending(true)
        try {
            await addInboxMessage({
                leadId: selectedThread.lead?.id || "",
                campaignId: selectedThread.campaign?.id || "",
                templateId: "",
                threadId: selectedThread.id,
                subject: `Re: ${selectedThread.latest.subject}`,
                body: replyText,
                status: "Replied",
                direction: "Outgoing"
            })
            setReplyText("")
        } catch (error) {
            console.error("Error sending reply:", error)
        } finally {
            setIsSending(false)
        }
    }
 
    return (
        <div className="flex h-[700px] gap-6 overflow-hidden">
            {/* Thread List */}
            <Card className="w-80 border-none shadow-xl shadow-primary/5 rounded-[2.5rem] bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col shrink-0">
                <div className="p-6 border-b border-border/50 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">Unified Inbox</h3>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/5 hover:text-primary"><Filter className="h-4 w-4" /></Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search messages..." className="pl-11 h-11 rounded-xl bg-background/50 border-border/50 text-xs font-medium focus-visible:ring-primary/20" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {threads.map(thread => (
                        <div
                            key={thread.id}
                            onClick={() => setSelectedThreadId(thread.id)}
                            className={cn(
                                "p-4 rounded-2xl cursor-pointer transition-all border group relative",
                                selectedThreadId === thread.id
                                    ? "bg-white border-primary/20 shadow-lg shadow-primary/5"
                                    : "bg-transparent border-transparent hover:bg-white/40 hover:border-border/30 hover:shadow-md"
                            )}
                        >
                            {selectedThreadId === thread.id && (
                                <div className="absolute left-0 top-4 bottom-4 w-1 bg-primary rounded-r-full" />
                            )}
                            <div className="flex justify-between items-start mb-1">
                                <div className={cn("font-bold text-xs truncate", selectedThreadId === thread.id ? "text-primary" : "text-foreground")}>
                                    {thread.lead ? `${thread.lead.firstName} ${thread.lead.lastName}` : "Unknown Lead"}
                                </div>
                                <span className={cn("text-[8px] font-black uppercase tracking-widest", selectedThreadId === thread.id ? "text-primary/40" : "text-muted-foreground/40")}>
                                    {new Date(thread.latest.sentAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="text-[10px] font-bold text-muted-foreground truncate mb-2 group-hover:text-foreground/80 transition-colors">
                                {thread.latest.subject}
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex gap-1">
                                    <Badge variant="outline" className={cn(
                                        "text-[8px] font-black uppercase tracking-widest px-2 py-0 h-4 border-none",
                                        thread.latest.status === "Interested" ? "bg-green-500 text-white shadow-lg shadow-green-500/20" :
                                            thread.latest.status === "Replied" ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" :
                                                "bg-muted text-muted-foreground"
                                    )}>
                                        {thread.latest.status}
                                    </Badge>
                                    {!projectId && (
                                        <Badge className="bg-primary/5 text-primary border-none text-[7px] font-black uppercase tracking-tight px-1.5 h-4">
                                            {thread.project?.name || "Global"}
                                        </Badge>
                                    )}
                                </div>
                                {thread.count > 1 && (
                                    <span className="text-[9px] font-black bg-muted/50 px-2 rounded-full border border-border/50">{thread.count}</span>
                                )}
                            </div>
                        </div>
                    ))}
                    {threads.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                            <Mail className="h-10 w-10 opacity-10 mb-2" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 text-center">No Active Conversations</p>
                        </div>
                    )}
                </div>
            </Card>
 
            {/* Conversation View */}
            <Card className="flex-1 border-none shadow-xl shadow-primary/5 rounded-[2.5rem] bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col">
                {selectedThread ? (
                    <>
                        <div className="p-8 border-b border-border/50 flex items-center justify-between bg-white/30 shrink-0">
                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white shadow-xl shadow-primary/20">
                                    <User className="h-7 w-7" />
                                </div>
                                <div>
                                    <h3 className="font-black text-2xl tracking-tighter leading-none mb-2">
                                        {selectedThread.lead ? `${selectedThread.lead.firstName} ${selectedThread.lead.lastName}` : "Unknown Lead"}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{selectedThread.lead?.email}</span>
                                        </div>
                                        <div className="h-4 w-px bg-border/50" />
                                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-primary/20 text-primary bg-primary/5 rounded-lg px-2 shadow-sm">
                                            {selectedThread.campaign?.name || "No Campaign"}
                                        </Badge>
                                        {!projectId && (
                                            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-blue-200 text-blue-600 bg-blue-50 rounded-lg px-2">
                                                {selectedThread.project?.name || "Global Project"}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" size="sm" className="rounded-xl h-12 px-6 font-bold gap-2 border-border/50 hover:bg-primary/5 hover:text-primary transition-all shadow-sm">
                                    <MessageCircle className="h-4 w-4" /> CRM Activity
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-xl h-12 w-12 hover:bg-muted/50"><MoreVertical className="h-5 w-5" /></Button>
                            </div>
                        </div>
 
                        <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-muted/[0.03]">
                            {selectedThread.messages.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()).map((msg, i) => (
                                <div key={msg.id} className={cn(
                                    "flex flex-col max-w-[85%] space-y-3",
                                    msg.direction === "Outgoing" ? "ml-auto items-end" : "mr-auto items-start"
                                )}>
                                    <div className="flex items-center gap-3 px-2">
                                        <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">
                                            {msg.direction === "Outgoing" ? "You" : selectedThread.lead?.firstName}
                                        </span>
                                        <span className="h-1 w-1 rounded-full bg-muted-foreground/20" />
                                        <span className="text-[8px] font-bold text-muted-foreground/30">
                                            {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className={cn(
                                        "p-8 rounded-[2.5rem] text-[0.95rem] font-medium leading-relaxed shadow-xl transition-all",
                                        msg.direction === "Outgoing"
                                            ? "bg-primary text-white rounded-tr-none shadow-primary/20"
                                            : "bg-white border-none rounded-tl-none shadow-primary/5"
                                    )}>
                                        <div className="whitespace-pre-wrap">{msg.body}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
 
                        <div className="p-8 border-t border-border/50 shrink-0 bg-white/50 backdrop-blur-md">
                            <div className="relative group">
                                <textarea
                                    className="w-full h-36 p-6 rounded-[2rem] border-2 border-border/50 bg-background focus:border-primary/50 focus:ring-0 transition-all text-[0.95rem] font-medium resize-none shadow-inner"
                                    placeholder="Draft a premium response..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                />
                                <div className="absolute bottom-6 right-6 flex gap-3">
                                    <Button 
                                        size="lg" 
                                        className="rounded-2xl font-black uppercase tracking-widest text-[11px] h-12 px-8 shadow-xl shadow-primary/25 bg-primary hover:bg-primary/90 text-white border-none transition-all group-hover:scale-[1.02] active:scale-[0.98] gap-3"
                                        onClick={handleSendReply}
                                        disabled={isSending || !replyText.trim()}
                                    >
                                        {isSending ? (
                                            <span className="flex items-center gap-2">Connecting...</span>
                                        ) : (
                                            <>
                                                <Reply className="h-4 w-4" /> Send Reply
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-10 bg-muted/5">
                        <div className="h-24 w-24 rounded-[2.5rem] bg-card border border-border/50 shadow-xl shadow-primary/5 flex items-center justify-center mb-6 animate-pulse">
                            <Inbox className="h-10 w-10 text-primary/20" />
                        </div>
                        <h3 className="text-2xl font-black tracking-tighter text-foreground">Select a thread</h3>
                        <p className="font-bold text-xs mt-2 max-w-[240px] text-center uppercase tracking-widest text-muted-foreground/60 leading-relaxed">
                            Navigate through your unified communications across all projects.
                        </p>
                    </div>
                )}
            </Card>
        </div>
    )
}
