'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth, ProtectedRoute, UserRole, ROLE_LABELS } from '@/lib/auth-context'

// ============================================================================
// Types
// ============================================================================

interface NavItem {
  name: string
  href: string
  icon: ReactNode
  roles?: UserRole[] // If undefined, visible to all roles
}

// ============================================================================
// Navigation Items
// ============================================================================

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: 'Documents',
    href: '/documents',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    name: 'Workflows',
    href: '/workflows',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    name: 'Team',
    href: '/settings/team',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    roles: ['manager', 'admin', 'enterprise_admin', 'super_admin'],
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
]

// Admin navigation items
const adminNavigation: NavItem[] = [
  {
    name: 'Admin Dashboard',
    href: '/admin',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    roles: ['admin', 'enterprise_admin', 'super_admin'],
  },
  {
    name: 'Enterprise Management',
    href: '/admin/enterprises',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    roles: ['enterprise_admin', 'super_admin'],
  },
  {
    name: 'Security & Access',
    href: '/admin/security',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    roles: ['admin', 'enterprise_admin', 'super_admin'],
  },
  {
    name: 'Database Configuration',
    href: '/admin/database',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
    roles: ['admin', 'enterprise_admin', 'super_admin'],
  },
]

// Platform Owner navigation items
const ownerNavigation: NavItem[] = [
  {
    name: 'Platform Owner Console',
    href: '/owner',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    roles: ['platform_owner'],
  },
]

const ROLE_BADGE_COLORS: Record<UserRole, string> = {
  user: 'bg-gray-100 text-gray-700',
  manager: 'bg-blue-100 text-blue-700',
  admin: 'bg-purple-100 text-purple-700',
  enterprise_admin: 'bg-amber-100 text-amber-700',
  super_admin: 'bg-red-100 text-red-700',
  platform_owner: 'bg-gradient-to-r from-[#37322f] to-[#5a524d] text-white',
}

// ============================================================================
// Dashboard Sidebar Component
// ============================================================================

function DashboardSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Filter navigation items based on user role
  const filteredNavigation = navigation.filter(item => {
    if (!item.roles) return true // Show to all roles
    return user?.role && item.roles.includes(user.role)
  })

  const filteredAdminNavigation = adminNavigation.filter(item => {
    if (!item.roles) return true
    return user?.role && item.roles.includes(user.role)
  })

  const filteredOwnerNavigation = ownerNavigation.filter(item => {
    if (!item.roles) return true
    return user?.role && item.roles.includes(user.role)
  })

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-[#37322f]/10 z-50
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-[#37322f]/10">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#37322f] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SP</span>
              </div>
              <span className="text-[#37322f] font-semibold text-lg">SignPortal</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-[#37322f] text-white' 
                      : 'text-[#37322f]/70 hover:bg-[#37322f]/5 hover:text-[#37322f]'
                    }
                  `}
                >
                  {item.icon}
                  {item.name}
                </Link>
              )
            })}

            {/* Admin Section */}
            {filteredAdminNavigation.length > 0 && (
              <>
                <div className="pt-4 pb-2">
                  <p className="px-3 text-xs font-semibold text-[#37322f]/40 uppercase tracking-wider">
                    Administration
                  </p>
                </div>
                {filteredAdminNavigation.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                        ${isActive 
                          ? 'bg-[#37322f] text-white' 
                          : 'text-[#37322f]/70 hover:bg-[#37322f]/5 hover:text-[#37322f]'
                        }
                      `}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  )
                })}
              </>
            )}

            {/* Platform Owner Section */}
            {filteredOwnerNavigation.length > 0 && (
              <>
                <div className="pt-4 pb-2">
                  <p className="px-3 text-xs font-semibold text-[#37322f]/40 uppercase tracking-wider">
                    Platform Owner
                  </p>
                </div>
                {filteredOwnerNavigation.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                        ${isActive 
                          ? 'bg-gradient-to-r from-[#37322f] to-[#5a524d] text-white' 
                          : 'text-[#37322f]/70 hover:bg-[#37322f]/5 hover:text-[#37322f]'
                        }
                      `}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  )
                })}
              </>
            )}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-[#37322f]/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#37322f]/10 rounded-full flex items-center justify-center">
                <span className="text-[#37322f] font-medium text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#37322f] truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-[#37322f]/60 truncate">
                  {user?.email || ''}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#37322f] bg-[#37322f]/5 hover:bg-[#37322f]/10 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

// ============================================================================
// Dashboard Header Component
// ============================================================================

function DashboardHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuth()

  return (
    <header className="h-16 bg-white border-b border-[#37322f]/10 flex items-center justify-between px-4 lg:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 text-[#37322f] hover:bg-[#37322f]/5 rounded-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Search bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#37322f]/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search documents, workflows..."
            className="w-full pl-10 pr-4 py-2 bg-[#f7f5f3] border border-[#37322f]/10 rounded-lg text-sm text-[#37322f] placeholder-[#37322f]/40 focus:outline-none focus:ring-2 focus:ring-[#37322f]/20"
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="p-2 text-[#37322f]/60 hover:text-[#37322f] hover:bg-[#37322f]/5 rounded-lg relative">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Quick create */}
        <Link
          href="/documents/new"
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#37322f] text-white text-sm font-medium rounded-lg hover:bg-[#37322f]/90 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Document
        </Link>
      </div>
    </header>
  )
}

// ============================================================================
// Protected Layout Component
// ============================================================================

interface ProtectedLayoutProps {
  children: ReactNode
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f7f5f3]">
        <div className="flex">
          {/* Sidebar */}
          <DashboardSidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />

          {/* Main content */}
          <div className="flex-1 flex flex-col min-h-screen">
            <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
            
            <main className="flex-1 p-4 lg:p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
