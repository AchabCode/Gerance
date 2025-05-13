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
      bankroll_items: {
        Row: {
          id: string
          type: 'cash' | 'poker_site' | 'bank_account' | 'crypto'
          name: string
          amount: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['bankroll_items']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['bankroll_items']['Insert']>
      }
      bankroll_history: {
        Row: {
          id: string
          date: string
          amount: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['bankroll_history']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['bankroll_history']['Insert']>
      }
      journal_entries: {
        Row: {
          id: string
          date: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['journal_entries']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['journal_entries']['Insert']>
      }
      hourly_rate_params: {
        Row: {
          id: string
          bb_amount: number
          bb_per_hour: number
          rakeback_hourly: number
          monthly_hours: number
          monthly_expenses: number
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['hourly_rate_params']['Row'], 'updated_at'>
        Update: Partial<Database['public']['Tables']['hourly_rate_params']['Insert']>
      }
    }
  }
}