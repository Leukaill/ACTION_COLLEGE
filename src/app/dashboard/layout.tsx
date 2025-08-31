'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/ui/sidebar'
import { 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  Home, 
  LogOut, 
  MessageSquare, 
  Settings, 
  Users,
  Navigation,
  Library,
  CreditCard,
  Shield,
  Activity
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Academics', href: '/dashboard/academics', icon: BookOpen },
    { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
    { name: 'Career', href: '/dashboard/career', icon: GraduationCap },
    { name: 'Community', href: '/dashboard/community', icon: Users },
    { name: 'Library', href: '/dashboard/library', icon: Library },
    { name: 'Navigator', href: '/dashboard/navigator', icon: Navigation },
    { name: 'Payment', href: '/dashboard/payment', icon: CreditCard },
    { name: 'Emergency', href: '/dashboard/emergency', icon: Shield },
    { name: 'Optimizer', href: '/dashboard/optimizer', icon: Activity },
    { name: 'Chat', href: '/dashboard/chat', icon: MessageSquare },
    { name: 'Assistant', href: '/dashboard/assistant', icon: MessageSquare },
    { name: 'Profile', href: '/dashboard/profile', icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar className="w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <h1 className="text-xl font-bold text-blue-600">ACTION_COLLEGE</h1>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => router.push(item.href)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Button>
              )
            })}
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.user_metadata?.full_name || user.email}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start text-gray-700 hover:bg-red-50 hover:text-red-600"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </Sidebar>
      
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
