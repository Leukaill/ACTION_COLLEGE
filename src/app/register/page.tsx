
"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { saveUserProfileForDemo } from "@/services/campus-data"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/ui/icons"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

const academicData = {
    academicYears: ["1st Year", "2nd Year", "3rd Year", "4th Year", "Masters", "PhD"],
    faculties: [
        {
            id: "fdse",
            name: "Faculty of Law and Economic Sciences (FDSE)",
            departments: ["Department of Public Law", "Department of Private Law", "Department of Economic Sciences", "Department of Management Sciences"]
        },
        {
            id: "flsh",
            name: "Faculty of Letters and Human Sciences (FLSH)",
            departments: ["Department of English", "Department of History", "Department of Geography", "Department of Modern Literature"]
        },
        {
            id: "fmss",
            name: "Faculty of Medicine and Health Sciences (FMSS)",
            departments: ["General Medicine", "Pharmacy", "Public Health"]
        }
    ],
    insuranceCompanies: ["ASCOMA GABON", "AXA Gabon", "SUNU Assurances Gabon", "NSIA Assurances Gabon", "Ogar Assurances", "Other"]
}

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"];

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { signIn } = useAuth()
  
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [studentId, setStudentId] = useState("")
  const [phone, setPhone] = useState("")
  const [academicYear, setAcademicYear] = useState("")
  const [faculty, setFaculty] = useState("")
  const [department, setDepartment] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  // Insurance state
  const [insuranceCompany, setInsuranceCompany] = useState("")
  const [policyNumber, setPolicyNumber] = useState("")
  const [registrationDate, setRegistrationDate] = useState<Date>()
  const [expiryDate, setExpiryDate] = useState<Date>()
  
  // Medical Info state
  const [bloodType, setBloodType] = useState("")
  const [allergies, setAllergies] = useState("")
  const [chronicConditions, setChronicConditions] = useState("")
  const [medications, setMedications] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!academicYear || !faculty || !department || !insuranceCompany || !policyNumber || !registrationDate || !expiryDate) {
      setError("Please fill out all personal and insurance details.")
      setIsLoading(false)
      return
    }

    try {
      const fullName = `${firstName} ${lastName}`;
      const uid = `user_${Date.now()}`; // Create a fake unique ID

      const newProfile = {
          uid,
          firstName,
          lastName,
          displayName: fullName,
          email,
          studentId,
          phone,
          academicYear,
          faculty,
          department,
          createdAt: new Date(),
          payment: {
            totalFees: 5000,
            paid: 0,
            history: []
          },
          insurance: {
            company: insuranceCompany,
            policyNumber: policyNumber,
            registrationDate: registrationDate.toISOString(),
            expiryDate: expiryDate.toISOString(),
          },
          medicalInfo: {
            bloodType,
            allergies,
            chronicConditions,
            medications
          }
      };
      
      // Save the profile to localStorage
      await saveUserProfileForDemo(newProfile);

      const fakeUser = {
        uid: uid,
        displayName: fullName,
        email: email,
        photoURL: null,
        ...newProfile // Include the full profile for the auth context
      } as any;

      signIn(fakeUser);
      
      toast({
        title: "Account Created",
        description: "Welcome to Action College CampusAI!",
      })
      
    } catch (error: any) {
      console.error("Registration failed", error)
      setError(error.message || "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  
  const departmentsForFaculty = academicData.faculties.find(f => f.name === faculty)?.departments || [];

  return (
    <div className="flex items-center justify-center min-h-screen bg-background py-12">
      <Card className="mx-auto max-w-lg w-full">
        <CardHeader className="text-center">
           <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <Icons.logo className="h-8 w-8 text-primary" />
          </Link>
          <CardTitle className="text-2xl font-headline">Create your Action College Account</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <h3 className="font-semibold text-lg border-b pb-2">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name" placeholder="Alex" required value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={isLoading} />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" placeholder="Doe" required value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={isLoading} />
                </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="student-id">Student ID</Label>
                    <Input id="student-id" placeholder="22806/2024" required value={studentId} onChange={(e) => setStudentId(e.target.value)} disabled={isLoading} />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+241 077 12 34 56" required value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isLoading} />
                </div>
            </div>

            <h3 className="font-semibold text-lg border-b pb-2 mt-4">Academic Information</h3>
             <div className="grid gap-2">
                <Label htmlFor="academic-year">Academic Year</Label>
                <Select onValueChange={setAcademicYear} value={academicYear} disabled={isLoading}>
                    <SelectTrigger><SelectValue placeholder="Select your year" /></SelectTrigger>
                    <SelectContent>
                        {academicData.academicYears.map(year => (
                           <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="faculty">Faculty</Label>
                     <Select onValueChange={setFaculty} value={faculty} disabled={isLoading}>
                        <SelectTrigger><SelectValue placeholder="Select your faculty" /></SelectTrigger>
                        <SelectContent>
                            {academicData.faculties.map(f => (
                               <SelectItem key={f.id} value={f.name}>{f.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                     <Select onValueChange={setDepartment} value={department} disabled={isLoading || !faculty}>
                        <SelectTrigger><SelectValue placeholder="Select your department" /></SelectTrigger>
                        <SelectContent>
                             {departmentsForFaculty.map(d => (
                               <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <h3 className="font-semibold text-lg border-b pb-2 mt-4">Insurance Information</h3>
             <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="insurance-company">Insurance Company</Label>
                     <Select onValueChange={setInsuranceCompany} value={insuranceCompany} disabled={isLoading}>
                        <SelectTrigger><SelectValue placeholder="Select your insurer" /></SelectTrigger>
                        <SelectContent>
                            {academicData.insuranceCompanies.map(c => (
                               <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="policy-number">Policy Number</Label>
                    <Input id="policy-number" placeholder="POL-12345678" required value={policyNumber} onChange={(e) => setPolicyNumber(e.target.value)} disabled={isLoading} />
                </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                 <div className="grid gap-2">
                    <Label htmlFor="registration-date">Registration Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !registrationDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {registrationDate ? format(registrationDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={registrationDate} onSelect={setRegistrationDate} initialFocus />
                        </PopoverContent>
                    </Popover>
                 </div>
                 <div className="grid gap-2">
                     <Label htmlFor="expiry-date">Expiry Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !expiryDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {expiryDate ? format(expiryDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={expiryDate} onSelect={setExpiryDate} initialFocus />
                        </PopoverContent>
                    </Popover>
                 </div>
            </div>

            <h3 className="font-semibold text-lg border-b pb-2 mt-4">Medical Information</h3>
             <div className="grid gap-2">
                <Label htmlFor="blood-type">Blood Type</Label>
                <Select onValueChange={setBloodType} value={bloodType}>
                    <SelectTrigger><SelectValue placeholder="Select blood type" /></SelectTrigger>
                    <SelectContent>
                        {bloodTypes.map(type => (
                           <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
             <div className="grid gap-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea id="allergies" placeholder="e.g., Peanuts, Penicillin. Write 'None' if not applicable." value={allergies} onChange={(e) => setAllergies(e.target.value)} />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="chronic-conditions">Chronic Conditions</Label>
                <Textarea id="chronic-conditions" placeholder="e.g., Asthma, Diabetes. Write 'None' if not applicable." value={chronicConditions} onChange={(e) => setChronicConditions(e.target.value)} />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea id="medications" placeholder="e.g., Ventolin Inhaler. Write 'None' if not applicable." value={medications} onChange={(e) => setMedications(e.target.value)} />
            </div>


            <h3 className="font-semibold text-lg border-b pb-2 mt-4">Account Credentials</h3>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="alex.doe@Action College.edu.ga" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading}/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
            </div>

            <Button type="submit" className="w-full font-bold mt-4" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create an account
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
