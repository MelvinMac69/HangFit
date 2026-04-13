export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          display_name?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string
          created_at?: string
        }
      }
      workout_logs: {
        Row: {
          id: string
          user_id: string
          date: string
          day_number: number
          week_type: 'A' | 'B'
          phase: number
          program_week: number
          duration: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          day_number: number
          week_type: 'A' | 'B'
          phase: number
          program_week: number
          duration?: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          day_number?: number
          week_type?: 'A' | 'B'
          phase?: number
          program_week?: number
          duration?: number
          notes?: string | null
          created_at?: string
        }
      }
      workout_exercises: {
        Row: {
          id: string
          workout_log_id: string
          exercise_name: string
          exercise_id: string
          order_index: number
          notes: string | null
        }
        Insert: {
          id?: string
          workout_log_id: string
          exercise_name: string
          exercise_id: string
          order_index: number
          notes?: string | null
        }
        Update: {
          id?: string
          workout_log_id?: string
          exercise_name?: string
          exercise_id?: string
          order_index?: number
          notes?: string | null
        }
      }
      workout_sets: {
        Row: {
          id: string
          workout_exercise_id: string
          weight: number
          reps: number | string
          completed: boolean
        }
        Insert: {
          id?: string
          workout_exercise_id: string
          weight?: number
          reps?: number | string
          completed?: boolean
        }
        Update: {
          id?: string
          workout_exercise_id?: string
          weight?: number
          reps?: number | string
          completed?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}