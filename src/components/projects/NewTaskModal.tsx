"use client"

import { useState, useEffect } from "react"
import { Task } from "@/providers/crm-provider"
import { useCRMData } from "@/hooks/use-crm-data"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Layout, Plus, Info, Activity, User, Hash } from "lucide-react"
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
    task?: Task | null
}

export function NewTaskModal({ open, onOpenChange, projectId, task }: NewTaskModalProps) {
    const { addTask, updateTask, teamMembers } = useCRMData()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [priority, setPriority] = useState<"Low" | "Medium" | "High" | "Urgent">("Medium")
    const [assignedTo, setAssignedTo] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (task) {
            setTitle(task.title || "")
            setDescription(task.description || "")
            setPriority(task.priority || "Medium")
            setAssignedTo(task.assignedTo || null)
        } else {
            setTitle("")
            setDescription("")
            setPriority("Medium")
            setAssignedTo(null)
        }
    }, [task, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            if (task) {
                await updateTask(task.id, {
                    title,
                    description,
                    priority,
                    assignedTo: assignedTo || undefined,
                })
            } else {
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
            }

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
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col bg-white border-l border-border/50 shadow-2xl">
                <form id="new-task-form" onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
                    <div className="bg-primary/[0.03] p-8 border-b border-border/50 shrink-0">
                        <SheetHeader>
                            <SheetTitle className="text-3xl font-black tracking-tighter text-primary flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Layout className="h-6 w-6" />
                                </div>
                                {task ? "Edit Task" : "New Task"}
                            </SheetTitle>
                            <p className="text-muted-foreground font-medium mt-1">
                                {task ? "Update the details of your existing task." : "Create a new task for this project."}
                            </p>
                        </SheetHeader>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <div className="space-y-8 pb-10">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <Hash className="h-3 w-3" /> Task Title
                                    </Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="What needs to be done?"
                                        className="h-14 rounded-2xl border-border/50 bg-muted/20 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all text-lg"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                        <Info className="h-3 w-3" /> Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Add more details..."
                                        className="min-h-[120px] rounded-2xl border-border/50 bg-muted/20 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold resize-none transition-all p-4"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                            <Activity className="h-3 w-3" /> Priority
                                        </Label>
                                        <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                                            <SelectTrigger className="h-14 rounded-2xl border-border/50 bg-muted/20 focus:ring-2 focus:ring-primary/20 font-bold transition-all">
                                                <SelectValue placeholder="Priority" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-border/50 shadow-2xl p-2">
                                                <SelectItem value="Low" className="rounded-xl font-bold py-3">Low</SelectItem>
                                                <SelectItem value="Medium" className="rounded-xl font-bold py-3">Medium</SelectItem>
                                                <SelectItem value="High" className="rounded-xl font-bold py-3">High</SelectItem>
                                                <SelectItem value="Urgent" className="rounded-xl font-bold py-3 text-red-600">Urgent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                            <User className="h-3 w-3" /> Assignee
                                        </Label>
                                        <Select value={assignedTo || ""} onValueChange={(v) => setAssignedTo(v)}>
                                            <SelectTrigger className="h-14 rounded-2xl border-border/50 bg-muted/20 focus:ring-2 focus:ring-primary/20 font-bold transition-all">
                                                <SelectValue placeholder="Select member" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-border/50 shadow-2xl p-2">
                                                {teamMembers.map(member => (
                                                    <SelectItem key={member.id} value={member.id} className="rounded-xl font-bold py-3">{member.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0 p-8 pt-4 border-t border-border/50 bg-white/80 backdrop-blur-md">
                        <SheetFooter className="sm:justify-between items-center gap-4">
                            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl h-14 px-8 font-bold hover:bg-muted/50">
                                Cancel
                            </Button>
                            <Button
                                form="new-task-form"
                                type="submit"
                                disabled={isSubmitting}
                                className="rounded-2xl h-14 px-12 font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] bg-[#ff7a59] text-white border-none"
                            >
                                {isSubmitting ? (task ? "Saving..." : "Creating...") : (task ? "Save Changes" : "Create Task")}
                            </Button>
                        </SheetFooter>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    )
}
