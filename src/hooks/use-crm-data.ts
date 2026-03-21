"use client"

import { useCRM } from "@/providers/crm-provider"
export type { Project, Lead, TeamMember, Manufacturer, Task, Campaign, EmailTemplate, EmailSequence, EmailMessage, CreativeAsset, Tag, CustomSchema, CustomRecord, CustomColumnDef, MemberPermissions } from "@/providers/crm-provider"
export { DEFAULT_PERMISSIONS } from "@/providers/crm-provider"

export function useCRMData() {
    return useCRM()
}

