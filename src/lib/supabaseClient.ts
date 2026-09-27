import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type UserRole = 'authority' | 'citizen' | 'field_officer';
export type JurisdictionLevel = 'state' | 'district';
export type AppState = 'kerala' | 'uttarakhand' | 'odisha';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  jurisdiction_level: JurisdictionLevel | null;
  jurisdiction_district: string | null;
  state: AppState | null;
  assigned_area: string | null;
  created_at: string;
}

export interface IssueReport {
  id: string;
  user_id: string;
  title: string;
  description: string;
  district: string;
  category: 'flood' | 'landslide' | 'infrastructure' | 'other';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  image_url: string | null;
  status: 'pending' | 'reviewing' | 'resolved';
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  reporter_name?: string;
}

export interface FieldValidation {
  id: string;
  site_id: string;
  site_name: string;
  state: AppState;
  district: string;
  officer_id: string;
  officer_name: string;
  soil_type: 'rocky' | 'sandy' | 'clay' | 'loam' | 'mixed' | null;
  water_source: 'municipal' | 'borewell' | 'river' | 'lake' | 'rainwater' | 'none' | null;
  access_road_condition: 'good' | 'moderate' | 'poor' | 'none' | null;
  electricity_available: boolean;
  mobile_connectivity: boolean;
  hazard_signs_observed: string[];
  hazard_signs_notes: string | null;
  reassessed_risk: 'low' | 'moderate' | 'high' | 'critical' | null;
  reassessed_feasibility: 'feasible' | 'partially_feasible' | 'not_feasible' | null;
  photo_urls: string[];
  officer_notes: string | null;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}
