# Standardized SQL Setup for CRM Dashboard

Copy and paste the entire block below into your [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql). 

> [!IMPORTANT]
> This script will **DROP and recreate** your tables to ensure a clean, consistent schema. **Existing data will be lost.** 

```sql
-- Clean up existing tables
DROP TABLE IF EXISTS public.tasks;
DROP TABLE IF EXISTS public.creative_assets;
DROP TABLE IF EXISTS public.campaigns;
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
  status text CHECK (status IN ('Active', 'Paused', 'Draft', 'Archived')),
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
  status text,
  priority text,
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
  role text, -- UI Display Role (e.g. "Senior SDR")
  user_role text CHECK (user_role IN ('Admin', 'Manager', 'SDR', 'Specialist', 'Viewer')) DEFAULT 'Viewer',
  status text CHECK (status IN ('Active', 'Invited', 'Suspended', 'Removed')) DEFAULT 'Active',
  leads_added integer DEFAULT 0,
  emails_sent integer DEFAULT 0,
  avatar text,
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

-- 6. Campaigns Table
CREATE TABLE public.campaigns (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  subject text,
  target_to text, -- Changed from "to" to avoid reserved word issues
  target_cc text,
  tags text[] DEFAULT '{}',
  status text CHECK (status IN ('Sent', 'Draft', 'Completed')),
  recipients integer DEFAULT 0,
  opens integer DEFAULT 0,
  replies integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 7. Creative Assets Table
CREATE TABLE public.creative_assets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  contact_person text,
  email text,
  status text,
  priority text,
  last_contact timestamp with time zone,
  design_status text,
  website_status text,
  animation_status text,
  storyboard_status text,
  script_status text,
  accuracy_score integer DEFAULT 0,
  version text DEFAULT '1.0',
  assigned_designer_id uuid REFERENCES public.team_members(id) ON DELETE SET NULL,
  reviewer_id uuid REFERENCES public.team_members(id) ON DELETE SET NULL,
  due_date date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 8. Tasks Table
CREATE TABLE public.tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text CHECK (status IN ('Todo', 'In Progress', 'Waiting', 'Review', 'Completed', 'Blocked', 'Cancelled')) DEFAULT 'Todo',
  priority text CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')) DEFAULT 'Medium',
  due_date timestamp with time zone,
  assigned_to uuid REFERENCES public.team_members(id) ON DELETE SET NULL,
  related_type text, -- 'lead', 'manufacturer', 'outreach', 'creative'
  related_id uuid,
  created_by uuid REFERENCES public.team_members(id) ON DELETE SET NULL,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 9. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE 
  public.projects, 
  public.leads, 
  public.manufacturers, 
  public.team_members, 
  public.tags, 
  public.campaigns, 
  public.creative_assets,
  public.tasks;
```
