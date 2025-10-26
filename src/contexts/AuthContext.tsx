import React, { createContext, useContext, useEffect, useState } from 'react'
import { authManager, User } from '../lib/supabase'
import { login, register, logout, loginWithGoogle } from '../lib/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<{ error: Error | null }>
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>
  signUpWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<{ error: Error | null }>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 检查是否有 OAuth 回调的 token 或 code
    const handleOAuthCallback = async () => {
      // 首先检查是否有直接的 access_token（Supabase OAuth 直接返回）
      const accessToken = localStorage.getItem('oauth_access_token')
      if (accessToken) {
        try {
          // 调用后端 API 验证 token 并获取用户信息
          const response = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: accessToken }),
          })

          const result = await response.json()

          if (result.user && result.token) {
            authManager.setAuth(result.user, result.token)
            setUser(result.user)
          }

          localStorage.removeItem('oauth_access_token')
        } catch (error) {
          console.error('OAuth token verification error:', error)
        }
      }
      
      // 如果没有直接的 token，检查是否有 code
      const oauthCode = localStorage.getItem('oauth_code')
      if (oauthCode) {
        try {
          // 调用后端 API 交换 code 获取 token
          const response = await fetch('/api/auth/callback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: oauthCode }),
          })

          const result = await response.json()

          if (result.user && result.token) {
            authManager.setAuth(result.user, result.token)
            setUser(result.user)
          }

          // 清除 code
          localStorage.removeItem('oauth_code')
        } catch (error) {
          console.error('OAuth callback error:', error)
        }
      }
    }

    // 获取初始用户
    const getInitialUser = async () => {
      await handleOAuthCallback()
      
      try {
        const currentUser = authManager.getCurrentUser()
        console.log('Initial user:', currentUser)
        setUser(currentUser)
        setLoading(false)
      } catch (error) {
        console.error('Error getting initial user:', error)
        setLoading(false)
      }
    }

    getInitialUser()
  }, [])

  const signInWithGoogle = async () => {
    try {
      const result = await loginWithGoogle()
      if (!result.success) {
        return { error: new Error(result.error || 'Google login failed') }
      }
      return { error: null }
    } catch (error) {
      return { 
        error: error instanceof Error ? error : new Error('Google login failed')
      }
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    const result = await login(email, password)
    if (result.success) {
      // 登录成功后，重新获取用户信息
      const currentUser = authManager.getCurrentUser()
      setUser(currentUser)
    }
    return { 
      error: result.success ? null : new Error(result.error || 'Login failed')
    }
  }

  const signUpWithEmail = async (email: string, password: string) => {
    const result = await register(email, password)
    if (result.success) {
      // 注册成功后，重新获取用户信息
      const currentUser = authManager.getCurrentUser()
      setUser(currentUser)
    }
    return { 
      error: result.success ? null : new Error(result.error || 'Registration failed')
    }
  }

  const signOut = async () => {
    await logout()
    setUser(null)
    return { error: null }
  }

  const resetPassword = async (email: string) => {
    // 密码重置功能暂时未实现
    return { 
      error: new Error('Password reset not implemented') 
    }
  }

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    resetPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
