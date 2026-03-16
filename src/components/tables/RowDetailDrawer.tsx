"use client"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Mail,
    Phone,
    Globe,
    Calendar,
    User,
    MessageSquare,
    History,
    ExternalLink,
    MoreHorizontal
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RowDetailDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    data: any // This would be typed based on the row data
}

export function RowDetailDrawer({ open, onOpenChange, data }: RowDetailDrawerProps) {
    if (!data) return null

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-[540px] p-0 border-none shadow-2xl bg-white/95 backdrop-blur-xl max-h-screen overflow-hidden flex flex-col">
                <div className="flex flex-col h-full">
                    <SheetHeader className="p-8 pb-6 border-b border-border/50">
                        <div className="flex items-center justify-between mb-4">
                            <Badge variant="outline" className="rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest border-primary/20 bg-primary/5 text-primary">
                                {data.status || data.fitLevel || "Lead"}
                            </Badge>
                            <Button variant="ghost" size="icon" className="rounded-xl">
                                <MoreHorizontal className="h-5 w-5" />
                            </Button>
                        </div>
                        <SheetTitle className="text-3xl font-bold tracking-tighter">
                            {data.parentCompany || data.peerBrand 
                                ? [data.peerBrand, data.parentCompany].filter(Boolean).join(" - ") 
                                : data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : data.company || "Details"}
                        </SheetTitle>
                        <SheetDescription className="text-base font-medium text-muted-foreground">
                            {data.parentCompany 
                                ? `Match: ${data.productMatchRate || 'N/A'} • Visual: ${data.visualPresence || 'N/A'}` 
                                : data.jobTitle ? `${data.jobTitle} @ ${data.company}` : data.company}
                        </SheetDescription>
                    </SheetHeader>

                    <ScrollArea className="flex-1">
                        <div className="p-8 space-y-10">
                            {/* Lead Information */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{data.parentCompany ? 'Manufacturer Info' : 'Lead Information'}</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-muted/30 border border-transparent">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Speciality</div>
                                        <div className="text-sm font-bold">{data.speciality || "N/A"}</div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-muted/30 border border-transparent">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Sub-speciality</div>
                                        <div className="text-sm font-bold">{data.subSpeciality || "N/A"}</div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-muted/30 border border-transparent">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{data.parentCompany ? 'Decision Maker' : 'Company Size'}</div>
                                        <div className="text-sm font-bold">{data.parentCompany ? data.decisionMaker || "N/A" : data.companySize || "N/A"}</div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-muted/30 border border-transparent">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Country</div>
                                        <div className="text-sm font-bold">{data.country || "N/A"}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Contact Information</h3>
                                <div className="grid gap-4">
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-transparent group hover:border-primary/20 transition-all">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{data.parentCompany ? 'Website' : 'Work Email'}</div>
                                            <div className="text-sm font-bold">{data.parentCompany ? data.website || "N/A" : data.email || "N/A"}</div>
                                        </div>
                                    </div>
                                    {data.phone && (
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-transparent group hover:border-primary/20 transition-all">
                                            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                                                <Phone className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Phone</div>
                                                <div className="text-sm font-bold">{data.phone}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Service Interest / Fit */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{data.parentCompany ? 'Fit Level' : 'Service Interest'}</h3>
                                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                    <div className="text-sm font-bold text-primary">{data.parentCompany ? data.fitLevel || "Not specified" : data.serviceInterest || "No specific interest mentioned"}</div>
                                </div>
                            </div>

                            {/* Message / Requirements */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{data.parentCompany ? 'Note' : 'Message / Requirements'}</h3>
                                <div className="p-6 rounded-2xl bg-muted/30 border border-transparent italic text-sm leading-relaxed">
                                    "{data.note || data.message || "No message provided."}"
                                </div>
                            </div>

                            <Separator className="bg-border/50" />

                            {/* Activity Log */}
                            <div className="space-y-4 pb-8">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Activity History</h3>
                                <div className="space-y-6 relative ml-4">
                                    <div className="absolute left-[-17px] top-2 bottom-2 w-px bg-border/50"></div>
                                    {[
                                        { action: "Status changed to Interested", time: "2 hours ago", icon: History },
                                        { action: "Email outreach sent", time: "Yesterday", icon: Mail },
                                        { action: "Lead created", time: "3 days ago", icon: Calendar },
                                    ].map((item, i) => (
                                        <div key={i} className="relative flex items-center gap-4">
                                            <div className="absolute left-[-21px] h-2 w-2 rounded-full bg-primary shadow-[0_0_0_4px_rgba(var(--primary),0.1)]"></div>
                                            <div className="space-y-1">
                                                <div className="text-xs font-bold">{item.action}</div>
                                                <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{item.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ScrollArea>

                    <div className="p-8 border-t border-border/50 bg-muted/10">
                        <Button className="w-full h-14 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                            Send Email Outreach
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
