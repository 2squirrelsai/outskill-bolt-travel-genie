import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      trips: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          destination: string;
          start_date: string;
          end_date: string;
          budget: number | null;
          notes: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          destination: string;
          start_date: string;
          end_date: string;
          budget?: number | null;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          destination?: string;
          start_date?: string;
          end_date?: string;
          budget?: number | null;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      activities: {
        Row: {
          id: string;
          trip_id: string;
          name: string;
          location: string | null;
          day_number: number;
          start_time: string | null;
          duration: number | null;
          estimated_cost: number | null;
          notes: string | null;
          order_index: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          trip_id: string;
          name: string;
          location?: string | null;
          day_number?: number;
          start_time?: string | null;
          duration?: number | null;
          estimated_cost?: number | null;
          notes?: string | null;
          order_index?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          trip_id?: string;
          name?: string;
          location?: string | null;
          day_number?: number;
          start_time?: string | null;
          duration?: number | null;
          estimated_cost?: number | null;
          notes?: string | null;
          order_index?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
    };
  };
};