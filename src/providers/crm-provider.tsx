"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"


export interface Project {
    id: string
    name: string
    description: string
    leads: number
    status: "Active" | "Paused" | "Draft" | "Archived"
    teamMemberIds: string[]
    updatedAt: string
    type: string
}

export interface Lead {
    id: string
    firstName: string
    lastName: string
    email: string
    company: string
    jobTitle: string
    speciality: string
    subSpeciality: string
    companySize: string
    country: string
    serviceInterest: string
    message: string
    status: string
    priority: string
    assignedTo: string
    lastContact: string
    projectId?: string
    phone?: string
    website?: string
    websiteLink?: string
}

export interface TeamMember {
    id: string
    name: string
    email: string
    role: string
    userRole: 'Admin' | 'Manager' | 'Lead Gen' | 'Designer' | 'Content Writer' | 'Linkedin' | 'Linkedin + Content Writer' | 'CRM'
    status: string
    leadsAdded: number
    emailsSent: number
    avatar?: string
    lastActive?: string
    menuPermissions?: string[]
}

export interface Task {
    id: string
    projectId: string
    title: string
    description?: string
    status: 'Todo' | 'In Progress' | 'Waiting' | 'Review' | 'Completed' | 'Blocked' | 'Cancelled'
    priority: 'Low' | 'Medium' | 'High' | 'Urgent'
    dueDate?: string
    assignedTo?: string
    relatedType?: 'lead' | 'manufacturer' | 'outreach' | 'creative'
    relatedId?: string
    createdBy?: string
    completedAt?: string
    createdAt: string
    updatedAt: string
}

export interface Manufacturer {
    id: string
    date: string
    parentCompany: string
    peerBrand: string
    productMatchRate: string
    website: string
    companySize: string
    country: string
    fitLevel: string
    linkedin: string
    visualPresence: string
    note: string
    decisionMaker: string
    leadBy: string
    projectId?: string
}

export interface Tag {
    id: string
    name: string
    color: string
}

export interface EmailTemplate {
    id: string
    name: string
    subject: string
    body: string
    projectId?: string
    createdAt: string
}

export interface SequenceStep {
    id: string
    templateId: string
    waitDays: number
    order: number
}

export interface EmailSequence {
    id: string
    name: string
    projectId?: string
    steps: SequenceStep[]
    createdAt: string
}

export interface Campaign {
    id: string
    projectId: string
    name: string
    subject: string
    status: "Active" | "Sent" | "Paused" | "Draft" | "Completed"
    leadsCount: number
    recipients: number
    emailsSent: number
    opens: number
    replies: number
    positives: number
    bounces: number
    tags: string[]
    meetings: number
    sequenceId?: string
    owner?: string
    lastActivity?: string
    updatedAt: string
}

export interface EmailMessage {
    id: string
    leadId: string
    campaignId: string
    templateId?: string
    threadId: string
    subject: string
    body: string
    status: "Sent" | "Replied" | "Interested" | "Not Interested" | "Meeting Booked"
    direction: "Outgoing" | "Incoming"
    sentAt: string
}

export interface CreativeAsset {
    id: string
    projectId: string
    companyName: string
    website?: string
    productLink?: string
    product?: string
    scriptStatus: string
    storyboardStatus: string
    animationPlan: string
    wireframeDesignStatus: string
    websiteStatus: string
    animationStatus: string
    deadlineForDelivery?: string
    timeDuration?: string
    scriptAnimationPlanDriveLink?: string
    animationDriveLink?: string
    figmaLink?: string
    animationHostedLink?: string
    mockWebsiteLink?: string
    projectProposalLink?: string
    updatedAt: string
}

export interface LinkedinLead {
    id: string
    dateAdded: string
    companyName: string
    contactName: string
    profileUrl: string
    workEmail: string
    leadSource: string
    status: 'Not Contacted' | 'Connection Sent' | 'Accepted' | 'Message Sent' | 'Replied' | 'Follow-up 1' | 'Follow-up 2' | 'Interested' | 'Not Interested' | 'Converted'
    priority: 'High' | 'Medium' | 'Low'
    sentTimeIST?: string
    draftedContent?: string
    inMail?: string
    followUp?: string
    ownerId?: string
    notes?: string
    hookAngle?: string
    updatedAt: string
}

export interface LinkedinInteraction {
    id: string
    leadId: string
    type: string
    content?: string
    timestamp: string
}

export interface LinkedinSequence {
    id: string
    name: string
    targetPersona: string
    steps: Array<{
        type: 'Connection' | 'Message' | 'Follow-up' | 'Inmail'
        content: string
        delay?: number
    }>
}

interface CRMContextType {
    projects: Project[]
    leads: Lead[]
    manufacturers: Manufacturer[]
    teamMembers: TeamMember[]
    campaigns: Campaign[]
    templates: EmailTemplate[]
    sequences: EmailSequence[]
    inbox: EmailMessage[]
    creativeAssets: CreativeAsset[]
    tasks: Task[]
    tags: Tag[]
    customSchemas: CustomSchema[]
    customRecords: CustomRecord[]
    linkedinLeads: LinkedinLead[]
    linkedinInteractions: LinkedinInteraction[]
    linkedinSequences: LinkedinSequence[]
    isLoaded: boolean
    connectionError: string | null
    currentUser: TeamMember | null
    setCurrentUser: (user: TeamMember | null) => void
    addProject: (project: Omit<Project, "id" | "updatedAt" | "leads" | "teamMemberIds">) => Promise<Project | null>
    updateProject: (id: string, updates: Partial<Project>) => Promise<void>
    deleteProject: (id: string) => Promise<void>
    duplicateProject: (id: string) => Promise<void>
    addLead: (lead: Omit<Lead, "id" | "lastContact">) => Promise<Lead | null>
    updateLead: (id: string, updates: Partial<Lead>) => Promise<void>
    deleteLead: (id: string) => Promise<void>
    deleteManyLeads: (ids: string[]) => Promise<void>
    replaceLeads: (leads: Omit<Lead, "id" | "lastContact">[]) => Promise<void>
    addManufacturer: (m: Omit<Manufacturer, "id">) => Promise<Manufacturer | null>
    updateManufacturer: (id: string, updates: Partial<Manufacturer>) => Promise<void>
    deleteManufacturer: (id: string) => Promise<void>
    deleteManyManufacturers: (ids: string[]) => Promise<void>
    replaceManufacturers: (manufacturers: Omit<Manufacturer, "id">[]) => Promise<void>
    addTeamMember: (member: Omit<TeamMember, "id" | "leadsAdded" | "emailsSent">) => Promise<TeamMember | null>
    addCampaign: (campaign: Omit<Campaign, "id" | "updatedAt">) => Promise<Campaign | null>
    updateCampaign: (id: string, updates: Partial<Campaign>) => Promise<void>
    deleteCampaign: (id: string) => Promise<void>
    deleteManyCampaigns: (ids: string[]) => Promise<void>
    
    addTemplate: (template: Omit<EmailTemplate, "id" | "createdAt">) => Promise<EmailTemplate | null>
    updateTemplate: (id: string, updates: Partial<EmailTemplate>) => Promise<void>
    deleteTemplate: (id: string) => Promise<void>
    
    addSequence: (sequence: Omit<EmailSequence, "id" | "createdAt">) => Promise<EmailSequence | null>
    updateSequence: (id: string, updates: Partial<EmailSequence>) => Promise<void>
    deleteSequence: (id: string) => Promise<void>
    
    addInboxMessage: (message: Omit<EmailMessage, "id" | "sentAt">) => Promise<EmailMessage | null>
    updateInboxMessage: (id: string, updates: Partial<EmailMessage>) => Promise<void>
    addCreativeAsset: (asset: Omit<CreativeAsset, "id" | "updatedAt">) => Promise<CreativeAsset | null>
    updateCreativeAsset: (id: string, updates: Partial<CreativeAsset>) => Promise<void>
    deleteCreativeAsset: (id: string) => Promise<void>
    deleteManyCreativeAssets: (ids: string[]) => Promise<void>
    replaceCreativeAssets: (assets: Omit<CreativeAsset, "id" | "updatedAt">[]) => Promise<void>
    addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Promise<Task | null>
    updateTask: (id: string, updates: Partial<Task>) => Promise<void>
    deleteTask: (id: string) => Promise<void>
    deleteManyTasks: (ids: string[]) => Promise<void>
    addTag: (tag: Omit<Tag, "id">) => Promise<Tag | null>
    deleteTag: (id: string) => Promise<void>
    deleteTeamMember: (id: string) => Promise<void>
    deleteManyTeamMembers: (ids: string[]) => Promise<void>
    updateTeamMember: (id: string, updates: Partial<TeamMember>) => Promise<void>
    // Custom Tables
    addCustomSchema: (schema: Omit<CustomSchema, "id" | "createdAt" | "updatedAt">) => Promise<CustomSchema | null>
    updateCustomSchema: (id: string, updates: Partial<CustomSchema>) => Promise<void>
    deleteCustomSchema: (id: string) => Promise<void>
    addCustomRecord: (record: Omit<CustomRecord, "id" | "createdAt" | "updatedAt">) => Promise<CustomRecord | null>
    updateCustomRecord: (id: string, updates: Partial<CustomRecord>) => Promise<void>
    deleteCustomRecord: (id: string) => Promise<void>
    
    // LinkedIn Deal Engine
    addLinkedinLead: (lead: Omit<LinkedinLead, "id" | "updatedAt" | "dateAdded">) => Promise<LinkedinLead | null>
    updateLinkedinLead: (id: string, updates: Partial<LinkedinLead>) => Promise<void>
    deleteLinkedinLead: (id: string) => Promise<void>
    addLinkedinInteraction: (interaction: Omit<LinkedinInteraction, "id" | "timestamp">) => Promise<LinkedinInteraction | null>
    addLinkedinSequence: (sequence: Omit<LinkedinSequence, "id">) => Promise<LinkedinSequence | null>
    updateLinkedinSequence: (id: string, updates: Partial<LinkedinSequence>) => Promise<void>
    deleteLinkedinSequence: (id: string) => Promise<void>
    resetData: () => void
}



// ── Custom Tables ──────────────────────────────────────────
export interface CustomColumnDef {
    id: string
    name: string
    type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'url' | 'email'
    required?: boolean
    options?: string[]   // for 'select' type
}

export interface CustomSchema {
    id: string
    name: string
    description: string
    icon: string
    color: string
    columns: CustomColumnDef[]
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface CustomRecord {
    id: string
    schemaId: string
    data: Record<string, any>
    createdBy: string
    createdAt: string
    updatedAt: string
}

// ── Permission type ─────────────────────────────────────────
export interface MemberPermissions {
    canViewLeads: boolean
    canEditLeads: boolean
    canDeleteLeads: boolean
    canViewProjects: boolean
    canEditProjects: boolean
    canDeleteProjects: boolean
    canViewEmails: boolean
    canSendEmails: boolean
    canViewTeam: boolean
    canManageTeam: boolean
    canViewReports: boolean
    canExportData: boolean
    canManageSettings: boolean
}

export const DEFAULT_PERMISSIONS: Record<string, MemberPermissions> = {
    Admin:            { canViewLeads: true, canEditLeads: true, canDeleteLeads: true, canViewProjects: true, canEditProjects: true, canDeleteProjects: true, canViewEmails: true, canSendEmails: true, canViewTeam: true, canManageTeam: true, canViewReports: true, canExportData: true, canManageSettings: true },
    Manager:          { canViewLeads: true, canEditLeads: true, canDeleteLeads: false, canViewProjects: true, canEditProjects: true, canDeleteProjects: false, canViewEmails: true, canSendEmails: true, canViewTeam: true, canManageTeam: false, canViewReports: true, canExportData: true, canManageSettings: false },
    "Lead Gen":       { canViewLeads: true, canEditLeads: true, canDeleteLeads: false, canViewProjects: true, canEditProjects: false, canDeleteProjects: false, canViewEmails: true, canSendEmails: true, canViewTeam: true, canManageTeam: false, canViewReports: false, canExportData: false, canManageSettings: false },
    Designer:         { canViewLeads: true, canEditLeads: false, canDeleteLeads: false, canViewProjects: true, canEditProjects: true, canDeleteProjects: false, canViewEmails: false, canSendEmails: false, canViewTeam: true, canManageTeam: false, canViewReports: true, canExportData: false, canManageSettings: false },
    "Content Writer":           { canViewLeads: true, canEditLeads: false, canDeleteLeads: false, canViewProjects: true, canEditProjects: false, canDeleteProjects: false, canViewEmails: true, canSendEmails: false, canViewTeam: true, canManageTeam: false, canViewReports: false, canExportData: false, canManageSettings: false },
    "Linkedin":                 { canViewLeads: true, canEditLeads: true, canDeleteLeads: false, canViewProjects: true, canEditProjects: false, canDeleteProjects: false, canViewEmails: true, canSendEmails: true, canViewTeam: true, canManageTeam: false, canViewReports: false, canExportData: false, canManageSettings: false },
    "Linkedin + Content Writer": { canViewLeads: true, canEditLeads: true, canDeleteLeads: false, canViewProjects: true, canEditProjects: false, canDeleteProjects: false, canViewEmails: true, canSendEmails: true, canViewTeam: true, canManageTeam: false, canViewReports: false, canExportData: false, canManageSettings: false },
    "CRM":                     { canViewLeads: true, canEditLeads: true, canDeleteLeads: false, canViewProjects: true, canEditProjects: true, canDeleteProjects: false, canViewEmails: true, canSendEmails: true, canViewTeam: true, canManageTeam: false, canViewReports: true, canExportData: true, canManageSettings: false },
}

const CRMContext = createContext<CRMContextType | undefined>(undefined)


export function CRMProvider({ children }: { children: React.ReactNode }) {
    const [projects, setProjects] = useState<Project[]>([])
    const [leads, setLeads] = useState<Lead[]>([])
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([])
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [templates, setTemplates] = useState<EmailTemplate[]>([])
    const [sequences, setSequences] = useState<EmailSequence[]>([])
    const [inbox, setInbox] = useState<EmailMessage[]>([])
    const [creativeAssets, setCreativeAssets] = useState<CreativeAsset[]>([])
    const [tasks, setTasks] = useState<Task[]>([])
    const [tags, setTags] = useState<Tag[]>([])
    const [customSchemas, setCustomSchemas] = useState<CustomSchema[]>([])
    const [customRecords, setCustomRecords] = useState<CustomRecord[]>([])
    
    // LinkedIn Deal Engine State
    const [linkedinLeads, setLinkedinLeads] = useState<LinkedinLead[]>([])
    const [linkedinInteractions, setLinkedinInteractions] = useState<LinkedinInteraction[]>([])
    const [linkedinSequences, setLinkedinSequences] = useState<LinkedinSequence[]>([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [connectionError, setConnectionError] = useState<string | null>(null)
    const [currentUser, setCurrentUser] = useState<TeamMember | null>(null)

    // Initial Fetch
    useEffect(() => {
        // Guard: if Supabase is not configured, show a helpful error and bail out
        if (!isSupabaseConfigured) {
            console.error(
                "[CRM] Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and " +
                "NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables (Netlify/Vercel dashboard, or .env.local locally)."
            )
            setConnectionError(
                "Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables."
            )
            setIsLoaded(true)
            return
        }
        
        const fetchData = async () => {
            try {
                const [
                    { data: projectsData, error: pErr },
                    { data: leadsData, error: lErr },
                    { data: manufacturersData, error: mErr },
                    { data: teamData, error: tErr },
                    { data: campaignsData, error: cErr },
                    { data: templatesData, error: tmErr },
                    { data: sequencesData, error: sqErr },
                    { data: inboxData, error: inErr },
                    { data: assetsData, error: aErr },
                    { data: tasksData, error: tsErr },
                    { data: tagsData, error: tgErr },
                    { data: schemasData, error: schErr },
                    { data: recordsData, error: recErr },
                    { data: liLeadsData, error: liLErr },
                    { data: liInteractionsData, error: liIErr },
                    { data: liSequencesData, error: liSErr },
                    { data: { session }, error: sErr }
                ] = await Promise.all([
                    supabase.from("projects").select("*").order("updated_at", { ascending: false }),
                    supabase.from("leads").select("*").order("id", { ascending: false }),
                    supabase.from("manufacturers").select("*").order("id", { ascending: false }),
                    supabase.from("profiles").select("*"),
                    supabase.from("campaigns").select("*").order("updated_at", { ascending: false }),
                    supabase.from("email_templates").select("*").order("created_at", { ascending: false }),
                    supabase.from("email_sequences").select("*").order("created_at", { ascending: false }),
                    supabase.from("email_messages").select("*").order("sent_at", { ascending: false }),
                    supabase.from("creative_assets").select("*").order("updated_at", { ascending: false }),
                    supabase.from("tasks").select("*").order("updated_at", { ascending: false }),
                    supabase.from("tags").select("*"),
                    supabase.from("custom_schemas").select("*").order("created_at", { ascending: false }),
                    supabase.from("custom_records").select("*").order("created_at", { ascending: false }),
                    supabase.from("linkedin_leads").select("*").order("updated_at", { ascending: false }),
                    supabase.from("linkedin_interactions").select("*").order("timestamp", { ascending: false }),
                    supabase.from("linkedin_sequences").select("*").order("created_at", { ascending: false }),
                    supabase.auth.getSession()
                ])

                const errorFound = [pErr, lErr, mErr, tErr, cErr, tmErr, sqErr, inErr, aErr, tsErr, tgErr, schErr, recErr, liLErr, liIErr, liSErr].find(Boolean)
                if (errorFound) {
                    console.error("[Supabase] Fetch error:", errorFound.message)
                    setConnectionError(
                        errorFound.message.includes("does not exist")
                            ? "Database tables not found. Run the SQL setup script in your Supabase dashboard."
                            : errorFound.message
                    )
                } else {
                    setConnectionError(null)
                }

                // Identify current user and admin status
                let currentProfile: any = null
                if (session?.user) {
                    currentProfile = teamData?.find((m: any) => m.id === session.user.id)
                    
                    // If session exists but no profile is found, the user might have been deleted in Supabase
                    if (!currentProfile && teamData && teamData.length > 0) {
                        console.warn("[CRM] User profile not found. Session may be invalid or user deleted.")
                        // Only sign out if we actually have data but the user is missing
                        // (Avoid signing out during initial loading or empty states)
                        // supabase.auth.signOut() // Uncomment this if you want aggressive auto-logout
                    }

                    if (currentProfile) {
                        const isAdminByName = currentProfile.full_name === "Prasanna Kumar"
                        setCurrentUser({
                            id: currentProfile.id,
                            name: currentProfile.full_name || "New User",
                            email: currentProfile.email,
                            role: isAdminByName ? "Admin" : (currentProfile.role || "Member"),
                            userRole: isAdminByName ? "Admin" : (currentProfile.role as any || "Lead Gen"),
                            status: "Active",
                            leadsAdded: 0,
                            emailsSent: 0,
                            avatar: currentProfile.avatar_url,
                            lastActive: currentProfile.created_at,
                            menuPermissions: isAdminByName 
                                ? ['dashboard', 'projects', 'emails', 'leads', 'team', 'custom-tables', 'settings']
                                : (currentProfile.menu_permissions || ['dashboard', 'projects', 'leads', 'emails', 'custom-tables', 'team'])
                        })
                    } else if (!session.user) {
                        setCurrentUser(null)
                    }
                } else {
                    setCurrentUser(null)
                }

                const isSuperAdmin = currentProfile?.full_name === "Prasanna Kumar"

                if (projectsData) {
                    let filteredProjects = projectsData
                    if (!isSuperAdmin && currentProfile) {
                        filteredProjects = projectsData.filter((p: any) => 
                            p.team_member_ids?.includes(currentProfile.id) || 
                            p.team_member_ids?.includes("1")
                        )
                    }
                    setProjects(filteredProjects.map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        description: p.description,
                        leads: p.leads,
                        status: p.status,
                        teamMemberIds: p.team_member_ids || [],
                        type: p.type,
                        updatedAt: p.updated_at
                    })))
                }

                if (leadsData) {
                    let filteredLeads = leadsData
                    if (!isSuperAdmin && currentProfile) {
                        filteredLeads = leadsData.filter((l: any) => 
                            l.assigned_to === currentProfile.id || 
                            l.assigned_to === currentProfile.full_name ||
                            !l.assigned_to
                        )
                    }
                    setLeads(filteredLeads.map((l: any) => ({
                        id: l.id,
                        firstName: l.first_name,
                        lastName: l.last_name,
                        email: l.email,
                        company: l.company,
                        jobTitle: l.job_title,
                        speciality: l.speciality,
                        subSpeciality: l.sub_speciality,
                        companySize: l.company_size,
                        country: l.country,
                        serviceInterest: l.service_interest,
                        message: l.message,
                        status: l.status,
                        priority: l.priority,
                        assignedTo: l.assigned_to,
                        lastContact: l.last_contact,
                        projectId: l.project_id,
                        phone: l.phone,
                        website: l.website,
                        websiteLink: l.website_link
                    })))
                }

                if (manufacturersData) {
                    setManufacturers(manufacturersData.map((m: any) => ({
                        id: m.id,
                        date: m.date,
                        parentCompany: m.parent_company,
                        peerBrand: m.peer_brand,
                        productMatchRate: m.product_match_rate,
                        website: m.website,
                        companySize: m.company_size,
                        country: m.country,
                        fitLevel: m.fit_level,
                        linkedin: m.linkedin,
                        visualPresence: m.visual_presence,
                        note: m.note,
                        decisionMaker: m.decision_maker,
                        leadBy: m.lead_by,
                        projectId: m.project_id
                    })))
                }
                
                if (teamData) {
                    setTeamMembers(teamData.map((t: any) => {
                        const isAdminByName = t.full_name === "Prasanna Kumar"
                        const role = isAdminByName ? "Admin" : (t.role || "Member")
                        const userRole = isAdminByName ? "Admin" : (t.role || "Lead Gen")

                        return {
                            id: t.id,
                            name: t.full_name || "New User",
                            email: t.email,
                            role: role,
                            userRole: userRole as any,
                            status: "Active",
                            leadsAdded: 0,
                            emailsSent: 0,
                            avatar: t.avatar_url,
                            lastActive: t.created_at,
                            menuPermissions: isAdminByName 
                                ? ['dashboard', 'projects', 'emails', 'leads', 'team', 'custom-tables', 'settings']
                                : ['dashboard', 'projects', 'leads', 'emails', 'custom-tables', 'team']
                        }
                    }))
                }

                if (tasksData) {
                    setTasks(tasksData.map((ts: any) => ({
                        id: ts.id,
                        projectId: ts.project_id,
                        title: ts.title,
                        description: ts.description,
                        status: ts.status,
                        priority: ts.priority,
                        dueDate: ts.due_date,
                        assignedTo: ts.assigned_to,
                        relatedType: ts.related_type,
                        relatedId: ts.related_id,
                        createdBy: ts.created_by,
                        completedAt: ts.completed_at,
                        createdAt: ts.created_at,
                        updatedAt: ts.updated_at
                    })))
                }

                if (campaignsData) {
                    setCampaigns(campaignsData.map((c: any) => ({
                        id: c.id,
                        projectId: c.project_id,
                        name: c.name,
                        subject: c.subject || "",
                        status: c.status,
                        leadsCount: c.leads_count || 0,
                        recipients: c.recipients || 0,
                        emailsSent: c.emails_sent || 0,
                        opens: c.opens || 0,
                        replies: c.replies || 0,
                        positives: c.positives || 0,
                        bounces: c.bounces || 0,
                        meetings: c.meetings || 0,
                        sequenceId: c.sequence_id,
                        owner: c.owner,
                        lastActivity: c.last_activity,
                        tags: c.tags || [],
                        updatedAt: c.updated_at
                    })))
                }

                if (templatesData) {
                    setTemplates(templatesData.map((t: any) => ({
                        id: t.id,
                        name: t.name,
                        subject: t.subject,
                        body: t.body,
                        projectId: t.project_id,
                        createdAt: t.created_at
                    })))
                }

                if (sequencesData) {
                    setSequences(sequencesData.map((s: any) => ({
                        id: s.id,
                        name: s.name,
                        projectId: s.project_id,
                        steps: s.steps || [],
                        createdAt: s.created_at
                    })))
                }

                if (inboxData) {
                    setInbox(inboxData.map((m: any) => ({
                        id: m.id,
                        leadId: m.lead_id,
                        campaignId: m.campaign_id,
                        templateId: m.template_id,
                        threadId: m.thread_id,
                        subject: m.subject,
                        body: m.body,
                        status: m.status,
                        direction: m.direction,
                        sentAt: m.sent_at
                    })))
                }

                if (assetsData) {
                    setCreativeAssets(assetsData.map((a: any) => ({
                        id: a.id,
                        projectId: a.project_id,
                        companyName: a.company_name,
                        website: a.website,
                        productLink: a.product_link,
                        product: a.product,
                        scriptStatus: a.script_status || "Pending",
                        storyboardStatus: a.storyboard_status || "Pending",
                        animationPlan: a.animation_plan || "Pending",
                        wireframeDesignStatus: a.wireframe_design_status || "Pending",
                        websiteStatus: a.website_status || "Pending",
                        animationStatus: a.animation_status || "Pending",
                        deadlineForDelivery: a.deadline_for_delivery,
                        timeDuration: a.time_duration,
                        scriptAnimationPlanDriveLink: a.script_animation_plan_drive_link,
                        animationDriveLink: a.animation_drive_link,
                        figmaLink: a.figma_link,
                        animationHostedLink: a.animation_hosted_link,
                        mockWebsiteLink: a.mock_website_link,
                        projectProposalLink: a.project_proposal_link,
                        updatedAt: a.updated_at
                    })))
                }
 

                if (tagsData) setTags(tagsData)
                if (schemasData) {
                    setCustomSchemas(schemasData.map((s: any) => ({
                        id: s.id,
                        name: s.name,
                        description: s.description || '',
                        icon: s.icon || 'Table',
                        color: s.color || '#6366f1',
                        columns: s.columns || [],
                        createdBy: s.created_by || '',
                        createdAt: s.created_at,
                        updatedAt: s.updated_at
                    })))
                }
                
                if (recordsData) {
                    setCustomRecords(recordsData.map((r: any) => ({
                        id: r.id,
                        schemaId: r.schema_id,
                        data: r.data || {},
                        createdBy: r.created_by || '',
                        createdAt: r.created_at,
                        updatedAt: r.updated_at
                    })))
                }

                if (liLeadsData) {
                    setLinkedinLeads(liLeadsData.map((l: any) => ({
                        id: l.id,
                        dateAdded: l.date_added,
                        companyName: l.company_name,
                        contactName: l.contact_name,
                        profileUrl: l.profile_url,
                        workEmail: l.work_email,
                        leadSource: l.lead_source,
                        status: l.status,
                        priority: l.priority,
                        sentTimeIST: l.sent_time_ist,
                        draftedContent: l.drafted_content,
                        inMail: l.in_mail,
                        followUp: l.follow_up,
                        ownerId: l.owner_id,
                        notes: l.notes,
                        hookAngle: l.hook_angle,
                        updatedAt: l.updated_at
                    })))
                }

                if (liInteractionsData) {
                    setLinkedinInteractions(liInteractionsData.map((i: any) => ({
                        id: i.id,
                        leadId: i.lead_id,
                        type: i.type,
                        content: i.content,
                        timestamp: i.timestamp
                    })))
                }

                if (liSequencesData) {
                    setLinkedinSequences(liSequencesData.map((s: any) => ({
                        id: s.id,
                        name: s.name,
                        targetPersona: s.target_persona,
                        steps: s.steps || []
                    })))
                }

                setIsLoaded(true)

            } catch (err: any) {
                console.error("Error fetching CRM data:", err)
                setConnectionError(err.message || "Failed to fetch data")
                setIsLoaded(true)
            }
        }

        fetchData()

        // Real-time subscriptions — only connect when Supabase is properly configured
        if (!isSupabaseConfigured) return

        const channel = supabase.channel("schema-db-changes")
            .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, () => fetchData())
            .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, () => fetchData())
            .on("postgres_changes", { event: "*", schema: "public", table: "manufacturers" }, () => fetchData())
            .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => fetchData())
            .on("postgres_changes", { event: "*", schema: "public", table: "campaigns" }, () => fetchData())
            .on("postgres_changes", { event: "*", schema: "public", table: "email_templates" }, () => fetchData())
            .on("postgres_changes", { event: "*", schema: "public", table: "email_sequences" }, () => fetchData())
            .on("postgres_changes", { event: "*", schema: "public", table: "email_messages" }, () => fetchData())
            .on("postgres_changes", { event: "*", schema: "public", table: "creative_assets" }, () => fetchData())
            .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, () => fetchData())
            .on("postgres_changes", { event: "*", schema: "public", table: "tags" }, () => fetchData())
            .on("postgres_changes", { event: "*", schema: "public", table: "custom_schemas" }, () => fetchData())
            .on("postgres_changes", { event: "*", schema: "public", table: "custom_records" }, () => fetchData())
            .on("postgres_changes", { event: "*", schema: "public", table: "linkedin_leads" }, () => fetchData())
            .on("postgres_changes", { event: "*", schema: "public", table: "linkedin_interactions" }, () => fetchData())
            .on("postgres_changes", { event: "*", schema: "public", table: "linkedin_sequences" }, () => fetchData())
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const addProject = async (project: Omit<Project, "id" | "updatedAt" | "leads" | "teamMemberIds">) => {
        const { data, error } = await supabase.from("projects").insert([{
            name: project.name,
            description: project.description,
            type: project.type,
            status: project.status,
            leads: 0,
            team_member_ids: ["1"],
            updated_at: new Date().toISOString()
        }]).select().single()
        
        if (error) {
            console.error("Error adding project:", error)
            return null
        }
        const newProject = {
            ...data,
            teamMemberIds: data.team_member_ids,
            updatedAt: data.updated_at
        } as Project
        setProjects(prev => [newProject, ...prev])
        return newProject
    }

    const updateProject = async (id: string, updates: Partial<Project>) => {
        const mappedUpdates: any = { ...updates }
        if (updates.teamMemberIds) mappedUpdates.team_member_ids = updates.teamMemberIds
        delete mappedUpdates.teamMemberIds
        delete mappedUpdates.updatedAt

        const { error } = await supabase.from("projects").update({ 
            ...mappedUpdates, 
            updated_at: new Date().toISOString() 
        }).eq("id", id)
        if (error) {
            console.error("Error updating project:", error)
        } else {
            setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
        }
    }

    const deleteProject = async (id: string) => {
        const { error } = await supabase.from("projects").delete().eq("id", id)
        if (error) {
            console.error("Error deleting project:", error)
        } else {
            setProjects(prev => prev.filter(p => p.id !== id))
        }
    }

    const duplicateProject = async (id: string) => {
        const project = projects.find(p => p.id === id)
        if (project) {
            await addProject({
                name: `${project.name} (Copy)`,
                description: project.description,
                status: project.status,
                type: project.type
            })
        }
    }

    const addLead = async (lead: Omit<Lead, "id" | "lastContact">) => {
        const mappedLead = {
            first_name: lead.firstName,
            last_name: lead.lastName,
            email: lead.email,
            company: lead.company,
            job_title: lead.jobTitle,
            speciality: lead.speciality,
            sub_speciality: lead.subSpeciality,
            company_size: lead.companySize,
            country: lead.country,
            service_interest: lead.serviceInterest,
            message: lead.message,
            status: lead.status,
            priority: lead.priority,
            assigned_to: lead.assignedTo,
            last_contact: new Date().toISOString().split('T')[0],
            project_id: lead.projectId,
            phone: lead.phone,
            website: lead.website,
            website_link: lead.websiteLink,
            updated_at: new Date().toISOString()
        }

        const { data, error } = await supabase.from("leads").insert([mappedLead]).select().single()
        if (error) {
            console.error("Error adding lead:", error)
            return null
        }
        const newLead = {
            ...lead,
            id: data.id,
            lastContact: data.last_contact,
            projectId: data.project_id
        } as Lead
        setLeads(prev => [newLead, ...prev])
        return newLead
    }

    const updateLead = async (id: string, updates: Partial<Lead>) => {
        const mappedUpdates: any = {}
        if (updates.firstName !== undefined) mappedUpdates.first_name = updates.firstName
        if (updates.lastName !== undefined) mappedUpdates.last_name = updates.lastName
        if (updates.email !== undefined) mappedUpdates.email = updates.email
        if (updates.company !== undefined) mappedUpdates.company = updates.company
        if (updates.jobTitle !== undefined) mappedUpdates.job_title = updates.jobTitle
        if (updates.speciality !== undefined) mappedUpdates.speciality = updates.speciality
        if (updates.subSpeciality !== undefined) mappedUpdates.sub_speciality = updates.subSpeciality
        if (updates.companySize !== undefined) mappedUpdates.company_size = updates.companySize
        if (updates.country !== undefined) mappedUpdates.country = updates.country
        if (updates.serviceInterest !== undefined) mappedUpdates.service_interest = updates.serviceInterest
        if (updates.message !== undefined) mappedUpdates.message = updates.message
        if (updates.status !== undefined) mappedUpdates.status = updates.status
        if (updates.priority !== undefined) mappedUpdates.priority = updates.priority
        if (updates.assignedTo !== undefined) mappedUpdates.assigned_to = updates.assignedTo
        if (updates.lastContact !== undefined) mappedUpdates.last_contact = updates.lastContact
        if (updates.projectId !== undefined) mappedUpdates.project_id = updates.projectId
        if (updates.phone !== undefined) mappedUpdates.phone = updates.phone
        if (updates.website !== undefined) mappedUpdates.website = updates.website
        if (updates.websiteLink !== undefined) mappedUpdates.website_link = updates.websiteLink
        
        mappedUpdates.updated_at = new Date().toISOString()

        const { error } = await supabase.from("leads").update(mappedUpdates).eq("id", id)
        if (error) {
            console.error("Error updating lead:", error)
        } else {
            setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l))
        }
    }

    const deleteLead = async (id: string) => {
        const { error } = await supabase.from("leads").delete().eq("id", id)
        if (error) {
            console.error("Error deleting lead:", error)
        } else {
            setLeads(prev => prev.filter(l => l.id !== id))
        }
    }

    const deleteManyLeads = async (ids: string[]) => {
        const { error } = await supabase.from("leads").delete().in("id", ids)
        if (error) {
            console.error("Error deleting leads:", error)
        } else {
            setLeads(prev => prev.filter(l => !ids.includes(l.id)))
        }
    }

    const replaceLeads = async (newLeads: Omit<Lead, "id" | "lastContact">[]) => {
        // Appending instead of replacing for safety, following the implementation plan
        const mapped = newLeads.map(l => ({
            first_name: l.firstName,
            last_name: l.lastName,
            email: l.email,
            company: l.company,
            job_title: l.jobTitle,
            speciality: l.speciality,
            sub_speciality: l.subSpeciality,
            company_size: l.companySize,
            country: l.country,
            service_interest: l.serviceInterest,
            message: l.message,
            status: l.status,
            priority: l.priority,
            assigned_to: l.assignedTo,
            last_contact: new Date().toISOString().split('T')[0],
            project_id: l.projectId,
            phone: l.phone,
            website: l.website,
            website_link: l.websiteLink,
            updated_at: new Date().toISOString()
        }))

        const { error: insError } = await supabase.from("leads").insert(mapped)
        if (insError) console.error("Error inserting leads for replacement:", insError)
    }

    const addManufacturer = async (m: Omit<Manufacturer, "id">) => {
        const mapped = {
            date: m.date,
            parent_company: m.parentCompany,
            peer_brand: m.peerBrand,
            product_match_rate: m.productMatchRate,
            website: m.website,
            company_size: m.companySize,
            country: m.country,
            fit_level: m.fitLevel,
            linkedin: m.linkedin,
            visual_presence: m.visualPresence,
            note: m.note,
            decision_maker: m.decisionMaker,
            lead_by: m.leadBy,
            project_id: m.projectId,
            updated_at: new Date().toISOString()
        }

        const { data, error } = await supabase.from("manufacturers").insert([mapped]).select().single()
        if (error) {
            console.error("Error adding manufacturer:", error)
            return null
        }
        const newM = {
            ...m,
            id: data.id,
            projectId: data.project_id
        } as Manufacturer
        setManufacturers(prev => [newM, ...prev])
        return newM
    }

    const updateManufacturer = async (id: string, updates: Partial<Manufacturer>) => {
        const mapped: any = {}
        if (updates.date !== undefined) mapped.date = updates.date
        if (updates.parentCompany !== undefined) mapped.parent_company = updates.parentCompany
        if (updates.peerBrand !== undefined) mapped.peer_brand = updates.peerBrand
        if (updates.productMatchRate !== undefined) mapped.product_match_rate = updates.productMatchRate
        if (updates.website !== undefined) mapped.website = updates.website
        if (updates.companySize !== undefined) mapped.company_size = updates.companySize
        if (updates.country !== undefined) mapped.country = updates.country
        if (updates.fitLevel !== undefined) mapped.fit_level = updates.fitLevel
        if (updates.linkedin !== undefined) mapped.linkedin = updates.linkedin
        if (updates.visualPresence !== undefined) mapped.visual_presence = updates.visualPresence
        if (updates.note !== undefined) mapped.note = updates.note
        if (updates.decisionMaker !== undefined) mapped.decision_maker = updates.decisionMaker
        if (updates.leadBy !== undefined) mapped.lead_by = updates.leadBy
        if (updates.projectId !== undefined) mapped.project_id = updates.projectId
        
        mapped.updated_at = new Date().toISOString()

        const { error } = await supabase.from("manufacturers").update(mapped).eq("id", id)
        if (error) {
            console.error("Error updating manufacturer:", error)
        } else {
            setManufacturers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m))
        }
    }

    const deleteManufacturer = async (id: string) => {
        const { error } = await supabase.from("manufacturers").delete().eq("id", id)
        if (error) {
            console.error("Error deleting manufacturer:", error)
        } else {
            setManufacturers(prev => prev.filter(m => m.id !== id))
        }
    }

    const deleteManyManufacturers = async (ids: string[]) => {
        const { error } = await supabase.from("manufacturers").delete().in("id", ids)
        if (error) {
            console.error("Error deleting manufacturers:", error)
        } else {
            setManufacturers(prev => prev.filter(m => !ids.includes(m.id)))
        }
    }

    const replaceManufacturers = async (newManufacturers: Omit<Manufacturer, "id">[]) => {
        // Appending instead of replacing for safety
        const mapped = newManufacturers.map(m => ({
            date: m.date,
            parent_company: m.parentCompany,
            peer_brand: m.peerBrand,
            product_match_rate: m.productMatchRate,
            website: m.website,
            company_size: m.companySize,
            country: m.country,
            fit_level: m.fitLevel,
            linkedin: m.linkedin,
            visual_presence: m.visualPresence,
            note: m.note,
            decision_maker: m.decisionMaker,
            lead_by: m.leadBy,
            project_id: m.projectId,
            updated_at: new Date().toISOString()
        }))
        const { error: insError } = await supabase.from("manufacturers").insert(mapped)
        if (insError) console.error("Error inserting manufacturers for replacement:", insError)
    }

    const addTeamMember = async (member: Omit<TeamMember, "id" | "leadsAdded" | "emailsSent">) => {
        // Since we are using profiles, 'adding' a member usually means creating a profile for an Auth user
        // If we don't have an auth user yet, this will just be a profile record
        const mapped = {
            full_name: member.name,
            email: member.email,
            role: member.role,
            avatar_url: member.avatar,
            menu_permissions: member.menuPermissions || ['dashboard', 'leads', 'manufacturers', 'creative', 'emails', 'my-tables', 'team'],
            updated_at: new Date().toISOString()
        }
        const { data, error } = await supabase.from("profiles").insert([mapped]).select().single()
        if (error) {
            console.error("Error adding team member (profile):", error)
            return null
        }
        const newMember = {
            ...member,
            id: data.id,
            leadsAdded: 0,
            emailsSent: 0
        } as TeamMember
        setTeamMembers(prev => [newMember, ...prev])
        return newMember
    }

    const deleteTeamMember = async (id: string) => {
        const { error } = await supabase.from("profiles").delete().eq("id", id)
        if (error) {
            console.error("Error deleting team member (profile):", error)
        } else {
            setTeamMembers(prev => prev.filter(t => t.id !== id))
        }
    }

    const deleteManyTeamMembers = async (ids: string[]) => {
        const { error } = await supabase.from("profiles").delete().in("id", ids)
        if (error) console.error("Error deleting team members (profiles):", error)
    }

    const addCampaign = async (campaign: Omit<Campaign, "id" | "updatedAt">) => {
        const mapped = {
            project_id: campaign.projectId,
            name: campaign.name,
            subject: campaign.subject,
            status: campaign.status,
            leads_count: campaign.leadsCount,
            recipients: campaign.recipients,
            sequence_id: campaign.sequenceId,
            owner: campaign.owner,
            emails_sent: 0,
            opens: 0,
            replies: 0,
            positives: 0,
            bounces: 0,
            meetings: 0,
            updated_at: new Date().toISOString()
        }

        const { data, error } = await supabase.from("campaigns").insert([mapped]).select().single()
        if (error) {
            console.error("Error adding campaign:", error)
            return null
        }
        const newCampaign = {
            ...campaign,
            id: data.id,
            emailsSent: 0,
            opens: 0,
            replies: 0,
            positives: 0,
            bounces: 0,
            meetings: 0,
            updatedAt: data.updated_at
        } as Campaign
        setCampaigns(prev => [newCampaign, ...prev])
        return newCampaign
    }

    const updateCampaign = async (id: string, updates: Partial<Campaign>) => {
        const mapped: any = {}
        if (updates.name !== undefined) mapped.name = updates.name
        if (updates.status !== undefined) mapped.status = updates.status
        if (updates.leadsCount !== undefined) mapped.leads_count = updates.leadsCount
        if (updates.sequenceId !== undefined) mapped.sequence_id = updates.sequenceId
        if (updates.owner !== undefined) mapped.owner = updates.owner
        if (updates.emailsSent !== undefined) mapped.emails_sent = updates.emailsSent
        if (updates.opens !== undefined) mapped.opens = updates.opens
        if (updates.replies !== undefined) mapped.replies = updates.replies
        if (updates.positives !== undefined) mapped.positives = updates.positives
        if (updates.bounces !== undefined) mapped.bounces = updates.bounces
        if (updates.meetings !== undefined) mapped.meetings = updates.meetings
        if (updates.projectId !== undefined) mapped.project_id = updates.projectId
        
        mapped.updated_at = new Date().toISOString()

        const { error } = await supabase.from("campaigns").update(mapped).eq("id", id)
        if (error) {
            console.error("Error updating campaign:", error)
        } else {
            setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c))
        }
    }

    const deleteCampaign = async (id: string) => {
        const { error } = await supabase.from("campaigns").delete().eq("id", id)
        if (error) {
            console.error("Error deleting campaign:", error)
        } else {
            setCampaigns(prev => prev.filter(c => c.id !== id))
        }
    }

    const deleteManyCampaigns = async (ids: string[]) => {
        const { error } = await supabase.from("campaigns").delete().in("id", ids)
        if (error) {
            console.error("Error deleting campaigns:", error)
        } else {
            setCampaigns(prev => prev.filter(c => !ids.includes(c.id)))
        }
    }

    const addTemplate = async (template: Omit<EmailTemplate, "id" | "createdAt">) => {
        const mapped = {
            name: template.name,
            subject: template.subject,
            body: template.body,
            project_id: template.projectId,
            created_at: new Date().toISOString()
        }
        const { data, error } = await supabase.from("email_templates").insert([mapped]).select().single()
        if (error) {
            console.error("Error adding template:", error)
            return null
        }
        const newTemplate = {
            ...template,
            id: data.id,
            createdAt: data.created_at
        } as EmailTemplate
        setTemplates(prev => [newTemplate, ...prev])
        return newTemplate
    }

    const updateTemplate = async (id: string, updates: Partial<EmailTemplate>) => {
        const mapped: any = {}
        if (updates.name !== undefined) mapped.name = updates.name
        if (updates.subject !== undefined) mapped.subject = updates.subject
        if (updates.body !== undefined) mapped.body = updates.body
        const { error } = await supabase.from("email_templates").update(mapped).eq("id", id)
        if (error) {
            console.error("Error updating template:", error)
        } else {
            setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
        }
    }

    const deleteTemplate = async (id: string) => {
        const { error } = await supabase.from("email_templates").delete().eq("id", id)
        if (error) {
            console.error("Error deleting template:", error)
        } else {
            setTemplates(prev => prev.filter(t => t.id !== id))
        }
    }

    const addSequence = async (sequence: Omit<EmailSequence, "id" | "createdAt">) => {
        const mapped = {
            name: sequence.name,
            project_id: sequence.projectId,
            steps: sequence.steps,
            created_at: new Date().toISOString()
        }
        const { data, error } = await supabase.from("email_sequences").insert([mapped]).select().single()
        if (error) {
            console.error("Error adding sequence:", error)
            return null
        }
        const newSequence = {
            ...sequence,
            id: data.id,
            createdAt: data.created_at
        } as EmailSequence
        setSequences(prev => [newSequence, ...prev])
        return newSequence
    }

    const updateSequence = async (id: string, updates: Partial<EmailSequence>) => {
        const mapped: any = {}
        if (updates.name !== undefined) mapped.name = updates.name
        if (updates.steps !== undefined) mapped.steps = updates.steps
        const { error } = await supabase.from("email_sequences").update(mapped).eq("id", id)
        if (error) {
            console.error("Error updating sequence:", error)
        } else {
            setSequences(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
        }
    }

    const deleteSequence = async (id: string) => {
        const { error } = await supabase.from("email_sequences").delete().eq("id", id)
        if (error) {
            console.error("Error deleting sequence:", error)
        } else {
            setSequences(prev => prev.filter(s => s.id !== id))
        }
    }

    const addInboxMessage = async (message: Omit<EmailMessage, "id" | "sentAt">) => {
        const mapped = {
            lead_id: message.leadId,
            campaign_id: message.campaignId,
            template_id: message.templateId,
            thread_id: message.threadId,
            subject: message.subject,
            body: message.body,
            status: message.status,
            direction: message.direction,
            sent_at: new Date().toISOString()
        }
        const { data, error } = await supabase.from("email_messages").insert([mapped]).select().single()
        if (error) {
            console.error("Error adding inbox message:", error)
            return null
        }
        const newMsg = {
            ...message,
            id: data.id,
            sentAt: data.sent_at
        } as EmailMessage
        setInbox(prev => [newMsg, ...prev])
        return newMsg
    }

    const updateInboxMessage = async (id: string, updates: Partial<EmailMessage>) => {
        const mapped: any = {}
        if (updates.status !== undefined) mapped.status = updates.status
        const { error } = await supabase.from("email_messages").update(mapped).eq("id", id)
        if (error) {
            console.error("Error updating inbox message:", error)
        } else {
            setInbox(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m))
        }
    }

    const addCreativeAsset = async (asset: Omit<CreativeAsset, "id" | "updatedAt">) => {
        const mapped = {
            project_id: asset.projectId,
            company_name: asset.companyName,
            website: asset.website,
            product_link: asset.productLink,
            product: asset.product,
            script_status: asset.scriptStatus,
            storyboard_status: asset.storyboardStatus,
            animation_plan: asset.animationPlan,
            wireframe_design_status: asset.wireframeDesignStatus,
            website_status: asset.websiteStatus,
            animation_status: asset.animationStatus,
            deadline_for_delivery: asset.deadlineForDelivery,
            time_duration: asset.timeDuration,
            script_animation_plan_drive_link: asset.scriptAnimationPlanDriveLink,
            animation_drive_link: asset.animationDriveLink,
            figma_link: asset.figmaLink,
            animation_hosted_link: asset.animationHostedLink,
            mock_website_link: asset.mockWebsiteLink,
            project_proposal_link: asset.projectProposalLink,
            updated_at: new Date().toISOString()
        }

        const { data, error } = await supabase.from("creative_assets").insert([mapped]).select().single()
        if (error) {
            console.error("Error adding creative asset:", error)
            return null
        }
        const newAsset = {
            ...asset,
            id: data.id,
            updatedAt: data.updated_at
        } as CreativeAsset
        setCreativeAssets(prev => [newAsset, ...prev])
        return newAsset
    }

    const updateCreativeAsset = async (id: string, updates: Partial<CreativeAsset>) => {
        const mapped: any = {}
        if (updates.companyName !== undefined) mapped.company_name = updates.companyName
        if (updates.website !== undefined) mapped.website = updates.website
        if (updates.productLink !== undefined) mapped.product_link = updates.productLink
        if (updates.product !== undefined) mapped.product = updates.product
        if (updates.scriptStatus !== undefined) mapped.script_status = updates.scriptStatus
        if (updates.storyboardStatus !== undefined) mapped.storyboard_status = updates.storyboardStatus
        if (updates.animationPlan !== undefined) mapped.animation_plan = updates.animationPlan
        if (updates.wireframeDesignStatus !== undefined) mapped.wireframe_design_status = updates.wireframeDesignStatus
        if (updates.websiteStatus !== undefined) mapped.website_status = updates.websiteStatus
        if (updates.animationStatus !== undefined) mapped.animation_status = updates.animationStatus
        if (updates.deadlineForDelivery !== undefined) mapped.deadline_for_delivery = updates.deadlineForDelivery
        if (updates.timeDuration !== undefined) mapped.time_duration = updates.timeDuration
        if (updates.scriptAnimationPlanDriveLink !== undefined) mapped.script_animation_plan_drive_link = updates.scriptAnimationPlanDriveLink
        if (updates.animationDriveLink !== undefined) mapped.animation_drive_link = updates.animationDriveLink
        if (updates.figmaLink !== undefined) mapped.figma_link = updates.figmaLink
        if (updates.animationHostedLink !== undefined) mapped.animation_hosted_link = updates.animationHostedLink
        if (updates.mockWebsiteLink !== undefined) mapped.mock_website_link = updates.mockWebsiteLink
        if (updates.projectProposalLink !== undefined) mapped.project_proposal_link = updates.projectProposalLink
        if (updates.projectId !== undefined) mapped.project_id = updates.projectId
        
        mapped.updated_at = new Date().toISOString()
        
        const { error } = await supabase.from("creative_assets").update(mapped).eq("id", id)
        if (error) {
            console.error("Error updating creative asset:", error)
        } else {
            setCreativeAssets(prev => prev.map(a => a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a))
        }
    }

    const deleteCreativeAsset = async (id: string) => {
        const { error } = await supabase.from("creative_assets").delete().eq("id", id)
        if (error) {
            console.error("Error deleting creative asset:", error)
        } else {
            setCreativeAssets(prev => prev.filter(a => a.id !== id))
        }
    }

    const deleteManyCreativeAssets = async (ids: string[]) => {
        const { error } = await supabase.from("creative_assets").delete().in("id", ids)
        if (error) {
            console.error("Error deleting creative assets:", error)
        } else {
            setCreativeAssets(prev => prev.filter(a => !ids.includes(a.id)))
        }
    }

    const replaceCreativeAssets = async (newAssets: Omit<CreativeAsset, "id" | "updatedAt">[]) => {
        const mapped = newAssets.map(a => ({
            project_id: a.projectId,
            company_name: a.companyName,
            website: a.website,
            product_link: a.productLink,
            product: a.product,
            script_status: a.scriptStatus,
            storyboard_status: a.storyboardStatus,
            animation_plan: a.animationPlan,
            wireframe_design_status: a.wireframeDesignStatus,
            website_status: a.websiteStatus,
            animation_status: a.animationStatus,
            deadline_for_delivery: a.deadlineForDelivery,
            time_duration: a.timeDuration,
            script_animation_plan_drive_link: a.scriptAnimationPlanDriveLink,
            animation_drive_link: a.animationDriveLink,
            figma_link: a.figmaLink,
            animation_hosted_link: a.animationHostedLink,
            mock_website_link: a.mockWebsiteLink,
            project_proposal_link: a.projectProposalLink,
            updated_at: new Date().toISOString()
        }))
        await supabase.from("creative_assets").insert(mapped)
    }

 
    const addTask = async (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
        const mapped = {
            project_id: task.projectId,
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            due_date: task.dueDate,
            assigned_to: task.assignedTo,
            related_type: task.relatedType,
            related_id: task.relatedId,
            created_by: task.createdBy,
            updated_at: new Date().toISOString()
        }
        const { data, error } = await supabase.from("tasks").insert([mapped]).select().single()
        if (error) {
            console.error("Error adding task:", error)
            return null
        }
        const newTask = {
            ...task,
            id: data.id,
            createdAt: data.created_at,
            updatedAt: data.updated_at
        } as Task
        setTasks(prev => [newTask, ...prev])
        return newTask
    }

    const updateTask = async (id: string, updates: Partial<Task>) => {
        const mapped: any = {}
        if (updates.projectId !== undefined) mapped.project_id = updates.projectId
        if (updates.title !== undefined) mapped.title = updates.title
        if (updates.description !== undefined) mapped.description = updates.description
        if (updates.status !== undefined) {
            mapped.status = updates.status
            if (updates.status === 'Completed') mapped.completed_at = new Date().toISOString()
        }
        if (updates.priority !== undefined) mapped.priority = updates.priority
        if (updates.dueDate !== undefined) mapped.due_date = updates.dueDate
        if (updates.assignedTo !== undefined) mapped.assigned_to = updates.assignedTo
        if (updates.relatedType !== undefined) mapped.related_type = updates.relatedType
        if (updates.relatedId !== undefined) mapped.related_id = updates.relatedId
        
        mapped.updated_at = new Date().toISOString()
        
        const { error } = await supabase.from("tasks").update(mapped).eq("id", id)
        if (error) {
            console.error("Error updating task:", error)
        } else {
            setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t))
        }
    }

    const deleteTask = async (id: string) => {
        const { error } = await supabase.from("tasks").delete().eq("id", id)
        if (error) {
            console.error("Error deleting task:", error)
        } else {
            setTasks(prev => prev.filter(t => t.id !== id))
        }
    }

    const deleteManyTasks = async (ids: string[]) => {
        const { error } = await supabase.from("tasks").delete().in("id", ids)
        if (error) {
            console.error("Error deleting tasks:", error)
        } else {
            setTasks(prev => prev.filter(t => !ids.includes(t.id)))
        }
    }

    const addTag = async (tag: Omit<Tag, "id">) => {
        const { data, error } = await supabase.from("tags").insert([tag]).select().single()
        if (error) {
            console.error("Error adding tag:", error)
            return null
        }
        const newTag = data as Tag
        setTags(prev => [...prev, newTag])
        return newTag
    }

    const deleteTag = async (id: string) => {
        const { error } = await supabase.from("tags").delete().eq("id", id)
        if (error) {
            console.error("Error deleting tag:", error)
        } else {
            setTags(prev => prev.filter(t => t.id !== id))
        }
    }

    // ── Team Member Update ──────────────────────────────────
    const updateTeamMember = async (id: string, updates: Partial<TeamMember>) => {
        const mapped: any = {}
        if (updates.name !== undefined) mapped.name = updates.name
        if (updates.email !== undefined) mapped.email = updates.email
        if (updates.role !== undefined) mapped.role = updates.role
        if (updates.userRole !== undefined) mapped.user_role = updates.userRole
        if (updates.status !== undefined) mapped.status = updates.status
        if (updates.avatar !== undefined) mapped.avatar = updates.avatar
        if (updates.menuPermissions !== undefined) mapped.menu_permissions = updates.menuPermissions
        
        // permissions is stored as-is jsonb
        if ((updates as any).permissions !== undefined) mapped.permissions = (updates as any).permissions
        mapped.updated_at = new Date().toISOString()
        const { error } = await supabase.from("profiles").update(mapped).eq("id", id)
        if (error) {
            console.error("Error updating team member (profile):", error)
        } else {
            setTeamMembers(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
            if (currentUser?.id === id) {
                setCurrentUser({ ...currentUser, ...updates } as any)
            }
        }
    }

    // ── Custom Schemas CRUD ─────────────────────────────────
    const addCustomSchema = async (schema: Omit<CustomSchema, "id" | "createdAt" | "updatedAt">) => {
        const mapped = {
            name: schema.name,
            description: schema.description,
            icon: schema.icon,
            color: schema.color,
            columns: schema.columns,
            created_by: schema.createdBy,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
        const { data, error } = await supabase.from("custom_schemas").insert([mapped]).select().single()
        if (error) { console.error("Error adding custom schema:", error); return null }
        const newSchema = {
            ...schema,
            id: data.id,
            createdAt: data.created_at,
            updatedAt: data.updated_at
        } as CustomSchema
        setCustomSchemas(prev => [newSchema, ...prev])
        return newSchema
    }

    const updateCustomSchema = async (id: string, updates: Partial<CustomSchema>) => {
        const mapped: any = {}
        if (updates.name !== undefined) mapped.name = updates.name
        if (updates.description !== undefined) mapped.description = updates.description
        if (updates.icon !== undefined) mapped.icon = updates.icon
        if (updates.color !== undefined) mapped.color = updates.color
        if (updates.columns !== undefined) mapped.columns = updates.columns
        mapped.updated_at = new Date().toISOString()
        const { error } = await supabase.from("custom_schemas").update(mapped).eq("id", id)
        if (error) {
            console.error("Error updating custom schema:", error)
        } else {
            setCustomSchemas(prev => prev.map(s => s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s))
        }
    }

    const deleteCustomSchema = async (id: string) => {
        const { error } = await supabase.from("custom_schemas").delete().eq("id", id)
        if (error) {
            console.error("Error deleting custom schema:", error)
        } else {
            setCustomSchemas(prev => prev.filter(s => s.id !== id))
        }
    }

    // ── Custom Records CRUD ─────────────────────────────────
    const addCustomRecord = async (record: Omit<CustomRecord, "id" | "createdAt" | "updatedAt">) => {
        const mapped = {
            schema_id: record.schemaId,
            data: record.data,
            created_by: record.createdBy,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
        const { data, error } = await supabase.from("custom_records").insert([mapped]).select().single()
        if (error) { console.error("Error adding custom record:", error); return null }
        const newRecord = {
            ...record,
            id: data.id,
            createdAt: data.created_at,
            updatedAt: data.updated_at
        } as CustomRecord
        setCustomRecords(prev => [newRecord, ...prev])
        return newRecord
    }

    const updateCustomRecord = async (id: string, updates: Partial<CustomRecord>) => {
        const mapped: any = {}
        if (updates.data !== undefined) mapped.data = updates.data
        mapped.updated_at = new Date().toISOString()
        const { error } = await supabase.from("custom_records").update(mapped).eq("id", id)
        if (error) {
            console.error("Error updating custom record:", error)
        } else {
            setCustomRecords(prev => prev.map(r => r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r))
        }
    }

    const deleteCustomRecord = async (id: string) => {
        const { error } = await supabase.from("custom_records").delete().eq("id", id)
        if (error) {
            console.error("Error deleting custom record:", error)
        } else {
            setCustomRecords(prev => prev.filter(r => r.id !== id))
        }
    }
    // ── LinkedIn Deal Engine CRUD ──────────────────────────
    const addLinkedinLead = async (lead: Omit<LinkedinLead, "id" | "updatedAt" | "dateAdded">) => {
        const mapped = {
            company_name: lead.companyName,
            contact_name: lead.contactName,
            profile_url: lead.profileUrl,
            work_email: lead.workEmail,
            lead_source: lead.leadSource,
            status: lead.status,
            priority: lead.priority,
            sent_time_ist: lead.sentTimeIST || '',
            drafted_content: lead.draftedContent || '',
            in_mail: lead.inMail || '',
            follow_up: lead.followUp || '',
            owner_id: lead.ownerId,
            notes: lead.notes,
            hook_angle: lead.hookAngle,
            date_added: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
        const { data, error } = await supabase.from("linkedin_leads").insert([mapped]).select().single()
        if (error) { console.error("Error adding linkedin lead:", error); return null }
        const newLead = {
            ...lead,
            id: data.id,
            dateAdded: data.date_added,
            updatedAt: data.updated_at
        } as LinkedinLead
        setLinkedinLeads(prev => [newLead, ...prev])
        return newLead
    }

    const updateLinkedinLead = async (id: string, updates: Partial<LinkedinLead>) => {
        const mapped: any = {}
        if (updates.companyName !== undefined) mapped.company_name = updates.companyName
        if (updates.contactName !== undefined) mapped.contact_name = updates.contactName
        if (updates.profileUrl !== undefined) mapped.profile_url = updates.profileUrl
        if (updates.workEmail !== undefined) mapped.work_email = updates.workEmail
        if (updates.leadSource !== undefined) mapped.lead_source = updates.leadSource
        if (updates.status !== undefined) mapped.status = updates.status
        if (updates.priority !== undefined) mapped.priority = updates.priority
        if (updates.sentTimeIST !== undefined) mapped.sent_time_ist = updates.sentTimeIST
        if (updates.draftedContent !== undefined) mapped.drafted_content = updates.draftedContent
        if (updates.inMail !== undefined) mapped.in_mail = updates.inMail
        if (updates.followUp !== undefined) mapped.follow_up = updates.followUp
        if (updates.ownerId !== undefined) mapped.owner_id = updates.ownerId
        if (updates.notes !== undefined) mapped.notes = updates.notes
        if (updates.hookAngle !== undefined) mapped.hook_angle = updates.hookAngle
        mapped.updated_at = new Date().toISOString()

        const { error } = await supabase.from("linkedin_leads").update(mapped).eq("id", id)
        if (error) {
            console.error("Error updating linkedin lead:", error)
        } else {
            setLinkedinLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l))
        }
    }

    const deleteLinkedinLead = async (id: string) => {
        const { error } = await supabase.from("linkedin_leads").delete().eq("id", id)
        if (error) {
            console.error("Error deleting linkedin lead:", error)
        } else {
            setLinkedinLeads(prev => prev.filter(l => l.id !== id))
        }
    }

    const addLinkedinInteraction = async (interaction: Omit<LinkedinInteraction, "id" | "timestamp">) => {
        const mapped = {
            lead_id: interaction.leadId,
            type: interaction.type,
            content: interaction.content,
            timestamp: new Date().toISOString()
        }
        const { data, error } = await supabase.from("linkedin_interactions").insert([mapped]).select().single()
        if (error) { console.error("Error adding interaction:", error); return null }
        const newInteraction = {
            ...interaction,
            id: data.id,
            timestamp: data.timestamp
        } as LinkedinInteraction
        setLinkedinInteractions(prev => [newInteraction, ...prev])
        
        // Update the lead's updatedAt timestamp
        const now = new Date().toISOString()
        updateLinkedinLead(interaction.leadId, { updatedAt: now })
        
        return newInteraction
    }

    const addLinkedinSequence = async (sequence: Omit<LinkedinSequence, "id">) => {
        const mapped = {
            name: sequence.name,
            target_persona: sequence.targetPersona,
            steps: sequence.steps,
            created_at: new Date().toISOString()
        }
        const { data, error } = await supabase.from("linkedin_sequences").insert([mapped]).select().single()
        if (error) { console.error("Error adding linkedin sequence:", error); return null }
        const newSeq = {
            ...sequence,
            id: data.id
        } as LinkedinSequence
        setLinkedinSequences(prev => [newSeq, ...prev])
        return newSeq
    }

    const updateLinkedinSequence = async (id: string, updates: Partial<LinkedinSequence>) => {
        const mapped: any = {}
        if (updates.name !== undefined) mapped.name = updates.name
        if (updates.targetPersona !== undefined) mapped.target_persona = updates.targetPersona
        if (updates.steps !== undefined) mapped.steps = updates.steps
        
        const { error } = await supabase.from("linkedin_sequences").update(mapped).eq("id", id)
        if (error) {
            console.error("Error updating linkedin sequence:", error)
        } else {
            setLinkedinSequences(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
        }
    }

    const deleteLinkedinSequence = async (id: string) => {
        const { error } = await supabase.from("linkedin_sequences").delete().eq("id", id)
        if (error) {
            console.error("Error deleting linkedin sequence:", error)
        } else {
            setLinkedinSequences(prev => prev.filter(s => s.id !== id))
        }
    }

    const resetData = () => {
        setProjects([])
        setLeads([])
        setManufacturers([])
        setTeamMembers([])
        setCampaigns([])
        setCreativeAssets([])
        setTags([])
        setCustomSchemas([])
        setCustomRecords([])
        setLinkedinLeads([])
        setLinkedinInteractions([])
        setLinkedinSequences([])
        setCurrentUser(null)
    }

    return (
        <CRMContext.Provider value={{
            projects, leads, manufacturers, teamMembers, campaigns, templates, sequences, inbox, creativeAssets, tasks, tags,
            customSchemas, customRecords,
            linkedinLeads, linkedinInteractions, linkedinSequences,
            isLoaded, connectionError,
            addProject, updateProject, deleteProject, duplicateProject,
            addLead, updateLead, deleteLead, deleteManyLeads, replaceLeads,
            addManufacturer, updateManufacturer, deleteManufacturer, deleteManyManufacturers, replaceManufacturers,
            addTeamMember, updateTeamMember, addCampaign, updateCampaign, deleteCampaign, deleteManyCampaigns,
            addTemplate, updateTemplate, deleteTemplate,
            addSequence, updateSequence, deleteSequence,
            addInboxMessage, updateInboxMessage,
            addCreativeAsset, updateCreativeAsset, deleteCreativeAsset, deleteManyCreativeAssets, replaceCreativeAssets,
            addTask, updateTask, deleteTask, deleteManyTasks,
            addTag, deleteTag, deleteTeamMember, deleteManyTeamMembers,
            addCustomSchema, updateCustomSchema, deleteCustomSchema,
            addCustomRecord, updateCustomRecord, deleteCustomRecord,
            addLinkedinLead, updateLinkedinLead, deleteLinkedinLead,
            addLinkedinInteraction, addLinkedinSequence, updateLinkedinSequence, deleteLinkedinSequence,
            resetData,
            currentUser,
            setCurrentUser
        }}>
            {children}
        </CRMContext.Provider>
    )
}

export function useCRM() {
    const context = useContext(CRMContext)
    if (context === undefined) {
        throw new Error("useCRM must be used within a CRMProvider")
    }
    return context
}
