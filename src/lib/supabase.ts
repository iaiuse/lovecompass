import { createClient } from '@supabase/supabase-js'

// 从环境变量获取Supabase配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 验证必要的环境变量
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase configuration. Please check your environment variables:\n' +
    '- VITE_SUPABASE_URL\n' +
    '- VITE_SUPABASE_ANON_KEY\n\n' +
    '请确保在 .env.local 文件中正确配置这些变量。'
  )
}

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // 自动刷新token
    autoRefreshToken: true,
    // 持久化session
    persistSession: true,
    // 检测auth变化
    detectSessionInUrl: true
  }
})

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
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    console.error('User not authenticated')
    return []
  }

  const { data, error } = await supabase
    .from('methods')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at')
  
  if (error) {
    console.error('Error fetching methods:', error)
    return []
  }
  
  return data || []
}

export async function getCasesByMethodId(methodId: string): Promise<Case[]> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    console.error('User not authenticated')
    return []
  }

  const { data, error } = await supabase
    .from('cases')
    .select('*')
    .eq('method_id', methodId)
    .eq('user_id', user.id)
    .order('created_at')
  
  if (error) {
    console.error('Error fetching cases:', error)
    return []
  }
  
  return data || []
}

export async function createCase(caseData: Omit<Case, 'id' | 'created_at'>): Promise<Case | null> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    console.error('User not authenticated')
    return null
  }

  const { data, error } = await supabase
    .from('cases')
    .insert([{ ...caseData, user_id: user.id }])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating case:', error)
    return null
  }
  
  return data
}

export async function updateCase(id: string, caseData: Partial<Omit<Case, 'id' | 'created_at'>>): Promise<Case | null> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    console.error('User not authenticated')
    return null
  }

  const { data, error } = await supabase
    .from('cases')
    .update(caseData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating case:', error)
    return null
  }
  
  return data
}

export async function deleteCase(id: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    console.error('User not authenticated')
    return false
  }

  const { error } = await supabase
    .from('cases')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
  
  if (error) {
    console.error('Error deleting case:', error)
    return false
  }
  
  return true
}