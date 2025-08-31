
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ArrowRight, Bot, BrainCircuit, Calendar, CreditCard, GraduationCap, Map, MessageSquare } from "lucide-react"
import { Icons } from "@/components/ui/icons"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-2 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto flex h-14 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="font-headline">Action College CampusAI</span>
          </Link>
          <nav className="ml-auto flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="font-bold">
              <Link href="/register">Register <ArrowRight className="ml-2" /></Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative w-full pt-32 pb-20 md:pt-48 md:pb-32 flex items-center justify-center text-center text-primary-foreground">
          <div className="absolute inset-0 z-0">
            <Image 
              src="https://placehold.co/1920x1080.png" 
              alt="Futuristic university campus" 
              layout="fill" 
              objectFit="cover" 
              className="opacity-20"
              data-ai-hint="futuristic university campus"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-primary to-background" />
          </div>

          <div className="container relative z-10 px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-headline bg-clip-text text-transparent bg-gradient-to-b from-primary-foreground to-primary-foreground/70">
                The Future of Campus Life at Action College
              </h1>
              <p className="mt-6 max-w-xl mx-auto text-lg text-primary-foreground/80 md:text-xl">
                Action College CampusAI is your all-in-one platform for a smarter, more connected university experience at Université Omar Bongo.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Button size="lg" asChild className="font-bold text-lg">
                  <Link href="/register">Get Started for Free</Link>
                </Button>
                <Button size="lg" variant="secondary" asChild className="font-bold text-lg">
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-16 md:py-24 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Everything a student needs</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From academic planning to social connections, Action College CampusAI simplifies your university journey.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 pt-12">
              <FeatureCard
                icon={<MessageSquare className="w-8 h-8 text-accent" />}
                title="AI Assistant"
                description="Get instant answers about campus life, events, and resources through our AI."
              />
              <FeatureCard
                icon={<GraduationCap className="w-8 h-8 text-accent" />}
                title="Smart Dashboard"
                description="Personalized academic insights, grade projections, and course recommendations."
              />
              <FeatureCard
                icon={<Map className="w-8 h-8 text-accent" />}
                title="Campus Navigator"
                description="Interactive map with real-time info on library hours, dining hall menus, and more."
              />
              <FeatureCard
                icon={<BrainCircuit className="w-8 h-8 text-accent" />}
                title="Study Optimizer"
                description="AI-powered planning to find your optimal study times and recommended resources."
              />
              <FeatureCard
                icon={<Calendar className="w-8 h-8 text-accent" />}
                title="University Calendar"
                description="Synced with the official Action College calendar so you never miss an important date."
              />
              <FeatureCard
                icon={<CreditCard className="w-8 h-8 text-accent" />}
                title="Online Payments"
                description="A safe and easy way to pay your tuition fees directly through the app."
              />
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-primary text-primary-foreground">
        <div className="container py-6 flex flex-col items-center justify-between md:flex-row">
          <p className="text-sm">© {new Date().getFullYear()} Action College CampusAI. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="text-sm hover:underline">Privacy Policy</Link>
            <Link href="#" className="text-sm hover:underline">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="h-full transform hover:-translate-y-2 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-xl">
      <CardHeader>
        <div className="p-3 bg-accent/10 rounded-full w-fit mb-4">{icon}</div>
        <CardTitle className="font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
