'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  Users, 
  Library, 
  Navigation, 
  CreditCard, 
  Shield,
  Activity,
  MessageSquare,
  Settings,
  TrendingUp,
  Clock,
  MapPin
} from 'lucide-react'

interface DashboardStats {
  totalCourses: number
  enrolledCourses: number
  upcomingEvents: number
  communityMembers: number
  libraryBooks: number
  recentActivities: number
}

interface RecentActivity {
  id: string
  type: 'course_enrollment' | 'event_reminder' | 'payment' | 'grade_update'
  title: string
  description: string
  timestamp: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    enrolledCourses: 0,
    upcomingEvents: 0,
    communityMembers: 0,
    libraryBooks: 0,
    recentActivities: 0
  })
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch courses count
      const { count: coursesCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })

      // Fetch user's enrollments
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', user?.id)

      // Fetch upcoming events
      const { data: events } = await supabase
        .from('events')
        .select('*')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(5)

      // Mock data for other stats (in production, these would come from actual tables)
      const mockStats = {
        totalCourses: coursesCount || 0,
        enrolledCourses: enrollments?.length || 0,
        upcomingEvents: events?.length || 0,
        communityMembers: 1250,
        libraryBooks: 45000,
        recentActivities: 8
      }

      setStats(mockStats)

      // Create mock recent activities based on real data
      const activities: RecentActivity[] = []
      
      if (enrollments && enrollments.length > 0) {
        activities.push({
          id: '1',
          type: 'course_enrollment',
          title: 'Course Enrolled',
          description: `Successfully enrolled in ${enrollments[0].course_id}`,
          timestamp: new Date().toISOString()
        })
      }

      if (events && events.length > 0) {
        activities.push({
          id: '2',
          type: 'event_reminder',
          title: 'Upcoming Event',
          description: `"${events[0].title}" starts in 2 days`,
          timestamp: new Date().toISOString()
        })
      }

      setRecentActivities(activities)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'course_enrollment':
        return <BookOpen className="h-4 w-4 text-green-600" />
      case 'event_reminder':
        return <Calendar className="h-4 w-4 text-blue-600" />
      case 'payment':
        return <CreditCard className="h-4 w-4 text-purple-600" />
      case 'grade_update':
        return <TrendingUp className="h-4 w-4 text-orange-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'course_enrollment':
        return 'bg-green-100 text-green-800'
      case 'event_reminder':
        return 'bg-blue-100 text-blue-800'
      case 'payment':
        return 'bg-purple-100 text-purple-800'
      case 'grade_update':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.user_metadata?.full_name || 'Student'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your academic journey today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              Available for enrollment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.enrolledCourses}</div>
            <p className="text-xs text-muted-foreground">
              Currently studying
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Community</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.communityMembers}</div>
            <p className="text-xs text-muted-foreground">
              Active students
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Access your most used features quickly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <BookOpen className="h-6 w-6 mb-2" />
              <span className="text-sm">Academics</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              <span className="text-sm">Calendar</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <MessageSquare className="h-6 w-6 mb-2" />
              <span className="text-sm">Chat</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Settings className="h-6 w-6 mb-2" />
              <span className="text-sm">Profile</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>
            Your latest academic activities and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Badge className={getActivityColor(activity.type)}>
                      {activity.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex-shrink-0 text-xs text-gray-400">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No recent activities</p>
                <p className="text-sm">Your activities will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
