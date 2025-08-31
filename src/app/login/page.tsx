
"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { getUserProfileByEmailForDemo, type UserProfile } from "@/services/campus-data"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/ui/icons"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { signIn } = useAuth()
  
  const [email, setEmail] = useState("alex.doe@Action College.edu.ga")
  const [password, setPassword] = useState("password123")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const existingUser = await getUserProfileByEmailForDemo(email);

      if (existingUser) {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        })
        
        // This simulates a real Firebase user object and ensures the demo user has full data.
        const fullDemoUser = {
          uid: existingUser.uid,
          firstName: "Alex",
          lastName: "Doe",
          displayName: "Alex Doe",
          email: existingUser.email,
          studentId: "22806/2024",
          phone: "+241 077 12 34 56",
          academicYear: "3rd Year",
          faculty: "Faculty of Law and Economic Sciences (FDSE)",
          department: "Department of Economic Sciences",
          photoURL: null,
          payment: {
            totalFees: 5000,
            paid: 4500,
            history: [
              { id: "TRN001", date: "2023-09-15", amount: 2500, method: "Credit Card", status: "Completed" },
              { id: "TRN002", date: "2024-02-01", amount: 2000, method: "Mobile Money", status: "Completed" }
            ]
          },
          insurance: {
            company: "ASCOMA GABON",
            policyNumber: "POL-AG-987654",
            registrationDate: new Date("2023-09-01").toISOString(),
            expiryDate: new Date("2024-08-31").toISOString(),
          },
          medicalInfo: {
            bloodType: "O+",
            allergies: "Peanuts",
            chronicConditions: "Asthma",
            medications: "Ventolin Inhaler (as-needed)",
          }
        } as any;
        
        signIn(fullDemoUser);
      } else {
        setError("Login failed. Please check your credentials.")
      }
    } catch (error: any) {
      console.error("Login failed", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <Icons.logo className="h-8 w-8 text-primary" />
          </Link>
          <CardTitle className="text-2xl font-headline">Login to Action College CampusAI</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full font-bold" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
