import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Method {
  id: string
  name: string
  color: string
  icon_url: string
  created_at: string
}

export interface CaseData {
  theme: [string, string]
  icon_url: string
  front_title: string
  see_why: string
  solution_list: string
  the_change: string
  wisdom_quote: string
}

export interface Case {
  id: string
  method_id: string
  name: string
  summary: string
  card_data: CaseData
  created_at: string
}

export async function getMethods(): Promise<Method[]> {
  const { data, error } = await supabase
    .from('methods')
    .select('*')
    .order('created_at')
  
  if (error) {
    console.error('Error fetching methods:', error)
    return []
  }
  
  return data || []
}

export async function getCasesByMethodId(methodId: string): Promise<Case[]> {
  const { data, error } = await supabase
    .from('cases')
    .select('*')
    .eq('method_id', methodId)
    .order('created_at')
  
  if (error) {
    console.error('Error fetching cases:', error)
    return []
  }
  
  return data || []
}

export async function createCase(caseData: Omit<Case, 'id' | 'created_at'>): Promise<Case | null> {
  const { data, error } = await supabase
    .from('cases')
    .insert([caseData])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating case:', error)
    return null
  }
  
  return data
}

export async function updateCase(id: string, caseData: Partial<Omit<Case, 'id' | 'created_at'>>): Promise<Case | null> {
  const { data, error } = await supabase
    .from('cases')
    .update(caseData)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating case:', error)
    return null
  }
  
  return data
}

export async function deleteCase(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('cases')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting case:', error)
    return false
  }
  
  return true
}