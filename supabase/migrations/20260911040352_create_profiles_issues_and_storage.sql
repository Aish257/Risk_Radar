/*
# Create user profiles, issue reports, and storage bucket

## Purpose
Adds authentication-based role system (authority vs common user), issue reporting with image uploads,
and a storage bucket for report images.

## New Tables
1. `profiles`
   - `id` (uuid, PK, references auth.users) — one-to-one with Supabase auth users
   - `email` (text) — user's email
   - `full_name` (text) — display name
   - `role` (text) — 'authority' or 'citizen' (default 'citizen')
   - `jurisdiction_level` (text) — 'state' or 'district' for authorities, NULL for citizens
   - `jurisdiction_district` (text) — district name for district-level authorities
   - `created_at` (timestamptz)

2. `issue_reports`
   - `id` (uuid, PK)
   - `user_id` (uuid, references auth.users) — who reported
   - `title` (text) — short title
   - `description` (text) — detailed description
   - `district` (text) — which district the issue is about
   - `category` (text) — 'flood', 'landslide', 'infrastructure', 'other'
   - `severity` (text) — 'low', 'moderate', 'high', 'critical'
   - `image_url` (text, nullable) — URL to uploaded image in storage
   - `status` (text) — 'pending', 'reviewing', 'resolved' (default 'pending')
   - `latitude` (double precision, nullable)
   - `longitude` (double precision, nullable)
   - `created_at` (timestamptz)

## Security
- RLS enabled on both tables
- `profiles`: users can read all profiles, update only their own
- `issue_reports`: authenticated users can insert and read all reports (authorities review them)
- Only the report owner can delete their own report
- Storage bucket `issue-images` created as public for image URL access
*/

-- =====================
-- PROFILES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'citizen' CHECK (role IN ('authority', 'citizen')),
  jurisdiction_level text CHECK (jurisdiction_level IN ('state', 'district')),
  jurisdiction_district text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can read profiles (to see who reported issues)
DROP POLICY IF EXISTS "profiles_select_all" ON profiles;
CREATE POLICY "profiles_select_all"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Users can only update their own profile
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- =====================
-- ISSUE_REPORTS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS issue_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  district text NOT NULL,
  category text NOT NULL DEFAULT 'other' CHECK (category IN ('flood', 'landslide', 'infrastructure', 'other')),
  severity text NOT NULL DEFAULT 'moderate' CHECK (severity IN ('low', 'moderate', 'high', 'critical')),
  image_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved')),
  latitude double precision,
  longitude double precision,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE issue_reports ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read all issue reports
DROP POLICY IF EXISTS "issues_select_all" ON issue_reports;
CREATE POLICY "issues_select_all"
  ON issue_reports FOR SELECT
  TO authenticated
  USING (true);

-- Any authenticated user can create a report
DROP POLICY IF EXISTS "issues_insert_own" ON issue_reports;
CREATE POLICY "issues_insert_own"
  ON issue_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Only the report owner can delete their report
DROP POLICY IF EXISTS "issues_delete_own" ON issue_reports;
CREATE POLICY "issues_delete_own"
  ON issue_reports FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Authorities can update status (any report), owners can update their own
DROP POLICY IF EXISTS "issues_update" ON issue_reports;
CREATE POLICY "issues_update"
  ON issue_reports FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'authority'
    )
  )
  WITH CHECK (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'authority'
    )
  );

-- =====================
-- STORAGE BUCKET
-- =====================
INSERT INTO storage.buckets (id, name, public)
VALUES ('issue-images', 'issue-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to issue-images
DROP POLICY IF EXISTS "issue_images_upload" ON storage.objects;
CREATE POLICY "issue_images_upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'issue-images');

-- Allow public to read issue images
DROP POLICY IF EXISTS "issue_images_read" ON storage.objects;
CREATE POLICY "issue_images_read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'issue-images');

-- Allow users to delete their own uploads
DROP POLICY IF EXISTS "issue_images_delete" ON storage.objects;
CREATE POLICY "issue_images_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'issue-images' AND owner = auth.uid());

-- =====================
-- INDEXES
-- =====================
CREATE INDEX IF NOT EXISTS idx_issue_reports_user_id ON issue_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_issue_reports_district ON issue_reports(district);
CREATE INDEX IF NOT EXISTS idx_issue_reports_status ON issue_reports(status);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
