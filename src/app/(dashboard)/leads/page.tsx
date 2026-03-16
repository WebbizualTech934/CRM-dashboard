"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LeadsTable } from "@/components/tables/LeadsTable"
import { ManufacturersTable } from "@/components/tables/ManufacturersTable"
import { OutreachTable } from "@/components/tables/OutreachTable"
import { CreativeTable } from "@/components/tables/CreativeTable"
import { Users, Briefcase, Mail, Palette } from "lucide-react"
import { useCRMData } from "@/hooks/use-crm-data"

export default function LeadsPage() {
    const { isLoaded } = useCRMData()

    if (!isLoaded) return null

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold tracking-tighter text-foreground">Global Database</h1>
                    <p className="text-muted-foreground font-medium mt-1">
                        Manage all leads, manufacturers, outreach, and creative assets across all projects.
                    </p>
                </div>
            </div>

            <Tabs defaultValue="leads" className="space-y-10">
                <TabsList className="bg-card/50 backdrop-blur-sm border border-border/50 p-2 rounded-2xl h-auto min-h-16 gap-2 flex-wrap justify-start w-full">
                    {[
                        { value: "leads", label: "All Leads", icon: Users },
                        { value: "manufacturers", label: "Manufacturers", icon: Briefcase },
                        { value: "outreach", label: "Outreach Campaigns", icon: Mail },
                        { value: "creative", label: "Creative Assets", icon: Palette },
                    ].map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="rounded-xl px-6 h-12 font-bold text-xs gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all"
                        >
                            <tab.icon className="h-4 w-4" /> {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="leads" className="mt-6">
                    <LeadsTable />
                </TabsContent>
                
                <TabsContent value="manufacturers" className="mt-6">
                    <ManufacturersTable />
                </TabsContent>
                
                <TabsContent value="outreach" className="mt-6">
                    <OutreachTable />
                </TabsContent>

                <TabsContent value="creative" className="mt-6">
                    <CreativeTable />
                </TabsContent>
            </Tabs>
        </div>
    )
}
