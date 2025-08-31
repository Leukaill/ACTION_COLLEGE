
"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { getStudyRecommendations, type StudyRecommendationsOutput } from "@/ai/flows/study-optimizer-recommendations"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Loader2, Zap, BookOpen, Clock, Lightbulb, Sparkles, Calendar, Video, FileText } from "lucide-react"

const formSchema = z.object({
  schedule: z.string().min(10, "Please provide a more detailed schedule."),
  learningStyle: z.string().min(3, "Please describe your learning style."),
  courses: z.string().min(2, "Please list at least one course."),
  academicGoals: z.string().min(10, "Please describe your academic goals."),
})

const resourceIcons: { [key: string]: React.ReactNode } = {
  "video": <Video className="h-5 w-5 text-primary" />,
  "article": <FileText className="h-5 w-5 text-primary" />,
  "book": <BookOpen className="h-5 w-5 text-primary" />,
  "website": <Zap className="h-5 w-5 text-primary" />,
}


export default function StudyOptimizerPage() {
  const [recommendations, setRecommendations] = useState<StudyRecommendationsOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schedule: "MWF 10am-12pm CS 101, MATH 203. Tue/Thu 1-5pm work. Free evenings and weekends.",
      learningStyle: "Visual and hands-on. I learn best by watching videos and doing projects.",
      courses: "CS 101, MATH 203, HIST 100",
      academicGoals: "Achieve a 3.5 GPA, master data structures, and build a portfolio project.",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setRecommendations(null)
    try {
      const result = await getStudyRecommendations(values)
      setRecommendations(result)
    } catch (error) {
      console.error("Failed to get recommendations:", error)
      // You could use a toast notification here to inform the user
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-headline">Study Optimizer</h1>
        <p className="text-muted-foreground">Get AI-powered recommendations to enhance your learning strategy.</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg sticky top-8">
            <CardHeader>
              <CardTitle className="text-2xl font-headline">Create Your Study Profile</CardTitle>
              <CardDescription>Tell us about your habits, and we'll generate a personalized plan.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="courses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Courses</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., CS 101, MATH 203, HIST 100" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="schedule"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Schedule</FormLabel>
                          <FormControl>
                            <Textarea placeholder="e.g., MWF 10am-12pm classes, Work Tue/Thu 1-5pm..." {...field} rows={3}/>
                          </FormControl>
                          <FormDescription>Include classes, work, and other commitments.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="learningStyle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Learning Style</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Visual, Auditory, Kinesthetic, Reading/Writing" {...field} />
                          </FormControl>
                          <FormDescription>How do you learn best?</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="academicGoals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Academic Goals</FormLabel>
                          <FormControl>
                            <Textarea placeholder="e.g., Improve GPA to 3.5, master data structures" {...field} rows={3}/>
                          </FormControl>
                          <FormDescription>What do you want to achieve?</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isLoading} size="lg" className="w-full font-bold">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Optimizing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Study Plan
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
            </CardContent>
          </Card>
        </div>
        
        {/* Results Section */}
        <div className="lg:col-span-3">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-2xl font-headline">Your Personalized Plan</CardTitle>
              <CardDescription>Follow these recommendations for optimal results.</CardDescription>
            </CardHeader>
            <div className="space-y-4">
              {isLoading && (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4 mx-auto" />
                <h3 className="text-lg font-semibold">Crafting Your Plan</h3>
                <p className="text-muted-foreground">Our AI is analyzing your profile...</p>
              </div>
              )}
              {recommendations && (
              <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-6 w-6 text-primary" /> Weekly Study Schedule
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                        {recommendations.optimalStudyTimes.map((item, index) => (
                          <div key={index} className="flex items-start gap-4 p-3 bg-background/50 rounded-lg border">
                            <Clock className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
                            <div>
                              <p className="font-semibold">{item.day} at {item.time}</p>
                              <p className="text-sm text-muted-foreground">{item.activity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-semibold">
                     <div className="flex items-center gap-3">
                       <BookOpen className="h-6 w-6 text-primary" /> Recommended Resources
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                     <div className="space-y-3 pt-2">
                        {recommendations.recommendedResources.map((res, index) => (
                          <div key={index} className="flex items-start gap-4 p-3 bg-background/50 rounded-lg border">
                              <div className="shrink-0 mt-1">
                              {resourceIcons[res.type.toLowerCase()] || <BookOpen className="h-5 w-5 text-primary" />}
                              </div>
                            <div>
                              <p className="font-semibold">{res.title}</p>
                              <p className="text-sm text-muted-foreground">{res.type}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-semibold">
                     <div className="flex items-center gap-3">
                       <Zap className="h-6 w-6 text-primary" /> Personalized Learning Tips
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                     <div className="space-y-3 pt-2">
                        {recommendations.personalizedLearningTips.map((tip, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border">
                            <Lightbulb className="h-5 w-5 text-primary mt-1 shrink-0" />
                            <div>
                              <h4 className="font-semibold text-foreground">{tip.title}</h4>
                              <p className="text-sm">{tip.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              )}
              {!isLoading && !recommendations && (
                <Card className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center min-h-[400px]">
                  <Lightbulb className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
                  <h3 className="text-lg font-semibold text-foreground">Ready for Your Plan?</h3>
                  <p>Fill out the form to get your personalized study recommendations.</p>
              </Card>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}
