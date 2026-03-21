"use client"

import { useState, useEffect } from "react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useCRMData } from "@/hooks/use-crm-data"
import { cn } from "@/lib/utils"
import { Building2, Globe, Tag, Activity, MapPin, MessageSquare, Calendar, Star } from "lucide-react"
import { Manufacturer } from "@/providers/crm-provider"

interface EditManufacturerModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    manufacturer: Manufacturer | null
}

export function EditManufacturerModal({ open, onOpenChange, manufacturer }: EditManufacturerModalProps) {
    const { updateManufacturer } = useCRMData()
    const [formData, setFormData] = useState<Partial<Manufacturer>>({})

    useEffect(() => {
        if (manufacturer) {
            // Ensure nulls from database are handled as empty strings or undefined
            const sanitizedData = Object.entries(manufacturer).reduce((acc, [key, value]) => ({
                ...acc,
                [key]: value === null ? "" : value
            }), {} as Partial<Manufacturer>)
            setFormData(sanitizedData)
        }
    }, [manufacturer])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (manufacturer && formData) {
            updateManufacturer(manufacturer.id, formData)
            onOpenChange(false)
        }
    }

    if (!manufacturer) return null

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col bg-white border-l border-border/50 shadow-2xl">
                <form id="edit-manufacturer-form" onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
                    <div className="bg-primary/[0.03] p-8 border-b border-border/50 shrink-0">
                        <SheetHeader>
                            <SheetTitle className="text-3xl font-black tracking-tighter text-primary flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Building2 className="h-6 w-6" />
                                </div>
                                Edit Manufacturer
                            </SheetTitle>
                            <SheetDescription className="text-muted-foreground font-medium mt-1">
                                Update manufacturer profile and matching details.
                            </SheetDescription>
                        </SheetHeader>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                    <Building2 className="h-3 w-3" /> Parent Company
                                </Label>
                                <Input
                                    value={formData.parentCompany || ""}
                                    onChange={(e) => setFormData({ ...formData, parentCompany: e.target.value })}
                                    placeholder="e.g. Acme Corp"
                                    className="h-12 rounded-2xl bg-muted/20 border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                    <Star className="h-3 w-3" /> Peer Brand
                                </Label>
                                <Input
                                    value={formData.peerBrand || ""}
                                    onChange={(e) => setFormData({ ...formData, peerBrand: e.target.value })}
                                    placeholder="e.g. Nike"
                                    className="h-12 rounded-2xl bg-muted/20 border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                    <Globe className="h-3 w-3" /> Website
                                </Label>
                                <Input
                                    value={formData.website || ""}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    placeholder="www.manufacturer.com"
                                    className="h-12 rounded-2xl bg-muted/20 border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                    <Activity className="h-3 w-3" /> Product Match Rate
                                </Label>
                                <Input
                                    value={formData.productMatchRate || ""}
                                    onChange={(e) => setFormData({ ...formData, productMatchRate: e.target.value })}
                                    placeholder="e.g. 85%"
                                    className="h-12 rounded-2xl bg-muted/20 border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                    <MapPin className="h-3 w-3" /> Country
                                </Label>
                                <Input
                                    value={formData.country || ""}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    placeholder="e.g. China"
                                    className="h-12 rounded-2xl bg-muted/20 border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                    <Tag className="h-3 w-3" /> Fit Level
                                </Label>
                                <Select
                                    value={formData.fitLevel || "Medium"}
                                    onValueChange={(val) => setFormData({ ...formData, fitLevel: val || undefined })}

                                >
                                    <SelectTrigger className="h-12 rounded-2xl bg-muted/20 border-border/50 focus:ring-2 focus:ring-primary/20 font-bold transition-all">
                                        <SelectValue placeholder="Select fit level" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-border/50 shadow-2xl p-2">
                                        <SelectItem value="High" className="rounded-xl font-bold py-3 text-green-600">High</SelectItem>
                                        <SelectItem value="Medium" className="rounded-xl font-bold py-3 text-orange-600">Medium</SelectItem>
                                        <SelectItem value="Low" className="rounded-xl font-bold py-3 text-red-600">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                    <Calendar className="h-3 w-3" /> Date Added
                                </Label>
                                <Input
                                    type="date"
                                    value={formData.date || ""}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="h-12 rounded-2xl bg-muted/20 border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                    <MessageSquare className="h-3 w-3" /> Decision Maker
                                </Label>
                                <Input
                                    value={formData.decisionMaker || ""}
                                    onChange={(e) => setFormData({ ...formData, decisionMaker: e.target.value })}
                                    placeholder="Contact Person"
                                    className="h-12 rounded-2xl bg-muted/20 border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <MessageSquare className="h-3 w-3" /> Notes
                            </Label>
                            <Textarea
                                value={formData.note || ""}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                placeholder="Additional manufacturer details..."
                                className="min-h-[100px] rounded-2xl bg-muted/20 border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold resize-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="shrink-0 p-8 pt-4 border-t border-border/50 bg-white/80 backdrop-blur-md">
                        <SheetFooter className="flex-row gap-4 sm:justify-between items-center">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                className="rounded-2xl h-14 px-8 font-bold hover:bg-muted/50"
                            >
                                Cancel
                            </Button>
                            <Button
                                form="edit-manufacturer-form"
                                type="submit"
                                className="rounded-2xl h-14 px-12 font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] bg-[#ff7a59] text-white border-none"
                            >
                                Save Changes
                            </Button>
                        </SheetFooter>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    )
}
