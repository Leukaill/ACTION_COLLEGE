
"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
    Calendar as CalendarIcon, 
    Clock, 
    MapPin, 
    Users, 
    Plus, 
    Bell, 
    Filter, 
    Search, 
    Share2, 
    Star, 
    ChevronLeft, 
    ChevronRight, 
    Download, 
    MessageCircle, 
    Heart, 
    Eye, 
    Bookmark, 
    Settings, 
    User, 
    Globe, 
    Zap, 
    Trophy, 
    Target, 
    BookOpen, 
    Coffee, 
    Music, 
    Camera, 
    Mic,
    X,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

const UniversityCalendar = () => {
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [notifications, setNotifications] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const eventCategories = [
    { id: 'all', name: 'All', color: 'gray', count: 47 },
    { id: 'academic', name: 'Academic', color: 'blue', count: 15 },
    { id: 'social', name: 'Social', color: 'pink', count: 12 },
    { id: 'sports', name: 'Sports', color: 'green', count: 8 },
    { id: 'cultural', name: 'Cultural', color: 'purple', count: 7 },
    { id: 'career', name: 'Career', color: 'orange', count: 5 }
  ];

  const events = [
    {
      id: 1,
      title: "Conference: AI & The Future",
      description: "Discover the latest advancements in artificial intelligence with international experts.",
      date: "2025-08-05",
      time: "14:00",
      duration: "2h 30min",
      location: "Amphitheater A",
      category: "academic",
      organizer: "Dr. Sarah Chen",
      attendees: 245,
      maxAttendees: 300,
      price: "Free",
      tags: ["AI", "Tech", "Research"],
      isOnline: false,
      rating: 4.8,
      image: "https://placehold.co/400x200.png",
      imageHint: "robot brain",
      status: "confirmed",
      socialMetrics: { likes: 156, shares: 43, comments: 28, views: 1240 },
      isPopular: true,
      rsvpStatus: "interested"
    },
    {
      id: 2,
      title: "Student Welcome Party",
      description: "Meet your new classmates in a friendly atmosphere.",
      date: "2025-08-01",
      time: "19:00",
      duration: "4h",
      location: "Central Campus",
      category: "social",
      organizer: "Student Association",
      attendees: 189,
      maxAttendees: 250,
      price: "€15",
      tags: ["Networking", "Welcome", "Party"],
      isOnline: false,
      rating: 4.6,
      image: "https://placehold.co/400x200.png",
      imageHint: "party people",
      status: "confirmed",
      socialMetrics: { likes: 289, shares: 67, comments: 45, views: 2890 },
      isPopular: true,
      rsvpStatus: "going"
    },
    {
      id: 3,
      title: "Inter-University Tournament",
      description: "Sports competition between the best universities in the region.",
      date: "2025-08-10",
      time: "09:00",
      duration: "All day",
      location: "Sports Complex",
      category: "sports",
      organizer: "Sports Department",
      attendees: 78,
      maxAttendees: 100,
      price: "Free",
      tags: ["Sport", "Competition", "Team"],
      isOnline: false,
      rating: 4.9,
      image: "https://placehold.co/400x200.png",
      imageHint: "sports competition",
      status: "confirmed",
      socialMetrics: { likes: 234, shares: 89, comments: 34, views: 1876 },
      isPopular: false,
      rsvpStatus: "maybe"
    },
    {
      id: 4,
      title: "Entrepreneurship Workshop",
      description: "Practical workshop to develop your entrepreneurial project.",
      date: "2025-08-03",
      time: "10:00",
      duration: "3h",
      location: "Innovation Room",
      category: "career",
      organizer: "Campus Incubator",
      attendees: 45,
      maxAttendees: 50,
      price: "€25",
      tags: ["Startup", "Business", "Innovation"],
      isOnline: true,
      rating: 4.7,
      image: "https://placehold.co/400x200.png",
      imageHint: "lightbulb idea",
      status: "confirmed",
      socialMetrics: { likes: 98, shares: 23, comments: 12, views: 876 },
      isPopular: false,
      rsvpStatus: "not_interested"
    }
  ];

  const upcomingEvents = events.filter(event => new Date(event.date) >= new Date(new Date().setHours(0,0,0,0)));
  const todayEvents = events.filter(event => event.date === new Date().toISOString().split('T')[0]);

  const agenda = [
    { id: 1, time: "08:00", title: "Mathematics Course", location: "Room 101", type: "class", color: "blue" },
    { id: 2, time: "10:30", title: "Coffee break with the team", location: "Cafeteria", type: "break", color: "green" },
    { id: 3, time: "14:00", title: "Conference: AI & The Future", location: "Amphitheater A", type: "event", color: "purple" },
    { id: 4, time: "16:30", title: "Group project meeting", location: "Library", type: "meeting", color: "orange" },
    { id: 5, time: "19:00", title: "Basketball practice", location: "Gymnasium", type: "sport", color: "red" }
  ];
  
  const socialFeed = [
    {
      id: 1,
      user: "Marie Dubois",
      avatar: "https://placehold.co/40x40.png",
      avatarHint: "woman portrait",
      action: "is attending",
      event: "Conference: AI & The Future",
      time: "2 hours ago",
      likes: 12,
      isLiked: false
    },
    {
      id: 2,
      user: "Alex Chen",
      avatar: "https://placehold.co/40x40.png",
      avatarHint: "man developer",
      action: "created",
      event: "Hackathon Weekend",
      time: "4 hours ago",
      likes: 28,
      isLiked: true
    },
    {
      id: 3,
      user: "Sophie Martin",
      avatar: "https://placehold.co/40x40.png",
      avatarHint: "woman scientist",
      action: "recommends",
      event: "Entrepreneurship Workshop",
      time: "6 hours ago",
      likes: 15,
      isLiked: false
    }
  ];

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleRSVP = (status: string) => {
    if (selectedEvent) {
      setSelectedEvent({...selectedEvent, rsvpStatus: status});
      toast({
          title: "RSVP Updated!",
          description: `You are now marked as "${status}" for ${selectedEvent.title}.`,
      })
    }
  };

  const getRSVPColor = (status: string) => {
    switch(status) {
      case 'going': return 'bg-green-100 text-green-700 border-green-200';
      case 'interested': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'maybe': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  
  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday
    
    const days = [];
    
    // Previous month's days
    for (let i = 0; i < startingDayOfWeek; i++) {
      const date = new Date(year, month, i - startingDayOfWeek + 1);
      days.push({
        date: date.getDate(),
        isCurrentMonth: false,
        fullDate: date
      });
    }
    
    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const hasEvents = events.some(event => event.date === date.toISOString().split('T')[0]);
      days.push({
        date: day,
        isCurrentMonth: true,
        isToday: date.toDateString() === new Date().toDateString(),
        hasEvents,
        fullDate: date
      });
    }
    
    // Next month's days to fill the grid
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date: day,
        isCurrentMonth: false,
        fullDate: date
      });
    }
    
    return days;
  };
  
  if (!currentTime) {
      return (
          <div className="flex h-screen items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold font-headline bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                University Calendar
              </h1>
              <p className="text-muted-foreground mt-2">Organize your university life in real-time</p>
            </div>
            
            <div className="text-right">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-2xl shadow-lg">
                <div className="text-2xl font-mono font-bold">{formatTime(currentTime)}</div>
                <div className="text-sm opacity-90">{formatDate(currentTime)}</div>
              </div>
              <div className="flex items-center justify-end mt-3 space-x-4">
                <div className="relative">
                  <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600" />
                  {notifications > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </div>
                <Settings className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600" />
              </div>
            </div>
          </div>

          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for events, courses, activities..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border text-lg shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex space-x-1 bg-gray-100 rounded-2xl p-1 mb-8 max-w-2xl">
          {[
            { id: 'calendar', name: 'Calendar', icon: CalendarIcon },
            { id: 'agenda', name: 'Agenda', icon: Clock },
            { id: 'events', name: 'Events', icon: Star },
            { id: 'social', name: 'Social', icon: Users }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn('flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2',
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              )}
            >
              <tab.icon className="w-5 h-5" /> {tab.name}
            </button>
          ))}
        </div>

        {activeTab === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <Card className="rounded-2xl shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </h2>
                      <p className="text-blue-100">
                        {events.filter(e => e.date.startsWith(selectedDate.toISOString().slice(0,7))).length} events this month
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-3">
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}>
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <Button className="bg-white/20 hover:bg-white/30" onClick={() => setSelectedDate(new Date())}>
                        Today
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}>
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-7 gap-1 mb-4 text-center text-sm font-medium text-gray-500">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="py-2">{day}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {generateCalendarDays().map((day, index) => (
                      <div
                        key={index}
                        className={cn('aspect-square flex flex-col items-center justify-center p-1 rounded-lg cursor-pointer transition-all hover:bg-blue-50', 
                            day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
                            day.isToday && 'bg-blue-600 text-white hover:bg-blue-700',
                            day.hasEvents && !day.isToday && 'ring-2 ring-blue-200'
                        )}
                        onClick={() => setSelectedDate(day.fullDate)}
                      >
                        <span className="text-sm font-medium">{day.date}</span>
                        {day.hasEvents && !day.isToday && (
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <aside className="lg:col-span-1 space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><Zap className="text-orange-500"/> Today's Events</CardTitle>
                </CardHeader>
                <CardContent>
                  {todayEvents.length > 0 ? (
                    <div className="space-y-3">
                      {todayEvents.map((event) => (
                        <div key={event.id} className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80" onClick={() => handleEventClick(event)}>
                           <div className="flex items-center mb-2">
                            <div className="w-10 h-10 rounded-lg overflow-hidden mr-3">
                                <Image src={event.image} alt={event.title} width={40} height={40} data-ai-hint={event.imageHint} />
                            </div>
                            <span className="font-medium text-sm flex-1">{event.title}</span>
                           </div>
                           <div className="text-xs text-muted-foreground">{event.time} • {event.location}</div>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-muted-foreground text-sm">No events today.</p>}
                </CardContent>
              </Card>
               <Card className="bg-gradient-to-r from-green-50 to-blue-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><Trophy className="text-green-600"/> This Week</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Events</span><span className="font-bold text-green-600">12</span></div>
                  <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Courses</span><span className="font-bold text-blue-600">18</span></div>
                  <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Activities</span><span className="font-bold text-purple-600">5</span></div>
                </CardContent>
              </Card>
              <Button size="lg" className="w-full font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl" onClick={() => setShowCreateEvent(true)}>
                <Plus className="mr-2"/> Create Event
              </Button>
            </aside>
          </div>
        )}
        
        {activeTab === 'agenda' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                  <Card className="shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                          <CardTitle className="text-2xl">Today's Agenda</CardTitle>
                          <CardDescription className="text-purple-100">{agenda.length} scheduled activities</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                          {agenda.map((item) => (
                              <div key={item.id} className="flex items-center p-4 bg-muted/50 rounded-xl hover:bg-muted/80 transition-colors">
                                  <div className={cn('w-2 h-12 rounded-full mr-4', 
                                    item.color === 'blue' && 'bg-blue-500',
                                    item.color === 'green' && 'bg-green-500',
                                    item.color === 'purple' && 'bg-purple-500',
                                    item.color === 'orange' && 'bg-orange-500',
                                    item.color === 'red' && 'bg-red-500'
                                  )}></div>
                                  <div className="flex-1">
                                      <div className="flex items-center justify-between mb-1">
                                          <h3 className="font-semibold">{item.title}</h3>
                                          <span className="text-sm font-mono text-muted-foreground">{item.time}</span>
                                      </div>
                                      <div className="flex items-center text-sm text-muted-foreground">
                                          <MapPin className="w-4 h-4 mr-1" />
                                          {item.location}
                                      </div>
                                  </div>
                                  <Badge variant="outline" className={cn('ml-4', 
                                    item.color === 'blue' && 'border-blue-500 text-blue-500',
                                    item.color === 'green' && 'border-green-500 text-green-500',
                                    item.color === 'purple' && 'border-purple-500 text-purple-500',
                                    item.color === 'orange' && 'border-orange-500 text-orange-500',
                                    item.color === 'red' && 'border-red-500 text-red-500'
                                  )}>{item.type}</Badge>
                              </div>
                          ))}
                      </CardContent>
                  </Card>
              </div>
              <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Target className="text-red-500"/> Today's Goals</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center"><input type="checkbox" className="mr-3 w-4 h-4" defaultChecked /><span className="text-sm line-through text-muted-foreground">Attend Math class</span></div>
                        <div className="flex items-center"><input type="checkbox" className="mr-3 w-4 h-4" /><span className="text-sm">Finish group project</span></div>
                        <div className="flex items-center"><input type="checkbox" className="mr-3 w-4 h-4" /><span className="text-sm">Study for exam</span></div>
                    </CardContent>
                </Card>
                 <Card className="bg-gradient-to-r from-yellow-50 to-orange-50">
                    <CardHeader><CardTitle className="flex items-center gap-2"><Coffee className="text-orange-500" />Free Time</CardTitle></CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">Next available break:</p>
                      <div className="bg-white p-3 rounded-lg"><div className="font-medium">12:30 - 14:00</div><div className="text-sm text-muted-foreground">1h 30min available</div></div>
                    </CardContent>
                 </Card>
              </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <aside className="lg:col-span-1 space-y-6 sticky top-6">
                  <Card>
                      <CardHeader><CardTitle className="flex items-center gap-2"><Filter className="text-blue-600"/>Categories</CardTitle></CardHeader>
                      <CardContent className="space-y-2">
                           {eventCategories.map((category) => (
                              <Button key={category.id} variant={selectedCategory === category.id ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setSelectedCategory(category.id)}>
                                <span className={cn("w-2 h-2 rounded-full mr-2", `bg-${category.color}-500`)}></span>
                                {category.name}
                                <span className="ml-auto text-xs text-muted-foreground">{category.count}</span>
                              </Button>
                          ))}
                      </CardContent>
                  </Card>
                  <Card>
                      <CardHeader><CardTitle className="flex items-center gap-2"><Star className="text-orange-500"/>Popular</CardTitle></CardHeader>
                      <CardContent className="space-y-3">
                           {events.filter(event => event.isPopular).slice(0, 3).map((event) => (
                              <div key={event.id} className="flex items-center space-x-3 p-2 hover:bg-muted rounded-lg cursor-pointer" onClick={() => handleEventClick(event)}>
                                 <Image src={event.image} alt={event.title} width={40} height={40} className="rounded-lg" data-ai-hint={event.imageHint} />
                                  <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">{event.title}</p>
                                      <p className="text-xs text-muted-foreground">{event.attendees} attendees</p>
                                  </div>
                              </div>
                          ))}
                      </CardContent>
                  </Card>
              </aside>
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {upcomingEvents.map((event) => (
                      <Card key={event.id} onClick={() => handleEventClick(event)} className="hover:shadow-xl transition-shadow cursor-pointer group hover:-translate-y-1 overflow-hidden flex flex-col">
                          <div className="relative">
                            <Image src={event.image} alt={event.title} width={400} height={160} className="w-full h-40 object-cover" data-ai-hint={event.imageHint}/>
                            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">{event.category}</div>
                          </div>
                          <CardHeader className="flex-1">
                              <CardTitle className="group-hover:text-blue-600">{event.title}</CardTitle>
                              <CardDescription>{new Date(event.date).toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric'})} at {event.time}</CardDescription>
                          </CardHeader>
                          <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
                            <div className="flex items-center gap-1"><Users className="w-4 h-4"/> {event.attendees} / {event.maxAttendees}</div>
                            <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400"/> {event.rating}</div>
                          </CardFooter>
                      </Card>
                  ))}
              </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                 <Card>
                    <CardHeader><CardTitle>Social Feed</CardTitle><CardDescription>See what's happening around campus.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        {socialFeed.map(item => (
                            <Card key={item.id} className="p-4">
                                <div className="flex items-start gap-4">
                                    <Avatar><AvatarImage src={item.avatar} alt={item.user} data-ai-hint="person face" /><AvatarFallback>{item.user.charAt(0)}</AvatarFallback></Avatar>
                                    <div className="flex-1">
                                        <p className="text-sm"><span className="font-bold">{item.user}</span> {item.action} <span className="font-semibold text-blue-600">{item.event}</span></p>
                                        <p className="text-xs text-muted-foreground">{item.time}</p>
                                        <div className="mt-2 flex items-center gap-4">
                                            <Button variant="ghost" size="sm" className={cn("gap-1", item.isLiked && "text-pink-500")}>
                                                <Heart className={cn("w-4 h-4", item.isLiked && "fill-current")}/>{item.likes}
                                            </Button>
                                            <Button variant="ghost" size="sm" className="gap-1"><MessageCircle className="w-4 h-4"/>Comment</Button>
                                            <Button variant="ghost" size="sm" className="gap-1"><Share2 className="w-4 h-4"/>Share</Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </CardContent>
                 </Card>
              </div>
               <div className="lg:col-span-1 space-y-6">
                 <Card>
                    <CardHeader><CardTitle>Trending Tags</CardTitle></CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {["#AI", "#WelcomeWeek", "#Finals", "#Hackathon", "#Action College", "#CareerFair", "#Startup"].map(tag => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                    </CardContent>
                 </Card>
                 <Card>
                     <CardHeader><CardTitle>Find Friends</CardTitle></CardHeader>
                     <CardContent>
                        <div className="relative"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search students..." className="pl-8"/></div>
                     </CardContent>
                 </Card>
               </div>
          </div>
        )}
      </div>

       {showEventModal && selectedEvent && (
            <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
                <DialogContent className="max-w-3xl p-0">
                    <div className="relative">
                        <Image src={selectedEvent.image} alt={selectedEvent.title} width={800} height={300} className="w-full h-48 object-cover" data-ai-hint={selectedEvent.imageHint}/>
                        <div className="absolute inset-0 bg-black/40"/>
                        <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white hover:bg-white/20" onClick={() => setShowEventModal(false)}><X/></Button>
                    </div>
                    <div className="p-6">
                        <Badge variant="secondary" className="mb-2">{selectedEvent.category}</Badge>
                        <h2 className="text-3xl font-bold font-headline mb-2">{selectedEvent.title}</h2>
                        <p className="text-muted-foreground mb-6">{selectedEvent.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                            <div className="flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-primary"/><p><strong>{new Date(selectedEvent.date).toLocaleDateString('en-US', {month: 'long', day: 'numeric'})}</strong></p></div>
                            <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary"/><p><strong>{selectedEvent.time}</strong> ({selectedEvent.duration})</p></div>
                            <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary"/><p><strong>{selectedEvent.location}</strong> {selectedEvent.isOnline && "(Online)"}</p></div>
                             <div className="flex items-center gap-2"><User className="w-5 h-5 text-primary"/><p>by <strong>{selectedEvent.organizer}</strong></p></div>
                        </div>

                        <Card className="bg-muted/50 mb-6">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="font-bold">Interested?</p>
                                    <p className="text-sm text-muted-foreground">Let friends know you're going!</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant={selectedEvent.rsvpStatus === 'going' ? 'default' : 'outline'} onClick={() => handleRSVP('going')}>Going</Button>
                                    <Button variant={selectedEvent.rsvpStatus === 'interested' ? 'default' : 'outline'} onClick={() => handleRSVP('interested')}>Interested</Button>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-bold">{selectedEvent.attendees} / {selectedEvent.maxAttendees} attendees</p>
                                <Progress value={(selectedEvent.attendees / selectedEvent.maxAttendees) * 100} className="w-48 mt-1 h-2"/>
                            </div>
                            <div className="flex gap-4">
                                <Button variant="ghost" className="gap-1"><Heart className="w-4 h-4"/> {selectedEvent.socialMetrics.likes}</Button>
                                <Button variant="ghost" className="gap-1"><Share2 className="w-4 h-4"/> Share</Button>
                                <Button variant="ghost" className="gap-1"><Bookmark className="w-4 h-4"/> Save</Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        )}
    </div>
  );
};

export default UniversityCalendar;