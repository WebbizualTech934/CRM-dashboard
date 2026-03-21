# Global CRM — Complete Supabase SQL Schema

Copy and paste the **entire block** below into your [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql/new) and click **Run**.

> [!CAUTION]
> This script **DROPS and RECREATES** all tables. All existing data will be lost. Run once on a fresh project.

```sql
-- ============================================================
-- 0. DROP EXISTING TABLES (clean slate)
-- ============================================================
DROP TABLE IF EXISTS public.custom_records CASCADE;
DROP TABLE IF EXISTS public.custom_schemas CASCADE;
DROP TABLE IF EXISTS public.role_permissions CASCADE;
DROP TABLE IF EXISTS public.email_messages CASCADE;
DROP TABLE IF EXISTS public.email_sequences CASCADE;
DROP TABLE IF EXISTS public.email_templates CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.creative_assets CASCADE;
DROP TABLE IF EXISTS public.campaigns CASCADE;
DROP TABLE IF EXISTS public.manufacturers CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.tags CASCADE;

-- ============================================================
-- 1. PROJECTS
-- ============================================================
CREATE TABLE public.projects (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name          text NOT NULL,
  description   text DEFAULT '',
  leads         integer DEFAULT 0,
  status        text CHECK (status IN ('Active','Paused','Draft','Archived')) DEFAULT 'Active',
  team_member_ids text[] DEFAULT '{}',
  type          text DEFAULT 'General',
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- ============================================================
-- 2. LEADS
-- ============================================================
CREATE TABLE public.leads (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name      text DEFAULT '',
  last_name       text DEFAULT '',
  email           text DEFAULT '',
  company         text DEFAULT '',
  job_title       text DEFAULT '',
  speciality      text DEFAULT '',
  sub_speciality  text DEFAULT '',
  company_size    text DEFAULT '',
  country         text DEFAULT '',
  service_interest text DEFAULT '',
  message         text DEFAULT '',
  status          text DEFAULT 'New',
  priority        text DEFAULT 'Medium',
  assigned_to     text DEFAULT '',
  last_contact    date DEFAULT CURRENT_DATE,
  project_id      uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  phone           text DEFAULT '',
  website         text DEFAULT '',
  website_link    text DEFAULT '',
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- ============================================================
-- 3. MANUFACTURERS
-- ============================================================
CREATE TABLE public.manufacturers (
  id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date                date DEFAULT CURRENT_DATE,
  parent_company      text DEFAULT '',
  peer_brand          text DEFAULT '',
  product_match_rate  text DEFAULT '',
  website             text DEFAULT '',
  company_size        text DEFAULT '',
  country             text DEFAULT '',
  fit_level           text DEFAULT '',
  linkedin            text DEFAULT '',
  visual_presence     text DEFAULT '',
  note                text DEFAULT '',
  decision_maker      text DEFAULT '',
  lead_by             text DEFAULT '',
  project_id          uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

-- ============================================================
-- 4. TEAM MEMBERS  (with role + permissions)
-- ============================================================
CREATE TABLE public.team_members (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name         text NOT NULL,
  email        text UNIQUE NOT NULL,
  role         text DEFAULT '',                          -- display role e.g. "Senior SDR"
  user_role    text CHECK (user_role IN ('Admin','Manager','SDR','Specialist','Viewer')) DEFAULT 'Viewer',
  status       text CHECK (status IN ('Active','Invited','Suspended','Removed')) DEFAULT 'Active',
  leads_added  integer DEFAULT 0,
  emails_sent  integer DEFAULT 0,
  avatar       text DEFAULT '',
  last_active  timestamptz DEFAULT now(),
  -- Granular permissions set by Admin
  permissions  jsonb DEFAULT '{
    "canViewLeads":      true,
    "canEditLeads":      false,
    "canDeleteLeads":    false,
    "canViewProjects":   true,
    "canEditProjects":   false,
    "canDeleteProjects": false,
    "canViewEmails":     true,
    "canSendEmails":     false,
    "canViewTeam":       true,
    "canManageTeam":     false,
    "canViewReports":    true,
    "canExportData":     false,
    "canManageSettings": false
  }',
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- ============================================================
-- 5. TAGS
-- ============================================================
CREATE TABLE public.tags (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name       text NOT NULL,
  color      text DEFAULT '#6366f1',
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- 6. EMAIL TEMPLATES
-- ============================================================
CREATE TABLE public.email_templates (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name       text NOT NULL,
  subject    text DEFAULT '',
  body       text DEFAULT '',
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 7. EMAIL SEQUENCES
-- ============================================================
CREATE TABLE public.email_sequences (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name       text NOT NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  -- steps stored as JSON array: [{id, templateId, waitDays, order}]
  steps      jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 8. CAMPAIGNS
-- ============================================================
CREATE TABLE public.campaigns (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id    uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  name          text NOT NULL,
  subject       text DEFAULT '',
  status        text CHECK (status IN ('Active','Sent','Paused','Draft','Completed')) DEFAULT 'Draft',
  leads_count   integer DEFAULT 0,
  recipients    integer DEFAULT 0,
  emails_sent   integer DEFAULT 0,
  opens         integer DEFAULT 0,
  replies       integer DEFAULT 0,
  positives     integer DEFAULT 0,
  bounces       integer DEFAULT 0,
  meetings      integer DEFAULT 0,
  tags          text[] DEFAULT '{}',
  sequence_id   uuid REFERENCES public.email_sequences(id) ON DELETE SET NULL,
  owner         text DEFAULT '',
  last_activity timestamptz DEFAULT now(),
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- ============================================================
-- 9. EMAIL MESSAGES  (inbox threads)
-- ============================================================
CREATE TABLE public.email_messages (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id     uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  campaign_id uuid REFERENCES public.campaigns(id) ON DELETE CASCADE,
  template_id uuid REFERENCES public.email_templates(id) ON DELETE SET NULL,
  thread_id   text NOT NULL DEFAULT gen_random_uuid()::text,
  subject     text DEFAULT '',
  body        text DEFAULT '',
  status      text CHECK (status IN ('Sent','Replied','Interested','Not Interested','Meeting Booked')) DEFAULT 'Sent',
  direction   text CHECK (direction IN ('Outgoing','Incoming')) DEFAULT 'Outgoing',
  sent_at     timestamptz DEFAULT now()
);

-- ============================================================
-- 10. CREATIVE ASSETS
-- ============================================================
CREATE TABLE public.creative_assets (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id        uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  company_name      text NOT NULL,
  contact_person    text DEFAULT '',
  email             text DEFAULT '',
  status            text DEFAULT 'Pending',
  priority          text DEFAULT 'Medium',
  last_contact      date DEFAULT CURRENT_DATE,
  design_status     text DEFAULT 'Pending',
  website_status    text DEFAULT 'Pending',
  animation_status  text DEFAULT 'Pending',
  storyboard_status text DEFAULT 'Pending',
  script_status     text DEFAULT 'Pending',
  design_link       text DEFAULT '',
  website_link      text DEFAULT '',
  animation_link    text DEFAULT '',
  preview_url       text DEFAULT '',
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

-- ============================================================
-- 11. TASKS
-- ============================================================
CREATE TABLE public.tasks (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id   uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  title        text NOT NULL,
  description  text DEFAULT '',
  status       text CHECK (status IN ('Todo','In Progress','Waiting','Review','Completed','Blocked','Cancelled')) DEFAULT 'Todo',
  priority     text CHECK (priority IN ('Low','Medium','High','Urgent')) DEFAULT 'Medium',
  due_date     date,
  assigned_to  text DEFAULT '',
  related_type text,   -- 'lead' | 'manufacturer' | 'outreach' | 'creative'
  related_id   uuid,
  created_by   text DEFAULT '',
  completed_at timestamptz,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- ============================================================
-- 12. CUSTOM SCHEMAS  (user-defined table definitions)
-- ============================================================
CREATE TABLE public.custom_schemas (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text NOT NULL,                             -- e.g. "Event Attendees"
  description text DEFAULT '',
  icon        text DEFAULT 'Table',                     -- Lucide icon name
  color       text DEFAULT '#6366f1',
  -- columns: [{id, name, type, required, options}]
  -- type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'url' | 'email'
  columns     jsonb NOT NULL DEFAULT '[]',
  created_by  text DEFAULT '',
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- ============================================================
-- 13. CUSTOM RECORDS  (rows for user-defined tables)
-- ============================================================
CREATE TABLE public.custom_records (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  schema_id  uuid NOT NULL REFERENCES public.custom_schemas(id) ON DELETE CASCADE,
  -- data is a flexible JSON object matching the schema's columns
  data       jsonb NOT NULL DEFAULT '{}',
  created_by text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 14. ENABLE ROW LEVEL SECURITY (open for now — requires auth later)
-- ============================================================
ALTER TABLE public.projects         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manufacturers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sequences  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_messages   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_assets  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_schemas   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_records   ENABLE ROW LEVEL SECURITY;

-- Allow all (no auth yet — replace with user-specific policies when auth is added)
CREATE POLICY "Allow all on projects"        ON public.projects        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on leads"           ON public.leads           FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on manufacturers"   ON public.manufacturers   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on team_members"    ON public.team_members    FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on tags"            ON public.tags            FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on email_templates" ON public.email_templates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on email_sequences" ON public.email_sequences FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on campaigns"       ON public.campaigns       FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on email_messages"  ON public.email_messages  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on creative_assets" ON public.creative_assets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on tasks"           ON public.tasks           FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on custom_schemas"  ON public.custom_schemas  FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE public.custom_schemas FORCE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on custom_records"  ON public.custom_records  FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 15. ENABLE REALTIME  (run each line individually if you hit errors)
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.manufacturers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.team_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tags;
ALTER PUBLICATION supabase_realtime ADD TABLE public.email_templates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.email_sequences;
ALTER PUBLICATION supabase_realtime ADD TABLE public.campaigns;
ALTER PUBLICATION supabase_realtime ADD TABLE public.email_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.creative_assets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.custom_schemas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.custom_records;

-- ============================================================
-- 16. SEED: Default Admin Team Member
-- ============================================================
INSERT INTO public.team_members (name, email, role, user_role, status, permissions) VALUES (
  'Admin',
  'admin@crm.local',
  'Administrator',
  'Admin',
  'Active',
  '{
    "canViewLeads":      true,
    "canEditLeads":      true,
    "canDeleteLeads":    true,
    "canViewProjects":   true,
    "canEditProjects":   true,
    "canDeleteProjects": true,
    "canViewEmails":     true,
    "canSendEmails":     true,
    "canViewTeam":       true,
    "canManageTeam":     true,
    "canViewReports":    true,
    "canExportData":     true,
    "canManageSettings": true
  }'
);
```

---

## Troubleshooting

If you see `duplicate key` errors on the `ALTER PUBLICATION` lines, that means realtime was already enabled for those tables — you can safely ignore those errors.

If you see **RLS policy already exists** errors, either drop old policies first or skip step 14.
