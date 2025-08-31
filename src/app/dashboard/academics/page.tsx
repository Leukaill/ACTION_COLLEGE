'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BookOpen, 
  GraduationCap, 
  Search, 
  Plus, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react'

interface Course {
  id: string
  code: string
  title: string
  description: string
  credits: number
  faculty: string
  department: string
}

interface Enrollment {
  id: string
  course_id: string
  semester: string
  academic_year: string
  grade?: string
  course?: Course
}

export default function AcademicsPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFaculty, setSelectedFaculty] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')

  useEffect(() => {
    fetchAcademicsData()
  }, [])

  const fetchAcademicsData = async () => {
    try {
      // Fetch all courses
      const { data: coursesData } = await supabase
        .from('courses')
        .select('*')
        .order('code')

      // Fetch user's enrollments with course details
      const { data: enrollmentsData } = await supabase
        .from('enrollments')
        .select(`
          *,
          course:courses(*)
        `)
        .eq('user_id', user?.id)

      setCourses(coursesData || [])
      setEnrollments(enrollmentsData || [])
    } catch (error) {
      console.error('Error fetching academics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFaculty = !selectedFaculty || course.faculty === selectedFaculty
    const matchesDepartment = !selectedDepartment || course.department === selectedDepartment
    
    return matchesSearch && matchesFaculty && matchesDepartment
  })

  const faculties = [...new Set(courses.map(course => course.faculty))]
  const departments = [...new Set(courses.filter(course => 
    !selectedFaculty || course.faculty === selectedFaculty
  ).map(course => course.department))]

  const isEnrolled = (courseId: string) => {
    return enrollments.some(enrollment => enrollment.course_id === courseId)
  }

  const getEnrollmentGrade = (courseId: string) => {
    const enrollment = enrollments.find(e => e.course_id === courseId)
    return enrollment?.grade
  }

  const getEnrollmentStatus = (courseId: string) => {
    const enrollment = enrollments.find(e => e.course_id === courseId)
    if (!enrollment) return 'not_enrolled'
    if (enrollment.grade) return 'completed'
    return 'in_progress'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'not_enrolled':
        return <AlertCircle className="h-4 w-4 text-gray-400" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'not_enrolled':
        return 'bg-gray-100 text-gray-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Academics</h1>
        <p className="text-gray-600 mt-2">
          Manage your courses, track progress, and explore new opportunities.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">
              Available for enrollment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollments.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently studying
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {enrollments.filter(e => e.grade).length}
            </div>
            <p className="text-xs text-muted-foreground">
              With grades
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Course Search & Filters</CardTitle>
          <CardDescription>
            Find courses that match your interests and requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Courses</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by title or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="faculty">Faculty</Label>
              <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
                <SelectTrigger>
                  <SelectValue placeholder="All Faculties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Faculties</SelectItem>
                  {faculties.map((faculty) => (
                    <SelectItem key={faculty} value={faculty}>
                      {faculty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Departments</SelectItem>
                  {departments.map((department) => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const status = getEnrollmentStatus(course.id)
          const grade = getEnrollmentGrade(course.id)
          
          return (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{course.code}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {course.title}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(status)}>
                    {getStatusIcon(status)}
                    <span className="ml-1">
                      {status === 'completed' ? 'Completed' :
                       status === 'in_progress' ? 'In Progress' : 'Available'}
                    </span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{course.faculty}</span>
                  <span>{course.credits} credits</span>
                </div>
                
                <div className="text-sm text-gray-500">
                  {course.department}
                </div>

                {status === 'completed' && grade && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Grade:</span>
                    <Badge variant="secondary" className="text-lg font-bold">
                      {grade}
                    </Badge>
                  </div>
                )}

                <div className="flex gap-2">
                  {status === 'not_enrolled' ? (
                    <Button size="sm" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Enroll
                    </Button>
                  ) : status === 'in_progress' ? (
                    <Button variant="outline" size="sm" className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      View Schedule
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="w-full">
                      <BookOpen className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredCourses.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-900 mb-2">No courses found</p>
            <p className="text-gray-500">
              Try adjusting your search criteria or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
