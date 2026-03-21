"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useCRMData } from "@/hooks/use-crm-data"
import { cn } from "@/lib/utils"
import { User, Building2, Mail, Phone, Globe, Tag, Activity, Briefcase, MapPin, Users, MessageSquare, Link as LinkIcon } from "lucide-react"
import { Lead } from "@/providers/crm-provider"

interface EditLeadModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    lead: Lead | null
}

export function EditLeadModal({ open, onOpenChange, lead }: EditLeadModalProps) {
    const { updateLead } = useCRMData()
    const [formData, setFormData] = useState<Partial<Lead>>({})

    useEffect(() => {
        if (lead) {
            setFormData(lead)
        }
    }, [lead])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (lead && formData) {
            updateLead(lead.id, formData)
            onOpenChange(false)
        }
    }

    const StatusDropdown = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
        const statuses = [
            { label: "New", color: "bg-blue-500" },
            { label: "Contacted", color: "bg-orange-500" },
            { label: "Interested", color: "bg-green-500" },
            { label: "Not Interested", color: "bg-red-500" },
            { label: "Closed", color: "bg-slate-500" }
        ]

        return (
            <Select value={value} onValueChange={(val) => onChange(val || "New")}>
                <SelectTrigger className="h-12 rounded-2xl border-border/50 bg-muted/30 focus:ring-primary/20 font-bold transition-all hover:bg-muted/50 group">
                    <div className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full", statuses.find(s => s.label === value)?.color)}></div>
                        <SelectValue placeholder="Select status" />
                    </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-border/50 shadow-2xl p-2">
                    {statuses.map((s) => (
                        <SelectItem
                            key={s.label}
                            value={s.label}
                            className="rounded-xl font-bold focus:bg-primary/5 focus:text-primary py-3"
                        >
                            <div className="flex items-center gap-2">
                                <div className={cn("h-2 w-2 rounded-full", s.color)}></div>
                                {s.label}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        )
    }

    if (!lead) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-background/80 backdrop-blur-xl max-h-[90vh] overflow-y-auto no-scrollbar">
                <div className="bg-primary/5 p-8 border-b border-primary/10 sticky top-0 z-10 backdrop-blur-md">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black tracking-tighter text-primary flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center text-white">
                                <User className="h-6 w-6" />
                            </div>
                            Edit Lead Details
                        </DialogTitle>
                        <p className="text-muted-foreground font-medium mt-1">Update lead information and requirements.</p>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <User className="h-3 w-3" /> First Name
                            </Label>
                            <Input
                                value={formData.firstName || ""}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                placeholder="e.g. John"
                                className="h-12 rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <User className="h-3 w-3" /> Last Name
                            </Label>
                            <Input
                                value={formData.lastName || ""}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                placeholder="e.g. Doe"
                                className="h-12 rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <Mail className="h-3 w-3" /> Work Email
                            </Label>
                            <Input
                                type="email"
                                value={formData.email || ""}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="john@acme.com"
                                className="h-12 rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <Building2 className="h-3 w-3" /> Company Name
                            </Label>
                            <Input
                                value={formData.company || ""}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                placeholder="e.g. Acme Corp"
                                className="h-12 rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <Briefcase className="h-3 w-3" /> Job Title
                            </Label>
                            <Input
                                value={formData.jobTitle || ""}
                                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                placeholder="e.g. CEO"
                                className="h-12 rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <LinkIcon className="h-3 w-3" /> Website Link
                            </Label>
                            <Input
                                value={formData.websiteLink || ""}
                                onChange={(e) => setFormData({ ...formData, websiteLink: e.target.value })}
                                placeholder="www.google.com"
                                className="h-12 rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <Tag className="h-3 w-3" /> Speciality
                            </Label>
                            <Input
                                value={formData.speciality || ""}
                                onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
                                placeholder="e.g. Marketing"
                                className="h-12 rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <Tag className="h-3 w-3" /> Sub-speciality
                            </Label>
                            <Input
                                value={formData.subSpeciality || ""}
                                onChange={(e) => setFormData({ ...formData, subSpeciality: e.target.value })}
                                placeholder="e.g. Digital Ads"
                                className="h-12 rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <Users className="h-3 w-3" /> Company Size
                            </Label>
                            <Select
                                value={formData.companySize || ""}
                                onValueChange={(val) => setFormData({ ...formData, companySize: val || "" })}
                            >
                                <SelectTrigger className="h-12 rounded-2xl border-border/50 bg-muted/30 focus:ring-primary/20 font-bold">
                                    <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-border/50 shadow-2xl p-2">
                                    <SelectItem value="1-10" className="rounded-xl font-bold py-3">1-10</SelectItem>
                                    <SelectItem value="11-50" className="rounded-xl font-bold py-3">11-50</SelectItem>
                                    <SelectItem value="51-200" className="rounded-xl font-bold py-3">51-200</SelectItem>
                                    <SelectItem value="201-500" className="rounded-xl font-bold py-3">201-500</SelectItem>
                                    <SelectItem value="500+" className="rounded-xl font-bold py-3">500+</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <MapPin className="h-3 w-3" /> Country
                            </Label>
                            <Input
                                value={formData.country || ""}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                placeholder="e.g. USA"
                                className="h-12 rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <Activity className="h-3 w-3" /> Service Interest
                            </Label>
                            <Input
                                value={formData.serviceInterest || ""}
                                onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                                placeholder="e.g. Consulting"
                                className="h-12 rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <Tag className="h-3 w-3" /> Status
                            </Label>
                            <StatusDropdown
                                value={formData.status || "New"}
                                onChange={(val) => setFormData({ ...formData, status: val || "New" })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                            <MessageSquare className="h-3 w-3" /> Message / Requirements
                        </Label>
                        <Textarea
                            value={formData.message || ""}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Describe lead requirements..."
                            className="min-h-[100px] rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold resize-none"
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="submit" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 text-sm">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
