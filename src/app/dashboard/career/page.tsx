
"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { analyzeResume, type ResumeAnalysisOutput } from "@/ai/flows/career-analyzer"
import { Briefcase, FileText, Mic, Sparkles, Loader2, Target, CheckCircle, XCircle, Lightbulb } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const jobOpportunities = [
  {
    title: "Software Engineer Intern",
    company: "Innovate Inc.",
    location: "Remote",
    tags: ["TypeScript", "Next.js", "AI"],
    match: "92% Match"
  },
  {
    title: "Product Design Intern",
    company: "Creative Solutions",
    location: "New York, NY",
    tags: ["Figma", "UX Research"],
    match: "85% Match"
  },
  {
    title: "Data Science Intern",
    company: "DataDriven Co.",
    location: "San Francisco, CA",
    tags: ["Python", "Machine Learning"],
    match: "78% Match"
  }
];

const resumeFormSchema = z.object({
  resumeText: z.string().min(50, "Please paste your full resume.").max(5000),
  jobDescription: z.string().min(50, "Please paste the full job description.").max(5000),
});

export default function CareerLaunchpadPage() {
  const { toast } = useToast()
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisOutput | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const form = useForm<z.infer<typeof resumeFormSchema>>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: { resumeText: "", jobDescription: "" },
  })

  const handleResumeAnalysis = async (values: z.infer<typeof resumeFormSchema>) => {
    setIsAnalyzing(true)
    setAnalysisResult(null)
    try {
      const result = await analyzeResume(values)
      setAnalysisResult(result)
    } catch (error) {
      console.error("Failed to analyze resume", error)
      toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: "There was an error analyzing your resume. Please try again."
      })
    } finally {
      setIsAnalyzing(false)
    }
  }
  
  const resetAnalyzer = () => {
    form.reset();
    setAnalysisResult(null);
    setIsAnalysisOpen(false);
  }
  
  const handleMockInterview = () => {
    toast({
        title: "Mock Interview Feature",
        description: "This feature is under development. For now, we've opened the Resume Analyzer as a demo."
    });
    setIsAnalysisOpen(true);
  }

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <header className="mb-4">
        <h1 className="text-4xl font-bold font-headline">Career Launchpad</h1>
        <p className="text-muted-foreground">Your AI-powered toolkit for landing your dream internship or job.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card className="shadow-lg h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-headline"><Sparkles className="text-primary"/> Curated Opportunities</CardTitle>
                <CardDescription>Internships and jobs curated just for you based on your profile.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {jobOpportunities.map((job, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-bold text-lg">{job.title}</p>
                          <p className="text-sm text-muted-foreground">{job.company} - {job.location}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {job.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="text-sm font-bold mb-2" variant="outline">{job.match}</Badge>
                          <Button size="sm">View Details</Button>
                        </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Load More Opportunities</Button>
              </CardFooter>
            </Card>
        </div>
        
        <div className="space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-headline"><Briefcase /> Career Toolkit</CardTitle>
                <CardDescription>Utilize AI to sharpen your competitive edge.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4">
                <Dialog open={isAnalysisOpen} onOpenChange={setIsAnalysisOpen}>
                  <DialogTrigger asChild>
                    <div className={cn(
                        "w-full p-4 rounded-lg flex items-start gap-4 cursor-pointer transition-colors",
                        "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}>
                      <FileText className="mr-2 h-6 w-6 shrink-0 text-primary-foreground/80"/>
                      <div className="text-left">
                        <p className="font-bold text-base">Resume Analyzer</p>
                        <p className="font-normal text-sm text-primary-foreground/80">Get instant feedback on your resume.</p>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-headline">AI Resume Analyzer</DialogTitle>
                      <DialogDescription>
                        Paste your resume and a job description to get instant, tailored feedback.
                      </DialogDescription>
                    </DialogHeader>
                    
                    {!analysisResult && !isAnalyzing && (
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleResumeAnalysis)} className="space-y-4 flex-1 overflow-y-auto pr-4 mt-4">
                          <FormField
                            control={form.control}
                            name="resumeText"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Your Resume Text</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Paste your full resume text here..." {...field} rows={10} className="text-sm"/>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="jobDescription"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Target Job Description</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Paste the full job description here..." {...field} rows={10} className="text-sm"/>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                           <Button type="submit" size="lg" disabled={isAnalyzing}>
                            {isAnalyzing ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</>
                            ) : (
                                <><Sparkles className="mr-2 h-4 w-4" />Analyze Resume</>
                            )}
                          </Button>
                        </form>
                      </Form>
                    )}
                    
                    {isAnalyzing && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                          <h3 className="text-xl font-semibold font-headline">AI is on the case...</h3>
                          <p className="text-muted-foreground">Analyzing your documents, please wait.</p>
                        </div>
                    )}

                    {analysisResult && (
                      <div className="flex-1 overflow-y-auto space-y-6 pr-4 mt-4">
                          <Card>
                              <CardHeader>
                                  <CardTitle className="flex items-center gap-2 font-headline"><Target/> Overall Match Score</CardTitle>
                              </CardHeader>
                              <CardContent className="text-center space-y-2">
                                  <p className="text-6xl font-bold text-primary">{analysisResult.overallFitScore}%</p>
                                  <Progress value={analysisResult.overallFitScore} className="mt-2 h-3" />
                                  <CardDescription>Your resume's alignment with the job description.</CardDescription>
                              </CardContent>
                          </Card>

                          <div className="grid md:grid-cols-2 gap-4">
                             <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg"><CheckCircle className="text-green-500"/> Strengths</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc pl-5 space-y-2 text-sm">
                                        {analysisResult.strengths.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg"><XCircle className="text-red-500"/> Areas for Improvement</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc pl-5 space-y-2 text-sm">
                                        {analysisResult.areasForImprovement.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </CardContent>
                            </Card>
                          </div>

                           <Card>
                              <CardHeader>
                                  <CardTitle className="flex items-center gap-2 text-lg"><Lightbulb className="text-yellow-500"/> Suggested Keywords</CardTitle>
                              </CardHeader>
                              <CardContent className="flex flex-wrap gap-2">
                                  {analysisResult.suggestedKeywords.map((keyword, i) => (
                                      <Badge key={i} variant="secondary">{keyword}</Badge>
                                  ))}
                              </CardContent>
                          </Card>
                          <Button onClick={resetAnalyzer} variant="outline">Analyze Another</Button>
                      </div>
                    )}

                  </DialogContent>
                </Dialog>
                 <div
                    onClick={handleMockInterview}
                    className={cn(
                        "w-full p-4 rounded-lg flex items-start gap-4 cursor-pointer transition-colors",
                        "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Mic className="mr-2 h-6 w-6 shrink-0 text-primary"/>
                    <div className="text-left">
                        <p className="font-bold text-base">Mock Interview</p>
                        <p className="font-normal text-sm text-muted-foreground">Practice with an AI interviewer.</p>
                    </div>
                 </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
