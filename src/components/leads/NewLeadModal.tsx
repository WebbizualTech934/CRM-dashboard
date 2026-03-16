"use client"

import { useState } from "react"
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

interface NewLeadModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    projectId?: string
    type?: "leads" | "manufacturers"
}

export function NewLeadModal({ open, onOpenChange, projectId: initialProjectId, type = "leads" }: NewLeadModalProps) {
    const { addLead, addManufacturer, projects, teamMembers, manufacturers } = useCRMData() as any
    const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId || "")
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        jobTitle: "",
        speciality: "",
        subSpeciality: "",
        companySize: "",
        country: "",
        serviceInterest: "",
        message: "",
        phone: "",
        website: "",
        websiteLink: "",
        status: "New",
        priority: "Medium",
        assignedTo: "Admin",
        // Manufacturer specific fields
        date: new Date().toISOString().split('T')[0],
        parentCompany: "",
        peerBrand: "",
        productMatchRate: "",
        fitLevel: "Medium",
        linkedin: "",
        visualPresence: "Medium",
        note: "",
        decisionMaker: "",
        leadBy: "",
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        
        try {
            if (type === "manufacturers") {
                await addManufacturer({
                    date: formData.date || new Date().toISOString().split('T')[0],
                    parentCompany: formData.parentCompany || formData.company,
                    peerBrand: formData.peerBrand || formData.speciality,
                    productMatchRate: formData.productMatchRate,
                    website: formData.websiteLink || formData.website,
                    companySize: formData.companySize,
                    country: formData.country,
                    fitLevel: formData.fitLevel,
                    linkedin: formData.linkedin,
                    visualPresence: formData.visualPresence,
                    note: formData.note || formData.message,
                    decisionMaker: formData.decisionMaker,
                    leadBy: formData.leadBy,
                    projectId: selectedProjectId || undefined
                })
            } else {
                await addLead({
                    ...formData,
                    projectId: selectedProjectId || undefined
                })
            }
            
            onOpenChange(false)
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                company: "",
                jobTitle: "",
                speciality: "",
                subSpeciality: "",
                companySize: "",
                country: "",
                serviceInterest: "",
                message: "",
                phone: "",
                website: "",
                websiteLink: "",
                status: "New",
                priority: "Medium",
                assignedTo: "Admin",
                date: new Date().toISOString().split('T')[0],
                parentCompany: "",
                peerBrand: "",
                productMatchRate: "",
                fitLevel: "Medium",
                linkedin: "",
                visualPresence: "Medium",
                note: "",
                decisionMaker: "",
                leadBy: ""
            })
        } catch (error) {
            console.error("Submission error:", error)
        } finally {
            setIsSubmitting(false)
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

    const LeadStageDropdown = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
        const stages = [
            { label: "Cold", color: "bg-blue-300" },
            { label: "Warm", color: "bg-orange-400" },
            { label: "Hot", color: "bg-red-500" },
            { label: "Not Interested", color: "bg-slate-500" },
        ]

        return (
            <Select value={value} onValueChange={(val) => onChange(val || "Cold")}>
                <SelectTrigger className="h-12 rounded-2xl border-border/50 bg-muted/30 focus:ring-primary/20 font-bold transition-all hover:bg-muted/50 group">
                    <div className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full", stages.find(s => s.label === value)?.color || "bg-blue-300")}></div>
                        <SelectValue placeholder="Select lead stage" />
                    </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-border/50 shadow-2xl p-2">
                    {stages.map((s) => (
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-background/80 backdrop-blur-xl max-h-[90vh] overflow-y-auto no-scrollbar">
                <div className="bg-primary/5 p-8 border-b border-primary/10 sticky top-0 z-10 backdrop-blur-md">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black tracking-tighter text-primary flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center text-white">
                                {type === "manufacturers" ? <Briefcase className="h-6 w-6" /> : <User className="h-6 w-6" />}
                            </div>
                            {type === "manufacturers" ? "Add New Manufacturer" : "Create New Lead"}
                        </DialogTitle>
                        <p className="text-muted-foreground font-medium mt-1">
                            {type === "manufacturers" ? "Add a new manufacturer to your database." : "Generate a high-quality marketing lead for your project."}
                        </p>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {type === "manufacturers" ? (
                        <>
                            {!initialProjectId && (
                                <div className="space-y-2 mb-6">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <Briefcase className="h-3 w-3" /> Assign to Project
                                    </Label>
                                    <Select
                                        value={selectedProjectId || "none"}
                                        onValueChange={(val) => setSelectedProjectId(val === "none" ? "" : (val || ""))}
                                    >
                                        <SelectTrigger className="h-12 w-full rounded-2xl border-border/50 bg-muted/30 focus:ring-primary/20 font-bold">
                                            <SelectValue placeholder="Select a project (optional)" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-border/50 shadow-2xl p-2">
                                            <SelectItem value="none" className="rounded-xl font-bold py-3"><span className="text-muted-foreground">No Project</span></SelectItem>
                                            {projects?.map((p: any) => (
                                                <SelectItem key={p.id} value={p.id} className="rounded-xl font-bold py-3">
                                                    {p.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <Building2 className="h-3 w-3" /> Parent Company
                                    </Label>
                                    <Input
                                        list="parent-companies"
                                        value={formData.parentCompany}
                                        onChange={(e) => setFormData({ ...formData, parentCompany: e.target.value })}
                                        placeholder="e.g. Acme Corp"
                                        className="h-12 rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold"
                                        required
                                    />
                                    <datalist id="parent-companies">
                                        {Array.from(new Set(manufacturers?.map((m: any) => m.parentCompany).filter(Boolean))).map((pc: any) => (
                                            <option key={pc} value={pc} />
                                        ))}
                                    </datalist>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <Tag className="h-3 w-3" /> Peer Brand
                                    </Label>
                                    <Input
                                        value={formData.peerBrand}
                                        onChange={(e) => setFormData({ ...formData, peerBrand: e.target.value })}
                                        placeholder="e.g. Acme Premium"
                                        className="h-12 rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <LinkIcon className="h-3 w-3" /> Product Link / Website
                                    </Label>
                                    <Input
                                        value={formData.websiteLink}
                                        onChange={(e) => setFormData({ ...formData, websiteLink: e.target.value })}
                                        placeholder="e.g. example.com"
                                        className="h-12 rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <User className="h-3 w-3" /> LinkedIn
                                    </Label>
                                    <Input
                                        value={formData.linkedin}
                                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                        placeholder="linkedin.com/company/..."
                                        className="h-12 rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <MapPin className="h-3 w-3" /> Country
                                    </Label>
                                    <Input
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        placeholder="e.g. USA"
                                        className="h-12 rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <Briefcase className="h-3 w-3" /> Company Size
                                    </Label>
                                    <Select
                                        value={formData.companySize}
                                        onValueChange={(val) => setFormData({ ...formData, companySize: val || "" })}
                                    >
                                        <SelectTrigger className="h-12 rounded-2xl border-border/50 bg-muted/30 focus:ring-primary/20 font-bold">
                                            <SelectValue placeholder="Select size" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-border/50 shadow-2xl p-2">
                                            <SelectItem value="1-10" className="rounded-xl font-bold py-2">1-10 employees</SelectItem>
                                            <SelectItem value="11-50" className="rounded-xl font-bold py-2">11-50 employees</SelectItem>
                                            <SelectItem value="51-200" className="rounded-xl font-bold py-2">51-200 employees</SelectItem>
                                            <SelectItem value="201-500" className="rounded-xl font-bold py-2">201-500 employees</SelectItem>
                                            <SelectItem value="501-1000" className="rounded-xl font-bold py-2">501-1000 employees</SelectItem>
                                            <SelectItem value="1000+" className="rounded-xl font-bold py-2">1000+ employees</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <Activity className="h-3 w-3" /> Fit Level
                                    </Label>
                                    <Select
                                        value={formData.fitLevel}
                                        onValueChange={(val) => setFormData({ ...formData, fitLevel: val || "Medium" })}
                                    >
                                        <SelectTrigger className="h-12 rounded-2xl border-border/50 bg-muted/30 focus:ring-primary/20 font-bold">
                                            <div className="flex items-center gap-2">
                                                <div className={cn("h-2 w-2 rounded-full", formData.fitLevel === "High" ? "bg-green-500" : formData.fitLevel === "Low" ? "bg-red-500" : "bg-yellow-500")}></div>
                                                <SelectValue placeholder="Select fit" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-border/50 shadow-2xl p-2">
                                            <SelectItem value="High" className="rounded-xl font-bold py-3"><div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-green-500"></div>High Fit</div></SelectItem>
                                            <SelectItem value="Medium" className="rounded-xl font-bold py-3"><div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-yellow-500"></div>Medium Fit</div></SelectItem>
                                            <SelectItem value="Low" className="rounded-xl font-bold py-3"><div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-red-500"></div>Low Fit</div></SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <Activity className="h-3 w-3" /> Product Match Rate
                                    </Label>
                                    <Select
                                        value={formData.productMatchRate}
                                        onValueChange={(val) => setFormData({ ...formData, productMatchRate: val || "" })}
                                    >
                                        <SelectTrigger className="h-12 rounded-2xl border-border/50 bg-muted/30 focus:ring-primary/20 font-bold">
                                            <SelectValue placeholder="Select match rate" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-border/50 shadow-2xl p-2">
                                            <SelectItem value="< 25%" className="rounded-xl font-bold py-2">&lt; 25%</SelectItem>
                                            <SelectItem value="25% - 50%" className="rounded-xl font-bold py-2">25% - 50%</SelectItem>
                                            <SelectItem value="50% - 75%" className="rounded-xl font-bold py-2">50% - 75%</SelectItem>
                                            <SelectItem value="75% - 100%" className="rounded-xl font-bold py-2">75% - 100%</SelectItem>
                                            <SelectItem value="100%" className="rounded-xl font-bold py-2">100% Match</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <User className="h-3 w-3" /> Decision Maker
                                    </Label>
                                    <Input
                                        value={formData.decisionMaker}
                                        onChange={(e) => setFormData({ ...formData, decisionMaker: e.target.value })}
                                        placeholder="e.g. John Doe, CEO"
                                        className="h-12 rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <Activity className="h-3 w-3" /> Visual Presence
                                    </Label>
                                    <Select
                                        value={formData.visualPresence}
                                        onValueChange={(val) => setFormData({ ...formData, visualPresence: val || "Medium" })}
                                    >
                                        <SelectTrigger className="h-12 rounded-2xl border-border/50 bg-muted/30 focus:ring-primary/20 font-bold">
                                            <SelectValue placeholder="Select rating" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-border/50 shadow-2xl p-2">
                                            <SelectItem value="Excellent" className="rounded-xl font-bold py-2 text-green-600">Excellent</SelectItem>
                                            <SelectItem value="Good" className="rounded-xl font-bold py-2 text-blue-600">Good</SelectItem>
                                            <SelectItem value="Average" className="rounded-xl font-bold py-2 text-yellow-600">Average</SelectItem>
                                            <SelectItem value="Poor" className="rounded-xl font-bold py-2 text-red-600">Poor</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <Users className="h-3 w-3" /> Lead By
                                    </Label>
                                    <Select
                                        value={formData.leadBy}
                                        onValueChange={(val) => setFormData({ ...formData, leadBy: val || "" })}
                                    >
                                        <SelectTrigger className="h-12 rounded-2xl border-border/50 bg-muted/30 focus:ring-primary/20 font-bold">
                                            <SelectValue placeholder="Select team member" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-border/50 shadow-2xl p-2">
                                            {teamMembers?.map((m: any) => (
                                                <SelectItem key={m.id} value={m.name} className="rounded-xl font-bold py-2">
                                                    {m.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <MapPin className="h-3 w-3" /> Date
                                    </Label>
                                    <Input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="h-12 rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                    <MessageSquare className="h-3 w-3" /> Note
                                </Label>
                                <Textarea
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                    placeholder="Add any additional notes here..."
                                    className="min-h-[100px] rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold resize-none"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            {!initialProjectId && (
                                <div className="space-y-2 mb-6">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <Briefcase className="h-3 w-3" /> Assign to Project
                                    </Label>
                                    <Select
                                        value={selectedProjectId || "none"}
                                        onValueChange={(val) => setSelectedProjectId(val === "none" ? "" : (val || ""))}
                                    >
                                        <SelectTrigger className="h-12 w-full rounded-2xl border-border/50 bg-muted/30 focus:ring-primary/20 font-bold">
                                            <SelectValue placeholder="Select a project (optional)" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-border/50 shadow-2xl p-2">
                                            <SelectItem value="none" className="rounded-xl font-bold py-3"><span className="text-muted-foreground">No Project</span></SelectItem>
                                            {projects?.map((p: any) => (
                                                <SelectItem key={p.id} value={p.id} className="rounded-xl font-bold py-3">
                                                    {p.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <User className="h-3 w-3" /> First Name
                            </Label>
                            <Input
                                value={formData.firstName}
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
                                value={formData.lastName}
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
                                value={formData.email}
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
                                value={formData.company}
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
                                value={formData.jobTitle}
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
                                value={formData.websiteLink}
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
                                value={formData.speciality}
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
                                value={formData.subSpeciality}
                                onChange={(e) => setFormData({ ...formData, subSpeciality: e.target.value })}
                                placeholder="e.g. Digital Ads"
                                className="h-12 rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <MapPin className="h-3 w-3" /> Country
                            </Label>
                            <Input
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                placeholder="e.g. USA"
                                className="h-12 rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <Activity className="h-3 w-3" /> Lead Stage
                            </Label>
                            <LeadStageDropdown
                                value={formData.serviceInterest}
                                onChange={(val) => setFormData({ ...formData, serviceInterest: val || "Cold" })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                            <MessageSquare className="h-3 w-3" /> Message / Requirements
                        </Label>
                        <Textarea
                            value={formData.message}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Describe lead requirements..."
                            className="min-h-[100px] rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <Tag className="h-3 w-3" /> Status
                            </Label>
                            <StatusDropdown
                                value={formData.status}
                                onChange={(val) => setFormData({ ...formData, status: val || "New" })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <Activity className="h-3 w-3" /> Priority
                            </Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(val) => setFormData({ ...formData, priority: val || "Medium" })}
                            >
                                <SelectTrigger className="h-12 rounded-2xl border-border/50 bg-muted/30 focus:ring-primary/20 font-bold">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-border/50 shadow-2xl p-2">
                                    <SelectItem value="Low" className="rounded-xl font-bold py-3">Low</SelectItem>
                                    <SelectItem value="Medium" className="rounded-xl font-bold py-3">Medium</SelectItem>
                                    <SelectItem value="High" className="rounded-xl font-bold py-3">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                        </>
                    )}

                    <DialogFooter className="pt-4">
                        <Button type="submit" disabled={isSubmitting} className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 text-sm">
                            {isSubmitting ? "Processing..." : (type === "manufacturers" ? "Add Manufacturer" : "Generate Lead")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
