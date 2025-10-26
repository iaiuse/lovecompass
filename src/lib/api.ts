// API客户端 - 用于与Cloudflare Workers API通信
const API_BASE_URL = '/api'

export interface Method {
  id: string
  name: string
  color: string
  icon_url: string
  created_at: string
}

export interface Case {
  id: string
  method_id: string
  name: string
  summary: string
  card_data: any
  created_at: string
}

// API响应类型
interface ApiResponse<T> {
  data?: T
  error?: string
  success?: boolean
}

// 获取认证token - 从localStorage获取
async function getAuthToken(): Promise<string | null> {
  // 从localStorage获取存储的token
  return localStorage.getItem('auth_token')
}

// 通用API请求函数
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null }> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { data: null, error: 'No authentication token' }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    })

    const result: ApiResponse<T> = await response.json()

    if (!response.ok) {
      return { data: null, error: result.error || `HTTP ${response.status}` }
    }

    if (result.error) {
      return { data: null, error: result.error }
    }

    return { data: result.data || null, error: null }
  } catch (error) {
    console.error('API request failed:', error)
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Network error' 
    }
  }
}

// 获取所有方法
export async function getMethods(): Promise<Method[]> {
  const result = await apiRequest<Method[]>('/methods')
  if (result.error) {
    console.error('Error fetching methods:', result.error)
    return []
  }
  return result.data || []
}

// 根据方法ID获取案例
export async function getCasesByMethodId(methodId: string): Promise<Case[]> {
  const result = await apiRequest<Case[]>(`/methods/${methodId}/cases`)
  if (result.error) {
    console.error('Error fetching cases:', result.error)
    return []
  }
  return result.data || []
}

// 创建案例
export async function createCase(caseData: Omit<Case, 'id' | 'created_at'>): Promise<Case | null> {
  const result = await apiRequest<Case>('/cases', {
    method: 'POST',
    body: JSON.stringify(caseData),
  })
  
  if (result.error) {
    console.error('Error creating case:', result.error)
    return null
  }
  
  return result.data
}

// 更新案例
export async function updateCase(id: string, caseData: Partial<Omit<Case, 'id' | 'created_at'>>): Promise<Case | null> {
  const result = await apiRequest<Case>(`/cases/${id}`, {
    method: 'PUT',
    body: JSON.stringify(caseData),
  })
  
  if (result.error) {
    console.error('Error updating case:', result.error)
    return null
  }
  
  return result.data
}

// 删除案例
export async function deleteCase(id: string): Promise<boolean> {
  const result = await apiRequest<{ success: boolean }>(`/cases/${id}`, {
    method: 'DELETE',
  })
  
  if (result.error) {
    console.error('Error deleting case:', result.error)
    return false
  }
  
  return result.data?.success || false
}

// 健康检查
export async function healthCheck(): Promise<boolean> {
  const result = await apiRequest<{ status: string }>('/health')
  return result.data?.status === 'ok'
}
