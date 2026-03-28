"use client"

import { useState, useMemo } from "react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useCRMData } from "@/hooks/use-crm-data"
import { cn } from "@/lib/utils"
import {
    Mail,
    User,
    Hash,
    Users,
    Activity,
    ArrowRight,
    ArrowLeft,
    Check,
    Search,
    ListTree,
    Settings,
    Rocket,
    Clock,
    Globe,
    Plus
} from "lucide-react"

interface NewCampaignModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    projectId: string
}

type Step = "setup" | "leads" | "sequence" | "settings" | "launch"

export function NewCampaignModal({ open, onOpenChange, projectId }: NewCampaignModalProps) {
    const { addCampaign, leads, tags, addTag, isLoaded } = useCRMData()
    const [step, setStep] = useState<Step>("setup")

    // Step 1: Setup
    const [name, setName] = useState("")
    const [campaignType, setCampaignType] = useState("Cold Outreach")
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [newTagName, setNewTagName] = useState("")

    // Step 2: Leads
    const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([])
    const [leadSearch, setLeadSearch] = useState("")

    // Step 3: Sequence (Simplified for now)
    const [subject, setSubject] = useState("")
    const [body, setBody] = useState("")

    // Step 4: Settings
    const [dailyLimit, setDailyLimit] = useState("50")
    const [timezone, setTimezone] = useState("UTC")
    const [startTime, setStartTime] = useState("09:00")
    const [endTime, setEndTime] = useState("17:00")

    const projectLeads = useMemo(() =>
        leads.filter(l => l.projectId === projectId && l.email),
        [leads, projectId]
    )

    const filteredLeads = useMemo(() =>
        projectLeads.filter(l =>
            l.company.toLowerCase().includes(leadSearch.toLowerCase()) ||
            l.firstName.toLowerCase().includes(leadSearch.toLowerCase()) ||
            l.lastName.toLowerCase().includes(leadSearch.toLowerCase())
        ),
        [projectLeads, leadSearch]
    )

    const handleAddTag = async () => {
        if (newTagName.trim()) {
            const tag = await addTag({ name: newTagName, color: "bg-primary" })
            if (tag) {
                setSelectedTags(prev => [...prev, tag.id])
                setNewTagName("")
            }
        }
    }

    const toggleTag = (tagId: string) => {
        setSelectedTags(prev =>
            prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
        )
    }

    const handleSubmit = async () => {
        await addCampaign({
            projectId,
            name,
            subject,
            status: "Active",
            leadsCount: selectedLeadIds.length,
            recipients: selectedLeadIds.length,
            emailsSent: 0,
            opens: 0,
            replies: 0,
            positives: 0,
            bounces: 0,
            meetings: 0,
            owner: "Admin", // Default
            lastActivity: new Date().toISOString(),
            tags: selectedTags
        })
        onOpenChange(false)
        resetForm()
    }

    const resetForm = () => {
        setStep("setup")
        setName("")
        setCampaignType("Cold Outreach")
        setSelectedLeadIds([])
        setSubject("")
        setBody("")
        setDailyLimit("50")
    }

    const steps = [
        { id: "setup", label: "Setup", icon: Hash },
        { id: "leads", label: "Leads", icon: Users },
        { id: "sequence", label: "Sequence", icon: ListTree },
        { id: "settings", label: "Settings", icon: Settings },
        { id: "launch", label: "Launch", icon: Rocket },
    ]

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right">
                <SheetHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div>
                                <SheetTitle className="text-3xl font-black tracking-tighter text-primary">
                                    New Campaign
                                </SheetTitle>
                                <div className="flex items-center gap-1.5 mt-2">
                                    {steps.map((s, i) => (
                                        <div key={s.id} className="flex items-center gap-1.5">
                                            <div className={cn(
                                                "text-[9px] font-black uppercase tracking-widest transition-all px-2 py-0.5 rounded-full border",
                                                step === s.id 
                                                    ? "text-primary border-primary bg-primary/5 shadow-sm" 
                                                    : "text-muted-foreground/40 border-transparent"
                                            )}>
                                                {s.label}
                                            </div>
                                            {i < steps.length - 1 && <div className="h-[2px] w-3 bg-muted/30 rounded-full" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {step === "setup" && (
                        <div className="space-y-10 max-w-lg mx-auto py-10">
                            <div className="text-center space-y-3">
                                <h2 className="text-4xl font-black tracking-tighter text-slate-900">Campaign Setup</h2>
                                <p className="text-muted-foreground font-medium text-lg">Give your campaign a name and select its purpose.</p>
                            </div>
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <Hash className="h-3 w-3" /> Campaign Name
                                    </Label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Q4 Growth Sequence"
                                        className="h-14 rounded-2xl border-border/50 bg-muted/20 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold text-xl transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <Activity className="h-3 w-3" /> Campaign Type
                                    </Label>
                                    <Select value={campaignType} onValueChange={(val) => setCampaignType(val || "")}>
                                        <SelectTrigger className="h-14 rounded-2xl border-border/50 bg-muted/20 focus:ring-2 focus:ring-primary/20 font-bold text-lg transition-all">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-border/50 shadow-2xl p-2">
                                            <SelectItem value="Cold Outreach" className="rounded-xl font-bold py-4">Cold Outreach</SelectItem>
                                            <SelectItem value="Follow-up" className="rounded-xl font-bold py-4">Follow-up</SelectItem>
                                            <SelectItem value="Re-engagement" className="rounded-xl font-bold py-4">Re-engagement</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <Hash className="h-3 w-3" /> Campaign Tags
                                    </Label>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {tags.map(tag => (
                                            <Badge
                                                key={tag.id}
                                                variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                                                className={cn(
                                                    "rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all border-none ring-1 ring-inset",
                                                    selectedTags.includes(tag.id) 
                                                        ? "bg-primary text-white shadow-lg shadow-primary/20 ring-primary" 
                                                        : "bg-muted/30 text-muted-foreground ring-border/50 hover:bg-muted/50"
                                                )}
                                                onClick={() => toggleTag(tag.id)}
                                            >
                                                {tag.name}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Input
                                                value={newTagName}
                                                onChange={(e) => setNewTagName(e.target.value)}
                                                placeholder="Create new tag..."
                                                className="h-12 pl-4 pr-12 rounded-2xl border-border/50 bg-muted/20 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold text-sm transition-all"
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                            />
                                            <Button 
                                                type="button" 
                                                onClick={handleAddTag}
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-1 top-1 h-10 w-10 rounded-xl hover:bg-primary/10 text-primary p-0"
                                            >
                                                <Plus className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === "leads" && (
                        <div className="space-y-8 h-full flex flex-col pt-4">
                            <div className="flex flex-row items-center justify-between shrink-0 px-2">
                                <div>
                                    <h2 className="text-3xl font-black tracking-tighter text-slate-900">Select Leads</h2>
                                    <p className="text-sm text-primary font-black uppercase tracking-[0.2em] mt-1 opacity-70">
                                        {projectLeads.length} leads in this project
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="relative group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            value={leadSearch}
                                            onChange={(e) => setLeadSearch(e.target.value)}
                                            placeholder="Search leads..."
                                            className="h-12 w-72 pl-12 rounded-2xl border-border/50 bg-muted/20 font-bold focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                                        />
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() => setSelectedLeadIds(projectLeads.map(l => l.id))}
                                        className="h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] px-6 border-primary/20 text-primary hover:bg-primary/5"
                                    >
                                        Select All
                                    </Button>
                                </div>
                            </div>

                            <div className="flex-1 min-h-[400px] border border-border/50 rounded-[2.5rem] bg-muted/5 overflow-hidden flex flex-col shadow-inner">
                                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                                    {filteredLeads.map(lead => (
                                        <div
                                            key={lead.id}
                                            onClick={() => setSelectedLeadIds(prev =>
                                                prev.includes(lead.id) ? prev.filter(id => id !== lead.id) : [...prev, lead.id]
                                            )}
                                            className={cn(
                                                "flex items-center justify-between p-5 rounded-3xl cursor-pointer transition-all border shrink-0",
                                                selectedLeadIds.includes(lead.id) 
                                                    ? "bg-white border-primary/30 shadow-lg shadow-primary/5 translate-x-1" 
                                                    : "bg-transparent border-transparent hover:bg-white/50 hover:translate-x-1"
                                            )}
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className={cn(
                                                    "h-6 w-6 rounded-xl border-2 flex items-center justify-center transition-all",
                                                    selectedLeadIds.includes(lead.id) 
                                                        ? "bg-primary border-primary text-white scale-110 shadow-md shadow-primary/20" 
                                                        : "border-muted-foreground/20 bg-white shadow-sm"
                                                )}>
                                                    {selectedLeadIds.includes(lead.id) && <Check className="h-4 w-4 stroke-[4]" />}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="font-black text-slate-900 leading-none">{lead.firstName} {lead.lastName}</div>
                                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em]">{lead.company}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right hidden sm:block">
                                                    <div className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">{lead.jobTitle}</div>
                                                </div>
                                                <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest h-7 rounded-xl px-3 border-border/50 bg-white text-muted-foreground shadow-sm">
                                                    {lead.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                    {filteredLeads.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-32 text-muted-foreground/30">
                                            <Users className="h-16 w-16 opacity-10 mb-4" />
                                            <p className="font-black uppercase tracking-widest text-xs">No leads found</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-between shrink-0 p-4 bg-muted/10 rounded-[2rem] mx-2 mb-2 border border-border/50">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">{selectedLeadIds.length} leads selected</span>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">{projectLeads.length - selectedLeadIds.length} hidden</span>
                            </div>
                        </div>
                    )}

                    {step === "sequence" && (
                        <div className="space-y-10 max-w-2xl mx-auto py-8">
                            <div className="text-center space-y-3">
                                <h2 className="text-4xl font-black tracking-tighter text-slate-900">Sequence Draft</h2>
                                <p className="text-muted-foreground font-medium text-lg">Define the initial message for this campaign.</p>
                            </div>
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <Mail className="h-3 w-3" /> Subject Line
                                    </Label>
                                    <Input
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="e.g. Quick question regarding {{company}}"
                                        className="h-14 rounded-2xl border-border/50 bg-muted/20 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold text-lg transition-all"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-1">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                                            <ListTree className="h-3 w-3" /> Email Body
                                        </Label>
                                        <div className="flex gap-2">
                                            {['firstName', 'company', 'industry'].map(tag => (
                                                <button
                                                    key={tag}
                                                    type="button"
                                                    onClick={() => setBody(prev => prev + ` {{${tag}}}`)}
                                                    className="px-3 py-1.5 rounded-xl bg-primary/5 hover:bg-primary/10 text-[10px] font-black text-primary transition-all border border-primary/10 shadow-sm active:scale-95"
                                                >
                                                    + {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <textarea
                                        value={body}
                                        onChange={(e) => setBody(e.target.value)}
                                        className="w-full h-80 p-8 rounded-[2.5rem] border border-border/50 bg-muted/20 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-base leading-relaxed resize-none shadow-inner"
                                        placeholder="Type your message here..."
                                    />
                                    <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 italic">
                                        <p className="text-[11px] font-bold text-blue-700/70 uppercase tracking-tighter leading-tight flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                            Variables will be personalized for each lead automatically.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === "settings" && (
                        <div className="space-y-10 max-w-lg mx-auto py-10">
                            <div className="text-center space-y-3">
                                <h2 className="text-4xl font-black tracking-tighter text-slate-900">Pacing Settings</h2>
                                <p className="text-muted-foreground font-medium text-lg">Control delivery frequency and timing.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <Activity className="h-3 w-3" /> Daily Limit
                                    </Label>
                                    <Input
                                        type="number"
                                        value={dailyLimit}
                                        onChange={(e) => setDailyLimit(e.target.value)}
                                        className="h-14 rounded-2xl border-border/50 bg-muted/20 font-black text-xl transition-all text-center"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <Globe className="h-3 w-3" /> Timezone
                                    </Label>
                                    <Select value={timezone} onValueChange={(val) => setTimezone(val || "")}>
                                        <SelectTrigger className="h-14 rounded-2xl border-border/50 bg-muted/20 font-bold transition-all">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-border/50 shadow-2xl p-2">
                                            <SelectItem value="UTC" className="rounded-xl font-bold py-3">UTC (London)</SelectItem>
                                            <SelectItem value="EST" className="rounded-xl font-bold py-3">EST (New York)</SelectItem>
                                            <SelectItem value="PST" className="rounded-xl font-bold py-3">PST (San Francisco)</SelectItem>
                                            <SelectItem value="IST" className="rounded-xl font-bold py-3">IST (Bangalore)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <Clock className="h-3 w-3" /> Sending Window
                                    </Label>
                                    <div className="grid grid-cols-2 gap-3 pb-1 pt-1 mb-1">
                                        <Input
                                            type="time"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            className="h-14 rounded-2xl border-border/50 bg-muted/20 font-bold transition-all text-center px-2"
                                        />
                                        <Input
                                            type="time"
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                            className="h-14 rounded-2xl border-border/50 bg-muted/20 font-bold transition-all text-center px-2"
                                        />
                                    </div>
                                    <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest text-center mt-2">Active Window Hours</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === "launch" && (
                        <div className="space-y-10 max-w-lg mx-auto py-10 flex flex-col items-center text-center">
                            <div className="h-32 w-32 rounded-[3.5rem] bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-xl shadow-primary/10 border-4 border-white">
                                <Rocket className="h-16 w-16" />
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-4xl font-black tracking-tighter text-slate-900">Ready to Go?</h2>
                                <p className="text-muted-foreground font-medium text-lg italic uppercase tracking-widest text-xs opacity-60">Final verification step</p>
                            </div>

                            <div className="w-full bg-primary/[0.03] rounded-[3rem] p-10 border border-primary/10 space-y-6 shadow-sm">
                                <div className="flex justify-between items-center text-sm border-b border-primary/5 pb-4">
                                    <span className="font-black text-muted-foreground uppercase tracking-[0.2em] text-[10px]">Campaign</span>
                                    <span className="font-black text-primary text-lg">{name}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-b border-primary/5 pb-4">
                                    <span className="font-black text-muted-foreground uppercase tracking-[0.2em] text-[10px]">Targeting</span>
                                    <span className="font-black text-slate-900">{selectedLeadIds.length} verified leads</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-b border-primary/5 pb-4">
                                    <span className="font-black text-muted-foreground uppercase tracking-[0.2em] text-[10px]">Content</span>
                                    <span className="font-black text-slate-900">1 personalized sequence</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-black text-muted-foreground uppercase tracking-[0.2em] text-[10px]">Velocity</span>
                                    <span className="font-black text-slate-900">{dailyLimit} contacts / day</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <SheetFooter className="flex items-center justify-between border-t border-border/50">
                    <Button
                        variant="ghost"
                        onClick={() => {
                            if (step === "launch") setStep("settings")
                            else if (step === "settings") setStep("sequence")
                            else if (step === "sequence") setStep("leads")
                            else if (step === "leads") setStep("setup")
                        }}
                        disabled={step === "setup"}
                        className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-[11px] gap-3 text-muted-foreground hover:bg-muted/50 hover:text-slate-900 disabled:opacity-30 transition-all border border-transparent hover:border-border/50"
                    >
                        <ArrowLeft className="h-4 w-4" /> Previous
                    </Button>

                    {step !== "launch" ? (
                        <Button
                            onClick={() => {
                                if (step === "setup") setStep("leads")
                                else if (step === "leads") setStep("sequence")
                                else if (step === "sequence") setStep("settings")
                                else if (step === "settings") setStep("launch")
                            }}
                            disabled={step === "setup" && !name}
                            className="rounded-2xl h-14 px-10 font-black uppercase tracking-widest text-[11px] gap-3 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] border-none"
                        >
                            Next Module <ArrowRight className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            className="rounded-2xl h-14 px-12 bg-primary text-white hover:bg-primary/90 font-black uppercase tracking-widest text-[11px] gap-3 shadow-xl shadow-primary/20 transition-all hover:scale-[1.05] active:scale-[0.95] border-none"
                        >
                            Confirm & Deploy <Rocket className="h-4 w-4" />
                        </Button>
                    )}
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
