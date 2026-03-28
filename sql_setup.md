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
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.linkedin_leads CASCADE;
DROP TABLE IF EXISTS public.linkedin_interactions CASCADE;
DROP TABLE IF EXISTS public.linkedin_sequences CASCADE;
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
-- 4. PROFILES (Users/Team Members)
-- ============================================================
CREATE TABLE public.profiles (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name    text NOT NULL,
  email        text UNIQUE NOT NULL,
  role         text DEFAULT '',
  user_role    text CHECK (user_role IN ('Admin','Manager','SDR','Specialist','Viewer')) DEFAULT 'Viewer',
  status       text CHECK (status IN ('Active','Invited','Suspended','Removed')) DEFAULT 'Active',
  leads_added  integer DEFAULT 0,
  emails_sent  integer DEFAULT 0,
  avatar_url   text DEFAULT '',
  last_active  timestamptz DEFAULT now(),
  menu_permissions jsonb DEFAULT '["dashboard", "projects", "leads", "emails", "custom-tables", "team"]',
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
-- 14. LINKEDIN DEAL ENGINE: LEADS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.linkedin_leads (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date_added      timestamptz DEFAULT now(),
  company_name    text DEFAULT '',
  contact_name    text DEFAULT '',
  profile_url     text DEFAULT '',
  work_email      text DEFAULT '',
  lead_source     text DEFAULT 'LinkedIn',
  status          text DEFAULT 'Not Contacted',
  priority        text DEFAULT 'Medium',
  sent_time_ist   text DEFAULT '',
  drafted_content text DEFAULT '',
  in_mail         text DEFAULT '',
  follow_up       text DEFAULT '',
  owner_id        uuid REFERENCES public.profiles(id),
  notes           text DEFAULT '',
  hook_angle      text DEFAULT '',
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- ============================================================
-- 15. LINKEDIN DEAL ENGINE: INTERACTIONS (TIMELINE)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.linkedin_interactions (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id         uuid REFERENCES public.linkedin_leads(id) ON DELETE CASCADE,
  type            text NOT NULL,
  content         text DEFAULT '',
  timestamp       timestamptz DEFAULT now(),
  created_at      timestamptz DEFAULT now()
);

-- ============================================================
-- 16. LINKEDIN DEAL ENGINE: SEQUENCES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.linkedin_sequences (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name            text NOT NULL,
  target_persona  text DEFAULT '',
  steps           jsonb NOT NULL DEFAULT '[]',
  created_at      timestamptz DEFAULT now()
);


-- ============================================================
-- 14. ENABLE ROW LEVEL SECURITY (open for now — requires auth later)
-- ============================================================
ALTER TABLE public.projects         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manufacturers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sequences  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_messages   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_assets  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_schemas   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_records   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linkedin_leads    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linkedin_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linkedin_sequences ENABLE ROW LEVEL SECURITY;

-- Allow all (no auth yet — replace with user-specific policies when auth is added)
CREATE POLICY "Allow all on projects"        ON public.projects        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on leads"           ON public.leads           FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on manufacturers"   ON public.manufacturers   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on profiles"        ON public.profiles        FOR ALL USING (true) WITH CHECK (true);
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
CREATE POLICY "Allow all on linkedin_leads" ON public.linkedin_leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on linkedin_interactions" ON public.linkedin_interactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on linkedin_sequences" ON public.linkedin_sequences FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 15. ENABLE REALTIME  (run each line individually if you hit errors)
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.manufacturers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tags;
ALTER PUBLICATION supabase_realtime ADD TABLE public.email_templates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.email_sequences;
ALTER PUBLICATION supabase_realtime ADD TABLE public.campaigns;
ALTER PUBLICATION supabase_realtime ADD TABLE public.email_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.creative_assets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.custom_schemas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.custom_records;
ALTER PUBLICATION supabase_realtime ADD TABLE public.linkedin_leads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.linkedin_interactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.linkedin_sequences;

-- ============================================================
-- 16. SEED: Default Admin Profile
-- ============================================================
INSERT INTO public.profiles (full_name, email, role, user_role, status, menu_permissions) VALUES (
  'Admin',
  'admin@crm.local',
  'Administrator',
  'Admin',
  'Active',
  '["dashboard", "projects", "emails", "leads", "team", "custom-tables", "settings"]'
);

-- ============================================================
-- 17. LINKEDIN SCHEMA MIGRATION (RUN IF TABLE ALREADY EXISTS)
-- ============================================================
-- These commands ensure existing LinkedIn tables have the latest outreach columns.
-- Copy and run these in your Supabase SQL Editor if you encounter save errors.

ALTER TABLE IF EXISTS public.linkedin_leads 
ADD COLUMN IF NOT EXISTS sent_time_ist TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS drafted_content TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS in_mail TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS follow_up TEXT DEFAULT '';