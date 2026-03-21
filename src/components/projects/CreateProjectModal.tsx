"use client"

import { useState } from "react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetTrigger
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Users, Briefcase, Mail, LayoutDashboard, Palette, Info, Layout } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


import { useCRMData } from "@/hooks/use-crm-data"

export function CreateProjectModal({ children }: { children?: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const { addProject } = useCRMData()
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        type: "lead-gen",
        status: "Active"
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await addProject({
                name: formData.name,
                description: formData.description,
                type: formData.type,
                status: formData.status as any
            })
            setOpen(false)
            setFormData({ name: "", description: "", type: "lead-gen", status: "Active" })
        } catch (error) {
            console.error("Project creation error:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <div onClick={() => setOpen(true)} className="inline-block cursor-pointer">
                {children || (
                    <Button className="flex items-center gap-2 rounded-2xl font-bold px-6 h-12 shadow-lg shadow-primary/20 bg-[#ff7a59] hover:bg-[#ff7a59]/90 text-white border-none transition-all hover:scale-[1.02] active:scale-[0.98]">
                        <Plus className="h-5 w-5" /> New Project
                    </Button>
                )}
            </div>
        <Sheet open={open} onOpenChange={setOpen}>

            <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col bg-white border-l border-border/50 shadow-2xl">
                <div className="bg-primary/[0.03] p-8 border-b border-border/50 shrink-0">
                    <SheetHeader>
                        <SheetTitle className="text-3xl font-black tracking-tighter text-primary flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Layout className="h-6 w-6" />
                            </div>
                            New Project
                        </SheetTitle>
                        <p className="text-muted-foreground font-medium mt-1">Set up a new lead generation or outreach workspace.</p>
                    </SheetHeader>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <form id="project-form" onSubmit={handleSubmit} className="space-y-8 pb-10">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                    <Plus className="h-3 w-3" /> Project Name
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Automotive Manufacturers USA"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="h-14 rounded-2xl border-border/50 bg-muted/20 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all text-lg"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                    <Info className="h-3 w-3" /> Description
                                </Label>
                                <Input
                                    id="description"
                                    placeholder="What is the goal of this campaign?"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="h-14 rounded-2xl border-border/50 bg-muted/20 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Type</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(v: string | null) => v && setFormData({ ...formData, type: v })}
                                    >
                                        <SelectTrigger className="h-14 rounded-2xl border-border/50 bg-muted/20 focus:ring-2 focus:ring-primary/20 font-bold transition-all">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-border/50 shadow-2xl p-2">
                                            <SelectItem value="lead-gen" className="rounded-xl font-bold py-3">Lead Gen</SelectItem>
                                            <SelectItem value="outreach" className="rounded-xl font-bold py-3">Outreach</SelectItem>
                                            <SelectItem value="creative" className="rounded-xl font-bold py-3">Creative</SelectItem>
                                            <SelectItem value="mixed" className="rounded-xl font-bold py-3">Mixed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(v: string | null) => v && setFormData({ ...formData, status: v })}
                                    >
                                        <SelectTrigger className="h-14 rounded-2xl border-border/50 bg-muted/20 focus:ring-2 focus:ring-primary/20 font-bold transition-all">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-border/50 shadow-2xl p-2">
                                            <SelectItem value="Active" className="rounded-xl font-bold py-3">Active</SelectItem>
                                            <SelectItem value="Draft" className="rounded-xl font-bold py-3">Draft</SelectItem>
                                            <SelectItem value="Paused" className="rounded-xl font-bold py-3">Paused</SelectItem>
                                            <SelectItem value="Archived" className="rounded-xl font-bold py-3">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Workspace Modules</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: "leads", label: "Leads", icon: Users },
                                        { id: "manufacturers", label: "Partners", icon: Briefcase },
                                        { id: "outreach", label: "Emails", icon: Mail },
                                        { id: "creative", label: "Creatives", icon: Palette },
                                        { id: "tasks", label: "Tasks", icon: LayoutDashboard },
                                    ].map((table) => (
                                        <label key={table.id} className="flex items-center gap-3 p-4 rounded-2xl bg-muted/20 hover:bg-primary/5 border border-transparent hover:border-primary/20 cursor-pointer transition-all group shadow-sm active:scale-95">
                                            <input type="checkbox" defaultChecked className="h-4 w-4 rounded-lg border-muted-foreground/30 text-primary focus:ring-primary/20" />
                                            <table.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                            <span className="text-[11px] font-black uppercase tracking-tight">{table.label}</span>
                                        </label>
                                    ))}
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
                            onClick={() => setOpen(false)}
                            className="rounded-2xl h-14 px-8 font-bold hover:bg-muted/50"
                        >
                            Cancel
                        </Button>
                        <Button
                            form="project-form"
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-2xl h-14 px-12 font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] bg-[#ff7a59] text-white border-none"
                        >
                            {isSubmitting ? "Creating..." : "Create Project"}
                        </Button>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
        </>
    )
}
