
"use client"

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  Award,
  BookOpen,
  Bot,
  BrainCircuit,
  Briefcase,
  Calendar,
  ChevronRight,
  Code,
  Coffee,
  GraduationCap,
  LayoutGrid,
  Loader2,
  Map,
  MessageSquare,
  Moon,
  PartyPopper,
  Pin,
  CheckCircle,
  Square,
  Star,
  Sun,
  Target,
  TrendingUp,
  Users,
  Volume2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSmartDashboardInsights, type SmartDashboardInsightsOutput } from "@/ai/flows/smart-dashboard-insights";
import { getCampusEvents } from "@/ai/flows/ai-assistant-campus-info";
import { textToSpeech } from "@/ai/flows/text-to-speech";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { isToday } from 'date-fns';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useAuth } from "@/hooks/use-auth";
import { getAcademicDataForUser, type AcademicData } from "@/services/campus-data";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const quickActions = [
    { title: "AI Assistant", subtitle: "Get instant answers", icon: Bot, href: "/dashboard/assistant", color: 'from-indigo-400 to-purple-500' },
    { title: "Study Optimizer", subtitle: "Enhance learning", icon: BrainCircuit, href: "/dashboard/optimizer", color: 'from-blue-400 to-cyan-500' },
    { title: "Campus Navigator", subtitle: "Find your way", icon: Map, href: "/dashboard/navigator", color: 'from-emerald-400 to-green-500' },
    { title: "Full Calendar", subtitle: "See all events", icon: Calendar, href: "/dashboard/calendar", color: 'from-orange-400 to-red-500' }
];

const eventIcons: { [key: string]: React.ReactNode } = {
  "examinations": <GraduationCap className="h-5 w-5" />,
  "registration": <CheckCircle className="h-5 w-5" />,
  "fest": <PartyPopper className="h-5 w-5" />,
  "fair": <Briefcase className="h-5 w-5" />,
  "hackathon": <Code className="h-5 w-5" />,
  "default": <Calendar className="h-5 w-5" />,
}

function getEventIcon(eventName: string) {
    const lowerCaseName = eventName.toLowerCase();
    if (lowerCaseName.includes("exam")) return eventIcons.examinations;
    if (lowerCaseName.includes("registration")) return eventIcons.registration;
    if (lowerCaseName.includes("fest")) return eventIcons.fest;
    if (lowerCaseName.includes("fair")) return eventIcons.fair;
    if (lowerCaseName.includes("hackathon")) return eventIcons.hackathon;
    return eventIcons.default;
}

const gpaChartConfig = {
  gpa: {
    label: "GPA",
    color: "hsl(var(--chart-1))",
  },
}

export default function SmartDashboardPage() {
  const { user } = useAuth();
  const [insights, setInsights] = useState<SmartDashboardInsightsOutput | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(true);
  const [todaysEvents, setTodaysEvents] = useState<any[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [academicData, setAcademicData] = useState<AcademicData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [greeting, setGreeting] = useState("Welcome back");
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    const hours = new Date().getHours();
    const userName = user?.displayName?.split(' ')[0] || '';

    if (hours < 12) setGreeting(`Good morning, ${userName}`);
    else if (hours < 17) setGreeting(`Good afternoon, ${userName}`);
    else setGreeting(`Good evening, ${userName}`);

    const fetchTodaysEvents = async () => {
        setIsLoadingEvents(true);
        try {
            const allEvents = await getCampusEvents({});
            const today = allEvents.filter(event => isToday(new Date(event.date)))
                                 .sort((a,b) => a.time.localeCompare(b.time));
            setTodaysEvents(today);
        } catch (error) {
            console.error("Failed to fetch today's events:", error);
        } finally {
            setIsLoadingEvents(false);
        }
    }
    
    const fetchAcademicData = async () => {
        if (!user) return;
        setIsLoadingData(true);
        setIsLoadingInsights(true);
        try {
            const data = await getAcademicDataForUser(user.uid);
            setAcademicData(data);
            
            const completedCourses = data.semesters
                .filter(s => s.status === 'Completed')
                .flatMap(s => s.modules)
                .map(m => `${m.name} (${m.grade})`)
                .slice(0, 5).join(', ');

            const currentCourses = data.semesters
                .find(s => s.status === 'In Progress')
                ?.modules.map(m => m.name).join(', ');

            const academicHistory = `Completed courses: ${completedCourses}. Currently taking: ${currentCourses}.`;
            const studentGoals = `Wants to achieve a GPA of 3.8, specialize in Artificial Intelligence, and secure an internship at a tech company next summer.`;

            const insightsResult = await getSmartDashboardInsights({ academicHistory, studentGoals });
            setInsights(insightsResult);

        } catch (error) {
            console.error("Failed to fetch academic data or insights:", error);
        } finally {
            setIsLoadingData(false);
            setIsLoadingInsights(false);
        }
    }

    fetchTodaysEvents();
    if(user) fetchAcademicData();

    return () => clearInterval(timer);
  }, [user]);
  
   useEffect(() => {
    const audioEl = audioRef.current;
    if (audioEl) {
      audioEl.onended = () => setIsPlaying(false);
      if (isPlaying) {
        audioEl.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audioEl.pause();
      }
    }
  }, [isPlaying, audioDataUri]);
  
  const gpaData = academicData?.semesters
      .filter(s => s.status === 'Completed' && parseFloat(s.gpa) > 0)
      .map(s => ({
          semester: s.name.replace(/.*\(([^)]+)\s\d{4}\).*/, '$1'), // "First Semester (Sep-Dec 2023)" -> "Sep-Dec"
          gpa: parseFloat(s.gpa)
      })) || [];

    const achievements = academicData?.semesters
        .flatMap(s => s.modules)
        .slice(-3) // Get last 3 courses as mock achievements
        .map(m => ({ title: m.name, status: m.grade, icon: m.grade.startsWith('A') ? Award : BookOpen })) || [];


  const handleAudioGeneration = async () => {
    if (isGeneratingAudio || isPlaying || !todaysEvents || todaysEvents.length === 0) return;
    setIsGeneratingAudio(true);
    setAudioDataUri(null);
    try {
      const summaryText = "Here is your summary for today. " + todaysEvents
        .map(item => `At ${item.time}, you have ${item.name} at ${item.location}.`)
        .join('. ');

      const response = await textToSpeech({ text: summaryText });
      setAudioDataUri(response.audioDataUri);
      setIsPlaying(true);
    } catch (error) {
      console.error("Failed to generate audio:", error);
    } finally {
      setIsGeneratingAudio(false);
    }
  };
  
    const formatTime = (date: Date | null) => {
    if (!date) return <Loader2 className="h-4 w-4 animate-spin mx-auto" />;
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-8 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">
        <div className="backdrop-blur-sm bg-white/80 rounded-2xl p-6 md:p-8 border border-gray-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                {greeting}! ✨
              </h1>
              <p className="text-gray-600 mt-2 text-base md:text-lg">Here's your personalized snapshot for today</p>
            </div>
            <div className="text-right">
              <div className="text-2xl md:text-3xl font-mono text-blue-600 font-semibold">
                {formatTime(currentTime)}
              </div>
              <div className="text-gray-500 text-xs md:text-sm mt-1">
                {currentTime?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="backdrop-blur-sm bg-white/80 rounded-2xl p-6 md:p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                 <Target className="w-8 h-8 text-blue-500 mr-3" />
                 <h2 className="text-2xl font-bold text-gray-800">Today's Focus</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={handleAudioGeneration} disabled={isGeneratingAudio || isPlaying || isLoadingEvents || todaysEvents.length === 0}>
                  {isGeneratingAudio ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Volume2 className="mr-2 h-4 w-4"/>} Listen
              </Button>
               {audioDataUri && <audio ref={audioRef} src={audioDataUri} />}
            </div>
            <p className="text-gray-600 mb-6 text-sm">Your scannable guide to the day ahead. Stay on track!</p>
            
            {isLoadingEvents ? (
              <div className="flex items-center justify-center h-48"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>
            ) : todaysEvents.length > 0 ? (
               <ul className="space-y-4">
                  {todaysEvents.map((item) => (
                  <li key={item.name} className="flex items-start gap-4 group">
                      <div className="font-mono text-sm text-gray-500 w-20 pt-1 text-right">{item.time}</div>
                      <div className="relative w-px h-full bg-gray-200 -ml-2 mr-4">
                          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-125">
                              <div className="h-2 w-2 rounded-full bg-blue-500" />
                          </div>
                      </div>
                      <div className="flex-1 -mt-1.5 bg-white/50 p-4 rounded-lg border border-gray-100 hover:border-blue-300 transition-colors duration-300">
                          <p className="font-bold text-gray-800">{item.name}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Pin className="h-4 w-4 mr-1.5" />
                              {item.location}
                          </div>
                      </div>
                  </li>
                  ))}
              </ul>
            ) : (
              <div className="flex items-center justify-center py-12 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-100">
                <div className="text-center">
                  <Coffee className="w-16 h-16 text-orange-400 mx-auto mb-4 opacity-60" />
                  <p className="text-xl text-gray-700">No events scheduled for today</p>
                  <p className="text-blue-600 mt-2">Enjoy your day or plan ahead! 🌟</p>
                </div>
              </div>
            )}
          </div>

          <div className="backdrop-blur-sm bg-white/80 rounded-2xl p-6 md:p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-8 h-8 text-green-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Academic Progress</h2>
            </div>
            {isLoadingData ? (
                 <div className="h-[250px] w-full flex items-center justify-center"><Skeleton className="h-full w-full bg-gray-200" /></div>
            ) : gpaData.length > 0 ? (
                 <ChartContainer config={gpaChartConfig} className="min-h-[250px] w-full text-black">
                    <BarChart accessibilityLayer data={gpaData} margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)"/>
                        <XAxis dataKey="semester" tick={{ fill: 'rgba(0, 0, 0, 0.7)' }} tickLine={{ stroke: 'rgba(0, 0, 0, 0.2)' }} />
                        <YAxis domain={[2, 4]} tick={{ fill: 'rgba(0, 0, 0, 0.7)' }} tickLine={{ stroke: 'rgba(0, 0, 0, 0.2)' }}/>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent className="bg-white/80 border-gray-300 backdrop-blur-sm" />} />
                        <Bar dataKey="gpa" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ChartContainer>
            ) : (
                <div className="text-center py-10 text-gray-500 h-[250px] flex flex-col items-center justify-center">No completed semesters to display.</div>
            )}
          </div>
        </div>

        <div className="backdrop-blur-sm bg-white/80 rounded-2xl p-6 md:p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center mb-6">
            <Zap className="w-8 h-8 text-yellow-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">AI-Powered Insights</h2>
          </div>
          {isLoadingInsights ? (
             <div className="flex items-center justify-center h-48"><Loader2 className="h-8 w-8 animate-spin text-yellow-500" /></div>
          ) : insights ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200">
                    <h3 className="font-semibold text-red-700 mb-2">📊 Key Insight</h3>
                    <p className="text-sm text-gray-700">{insights.insights[0]}</p>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <h3 className="font-semibold text-blue-700 mb-2">🎯 Focus Area</h3>
                    <p className="text-sm text-gray-700">{insights.insights[1] || 'Keep up the great work!'}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-600">Recommended Courses</h3>
                  <div className="space-y-3">
                    {insights.courseRecommendations.map((course, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 cursor-pointer group">
                        <Star className="w-4 h-4 text-yellow-500 mr-3 group-hover:scale-110 transition-transform" />
                        <span className="text-sm text-gray-700 group-hover:text-blue-700 transition-colors">{course}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-blue-500 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No insights available.</div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="backdrop-blur-sm bg-white/80 rounded-2xl p-6 md:p-8 border border-gray-200 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {quickActions.map((action) => (
                  <Link href={action.href} key={action.title} className="group cursor-pointer">
                    <div className={cn("p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-white/30 bg-gradient-to-br", action.color)}>
                      <action.icon className="w-8 h-8 text-white mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="font-semibold text-white mb-1">{action.title}</h3>
                      <p className="text-white/80 text-sm">{action.subtitle}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="backdrop-blur-sm bg-white/80 rounded-2xl p-6 md:p-8 border border-gray-200 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Recent Achievements</h2>
              {isLoadingData ? (
                 <div className="flex items-center justify-center h-48"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>
              ) : (
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 flex items-center gap-4">
                    <achievement.icon className="w-6 h-6 text-blue-500 shrink-0" />
                    <div>
                        <h3 className="font-semibold text-gray-800">{achievement.title}</h3>
                        <span className={cn("text-sm px-2 py-0.5 rounded-full",
                          achievement.status.startsWith('A') ? 'bg-green-100 text-green-700' :
                          achievement.status.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        )}>
                          Grade: {achievement.status}
                        </span>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}
