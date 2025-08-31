
"use client"

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Shield, Mail, Phone, Lock, Loader2, Building, HeartPulse } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserProfile, type UserProfile } from "@/services/campus-data";
import { Textarea } from "@/components/ui/textarea";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      if (user.photoURL) {
        setAvatarSrc(user.photoURL);
      }
      
      const fetchProfile = async () => {
        setIsLoadingProfile(true);
        try {
          const userProfile = await getUserProfile(user.uid);
          setProfile(userProfile);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          // Handle error, e.g., show a toast
        } finally {
          setIsLoadingProfile(false);
        }
      };

      fetchProfile();
    }
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarSrc(e.target?.result as string);
        // Here you would typically upload the image to Firebase Storage and update the user's photoURL
      };
      reader.readAsDataURL(file);
    }
  };
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U"
    return name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
  }
  
  const isLoading = authLoading || isLoadingProfile;

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <header className="mb-8">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </header>
        <div className="grid gap-8 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <Card className="sticky top-8 shadow-lg">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
                <Skeleton className="h-8 w-32 mt-2" />
                <Skeleton className="h-4 w-40 mt-2" />
                <Skeleton className="h-9 w-28 mt-4" />
              </CardContent>
            </Card>
          </aside>
          <div className="lg:col-span-3">
             <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-64 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                   <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-headline">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and security settings.</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Left column for profile summary */}
        <aside className="lg:col-span-1">
           <Card className="sticky top-8 shadow-lg">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-primary/20 cursor-pointer" onClick={handleAvatarClick}>
                <AvatarImage src={avatarSrc || undefined} alt={user?.displayName || "User"} data-ai-hint="user avatar" />
                <AvatarFallback className="text-2xl">{getInitials(user?.displayName)}</AvatarFallback>
              </Avatar>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                className="hidden" 
                accept="image/*"
              />
              <h2 className="text-2xl font-bold font-headline break-words">{profile?.displayName}</h2>
              <p className="text-muted-foreground text-sm break-words">Student ID: {profile?.studentId}</p>
               <Button variant="outline" size="sm" className="mt-4" onClick={handleAvatarClick}>
                Change Photo
              </Button>
            </CardContent>
            <CardContent className="border-t pt-6 text-sm text-muted-foreground space-y-4">
                <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary mt-1 shrink-0" />
                    <div className="text-left min-w-0">
                        <p className="font-semibold text-foreground">Email</p>
                        <span className="break-words">{profile?.email}</span>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary mt-1 shrink-0" />
                     <div className="text-left min-w-0">
                        <p className="font-semibold text-foreground">Phone</p>
                        <span className="break-words">{profile?.phone}</span>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <Building className="w-5 h-5 text-primary mt-1 shrink-0" />
                     <div className="text-left min-w-0">
                        <p className="font-semibold text-foreground">Faculty</p>
                        <span className="break-words">{profile?.faculty}</span>
                    </div>
                </div>
            </CardContent>
          </Card>
        </aside>

        {/* Right column for tabbed content */}
        <div className="lg:col-span-3">
             <Tabs defaultValue="personal">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="personal"><User className="mr-2 h-4 w-4"/>Personal</TabsTrigger>
                    <TabsTrigger value="medical"><HeartPulse className="mr-2 h-4 w-4"/>Medical</TabsTrigger>
                    <TabsTrigger value="security"><Shield className="mr-2 h-4 w-4"/>Security</TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal" className="mt-6">
                    <Card>
                        <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your personal details here. This information is private.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">First Name</Label>
                              <Input id="firstName" defaultValue={profile?.firstName} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Last Name</Label>
                              <Input id="lastName" defaultValue={profile?.lastName} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <Label htmlFor="studentId">Student ID</Label>
                              <Input id="studentId" defaultValue={profile?.studentId} readOnly />
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input id="phone" type="tel" defaultValue={profile?.phone} />
                          </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" defaultValue={profile?.email} readOnly />
                        </div>
                        </CardContent>
                        <CardFooter className="border-t pt-6 flex justify-end">
                          <Button>Save Changes</Button>
                        </CardFooter>
                    </Card>
                     <Card className="mt-6">
                        <CardHeader>
                          <CardTitle>Academic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="space-y-2">
                                <Label>Academic Year</Label>
                                <Input defaultValue={profile?.academicYear} readOnly />
                            </div>
                           <div className="space-y-2">
                                <Label>Faculty</Label>
                                <Input defaultValue={profile?.faculty} readOnly />
                            </div>
                             <div className="space-y-2">
                                <Label>Department</Label>
                                <Input defaultValue={profile?.department} readOnly />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="medical" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Medical Information</CardTitle>
                            <CardDescription>Keep this information up-to-date for emergencies. It will only be shared with authorized personnel.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="bloodType">Blood Type</Label>
                                <Input id="bloodType" defaultValue={profile?.medicalInfo?.bloodType} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="allergies">Allergies</Label>
                                <Textarea id="allergies" defaultValue={profile?.medicalInfo?.allergies} placeholder="e.g., Peanuts, Penicillin..." />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="chronicConditions">Chronic Conditions</Label>
                                <Textarea id="chronicConditions" defaultValue={profile?.medicalInfo?.chronicConditions} placeholder="e.g., Asthma, Diabetes..."/>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="medications">Current Medications</Label>
                                <Textarea id="medications" defaultValue={profile?.medicalInfo?.medications} placeholder="e.g., Ventolin Inhaler..."/>
                            </div>
                        </CardContent>
                         <CardFooter className="border-t pt-6 flex justify-end">
                          <Button>Save Medical Info</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                
                <TabsContent value="security" className="mt-6">
                    <Card>
                        <CardHeader>
                        <CardTitle>Security & Notifications</CardTitle>
                        <CardDescription>Manage your password and how you receive alerts.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Change Password</Label>
                                <div className="flex gap-2">
                                    <Input id="current-password" type="password" placeholder="Current Password"/>
                                    <Input id="new-password" type="password" placeholder="New Password"/>
                                    <Button><Lock className="mr-2 h-4 w-4"/>Update</Button>
                                </div>
                            </div>
                            <div>
                                <Label className="text-base">Notification Settings</Label>
                                <div className="space-y-4 mt-2">
                                     <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
                                        <Label htmlFor="email-notifications" className="font-normal flex flex-col gap-1">
                                            <span>Email Notifications</span>
                                            <span className="text-xs text-muted-foreground">Receive important updates via email.</span>
                                        </Label>
                                        <Switch id="email-notifications" defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
                                        <Label htmlFor="push-notifications" className="font-normal flex flex-col gap-1">
                                            <span>Push Notifications</span>
                                            <span className="text-xs text-muted-foreground">Get instant alerts on your devices.</span>
                                        </Label>
                                        <Switch id="push-notifications" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t pt-6 flex justify-end">
                            <Button>Save Preferences</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
      </div>
    </div>
  );
}

    