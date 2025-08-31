
"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BookOpen,
  BrainCircuit,
  Briefcase,
  Calendar,
  CreditCard,
  Home,
  LogOut,
  Map,
  MessageSquare,
  Siren,
  User,
  Loader2,
  Library,
  Users,
  Bot
} from "lucide-react"

import { useAuth } from "@/hooks/use-auth"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/ui/icons"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

function DashboardNav({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const { user, loading, signOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
      toast({ title: "Logged Out", description: "You have been successfully logged out." })
      router.push("/login")
    } catch (error) {
      console.error("Logout failed", error)
      toast({ variant: "destructive", title: "Logout Failed", description: "Could not log you out. Please try again." })
    }
  }

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/assistant", label: "AI Assistant", icon: Bot },
    { href: "/dashboard/chat", label: "Chat", icon: MessageSquare },
    { href: "/dashboard/optimizer", label: "Study Optimizer", icon: BrainCircuit },
    { href: "/dashboard/navigator", label: "Campus Navigator", icon: Map },
    { href: "/dashboard/academics", label: "Academics", icon: BookOpen },
    { href: "/dashboard/library", label: "Library", icon: Library },
    { href: "/dashboard/community", label: "Community", icon: Users },
    { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
    { href: "/dashboard/career", label: "Career Launchpad", icon: Briefcase },
    { href: "/dashboard/payment", label: "Payments", icon: CreditCard },
    { href: "/dashboard/emergency", label: "Emergency", icon: Siren },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ]
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U"
    return name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
  }
  
  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar collapsible="icon" className="border-r border-sidebar-border">
          <SidebarHeader>
            <Link href="/dashboard" className="flex items-center gap-2">
              <Icons.logo className="w-6 h-6 text-sidebar-primary" />
              <span className="font-headline text-lg font-semibold text-sidebar-foreground">Action College CampusAI</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                      tooltip={item.label}
                      as="div"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="justify-start gap-2 w-full px-2" disabled={loading}>
                  {loading ? (
                    <>
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-20 group-data-[collapsible=icon]:hidden" />
                    </>
                  ) : (
                    <>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} />
                        <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sidebar-foreground group-data-[collapsible=icon]:hidden">{user?.displayName || "User"}</span>
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex-1 overflow-y-auto">
          {user ? children : 
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <DashboardNav>{children}</DashboardNav>
  )
}
