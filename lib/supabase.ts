import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface User {
  id: string
  email: string
  created_at: string
}

export interface Group {
  id: string
  name: string
  user_id: string
  created_at: string
}

export interface Participant {
  id: string
  group_id: string
  name: string
  color?: string
  avatar?: string
  created_at: string
}

export interface Expense {
  id: string
  group_id: string
  description: string
  amount: number
  date: string
  payer_id: string
  split_mode: 'equal' | 'custom' | 'percentage'
  created_at: string
}

export interface ExpenseSplit {
  id: string
  expense_id: string
  participant_id: string
  amount: number
}
