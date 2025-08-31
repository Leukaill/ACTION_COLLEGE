
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Book, Users } from "lucide-react";

// In a real app, you would fetch this data based on the faculty ID from the URL
const facultyData = {
    fdse: {
        name: "Faculty of Law and Economic Sciences (FDSE)",
        dean: "Dr. Jean Dupont",
        departments: [
            { name: "Department of Public Law" },
            { name: "Department of Private Law" },
            { name: "Department of Economic Sciences" },
            { name: "Department of Management Sciences" },
        ],
        staff: 35,
        students: 1200,
        description: "The Faculty of Law and Economic Sciences is dedicated to training the next generation of legal experts, economists, and managers to contribute to the development of Gabon and the world."
    },
    // Add data for other faculties here
}

export default function FacultyDetailPage() {
    // For now, we'll just display one faculty as an example.
    // Later, we can use the `useSearchParams` hook to get the faculty ID and display the correct data.
    const faculty = facultyData.fdse;

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <header className="mb-4">
        <h1 className="text-4xl font-bold font-headline">{faculty.name}</h1>
        <p className="text-muted-foreground">Dean: {faculty.dean}</p>
      </header>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>About the Faculty</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{faculty.description}</p>
                </CardContent>
            </Card>

             <Card className="shadow-lg mt-8">
                <CardHeader>
                    <CardTitle>Departments</CardTitle>
                    <CardDescription>The academic departments within the {faculty.name}.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {faculty.departments.map(dept => (
                        <div key={dept.name} className="flex items-center gap-3 p-3 bg-muted/50 border rounded-lg">
                            <Building className="h-5 w-5 text-primary"/>
                            <p className="font-semibold text-sm">{dept.name}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>

        <div className="md:col-span-1">
             <Card className="shadow-lg sticky top-8">
                <CardHeader>
                    <CardTitle>Faculty at a Glance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                             <Users className="h-6 w-6 text-primary"/>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{faculty.students}</p>
                            <p className="text-sm text-muted-foreground">Students Enrolled</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                             <Book className="h-6 w-6 text-primary"/>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{faculty.staff}</p>
                            <p className="text-sm text-muted-foreground">Faculty & Staff</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

      </div>
    </div>
  );
}
