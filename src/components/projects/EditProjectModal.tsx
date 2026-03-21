"use client"

import { useState, useEffect } from "react"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Info, Layout, Hash } from "lucide-react"

import { useCRMData, Project } from "@/hooks/use-crm-data"

interface EditProjectModalProps {
    project: Project | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EditProjectModal({ project, open, onOpenChange }: EditProjectModalProps) {
    const { updateProject } = useCRMData()
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        type: "",
        status: ""
    })

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name,
                description: project.description,
                type: project.type,
                status: project.status
            })
        }
    }, [project])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (project) {
            updateProject(project.id, {
                name: formData.name,
                description: formData.description,
                type: formData.type,
                status: formData.status as any
            })
            onOpenChange(false)
        }
    }

    if (!project) return null

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col bg-white border-l border-border/50 shadow-2xl">
                <div className="bg-primary/[0.03] p-8 border-b border-border/50 shrink-0">
                    <SheetHeader>
                        <SheetTitle className="text-3xl font-black tracking-tighter text-primary flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Layout className="h-6 w-6" />
                            </div>
                            Edit Project
                        </SheetTitle>
                        <p className="text-muted-foreground font-medium mt-1">Update the details for "{project.name}".</p>
                    </SheetHeader>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <form id="edit-project-form" onSubmit={handleSubmit} className="space-y-8 pb-10">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                    <Hash className="h-3 w-3" /> Project Name
                                </Label>
                                <Input
                                    id="edit-name"
                                    placeholder="Project Name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="h-14 rounded-2xl border-border/50 bg-muted/20 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all text-lg"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-description" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                    <Info className="h-3 w-3" /> Description
                                </Label>
                                <Input
                                    id="edit-description"
                                    placeholder="Description"
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
                            form="edit-project-form"
                            type="submit"
                            className="rounded-2xl h-14 px-12 font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] bg-[#ff7a59] text-white border-none"
                        >
                            Save Changes
                        </Button>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    )
}
