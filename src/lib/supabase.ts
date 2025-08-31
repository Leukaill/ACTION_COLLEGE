import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          student_id?: string
          faculty?: string
          department?: string
          year_level?: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          student_id?: string
          faculty?: string
          department?: string
          year_level?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          student_id?: string
          faculty?: string
          department?: string
          year_level?: number
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          code: string
          title: string
          description: string
          credits: number
          faculty: string
          department: string
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          title: string
          description: string
          credits: number
          faculty: string
          department: string
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          title?: string
          description?: string
          credits?: number
          faculty?: string
          department?: string
          created_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          semester: string
          academic_year: string
          grade?: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          semester: string
          academic_year: string
          grade?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          semester?: string
          academic_year?: string
          grade?: string
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          start_date: string
          end_date: string
          location?: string
          event_type: 'academic' | 'social' | 'career' | 'other'
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          start_date: string
          end_date: string
          location?: string
          event_type: 'academic' | 'social' | 'career' | 'other'
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          start_date?: string
          end_date?: string
          location?: string
          event_type?: 'academic' | 'social' | 'career' | 'other'
          created_at?: string
        }
      }
    }
  }
}
