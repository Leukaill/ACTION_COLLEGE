
"use client"

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, User, Shield, Ambulance, ShieldAlert, Trash, Plus, Building, FileBadge, CalendarCheck, CalendarX, HeartPulse, Droplets, Pill, AlertTriangle, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { getUserProfile, UserProfile } from "@/services/campus-data";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const officialContacts = [
    { name: "National Police", number: "177", Icon: Shield, color: "text-blue-500", bgColor: "bg-blue-100" },
    { name: "Gabonese Social SAMU", number: "144", Icon: Ambulance, color: "text-red-500", bgColor: "bg-red-100" },
    { name: "Action College Campus Security", number: "011 73 00 00", Icon: ShieldAlert, color: "text-yellow-500", bgColor: "bg-yellow-100" },
]

const initialPersonalContacts = [
    { id: 1, name: "Jeanne Doe", relationship: "Mother", phone: "077 12 34 56", initials: "JD" },
    { id: 2, name: "Jean Smith", relationship: "Friend", phone: "066 98 76 54", initials: "JS" },
]

const emergencyProtocols = [
    {
        id: 'medical',
        title: 'Medical Emergency',
        Icon: HeartPulse,
        color: 'text-red-500',
        steps: [
            "Stay calm and assess the situation. Do not move the injured person unless they are in immediate danger.",
            "Call the Gabonese Social SAMU at 144 immediately. Provide your exact location and the nature of the emergency.",
            "If you are trained, provide basic first aid. Do not administer medication.",
            "Send someone to meet the emergency services at the nearest entrance to guide them."
        ]
    },
    {
        id: 'fire',
        title: 'In Case of Fire',
        Icon: Flame,
        color: 'text-orange-500',
        steps: [
            "Activate the nearest fire alarm pull station.",
            "Evacuate the building immediately using the nearest exit. Do not use elevators.",
            "Close doors behind you to confine the fire.",
            "Once outside, move to a designated assembly point and do not re-enter the building."
        ]
    },
    {
        id: 'security',
        title: 'Security Alert',
        Icon: ShieldAlert,
        color: 'text-yellow-600',
        steps: [
            "If possible, move to a secure location (lockable room, away from windows).",
            "Silence your phone and any other sources of noise.",
            "Call Action College Campus Security at 011 73 00 00 when it is safe to do so.",
            "Follow all instructions from law enforcement or campus security."
        ]
    }
]

export default function EmergencyPage() {
    const { toast } = useToast();
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [personalContacts, setPersonalContacts] = useState(initialPersonalContacts);
    const [newContact, setNewContact] = useState({ name: "", relationship: "", phone: "" });

     useEffect(() => {
        if (user) {
            const fetchProfile = async () => {
                setIsLoading(true);
                try {
                    const userProfile = await getUserProfile(user.uid);
                    setProfile(userProfile);
                } catch (error) {
                    console.error("Failed to fetch user profile:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProfile();
        }
    }, [user]);

    const handleCall = (name: string, number: string) => {
        toast({
            title: `Calling ${name}`,
            description: `Dialing ${number}...`,
        });
        // In a real app, this would initiate a phone call.
        // For web, we can use window.location.href = `tel:${number}`
    }

    const handleAddContact = () => {
        if (newContact.name && newContact.relationship && newContact.phone) {
            const initials = newContact.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
            setPersonalContacts([...personalContacts, { ...newContact, id: Date.now(), initials }]);
            setNewContact({ name: "", relationship: "", phone: "" });
        } else {
            toast({
                variant: "destructive",
                title: "Incomplete Information",
                description: "Please fill out all fields for the new contact.",
            })
        }
    }

    const handleRemoveContact = (id: number) => {
        setPersonalContacts(personalContacts.filter(contact => contact.id !== id));
    }
    
    if (isLoading) {
        return (
            <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
                <header className="mb-4">
                    <Skeleton className="h-10 w-1/3" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                </header>
                 <div className="space-y-8">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-56 w-full" />
                    <Skeleton className="h-80 w-full" />
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
            <header className="mb-4">
                <h1 className="text-4xl font-bold font-headline">Emergency Information</h1>
                <p className="text-muted-foreground">Quick access to help and critical information when you need it.</p>
            </header>

            <div className="space-y-8">
                
                {/* Medical Information */}
                <Card className="shadow-lg border-2 border-red-500/50">
                    <CardHeader>
                        <CardTitle className="text-2xl font-headline flex items-center gap-3 text-red-600"><HeartPulse /> Medical Information</CardTitle>
                        <CardDescription>This information is critical for first responders in an emergency.</CardDescription>
                    </CardHeader>
                    {profile?.medicalInfo ? (
                        <CardContent className="space-y-4">
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 bg-muted/50 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Droplets className="h-5 w-5 text-red-500"/>
                                        <p className="text-sm text-muted-foreground">Blood Type</p>
                                    </div>
                                    <p className="font-mono font-bold text-lg mt-1">{profile.medicalInfo.bloodType || 'N/A'}</p>
                                </div>
                                <div className="p-4 bg-muted/50 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <AlertTriangle className="h-5 w-5 text-yellow-600"/>
                                        <p className="text-sm text-muted-foreground">Allergies</p>
                                    </div>
                                    <p className="font-semibold mt-1 break-words">{profile.medicalInfo.allergies || 'None reported'}</p>
                                </div>
                           </div>
                            <div className="p-4 bg-muted/50 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Pill className="h-5 w-5 text-blue-500"/>
                                    <p className="text-sm text-muted-foreground">Chronic Conditions & Medications</p>
                                </div>
                                <p className="font-semibold mt-1 mb-2">Conditions: <span className="font-normal break-words">{profile.medicalInfo.chronicConditions || 'None reported'}</span></p>
                                <p className="font-semibold">Medications: <span className="font-normal break-words">{profile.medicalInfo.medications || 'None reported'}</span></p>
                            </div>
                        </CardContent>
                    ) : (
                         <CardContent>
                            <p className="text-muted-foreground text-center py-4">No medical information found. Please update your profile.</p>
                        </CardContent>
                    )}
                     <CardFooter>
                        <p className="text-xs text-muted-foreground">To update this information, please go to your <a href="/dashboard/profile" className="underline text-primary">profile page</a>.</p>
                    </CardFooter>
                </Card>

                {/* Insurance Information */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-headline flex items-center gap-3"><Shield /> Insurance Information</CardTitle>
                        <CardDescription>Your personal health insurance details.</CardDescription>
                    </CardHeader>
                    {profile?.insurance ? (
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-muted/50 border rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Building className="h-6 w-6 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Insurance Company</p>
                                        <p className="font-bold text-lg">{profile.insurance.company}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 bg-muted/50 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <FileBadge className="h-5 w-5 text-primary"/>
                                        <p className="text-sm text-muted-foreground">Policy Number</p>
                                    </div>
                                    <p className="font-mono font-semibold mt-1 break-words">{profile.insurance.policyNumber}</p>
                                </div>
                                <div className="p-4 bg-muted/50 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <CalendarCheck className="h-5 w-5 text-green-600"/>
                                        <p className="text-sm text-muted-foreground">Registration</p>
                                    </div>
                                    <p className="font-semibold mt-1">{format(new Date(profile.insurance.registrationDate), 'PPP')}</p>
                                </div>
                                <div className="p-4 bg-muted/50 border rounded-lg">
                                     <div className="flex items-center gap-3">
                                        <CalendarX className="h-5 w-5 text-red-600"/>
                                        <p className="text-sm text-muted-foreground">Expires</p>
                                    </div>
                                    <p className="font-semibold mt-1">{format(new Date(profile.insurance.expiryDate), 'PPP')}</p>
                                </div>
                            </div>
                        </CardContent>
                    ) : (
                        <CardContent>
                            <p className="text-muted-foreground text-center py-4">No insurance information found for your profile.</p>
                        </CardContent>
                    )}
                </Card>

                {/* Emergency Contacts */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-headline">Emergency Contacts</CardTitle>
                        <CardDescription>Who to call for help.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-lg text-muted-foreground mb-3">Official Services</h3>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {officialContacts.map(contact => (
                                    <Card key={contact.name} className="bg-muted/50">
                                        <CardContent className="p-4 flex items-center gap-3">
                                            <div className={cn("p-3 rounded-lg", contact.bgColor)}>
                                                <contact.Icon className={cn("h-6 w-6", contact.color)} />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <p className="font-bold text-base break-words">{contact.name}</p>
                                                <p className="text-muted-foreground font-mono text-sm break-words">{contact.number}</p>
                                            </div>
                                            <Button size="icon" onClick={() => handleCall(contact.name, contact.number)} className="shrink-0">
                                                <Phone className="h-4 w-4"/>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                             <h3 className="font-semibold text-lg text-muted-foreground mb-3">Personal Contacts</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {personalContacts.map(contact => (
                                    <Card key={contact.id}>
                                        <CardContent className="p-4 flex items-center gap-4">
                                            <Avatar className="h-12 w-12 border-2 border-primary/50 shrink-0">
                                                <AvatarFallback className="bg-primary/10 text-primary font-bold">{contact.initials}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-grow min-w-0">
                                                <p className="font-bold text-lg break-words">{contact.name}</p>
                                                <p className="text-sm text-muted-foreground break-words">{contact.relationship}</p>
                                                <p className="text-sm text-muted-foreground font-mono break-words">{contact.phone}</p>
                                            </div>
                                            <Button variant="outline" size="icon" onClick={() => handleCall(contact.name, contact.phone)} className="shrink-0">
                                                <Phone className="h-4 w-4"/>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                                {personalContacts.length === 0 && (
                                    <div className="text-center text-muted-foreground py-4 md:col-span-2">
                                        <p>No personal contacts added.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-full md:w-auto">
                                    <User className="mr-2 h-4 w-4"/>
                                    Manage Personal Contacts
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                <DialogTitle>Manage Personal Contacts</DialogTitle>
                                <DialogDescription>
                                    Add or remove trusted contacts.
                                </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <h4 className="font-semibold text-sm">Current Contacts</h4>
                                    <div className="space-y-2">
                                        {personalContacts.map(contact => (
                                            <div key={contact.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                                                <div>
                                                    <p className="font-medium">{contact.name} <span className="text-xs text-muted-foreground">({contact.relationship})</span></p>
                                                    <p className="text-sm text-muted-foreground">{contact.phone}</p>
                                                </div>
                                                <Button variant="ghost" size="icon" onClick={() => handleRemoveContact(contact.id)}>
                                                    <Trash className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        ))}
                                        {personalContacts.length === 0 && <p className="text-sm text-muted-foreground text-center py-2">No contacts yet.</p>}
                                    </div>

                                    <hr className="my-4"/>
                                    
                                    <h4 className="font-semibold text-sm">Add New Contact</h4>
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="relationship">Relationship</Label>
                                        <Input id="relationship" value={newContact.relationship} onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input id="phone" type="tel" value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} />
                                    </div>
                                    <Button variant="outline" className="w-full" onClick={handleAddContact}>
                                        <Plus className="mr-2 h-4 w-4"/>
                                        Add Contact
                                    </Button>
                                </div>
                                <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button">Save</Button>
                                </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardFooter>
                </Card>
                
                {/* Emergency Protocols */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-headline">Campus Emergency Protocols</CardTitle>
                        <CardDescription>Quick guides for what to do in an emergency.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {emergencyProtocols.map((protocol) => (
                                <AccordionItem value={protocol.id} key={protocol.id}>
                                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                        <div className="flex items-center gap-3">
                                            <protocol.Icon className={cn("h-6 w-6", protocol.color)} />
                                            <span>{protocol.title}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="p-2 bg-muted/30 rounded-lg">
                                        <ol className="list-decimal list-inside space-y-2 pl-2">
                                            {protocol.steps.map((step, index) => (
                                                <li key={index} className="text-muted-foreground">{step}</li>
                                            ))}
                                        </ol>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
