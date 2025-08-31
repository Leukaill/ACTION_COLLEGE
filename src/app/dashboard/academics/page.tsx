
"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Building, CheckCircle, ListTodo, CalendarDays, ChevronRight, Loader2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getAcademicDataForUser, AcademicData } from "@/services/campus-data";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";


const getGradeBadgeClass = (grade: string) => {
    if (grade.startsWith("A")) return "bg-green-100 text-green-800 border-green-300";
    if (grade.startsWith("B")) return "bg-blue-100 text-blue-800 border-blue-300";
    if (grade.startsWith("C")) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    if (grade.startsWith("D")) return "bg-orange-100 text-orange-800 border-orange-300";
    if (grade.startsWith("F")) return "bg-red-100 text-red-800 border-red-300";
    return "bg-gray-100 text-gray-800";
}


export default function AcademicsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [academicData, setAcademicData] = useState<AcademicData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          // In a real app, we would have a way to link a user to their student data.
          // For now, we'll fetch a default set of academic data from Firestore.
          const data = await getAcademicDataForUser(user.uid);
          setAcademicData(data);
        } catch (error) {
          console.error("Failed to fetch academic data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  const handleFacultyClick = (facultyId: string) => {
    router.push(`/dashboard/academics/faculty?id=${facultyId}`);
  };

  const { yearLabel, yearModules } = academicData ? getCurrentAcademicYear(academicData) : { yearLabel: "N/A", yearModules: [] };
  const currentCourses = academicData?.semesters.find(s => s.status === "In Progress")?.modules || [];
  
    // Logic to determine and extract courses for the current academic year
  function getCurrentAcademicYear(data: AcademicData) {
      const currentSemesterName = data.currentSemester;
      const yearMatch = currentSemesterName.match(/(\d{4})/);
      if (!yearMatch) return { yearLabel: "N/A", yearModules: [] };
      
      const currentYear = parseInt(yearMatch[0], 10);
      let startYear, endYear;

      if (currentSemesterName.includes("Sep-Dec")) {
          startYear = currentYear;
          endYear = currentYear + 1;
      } else { // Jan-May or Jun-Aug
          startYear = currentYear - 1;
          endYear = currentYear;
      }
      const yearLabel = `${startYear}-${endYear}`;

      const yearModules = data.semesters
          .filter(s => {
              const semesterYearMatch = s.name.match(/(\d{4})/);
              if (!semesterYearMatch) return false;
              const semesterYear = parseInt(semesterYearMatch[0], 10);
              
              // Includes Sep-Dec of startYear, and Jan-May/Jun-Aug of endYear
              return (s.name.includes("Sep-Dec") && semesterYear === startYear) || (!s.name.includes("Sep-Dec") && semesterYear === endYear);
          })
          .flatMap(s => s.modules.map(m => ({ ...m, semesterName: s.name })));

      return { yearLabel, yearModules };
  };
  
  if (isLoading) {
    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
            <header className="mb-4">
                <Skeleton className="h-12 w-1/2" />
                <Skeleton className="h-4 w-1/3 mt-2" />
            </header>
             <div className="space-y-8">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    )
  }

  if (!academicData) {
    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 text-center">
            <h1 className="text-2xl font-bold">No Academic Data Found</h1>
            <p className="text-muted-foreground">We couldn't find any academic records for your account.</p>
        </div>
    )
  }

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <header className="mb-4">
        <h1 className="text-4xl font-bold font-headline">Academic Portal</h1>
        <p className="text-muted-foreground">Your central hub for results and academic information.</p>
      </header>

      <div className="grid gap-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-headline"><ListTodo/> Current Courses - {academicData.currentSemester}</CardTitle>
                <CardDescription>You are enrolled in {currentCourses.length} courses this semester.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
                {currentCourses.map(mod => (
                    <div key={mod.code} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
                        <CheckCircle className="h-5 w-5 text-primary"/>
                        <div>
                            <p className="font-semibold text-sm">{mod.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">{mod.code}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-headline"><CalendarDays /> Academic Year {yearLabel} Modules</CardTitle>
                <CardDescription>The complete list of all courses you are enrolled in this year.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Module Name</TableHead>
                            <TableHead className="text-center">Credits</TableHead>
                            <TableHead>Semester</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {yearModules.map((mod) => (
                        <TableRow key={`${mod.code}-${mod.semesterName}`}>
                            <TableCell className="font-mono">{mod.code}</TableCell>
                            <TableCell className="font-medium">{mod.name}</TableCell>
                            <TableCell className="text-center">{mod.credits}</TableCell>
                            <TableCell>{mod.semesterName}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

          <Card className="shadow-lg">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl font-headline"><BookOpen/> Grade History</CardTitle>
                  <CardDescription>Review your performance from past and current semesters.</CardDescription>
              </CardHeader>
              <CardContent>
                   <Accordion type="single" collapsible defaultValue="item-3" className="w-full">
                      {academicData.semesters.map((semester, index) => (
                      <AccordionItem value={`item-${index}`} key={semester.name}>
                          <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                              <div className="flex justify-between w-full pr-4 items-center">
                                  <span>{semester.name}</span>
                                  <div className="flex items-center gap-4">
                                      <Badge variant={semester.status === 'Completed' ? 'secondary' : 'default'}>{semester.status}</Badge>
                                      <span className="text-sm text-muted-foreground">GPA: {semester.gpa}</span>
                                  </div>
                              </div>
                          </AccordionTrigger>
                          <AccordionContent className="p-2 bg-muted/20 rounded-lg">
                              <Table>
                                  <TableHeader>
                                      <TableRow>
                                          <TableHead className="w-[250px]">Module Name</TableHead>
                                          <TableHead className="text-center">Quiz</TableHead>
                                          <TableHead className="text-center">Attendance</TableHead>
                                          <TableHead className="text-center">CAT</TableHead>
                                          <TableHead className="text-center">Final Exam</TableHead>
                                          <TableHead className="text-center font-bold">Total</TableHead>
                                          <TableHead className="text-right">Grade</TableHead>
                                      </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                      {semester.modules.map((mod) => (
                                      <TableRow key={mod.code}>
                                          <TableCell>
                                            <p className="font-medium">{mod.name}</p>
                                            <p className="text-xs text-muted-foreground font-mono">{mod.code}</p>
                                          </TableCell>
                                          <TableCell className="text-center">{mod.quiz ? `${mod.quiz}%` : '-'}</TableCell>
                                          <TableCell className="text-center">{mod.attendance}%</TableCell>
                                          <TableCell className="text-center">{mod.cat}%</TableCell>
                                          <TableCell className="text-center">{mod.finalExam ? `${mod.finalExam}%` : '-'}</TableCell>
                                          <TableCell className="text-center font-bold">{mod.total ? `${mod.total}%` : '-'}</TableCell>
                                          <TableCell className="text-right">
                                            <Badge variant="outline" className={cn("font-bold text-sm", getGradeBadgeClass(mod.grade))}>
                                                {mod.grade}
                                            </Badge>
                                          </TableCell>
                                      </TableRow>
                                      ))}
                                  </TableBody>
                              </Table>
                          </AccordionContent>
                      </AccordionItem>
                      ))}
                  </Accordion>
              </CardContent>
          </Card>

           <Card className="shadow-lg">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl font-headline"><Building/> Faculties & Departments</CardTitle>
                  <CardDescription>Information about the academic departments at Action College.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  {academicData.faculties.map(faculty => (
                      <div
                        key={faculty.id}
                        onClick={() => handleFacultyClick(faculty.id)}
                        className="p-4 bg-muted/50 border rounded-lg flex items-center justify-between gap-4 hover:bg-muted/80 transition-colors cursor-pointer"
                      >
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-background rounded-md">
                                <Building className="h-6 w-6 text-primary"/>
                            </div>
                            <div>
                                <h4 className="font-bold text-base">{faculty.name}</h4>
                                <p className="text-sm text-muted-foreground">Dean: {faculty.dean}</p>
                                <p className="text-sm text-muted-foreground">
                                  Contact:{" "}
                                  <a
                                    href={`mailto:${faculty.contact}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-primary hover:underline"
                                  >
                                    {faculty.contact}
                                  </a>
                                </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" asChild>
                            <div>
                               <ChevronRight className="h-5 w-5 text-muted-foreground"/>
                            </div>
                          </Button>
                      </div>
                  ))}
              </CardContent>
          </Card>
      </div>
    </div>
  );
}
