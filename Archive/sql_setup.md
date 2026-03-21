# Standardized SQL Setup for CRM Dashboard

Copy and paste the entire block below into your [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql). 

> [!IMPORTANT]
> This script will **DROP and recreate** your tables to ensure a clean, consistent schema. **Existing data will be lost.** 

```sql
-- Clean up existing tables (ORDER MATTERS: Dependents first)
DROP TABLE IF EXISTS public.tasks;
DROP TABLE IF EXISTS public.creative_assets;
DROP TABLE IF EXISTS public.email_messages;
DROP TABLE IF EXISTS public.campaigns CASCADE; -- Drop campaigns first as it depends on sequences/projects
DROP TABLE IF EXISTS public.email_sequences;
DROP TABLE IF EXISTS public.email_templates;
DROP TABLE IF EXISTS public.custom_records;
DROP TABLE IF EXISTS public.custom_schemas;
DROP TABLE IF EXISTS public.manufacturers;
DROP TABLE IF EXISTS public.leads;
DROP TABLE IF EXISTS public.team_members;
DROP TABLE IF EXISTS public.projects;
DROP TABLE IF EXISTS public.tags;

-- 1. Projects Table
CREATE TABLE public.projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  leads integer DEFAULT 0,
  status text CHECK (status IN ('Active', 'Paused', 'Draft', 'Archived')) DEFAULT 'Draft',
  team_member_ids text[] DEFAULT '{}',
  type text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 2. Leads Table
CREATE TABLE public.leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name text,
  last_name text,
  email text,
  company text,
  job_title text,
  speciality text,
  sub_speciality text,
  company_size text,
  country text,
  service_interest text,
  message text,
  status text DEFAULT 'New',
  priority text DEFAULT 'Medium',
  assigned_to text,
  last_contact date,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  phone text,
  website text,
  website_link text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 3. Manufacturers Table
CREATE TABLE public.manufacturers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date date,
  parent_company text,
  peer_brand text,
  product_match_rate text,
  website text,
  company_size text,
  country text,
  fit_level text,
  linkedin text,
  visual_presence text,
  note text,
  decision_maker text,
  lead_by text,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 4. Team Members Table
CREATE TABLE public.team_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE,
  role text,
  user_role text CHECK (user_role IN ('Admin', 'Manager', 'Lead Gen', 'Designer', 'Content Writer')) DEFAULT 'Lead Gen',
  status text DEFAULT 'Active',
  leads_added integer DEFAULT 0,
  emails_sent integer DEFAULT 0,
  avatar text,
  menu_permissions text[] DEFAULT ARRAY['dashboard', 'leads', 'manufacturers', 'creative', 'emails', 'my-tables', 'team'],
  last_active timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 5. Tags Table
CREATE TABLE public.tags (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  color text,
  created_at timestamp with time zone DEFAULT now()
);

-- 6. Email Templates Table
CREATE TABLE public.email_templates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  subject text,
  body text,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- 7. Email Sequences Table
CREATE TABLE public.email_sequences (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  steps jsonb DEFAULT '[]', -- Array of SequenceStep objects
  created_at timestamp with time zone DEFAULT now()
);

-- 8. Campaigns Table
CREATE TABLE public.campaigns (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  subject text,
  status text CHECK (status IN ('Active', 'Sent', 'Paused', 'Draft', 'Completed')) DEFAULT 'Draft',
  leads_count integer DEFAULT 0,
  recipients integer DEFAULT 0,
  emails_sent integer DEFAULT 0,
  opens integer DEFAULT 0,
  replies integer DEFAULT 0,
  positives integer DEFAULT 0,
  bounces integer DEFAULT 0,
  meetings integer DEFAULT 0,
  sequence_id uuid REFERENCES public.email_sequences(id) ON DELETE SET NULL,
  owner text,
  last_activity timestamp with time zone,
  tags text[] DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 9. Email Messages Table
CREATE TABLE public.email_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  campaign_id uuid REFERENCES public.campaigns(id) ON DELETE CASCADE,
  template_id uuid REFERENCES public.email_templates(id) ON DELETE SET NULL,
  thread_id text,
  subject text,
  body text,
  status text CHECK (status IN ('Sent', 'Replied', 'Interested', 'Not Interested', 'Meeting Booked')),
  direction text CHECK (direction IN ('Outgoing', 'Incoming')),
  sent_at timestamp with time zone DEFAULT now()
);

-- 10. Creative Assets Table
CREATE TABLE public.creative_assets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid DEFAULT '1', 
  company_name text NOT NULL,
  website text,
  product_link text,
  product text,
  script_status text DEFAULT 'Pending',
  storyboard_status text DEFAULT 'Pending',
  animation_plan text DEFAULT 'Pending',
  wireframe_design_status text DEFAULT 'Pending',
  website_status text DEFAULT 'Pending',
  animation_status text DEFAULT 'Pending',
  deadline_for_delivery date,
  time_duration text,
  script_animation_plan_drive_link text,
  animation_drive_link text,
  figma_link text,
  animation_hosted_link text,
  mock_website_link text,
  project_proposal_link text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 11. Custom Tables (Schemas)
CREATE TABLE public.custom_schemas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  icon text DEFAULT 'Table',
  color text DEFAULT '#6366f1',
  columns jsonb NOT NULL DEFAULT '[]',
  created_by text, -- User ID (string/email/uuid)
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 12. Custom Tables (Records)
CREATE TABLE public.custom_records (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  schema_id uuid REFERENCES public.custom_schemas(id) ON DELETE CASCADE,
  data jsonb NOT NULL DEFAULT '{}',
  created_by text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 13. Tasks Table
CREATE TABLE public.tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text CHECK (status IN ('Todo', 'In Progress', 'Waiting', 'Review', 'Completed', 'Blocked', 'Cancelled')) DEFAULT 'Todo',
  priority text CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')) DEFAULT 'Medium',
  due_date timestamp with time zone,
  assigned_to text,
  related_type text, -- 'lead', 'manufacturer', 'outreach', 'creative'
  related_id uuid,
  created_by text,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 14. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE 
  public.projects, 
  public.leads, 
  public.manufacturers, 
  public.team_members, 
  public.tags, 
  public.campaigns, 
  public.email_templates,
  public.email_sequences,
  public.email_messages,
  public.creative_assets,
  public.custom_schemas,
  public.custom_records,
  public.tasks;

```
