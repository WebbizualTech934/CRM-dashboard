"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

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
    userRole: 'Admin' | 'Manager' | 'SDR' | 'Specialist' | 'Viewer'
    status: string
    leadsAdded: number
    emailsSent: number
    avatar?: string
    lastActive?: string
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

export interface Campaign {
    id: string
    projectId: string
    name: string
    subject: string
    to: string
    cc?: string
    tags: string[]
    status: "Sent" | "Draft" | "Completed"
    recipients: number
    opens: number
    replies: number
    updatedAt: string
}

export interface CreativeAsset {
    id: string
    projectId: string
    companyName: string
    contactPerson?: string
    email?: string
    status: string
    priority: string
    lastContact: string
    designStatus: "Pending" | "Completed Designs"
    websiteStatus: "Pending" | "Live Website"
    animationStatus: "Pending" | "Completed Animation"
    storyboardStatus: "Pending" | "Completed"
    scriptStatus: "Pending" | "Completed"
    designLink?: string
    websiteLink?: string
    animationLink?: string
    previewUrl?: string
    updatedAt: string
}

interface CRMContextType {
    projects: Project[]
    leads: Lead[]
    manufacturers: Manufacturer[]
    teamMembers: TeamMember[]
    campaigns: Campaign[]
    creativeAssets: CreativeAsset[]
    tasks: Task[]
    tags: Tag[]
    isLoaded: boolean
    connectionError: string | null
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
    replaceCampaigns: (campaigns: Omit<Campaign, "id" | "updatedAt">[]) => Promise<void>
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
    resetData: () => void
}

const CRMContext = createContext<CRMContextType | undefined>(undefined)

export function CRMProvider({ children }: { children: React.ReactNode }) {
    const [projects, setProjects] = useState<Project[]>([])
    const [leads, setLeads] = useState<Lead[]>([])
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([])
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [creativeAssets, setCreativeAssets] = useState<CreativeAsset[]>([])
    const [tasks, setTasks] = useState<Task[]>([])
    const [tags, setTags] = useState<Tag[]>([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [connectionError, setConnectionError] = useState<string | null>(null)

    // Initial Fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    { data: projectsData, error: pErr },
                    { data: leadsData, error: lErr },
                    { data: manufacturersData, error: mErr },
                    { data: teamData, error: tErr },
                    { data: campaignsData, error: cErr },
                    { data: assetsData, error: aErr },
                    { data: tasksData, error: tsErr },
                    { data: tagsData, error: tgErr }
                ] = await Promise.all([
                    supabase.from("projects").select("*").order("updated_at", { ascending: false }),
                    supabase.from("leads").select("*").order("id", { ascending: false }),
                    supabase.from("manufacturers").select("*").order("id", { ascending: false }),
                    supabase.from("team_members").select("*"),
                    supabase.from("campaigns").select("*").order("updated_at", { ascending: false }),
                    supabase.from("creative_assets").select("*").order("updated_at", { ascending: false }),
                    supabase.from("tasks").select("*").order("updated_at", { ascending: false }),
                    supabase.from("tags").select("*")
                ])

                const errors = [pErr, lErr, mErr, tErr, cErr, aErr, tsErr, tgErr].filter(Boolean)
                if (errors.length > 0) {
                    console.error("Supabase fetch errors:", errors)
                    setConnectionError(errors[0]?.message || "Unknown connection error")
                }

                if (projectsData) {
                    setProjects(projectsData.map((p: any) => ({
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
                    setLeads(leadsData.map((l: any) => ({
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
                    setTeamMembers(teamData.map((t: any) => ({
                        id: t.id,
                        name: t.name,
                        email: t.email,
                        role: t.role,
                        userRole: t.user_role as any,
                        status: t.status,
                        leadsAdded: t.leads_added,
                        emailsSent: t.emails_sent,
                        avatar: t.avatar,
                        lastActive: t.last_active
                    })))
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
                        subject: c.subject,
                        to: c.target_to,
                        cc: c.target_cc,
                        tags: c.tags,
                        status: c.status,
                        recipients: c.recipients,
                        opens: c.opens,
                        replies: c.replies,
                        updatedAt: c.updated_at
                    })))
                }
                if (assetsData) {
                    setCreativeAssets(assetsData.map((a: any) => ({
                        id: a.id,
                        projectId: a.project_id,
                        companyName: a.company_name,
                        contactPerson: a.contact_person,
                        email: a.email,
                        status: a.status,
                        priority: a.priority,
                        lastContact: a.last_contact,
                        designStatus: a.design_status,
                        websiteStatus: a.website_status,
                        animationStatus: a.animation_status || "Pending",
                        storyboardStatus: a.storyboard_status || "Pending",
                        scriptStatus: a.script_status || "Pending",
                        updatedAt: a.updated_at
                    })))
                }
                if (tagsData) setTags(tagsData)
                
                setIsLoaded(true)
            } catch (err: any) {
                console.error("Fetch error:", err)
                setConnectionError(err.message || "Failed to fetch data")
                setIsLoaded(true)
            }
        }

        fetchData()

        // Real-time subscriptions
        const channel = supabase.channel("schema-db-changes")
            .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, () => fetchData())
            .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, () => fetchData())
            .on("postgres_changes", { event: "*", schema: "public", table: "manufacturers" }, () => fetchData())
            .on("postgres_changes", { event: "*", schema: "public", table: "team_members" }, () => fetchData())
            .on("postgres_changes", { event: "*", schema: "public", table: "campaigns" }, () => fetchData())
            .on("postgres_changes", { event: "*", schema: "public", table: "creative_assets" }, () => fetchData())
            .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, () => fetchData())
            .on("postgres_changes", { event: "*", schema: "public", table: "tags" }, () => fetchData())
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
        return {
            ...data,
            teamMemberIds: data.team_member_ids,
            updatedAt: data.updated_at
        } as Project
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
        if (error) console.error("Error updating project:", error)
    }

    const deleteProject = async (id: string) => {
        const { error } = await supabase.from("projects").delete().eq("id", id)
        if (error) console.error("Error deleting project:", error)
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
        return {
            ...lead,
            id: data.id,
            lastContact: data.last_contact,
            projectId: data.project_id
        } as Lead
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
        if (error) console.error("Error updating lead:", error)
    }

    const deleteLead = async (id: string) => {
        const { error } = await supabase.from("leads").delete().eq("id", id)
        if (error) console.error("Error deleting lead:", error)
    }

    const deleteManyLeads = async (ids: string[]) => {
        const { error } = await supabase.from("leads").delete().in("id", ids)
        if (error) console.error("Error deleting leads:", error)
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
        return {
            ...m,
            id: data.id,
            projectId: data.project_id
        } as Manufacturer
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
        if (error) console.error("Error updating manufacturer:", error)
    }

    const deleteManufacturer = async (id: string) => {
        const { error } = await supabase.from("manufacturers").delete().eq("id", id)
        if (error) console.error("Error deleting manufacturer:", error)
    }

    const deleteManyManufacturers = async (ids: string[]) => {
        const { error } = await supabase.from("manufacturers").delete().in("id", ids)
        if (error) console.error("Error deleting manufacturers:", error)
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
        const mapped = {
            name: member.name,
            email: member.email,
            role: member.role,
            status: member.status,
            leads_added: 0,
            emails_sent: 0,
            avatar: member.avatar,
            updated_at: new Date().toISOString()
        }
        const { data, error } = await supabase.from("team_members").insert([mapped]).select().single()
        if (error) {
            console.error("Error adding team member:", error)
            return null
        }
        return {
            ...member,
            id: data.id,
            leadsAdded: data.leads_added,
            emailsSent: data.emails_sent
        } as TeamMember
    }

    const deleteTeamMember = async (id: string) => {
        const { error } = await supabase.from("team_members").delete().eq("id", id)
        if (error) console.error("Error deleting team member:", error)
    }

    const deleteManyTeamMembers = async (ids: string[]) => {
        const { error } = await supabase.from("team_members").delete().in("id", ids)
        if (error) console.error("Error deleting team members:", error)
    }

    const addCampaign = async (campaign: Omit<Campaign, "id" | "updatedAt">) => {
        const mapped = {
            project_id: campaign.projectId,
            name: campaign.name,
            subject: campaign.subject,
            target_to: campaign.to,
            target_cc: campaign.cc,
            tags: campaign.tags,
            status: campaign.status,
            recipients: campaign.recipients,
            opens: campaign.opens,
            replies: campaign.replies,
            updated_at: new Date().toISOString()
        }

        const { data, error } = await supabase.from("campaigns").insert([mapped]).select().single()
        if (error) {
            console.error("Error adding campaign:", error)
            return null
        }
        return {
            ...campaign,
            id: data.id,
            projectId: data.project_id,
            updatedAt: data.updated_at
        } as Campaign
    }

    const updateCampaign = async (id: string, updates: Partial<Campaign>) => {
        const mapped: any = {}
        if (updates.name !== undefined) mapped.name = updates.name
        if (updates.subject !== undefined) mapped.subject = updates.subject
        if (updates.to !== undefined) mapped.target_to = updates.to
        if (updates.cc !== undefined) mapped.target_cc = updates.cc
        if (updates.tags !== undefined) mapped.tags = updates.tags
        if (updates.status !== undefined) mapped.status = updates.status
        if (updates.recipients !== undefined) mapped.recipients = updates.recipients
        if (updates.opens !== undefined) mapped.opens = updates.opens
        if (updates.replies !== undefined) mapped.replies = updates.replies
        if (updates.projectId !== undefined) mapped.project_id = updates.projectId
        
        mapped.updated_at = new Date().toISOString()

        const { error } = await supabase.from("campaigns").update(mapped).eq("id", id)
        if (error) console.error("Error updating campaign:", error)
    }

    const deleteCampaign = async (id: string) => {
        const { error } = await supabase.from("campaigns").delete().eq("id", id)
        if (error) console.error("Error deleting campaign:", error)
    }

    const deleteManyCampaigns = async (ids: string[]) => {
        const { error } = await supabase.from("campaigns").delete().in("id", ids)
        if (error) console.error("Error deleting campaigns:", error)
    }

    const replaceCampaigns = async (newCampaigns: Omit<Campaign, "id" | "updatedAt">[]) => {
        const mapped = newCampaigns.map(c => ({
            project_id: c.projectId,
            name: c.name,
            subject: c.subject,
            target_to: c.to,
            target_cc: c.cc,
            tags: c.tags,
            status: c.status,
            recipients: c.recipients,
            opens: c.opens,
            replies: c.replies,
            updated_at: new Date().toISOString()
        }))
        await supabase.from("campaigns").insert(mapped)
    }

    const addCreativeAsset = async (asset: Omit<CreativeAsset, "id" | "updatedAt">) => {
        const mapped = {
            project_id: asset.projectId,
            company_name: asset.companyName,
            contact_person: asset.contactPerson,
            email: asset.email,
            status: asset.status,
            priority: asset.priority,
            last_contact: asset.lastContact,
            design_status: asset.designStatus,
            website_status: asset.websiteStatus,
            animation_status: asset.animationStatus,
            storyboard_status: asset.storyboardStatus,
            script_status: asset.scriptStatus,
            updated_at: new Date().toISOString()
        }

        const { data, error } = await supabase.from("creative_assets").insert([mapped]).select().single()
        if (error) {
            console.error("Error adding creative asset:", error)
            return null
        }
        return {
            ...asset,
            id: data.id,
            projectId: data.project_id,
            updatedAt: data.updated_at
        } as CreativeAsset
    }

    const updateCreativeAsset = async (id: string, updates: Partial<CreativeAsset>) => {
        const mapped: any = {}
        if (updates.companyName !== undefined) mapped.company_name = updates.companyName
        if (updates.contactPerson !== undefined) mapped.contact_person = updates.contactPerson
        if (updates.email !== undefined) mapped.email = updates.email
        if (updates.status !== undefined) mapped.status = updates.status
        if (updates.priority !== undefined) mapped.priority = updates.priority
        if (updates.lastContact !== undefined) mapped.last_contact = updates.lastContact
        if (updates.designStatus !== undefined) mapped.design_status = updates.designStatus
        if (updates.websiteStatus !== undefined) mapped.website_status = updates.websiteStatus
        if (updates.projectId !== undefined) mapped.project_id = updates.projectId
        
        mapped.updated_at = new Date().toISOString()
        
        const { error } = await supabase.from("creative_assets").update(mapped).eq("id", id)
        if (error) console.error("Error updating creative asset:", error)
    }

    const deleteCreativeAsset = async (id: string) => {
        const { error } = await supabase.from("creative_assets").delete().eq("id", id)
        if (error) console.error("Error deleting creative asset:", error)
    }

    const deleteManyCreativeAssets = async (ids: string[]) => {
        const { error } = await supabase.from("creative_assets").delete().in("id", ids)
        if (error) console.error("Error deleting creative assets:", error)
    }

    const replaceCreativeAssets = async (newAssets: Omit<CreativeAsset, "id" | "updatedAt">[]) => {
        const mapped = newAssets.map(a => ({
            project_id: a.projectId,
            company_name: a.companyName,
            contact_person: a.contactPerson,
            email: a.email,
            status: a.status,
            priority: a.priority,
            last_contact: a.lastContact,
            design_status: a.designStatus,
            website_status: a.websiteStatus,
            animation_status: a.animationStatus,
            storyboard_status: a.storyboardStatus,
            script_status: a.scriptStatus,
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
        return {
            ...task,
            id: data.id,
            createdAt: data.created_at,
            updatedAt: data.updated_at
        } as Task
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
        if (error) console.error("Error updating task:", error)
    }

    const deleteTask = async (id: string) => {
        const { error } = await supabase.from("tasks").delete().eq("id", id)
        if (error) console.error("Error deleting task:", error)
    }

    const deleteManyTasks = async (ids: string[]) => {
        const { error } = await supabase.from("tasks").delete().in("id", ids)
        if (error) console.error("Error deleting tasks:", error)
    }

    const addTag = async (tag: Omit<Tag, "id">) => {
        const { data } = await supabase.from("tags").insert([tag]).select().single()
        return data as Tag
    }

    const deleteTag = async (id: string) => {
        await supabase.from("tags").delete().eq("id", id)
    }

    const resetData = () => {
        // This might be destructive in a real backend, so we'll just clear the local state for now
        // or we could implement a complete wipe if that's what's intended for a reset
        setProjects([])
        setLeads([])
        setManufacturers([])
        setTeamMembers([])
        setCampaigns([])
        setCreativeAssets([])
        setTags([])
    }

    return (
        <CRMContext.Provider value={{
            projects, leads, manufacturers, teamMembers, campaigns, creativeAssets, tasks, tags, isLoaded, connectionError,
            addProject, updateProject, deleteProject, duplicateProject,
            addLead, updateLead, deleteLead, deleteManyLeads, replaceLeads,
            addManufacturer, updateManufacturer, deleteManufacturer, deleteManyManufacturers, replaceManufacturers,
            addTeamMember, addCampaign, updateCampaign, deleteCampaign, deleteManyCampaigns, replaceCampaigns,
            addCreativeAsset, updateCreativeAsset, deleteCreativeAsset, deleteManyCreativeAssets, replaceCreativeAssets,
            addTask, updateTask, deleteTask, deleteManyTasks,
            addTag, deleteTag, deleteTeamMember, deleteManyTeamMembers, resetData
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
