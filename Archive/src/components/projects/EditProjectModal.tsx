"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] border-none shadow-2xl rounded-[2.5rem] p-0 overflow-hidden bg-white/95 backdrop-blur-xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="p-8 pb-0">
                        <DialogTitle className="text-3xl font-bold tracking-tighter">Edit Project</DialogTitle>
                        <DialogDescription className="text-base font-medium text-muted-foreground">
                            Update the details for "{project.name}".
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-8 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Project Name</Label>
                            <Input
                                id="edit-name"
                                placeholder="Project Name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-medium transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-description" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Description</Label>
                            <Input
                                id="edit-description"
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-medium transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Project Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(v: string | null) => v && setFormData({ ...formData, type: v })}
                                >
                                    <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none focus:ring-2 focus:ring-primary/20 font-medium transition-all">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-xl">
                                        <SelectItem value="lead-gen" className="rounded-xl font-bold">Lead Generation</SelectItem>
                                        <SelectItem value="outreach" className="rounded-xl font-bold">Email Outreach</SelectItem>
                                        <SelectItem value="creative" className="rounded-xl font-bold">Creative Tracking</SelectItem>
                                        <SelectItem value="mixed" className="rounded-xl font-bold">Mixed CRM</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(v: string | null) => v && setFormData({ ...formData, status: v })}
                                >
                                    <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none focus:ring-2 focus:ring-primary/20 font-medium transition-all">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-xl">
                                        <SelectItem value="Active" className="rounded-xl font-bold">Active</SelectItem>
                                        <SelectItem value="Draft" className="rounded-xl font-bold">Draft</SelectItem>
                                        <SelectItem value="Paused" className="rounded-xl font-bold">Paused</SelectItem>
                                        <SelectItem value="Archived" className="rounded-xl font-bold">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-8 pt-0">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="rounded-2xl h-14 px-8 font-bold hover:bg-muted/50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="rounded-2xl h-14 px-8 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
