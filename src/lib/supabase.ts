// 认证管理模块 - 使用简单的token管理
// 不再直接连接Supabase，而是通过API进行认证

export interface User {
  id: string
  email: string
  name?: string
}

// 认证状态管理
class AuthManager {
  private user: User | null = null
  private token: string | null = null

  constructor() {
    // 从localStorage恢复认证状态
    this.token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')
    if (userData) {
      try {
        this.user = JSON.parse(userData)
      } catch (error) {
        console.error('Failed to parse user data:', error)
        this.clearAuth()
      }
    }
  }

  // 设置认证信息
  setAuth(user: User, token: string) {
    this.user = user
    this.token = token
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user_data', JSON.stringify(user))
  }

  // 清除认证信息
  clearAuth() {
    this.user = null
    this.token = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
  }

  // 获取当前用户
  getCurrentUser(): User | null {
    return this.user
  }

  // 获取token
  getToken(): string | null {
    return this.token
  }

  // 检查是否已认证
  isAuthenticated(): boolean {
    return !!this.user && !!this.token
  }
}

// 创建全局认证管理器实例
export const authManager = new AuthManager()

// 兼容性接口 - 模拟Supabase的认证方法
export const supabase = {
  auth: {
    // 获取当前用户
    getUser: async () => {
      const user = authManager.getCurrentUser()
      return { data: { user }, error: null }
    },
    
    // 获取session
    getSession: async () => {
      const user = authManager.getCurrentUser()
      const token = authManager.getToken()
      return { 
        data: { 
          session: user && token ? { user, access_token: token } : null 
        }, 
        error: null 
      }
    },
    
    // 登出
    signOut: async () => {
      authManager.clearAuth()
      return { error: null }
    }
  }
}

// 所有数据操作现在通过 API 进行，不再直接连接 Supabase
// 请使用 src/lib/api.ts 中的函数