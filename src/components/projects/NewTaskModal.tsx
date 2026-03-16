"use client"

import { useState } from "react"
import { useCRMData } from "@/hooks/use-crm-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface NewTaskModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    projectId: string
}

export function NewTaskModal({ open, onOpenChange, projectId }: NewTaskModalProps) {
    const { addTask, teamMembers } = useCRMData()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [priority, setPriority] = useState<"Low" | "Medium" | "High" | "Urgent">("Medium")
    const [assignedTo, setAssignedTo] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            await addTask({
                projectId,
                title,
                description,
                status: "Todo",
                priority,
                assignedTo: assignedTo || undefined,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            } as any)
            
            setTitle("")
            setDescription("")
            setPriority("Medium")
            setAssignedTo("")
            onOpenChange(false)
        } catch (error) {
            console.error("Error adding task:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-none shadow-2xl p-8">
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-3xl font-black tracking-tighter">Add New Task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Task Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What needs to be done?"
                            className="h-14 rounded-2xl bg-muted/30 border-none focus:ring-2 focus:ring-primary/20 font-medium"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add more details..."
                            className="min-h-[100px] rounded-2xl bg-muted/30 border-none focus:ring-2 focus:ring-primary/20 font-medium p-4"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Priority</Label>
                            <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                                <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none focus:ring-2 focus:ring-primary/20 font-medium">
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border/50">
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Assign To</Label>
                            <Select value={assignedTo} onValueChange={(v) => setAssignedTo(v)}>
                                <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none focus:ring-2 focus:ring-primary/20 font-medium">
                                    <SelectValue placeholder="Select member" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border/50">
                                    {teamMembers.map(member => (
                                        <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="pt-4 gap-3">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl h-14 px-8 font-bold">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="rounded-2xl h-14 px-8 font-bold shadow-xl shadow-primary/20">
                            {isSubmitting ? "Creating..." : "Create Task"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
