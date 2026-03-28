"use client"
 
import { EmailModule } from "@/components/emails/EmailModule"
import { useCRMData } from "@/hooks/use-crm-data"
 
export default function EmailsPage() {
    const { isLoaded } = useCRMData()
    if (!isLoaded) return null
 
    return (
        <div className="p-8 space-y-8">
            <div className="flex flex-col">
                <h1 className="text-4xl font-black tracking-tighter text-foreground">Emails Command Center</h1>
                <p className="text-muted-foreground font-medium mt-1">Manage global outreach, campaigns, and templates across all projects.</p>
            </div>
            
            <EmailModule />
        </div>
    )
}
