"use client"

import { useState, useEffect } from "react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Palette, Check } from "lucide-react"
import { useCRMData } from "@/hooks/use-crm-data"

import { CreativeAsset } from "@/providers/crm-provider"

interface NewCreativeModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    projectId?: string
    asset?: CreativeAsset | null
}

export function NewCreativeModal({ open, onOpenChange, projectId, asset }: NewCreativeModalProps) {
    const { addCreativeAsset, updateCreativeAsset } = useCRMData()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        companyName: "",
        website: "",
        productLink: "",
        product: "",
        scriptStatus: "Pending",
        storyboardStatus: "Pending",
        animationPlan: "Pending",
        wireframeDesignStatus: "Pending",
        websiteStatus: "Pending",
        animationStatus: "Pending",
        deadlineForDelivery: "",
        timeDuration: "",
        scriptAnimationPlanDriveLink: "",
        animationDriveLink: "",
        figmaLink: "",
        animationHostedLink: "",
        mockWebsiteLink: "",
        projectProposalLink: ""
    })

    useEffect(() => {
        if (asset) {
            setFormData({
                companyName: asset.companyName || "",
                website: asset.website || "",
                productLink: asset.productLink || "",
                product: asset.product || "",
                scriptStatus: asset.scriptStatus || "Pending",
                storyboardStatus: asset.storyboardStatus || "Pending",
                animationPlan: asset.animationPlan || "Pending",
                wireframeDesignStatus: asset.wireframeDesignStatus || "Pending",
                websiteStatus: asset.websiteStatus || "Pending",
                animationStatus: asset.animationStatus || "Pending",
                deadlineForDelivery: asset.deadlineForDelivery || "",
                timeDuration: asset.timeDuration || "",
                scriptAnimationPlanDriveLink: asset.scriptAnimationPlanDriveLink || "",
                animationDriveLink: asset.animationDriveLink || "",
                figmaLink: asset.figmaLink || "",
                animationHostedLink: asset.animationHostedLink || "",
                mockWebsiteLink: asset.mockWebsiteLink || "",
                projectProposalLink: asset.projectProposalLink || ""
            })
        }
    }, [asset, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            if (asset) {
                await updateCreativeAsset(asset.id, {
                    ...formData
                })
            } else {
                await addCreativeAsset({
                    projectId: projectId || "1",
                    ...formData,
                })
            }

            onOpenChange(false)
            setFormData({
                companyName: "",
                website: "",
                productLink: "",
                product: "",
                scriptStatus: "Pending",
                storyboardStatus: "Pending",
                animationPlan: "Pending",
                wireframeDesignStatus: "Pending",
                websiteStatus: "Pending",
                animationStatus: "Pending",
                deadlineForDelivery: "",
                timeDuration: "",
                scriptAnimationPlanDriveLink: "",
                animationDriveLink: "",
                figmaLink: "",
                animationHostedLink: "",
                mockWebsiteLink: "",
                projectProposalLink: ""
            })
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle className="text-3xl font-black tracking-tighter text-primary flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Palette className="h-6 w-6" />
                        </div>
                        {asset ? "Edit Creative Asset" : "New Creative Asset"}
                    </SheetTitle>
                    <SheetDescription className="text-muted-foreground font-medium mt-1">
                        Define project scope, production tracking, and resource links.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <form id="creative-form" onSubmit={handleSubmit} className="space-y-10 pb-10">
                        {/* Section 1: Basic Information */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-primary">Basic Information</h4>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Company Name</Label>
                                    <Input
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        className="h-12 rounded-2xl border-border/50 bg-muted/20 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Website</Label>
                                    <Input
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        placeholder="e.g. acme.com"
                                        className="h-12 rounded-2xl border-border/50 bg-muted/20 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Product Name</Label>
                                    <Input
                                        value={formData.product}
                                        onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                                        className="h-10 rounded-md border-slate-200 bg-white shadow-sm font-semibold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Product Link</Label>
                                    <Input
                                        value={formData.productLink}
                                        onChange={(e) => setFormData({ ...formData, productLink: e.target.value })}
                                        className="h-10 rounded-md border-slate-200 bg-white shadow-sm font-semibold"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Production Tracking */}
                        <div className="space-y-4 pt-6 border-t border-slate-200">
                            <h4 className="text-xs font-black uppercase tracking-widest text-primary">Production Tracking</h4>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Script Status</Label>
                                    <Select value={formData.scriptStatus} onValueChange={(val: any) => setFormData({ ...formData, scriptStatus: val || "Pending" })}>
                                        <SelectTrigger className="h-10 bg-white font-semibold text-xs border-slate-200 shadow-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Story board</Label>
                                    <Select value={formData.storyboardStatus} onValueChange={(val: any) => setFormData({ ...formData, storyboardStatus: val || "Pending" })}>
                                        <SelectTrigger className="h-10 bg-white font-semibold text-xs border-slate-200 shadow-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Animation Plan</Label>
                                    <Select value={formData.animationPlan} onValueChange={(val: any) => setFormData({ ...formData, animationPlan: val || "Pending" })}>
                                        <SelectTrigger className="h-10 bg-white font-semibold text-xs border-slate-200 shadow-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Drafting">Drafting</SelectItem>
                                            <SelectItem value="Finalized">Finalized</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Wireframe/Design</Label>
                                    <Select value={formData.wireframeDesignStatus} onValueChange={(val: any) => setFormData({ ...formData, wireframeDesignStatus: val || "Pending" })}>
                                        <SelectTrigger className="h-10 bg-white font-semibold text-xs border-slate-200 shadow-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Designing">Designing</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Website Status</Label>
                                    <Select value={formData.websiteStatus} onValueChange={(val: any) => setFormData({ ...formData, websiteStatus: val || "Pending" })}>
                                        <SelectTrigger className="h-10 bg-white font-semibold text-xs border-slate-200 shadow-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Development">Development</SelectItem>
                                            <SelectItem value="Live Website">Live Website</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Animation Status</Label>
                                    <Select value={formData.animationStatus} onValueChange={(val: any) => setFormData({ ...formData, animationStatus: val || "Pending" })}>
                                        <SelectTrigger className="h-10 bg-white font-semibold text-xs border-slate-200 shadow-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Rendering">Rendering</SelectItem>
                                            <SelectItem value="Completed Animation">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Delivery Details */}
                        <div className="space-y-4 pt-6 border-t border-slate-200">
                            <h4 className="text-xs font-black uppercase tracking-widest text-primary">Delivery Details</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Delivery Deadline</Label>
                                    <Input
                                        type="date"
                                        value={formData.deadlineForDelivery}
                                        onChange={(e) => setFormData({ ...formData, deadlineForDelivery: e.target.value })}
                                        className="h-10 rounded-md border-slate-200 bg-white shadow-sm font-semibold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Time Duration</Label>
                                    <Input
                                        value={formData.timeDuration}
                                        onChange={(e) => setFormData({ ...formData, timeDuration: e.target.value })}
                                        placeholder="e.g. 60s"
                                        className="h-10 rounded-md border-slate-200 bg-white shadow-sm font-semibold"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Resource Links */}
                        <div className="space-y-4 pt-6 border-t border-slate-200">
                            <h4 className="text-xs font-black uppercase tracking-widest text-primary">Resource Links</h4>
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Script/Plan Drive Link</Label>
                                        <Input
                                            value={formData.scriptAnimationPlanDriveLink}
                                            onChange={(e) => setFormData({ ...formData, scriptAnimationPlanDriveLink: e.target.value })}
                                            className="h-10 rounded-md border-slate-200 bg-white shadow-sm text-xs"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Animation Drive Link</Label>
                                        <Input
                                            value={formData.animationDriveLink}
                                            onChange={(e) => setFormData({ ...formData, animationDriveLink: e.target.value })}
                                            className="h-10 rounded-md border-slate-200 bg-white shadow-sm text-xs"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Figma Link</Label>
                                        <Input
                                            value={formData.figmaLink}
                                            onChange={(e) => setFormData({ ...formData, figmaLink: e.target.value })}
                                            className="h-10 rounded-md border-slate-200 bg-white shadow-sm text-xs"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Project Proposal Link</Label>
                                        <Input
                                            value={formData.projectProposalLink}
                                            onChange={(e) => setFormData({ ...formData, projectProposalLink: e.target.value })}
                                            className="h-10 rounded-md border-slate-200 bg-white shadow-sm text-xs"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Live/Hosted Animation Link</Label>
                                        <Input
                                            value={formData.animationHostedLink}
                                            onChange={(e) => setFormData({ ...formData, animationHostedLink: e.target.value })}
                                            className="h-10 rounded-md border-slate-200 bg-white shadow-sm text-xs"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Mock Website Link</Label>
                                        <Input
                                            value={formData.mockWebsiteLink}
                                            onChange={(e) => setFormData({ ...formData, mockWebsiteLink: e.target.value })}
                                            className="h-10 rounded-md border-slate-200 bg-white shadow-sm text-xs"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <SheetFooter>
                    <Button
                        form="creative-form"
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-2xl h-14 font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] bg-primary text-white border-none"
                    >
                        {isSubmitting ? (asset ? "Saving Asset..." : "Creating Asset...") : (asset ? "Save Changes" : "Add to Creative Table")}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
