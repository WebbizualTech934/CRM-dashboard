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
import { Plus, X, Tag as TagIcon, Mail, User, Hash, Users, Activity } from "lucide-react"

interface NewCampaignModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    projectId: string
}

export function NewCampaignModal({ open, onOpenChange, projectId }: NewCampaignModalProps) {
    const { addCampaign, tags, addTag } = useCRMData()
    const [name, setName] = useState("")
    const [subject, setSubject] = useState("")
    const [to, setTo] = useState("")
    const [cc, setCc] = useState("")
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [status, setStatus] = useState<"Sent" | "Draft" | "Completed">("Draft")
    const [recipients, setRecipients] = useState("0")
    const [newTagName, setNewTagName] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await addCampaign({
            projectId,
            name,
            subject,
            to,
            cc,
            tags: selectedTags,
            status,
            recipients: parseInt(recipients) || 0,
            opens: 0,
            replies: 0
        } as any)
        onOpenChange(false)
        resetForm()
    }

    const resetForm = () => {
        setName("")
        setSubject("")
        setTo("")
        setCc("")
        setSelectedTags([])
        setStatus("Draft")
        setRecipients("0")
    }

    const handleAddTag = async () => {
        if (newTagName.trim()) {
            const tag = await addTag({ name: newTagName, color: "bg-primary" })
            if (tag) {
                setSelectedTags([...selectedTags, tag.id])
            }
            setNewTagName("")
        }
    }

    const toggleTag = (tagId: string) => {
        setSelectedTags(prev =>
            prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-background/80 backdrop-blur-xl">
                <div className="bg-primary/5 p-8 border-b border-primary/10">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black tracking-tighter text-primary flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center text-white">
                                <Mail className="h-6 w-6" />
                            </div>
                            New Outreach Campaign
                        </DialogTitle>
                        <p className="text-muted-foreground font-medium mt-1">Configure your email outreach and track performance.</p>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                            <Hash className="h-3 w-3" /> Campaign Name
                        </Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Q1 Partnership Outreach"
                            className="h-12 rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <User className="h-3 w-3" /> To
                            </Label>
                            <Input
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                placeholder="recipient@example.com"
                                className="h-12 rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <Users className="h-3 w-3" /> CC
                            </Label>
                            <Input
                                value={cc}
                                onChange={(e) => setCc(e.target.value)}
                                placeholder="cc@example.com"
                                className="h-12 rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                            <Mail className="h-3 w-3" /> Email Subject
                        </Label>
                        <Input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="e.g. Exciting Opportunity for Automotive Parts"
                            className="h-12 rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold"
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                            <TagIcon className="h-3 w-3" /> Campaign Tags
                        </Label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {tags.map(tag => (
                                <Badge
                                    key={tag.id}
                                    variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                                    className={cn(
                                        "rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all",
                                        selectedTags.includes(tag.id) ? "bg-primary shadow-lg shadow-primary/20" : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted"
                                    )}
                                    onClick={() => toggleTag(tag.id)}
                                >
                                    {tag.name}
                                </Badge>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                                placeholder="Add new tag..."
                                className="h-10 rounded-xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold text-xs"
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                            />
                            <Button type="button" onClick={handleAddTag} size="sm" className="rounded-xl h-10 px-4 font-bold">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <Activity className="h-3 w-3" /> Status
                            </Label>
                            <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                                <SelectTrigger className="h-12 rounded-2xl border-border/50 bg-muted/30 focus:ring-primary/20 font-bold">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-border/50 shadow-2xl p-2">
                                    <SelectItem value="Draft" className="rounded-xl font-bold py-3">Draft</SelectItem>
                                    <SelectItem value="Sent" className="rounded-xl font-bold py-3">Sent</SelectItem>
                                    <SelectItem value="Completed" className="rounded-xl font-bold py-3">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <Users className="h-3 w-3" /> Recipients
                            </Label>
                            <Input
                                type="number"
                                value={recipients}
                                onChange={(e) => setRecipients(e.target.value)}
                                className="h-12 rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold"
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="submit" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 text-sm">
                            Ready to Send
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
