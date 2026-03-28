"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
    Plus, 
    Trash2, 
    MessageSquare, 
    Mail, 
    Clock, 
    GripVertical,
    CheckCircle2,
    Settings2,
    Save
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface SequenceStep {
    id: string
    type: 'Connection' | 'Message' | 'InMail' | 'Wait'
    content: string
    delayDays: number
}

export function LinkedinSequenceBuilder() {
    const [steps, setSteps] = useState<SequenceStep[]>([
        { id: '1', type: 'Connection', content: "Hi {{name}}, I noticed your work at {{company}} and would love to connect!", delayDays: 0 },
        { id: '2', type: 'Wait', content: "Wait for 2 days", delayDays: 2 },
        { id: '3', type: 'Message', content: "Thanks for connecting! I'd love to chat more about your strategy.", delayDays: 3 }
    ])

    const addStep = (type: SequenceStep['type']) => {
        const newStep: SequenceStep = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            content: type === 'Wait' ? "Wait duration" : "Step content",
            delayDays: type === 'Wait' ? 1 : 0
        }
        setSteps([...steps, newStep])
    }

    const removeStep = (id: string) => {
        setSteps(steps.filter(s => s.id !== id))
    }

    const updateStep = (id: string, updates: Partial<SequenceStep>) => {
        setSteps(steps.map(s => s.id === id ? { ...s, ...updates } : s))
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter text-foreground">Sequence Builder</h2>
                    <p className="text-muted-foreground font-medium mt-1">Orchestrate automated multi-step outreach flows.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" className="rounded-2xl h-12 px-6 font-bold hover:bg-muted/50 transition-all">Discard Changes</Button>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest rounded-2xl h-12 px-10 gap-2 shadow-xl shadow-primary/20 border-none transition-all hover:scale-[1.05]">
                        <Save className="h-5 w-5" /> Save Sequence
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Steps List */}
                <div className="lg:col-span-2 space-y-6 relative">
                    {steps.map((step, idx) => (
                        <div key={step.id} className="relative group">
                            {/* Step Connector */}
                            {idx < steps.length - 1 && (
                                <div className="absolute left-[39px] top-full h-6 w-[2px] bg-primary/10" />
                            )}

                            <Card className={cn(
                                "bg-card/50 backdrop-blur-xl border-none shadow-xl rounded-[2.5rem] overflow-hidden transition-all group-hover:shadow-2xl group-hover:shadow-primary/5",
                                step.type === 'Wait' ? "border-dashed border-2 border-primary/20" : ""
                            )}>
                                <CardContent className="p-8 flex items-start gap-8">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="h-10 w-10 shrink-0 rounded-2xl bg-white shadow-sm border border-border/50 flex items-center justify-center font-black text-slate-400 text-xs">
                                            {idx + 1}
                                        </div>
                                        <GripVertical className="h-5 w-5 text-muted-foreground/20 cursor-grab active:cursor-grabbing" />
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-2xl flex items-center justify-center shadow-lg shadow-black/5",
                                                    step.type === 'Connection' ? "bg-blue-500 text-white" :
                                                    step.type === 'Message' ? "bg-indigo-500 text-white" :
                                                    step.type === 'Wait' ? "bg-slate-200 text-slate-600 shadow-none border border-border/50" :
                                                    "bg-purple-500 text-white"
                                                )}>
                                                    {step.type === 'Connection' ? <Plus className="h-5 w-5" /> : 
                                                     step.type === 'Message' ? <MessageSquare className="h-5 w-5" /> :
                                                     step.type === 'Wait' ? <Clock className="h-5 w-5" /> :
                                                     <Mail className="h-5 w-5" />}
                                                </div>
                                                <div>
                                                    <div className="text-xl font-bold tracking-tight">{step.type}</div>
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mt-0.5">
                                                        {step.type === 'Wait' ? `Pause flow for ${step.delayDays} days` : `Step ${idx + 1}: ${step.type} Template`}
                                                    </div>
                                                </div>
                                            </div>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-10 w-10 rounded-xl text-red-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                                onClick={() => removeStep(step.id)}
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        </div>

                                        {step.type === 'Wait' ? (
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1">
                                                    <div className="text-xs font-bold text-muted-foreground mb-2 ml-1">DELAY (DAYS)</div>
                                                    <Input 
                                                        type="number" 
                                                        className="h-14 rounded-2xl bg-muted/20 border-none font-bold text-lg" 
                                                        value={step.delayDays}
                                                        onChange={(e) => updateStep(step.id, { delayDays: parseInt(e.target.value) })}
                                                    />
                                                </div>
                                                <div className="flex-[2] pt-6">
                                                    <Badge variant="outline" className="h-14 w-full rounded-2xl border-dashed border-2 flex items-center justify-center text-xs font-bold text-muted-foreground bg-white/50">
                                                        Flow will pause here
                                                    </Badge>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="text-xs font-bold text-muted-foreground mb-2 ml-1 flex items-center gap-2">
                                                        CONTENT TEMPLATE <Badge className="bg-primary/10 text-primary border-none text-[8px] px-2 py-0.5">DYNAMIC</Badge>
                                                    </div>
                                                    <Textarea 
                                                        className="min-h-[120px] rounded-3xl bg-muted/20 border-none font-medium text-base p-6 resize-none focus:ring-2 focus:ring-primary/20 transition-all"
                                                        placeholder="Write your dynamic template here..."
                                                        value={step.content}
                                                        onChange={(e) => updateStep(step.id, { content: e.target.value })}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {['{{name}}', '{{company}}', '{{job_title}}'].map(tag => (
                                                        <button 
                                                            key={tag}
                                                            className="px-3 py-1.5 rounded-lg bg-white shadow-sm border border-border/50 text-[10px] font-black tracking-widest text-primary hover:bg-primary hover:text-white transition-all"
                                                            onClick={() => updateStep(step.id, { content: step.content + ' ' + tag })}
                                                        >
                                                            {tag}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}

                    <div className="flex items-center justify-center pt-10">
                        <div className="flex gap-4 p-2 rounded-3xl bg-white border border-border/50 shadow-2xl">
                            <Button 
                                onClick={() => addStep('Connection')}
                                className="h-12 px-6 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold gap-2 text-xs transition-all hover:scale-[1.05]"
                            >
                                <Plus className="h-4 w-4" /> Connection
                            </Button>
                            <Button 
                                onClick={() => addStep('Message')}
                                className="h-12 px-6 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold gap-2 text-xs transition-all hover:scale-[1.05]"
                            >
                                <MessageSquare className="h-4 w-4" /> Message
                            </Button>
                            <Button 
                                onClick={() => addStep('Wait')}
                                className="h-12 px-6 rounded-2xl bg-slate-700 hover:bg-slate-800 text-white font-bold gap-2 text-xs transition-all hover:scale-[1.05]"
                            >
                                <Clock className="h-4 w-4" /> Wait Step
                            </Button>
                            <Button 
                                onClick={() => addStep('InMail')}
                                className="h-12 px-6 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white font-bold gap-2 text-xs transition-all hover:scale-[1.05]"
                            >
                                <Mail className="h-4 w-4" /> InMail
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Config */}
                <div className="space-y-10">
                    <Card className="bg-card/50 backdrop-blur-xl border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="p-10 border-b border-border/50 bg-muted/5">
                            <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-3">
                                <Settings2 className="h-5 w-5 text-primary" /> Sequence Config
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 space-y-8">
                            <div className="space-y-3">
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Sequence Name</div>
                                <Input className="h-14 rounded-2xl bg-muted/20 border-none font-bold" placeholder="e.g. Founders Engagement" />
                            </div>
                            <div className="space-y-3">
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Target Persona</div>
                                <Input className="h-14 rounded-2xl bg-muted/20 border-none font-bold" placeholder="e.g. Agency CEO / Founder" />
                            </div>
                            <div className="pt-6 border-t border-border/50">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-sm font-bold">Estimated Duration</div>
                                    <div className="text-sm font-black text-primary">{steps.reduce((acc, s) => acc + (s.delayDays || 0), 0)} Days</div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-bold">Active Leads</div>
                                    <div className="text-sm font-black">0 Leads</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-none shadow-2xl rounded-[2.5rem] overflow-hidden p-10 space-y-6">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <h4 className="text-xl font-bold tracking-tight leading-snug">
                            Ready to activate this sequence?
                        </h4>
                        <p className="text-sm text-muted-foreground font-medium">
                            Once saved, you can assign prospects to this sequence directly from the master lead database.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    )
}
