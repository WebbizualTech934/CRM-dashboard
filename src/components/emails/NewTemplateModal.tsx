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
import { Textarea } from "@/components/ui/textarea"
import { FileText, Type, AlignLeft, Info } from "lucide-react"
import { useCRMData } from "@/hooks/use-crm-data"

interface NewTemplateModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    projectId?: string
}

export function NewTemplateModal({ open, onOpenChange, projectId }: NewTemplateModalProps) {
    const { addTemplate } = useCRMData()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        subject: "",
        body: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await addTemplate({
                ...formData,
                projectId: projectId || undefined
            })
            onOpenChange(false)
            setFormData({ name: "", subject: "", body: "" })
        } catch (error) {
            console.error("Error creating template:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const variables = ["firstName", "lastName", "company", "jobTitle", "country"]

    const insertVariable = (variable: string) => {
        setFormData(prev => ({
            ...prev,
            body: prev.body + `{{${variable}}}`
        }))
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col bg-white border-l border-border/50 shadow-2xl">
                <div className="bg-primary/[0.03] p-8 border-b border-border/50 shrink-0">
                    <SheetHeader>
                        <SheetTitle className="text-3xl font-black tracking-tighter text-primary flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <FileText className="h-6 w-6" />
                            </div>
                            New Template
                        </SheetTitle>
                        <p className="text-muted-foreground font-medium mt-1">Create a reusable template for your outreach campaigns.</p>
                    </SheetHeader>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <form id="template-form" onSubmit={handleSubmit} className="space-y-8 pb-10">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                    <Type className="h-3 w-3" /> Template Name
                                </Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Initial Outreach - Marketing"
                                    className="h-14 rounded-2xl border-border/50 bg-muted/20 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                    <AlignLeft className="h-3 w-3" /> Email Subject
                                </Label>
                                <Input
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    placeholder="e.g. Quick question for {{firstName}}"
                                    className="h-14 rounded-2xl border-border/50 bg-muted/20 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between mb-2 px-1">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                                        <AlignLeft className="h-3 w-3" /> Email Body
                                    </Label>
                                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                        {variables.map(v => (
                                            <button
                                                key={v}
                                                type="button"
                                                onClick={() => insertVariable(v)}
                                                className="px-3 py-1.5 rounded-xl bg-primary/5 hover:bg-primary/10 text-[10px] font-bold text-primary transition-all border border-primary/10 whitespace-nowrap shadow-sm active:scale-95"
                                            >
                                                {`{{${v}}}`}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <Textarea
                                    value={formData.body}
                                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                                    placeholder="Write your email content here..."
                                    className="min-h-[300px] rounded-3xl border-border/50 bg-muted/20 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold resize-none p-6 transition-all text-base leading-relaxed"
                                    required
                                />
                                <div className="flex items-start gap-3 mt-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100 italic">
                                    <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                                    <p className="text-[11px] font-bold text-blue-700/70 uppercase tracking-tighter leading-tight">
                                        Variables will be automatically replaced with lead data during campaign execution. Use the chips above to insert them.
                                    </p>
                                </div>
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
                            form="template-form"
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-2xl h-14 px-12 font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] bg-primary text-white border-none"
                        >
                            {isSubmitting ? "Saving..." : "Save Template"}
                        </Button>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    )
}
