import React, { createContext, useContext, useEffect, useState } from 'react'
import { authManager, User } from '../lib/supabase'
import { login, register, logout, loginWithGoogle } from '../lib/auth'
import { supabase } from '../lib/supabaseClient'

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
    // 获取初始用户
    const getInitialUser = async () => {
      try {
        // 首先检查 Supabase session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          // 如果有 Supabase session，转换为 User 类型并保存
          const supabaseUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || undefined
          }
          setUser(supabaseUser)
          // 保存到 authManager
          authManager.setAuth(supabaseUser, session.access_token)
        } else {
          // 否则尝试从本地存储获取
          const currentUser = authManager.getCurrentUser()
          setUser(currentUser)
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Error getting initial user:', error)
        setLoading(false)
      }
    }

    getInitialUser()

    // 监听 Supabase 认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session)
        
        if (session?.user) {
          const supabaseUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || undefined
          }
          setUser(supabaseUser)
          authManager.setAuth(supabaseUser, session.access_token)
        } else {
          setUser(null)
          authManager.clearAuth()
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
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
