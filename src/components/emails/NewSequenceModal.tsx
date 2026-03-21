"use client"

import { useState } from "react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ListTree, Plus, Trash2, Clock, Mail, ChevronRight, Settings2 } from "lucide-react"
import { useCRMData } from "@/hooks/use-crm-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface NewSequenceModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    projectId?: string
}

export function NewSequenceModal({ open, onOpenChange, projectId }: NewSequenceModalProps) {
    const { addSequence, templates } = useCRMData()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [name, setName] = useState("")
    const [steps, setSteps] = useState<any[]>([
        { type: "wait", waitDays: 0 },
        { type: "email", templateId: "" }
    ])

    const addStep = () => {
        setSteps([...steps, { type: "wait", waitDays: 1 }, { type: "email", templateId: "" }])
    }

    const removeStep = (index: number) => {
        setSteps(steps.filter((_, i) => i !== index))
    }

    const updateStep = (index: number, updates: any) => {
        setSteps(steps.map((s, i) => i === index ? { ...s, ...updates } : s))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await addSequence({
                name,
                steps,
                projectId: projectId || undefined
            })
            onOpenChange(false)
            setName("")
            setSteps([{ type: "wait", waitDays: 0 }, { type: "email", templateId: "" }])
        } catch (error) {
            console.error("Error creating sequence:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col bg-white border-l border-border/50 shadow-2xl">
                <div className="bg-primary/[0.03] p-8 border-b border-border/50 shrink-0">
                    <SheetHeader>
                        <SheetTitle className="text-3xl font-black tracking-tighter text-primary flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <ListTree className="h-6 w-6" />
                            </div>
                            New Sequence
                        </SheetTitle>
                        <p className="text-muted-foreground font-medium mt-1">Build an automated multi-step outreach flow.</p>
                    </SheetHeader>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <form id="sequence-form" onSubmit={handleSubmit} className="space-y-8 pb-10">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <Settings2 className="h-3 w-3" /> Sequence Name
                            </Label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Cold SaaS Outreach - V1"
                                className="h-14 rounded-2xl border-border/50 bg-muted/20 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold text-lg transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Sequence Steps</Label>
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={addStep} 
                                    className="rounded-xl font-bold text-[10px] uppercase tracking-widest h-9 border-primary/20 text-primary hover:bg-primary/5 px-4"
                                >
                                    <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Step
                                </Button>
                            </div>

                            <div className="space-y-6 relative before:absolute before:left-[23px] before:top-4 before:bottom-4 before:w-px before:bg-border/50 before:border-l before:border-dashed">
                                {steps.map((step, i) => (
                                    <div key={i} className="flex gap-6 relative group transform transition-all hover:translate-x-1">
                                        <div className={cn(
                                            "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 z-10 shadow-lg border-4 border-white",
                                            step.type === "wait" ? "bg-orange-500 text-white shadow-orange-200" : "bg-primary text-white shadow-primary/20"
                                        )}>
                                            {step.type === "wait" ? <Clock className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
                                        </div>
                                        <div className="flex-1 bg-muted/20 rounded-3xl p-6 border border-border/50 group-hover:bg-muted/30 transition-all group-hover:shadow-md group-hover:border-primary/20">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                                                    <span className="h-4 w-4 rounded bg-white flex items-center justify-center text-[9px] font-black shadow-sm text-primary">{i + 1}</span>
                                                    {step.type === "wait" ? "Delay" : "Email Step"}
                                                </div>
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeStep(i)} 
                                                    className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive transition-all hover:bg-destructive/10 opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>

                                            {step.type === "wait" ? (
                                                <div className="flex items-center gap-4">
                                                    <span className="text-sm font-bold text-muted-foreground">Wait for</span>
                                                    <Input
                                                        type="number"
                                                        value={step.waitDays}
                                                        onChange={(e) => updateStep(i, { waitDays: parseInt(e.target.value) || 0 })}
                                                        className="w-24 h-12 rounded-2xl bg-white border-border/50 font-black text-center text-lg focus:ring-2 focus:ring-primary/20"
                                                        min="0"
                                                    />
                                                    <span className="text-sm font-bold text-muted-foreground">days</span>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Email Template</Label>
                                                    <Select
                                                        value={step.templateId}
                                                        onValueChange={(val) => updateStep(i, { templateId: val })}
                                                    >
                                                        <SelectTrigger className="h-12 rounded-2xl bg-white border-border/50 shadow-sm font-bold text-sm focus:ring-2 focus:ring-primary/20">
                                                            <SelectValue placeholder="Choose a template..." />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-2xl border-border/50 shadow-2xl p-2 min-w-[240px]">
                                                            {templates.map((t) => (
                                                                <SelectItem key={t.id} value={t.id} className="rounded-xl font-bold py-3">
                                                                    {t.name}
                                                                </SelectItem>
                                                            ))}
                                                            {templates.length === 0 && (
                                                                <div className="p-8 text-center bg-muted/10 rounded-xl">
                                                                    <Mail className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                                                                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter">No templates found</p>
                                                                </div>
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </form>
                </div>

                <div className="shrink-0 p-8 pt-4 border-t border-border/50 bg-white/80 backdrop-blur-md">
                    <SheetFooter className="sm:justify-between items-center gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="rounded-2xl h-14 px-8 font-bold hover:bg-muted/50"
                        >
                            Cancel
                        </Button>
                        <Button
                            form="sequence-form"
                            type="submit"
                            disabled={isSubmitting || !name || steps.length === 0}
                            className="rounded-2xl h-14 px-12 font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] bg-primary text-white"
                        >
                            {isSubmitting ? "Creating..." : "Launch Sequence"}
                        </Button>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    )
}
