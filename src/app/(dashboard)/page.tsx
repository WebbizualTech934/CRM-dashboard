"use client"

import { StatsCards } from "@/components/dashboard/StatsCards"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { ProjectsPreview } from "@/components/dashboard/ProjectsPreview"
import { CreateProjectModal } from "@/components/projects/CreateProjectModal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

import { useCRMData } from "@/hooks/use-crm-data"
import { AlertCircle, ExternalLink } from "lucide-react"

export default function DashboardPage() {
  const { connectionError } = useCRMData()

  return (
    <div className="space-y-8">
      {connectionError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 rounded-3xl p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <h2 className="font-bold text-lg">Backend Connection Issue</h2>
          </div>
          <div className="mt-2 text-sm font-medium opacity-90">
            {connectionError}. This usually means your Supabase tables haven't been created yet or your environment variables are incorrect.
            <div className="mt-4 flex gap-3">
              <a 
                href="https://supabase.com/dashboard" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-2 bg-white border border-red-200 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
              >
                <ExternalLink className="h-4 w-4" /> Open Supabase
              </a>
              <p className="text-xs self-center">Check `walkthrough.md` for the SQL setup script.</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your projects today.
          </p>
        </div>
        <CreateProjectModal />
      </div>

      <StatsCards />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <ProjectsPreview />
        <RecentActivity />
      </div>
    </div>
  )
}
