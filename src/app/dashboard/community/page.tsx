
"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Users, Clock, MapPin, PlusCircle, Book, Loader2 } from "lucide-react";
import { getStudyGroups, type StudyGroup, getAcademicDataForUser, type Module } from "@/services/campus-data";
import { useAuth } from '@/hooks/use-auth';
import { useToast } from "@/hooks/use-toast";

export default function CommunityPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [allGroups, setAllGroups] = useState<StudyGroup[]>([]);
    const [myCourses, setMyCourses] = useState<Module[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const groups = await getStudyGroups();
                setAllGroups(groups);

                if (user) {
                    const academicData = await getAcademicDataForUser(user.uid);
                    const currentSemester = academicData.semesters.find(s => s.status === 'In Progress');
                    setMyCourses(currentSemester?.modules || []);
                }
            } catch (error) {
                console.error("Failed to fetch community data:", error);
                toast({ variant: "destructive", title: "Error", description: "Could not fetch study groups." });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [user, toast]);

    const filteredGroups = useMemo(() => {
        return allGroups
            .filter(group => {
                // Filter by course
                if (filter !== "all" && group.courseCode !== filter) {
                    return false;
                }
                // Filter by search term (group name or course name)
                if (searchTerm && 
                    !group.groupName.toLowerCase().includes(searchTerm.toLowerCase()) && 
                    !group.courseName.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return false;
                }
                return true;
            });
    }, [allGroups, filter, searchTerm]);

    const handleJoinGroup = (group: StudyGroup) => {
        toast({
            title: `Joining "${group.groupName}"`,
            description: `You've requested to join the study group for ${group.courseName}.`,
        });
    };

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <header className="mb-4">
                <h1 className="text-4xl font-bold font-headline">Community Hub</h1>
                <p className="text-muted-foreground">Connect with your peers, join study groups, and enhance your learning.</p>
            </header>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">Find a Study Group</CardTitle>
                    <CardDescription>Filter by your courses or search for a specific group.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Search by group or course name..."
                            className="pl-10 text-base"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4">
                        <Select onValueChange={setFilter} defaultValue="all">
                            <SelectTrigger className="w-full md:w-[280px]">
                                <SelectValue placeholder="Filter by your courses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Courses</SelectItem>
                                {myCourses.map(course => (
                                    <SelectItem key={course.code} value={course.code}>
                                        {course.name} ({course.code})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <CreateGroupDialog myCourses={myCourses} />
                    </div>
                </CardContent>
            </Card>

            {isLoading ? (
                <div className="flex justify-center items-center py-16">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredGroups.map(group => (
                        <Card key={group.id} className="flex flex-col hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <Badge variant="secondary" className="mb-2">{group.courseCode}</Badge>
                                        <CardTitle className="text-xl font-headline">{group.groupName}</CardTitle>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Users className="h-4 w-4" />
                                            <span className="font-bold">{group.members}/{group.capacity}</span>
                                        </div>
                                    </div>
                                </div>
                                <CardDescription className="font-semibold text-primary">{group.courseName}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-3">
                                <p className="text-sm text-muted-foreground">{group.description}</p>
                                <div className="text-sm flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <span>{group.meetTime}</span>
                                </div>
                                <div className="text-sm flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <span>{group.meetLocation}</span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full font-bold" onClick={() => handleJoinGroup(group)}>Join Group</Button>
                            </CardFooter>
                        </Card>
                    ))}
                     {filteredGroups.length === 0 && (
                        <div className="md:col-span-2 lg:col-span-3 text-center py-16 text-muted-foreground">
                            <Users className="h-12 w-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold">No Groups Found</h3>
                            <p>Try adjusting your filters or be the first to create a group for your course!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function CreateGroupDialog({ myCourses }: { myCourses: Module[] }) {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);

    const handleCreateGroup = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const course = formData.get("course");
        const groupName = formData.get("groupName");
        
        toast({
            title: "Group Created Successfully!",
            description: `Your new group "${groupName}" for ${course} is now live.`,
        });
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="shrink-0">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Group
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-headline">Create a New Study Group</DialogTitle>
                    <DialogDescription>Fill out the details below to start a new group for one of your courses.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateGroup} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="course">Course</Label>
                        <Select name="course" required>
                            <SelectTrigger id="course">
                                <SelectValue placeholder="Select a course..." />
                            </SelectTrigger>
                            <SelectContent>
                                {myCourses.map(course => (
                                    <SelectItem key={course.code} value={course.code}>
                                        {course.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="groupName">Group Name</Label>
                        <Input id="groupName" name="groupName" placeholder="e.g., Algorithm Avengers" required />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" placeholder="What's the focus of your group? (e.g., exam prep, homework collaboration)" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="meetTime">Meet Time</Label>
                            <Input id="meetTime" name="meetTime" placeholder="e.g., Wednesdays, 4 PM" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="meetLocation">Meet Location</Label>
                            <Input id="meetLocation" name="meetLocation" placeholder="e.g., Library, Room A" required />
                        </div>
                    </div>
                     <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Create Group</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
