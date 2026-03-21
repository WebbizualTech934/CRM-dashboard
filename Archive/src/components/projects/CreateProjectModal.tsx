"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Users, Briefcase, Mail, LayoutDashboard } from "lucide-react"
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={
                (props) => (
                    <Button {...props} className="flex items-center gap-2 rounded-2xl font-bold px-6 h-12 shadow-lg shadow-primary/20">
                        <Plus className="h-5 w-5" /> New Project
                    </Button>
                )
            } />
            <DialogContent className="sm:max-w-[600px] border-none shadow-2xl rounded-[2.5rem] p-0 overflow-hidden bg-white/95 backdrop-blur-xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="p-8 pb-0">
                        <DialogTitle className="text-3xl font-bold tracking-tighter">Create New Project</DialogTitle>
                        <DialogDescription className="text-base font-medium text-muted-foreground">
                            Set up a new lead generation or outreach workspace.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Project Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Automotive Manufacturers USA"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-medium transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Description</Label>
                            <Input
                                id="description"
                                placeholder="What is the goal of this campaign?"
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

                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Default Tables to Create</Label>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { id: "leads", label: "Leads Table", icon: Users },
                                    { id: "manufacturers", label: "Manufacturers", icon: Briefcase },
                                    { id: "outreach", label: "Email Outreach", icon: Mail },
                                    { id: "Creative", label: "Creative", icon: Mail },
                                    { id: "tasks", label: "Task Board", icon: LayoutDashboard },
                                ].map((table) => (
                                    <label key={table.id} className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 hover:bg-primary/5 border border-transparent hover:border-primary/20 cursor-pointer transition-all group">
                                        <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-muted-foreground/30 text-primary focus:ring-primary/20" />
                                        <table.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <span className="text-sm font-bold">{table.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-8 pt-0">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setOpen(false)}
                            className="rounded-2xl h-14 px-8 font-bold hover:bg-muted/50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-2xl h-14 px-8 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isSubmitting ? "Creating..." : "Create Project"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
