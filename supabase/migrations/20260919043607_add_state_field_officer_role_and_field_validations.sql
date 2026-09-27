/*
# Add state field to profiles, field_officer role, and field_validations table

## Purpose
Extends the profiles table to support multi-state pilots (Kerala, Uttarakhand, Odisha),
adds a field_officer role for ground-level validation, and creates a field_validations
table for ground verification of AI-identified safe sites.

## Changes to profiles
- Adds `state` text column (values: 'kerala', 'uttarakhand', 'odisha')
- Adds `assigned_area` text column (for field officers — the area they cover)
- Extends role CHECK to include 'field_officer'

## New Table: field_validations
- Stores ground verification reports submitted by field officers for safe sites
- Includes soil type, water source, access road condition, utility availability,
  hazard signs observed, photos, risk reassessment, and officer notes
*/

-- =====================
-- ALTER PROFILES TABLE
-- =====================
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS state text CHECK (state IN ('kerala', 'uttarakhand', 'odisha')),
  ADD COLUMN IF NOT EXISTS assigned_area text;

-- Update role CHECK to include field_officer
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('authority', 'citizen', 'field_officer'));

-- =====================
-- FIELD_VALIDATIONS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS field_validations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id text NOT NULL,
  site_name text NOT NULL,
  state text NOT NULL CHECK (state IN ('kerala', 'uttarakhand', 'odisha')),
  district text NOT NULL,
  officer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  officer_name text NOT NULL,

  -- Ground verification details
  soil_type text CHECK (soil_type IN ('rocky', 'sandy', 'clay', 'loam', 'mixed')),
  water_source text CHECK (water_source IN ('municipal', 'borewell', 'river', 'lake', 'rainwater', 'none')),
  access_road_condition text CHECK (access_road_condition IN ('good', 'moderate', 'poor', 'none')),
  electricity_available boolean DEFAULT false,
  mobile_connectivity boolean DEFAULT false,

  -- Hazard signs observed
  hazard_signs_observed text[],
  hazard_signs_notes text,

  -- Reassessment
  reassessed_risk text CHECK (reassessed_risk IN ('low', 'moderate', 'high', 'critical')),
  reassessed_feasibility text CHECK (reassessed_feasibility IN ('feasible', 'partially_feasible', 'not_feasible')),

  -- Photos
  photo_urls text[],

  -- Officer notes
  officer_notes text,

  -- Status
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'approved', 'rejected')),

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE field_validations ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read field validations
DROP POLICY IF EXISTS "field_validations_select_all" ON field_validations;
CREATE POLICY "field_validations_select_all"
  ON field_validations FOR SELECT
  TO authenticated
  USING (true);

-- Field officers and authorities can insert validations
DROP POLICY IF EXISTS "field_validations_insert" ON field_validations;
CREATE POLICY "field_validations_insert"
  ON field_validations FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = officer_id
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('field_officer', 'authority')
    )
  );

-- Officers can update their own validations; authorities can update any
DROP POLICY IF EXISTS "field_validations_update" ON field_validations;
CREATE POLICY "field_validations_update"
  ON field_validations FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = officer_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'authority'
    )
  )
  WITH CHECK (
    auth.uid() = officer_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'authority'
    )
  );

-- Officers can delete their own; authorities can delete any
DROP POLICY IF EXISTS "field_validations_delete" ON field_validations;
CREATE POLICY "field_validations_delete"
  ON field_validations FOR DELETE
  TO authenticated
  USING (
    auth.uid() = officer_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'authority'
    )
  );

-- =====================
-- INDEXES
-- =====================
CREATE INDEX IF NOT EXISTS idx_field_validations_site_id ON field_validations(site_id);
CREATE INDEX IF NOT EXISTS idx_field_validations_state ON field_validations(state);
CREATE INDEX IF NOT EXISTS idx_field_validations_officer_id ON field_validations(officer_id);
CREATE INDEX IF NOT EXISTS idx_field_validations_status ON field_validations(status);
CREATE INDEX IF NOT EXISTS idx_profiles_state ON profiles(state);