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
      {/* Production Level: Hide technical connection alerts for a cleaner demo experience */}
      {/* connectionError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 rounded-3xl p-6 flex flex-col gap-2">
          ...
        </div>
      ) */}

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
