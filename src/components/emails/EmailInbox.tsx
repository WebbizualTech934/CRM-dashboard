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
    const { inbox, leads, campaigns, updateInboxMessage, addInboxMessage, isLoaded } = useCRMData()
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

        return {
            id,
            messages: sortedMsgs,
            latest,
            lead,
            campaign,
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
        <div className="flex h-[600px] gap-6 overflow-hidden">
            {/* Thread List */}
            <Card className="w-80 border-none shadow-sm rounded-3xl bg-card overflow-hidden flex flex-col shrink-0">
                <div className="p-4 border-b space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground/60">Messages</h3>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl"><Filter className="h-4 w-4" /></Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search inbox..." className="pl-9 h-10 rounded-xl bg-muted/30 border-none text-xs" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {threads.map(thread => (
                        <div
                            key={thread.id}
                            onClick={() => setSelectedThreadId(thread.id)}
                            className={cn(
                                "p-4 rounded-2xl cursor-pointer transition-all border",
                                selectedThreadId === thread.id
                                    ? "bg-primary/5 border-primary/20 shadow-sm"
                                    : "bg-transparent border-transparent hover:bg-muted/30"
                            )}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <div className="font-bold text-xs truncate">
                                    {thread.lead ? `${thread.lead.firstName} ${thread.lead.lastName}` : "Unknown Lead"}
                                </div>
                                <span className="text-[9px] font-bold text-muted-foreground/40 whitespace-nowrap">
                                    {new Date(thread.latest.sentAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="text-[10px] font-bold text-muted-foreground truncate mb-2">
                                {thread.latest.subject}
                            </div>
                            <div className="flex items-center justify-between">
                                <Badge variant="outline" className={cn(
                                    "text-[9px] font-bold uppercase tracking-widest px-2 py-0 h-5 border-none",
                                    thread.latest.status === "Interested" ? "bg-green-500/10 text-green-600" :
                                        thread.latest.status === "Replied" ? "bg-blue-500/10 text-blue-600" :
                                            "bg-muted/50 text-muted-foreground"
                                )}>
                                    {thread.latest.status}
                                </Badge>
                                {thread.count > 1 && (
                                    <span className="text-[9px] font-black bg-muted px-1.5 rounded-full">{thread.count}</span>
                                )}
                            </div>
                        </div>
                    ))}
                    {threads.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                            <Mail className="h-10 w-10 opacity-20 mb-2" />
                            <p className="text-xs font-bold text-muted-foreground">No messages yet.</p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Conversation View */}
            <Card className="flex-1 border-none shadow-sm rounded-[2.5rem] bg-card overflow-hidden flex flex-col">
                {selectedThread ? (
                    <>
                        <div className="p-6 border-b flex items-center justify-between bg-muted/10 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-none">
                                        {selectedThread.lead ? `${selectedThread.lead.firstName} ${selectedThread.lead.lastName}` : "Unknown Lead"}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest border-muted-foreground/20">
                                            {selectedThread.campaign?.name || "No Campaign"}
                                        </Badge>
                                        <span className="text-[10px] font-bold text-muted-foreground">• {selectedThread.lead?.email}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="rounded-xl font-bold gap-2 border-muted-foreground/20">
                                    <MessageCircle className="h-4 w-4" /> Move to Leads
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-xl"><MoreVertical className="h-4 w-4" /></Button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-muted/5">
                            {selectedThread.messages.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()).map((msg, i) => (
                                <div key={msg.id} className={cn(
                                    "flex flex-col max-w-[80%] space-y-2",
                                    msg.direction === "Outgoing" ? "ml-auto items-end" : "mr-auto items-start"
                                )}>
                                    <div className={cn(
                                        "p-6 rounded-[2rem] text-sm font-medium",
                                        msg.direction === "Outgoing"
                                            ? "bg-primary text-white rounded-tr-none shadow-lg shadow-primary/20"
                                            : "bg-white border rounded-tl-none shadow-sm"
                                    )}>
                                        <div className="font-bold mb-2 text-xs opacity-60">
                                            {msg.direction === "Outgoing" ? "You" : selectedThread.lead?.firstName}
                                        </div>
                                        <div className="whitespace-pre-wrap">{msg.body}</div>
                                    </div>
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase px-2">
                                        {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 border-t shrink-0 bg-white">
                            <div className="relative">
                                <textarea
                                    className="w-full h-32 p-4 rounded-2xl border bg-muted/10 focus:ring-primary/20 transition-all text-sm resize-none"
                                    placeholder="Type your reply..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                />
                                <div className="absolute bottom-4 right-4 flex gap-2">
                                    <Button 
                                        size="sm" 
                                        className="rounded-xl font-bold gap-2 h-9"
                                        onClick={handleSendReply}
                                        disabled={isSending || !replyText.trim()}
                                    >
                                        <Reply className="h-4 w-4" /> {isSending ? "Sending..." : "Send Reply"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-10">
                        <div className="h-20 w-20 rounded-[2rem] bg-muted/20 flex items-center justify-center mb-4">
                            <Inbox className="h-10 w-10 opacity-20" />
                        </div>
                        <h3 className="text-xl font-bold tracking-tight">Select a conversation</h3>
                        <p className="font-medium text-sm mt-1 max-w-xs text-center">Pick a thread from the left to view the full conversation history and reply.</p>
                    </div>
                )}
            </Card>
        </div>
    )
}
