// 认证相关函数 - 通过 API 进行认证
import { authManager, User } from './supabase'

// 登录函数 - 通过 API 进行认证
export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const result = await response.json()

    if (!response.ok) {
      return { success: false, error: result.error || 'Login failed' }
    }

    // 保存认证信息
    authManager.setAuth(result.user, result.token)
    
    return { success: true }
  } catch (error) {
    console.error('Login error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error' 
    }
  }
}

// 注册函数 - 通过 API 进行注册
export async function register(email: string, password: string, name?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    })

    const result = await response.json()

    if (!response.ok) {
      return { success: false, error: result.error || 'Registration failed' }
    }

    // 保存认证信息
    authManager.setAuth(result.user, result.token)
    
    return { success: true }
  } catch (error) {
    console.error('Registration error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error' 
    }
  }
}

// 登出函数
export async function logout(): Promise<void> {
  try {
    // 调用 API 登出（可选）
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authManager.getToken()}`,
      },
    })
  } catch (error) {
    console.error('Logout API error:', error)
  } finally {
    // 清除本地认证信息
    authManager.clearAuth()
  }
}

// 获取当前用户
export function getCurrentUser(): User | null {
  return authManager.getCurrentUser()
}

// Google OAuth 登录 - 通过后端 API 发起
export async function loginWithGoogle(): Promise<{ success: boolean; error?: string }> {
  try {
    // 重定向到后端 Google OAuth 端点
    window.location.href = '/api/auth/google'
    return { success: true }
  } catch (error) {
    console.error('Google OAuth error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'OAuth failed' 
    }
  }
}

// 检查是否已认证
export function isAuthenticated(): boolean {
  return authManager.isAuthenticated()
}
