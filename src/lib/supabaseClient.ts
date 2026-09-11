import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type UserRole = 'authority' | 'citizen';
export type JurisdictionLevel = 'state' | 'district';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  jurisdiction_level: JurisdictionLevel | null;
  jurisdiction_district: string | null;
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
