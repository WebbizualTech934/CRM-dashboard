"use client"

import { useState } from "react"
import { 
    Link as LinkIcon, 
    User, 
    Briefcase, 
    Mail, 
    Star, 
    PlusCircle,
    Info,
    CheckCircle2,
    Target,
    Clock,
    FileText
} from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { LinkedinLead } from "@/providers/crm-provider"
import { cn } from "@/lib/utils"

interface NewLinkedinLeadModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (lead: Omit<LinkedinLead, "id" | "updatedAt" | "dateAdded">) => void
}

export function NewLinkedinLeadModal({ isOpen, onClose, onSubmit }: NewLinkedinLeadModalProps) {
    const [formData, setFormData] = useState({
        companyName: "",
        contactName: "",
        profileUrl: "",
        workEmail: "",
        leadSource: "LinkedIn",
        priority: "Medium" as "High" | "Medium" | "Low",
        status: "Not Contacted" as any,
        notes: "",
        hookAngle: "",
        sentTimeIST: "",
        draftedContent: "",
        inMail: "",
        followUp: ""
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)
        try {
            const result = await onSubmit(formData)
            if (result === null) {
                setError("Failed to save lead. Please check your database connection or SQL schema.")
                return
            }
            onClose()
            setFormData({
                companyName: "",
                contactName: "",
                profileUrl: "",
                workEmail: "",
                leadSource: "LinkedIn",
                priority: "Medium",
                status: "Not Contacted",
                notes: "",
                hookAngle: "",
                sentTimeIST: "",
                draftedContent: "",
                inMail: "",
                followUp: ""
            })
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="right" className="sm:max-w-[540px] p-0 flex flex-col bg-background/95 backdrop-blur-xl border-l border-border/50">
                <SheetHeader className="p-10 border-b border-border/50 bg-muted/5">
                    <SheetTitle className="text-3xl font-black tracking-tighter text-primary flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <PlusCircle className="h-7 w-7" />
                        </div>
                        New Prospect
                    </SheetTitle>
                    <SheetDescription className="text-muted-foreground font-medium mt-2">
                        Engineer a new deal by adding a high-value LinkedIn lead to your database.
                    </SheetDescription>
                    {error && (
                        <div className="mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                    <form id="prospect-form" onSubmit={handleSubmit} className="space-y-10 pb-10">
                        <div className="space-y-8">
                            {/* Personal Info */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label htmlFor="contactName" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <User className="h-3 w-3" /> Prospect Name
                                    </Label>
                                    <Input 
                                        id="contactName"
                                        required
                                        placeholder="e.g. Elon Musk"
                                        className="h-14 rounded-2xl border-border/50 bg-muted/20 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all text-lg"
                                        value={formData.contactName}
                                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="companyName" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <Briefcase className="h-3 w-3" /> Company
                                    </Label>
                                    <Input 
                                        id="companyName"
                                        required
                                        placeholder="e.g. SpaceX"
                                        className="h-14 rounded-2xl border-border/50 bg-muted/20 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all text-lg"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Links */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label htmlFor="profileUrl" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <LinkIcon className="h-3 w-3" /> LinkedIn URL
                                    </Label>
                                    <Input 
                                        id="profileUrl"
                                        placeholder="linkedin.com/in/..."
                                        className="h-14 rounded-2xl border-border/50 bg-muted/20 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all"
                                        value={formData.profileUrl}
                                        onChange={(e) => setFormData({ ...formData, profileUrl: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="workEmail" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <Mail className="h-3 w-3" /> Work Email
                                    </Label>
                                    <Input 
                                        id="workEmail"
                                        type="email"
                                        placeholder="m@example.com"
                                        className="h-14 rounded-2xl border-border/50 bg-muted/20 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all"
                                        value={formData.workEmail}
                                        onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Classification */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Priority</Label>
                                    <Select 
                                        value={formData.priority} 
                                        onValueChange={(v: any) => setFormData({ ...formData, priority: v })}
                                    >
                                        <SelectTrigger className="h-14 rounded-2xl border-border/50 bg-muted/20 focus:ring-2 focus:ring-primary/20 font-bold transition-all">
                                            <div className="flex items-center gap-2">
                                                <Star className={cn(
                                                    "h-4 w-4",
                                                    formData.priority === 'High' ? "fill-primary text-primary" : "text-muted-foreground"
                                                )} />
                                                <SelectValue placeholder="Priority" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-border/50 shadow-2xl p-2">
                                            <SelectItem value="High" className="rounded-xl font-bold py-3">High Priority</SelectItem>
                                            <SelectItem value="Medium" className="rounded-xl font-bold py-3">Medium Priority</SelectItem>
                                            <SelectItem value="Low" className="rounded-xl font-bold py-3">Low Priority</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Initial Status</Label>
                                    <Select 
                                        value={formData.status} 
                                        onValueChange={(v: any) => setFormData({ ...formData, status: v })}
                                    >
                                        <SelectTrigger className="h-14 rounded-2xl border-border/50 bg-muted/20 focus:ring-2 focus:ring-primary/20 font-bold transition-all">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-border/50 shadow-2xl p-2">
                                            <SelectItem value="Not Contacted" className="rounded-xl font-bold py-3">Not Contacted</SelectItem>
                                            <SelectItem value="Connection Sent" className="rounded-xl font-bold py-3">Connection Sent</SelectItem>
                                            <SelectItem value="Accepted" className="rounded-xl font-bold py-3">Accepted</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Outreach Details */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label htmlFor="sentTimeIST" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <Clock className="h-3 w-3" /> Sent Time (IST)
                                    </Label>
                                    <Input 
                                        id="sentTimeIST"
                                        placeholder="e.g. 10:30 AM"
                                        className="h-14 rounded-2xl border-border/50 bg-muted/20 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all"
                                        value={formData.sentTimeIST}
                                        onChange={(e) => setFormData({ ...formData, sentTimeIST: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="draftedContent" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <FileText className="h-3 w-3" /> Drafted Content
                                    </Label>
                                    <Input 
                                        id="draftedContent"
                                        placeholder="Template Name"
                                        className="h-14 rounded-2xl border-border/50 bg-muted/20 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all"
                                        value={formData.draftedContent}
                                        onChange={(e) => setFormData({ ...formData, draftedContent: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label htmlFor="inMail" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <Mail className="h-3 w-3" /> In Mail Status
                                    </Label>
                                    <Input 
                                        id="inMail"
                                        placeholder="Sent / Pending"
                                        className="h-14 rounded-2xl border-border/50 bg-muted/20 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all"
                                        value={formData.inMail}
                                        onChange={(e) => setFormData({ ...formData, inMail: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="followUp" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <Clock className="h-3 w-3" /> Follow Up Status
                                    </Label>
                                    <Input 
                                        id="followUp"
                                        placeholder="Next: Day 3"
                                        className="h-14 rounded-2xl border-border/50 bg-muted/20 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all"
                                        value={formData.followUp}
                                        onChange={(e) => setFormData({ ...formData, followUp: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Strategy */}
                            <div className="space-y-4 pt-4">
                                <div className="flex items-center justify-between ml-1">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                        <Target className="h-3 w-3" /> The Hook Angle
                                    </Label>
                                    <Badge className="bg-primary/10 text-primary border-none font-black text-[8px] px-2 py-0.5 tracking-tighter">STRATEGIC FOCUS</Badge>
                                </div>
                                <div className="relative group">
                                    <Textarea 
                                        placeholder="What's the unique entry point? (e.g., 'Recent post about AI automation in mid-size agencies')"
                                        className="min-h-[140px] rounded-3xl border-border/50 bg-muted/20 focus-within:ring-2 focus-within:ring-primary/20 p-6 text-base font-medium transition-all outline-none resize-none"
                                        value={formData.hookAngle}
                                        onChange={(e) => setFormData({ ...formData, hookAngle: e.target.value })}
                                    />
                                    <CheckCircle2 className="absolute bottom-4 right-4 h-5 w-5 text-primary/20 group-focus-within:text-primary transition-colors" />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <SheetFooter className="p-10 border-t border-border/50 bg-muted/5 sm:justify-between items-center gap-4">
                    <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={onClose} 
                        className="rounded-2xl h-14 px-8 font-bold hover:bg-muted/50 transition-all"
                    >
                        Cancel
                    </Button>
                    <Button 
                        form="prospect-form"
                        type="submit" 
                        disabled={isSubmitting}
                        className="rounded-2xl h-14 px-12 font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] bg-primary text-primary-foreground border-none"
                    >
                        {isSubmitting ? "Engineering..." : "Engineer Deal"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
