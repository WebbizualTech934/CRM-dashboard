"use client"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    Mail, Phone, Globe, Calendar, Database, History, MoreHorizontal, Edit3, MessageSquare, Info, User
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RowDetailDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    data: any 
    onEdit?: (data: any) => void
}

export function RowDetailDrawer({ open, onOpenChange, data, onEdit }: RowDetailDrawerProps) {

    if (!data) return null

    const title = data.company || data.name || data.title || (data.firstName ? `${data.firstName} ${data.lastName}` : "Details")
    
    const subtitle = data.jobTitle 
        ? `${data.jobTitle} @ ${data.company}` 
        : data.email || data.websiteLink || data.website || ""

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col bg-white border-l border-border/50 shadow-2xl">
                <div className="bg-primary/[0.03] p-8 border-b border-border/50 shrink-0">
                    <SheetHeader>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2.5">
                                <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Database className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                                    {data.status || data.serviceInterest || data.fitLevel || "Record Detail"}
                                </span>
                            </div>
                        </div>
                        <SheetTitle className="text-3xl font-black tracking-tighter text-slate-900 leading-tight">
                            {title}
                        </SheetTitle>
                        <p className="text-sm text-muted-foreground font-medium mt-1 flex items-center gap-2">
                            {data.jobTitle && <span className="flex items-center gap-1"><User className="h-3 w-3" /> {data.jobTitle}</span>}
                            {data.company && <span className="flex items-center gap-1"><Info className="h-3 w-3" /> {data.company}</span>}
                        </p>
                    </SheetHeader>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-slate-50/30">
                    {/* Key Properties Card */}
                    <div className="bg-white rounded-[2rem] border border-border/50 shadow-sm overflow-hidden transition-all hover:shadow-md">
                        <div className="px-6 py-4 border-b border-border/50 bg-primary/[0.02] flex justify-between items-center">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Properties</h3>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => onEdit?.(data)}
                                className="h-8 text-[11px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 px-4 rounded-xl gap-2 transition-all"
                            >
                                <Edit3 className="h-3.5 w-3.5" /> Edit
                            </Button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                <div className="text-[11px] text-muted-foreground font-black uppercase tracking-widest">Company / Brand</div>
                                <div className="text-sm font-bold text-slate-900">{data.parentCompany || data.company || "N/A"}</div>
                            </div>
                            {data.peerBrand && (
                                <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                    <div className="text-[11px] text-muted-foreground font-black uppercase tracking-widest">Peer Brand</div>
                                    <div className="text-sm font-bold text-slate-900">{data.peerBrand}</div>
                                </div>
                            )}
                            <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                <div className="text-[11px] text-muted-foreground font-black uppercase tracking-widest">Job Title</div>
                                <div className="text-sm font-bold text-slate-900">{data.jobTitle || "N/A"}</div>
                            </div>
                            <Separator className="bg-border/30" />
                            {data.speciality && (
                                <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                    <div className="text-[11px] text-muted-foreground font-black uppercase tracking-widest">Speciality</div>
                                    <div className="text-sm font-bold text-slate-900">{data.speciality}</div>
                                </div>
                            )}
                            {data.country && (
                                <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                    <div className="text-[11px] text-muted-foreground font-black uppercase tracking-widest">Country</div>
                                    <div className="text-sm font-bold text-slate-900">{data.country}</div>
                                </div>
                            )}
                            {data.fitLevel && (
                                <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                    <div className="text-[11px] text-muted-foreground font-black uppercase tracking-widest">Fit Level</div>
                                    <div>
                                        <Badge className={cn("rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest border-none shadow-sm text-white",
                                            data.fitLevel === "High" ? "bg-green-500" : data.fitLevel === "Low" ? "bg-red-500" : "bg-yellow-500")}>
                                            {data.fitLevel}
                                        </Badge>
                                    </div>
                                </div>
                            )}
                            {data.productMatchRate && (
                                <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                    <div className="text-[11px] text-muted-foreground font-black uppercase tracking-widest">Match Rate</div>
                                    <div className="text-sm font-bold text-primary">{data.productMatchRate}</div>
                                </div>
                            )}
                            {data.visualPresence && (
                                <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                    <div className="text-[11px] text-muted-foreground font-black uppercase tracking-widest">Visual Presence</div>
                                    <div className="text-sm font-bold text-slate-900">{data.visualPresence}</div>
                                </div>
                            )}
                            {data.decisionMaker && (
                                <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                    <div className="text-[11px] text-muted-foreground font-black uppercase tracking-widest">Decision Maker</div>
                                    <div className="text-sm font-bold text-slate-900">{data.decisionMaker}</div>
                                </div>
                            )}
                            {data.leadBy && (
                                <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                    <div className="text-[11px] text-muted-foreground font-black uppercase tracking-widest">Lead By</div>
                                    <div className="text-sm font-bold text-slate-900">{data.leadBy}</div>
                                </div>
                            )}
                            {(data.status || data.serviceInterest) && (
                                <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                    <div className="text-[11px] text-muted-foreground font-black uppercase tracking-widest">Status / Stage</div>
                                    <div>
                                        <Badge className="rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border-none shadow-sm">
                                            {data.status || data.serviceInterest}
                                        </Badge>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contact Info Card */}
                    <div className="bg-white rounded-[2rem] border border-border/50 shadow-sm overflow-hidden transition-all hover:shadow-md">
                        <div className="px-6 py-4 border-b border-border/50 bg-primary/[0.02]">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Contact Details</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4 group">
                                <div className="h-10 w-10 rounded-2xl bg-blue-500/5 flex items-center justify-center text-blue-600 transition-all group-hover:bg-blue-500/10 scale-110">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Email Address</span>
                                    {data.email ? 
                                        <a href={`mailto:${data.email}`} className="text-sm font-bold text-primary hover:underline">{data.email}</a> 
                                        : <span className="text-sm font-bold text-slate-400 italic">No email provided</span>}
                                </div>
                            </div>
                            <Separator className="bg-border/30" />
                            <div className="flex items-center gap-4 group">
                                <div className="h-10 w-10 rounded-2xl bg-green-500/5 flex items-center justify-center text-green-600 transition-all group-hover:bg-green-500/10 scale-110">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Phone Number</span>
                                    <span className="text-sm font-bold text-slate-900">{data.phone || <span className="text-slate-400 italic">No phone provided</span>}</span>
                                </div>
                            </div>
                            <Separator className="bg-border/30" />
                            <div className="flex items-center gap-4 group">
                                <div className="h-10 w-10 rounded-2xl bg-purple-500/5 flex items-center justify-center text-purple-600 transition-all group-hover:bg-purple-500/10 scale-110">
                                    <Globe className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Company Website</span>
                                    {data.websiteLink || data.website ? 
                                        <a href={data.websiteLink || data.website} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-primary hover:underline">
                                            {data.websiteLink || data.website}
                                        </a> 
                                        : <span className="text-sm font-bold text-slate-400 italic">No website link</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes Card */}
                    {(data.note || data.message) && (
                        <div className="bg-white rounded-[2rem] border border-border/50 shadow-sm overflow-hidden transition-all hover:shadow-md">
                            <div className="px-6 py-4 border-b border-border/50 bg-primary/[0.02]">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Internal Notes</h3>
                            </div>
                            <div className="p-6">
                                <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-100 relative group/note">
                                    <MessageSquare className="absolute top-5 right-5 h-5 w-5 text-orange-200 transition-all group-hover/note:scale-125 group-hover/note:text-orange-300" />
                                    <p className="text-sm font-bold text-slate-800 leading-relaxed pr-8 italic">
                                        "{data.note || data.message}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Activity Timeline */}
                    <div className="pb-8 pl-1 pt-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 px-1">Recent Activity</h3>
                        <div className="space-y-6 relative ml-3">
                            <div className="absolute left-[-11px] top-2 bottom-2 w-px bg-slate-200"></div>
                            {[
                                { action: "Status updated", time: "2 hours ago", icon: History },
                                { action: "Outreach sent", time: "Yesterday", icon: Mail },
                                { action: "Record created", time: "3 days ago", icon: Calendar },
                            ].map((item, i) => (
                                <div key={i} className="relative flex items-center gap-4">
                                    <div className="absolute left-[-16px] h-2.5 w-2.5 rounded-full bg-white border-2 border-slate-300"></div>
                                    <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-3 flex-1 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <item.icon className="h-3.5 w-3.5 text-slate-400" />
                                            <span className="text-xs font-medium text-slate-700">{item.action}</span>
                                        </div>
                                        <span className="text-[10px] uppercase font-bold text-slate-400">{item.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="shrink-0 p-8 pt-4 border-t border-border/50 bg-white/80 backdrop-blur-md z-20">
                    <SheetFooter className="flex-row gap-4 sm:justify-between items-center">
                        <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl h-14 px-8 font-bold hover:bg-muted/50">Close Details</Button>
                        <Button 
                            onClick={() => {
                                onOpenChange(false)
                                onEdit?.(data)
                            }}
                            className="rounded-2xl h-14 px-12 font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] bg-primary text-white border-none gap-3"
                        >
                            <Edit3 className="h-5 w-5" /> Quick Edit
                        </Button>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    )
}
