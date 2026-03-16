"use client"

import { useCRM } from "@/providers/crm-provider"
export type { Project, Lead, TeamMember, Manufacturer } from "@/providers/crm-provider"

export function useCRMData() {
    return useCRM()
}
