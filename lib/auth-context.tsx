"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

// ============================================================================
// Types
// ============================================================================

// Role types for access control
// platform_owner: Company owner who built SignPortal - highest level access with privacy controls
export type UserRole = 'user' | 'manager' | 'admin' | 'enterprise_admin' | 'super_admin' | 'platform_owner'

export const ROLE_LABELS: Record<UserRole, string> = {
  user: 'User',
  manager: 'Manager',
  admin: 'Admin',
  enterprise_admin: 'Enterprise Admin',
  super_admin: 'Super Admin',
  platform_owner: 'Platform Owner',
}

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  user: 'Basic document signing access',
  manager: 'Team management and workflows',
  admin: 'Full organization control',
  enterprise_admin: 'Enterprise-wide administration',
  super_admin: 'Platform-wide super administrator',
  platform_owner: 'SignPortal company owner - full platform control',
}

// Users allowed to switch roles for testing
export const ROLE_SWITCH_USERS = ['sinhaankur827', 'sinhaankur827@gmail.com']

export interface User {
  id: string
  email: string
  name: string
  designation: string
  department: string
  role: UserRole
  avatar?: string
  phoneNumber?: string
  createdAt: Date
  lastLoginAt?: Date
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  setRole: (role: UserRole) => void
  canSwitchRoles: () => boolean
}

// ============================================================================
// Public Routes Configuration
// ============================================================================

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  // Marketing pages
  '/products',
  '/features',
  '/pricing',
  '/security',
  '/api-integration',
  // Company pages
  '/about',
  '/team',
  '/careers',
  '/contact',
  // Resources pages
  '/docs',
  '/docs/architecture',
  '/docs/api-reference',
  '/docs/deployment',
  '/documentation',
  '/api-reference',
  '/support',
  '/status',
  // Legal pages
  '/privacy',
  '/terms',
  '/cookies',
  // Other public pages
  '/integrations',
]

const AUTH_ROUTES = ['/login', '/signup', '/forgot-password', '/reset-password']

// ============================================================================
// Context
// ============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ============================================================================
// Provider
// ============================================================================

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  const router = useRouter()
  const pathname = usePathname()

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('signportal_user')
        const storedToken = localStorage.getItem('signportal_token')

        if (storedUser && storedToken) {
          const user = JSON.parse(storedUser) as User
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          })
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      }
    }

    checkAuth()
  }, [])

  // Handle route protection
  useEffect(() => {
    if (authState.isLoading) return

    const isPublicRoute = PUBLIC_ROUTES.some(route => 
      pathname === route || pathname?.startsWith(route + '/')
    )
    const isAuthRoute = AUTH_ROUTES.some(route => pathname === route)

    // If authenticated and on auth routes (login/signup), redirect to dashboard
    if (authState.isAuthenticated && isAuthRoute) {
      router.replace('/dashboard')
      return
    }

    // If not authenticated and on protected route, redirect to login
    if (!authState.isAuthenticated && !isPublicRoute) {
      router.replace('/login')
      return
    }
  }, [authState.isAuthenticated, authState.isLoading, pathname, router])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock user for demo - replace with actual API response
      const username = email.split('@')[0]
      const canSwitch = ROLE_SWITCH_USERS.includes(username) || ROLE_SWITCH_USERS.includes(email)
      const user: User = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        designation: 'manager',
        department: 'Engineering',
        role: canSwitch ? 'super_admin' : 'user',
        createdAt: new Date(),
        lastLoginAt: new Date(),
      }

      const token = 'mock_token_' + Math.random().toString(36).substr(2, 16)

      localStorage.setItem('signportal_user', JSON.stringify(user))
      localStorage.setItem('signportal_token', token)

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      })

      router.replace('/dashboard')
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }, [router])

  const logout = useCallback(() => {
    localStorage.removeItem('signportal_user')
    localStorage.removeItem('signportal_token')

    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })

    // Redirect to public landing page after logout
    router.replace('/')
  }, [router])

  const updateUser = useCallback((updates: Partial<User>) => {
    setAuthState(prev => {
      if (!prev.user) return prev

      const updatedUser = { ...prev.user, ...updates }
      localStorage.setItem('signportal_user', JSON.stringify(updatedUser))

      return {
        ...prev,
        user: updatedUser,
      }
    })
  }, [])

  const setRole = useCallback((role: UserRole) => {
    setAuthState(prev => {
      if (!prev.user) return prev

      const updatedUser = { ...prev.user, role }
      localStorage.setItem('signportal_user', JSON.stringify(updatedUser))

      return {
        ...prev,
        user: updatedUser,
      }
    })
  }, [])

  const canSwitchRoles = useCallback((): boolean => {
    // Enable role switching for all authenticated users (demo/test mode)
    // In production, this should check against ROLE_SWITCH_USERS list
    return !!authState.user
  }, [authState.user])

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    updateUser,
    setRole,
    canSwitchRoles,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ============================================================================
// Hook
// ============================================================================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// ============================================================================
// Helper Components
// ============================================================================

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Wrapper component for protected routes
 * Shows loading state while checking auth, redirects if not authenticated
 */
export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return fallback || <AuthLoadingScreen />
  }

  if (!isAuthenticated) {
    return null // Router will handle redirect
  }

  return <>{children}</>
}

/**
 * Wrapper component for public-only routes (login, signup)
 * Redirects to dashboard if already authenticated
 */
export function PublicOnlyRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return fallback || <AuthLoadingScreen />
  }

  if (isAuthenticated) {
    return null // Router will handle redirect
  }

  return <>{children}</>
}

function AuthLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F5F3]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#37322F] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#37322F] text-sm font-medium">Loading...</p>
      </div>
    </div>
  )
}

// ============================================================================
// Route Helpers
// ============================================================================

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
}

export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(route => pathname === route)
}
