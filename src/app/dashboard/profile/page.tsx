'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Mail, 
  GraduationCap, 
  Building, 
  Calendar,
  Edit3,
  Save,
  X,
  Shield,
  CreditCard,
  Activity
} from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  full_name: string
  student_id?: string
  faculty?: string
  department?: string
  year_level?: number
  created_at: string
  updated_at: string
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    student_id: '',
    faculty: '',
    department: '',
    year_level: ''
  })

  const faculties = [
    'Faculty of Law and Economic Sciences (FDSE)',
    'Faculty of Medicine',
    'Faculty of Engineering',
    'Faculty of Arts and Humanities',
    'Faculty of Science',
    'Faculty of Agriculture'
  ]

  const departments = {
    'Faculty of Law and Economic Sciences (FDSE)': ['Law', 'Economics', 'Management', 'Accounting'],
    'Faculty of Medicine': ['Medicine', 'Pharmacy', 'Dentistry', 'Nursing'],
    'Faculty of Engineering': ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering'],
    'Faculty of Arts and Humanities': ['English', 'French', 'History', 'Philosophy'],
    'Faculty of Science': ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
    'Faculty of Agriculture': ['Agronomy', 'Animal Science', 'Food Science', 'Forestry']
  }

  useEffect(() => {
    fetchUserProfile()
  }, [user])

  const fetchUserProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
        return
      }

      if (data) {
        setProfile(data)
        setFormData({
          full_name: data.full_name || '',
          student_id: data.student_id || '',
          faculty: data.faculty || '',
          department: data.department || '',
          year_level: data.year_level?.toString() || ''
        })
      } else {
        // Create profile if it doesn't exist
        const { data: newProfile } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email!,
            full_name: user.user_metadata?.full_name || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single()

        if (newProfile) {
          setProfile(newProfile)
          setFormData({
            full_name: newProfile.full_name || '',
            student_id: newProfile.student_id || '',
            faculty: newProfile.faculty || '',
            department: newProfile.department || '',
            year_level: newProfile.year_level?.toString() || ''
          })
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    try {
      const { error } = await updateProfile({
        full_name: formData.full_name,
        student_id: formData.student_id,
        faculty: formData.faculty,
        department: formData.department,
        year_level: formData.year_level ? parseInt(formData.year_level) : undefined
      })

      if (error) {
        console.error('Error updating profile:', error)
        return
      }

      // Refresh profile data
      await fetchUserProfile()
      setEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        student_id: profile.student_id || '',
        faculty: profile.faculty || '',
        department: profile.department || '',
        year_level: profile.year_level?.toString() || ''
      })
    }
    setEditing(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your personal information and academic details.
          </p>
        </div>
        {!editing ? (
          <Button onClick={() => setEditing(true)}>
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Your basic profile details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  {editing ? (
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md border">
                      {profile?.full_name || 'Not provided'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="p-3 bg-gray-50 rounded-md border flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {profile?.email || user?.email}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student_id">Student ID</Label>
                  {editing ? (
                    <Input
                      id="student_id"
                      value={formData.student_id}
                      onChange={(e) => handleInputChange('student_id', e.target.value)}
                      placeholder="e.g., 22806/2024"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md border">
                      {profile?.student_id || 'Not provided'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year_level">Year Level</Label>
                  {editing ? (
                    <Select value={formData.year_level} onValueChange={(value) => handleInputChange('year_level', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year level" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}st Year
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md border">
                      {profile?.year_level ? `${profile.year_level}st Year` : 'Not specified'}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="faculty">Faculty</Label>
                  {editing ? (
                    <Select value={formData.faculty} onValueChange={(value) => handleInputChange('faculty', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your faculty" />
                      </SelectTrigger>
                      <SelectContent>
                        {faculties.map((faculty) => (
                          <SelectItem key={faculty} value={faculty}>
                            {faculty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md border">
                      {profile?.faculty || 'Not specified'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  {editing ? (
                    <Select 
                      value={formData.department} 
                      onValueChange={(value) => handleInputChange('department', value)}
                      disabled={!formData.faculty}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your department" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.faculty && departments[formData.faculty as keyof typeof departments]?.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md border">
                      {profile?.department || 'Not specified'}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Academic Information
              </CardTitle>
              <CardDescription>
                Your academic status and enrollment details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Faculty</span>
                  </div>
                  <p className="text-blue-800">{profile?.faculty || 'Not specified'}</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-900">Year Level</span>
                  </div>
                  <p className="text-green-800">{profile?.year_level ? `${profile.year_level}st Year` : 'Not specified'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-gray-900">Member Since</span>
                </div>
                <p className="text-gray-700">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-gray-900">Last Updated</span>
                </div>
                <p className="text-gray-700">
                  {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="h-4 w-4 mr-2" />
                Payment History
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Activity className="h-4 w-4 mr-2" />
                Academic Records
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Privacy Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

    